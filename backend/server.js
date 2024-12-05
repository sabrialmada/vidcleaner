
const path = require('path');
const dotenv = require('dotenv');

// load the correct environment file
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const fs = require('fs').promises;
const cron = require('node-cron');
const Redis = require('ioredis');

// validate required environment variables
const requiredEnvVars = [
  'REDIS_URL',
  'MONGODB_URI',
  'NODE_ENV'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

// parse redis url for better configuration
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

// debug environment information
console.log('Environment:', {
  nodeEnv: process.env.NODE_ENV,
  hasRedisUrl: !!process.env.REDIS_URL,
  redisUrlStart: process.env.REDIS_URL ? `${process.env.REDIS_URL.slice(0, 8)}...` : 'not set'
});

// initialize redis with enhanced error handling
let redis;
try {
  const redisConfig = parseRedisUrl(process.env.REDIS_URL);
  const redisOptions = {
    host: redisConfig.host,
    port: redisConfig.port,
    password: redisConfig.password,
    retryStrategy(times) {
      const delay = Math.min(times * 50, 2000);
      console.log(`Retrying Redis connection in ${delay}ms...`);
      return delay;
    },
    maxRetriesPerRequest: 3,
    connectTimeout: 30000,
    keepAlive: 30000,
    tls: process.env.NODE_ENV === 'production' ? redisConfig.tls : undefined
  };

  redis = new Redis(redisOptions);

  redis.on('connect', () => {
    console.log('Successfully connected to Redis');
  });

  redis.on('error', (error) => {
    console.error('Redis connection error:', error);
  });

  redis.on('ready', () => {
    console.log('Redis client ready');
  });

  redis.on('close', () => {
    console.log('Redis connection closed');
  });

} catch (error) {
  console.error('Error initializing Redis:', error);
  process.exit(1);
}

const app = express();

app.use('/api/subscriptions/webhook', express.raw({ type: 'application/json' }));

// create uploads directory
const uploadsDir = path.join(__dirname, 'uploads');
fs.mkdir(uploadsDir, { recursive: true })
  .then(() => console.log('Uploads directory created:', uploadsDir))
  .catch(err => console.error('Error creating uploads directory:', err));

// security middleware first
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? ['https://vidcleaner.vercel.app', 'https://www.vidcleaner.com', 'https://vidcleaner.com']
    : ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Disposition'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));

// other basic middleware
app.use(compression());
app.use(morgan('combined'));

// CORS debug middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Origin:', req.headers.origin);
  console.log('Headers:', JSON.stringify(req.headers));
  next();
});

// rate limiting configuration with redis
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute window
  max: (req) => {
    if (req.path.includes('/api/job-status')) {
      return 300; // higher limit for job status checks
    }
    return 100; // default limit for other routes
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipFailedRequests: true,
  message: 'Too many requests from this IP, please try again later.',
  skip: (req) => process.env.NODE_ENV === 'development'
});

app.use(limiter);

// body parser setup
app.use(bodyParser.json({ limit: '300mb' }));
app.use(bodyParser.urlencoded({ limit: '300mb', extended: true }));

// mongoDB connection with enhanced error handling
const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'vidcleaner',
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

mongoose.connection.on('error', err => {
  console.error('MongoDB error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected. Attempting to reconnect...');
  setTimeout(connectMongoDB, 5000);
});

app.set('trust proxy', 1);

// routes
const videoRoutes = require('./routes/videoRoutes');
const reelRoutes = require('./routes/reelRoutes');
const authRoutes = require('./routes/auth');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

// railway timeout adjustment
app.use((req, res, next) => {
  req.socket.setTimeout(25 * 1000);
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Keep-Alive', 'timeout=25');
  next();
});

// test endpoint for CORS
app.options('/api/test-cors', cors(corsOptions));
app.get('/api/test-cors', (req, res) => {
  res.json({ message: 'CORS is working' });
});

