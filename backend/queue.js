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

const queueOptions = {
    redis: redisClientConfig,
    prefix: 'bull',
    limiter: {
      max: 3, // Increase concurrent processing limit to 3
      duration: 1000 // Reduce duration to 1 second
    },
    settings: {
      lockDuration: 300000, // 5 minutes
      stalledInterval: 30000,
      maxStalledCount: 2,
      lockRenewTime: 15000,
      drainDelay: 300 // Add small delay between processing jobs
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
      removeOnFail: false,
      timeout: 1800000 // 30 minutes
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
videoQueue.on('error', (error) => {
  console.error('Queue Error:', error);
});

videoQueue.on('failed', (job, error) => {
  console.error(`Job ${job.id} failed with error:`, error);
  console.error('Job data:', job.data);
  
  // Notify about repeated failures
  if (job.attemptsMade >= job.opts.attempts) {
    console.error(`Job ${job.id} has failed all ${job.opts.attempts} attempts`);
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
    const jobTypes = ['failed', 'stalled', 'delayed'];
    const jobs = await Promise.all(jobTypes.map(type => videoQueue.getJobs([type])));
    const allJobs = jobs.flat();
    
    console.log(`Found ${allJobs.length} jobs to check for cleanup`);
    
    for (const job of allJobs) {
      try {
        const state = await job.getState();
        const jobAge = Date.now() - job.timestamp;
        
        if ((state === 'failed' || state === 'stalled') && jobAge > 3600000) {
          console.log(`Cleaning up old ${state} job ${job.id}`);
          await job.remove();
          
          // Clean up any associated files
          if (job.data.inputPath) {
            try {
              const fs = require('fs').promises;
              await fs.unlink(job.data.inputPath);
              console.log(`Cleaned up input file for job ${job.id}`);
            } catch (fileError) {
              console.error(`Error cleaning up file for job ${job.id}:`, fileError);
            }
          }
        }
      } catch (jobError) {
        console.error(`Error processing job ${job.id}:`, jobError);
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