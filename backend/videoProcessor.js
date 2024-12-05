
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
    command.outputOptions('-map_metadata', '-1', '-c', 'copy');
  });
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

    await checkCancellation();

    console.log(`Starting video processing for: ${inputPath}`);
    await fs.access(inputPath, fs.constants.R_OK);

    const tempDir = path.dirname(inputPath);
    await fs.access(tempDir, fs.constants.W_OK);

    // check if this is an Instagram reel job
    const isReel = job?.data?.isReel;

    if (isReel) {
      // simplified processing for reels
      const tempFile = path.join(tempDir, `temp_reel_process_${Date.now()}.mp4`);
      tempFiles.push(tempFile);

      if (job) {
        await job.update({ ...job.data, tempFiles });
      }

      console.log('Processing Instagram reel...');

      // step 1: remove metadata (using copy codec for speed)
      await checkCancellation();
      console.log('Removing metadata from reel...');
      await removeMetadata(inputPath, tempFile);

      // step 2: apply minor modifications
      await checkCancellation();
      console.log('Applying modifications to reel...');
      await modifyVideo(tempFile, outputPath);

      const md5Hash = await generateMD5(outputPath);
      return { md5Hash, outputPath };
    }

    // regular video processing with all steps
    const tempFile1 = path.join(tempDir, `temp_video_1_${Date.now()}.mp4`);
    const tempFile2 = path.join(tempDir, `temp_video_2_${Date.now()}.mp4`);
    tempFiles.push(tempFile1, tempFile2);

    if (job) {
      await job.update({ ...job.data, tempFiles });
    }

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
    try {
      await fs.access(outputPath, fs.constants.F_OK);
      await fs.unlink(outputPath);
    } catch (cleanupError) {
      // ignore if file doesn't exist
    }
    throw error;
  } finally {
    // clean up temp files
    for (const file of tempFiles) {
      try {
        await safeDelete(file);
      } catch (error) {
        console.error(`Error deleting temp file ${file}:`, error);
      }
    }
  }
}

async function generateMD5(filePath) {
  const hash = crypto.createHash('md5');
  const data = await fs.readFile(filePath);
  hash.update(data);
  return hash.digest('hex');
}

module.exports = {
  processVideo,
  safeDelete
};