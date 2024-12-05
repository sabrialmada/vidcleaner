
const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const multer = require('multer');
const { videoQueue } = require('../queue');
const archiver = require('archiver');
const jobStateManager = require('../jobStateManager');


const router = express.Router();
const uploadsDir = path.join(__dirname, '../uploads');

// ensure uploads directory exists
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

// manage video processing jobs
const createVideoProcessingJob = async (videoFile, copyNumber) => {
  const inputFilePath = path.join(uploadsDir, videoFile.filename);
  const outputFilePath = path.join(
    uploadsDir,
    `processed_${videoFile.filename}_copy${copyNumber}.mp4`
  );

  try {
    const job = await videoQueue.add({
      inputPath: inputFilePath,
      outputPath: outputFilePath,
      originalName: videoFile.originalname,
      copyNumber: copyNumber
    }, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000
      },
      timeout: 1800000,
      removeOnComplete: false,
      removeOnFail: false
    });

    return {
      jobId: job.id,
      originalName: videoFile.originalname,
      copyNumber: copyNumber,
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

    // mark all jobs for cancellation first
    jobIds.forEach(jobId => {
      jobStateManager.markJobCancelled(jobId);
    });

    const results = await Promise.allSettled(jobIds.map(async (jobId) => {
      const job = await videoQueue.getJob(jobId);
      if (job) {
        const state = await job.getState();

        // if job is active, mark it for cancellation first
        if (state === 'active') {
          await job.update({ cancelRequested: true });
          // wait a moment for the job to respond to cancellation
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // check if job can be removed
        try {
          // clean up files first
          const inputPath = job.data.inputPath;
          const outputPath = job.returnvalue?.outputPath;

          if (inputPath) await fs.unlink(inputPath).catch(() => { });
          if (outputPath) await fs.unlink(outputPath).catch(() => { });

          // remove the job
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
    const copies = parseInt(req.body.copies) || 1;

    if (!videoFiles?.length) {
      return res.status(400).json({ message: 'No video files uploaded' });
    }

    if (copies < 1 || copies > 10) {
      return res.status(400).json({ message: 'Copies must be between 1 and 10' });
    }

    const totalSize = videoFiles.reduce((acc, file) => acc + file.size, 0);
    if (totalSize > 300 * 1024 * 1024) {
      return res.status(400).json({ message: 'Total file size exceeds 300MB limit' });
    }

    // create jobs for all videos and their copies
    const allJobPromises = videoFiles.flatMap(file =>
      Array(copies).fill().map((_, index) =>
        createVideoProcessingJob(file, index + 1)
      )
    );

    const jobs = await Promise.all(allJobPromises);

    res.status(202).json({
      message: 'Video processing jobs queued',
      jobs: jobs.map(({ jobId, originalName, copyNumber }) => ({
        jobId,
        originalName,
        copyNumber
      }))
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
    // check if all jobs are complete
    const jobStates = await Promise.all(validJobs.map(job => job.getState()));
    if (!jobStates.every(state => state === 'completed')) {
      return res.status(400).json({ message: 'Not all videos are processed yet' });
    }

    // create zip archive
    const archive = archiver('zip', { zlib: { level: 5 } });
    res.attachment('processed_videos.zip');
    archive.pipe(res);

    // add processed videos to zip with proper naming
    for (const job of validJobs) {
      const outputPath = job.returnvalue?.outputPath;
      const originalName = job.data.originalName;
      const copyNumber = job.data.copyNumber || 1;

      if (outputPath) {
        try {
          await fs.access(outputPath);
          // include copy number in the filename
          const fileExtension = path.extname(originalName);
          const fileName = path.basename(originalName, fileExtension);
          const processedName = `processed_${fileName}_copy${copyNumber}${fileExtension}`;

          archive.file(outputPath, { name: processedName });
        } catch (error) {
          console.error(`File not found: ${outputPath}`);
        }
      }
    }

    // handle archive events
    archive.on('error', err => {
      console.error('Archive error:', err);
      res.status(500).end();
    });

    archive.on('end', () => {
      console.log('Archive completed');
    });

    // finalize the archive
    await archive.finalize();

    // clean up files after successful download
    for (const job of validJobs) {
      try {
        const { inputPath } = job.data;
        const { outputPath } = job.returnvalue || {};

        if (outputPath) await fs.unlink(outputPath).catch(() => { });
        if (inputPath) await fs.unlink(inputPath).catch(() => { });

        // remove the job from the queue
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