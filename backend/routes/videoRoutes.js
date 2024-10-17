
/* //FUNCIONA PERO VIDEOS SE DESCARGAN EN CODIGO

// videoRoutes.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { processVideo } = require('../videoProcessor'); // Adjust the path if needed

const router = express.Router();

// Multer setup for file uploads (temporary storage for uploaded files)
const upload = multer({ dest: 'uploads/' });

// API for video processing
router.post('/process-videos', upload.array('videos', 10), async (req, res) => {
  try {
    const videoFiles = req.files;
    if (!videoFiles || videoFiles.length === 0) {
      return res.status(400).json({ message: 'No video files uploaded' });
    }

    // Process each video file
    for (const videoFile of videoFiles) {
      const inputFilePath = path.join(__dirname, '../', videoFile.path);
      const outputFilePath = path.join(__dirname, '../', `processed_${videoFile.originalname}`);

      // Process the video
      await processVideo(inputFilePath, outputFilePath);

      // Immediately send the file to the client and delete it
      res.sendFile(outputFilePath, {}, function (err) {
        if (err) {
          console.error('Error sending the file:', err);
        } else {
          console.log('File sent:', outputFilePath);
          // Delete the processed file after sending
          fs.unlinkSync(outputFilePath);
        }
        // Clean up the original upload
        fs.unlinkSync(inputFilePath);
      });
      return; // End the loop after sending the file
    }
  } catch (error) {
    console.error('Error processing videos:', error);
    res.status(500).json({ message: 'Video processing failed' });
    // Cleanup any remaining files on error
    req.files.forEach(file => fs.unlinkSync(path.join(__dirname, '../', file.path)));
  }
});

module.exports = router;
 */

/* const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const archiver = require('archiver');
const { processVideo } = require('../videoProcessor');

const router = express.Router();

// Multer setup for file uploads (temporary storage for uploaded files)
const upload = multer({ dest: 'uploads/' });

// API for video processing
router.post('/process-videos', upload.array('videos', 10), async (req, res) => {
  try {
    const videoFiles = req.files;
    if (!videoFiles || videoFiles.length === 0) {
      return res.status(400).json({ message: 'No video files uploaded' });
    }

    const processedFiles = [];

    // Process each video file
    for (const videoFile of videoFiles) {
      const inputFilePath = path.join(__dirname, '../uploads', videoFile.filename);
      const outputFilePath = path.join(__dirname, '../uploads', `processed_${videoFile.filename}.mp4`);

      // Process the video
      await processVideo(inputFilePath, outputFilePath);

      // Add the processed file to the list
      processedFiles.push({ path: outputFilePath, name: `processed_${videoFile.originalname}` });

      // Clean up the original uploaded file
      fs.unlinkSync(inputFilePath);
    }

    // Now, create a zip archive for the processed videos
    const zipFilePath = path.join(__dirname, '../uploads', `processed_videos_${Date.now()}.zip`);
    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.pipe(output);

    // Add processed files to the zip
    processedFiles.forEach(file => {
      if (fs.existsSync(file.path)) {
        archive.file(file.path, { name: file.name });
      }
    });

    await archive.finalize();

    output.on('close', () => {
      res.download(zipFilePath, 'processed_videos.zip', (err) => {
        if (err) {
          console.error('Error sending the zip file:', err);
        }

        // Cleanup after sending the file
        fs.unlinkSync(zipFilePath);
        processedFiles.forEach(file => fs.unlinkSync(file.path)); // Remove processed files
      });
    });

    output.on('error', (err) => {
      console.error('Error with zip file creation:', err);
      res.status(500).json({ message: 'Error creating zip file' });
    });
    
  } catch (error) {
    console.error('Error processing videos:', error);
    res.status(500).json({ message: 'Video processing failed' });

    // Cleanup any remaining files on error
    req.files.forEach(file => fs.unlinkSync(path.join(__dirname, '../uploads', file.filename)));
  }
});

module.exports = router;
 */


const express = require('express');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;
const multer = require('multer');
const archiver = require('archiver');
const { processVideo, safeDelete } = require('../videoProcessor');

const router = express.Router();

/* const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
}); */

const upload = multer({ 
  dest: 'uploads/',
  limits: { 
    fileSize: 300 * 1024 * 1024, // 300MB limit per file
    fieldSize: 300 * 1024 * 1024 // 300MB limit for the entire request
  }
});

router.post('/process-videos', upload.array('videos', 10), async (req, res) => {
  const processedFiles = [];
  const filesToCleanup = [];
  const errors = [];

  try {
    const videoFiles = req.files;
    if (!videoFiles || videoFiles.length === 0) {
      return res.status(400).json({ message: 'No video files uploaded' });
    }

    // Check total file size
    const totalSize = videoFiles.reduce((acc, file) => acc + file.size, 0);
    if (totalSize > 300 * 1024 * 1024) { // 300MB total limit
      return res.status(400).json({ message: 'Total file size exceeds 300MB limit' });
    }

    for (const videoFile of videoFiles) {
      const inputFilePath = path.join(__dirname, '../uploads', videoFile.filename);
      const outputFilePath = path.join(__dirname, '../uploads', `processed_${videoFile.filename}.mp4`);

      filesToCleanup.push(inputFilePath, outputFilePath);

      try {
        const md5Hash = await processVideo(inputFilePath, outputFilePath);
        processedFiles.push({ 
          path: outputFilePath, 
          name: `processed_${videoFile.originalname}`,
          md5Hash
        });
        await safeDelete(inputFilePath);
      } catch (error) {
        console.error(`Error processing ${videoFile.originalname}:`, error);
        errors.push(`Failed to process ${videoFile.originalname}: ${error.message}`);
      }
    }

    if (processedFiles.length === 0) {
      throw new Error('No videos were successfully processed');
    }

    const zipFilePath = path.join(__dirname, '../uploads', `processed_videos_${Date.now()}.zip`);
    filesToCleanup.push(zipFilePath);

    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.pipe(output);

    for (const file of processedFiles) {
      try {
        await fsPromises.access(file.path, fs.constants.R_OK);
        archive.file(file.path, { name: file.name });
      } catch (error) {
        console.error(`Error accessing file ${file.path}:`, error);
        errors.push(`Failed to add ${file.name} to zip: ${error.message}`);
      }
    }

    await archive.finalize();

    await new Promise((resolve, reject) => {
      output.on('close', resolve);
      output.on('error', reject);
    });

    res.download(zipFilePath, 'processed_videos.zip', async (err) => {
      if (err) {
        console.error('Error sending the zip file:', err);
      }
      await cleanupFiles(filesToCleanup);
    });

    if (errors.length > 0) {
      console.warn('Some errors occurred during processing:', errors);
    }

  } catch (error) {
    console.error('Error processing videos:', error);
    res.status(500).json({ 
      message: 'Video processing failed', 
      error: error.message,
      details: errors
    });
    await cleanupFiles(filesToCleanup);
  }
});

async function cleanupFiles(files) {
  for (const file of files) {
    await safeDelete(file);
  }
}

module.exports = router;