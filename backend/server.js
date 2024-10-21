
/* 
//FUNCA

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');
const { processImages } = require('./imageProcessor'); // Image processing logic

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/vidcleaner')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Import video routes (Important: Make sure this is correct)
const videoRoutes = require('./routes/videoRoutes');
app.use('/api', videoRoutes); // Register the video processing routes under /api

// Multer setup for image uploads (temporary storage for uploaded files)
const upload = multer({ dest: 'uploads/' });

// API for image processing
app.post('/api/process-images', upload.array('images', 10), async (req, res) => {
  try {
    const imageFiles = req.files;
    if (!imageFiles || imageFiles.length === 0) {
      return res.status(400).json({ message: 'No image files uploaded' });
    }

    const outputFiles = [];

    // Process each image file
    for (const imageFile of imageFiles) {
      const inputFilePath = path.join(__dirname, imageFile.path);
      const outputFilePath = path.join(__dirname, `processed_${imageFile.originalname}`);
      
      // Process the image
      await processImages([{ path: inputFilePath, originalname: imageFile.originalname }]);

      outputFiles.push({ path: outputFilePath, name: `processed_${imageFile.originalname}` });
    }

    // Create a zip archive of processed images
    const zipFilePath = path.join(__dirname, 'processed_images.zip');
    const archive = archiver('zip', { zlib: { level: 9 } });
    const output = fs.createWriteStream(zipFilePath);

    output.on('close', () => {
      res.download(zipFilePath, 'processed_images.zip', (err) => {
        if (err) {
          console.error('Error sending the zip file:', err);
        }

        // Cleanup after sending the file
        fs.unlinkSync(zipFilePath);
        outputFiles.forEach(file => fs.unlinkSync(file.path)); // Remove uploaded and processed files
      });
    });

    archive.on('error', (err) => {
      throw err;
    });

    archive.pipe(output);

    // Append processed files to the archive
    outputFiles.forEach(file => {
      archive.file(file.path, { name: file.name });
    });

    await archive.finalize(); // Finalize the archive (this triggers the download response)

  } catch (error) {
    console.error('Error processing images:', error);
    res.status(500).json({ message: 'Image processing failed' });
  }
});

// Import and use authentication routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes); // Use the auth routes under /api/auth

// Start the server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
}); */


/* 

//IMAGES FUNCIONA UNA SOLA VEZ. API DE IMAGES ACA

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');
const { processImages } = require('./imageProcessor'); // Image processing logic

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/vidcleaner')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Import video routes (Important: Make sure this is correct)
const videoRoutes = require('./routes/videoRoutes');
app.use('/api', videoRoutes); // Register the video processing routes under /api

// Multer setup for image uploads (temporary storage for uploaded files)
const upload = multer({ dest: 'uploads/' });

// API for image processing
app.post('/api/process-images', upload.array('images', 10), async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No image files uploaded' });
    }

    try {
        const outputFiles = await Promise.all(req.files.map(async (imageFile) => {
            const inputFilePath = path.join(__dirname, imageFile.path);
            const outputFilePath = path.join(__dirname, `processed_${imageFile.originalname}`);

            await processImages([{ path: inputFilePath, originalname: imageFile.originalname }]);
            return { path: outputFilePath, name: `processed_${imageFile.originalname}` };
        }));

        // Create and send a zip archive of processed images
        const zipFilePath = path.join(__dirname, 'processed_images.zip');
        const output = fs.createWriteStream(zipFilePath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        archive.pipe(output);
        outputFiles.forEach(file => {
            archive.file(file.path, { name: file.name });
        });

        await archive.finalize();

        output.on('close', () => {
            res.download(zipFilePath, 'processed_images.zip', (err) => {
                if (err) {
                    console.error('Error sending the zip file:', err);
                    return;
                }

                // Cleanup after sending the file
                fs.unlinkSync(zipFilePath);
                outputFiles.forEach(file => fs.unlinkSync(file.path));
                req.files.forEach(file => fs.unlinkSync(path.join(__dirname, file.path)));
            });
        });

        archive.on('error', (err) => {
            throw err;
        });

    } catch (error) {
        console.error('Error processing images:', error);
        res.status(500).json({ message: 'Image processing failed' });
        req.files.forEach(file => fs.unlinkSync(path.join(__dirname, file.path))); // Ensure all uploaded files are cleaned up
    }
});

// Import and use authentication routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes); // Use the auth routes under /api/auth

// Start the server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
 */


