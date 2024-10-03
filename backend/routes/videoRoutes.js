
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

const express = require('express');
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
