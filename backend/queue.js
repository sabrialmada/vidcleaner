/* const Queue = require('bull');

// Create Bull queue for video processing
const videoQueue = new Queue('video processing', process.env.REDIS_URL);

module.exports = { videoQueue };
 */

const Queue = require('bull');

// Redis connection options
const redisOptions = {
  redis: {
    port: process.env.REDIS_PORT || 6379,
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
    tls: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
    retryStrategy: function(times) {
      const delay = Math.min(times * 50, 2000);
      console.log(`Retrying Redis connection in ${delay}ms...`);
      return delay;
    }
  }
};

// Create Bull queue with options
const videoQueue = new Queue('video-processing', process.env.REDIS_URL, {
  ...redisOptions,
  limiter: {
    max: 1,
    duration: 5000
  }
});

// Add error handling for the queue
videoQueue.on('error', (error) => {
  console.error('Queue Error:', error);
});

videoQueue.on('failed', (job, error) => {
  console.error(`Job ${job.id} failed:`, error);
});

videoQueue.on('stalled', (job) => {
  console.warn(`Job ${job.id} has stalled`);
});

module.exports = { videoQueue };