/* 

NO FUNCIONA BIEN. CON API DE IMAGE EN IMAGEROUTES

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const imageRoutes = require('./routes/imageRoutes'); // Import the new image routes
const videoRoutes = require('./routes/videoRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());
mongoose.connect('mongodb://localhost:27017/vidcleaner')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

app.use('/api', videoRoutes); // Register the video processing routes under /api
app.use('/api', imageRoutes); // Register the image processing routes under /api

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
 */


/* 
// SIN PROCESAMIENTO DE IMAGES. VIDEOS FUNCIONA. REELS NO FUNCIONA

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/vidcleaner')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Import video routes (Important: Make sure this is correct)
const videoRoutes = require('./routes/videoRoutes');
app.use('/api', videoRoutes); // Register the video processing routes under /api


// Import and use authentication routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes); // Use the auth routes under /api/auth

// Start the server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
}); */




// WORKS 

/* const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from React frontend
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/vidcleaner')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Import video routes (Important: Make sure this is correct)
const videoRoutes = require('./routes/videoRoutes');
app.use('/api', videoRoutes); // Register the video processing routes under /api

// Import reel routes
const reelRoutes = require('./routes/reelRoutes'); // Make sure the path is correct
app.use('/api', reelRoutes); // Register the reel routes under /api

// Import and use authentication routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes); // Use the auth routes under /api/auth

// Start the server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});

 */


/* require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Stripe webhook route (must be before bodyParser)
app.use('/api/subscriptions/webhook', express.raw({type: 'application/json'}));

// Regular routes
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vidcleaner', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Import routes
const videoRoutes = require('./routes/videoRoutes');
const reelRoutes = require('./routes/reelRoutes');
const authRoutes = require('./routes/auth');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const userRoutes = require('./routes/userRoutes');

// Register routes
app.use('/api', videoRoutes);
app.use('/api', reelRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/user', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

// 404 Route
app.use((req, res, next) => {
  res.status(404).json({ message: "Sorry, that route doesn't exist." });
});

// Start the server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});

module.exports = server; */


// FOR PRODUCTION 

/* require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const app = express();

// Middleware
app.use(helmet()); // Set security HTTP headers
app.use(compression()); // Compress all routes

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Stripe webhook route (must be before bodyParser)
app.use('/api/subscriptions/webhook', express.raw({type: 'application/json'}));

// Regular routes
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Import routes
const videoRoutes = require('./routes/videoRoutes');
const reelRoutes = require('./routes/reelRoutes');
const authRoutes = require('./routes/auth');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const userRoutes = require('./routes/userRoutes');

// Register routes
app.use('/api', videoRoutes);
app.use('/api', reelRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/user', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

// 404 Route
app.use((req, res, next) => {
  res.status(404).json({ message: "Sorry, that route doesn't exist." });
});

// Start the server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});

module.exports = server; */


// FOR PRODUCTION


/* require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');


const app = express();

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Uploads directory created.');
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/api/subscriptions/webhook', express.raw({type: 'application/json'}));


app.use(bodyParser.json({ limit: '300mb' }));
app.use(bodyParser.urlencoded({ limit: '300mb', extended: true }));
app.timeout = 300000; // 5 minutes

mongoose.connect(process.env.MONGODB_URI, {
  dbName: 'vidcleaner'
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

console.log('Attempting to connect to MongoDB...');

app.set('trust proxy', 1); // Trust first proxy

const videoRoutes = require('./routes/videoRoutes');
const reelRoutes = require('./routes/reelRoutes');
const authRoutes = require('./routes/auth');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api', videoRoutes);
app.use('/api', reelRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/user', userRoutes);


app.use((err, req, res, next) => {
  // Log the error
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);

  // Determine if we're in production
  const isProduction = process.env.NODE_ENV === 'production';

  // Set the status code
  const statusCode = err.status || 500;

  // Prepare the error response
  const errorResponse = {
    message: isProduction ? 'An unexpected error occurred' : err.message,
    error: isProduction ? {} : {
      status: statusCode,
      stack: err.stack
    }
  };

  // If it's a validation error, add more details
  if (err.name === 'ValidationError') {
    errorResponse.details = Object.values(err.errors).map(error => error.message);
  }

  // Send the response
  res.status(statusCode).json(errorResponse);

  // If it's a critical error, you might want to do something more
  if (statusCode === 500) {
    // TODO: Send to error monitoring service
    // Example: Sentry.captureException(err);
  }
});

app.use((req, res) => {
  res.status(404).json({ message: "Sorry, that route doesn't exist." });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});

module.exports = server;
 */

