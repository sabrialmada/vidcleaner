// test.js
console.log('Testing environment and dependencies...');

const dependencies = [
  'express',
  'node-cron',
  'bull',
  'ioredis',
  'fluent-ffmpeg',
  'multer',
  'cors',
  'helmet',
  'compression',
  'express-rate-limit',
  'morgan',
  'mongoose',
  'archiver',
  'dotenv'
];

dependencies.forEach(dep => {
  try {
    require(dep);
    console.log(`✅ ${dep} loaded successfully`);
  } catch (error) {
    console.error(`❌ Error loading ${dep}:`, error.message);
  }
});

// Test file system access
const fs = require('fs');
try {
  fs.accessSync('/usr/src/app/uploads');
  console.log('✅ Uploads directory is accessible');
} catch (error) {
  console.error('❌ Error accessing uploads directory:', error.message);
}

// Print environment variables (excluding sensitive data)
console.log('\nEnvironment Variables:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Has REDIS_URL:', !!process.env.REDIS_URL);
console.log('Has MONGODB_URI:', !!process.env.MONGODB_URI);