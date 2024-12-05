const Queue = require('bull');
const fs = require('fs').promises;
const jobStateManager = require('./jobStateManager');
const { processVideo, safeDelete } = require('./videoProcessor');

if (!process.env.REDIS_URL) {
  console.error('REDIS_URL is not defined');
  process.exit(1);
}

// redis configuration 
const parseRedisUrl = (url) => {
  try {
    const parsedUrl = new URL(url);
    return {
      host: parsedUrl.hostname,
      port: parsedUrl.port,
      password: parsedUrl.password,
      tls: parsedUrl.protocol === 'rediss:' ? { rejectUnauthorized: false } : undefined
    };
  } catch (error) {
    console.error('Error parsing Redis URL:', error);
    throw error;
  }
};

const redisConfig = parseRedisUrl(process.env.REDIS_URL);

const redisClientConfig = {
  port: redisConfig.port,
  host: redisConfig.host,
  password: redisConfig.password,
  tls: process.env.NODE_ENV === 'production' ? redisConfig.tls : undefined,
  retryStrategy: function (times) {
    const delay = Math.min(times * 50, 2000);
    console.log(`Retrying Redis connection in ${delay}ms...`);
    return delay;
  },
  connectTimeout: 30000
};

// file cleanup 
const handleJobCleanup = async (job) => {
  console.log(`Cleaning up job ${job.id}...`);
  try {
    const inputPath = job.data.inputPath;
    const outputPath = job.returnvalue?.outputPath;
    const tempFiles = job.data.tempFiles || [];

    // clean up all files
    const filesToDelete = [
      inputPath,
      outputPath,
      ...tempFiles
    ].filter(Boolean);

    await Promise.all(filesToDelete.map(async (filePath) => {
      try {
        await safeDelete(filePath);
        console.log(`Deleted file: ${filePath}`);
      } catch (error) {
        if (error.code !== 'ENOENT') {
          console.error(`Error deleting file ${filePath}:`, error);
        }
      }
    }));
  } catch (error) {
    console.error(`Error during job cleanup for job ${job.id}:`, error);
  }
};

const queueOptions = {
  redis: redisClientConfig,
  prefix: 'bull',
  limiter: {
    max: 3,
    duration: 1000
  },
  settings: {
    lockDuration: 300000,
    stalledInterval: 30000,
    maxStalledCount: 2,
    lockRenewTime: 15000,
    drainDelay: 300
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000
    },
    removeOnComplete: {
      age: 3600,
      count: 100
    },
    removeOnFail: true,
    timeout: 1800000
  }
};

console.log('Initializing queue with Redis config:', {
  host: redisConfig.host,
  port: redisConfig.port,
  tls: redisConfig.tls ? 'enabled' : 'disabled'
});

const videoQueue = new Queue('video-processing', process.env.REDIS_URL, queueOptions);

// job processing
videoQueue.process(async (job) => {
  const { inputPath, outputPath } = job.data;
  let progressInterval;
  let timeoutTimer;

  try {
    jobStateManager.markJobActive(job.id);

    if (jobStateManager.isJobCancelled(job.id)) {
      throw new Error('Job cancelled before start');
    }

    job.progress(0);
    console.log(`Starting job ${job.id} for input: ${inputPath}`);

    const result = await new Promise((resolve, reject) => {
      timeoutTimer = setTimeout(() => {
        jobStateManager.markJobCancelled(job.id);
        reject(new Error('Job timed out after 30 minutes'));
      }, 30 * 60 * 1000);

      progressInterval = setInterval(async () => {
        try {
          if (jobStateManager.isJobCancelled(job.id)) {
            clearInterval(progressInterval);
            clearTimeout(timeoutTimer);
            reject(new Error('Job cancelled during processing'));
            return;
          }
          const currentProgress = job.progress() || 0;
          job.progress(Math.min(currentProgress + 5, 90));
        } catch (error) {
          console.error('Error updating progress:', error);
        }
      }, 2000);

      processVideo(inputPath, outputPath, job)
        .then(resolve)
        .catch(reject)
        .finally(() => {
          clearInterval(progressInterval);
          clearTimeout(timeoutTimer);
        });
    });

    if (jobStateManager.isJobCancelled(job.id)) {
      throw new Error('Job cancelled before completion');
    }

    job.progress(100);
    return { outputPath };
  } catch (error) {
    console.error(`Error processing job ${job.id}:`, error);
    await handleJobCleanup(job).catch(cleanupError =>
      console.error(`Cleanup error for job ${job.id}:`, cleanupError)
    );
    throw error;
  } finally {
    if (progressInterval) clearInterval(progressInterval);
    if (timeoutTimer) clearTimeout(timeoutTimer);
    jobStateManager.removeJob(job.id);
  }
});

// event handlers
videoQueue.on('error', (error) => {
  console.error('Queue Error:', error);
});

videoQueue.on('failed', async (job, error) => {
  console.error(`Job ${job.id} failed with error:`, error);
  console.error('Job data:', job.data);
  try {
    jobStateManager.markJobCancelled(job.id);
    await handleJobCleanup(job);
  } catch (cleanupError) {
    console.error(`Failed to clean up job ${job.id}:`, cleanupError);
  }
});

videoQueue.on('removed', async (job) => {
  console.log(`Job ${job.id} was removed`);
  try {
    jobStateManager.markJobCancelled(job.id);
    await handleJobCleanup(job);
  } catch (cleanupError) {
    console.error(`Failed to clean up removed job ${job.id}:`, cleanupError);
  }
});

videoQueue.on('completed', async (job, result) => {
  console.log(`Job ${job.id} completed with result:`, result);
  jobStateManager.removeJob(job.id);
});

videoQueue.on('stalled', async (job) => {
  console.warn(`Job ${job.id} has stalled`);
  try {
    jobStateManager.markJobCancelled(job.id);
    await handleJobCleanup(job);
    await job.remove();
  } catch (error) {
    console.error(`Error handling stalled job ${job.id}:`, error);
  }
});

videoQueue.on('waiting', (jobId) => {
  console.log(`Job ${jobId} is waiting`);
});

videoQueue.on('active', (job) => {
  console.log(`Job ${job.id} has started processing`);
  jobStateManager.markJobActive(job.id);
});

// shutdown
process.on('SIGTERM', async () => {
  try {
    const activeJobs = await videoQueue.getActive();
    console.log(`Cleaning up ${activeJobs.length} active jobs...`);

    await Promise.all(activeJobs.map(async (job) => {
      try {
        jobStateManager.markJobCancelled(job.id);
        await handleJobCleanup(job);
        await job.remove();
      } catch (error) {
        console.error(`Error cleaning up job ${job.id} during shutdown:`, error);
      }
    }));

    await videoQueue.close();
    console.log('Queue shut down gracefully');
  } catch (error) {
    console.error('Error during queue shutdown:', error);
  }
});

module.exports = { videoQueue };