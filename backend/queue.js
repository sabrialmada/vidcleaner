const Queue = require('bull');

// Create Bull queue for video processing
const videoQueue = new Queue('video processing', process.env.REDIS_URL);

module.exports = { videoQueue };
