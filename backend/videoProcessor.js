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


/* const ffmpeg = require('fluent-ffmpeg');
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
}; */


/* const ffmpeg = require('fluent-ffmpeg');
const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');

function ffmpegPromise(inputPath, outputPath, operation) {
  return new Promise((resolve, reject) => {
    const command = ffmpeg(inputPath);
    operation(command);
    command
      .outputOptions('-preset', 'ultrafast')
      .save(outputPath)
      .on('start', commandLine => {
        console.log(`FFmpeg command: ${commandLine}`);
      })
      .on('progress', progress => {
        console.log(`Processing: ${progress.percent}% done`);
      })
      .on('end', () => {
        console.log(`FFmpeg operation completed: ${outputPath}`);
        resolve();
      })
      .on('error', (err, stdout, stderr) => {
        console.error('FFmpeg error:', err.message);
        console.error('FFmpeg stdout:', stdout);
        console.error('FFmpeg stderr:', stderr);
        reject(err);
      });
  });
}

function removeMetadata(inputPath, outputPath) {
  return ffmpegPromise(inputPath, outputPath, command => {
    command.outputOptions('-map_metadata', '-1');
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
  
  return ffmpegPromise(inputPath, outputPath, command => {
    command.videoFilter(`scale=iw*${scaleFactor}:ih*${scaleFactor}, crop=iw-${cropValue}:ih-${cropValue}`);
  });
}

function adjustAudio(inputPath, outputPath) {
  return ffmpegPromise(inputPath, outputPath, command => {
    command.audioFilters('asetrate=44100*1.02,aresample=44100');
  });
}

function changeColorSpace(inputPath, outputPath) {
  const colorSpaces = ['bt709', 'smpte240m', 'bt2020'];
  const randomColorSpace = colorSpaces[Math.floor(Math.random() * colorSpaces.length)];
  
  return ffmpegPromise(inputPath, outputPath, command => {
    command.videoFilter(`colorspace=all=${randomColorSpace}:iall=bt709`);
  });
}

function reencodeVideo(inputPath, outputPath) {
  return ffmpegPromise(inputPath, outputPath, command => {
    command.videoCodec('libx264').outputOptions('-preset', 'slow', '-crf', '18');
  });
}

async function processVideo(inputPath, outputPath) {
  const tempFiles = [];
  try {
    console.log(`Starting video processing: ${inputPath}`);
    const tempFile1 = path.join(__dirname, 'temp_video_1.mp4');
    const tempFile2 = path.join(__dirname, 'temp_video_2.mp4');
    tempFiles.push(tempFile1, tempFile2);

    await removeMetadata(inputPath, tempFile1);
    await modifyVideo(tempFile1, tempFile2);
    await adjustAudio(tempFile2, tempFile1);
    await reencodeVideo(tempFile1, tempFile2);
    await changeColorSpace(tempFile2, outputPath);

    const md5Hash = await generateMD5(outputPath);
    console.log(`MD5 Hash of processed video: ${md5Hash}`);

    console.log('Video processing completed.');
  } catch (error) {
    console.error('Error processing video:', error);
    throw error;
  } finally {
    // Clean up temp files
    for (const file of tempFiles) {
      try {
        await fs.unlink(file);
        console.log(`Temporary file deleted: ${file}`);
      } catch (unlinkError) {
        console.error(`Error deleting temporary file: ${file}`, unlinkError);
      }
    }
  }
}

module.exports = {
  processVideo
}; */