/* require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');

const app = express();

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Uploads directory created.');
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/api/subscriptions/webhook', express.raw({type: 'application/json'}));

app.use(bodyParser.json({ limit: '300mb' }));
app.use(bodyParser.urlencoded({ limit: '300mb', extended: true }));
app.timeout = 300000; // 5 minutes

mongoose.connect(process.env.MONGODB_URI, {
  dbName: 'vidcleaner'
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

console.log('Attempting to connect to MongoDB...');

app.set('trust proxy', 1); // Trust first proxy

const videoRoutes = require('./routes/videoRoutes');
const reelRoutes = require('./routes/reelRoutes');
const authRoutes = require('./routes/auth');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes'); // Add this line

app.use((req, res, next) => {
  req.socket.setTimeout(10 * 60 * 1000); // 10 minutes
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Keep-Alive', 'timeout=600'); // 10 minutes
  next();
});

app.use('/api', videoRoutes);
app.use('/api', reelRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/user', userRoutes);
app.use('/admin', adminRoutes); // Add this line

// Cleanup function
async function cleanupUploads() {
    const files = await fs.promises.readdir(uploadsDir);
    const now = new Date();

    for (const file of files) {
        const filePath = path.join(uploadsDir, file);
        const stats = await fs.promises.stat(filePath);
        const fileAge = now - stats.mtime;
        
        // Delete files older than 1 hour (3600000 milliseconds)
        if (fileAge > 3600000) {
            try {
                await fs.promises.unlink(filePath);
                console.log(`Deleted old file: ${file}`);
            } catch (error) {
                console.error(`Failed to delete file ${file}:`, error);
            }
        }
    }
}

// Schedule cleanup
cron.schedule('0 * * * *', () => {
    console.log('Running scheduled cleanup of uploads directory');
    cleanupUploads().catch(error => {
        console.error('Error during scheduled cleanup:', error);
    });
});

// Error handling middleware
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

  if (statusCode === 500) {
    // TODO: Send to error monitoring service
    // Example: Sentry.captureException(err);
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Sorry, that route doesn't exist." });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});

module.exports = server; */


/* require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
const Queue = require('bull');

const app = express();

// Create a Bull queue
const videoQueue = new Queue('video processing', process.env.REDIS_URL);

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Uploads directory created.');
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/api/subscriptions/webhook', express.raw({type: 'application/json'}));

app.use(bodyParser.json({ limit: '300mb' }));
app.use(bodyParser.urlencoded({ limit: '300mb', extended: true }));

mongoose.connect(process.env.MONGODB_URI, {
  dbName: 'vidcleaner'
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

console.log('Attempting to connect to MongoDB...');

app.set('trust proxy', 1); // Trust first proxy

const videoRoutes = require('./routes/videoRoutes');
const reelRoutes = require('./routes/reelRoutes');
const authRoutes = require('./routes/auth');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Adjust timeout for Railway
app.use((req, res, next) => {
  req.socket.setTimeout(25 * 1000); // 25 seconds
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Keep-Alive', 'timeout=25'); // 25 seconds
  next();
});

app.use('/api', videoRoutes);
app.use('/api', reelRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/user', userRoutes);
app.use('/admin', adminRoutes);

// Process jobs in the queue
videoQueue.process(async (job) => {
  const { inputPath, outputPath } = job.data;
  const { processVideo, safeDelete } = require('./videoProcessor');
  
  try {
    const md5Hash = await processVideo(inputPath, outputPath);
    await safeDelete(inputPath);
    return { md5Hash, outputPath };
  } catch (error) {
    console.error(`Error processing video job:`, error);
    throw error;
  }
});

// Cleanup function
async function cleanupUploads() {
    const files = await fs.promises.readdir(uploadsDir);
    const now = new Date();

    for (const file of files) {
        const filePath = path.join(uploadsDir, file);
        const stats = await fs.promises.stat(filePath);
        const fileAge = now - stats.mtime;
        
        // Delete files older than 1 hour (3600000 milliseconds)
        if (fileAge > 3600000) {
            try {
                await fs.promises.unlink(filePath);
                console.log(`Deleted old file: ${file}`);
            } catch (error) {
                console.error(`Failed to delete file ${file}:`, error);
            }
        }
    }
}

// Schedule cleanup
cron.schedule('0 * * * *', () => {
    console.log('Running scheduled cleanup of uploads directory');
    cleanupUploads().catch(error => {
        console.error('Error during scheduled cleanup:', error);
    });
});

// Error handling middleware
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

  if (statusCode === 500) {
    // TODO: Send to error monitoring service
    // Example: Sentry.captureException(err);
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Sorry, that route doesn't exist." });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});

module.exports = { app, server, videoQueue }; */

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
const { videoQueue } = require('./queue');
const { processVideo, safeDelete } = require('./videoProcessor');
const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL); // Use the correct REDIS_URL


