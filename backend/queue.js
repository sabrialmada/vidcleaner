const Queue = require('bull');

if (!process.env.REDIS_URL) {
  console.error('REDIS_URL is not defined');
  process.exit(1);
}

// Parse Redis URL to extract components
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

// Separate Redis client options from Queue options
const redisClientConfig = {
  port: redisConfig.port,
  host: redisConfig.host,
  password: redisConfig.password,
  tls: process.env.NODE_ENV === 'production' ? redisConfig.tls : undefined,
  maxRetriesPerRequest: 3,
  retryStrategy: function(times) {
    const delay = Math.min(times * 50, 2000);
    console.log(`Retrying Redis connection in ${delay}ms...`);
    return delay;
  },
  connectTimeout: 30000,
  keepAlive: 30000
};

const handleJobRemoval = async (job) => {
    console.log(`Job ${job.id} was removed`);
    try {
      const inputPath = job.data.inputPath;
      const outputPath = job.returnvalue?.outputPath;
  
      if (inputPath) await fs.unlink(inputPath).catch(() => {});
      if (outputPath) await fs.unlink(outputPath).catch(() => {});
    } catch (error) {
      console.error(`Error cleaning up files for job ${job.id}:`, error);
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

// Create the queue with the correct configuration
const videoQueue = new Queue('video-processing', process.env.REDIS_URL, queueOptions);

// Enhanced error handling and logging
videoQueue.on('removed', handleJobRemoval);

videoQueue.on('error', (error) => {
  console.error('Queue Error:', error);
});

videoQueue.on('failed', async (job, error) => {
    console.error(`Job ${job.id} failed with error:`, error);
    console.error('Job data:', job.data);
    
    if (job.attemptsMade >= job.opts.attempts) {
      console.error(`Job ${job.id} has failed all ${job.opts.attempts} attempts`);
      await handleJobRemoval(job);
    }
  });

videoQueue.on('stalled', (job) => {
  console.warn(`Job ${job.id} has stalled`);
});

videoQueue.on('completed', (job, result) => {
  console.log(`Job ${job.id} completed with result:`, result);
});

videoQueue.on('waiting', (jobId) => {
  console.log(`Job ${jobId} is waiting`);
});

videoQueue.on('active', (job) => {
  console.log(`Job ${job.id} has started processing`);
});

// Cleanup function for abandoned jobs with improved error handling
async function cleanupStalledJobs() {
    try {
      const jobTypes = ['failed', 'stalled', 'delayed', 'active'];
      const jobs = await Promise.all(jobTypes.map(type => videoQueue.getJobs([type])));
      const allJobs = jobs.flat();
      
      console.log(`Found ${allJobs.length} jobs to check for cleanup`);
      
      const now = Date.now();
      for (const job of allJobs) {
        try {
          const state = await job.getState();
          const jobAge = now - job.timestamp;
          
          // Clean up jobs that are too old or in bad states
          if (jobAge > 3600000 || ['failed', 'stalled'].includes(state)) {
            console.log(`Cleaning up ${state} job ${job.id} (age: ${jobAge}ms)`);
            await handleJobRemoval(job);
            await job.remove();
          }
        } catch (error) {
          console.error(`Error processing job ${job.id}:`, error);
        }
      }
    } catch (error) {
      console.error('Error in cleanup process:', error);
    }
}

// Run cleanup every hour
const CLEANUP_INTERVAL = 3600000; // 1 hour
setInterval(cleanupStalledJobs, CLEANUP_INTERVAL);

// Initial cleanup on startup
cleanupStalledJobs().catch(error => {
  console.error('Initial cleanup failed:', error);
});

module.exports = { videoQueue };