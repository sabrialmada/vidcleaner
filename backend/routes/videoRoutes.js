
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


/* const express = require('express');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;
const multer = require('multer');
const archiver = require('archiver');
const { processVideo, safeDelete } = require('../videoProcessor');

const router = express.Router();

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
        if (err.code === 'ECONNABORTED') {
          console.log('Client disconnected before download completed');
        } else {
          console.error('Error sending the zip file:', err);
        }
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

module.exports = router; */

/* const express = require('express');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;
const multer = require('multer');
const archiver = require('archiver');
const { processVideo, safeDelete } = require('../videoProcessor');

const router = express.Router();
const uploadsDir = path.join(__dirname, '../uploads');

const upload = multer({ 
  dest: uploadsDir,
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

    const totalSize = videoFiles.reduce((acc, file) => acc + file.size, 0);
    if (totalSize > 300 * 1024 * 1024) { // 300MB total limit
      return res.status(400).json({ message: 'Total file size exceeds 300MB limit' });
    }

    for (const videoFile of videoFiles) {
      const inputFilePath = path.join(uploadsDir, videoFile.filename);
      const outputFilePath = path.join(uploadsDir, `processed_${videoFile.filename}.mp4`);

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

    const zipFilePath = path.join(uploadsDir, `processed_videos_${Date.now()}.zip`);
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
        if (err.code === 'ECONNABORTED') {
          console.log('Client disconnected before download completed');
        } else {
          console.error('Error sending the zip file:', err);
        }
      }
      await cleanupFiles(filesToCleanup);
    });

    // Handle client disconnection
    req.on('close', async () => {
      console.log('Client connection closed');
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
    try {
      await safeDelete(file);
    } catch (error) {
      console.error(`Error deleting file ${file}:`, error);
    }
  }
}

module.exports = router; */


const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const multer = require('multer');
const { videoQueue } = require('../queue');
const archiver = require('archiver');
const jobStateManager = require('../jobStateManager');


const router = express.Router();
const uploadsDir = path.join(__dirname, '../uploads');

// Ensure uploads directory exists
fs.mkdir(uploadsDir, { recursive: true }).catch(err => {
  console.error('Error creating uploads directory:', err);
});

const upload = multer({ 
  dest: uploadsDir,
  limits: { 
    fileSize: 300 * 1024 * 1024,
    fieldSize: 300 * 1024 * 1024 
  }
});

// Helper function to manage video processing jobs
const createVideoProcessingJob = async (videoFile) => {
  const inputFilePath = path.join(uploadsDir, videoFile.filename);
  const outputFilePath = path.join(uploadsDir, `processed_${videoFile.filename}.mp4`);

  try {
    const job = await videoQueue.add({
      inputPath: inputFilePath,
      outputPath: outputFilePath,
      originalName: videoFile.originalname
    }, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000
      },
      timeout: 1800000, // 30 minutes
      removeOnComplete: false,
      removeOnFail: false
    });

    return {
      jobId: job.id,
      originalName: videoFile.originalname,
      inputPath: inputFilePath,
      outputPath: outputFilePath
    };
  } catch (error) {
    console.error('Error creating job:', error);
    throw error;
  }
};

router.post('/cancel-jobs', async (req, res) => {
  try {
    const { jobIds } = req.body;
    if (!jobIds || !Array.isArray(jobIds)) {
      return res.status(400).json({ message: 'Invalid job IDs' });
    }

    console.log(`Cancelling jobs: ${jobIds.join(', ')}`);
    
    // Mark all jobs for cancellation first
    jobIds.forEach(jobId => {
      jobStateManager.markJobCancelled(jobId);
    });
    
    const results = await Promise.allSettled(jobIds.map(async (jobId) => {
      const job = await videoQueue.getJob(jobId);
      if (job) {
        const state = await job.getState();
        
        // If job is active, mark it for cancellation first
        if (state === 'active') {
          await job.update({ cancelRequested: true });
          // Wait a moment for the job to respond to cancellation
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Check if job can be removed
        try {
          // Clean up files first
          const inputPath = job.data.inputPath;
          const outputPath = job.returnvalue?.outputPath;

          if (inputPath) await fs.unlink(inputPath).catch(() => {});
          if (outputPath) await fs.unlink(outputPath).catch(() => {});

          // Then remove the job
          await job.remove();
          console.log(`Job ${jobId} removed from queue`);
          return { jobId, status: 'removed' };
        } catch (error) {
          console.error(`Error removing job ${jobId}:`, error);
          return { jobId, status: 'error', error: error.message };
        }
      }
      return { jobId, status: 'not_found' };
    }));

    const failedJobs = results
      .filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && r.value.status === 'error'))
      .map(r => r.value?.jobId || r.reason);

    if (failedJobs.length > 0) {
      console.error('Some jobs failed to cancel:', failedJobs);
      res.status(207).json({
        message: 'Some jobs failed to cancel',
        results: results.map(r => r.value || { status: 'error', error: r.reason })
      });
    } else {
      res.json({ message: 'Jobs cancelled successfully' });
    }
  } catch (error) {
    console.error('Error cancelling jobs:', error);
    res.status(500).json({ message: 'Error cancelling jobs', error: error.message });
  }
});