/* const ffmpeg = require('fluent-ffmpeg');
const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');

function ffmpegPromise(inputPath, outputPath, operation, job) {
  return new Promise((resolve, reject) => {
    const command = ffmpeg(inputPath);
    operation(command);

    let isCancelled = false;
    const checkCancellation = setInterval(async () => {
      if (job && jobStateManager.isJobCancelled(job.id)) {
        isCancelled = true;
        command.kill('SIGKILL');
        clearInterval(checkCancellation);
      }
    }, 1000);

    command
      .outputOptions('-preset', 'ultrafast')
      .save(outputPath)
      .on('start', commandLine => {
        console.log(`FFmpeg command: ${commandLine}`);
      })
      .on('progress', progress => {
        if (isCancelled) return;
        const percent = progress.percent ? progress.percent.toFixed(2) : 'N/A';
        const timemark = progress.timemark || 'N/A';
        console.log(`Processing: ${percent}% done (Time: ${timemark})`);
      })
      .on('end', () => {
        clearInterval(checkCancellation);
        if (isCancelled) {
          reject(new Error('Job cancelled'));
        } else {
          console.log(`FFmpeg operation completed: ${outputPath}`);
          resolve();
        }
      })
      .on('error', (err, stdout, stderr) => {
        clearInterval(checkCancellation);
        if (!isCancelled) {
          console.error('FFmpeg error:', err.message);
          console.error('FFmpeg stdout:', stdout);
          console.error('FFmpeg stderr:', stderr);
        }
        reject(isCancelled ? new Error('Job cancelled') : err);
      });
  });
}

function removeMetadata(inputPath, outputPath) {
  return ffmpegPromise(inputPath, outputPath, command => {
    command.outputOptions('-map_metadata', '-1');
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
  
  return ffmpegPromise(inputPath, outputPath, command => {
    command.videoFilter(`scale=iw*${scaleFactor}:ih*${scaleFactor}, crop=iw-${cropValue}:ih-${cropValue}`);
  });
}

function adjustAudio(inputPath, outputPath) {
  return ffmpegPromise(inputPath, outputPath, command => {
    command.audioFilters('asetrate=44100*1.02,aresample=44100');
  });
}

function changeColorSpace(inputPath, outputPath) {
  const colorSpaces = ['bt709', 'smpte240m', 'bt2020'];
  const randomColorSpace = colorSpaces[Math.floor(Math.random() * colorSpaces.length)];
  
  return ffmpegPromise(inputPath, outputPath, command => {
    command.videoFilter(`colorspace=all=${randomColorSpace}:iall=bt709`);
  });
}

function reencodeVideo(inputPath, outputPath) {
  return ffmpegPromise(inputPath, outputPath, command => {
    command.videoCodec('libx264').outputOptions('-preset', 'slow', '-crf', '18');
  });
}

async function safeDelete(filePath) {
  try {
    await fs.access(filePath, fs.constants.F_OK);
    await fs.unlink(filePath);
    console.log(`File deleted successfully: ${filePath}`);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(`File does not exist, skipping deletion: ${filePath}`);
    } else {
      console.error(`Error deleting file: ${filePath}`, error);
    }
  }
}

async function processVideo(inputPath, outputPath, job) {
  const tempFiles = [];
  try {
    // Add job cancellation check with both state and data
    const checkCancellation = async () => {
      if (job) {
        try {
          const [state, data] = await Promise.all([
            job.getState(),
            job.data,
          ]);
          
          if (state === 'removed' || data.cancelRequested) {
            throw new Error('Job cancelled');
          }
        } catch (error) {
          if (error.message === 'Job cancelled') {
            throw error;
          }
          console.error('Error checking job state:', error);
        }
      }
    };

    // Initial cancellation check
    await checkCancellation();
    
    console.log(`Starting video processing for: ${inputPath}`);
    await fs.access(inputPath, fs.constants.R_OK);
    
    const tempDir = path.dirname(inputPath);
    await fs.access(tempDir, fs.constants.W_OK);

    const tempFile1 = path.join(tempDir, `temp_video_1_${Date.now()}.mp4`);
    const tempFile2 = path.join(tempDir, `temp_video_2_${Date.now()}.mp4`);
    tempFiles.push(tempFile1, tempFile2);

    // Store temp files in job data for cleanup
    await job.update({ ...job.data, tempFiles });

    // Add cancellation check before each operation
    await checkCancellation();
    console.log('Removing metadata...');
    await removeMetadata(inputPath, tempFile1);

    await checkCancellation();
    console.log('Modifying video...');
    await modifyVideo(tempFile1, tempFile2);

    await checkCancellation();
    console.log('Adjusting audio...');
    await adjustAudio(tempFile2, tempFile1);

    await checkCancellation();
    console.log('Re-encoding video...');
    await reencodeVideo(tempFile1, tempFile2);

    await checkCancellation();
    console.log('Changing color space...');
    await changeColorSpace(tempFile2, outputPath);

    const md5Hash = await generateMD5(outputPath);

    return { md5Hash, outputPath };
  } catch (error) {
    console.error('Error in processVideo:', error);
    // Clean up output file if it exists and there was an error
    try {
      await fs.access(outputPath, fs.constants.F_OK);
      await fs.unlink(outputPath);
    } catch (cleanupError) {
      // Ignore if file doesn't exist
    }
    throw error;
  } finally {
    // Clean up temp files
    for (const file of tempFiles) {
      try {
        await safeDelete(file);
      } catch (error) {
        console.error(`Error deleting temp file ${file}:`, error);
      }
    }
  }
}

module.exports = {
  processVideo,
  safeDelete
}; */


const ffmpeg = require('fluent-ffmpeg');
const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');