const app = express();

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Uploads directory created.');
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// Updated CORS configuration
app.use(cors({
  origin: '*' /* ['https://www.vidcleaner.com', 'http://localhost:3000'] */, // Add your frontend URL and localhost for development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204
}));

app.use('/api/subscriptions/webhook', express.raw({type: 'application/json'}));

app.use(bodyParser.json({ limit: '300mb' }));
app.use(bodyParser.urlencoded({ limit: '300mb', extended: true }));

redis.set('test-key', 'test-value')
  .then(() => redis.get('test-key'))
  .then((result) => {
    console.log('Redis test success:', result); // Should log: 'test-value'
    redis.disconnect();
  })
  .catch((error) => {
    console.error('Redis connection failed:', error);
  });

mongoose.connect(process.env.MONGODB_URI, {
  dbName: 'vidcleaner'
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

console.log('Attempting to connect to MongoDB...');

app.set('trust proxy', 1);

const videoRoutes = require('./routes/videoRoutes');
const reelRoutes = require('./routes/reelRoutes');
const authRoutes = require('./routes/auth');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Adjust timeout for Railway
app.use((req, res, next) => {
  req.socket.setTimeout(25 * 1000);
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Keep-Alive', 'timeout=25');
  next();
});

app.use('/api', videoRoutes);
app.use('/api', reelRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/user', userRoutes);
app.use('/admin', adminRoutes);

// Process jobs in the queue
videoQueue.process(async (job) => {
  const { inputPath, outputPath } = job.data;
  
  job.progress(0);
  console.log(`Starting job ${job.id} for input: ${inputPath}`);

  return new Promise(async (resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Job timed out'));
    }, 30 * 60 * 1000); // 30 minutes timeout

    try {
      // Simulating progress updates
      const progressInterval = setInterval(() => {
        job.progress(Math.min(job.progress() + 10, 90));
      }, 5000);

      const result = await processVideo(inputPath, outputPath);
      
      clearInterval(progressInterval);
      clearTimeout(timeout);
      
      job.progress(100);
      console.log(`Job ${job.id} completed successfully`);
      resolve(result);
    } catch (error) {
      clearTimeout(timeout);
      console.error(`Error processing video job ${job.id}:`, error);
      reject(error);
    } finally {
      try {
        await safeDelete(inputPath);
        console.log(`Input file deleted for job ${job.id}: ${inputPath}`);
      } catch (deleteError) {
        console.error(`Error deleting input file for job ${job.id}:`, deleteError);
      }
    }
  });
});

videoQueue.on('completed', (job, result) => {
  console.log(`Job ${job.id} completed with result:`, result);
});

videoQueue.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed with error:`, err);
});

videoQueue.on('progress', (job, progress) => {
  console.log(`Job ${job.id} is ${progress}% complete`);
});

// Cleanup function
async function cleanupUploads() {
    const files = await fs.promises.readdir(uploadsDir);
    const now = new Date();

    for (const file of files) {
        const filePath = path.join(uploadsDir, file);
        const stats = await fs.promises.stat(filePath);
        const fileAge = now - stats.mtime;
        
        if (fileAge > 3600000) {
            try {
                await fs.promises.unlink(filePath);
                console.log(`Deleted old file: ${file}`);
            } catch (error) {
                console.error(`Failed to delete file ${file}:`, error);
            }
        }
    }
}

// Schedule cleanup
cron.schedule('0 * * * *', () => {
    console.log('Running scheduled cleanup of uploads directory');
    cleanupUploads().catch(error => {
        console.error('Error during scheduled cleanup:', error);
    });
});

// Error handling middleware
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

  if (statusCode === 500) {
    // TODO: Send to error monitoring service
    // Example: Sentry.captureException(err);
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Sorry, that route doesn't exist." });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});

module.exports = { app, server };