router.post('/process-videos', upload.array('videos', 10), async (req, res) => {
  try {
    const videoFiles = req.files;
    if (!videoFiles?.length) {
      return res.status(400).json({ message: 'No video files uploaded' });
    }

    const totalSize = videoFiles.reduce((acc, file) => acc + file.size, 0);
    if (totalSize > 300 * 1024 * 1024) {
      return res.status(400).json({ message: 'Total file size exceeds 300MB limit' });
    }

    // Create jobs for all videos
    const jobPromises = videoFiles.map(file => createVideoProcessingJob(file));
    const jobs = await Promise.all(jobPromises);

    res.status(202).json({
      message: 'Video processing jobs queued',
      jobs: jobs.map(({ jobId, originalName }) => ({ jobId, originalName }))
    });
  } catch (error) {
    console.error('Error processing videos:', error);
    res.status(500).json({ message: 'Error processing videos', error: error.message });
  }
});

router.get('/job-status', async (req, res) => {
  try {
    if (!req.query.jobIds) {
      return res.status(400).json({ message: 'No job IDs provided' });
    }

    const jobIds = req.query.jobIds.split(',');
    const statuses = await Promise.all(jobIds.map(async (jobId) => {
      const job = await videoQueue.getJob(jobId);
      if (!job) return { jobId, status: 'not_found', progress: 0 };
      
      const state = await job.getState();
      return {
        jobId,
        originalName: job.data.originalName,
        status: state,
        progress: job._progress || 0,
        error: job.failedReason
      };
    }));

    const allCompleted = statuses.every(s => s.status === 'completed');
    const anyFailed = statuses.some(s => s.status === 'failed');

    res.json({
      statuses,
      allCompleted,
      anyFailed,
      overallProgress: statuses.reduce((acc, s) => acc + s.progress, 0) / statuses.length
    });
  } catch (error) {
    console.error('Error checking job status:', error);
    res.status(500).json({ message: 'Error checking job status', error: error.message });
  }
});

router.get('/download-processed', async (req, res) => {
  if (!req.query.jobIds) {
    return res.status(400).json({ message: 'No job IDs provided' });
  }

  const jobIds = req.query.jobIds.split(',');
  const jobs = await Promise.all(jobIds.map(id => videoQueue.getJob(id)));
  const validJobs = jobs.filter(job => job != null);

  if (validJobs.length === 0) {
    return res.status(404).json({ message: 'No valid jobs found' });
  }

  try {
    // Check if all jobs are complete
    const jobStates = await Promise.all(validJobs.map(job => job.getState()));
    if (!jobStates.every(state => state === 'completed')) {
      return res.status(400).json({ message: 'Not all videos are processed yet' });
    }

    // Create zip archive
    const archive = archiver('zip', { zlib: { level: 5 } });
    res.attachment('processed_videos.zip');
    archive.pipe(res);

    // Add processed videos to zip
    for (const job of validJobs) {
      const outputPath = job.returnvalue?.outputPath;
      const originalName = job.data.originalName;
      if (outputPath) {
        try {
          await fs.access(outputPath);
          archive.file(outputPath, { name: `processed_${originalName}` });
        } catch (error) {
          console.error(`File not found: ${outputPath}`);
        }
      }
    }

    // Handle archive events
    archive.on('error', err => {
      console.error('Archive error:', err);
      res.status(500).end();
    });

    archive.on('end', () => {
      console.log('Archive completed');
    });

    // Finalize the archive
    await archive.finalize();

    // Clean up files after successful download
    for (const job of validJobs) {
      try {
        const { inputPath } = job.data;
        const { outputPath } = job.returnvalue || {};

        if (outputPath) await fs.unlink(outputPath).catch(() => {});
        if (inputPath) await fs.unlink(inputPath).catch(() => {});

        // Remove the job from the queue
        await job.remove();
      } catch (error) {
        console.error(`Error cleaning up job ${job.id}:`, error);
      }
    }
  } catch (error) {
    console.error('Error processing download:', error);
    res.status(500).json({ message: 'Error processing download', error: error.message });
  }
});

module.exports = router;