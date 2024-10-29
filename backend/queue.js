const Queue = require('bull');
const fs = require('fs').promises;

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

// Simplified Redis client config - removed problematic options
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

// Enhanced job cleanup handler
const handleJobCleanup = async (job) => {
  console.log(`Cleaning up job ${job.id}...`);
  try {
    const inputPath = job.data.inputPath;
    const outputPath = job.returnvalue?.outputPath;
    const tempFiles = job.data.tempFiles || [];

    // Clean up all associated files
    const filesToDelete = [
      inputPath,
      outputPath,
      ...tempFiles
    ].filter(Boolean);

    await Promise.all(filesToDelete.map(async (filePath) => {
      try {
        await fs.access(filePath);
        await fs.unlink(filePath);
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

videoQueue.on('error', (error) => {
  console.error('Queue Error:', error);
});

videoQueue.on('failed', async (job, error) => {
  console.error(`Job ${job.id} failed with error:`, error);
  console.error('Job data:', job.data);
  
  if (job.attemptsMade >= job.opts.attempts) {
    console.error(`Job ${job.id} has failed all ${job.opts.attempts} attempts`);
    await handleJobCleanup(job);
  }
});

videoQueue.on('removed', async (job) => {
  console.log(`Job ${job.id} was removed`);
  await handleJobCleanup(job);
});

videoQueue.on('completed', async (job, result) => {
  console.log(`Job ${job.id} completed with result:`, result);
  if (job.data.cleanupOnComplete) {
    await handleJobCleanup(job);
  }
});

videoQueue.on('stalled', async (job) => {
  console.warn(`Job ${job.id} has stalled`);
  await handleJobCleanup(job);
  await job.remove();
});

videoQueue.on('waiting', (jobId) => {
  console.log(`Job ${jobId} is waiting`);
});

videoQueue.on('active', (job) => {
  console.log(`Job ${job.id} has started processing`);
});

// Enhanced cleanup function
async function cleanupStalledJobs() {
  try {
    const jobTypes = ['failed', 'stalled', 'delayed', 'active'];
    const jobs = await Promise.all(jobTypes.map(type => videoQueue.getJobs([type])));
    const allJobs = jobs.flat();
    
    console.log(`Found ${allJobs.length} jobs to check for cleanup`);
    
    const now = Date.now();
    await Promise.all(allJobs.map(async (job) => {
      try {
        const state = await job.getState();
        const jobAge = now - job.timestamp;
        
        if (jobAge > 3600000 || ['failed', 'stalled'].includes(state)) {
          console.log(`Cleaning up ${state} job ${job.id} (age: ${jobAge}ms)`);
          await handleJobCleanup(job);
          await job.remove();
        }
      } catch (error) {
        console.error(`Error processing job ${job.id}:`, error);
      }
    }));
  } catch (error) {
    console.error('Error in cleanup process:', error);
  }
}

// Run cleanup every hour
const CLEANUP_INTERVAL = 3600000;
setInterval(cleanupStalledJobs, CLEANUP_INTERVAL);

// Initial cleanup
cleanupStalledJobs().catch(error => {
  console.error('Initial cleanup failed:', error);
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