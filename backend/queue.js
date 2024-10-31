const Queue = require('bull');
const fs = require('fs').promises;
const jobStateManager = require('./jobStateManager');

if (!process.env.REDIS_URL) {
  console.error('REDIS_URL is not defined');
  process.exit(1);
}

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
  retryStrategy: function(times) {
    const delay = Math.min(times * 50, 2000);
    console.log(`Retrying Redis connection in ${delay}ms...`);
    return delay;
  },
  connectTimeout: 30000
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

// Job processing
videoQueue.process(async (job) => {
  const { inputPath, outputPath } = job.data;
  
  try {
    jobStateManager.markJobActive(job.id);
    
    if (jobStateManager.isJobCancelled(job.id)) {
      throw new Error('Job cancelled before start');
    }

    job.progress(0);
    console.log(`Starting job ${job.id} for input: ${inputPath}`);

    let progressInterval;
    let timeoutTimer;

    try {
      await new Promise((resolve, reject) => {
        timeoutTimer = setTimeout(() => {
          jobStateManager.markJobCancelled(job.id);
          reject(new Error('Job timed out after 30 minutes'));
        }, 30 * 60 * 1000);

        progressInterval = setInterval(async () => {
          if (jobStateManager.isJobCancelled(job.id)) {
            clearInterval(progressInterval);
            clearTimeout(timeoutTimer);
            reject(new Error('Job cancelled during processing'));
            return;
          }
          const currentProgress = job.progress() || 0;
          job.progress(Math.min(currentProgress + 5, 90));
        }, 2000);

        processVideo(inputPath, outputPath, job)
          .then(resolve)
          .catch(reject);
      });

      if (jobStateManager.isJobCancelled(job.id)) {
        throw new Error('Job cancelled before completion');
      }

      job.progress(100);
      return { outputPath };
    } finally {
      if (progressInterval) clearInterval(progressInterval);
      if (timeoutTimer) clearTimeout(timeoutTimer);
    }
  } catch (error) {
    console.error(`Error processing job ${job.id}:`, error);
    throw error;
  } finally {
    jobStateManager.removeJob(job.id);
  }
});

// Event handlers
videoQueue.on('error', (error) => {
  console.error('Queue Error:', error);
});

videoQueue.on('failed', async (job, error) => {
  console.error(`Job ${job.id} failed with error:`, error);
  console.error('Job data:', job.data);
  jobStateManager.markJobCancelled(job.id);
  await handleJobCleanup(job);
});

videoQueue.on('removed', async (job) => {
  console.log(`Job ${job.id} was removed`);
  jobStateManager.markJobCancelled(job.id);
  await handleJobCleanup(job);
});

videoQueue.on('completed', async (job, result) => {
  console.log(`Job ${job.id} completed with result:`, result);
  if (job.data.cleanupOnComplete) {
    await handleJobCleanup(job);
  }
  jobStateManager.removeJob(job.id);
});

videoQueue.on('stalled', async (job) => {
  console.warn(`Job ${job.id} has stalled`);
  jobStateManager.markJobCancelled(job.id);
  await handleJobCleanup(job);
  await job.remove();
});

videoQueue.on('waiting', (jobId) => {
  console.log(`Job ${jobId} is waiting`);
});

videoQueue.on('active', (job) => {
  console.log(`Job ${job.id} has started processing`);
  jobStateManager.markJobActive(job.id);
});

process.on('SIGTERM', async () => {
  try {
    await videoQueue.close();
    console.log('Queue shut down gracefully');
  } catch (error) {
    console.error('Error during queue shutdown:', error);
  }
});

module.exports = { videoQueue };