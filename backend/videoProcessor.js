/* //WORKS OK

const ffmpeg = require('fluent-ffmpeg');
const crypto = require('crypto'); // Built-in module, no need to install it separately
const fs = require('fs');
const path = require('path');

// Function to remove metadata using FFmpeg
function removeMetadata(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .outputOptions('-map_metadata', '-1') // Remove metadata
      .outputOptions('-preset', 'ultrafast') // Set encoding speed
      .save(outputPath)
      .on('end', resolve)
      .on('error', reject);
  });
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

// Function to apply slight modifications to video (crop, scale)
function modifyVideo(inputPath, outputPath) {
  const scaleFactor = (Math.random() * (1.03 - 1.01) + 1.01).toFixed(2); // Slight random scaling
  const cropValue = Math.floor(Math.random() * 5) + 1; // Random crop between 1 and 5 pixels

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .videoFilter(`scale=iw*${scaleFactor}:ih*${scaleFactor}, crop=iw-${cropValue}:ih-${cropValue}`)
      .outputOptions('-preset', 'ultrafast') // Set encoding speed
      .save(outputPath)
      .on('end', resolve)
      .on('error', reject);
  });
}

// Function to adjust audio (pitch/speed)
function adjustAudio(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .audioFilters('asetrate=44100*1.02,aresample=44100') // Adjust audio pitch and speed
      .outputOptions('-preset', 'ultrafast') // Set encoding speed
      .save(outputPath)
      .on('end', resolve)
      .on('error', reject);
  });
}

// Function to apply random color space modification
function changeColorSpace(inputPath, outputPath) {
  const colorSpaces = ['bt709', 'smpte240m', 'bt2020'];
  const randomColorSpace = colorSpaces[Math.floor(Math.random() * colorSpaces.length)];

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .videoFilter(`colorspace=all=${randomColorSpace}:iall=bt709`)
      .outputOptions('-preset', 'ultrafast') // Set encoding speed
      .save(outputPath)
      .on('end', resolve)
      .on('error', reject);
  });
}

// Function to re-encode video
function reencodeVideo(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .videoCodec('libx264') // Re-encode video with H.264 codec
      .outputOptions('-preset', 'slow', '-crf', '18') // Slow preset, high-quality (crf 18)
      .save(outputPath)
      .on('end', resolve)
      .on('error', reject);
  });
}

// Main function to process video
async function processVideo(inputPath, outputPath) {
  try {
    const tempFile1 = path.join(__dirname, 'temp_video_1.mp4');
    const tempFile2 = path.join(__dirname, 'temp_video_2.mp4');

    // Step 1: Remove metadata
    await removeMetadata(inputPath, tempFile1);

    // Step 2: Apply random video modifications (scaling, cropping, etc.)
    await modifyVideo(tempFile1, tempFile2);

    // Step 3: Adjust audio to avoid audio-based detection
    await adjustAudio(tempFile2, tempFile1);

    // Step 4: Re-encode the video
    await reencodeVideo(tempFile1, tempFile2);

    // Step 5: Apply random color space modification
    await changeColorSpace(tempFile2, outputPath);

    // Step 6: Generate MD5 hash for uniqueness verification (if needed)
    const md5Hash = await generateMD5(outputPath);
    console.log(`MD5 Hash of processed video: ${md5Hash}`);

    console.log('Video processing completed.');

    // Remove temporary files after processing
    fs.unlinkSync(tempFile1);
    fs.unlinkSync(tempFile2);

  } catch (error) {
    console.error('Error processing video:', error);
  }
}

module.exports = {
  processVideo
};
 */


