const Queue = require('bull');

if (!process.env.REDIS_URL) {
  console.error('REDIS_URL is not defined');
  process.exit(1);
}

console.log('Initializing queue with Redis URL');

const queueOptions = {
  redis: {
    port: process.env.REDIS_PORT || 38340,
    host: process.env.REDIS_HOST || 'autorack.proxy.rlwy.net',
    retryStrategy: function(times) {
      const delay = Math.min(times * 50, 2000);
      console.log(`Retrying Redis connection in ${delay}ms...`);
      return delay;
    },
    tls: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined
  },
  limiter: {
    max: 1,
    duration: 5000
  },
  settings: {
    lockDuration: 30000,
    stalledInterval: 30000,
  }
};

const videoQueue = new Queue('video-processing', process.env.REDIS_URL, queueOptions);

videoQueue.on('error', (error) => {
  console.error('Queue Error:', error);
});

videoQueue.on('failed', (job, error) => {
  console.error(`Job ${job.id} failed with error:`, error);
});

videoQueue.on('stalled', (job) => {
  console.warn(`Job ${job.id} has stalled`);
});

module.exports = { videoQueue };