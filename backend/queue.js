const Queue = require('bull');

// Construct Redis URL using the public networking address
const REDIS_URL = 'redis://default:ktGUarMrJSVqZSkZqgSdhkbejWQEmFpp@autorack.proxy.rlwy.net:38340';

console.log('Initializing queue with Redis connection');

const queueOptions = {
  redis: {
    port: 38340,
    host: 'autorack.proxy.rlwy.net',
    retryStrategy: function(times) {
      const delay = Math.min(times * 50, 2000);
      console.log(`Retrying Redis connection in ${delay}ms...`);
      return delay;
    },
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
    connectTimeout: 30000,
  }
};

const videoQueue = new Queue('video-processing', REDIS_URL, queueOptions);

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