/* const ffmpeg = require('fluent-ffmpeg');
const crypto = require('crypto'); // Built-in module, no need to install it separately
const fs = require('fs');
const path = require('path');

// Function to remove metadata using FFmpeg
function removeMetadata(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .outputOptions('-map_metadata', '-1') // Remove metadata
      .outputOptions('-preset', 'ultrafast') // Set encoding speed
      .save(outputPath)
      .on('end', resolve)
      .on('error', reject);
  });
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

// Function to apply slight modifications to video (crop, scale)
function modifyVideo(inputPath, outputPath) {
  const scaleFactor = (Math.random() * (1.03 - 1.01) + 1.01).toFixed(2); // Slight random scaling
  const cropValue = Math.floor(Math.random() * 5) + 1; // Random crop between 1 and 5 pixels

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .videoFilter(`scale=iw*${scaleFactor}:ih*${scaleFactor}, crop=iw-${cropValue}:ih-${cropValue}`)
      .outputOptions('-preset', 'ultrafast') // Set encoding speed
      .save(outputPath)
      .on('end', resolve)
      .on('error', reject);
  });
}

// Function to adjust audio (pitch/speed)
function adjustAudio(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .audioFilters('asetrate=44100*1.02,aresample=44100') // Adjust audio pitch and speed
      .outputOptions('-preset', 'ultrafast') // Set encoding speed
      .save(outputPath)
      .on('end', resolve)
      .on('error', reject);
  });
}

// Function to apply random color space modification
function changeColorSpace(inputPath, outputPath) {
  const colorSpaces = ['bt709', 'smpte240m', 'bt2020'];
  const randomColorSpace = colorSpaces[Math.floor(Math.random() * colorSpaces.length)];

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .videoFilter(`colorspace=all=${randomColorSpace}:iall=bt709`)
      .outputOptions('-preset', 'ultrafast') // Set encoding speed
      .save(outputPath)
      .on('end', resolve)
      .on('error', reject);
  });
}

// Function to re-encode video
function reencodeVideo(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .videoCodec('libx264') // Re-encode video with H.264 codec
      .outputOptions('-preset', 'slow', '-crf', '18') // Slow preset, high-quality (crf 18)
      .save(outputPath)
      .on('end', resolve)
      .on('error', reject);
  });
}

// Main function to process video
async function processVideo(inputPath, outputPath) {
  try {
    console.log(`Starting video processing: ${inputPath}`);
    const tempFile1 = path.join(__dirname, 'temp_video_1.mp4');
    const tempFile2 = path.join(__dirname, 'temp_video_2.mp4');

    console.log('Step 1: Removing metadata');
    await removeMetadata(inputPath, tempFile1);

    console.log('Step 2: Applying random video modifications');
    await modifyVideo(tempFile1, tempFile2);

    console.log('Step 3: Adjusting audio');
    await adjustAudio(tempFile2, tempFile1);

    console.log('Step 4: Re-encoding the video');
    await reencodeVideo(tempFile1, tempFile2);

    console.log('Step 5: Applying random color space modification');
    await changeColorSpace(tempFile2, outputPath);

    console.log('Step 6: Generating MD5 hash for uniqueness verification');
    const md5Hash = await generateMD5(outputPath);
    console.log(`MD5 Hash of processed video: ${md5Hash}`);

    console.log('Video processing completed.');

    // Remove temporary files after processing
    fs.unlinkSync(tempFile1);
    fs.unlinkSync(tempFile2);

  } catch (error) {
    console.error('Error processing video:', error);
    throw error; // Rethrow the error so it can be caught in reelRoutes.js
  }
}

module.exports = {
  processVideo
};
 */


// FOR PRODUCTION


const ffmpeg = require('fluent-ffmpeg');
const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');

function removeMetadata(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .outputOptions('-map_metadata', '-1')
      .outputOptions('-preset', 'ultrafast')
      .save(outputPath)
      .on('end', resolve)
      .on('error', reject);
  });
}

async function generateMD5(filePath) {
  const hash = crypto.createHash('md5');
  const data = await fs.readFile(filePath);
  hash.update(data);
  return hash.digest('hex');
}

function modifyVideo(inputPath, outputPath) {
  const scaleFactor = (Math.random() * (1.03 - 1.01) + 1.01).toFixed(2);
  const cropValue = Math.floor(Math.random() * 5) + 1;

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .videoFilter(`scale=iw*${scaleFactor}:ih*${scaleFactor}, crop=iw-${cropValue}:ih-${cropValue}`)
      .outputOptions('-preset', 'ultrafast')
      .save(outputPath)
      .on('end', resolve)
      .on('error', reject);
  });
}

function adjustAudio(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .audioFilters('asetrate=44100*1.02,aresample=44100')
      .outputOptions('-preset', 'ultrafast')
      .save(outputPath)
      .on('end', resolve)
      .on('error', reject);
  });
}

function changeColorSpace(inputPath, outputPath) {
  const colorSpaces = ['bt709', 'smpte240m', 'bt2020'];
  const randomColorSpace = colorSpaces[Math.floor(Math.random() * colorSpaces.length)];

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .videoFilter(`colorspace=all=${randomColorSpace}:iall=bt709`)
      .outputOptions('-preset', 'ultrafast')
      .save(outputPath)
      .on('end', resolve)
      .on('error', reject);
  });
}

function reencodeVideo(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .videoCodec('libx264')
      .outputOptions('-preset', 'slow', '-crf', '18')
      .save(outputPath)
      .on('end', resolve)
      .on('error', reject);
  });
}

async function processVideo(inputPath, outputPath) {
  try {
    console.log(`Starting video processing: ${inputPath}`);
    const tempFile1 = path.join(__dirname, 'temp_video_1.mp4');
    const tempFile2 = path.join(__dirname, 'temp_video_2.mp4');

    console.log('Step 1: Removing metadata');
    await removeMetadata(inputPath, tempFile1);

    console.log('Step 2: Applying random video modifications');
    await modifyVideo(tempFile1, tempFile2);

    console.log('Step 3: Adjusting audio');
    await adjustAudio(tempFile2, tempFile1);

    console.log('Step 4: Re-encoding the video');
    await reencodeVideo(tempFile1, tempFile2);

    console.log('Step 5: Applying random color space modification');
    await changeColorSpace(tempFile2, outputPath);

    console.log('Step 6: Generating MD5 hash for uniqueness verification');
    const md5Hash = await generateMD5(outputPath);
    console.log(`MD5 Hash of processed video: ${md5Hash}`);

    console.log('Video processing completed.');

    await Promise.all([
      fs.unlink(tempFile1),
      fs.unlink(tempFile2)
    ]);

  } catch (error) {
    console.error('Error processing video:', error);
    throw error;
  }
}

module.exports = {
  processVideo
};