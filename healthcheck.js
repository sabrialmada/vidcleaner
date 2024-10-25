const fs = require('fs').promises;
const path = require('path');

async function runHealthCheck() {
    console.log('\n=== HEALTH CHECK STARTED ===\n');

    // 1. Check Environment Variables
    console.log('1. Environment Variables:');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('REDIS_URL exists:', !!process.env.REDIS_URL);
    console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);

    // 2. Check Dependencies
    console.log('\n2. Checking Dependencies:');
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
        'archiver'
    ];

    for (const dep of dependencies) {
        try {
            require(dep);
            console.log(`✅ ${dep}`);
        } catch (error) {
            console.log(`❌ ${dep} - Error:`, error.message);
        }
    }

    // 3. Check File System
    console.log('\n3. File System Check:');
    try {
        const files = await fs.readdir('/usr/src/app');
        console.log('Root directory contents:', files);
        
        const uploadsExists = await fs.access('/usr/src/app/uploads')
            .then(() => true)
            .catch(() => false);
        console.log('Uploads directory exists:', uploadsExists);

        const routesExists = await fs.access('/usr/src/app/routes')
            .then(() => true)
            .catch(() => false);
        console.log('Routes directory exists:', routesExists);
    } catch (error) {
        console.log('File system error:', error);
    }

    // 4. Check Redis Connection
    console.log('\n4. Redis Connection:');
    try {
        const Redis = require('ioredis');
        const redis = new Redis(process.env.REDIS_URL);
        
        redis.on('connect', () => {
            console.log('Redis connected successfully');
        });

        redis.on('error', (error) => {
            console.log('Redis connection error:', error);
        });

        await redis.ping();
        console.log('Redis PING successful');
        
        await redis.quit();
    } catch (error) {
        console.log('Redis error:', error);
    }

    // 5. Check MongoDB Connection
    console.log('\n5. MongoDB Connection:');
    try {
        const mongoose = require('mongoose');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected successfully');
        await mongoose.disconnect();
    } catch (error) {
        console.log('MongoDB error:', error);
    }

    console.log('\n=== HEALTH CHECK COMPLETED ===\n');
}

// Run the health check
runHealthCheck()
    .catch(console.error)
    .finally(() => {
        // Exit after all checks (including async operations) are complete
        setTimeout(() => process.exit(), 1000);
    });