/* const Queue = require('bull');

// Create Bull queue for video processing
const videoQueue = new Queue('video processing', process.env.REDIS_URL);

module.exports = { videoQueue };
 */

const Queue = require('bull');

if (!process.env.REDIS_URL) {
  console.error('REDIS_URL is not defined in environment variables');
  process.exit(1);
}

console.log('Initializing video queue with Redis URL:', process.env.REDIS_URL.slice(0, 8) + '...');

const videoQueue = new Queue('video-processing', {
  redis: process.env.REDIS_URL,
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: false
  },
  settings: {
    lockDuration: 30000,
    stalledInterval: 30000,
  }
});

videoQueue.on('error', (error) => {
  console.error('Queue Error:', error);
});

videoQueue.on('failed', (job, error) => {
  console.error(`Job ${job.id} failed with error:`, error);
});

videoQueue.on('stalled', (job) => {
  console.warn(`Job ${job.id} has stalled`);
});

// Test the connection
videoQueue.client.ping().then(() => {
  console.log('Successfully connected to Redis through Bull queue');
}).catch((error) => {
  console.error('Failed to ping Redis through Bull queue:', error);
});

module.exports = { videoQueue };