// route handlers
app.use('/api', videoRoutes);
app.use('/api', reelRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/user', userRoutes);
app.use('/admin', adminRoutes);

const { videoQueue } = require('./queue');
const { safeDelete } = require('./videoProcessor');

// queue event handlers
videoQueue.on('removed', async (job) => {
  console.log(`Job ${job.id} was removed, cleaning up...`);
  try {
    const { inputPath } = job.data;
    const { outputPath } = job.returnvalue || {};

    if (inputPath) await safeDelete(inputPath).catch(() => { });
    if (outputPath) await safeDelete(outputPath).catch(() => { });
  } catch (error) {
    console.error(`Error cleaning up removed job ${job.id}:`, error);
  }
});

videoQueue.on('completed', (job, result) => {
  console.log(`Job ${job.id} completed with result:`, result);
});

videoQueue.on('failed', async (job, error) => {
  console.error(`Job ${job.id} failed with error:`, error);
  try {
    const { inputPath } = job.data;
    const { outputPath } = job.returnvalue || {};

    if (inputPath) await safeDelete(inputPath).catch(() => { });
    if (outputPath) await safeDelete(outputPath).catch(() => { });
  } catch (error) {
    console.error(`Error cleaning up failed job ${job.id}:`, error);
  }
});

videoQueue.on('progress', (job, progress) => {
  console.log(`Job ${job.id} is ${progress}% complete`);
});

// cleanup 
async function cleanupUploads() {
  try {
    const files = await fs.readdir(uploadsDir);
    const now = Date.now();
    let deletedCount = 0;

    await Promise.all(files.map(async (file) => {
      const filePath = path.join(uploadsDir, file);
      try {
        const stats = await fs.stat(filePath);
        const fileAge = now - stats.mtimeMs;

        if (fileAge > 3600000) { // 1 hour
          await fs.unlink(filePath);
          deletedCount++;
          console.log(`Deleted old file: ${file}`);
        }
      } catch (error) {
        console.error(`Error processing file ${file}:`, error);
      }
    }));

    console.log(`Cleanup completed. Deleted ${deletedCount} files`);
  } catch (error) {
    console.error('Error during cleanup:', error);
  }
}

// schedule cleanup
cron.schedule('0 * * * *', () => {
  console.log('Running scheduled cleanup of uploads directory');
  cleanupUploads();
});

// error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);

  const isProduction = process.env.NODE_ENV === 'production';
  const statusCode = err.status || 500;

  const errorResponse = {
    message: isProduction ? 'An unexpected error occurred' : err.message,
    error: isProduction ? {} : {
      status: statusCode,
      stack: err.stack
    }
  };

  if (err.name === 'ValidationError') {
    errorResponse.details = Object.values(err.errors).map(error => error.message);
  }

  res.status(statusCode).json(errorResponse);
});

// 404
app.use((req, res) => {
  res.status(404).json({ message: "Sorry, that route doesn't exist." });
});

// server initialization
const PORT = process.env.PORT || 5000;
let server = null;

// enhanced error handlers with server check
function handleFatalError(error) {
  console.error('Fatal error occurred:', error);
  if (server) {
    server.close(() => {
      console.log('Server closed due to fatal error');
      process.exit(1);
    });
  } else {
    console.log('Server was not initialized, exiting');
    process.exit(1);
  }
}

// process handlers
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  handleFatalError(error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  handleFatalError(reason);
});

// server startup with health checks
async function startServer() {
  try {
    // verify redis connection
    await redis.ping();
    console.log('Redis connection verified');

    // connect to mongoDB
    await connectMongoDB();

    // start http server
    server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    // set up server error handling
    server.on('error', (error) => {
      console.error('Server error:', error);
      handleFatalError(error);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    handleFatalError(error);
  }
}

// shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: initiating graceful shutdown');

  try {
    if (server) {
      await new Promise((resolve) => {
        server.close(resolve);
        console.log('HTTP server closed');
      });
    }

    if (redis) {
      await redis.quit();
      console.log('Redis connection closed');
    }

    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close(false);
      console.log('MongoDB connection closed');
    }

    console.log('Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

// start the server
startServer().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});

module.exports = { app, server };