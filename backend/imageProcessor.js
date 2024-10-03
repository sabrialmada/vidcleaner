
/* //WORKD GOOD BUT FILES STAY SAVED 

const sharp = require('sharp'); // Image processing library
const crypto = require('crypto'); // Built-in module, no need to install it separately
const fs = require('fs');
const path = require('path');

// Function to remove metadata using sharp
function removeMetadata(inputPath, outputPath) {
  return sharp(inputPath)
    .withMetadata({ orientation: null }) // Remove metadata (Exif, etc.)
    .toFile(outputPath);
}

// Function to generate an MD5 hash
function generateMD5(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('md5');
    const stream = fs.createReadStream(filePath);
    stream.on('data', (data) => hash.update(data));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', reject);
  });
}

// Function to apply very slight modifications to the image (no resize, no crop)
// Improved to maintain high quality
function modifyImage(inputPath, outputPath) {
  // Apply a very slight brightness change (between -0.02 and +0.02) to avoid detection
  const brightnessAdjustment = Math.random() * (0.02 - (-0.02)) + (-0.02);

  // Determine output format based on file extension
  const extension = path.extname(outputPath).toLowerCase();
  
  const sharpInstance = sharp(inputPath).modulate({
    brightness: 1 + brightnessAdjustment, // Very slight brightness shift
  });

  if (extension === '.jpeg' || extension === '.jpg') {
    return sharpInstance.jpeg({ quality: 100 }) // Ensure best quality for JPEG
      .toFile(outputPath);
  } else if (extension === '.png') {
    return sharpInstance.png({ compressionLevel: 0 }) // No compression for PNG
      .toFile(outputPath);
  } else {
    // Default to original format without compression if format is unknown
    return sharpInstance.toFile(outputPath);
  }
}

// Main function to process a single image
async function processSingleImage(inputPath, outputPath) {
  try {
    const tempFile1 = path.join(__dirname, 'temp_image_1' + path.extname(inputPath));

    // Step 1: Remove metadata
    await removeMetadata(inputPath, tempFile1);

    // Step 2: Apply very subtle image modifications (no resize, no crop, only slight color modification)
    await modifyImage(tempFile1, outputPath);

    // Step 3: Generate MD5 hash for uniqueness verification (if needed)
    const md5Hash = await generateMD5(outputPath);
    console.log(`MD5 Hash of processed image: ${md5Hash}`);

    // Remove temporary file after processing
    fs.unlinkSync(tempFile1);

    console.log('Image processing completed.');
  } catch (error) {
    console.error('Error processing image:', error);
    throw error; // Re-throw error so the calling function can handle it
  }
}

// Main function to process multiple images
async function processImages(imageFiles) {
  for (const imageFile of imageFiles) {
    const inputFilePath = imageFile.path;
    const outputFilePath = path.join(__dirname, `processed_${imageFile.originalname}`);
    
    // Process each image
    await processSingleImage(inputFilePath, outputFilePath);
  }
}

// Export the processImages function to be used in the server.js
module.exports = {
  processImages
}; */


/* const sharp = require('sharp');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

function safeDelete(filePath) {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
}

async function removeMetadata(inputPath, outputPath) {
    try {
        await sharp(inputPath)
            .withMetadata({ orientation: null }) // Strip all EXIF metadata
            .toFile(outputPath);
    } catch (error) {
        console.error('Failed to remove metadata:', error);
        throw error; // Re-throw to handle it in the calling function
    }
}

async function generateMD5(filePath) {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash('md5');
        const stream = fs.createReadStream(filePath);
        stream.on('data', data => hash.update(data));
        stream.on('end', () => resolve(hash.digest('hex')));
        stream.on('error', error => {
            console.error('Failed to generate MD5:', error);
            reject(error);
        });
    });
}

async function modifyImage(inputPath, outputPath) {
    const brightnessAdjustment = Math.random() * 0.04 - 0.02; // Adjust brightness slightly
    try {
        const outputFormat = path.extname(outputPath).slice(1); // Extract format from extension
        await sharp(inputPath)
            .modulate({ brightness: 1 + brightnessAdjustment })
            .toFormat(outputFormat, { quality: 100 }) // Maintain highest quality
            .toFile(outputPath);
    } catch (error) {
        console.error('Failed to modify image:', error);
        throw error;
    }
}

async function processSingleImage(inputPath, outputPath) {
    const tempFile = path.join(__dirname, 'temp_' + path.basename(inputPath));
    try {
        await removeMetadata(inputPath, tempFile);
        await modifyImage(tempFile, outputPath);
        const md5Hash = await generateMD5(outputPath);
        console.log(`MD5 Hash of processed image: ${md5Hash}`);
    } catch (error) {
        console.error('Error processing single image:', error);
        throw error;
    } finally {
        safeDelete(tempFile);
    }
}

async function processImages(imageFiles) {
    for (const file of imageFiles) {
        const outputPath = path.join(__dirname, `processed_${file.originalname}`);
        await processSingleImage(file.path, outputPath);
        safeDelete(file.path); // Optionally, delete the original file after processing
    }
}

module.exports = { processImages };
 */