function ffmpegPromise(inputPath, outputPath, operation, job) {
  return new Promise((resolve, reject) => {
    const command = ffmpeg(inputPath);
    operation(command);

    let isCancelled = false;
    let checkCancellation;
    
    if (job) {
      checkCancellation = setInterval(async () => {
        if (jobStateManager.isJobCancelled(job.id)) {
          isCancelled = true;
          command.kill('SIGKILL');
          clearInterval(checkCancellation);
        }
      }, 1000);
    }

    command
      .outputOptions('-preset', 'ultrafast')
      .save(outputPath)
      .on('start', commandLine => {
        console.log(`FFmpeg command: ${commandLine}`);
      })
      .on('progress', progress => {
        if (isCancelled) return;
        const percent = progress.percent ? progress.percent.toFixed(2) : 'N/A';
        const timemark = progress.timemark || 'N/A';
        console.log(`Processing: ${percent}% done (Time: ${timemark})`);
      })
      .on('end', () => {
        if (checkCancellation) {
          clearInterval(checkCancellation);
        }
        if (isCancelled) {
          reject(new Error('Job cancelled'));
        } else {
          console.log(`FFmpeg operation completed: ${outputPath}`);
          resolve();
        }
      })
      .on('error', (err, stdout, stderr) => {
        if (checkCancellation) {
          clearInterval(checkCancellation);
        }
        if (!isCancelled) {
          console.error('FFmpeg error:', err.message);
          console.error('FFmpeg stdout:', stdout);
          console.error('FFmpeg stderr:', stderr);
        }
        reject(isCancelled ? new Error('Job cancelled') : err);
      });
  });
}

function removeMetadata(inputPath, outputPath) {
  return ffmpegPromise(inputPath, outputPath, command => {
    command.outputOptions('-map_metadata', '-1');
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
  
  return ffmpegPromise(inputPath, outputPath, command => {
    command.videoFilter(`scale=iw*${scaleFactor}:ih*${scaleFactor}, crop=iw-${cropValue}:ih-${cropValue}`);
  });
}

function adjustAudio(inputPath, outputPath) {
  return ffmpegPromise(inputPath, outputPath, command => {
    command.audioFilters('asetrate=44100*1.02,aresample=44100');
  });
}

function changeColorSpace(inputPath, outputPath) {
  const colorSpaces = ['bt709', 'smpte240m', 'bt2020'];
  const randomColorSpace = colorSpaces[Math.floor(Math.random() * colorSpaces.length)];
  
  return ffmpegPromise(inputPath, outputPath, command => {
    command.videoFilter(`colorspace=all=${randomColorSpace}:iall=bt709`);
  });
}

function reencodeVideo(inputPath, outputPath) {
  return ffmpegPromise(inputPath, outputPath, command => {
    command.videoCodec('libx264').outputOptions('-preset', 'slow', '-crf', '18');
  });
}

async function safeDelete(filePath) {
  try {
    await fs.access(filePath, fs.constants.F_OK);
    await fs.unlink(filePath);
    console.log(`File deleted successfully: ${filePath}`);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(`File does not exist, skipping deletion: ${filePath}`);
    } else {
      console.error(`Error deleting file: ${filePath}`, error);
    }
  }
}

async function processVideo(inputPath, outputPath, job = null) {
  const tempFiles = [];
  try {
    // Add job cancellation check only if job exists
    const checkCancellation = async () => {
      if (job) {
        try {
          const [state, data] = await Promise.all([
            job.getState(),
            job.data,
          ]);
          
          if (state === 'removed' || data.cancelRequested) {
            throw new Error('Job cancelled');
          }
        } catch (error) {
          if (error.message === 'Job cancelled') {
            throw error;
          }
          console.error('Error checking job state:', error);
        }
      }
    };

    // Initial cancellation check
    await checkCancellation();
    
    console.log(`Starting video processing for: ${inputPath}`);
    await fs.access(inputPath, fs.constants.R_OK);
    
    const tempDir = path.dirname(inputPath);
    await fs.access(tempDir, fs.constants.W_OK);

    const tempFile1 = path.join(tempDir, `temp_video_1_${Date.now()}.mp4`);
    const tempFile2 = path.join(tempDir, `temp_video_2_${Date.now()}.mp4`);
    tempFiles.push(tempFile1, tempFile2);

    // Store temp files in job data only if job exists
    if (job) {
      await job.update({ ...job.data, tempFiles });
    }

    // Add cancellation check before each operation
    await checkCancellation();
    console.log('Removing metadata...');
    await removeMetadata(inputPath, tempFile1);

    await checkCancellation();
    console.log('Modifying video...');
    await modifyVideo(tempFile1, tempFile2);

    await checkCancellation();
    console.log('Adjusting audio...');
    await adjustAudio(tempFile2, tempFile1);

    await checkCancellation();
    console.log('Re-encoding video...');
    await reencodeVideo(tempFile1, tempFile2);

    await checkCancellation();
    console.log('Changing color space...');
    await changeColorSpace(tempFile2, outputPath);

    const md5Hash = await generateMD5(outputPath);

    return { md5Hash, outputPath };
  } catch (error) {
    console.error('Error in processVideo:', error);
    // Clean up output file if it exists and there was an error
    try {
      await fs.access(outputPath, fs.constants.F_OK);
      await fs.unlink(outputPath);
    } catch (cleanupError) {
      // Ignore if file doesn't exist
    }
    throw error;
  } finally {
    // Clean up temp files
    for (const file of tempFiles) {
      try {
        await safeDelete(file);
      } catch (error) {
        console.error(`Error deleting temp file ${file}:`, error);
      }
    }
  }
}

module.exports = {
  processVideo,
  safeDelete
};