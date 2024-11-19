/* 

// FUNCIONA PERO DESCARGA LOS REELS EN EL CODIGO

// backend/routes/reelRoutes.js

const express = require('express');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Function to download Instagram Reel
async function downloadInstagramReel(reelUrl) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  // Set a user-agent to mimic a real browser
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3');

  try {
    await page.goto(reelUrl, { waitUntil: 'networkidle2' });

    const videoUrl = await page.evaluate(() => {
      const videoElement = document.querySelector('video');
      return videoElement ? videoElement.src : null;
    });

    if (!videoUrl) {
      throw new Error('Unable to find the video on the page.');
    }

    const videoBuffer = await page.evaluate(async (videoUrl) => {
      const response = await fetch(videoUrl);
      const buffer = await response.arrayBuffer();
      return Array.from(new Uint8Array(buffer));
    }, videoUrl);

    const downloadPath = path.join(__dirname, '../Downloads');
    if (!fs.existsSync(downloadPath)) {
      fs.mkdirSync(downloadPath);
    }

    const filePath = path.join(downloadPath, `reel_${Date.now()}.mp4`);
    fs.writeFileSync(filePath, Buffer.from(videoBuffer));
    
    await browser.close();
    return filePath; // Return the file path for download
  } catch (error) {
    await browser.close();
    throw new Error(`Error downloading the reel: ${error.message}`);
  }
}

// Route for downloading Instagram reel
router.post('/download-reel', async (req, res) => {
  const { reelUrl } = req.body;
  
  if (!reelUrl) {
    return res.status(400).json({ error: 'Instagram reel URL is required' });
  }

  try {
    const filePath = await downloadInstagramReel(reelUrl);
    res.download(filePath); // Send the file for download
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
 */


/* // backend/routes/reelRoutes.js

const express = require('express');
const puppeteer = require('puppeteer');
const stream = require('stream');

const router = express.Router();

// Function to download Instagram Reel
async function downloadInstagramReel(req, res) {
  const reelUrl = req.body.reelUrl; // Get the reel URL from the request
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Set a user-agent to mimic a real browser
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3');

  try {
    // Navigate to the Instagram reel page
    await page.goto(reelUrl, { waitUntil: 'networkidle2' });

    // Extract the reel video URL
    const videoUrl = await page.evaluate(() => {
      const videoElement = document.querySelector('video');
      return videoElement ? videoElement.src : null;
    });

    if (!videoUrl) {
      return res.status(400).json({ message: 'Unable to find the video on the page.' });
    }

    // Fetch the video content in memory
    const videoBuffer = await page.evaluate(async (videoUrl) => {
      const response = await fetch(videoUrl);
      const buffer = await response.arrayBuffer();
      return Array.from(new Uint8Array(buffer));
    }, videoUrl);

    // Convert the buffer array to a Node.js buffer and stream it back to the client
    const buffer = Buffer.from(videoBuffer);
    const readableStream = new stream.PassThrough();
    readableStream.end(buffer);

    // Set headers for file download
    res.setHeader('Content-Disposition', `attachment; filename=reel_${Date.now()}.mp4`);
    res.setHeader('Content-Type', 'video/mp4');
    readableStream.pipe(res);

  } catch (error) {
    console.error(`Error downloading the reel: ${error}`);
    res.status(500).json({ message: 'Error downloading the reel.' });
  } finally {
    await browser.close();
  }
}

// Route to handle download requests
router.post('/download-reel', downloadInstagramReel);

module.exports = router;

 */

/* const express = require('express');
const puppeteer = require('puppeteer');
const stream = require('stream');

const router = express.Router();

// Retry logic for page navigation
async function downloadInstagramReel(req, res) {
    const reelUrl = req.body.reelUrl;
    
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3');

    try {
        let attempt = 0;
        const maxAttempts = 3;
        let success = false;

        while (!success && attempt < maxAttempts) {
            try {
            await page.goto(reelUrl, { waitUntil: 'networkidle2', timeout: 60000 });
            success = true;
            } catch (e) {
                console.log(`Attempt ${attempt + 1} failed, retrying...`);
                attempt++;
                if (attempt === maxAttempts) {
                    throw e;
                }
            }
        }

        const videoUrl = await page.evaluate(() => {
        const videoElement = document.querySelector('video');
        return videoElement ? videoElement.src : null;
        });

        if (!videoUrl) {
            return res.status(400).json({ message: 'Unable to find the video on the page.' });
        }

        const videoBuffer = await page.evaluate(async (videoUrl) => {
            const response = await fetch(videoUrl);
            const buffer = await response.arrayBuffer();
            return Array.from(new Uint8Array(buffer));
        }, videoUrl);

        const buffer = Buffer.from(videoBuffer);
        const readableStream = new stream.PassThrough();
        readableStream.end(buffer);

        res.setHeader('Content-Disposition', `attachment; filename=reel_${Date.now()}.mp4`);
        res.setHeader('Content-Type', 'video/mp4');
        readableStream.pipe(res);

    } catch (error) {
            console.error(`Error downloading the reel: ${error}`);
            res.status(500).json({ message: 'Error downloading the reel.' });
        } finally {
        await browser.close();
        }
}

// Route to handle download requests
router.post('/download-reel', downloadInstagramReel);

module.exports = router;
 */

/* const express = require('express');
const puppeteer = require('puppeteer');
const stream = require('stream');

const router = express.Router();

// Function to validate Instagram Reel URL
const isValidInstagramUrl = (url) => {
    const regex = /^(https?:\/\/)?(www\.)?instagram\.com\/reel\/[A-Za-z0-9_-]+\/?(?:\?.*)?$/;
    return regex.test(url);
};

// Retry logic for page navigation
async function downloadInstagramReel(req, res) {
    const reelUrl = req.body.reelUrl;

    // Validate if the Instagram reel URL is valid
    if (!isValidInstagramUrl(reelUrl)) {
        return res.status(400).json({ message: 'Invalid Instagram reel URL.' });
    }

    //const browser = await puppeteer.launch({ headless: true }); 
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu',
            '--no-first-run',
            '--no-zygote',
            '--single-process', // Limits Puppeteer to a single process
            '--disable-background-networking', // Reduce network activity
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-breakpad',
            '--disable-client-side-phishing-detection',
            '--disable-default-apps',
            '--disable-extensions',
            '--disable-hang-monitor',
            '--disable-popup-blocking',
            '--disable-prompt-on-repost',
            '--disable-sync',
            '--disable-translate',
            '--metrics-recording-only',
            '--mute-audio',
            '--no-pings',
            '--disable-component-update',
            '--disable-features=TranslateUI'
        ]
    });
    const page = await browser.newPage();
    
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3');

    try {
        let attempt = 0;
        const maxAttempts = 3;
        let success = false;

        while (!success && attempt < maxAttempts) {
            try {
                await page.goto(reelUrl, { waitUntil: 'networkidle2', timeout: 60000 });
                success = true;
            } catch (e) {
                console.log(`Attempt ${attempt + 1} failed, retrying...`);
                attempt++;
                if (attempt === maxAttempts) {
                    throw e;
                }
            }
        }

        const videoUrl = await page.evaluate(() => {
            const videoElement = document.querySelector('video');
            return videoElement ? videoElement.src : null;
        });

        if (!videoUrl) {
            return res.status(400).json({ message: 'Unable to find the video on the page.' });
        }

        const videoBuffer = await page.evaluate(async (videoUrl) => {
            const response = await fetch(videoUrl);
            const buffer = await response.arrayBuffer();
            return Array.from(new Uint8Array(buffer));
        }, videoUrl);

        const buffer = Buffer.from(videoBuffer);
        const readableStream = new stream.PassThrough();
        readableStream.end(buffer);

        res.setHeader('Content-Disposition', `attachment; filename=reel_${Date.now()}.mp4`);
        res.setHeader('Content-Type', 'video/mp4');
        readableStream.pipe(res);

    } catch (error) {
        console.error(`Error downloading the reel: ${error}`);
        res.status(500).json({ message: 'Error downloading the reel.' });
    } finally {
        await browser.close();
    }
}

// Route to handle download requests
router.post('/download-reel', downloadInstagramReel);

module.exports = router;


 */


/* // CON OPCION DE CLEAN METADATA 


const express = require('express');
const puppeteer = require('puppeteer');
const stream = require('stream');
const path = require('path');
const fs = require('fs');
const { processVideo } = require('../videoProcessor');

const router = express.Router();

// Function to validate Instagram Reel URL
const isValidInstagramUrl = (url) => {
    const regex = /^(https?:\/\/)?(www\.)?instagram\.com\/reel\/[A-Za-z0-9_-]+\/?(?:\?.*)?$/;
    return regex.test(url);
};

// Retry logic for page navigation
async function downloadInstagramReel(req, res) {
    const reelUrl = req.body.reelUrl;
    const cleanMetadata = req.body.cleanMetadata;

    // Validate if the Instagram reel URL is valid
    if (!isValidInstagramUrl(reelUrl)) {
        return res.status(400).json({ message: 'Invalid Instagram reel URL.' });
    }

    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu',
            '--no-first-run',
            '--no-zygote',
            '--single-process', // Limits Puppeteer to a single process
            '--disable-background-networking', // Reduce network activity
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-breakpad',
            '--disable-client-side-phishing-detection',
            '--disable-default-apps',
            '--disable-extensions',
            '--disable-hang-monitor',
            '--disable-popup-blocking',
            '--disable-prompt-on-repost',
            '--disable-sync',
            '--disable-translate',
            '--metrics-recording-only',
            '--mute-audio',
            '--no-pings',
            '--disable-component-update',
            '--disable-features=TranslateUI'
        ]
    });
    const page = await browser.newPage();
    
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3');

    try {
        let attempt = 0;
        const maxAttempts = 3;
        let success = false;

        while (!success && attempt < maxAttempts) {
            try {
                await page.goto(reelUrl, { waitUntil: 'networkidle2', timeout: 60000 });
                success = true;
            } catch (e) {
                console.log(`Attempt ${attempt + 1} failed, retrying...`);
                attempt++;
                if (attempt === maxAttempts) {
                    throw e;
                }
            }
        }

        const videoUrl = await page.evaluate(() => {
            const videoElement = document.querySelector('video');
            return videoElement ? videoElement.src : null;
        });

        if (!videoUrl) {
            return res.status(400).json({ message: 'Unable to find the video on the page.' });
        }

        const videoBuffer = await page.evaluate(async (videoUrl) => {
            const response = await fetch(videoUrl);
            const buffer = await response.arrayBuffer();
            return Array.from(new Uint8Array(buffer));
        }, videoUrl);

        const buffer = Buffer.from(videoBuffer);
        
        // Save the downloaded video to a temporary file
        const tempFilePath = path.join(__dirname, '../uploads', `temp_reel_${Date.now()}.mp4`);
        fs.writeFileSync(tempFilePath, buffer);

        if (cleanMetadata) {
            // Process the video to clean metadata
            const outputFilePath = path.join(__dirname, '../uploads', `processed_reel_${Date.now()}.mp4`);
            await processVideo(tempFilePath, outputFilePath);

            // Send the processed video
            res.download(outputFilePath, 'processed_reel.mp4', (err) => {
                if (err) {
                    console.error('Error sending the processed file:', err);
                }
                // Cleanup
                fs.unlinkSync(tempFilePath);
                fs.unlinkSync(outputFilePath);
            });
        } else {
            // Send the original video without processing
            res.download(tempFilePath, 'reel.mp4', (err) => {
                if (err) {
                    console.error('Error sending the file:', err);
                }
                // Cleanup
                fs.unlinkSync(tempFilePath);
            });
        }

    } catch (error) {
        console.error(`Error downloading the reel: ${error}`);
        res.status(500).json({ message: 'Error downloading the reel.' });
    } finally {
        await browser.close();
    }
}

// Route to handle download requests
router.post('/download-reel', downloadInstagramReel);

module.exports = router; */


/* 

// CON CLEANMETADATA Y CONSOLE LOGS PARA VER PROCESO

const express = require('express');
const puppeteer = require('puppeteer');
const stream = require('stream');
const path = require('path');
const fs = require('fs');
const { processVideo } = require('../videoProcessor');

const router = express.Router();

// Function to validate Instagram Reel URL
const isValidInstagramUrl = (url) => {
    const regex = /^(https?:\/\/)?(www\.)?instagram\.com\/reel\/[A-Za-z0-9_-]+\/?(?:\?.*)?$/;
    return regex.test(url);
};

// Retry logic for page navigation
async function downloadInstagramReel(req, res) {
    console.log('Starting Instagram reel download process');
    const reelUrl = req.body.reelUrl;
    const cleanMetadata = req.body.cleanMetadata;
    console.log(`Reel URL: ${reelUrl}`);
    console.log(`Clean metadata option: ${cleanMetadata}`);

    // Validate if the Instagram reel URL is valid
    if (!isValidInstagramUrl(reelUrl)) {
        console.log('Invalid Instagram reel URL');
        return res.status(400).json({ message: 'Invalid Instagram reel URL.' });
    }

    console.log('Launching browser');
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu',
            '--no-first-run',
            '--no-zygote',
            '--single-process', // Limits Puppeteer to a single process
            '--disable-background-networking', // Reduce network activity
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-breakpad',
            '--disable-client-side-phishing-detection',
            '--disable-default-apps',
            '--disable-extensions',
            '--disable-hang-monitor',
            '--disable-popup-blocking',
            '--disable-prompt-on-repost',
            '--disable-sync',
            '--disable-translate',
            '--metrics-recording-only',
            '--mute-audio',
            '--no-pings',
            '--disable-component-update',
            '--disable-features=TranslateUI'
        ]
    });
    const page = await browser.newPage();
    
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3');

    try {
        let attempt = 0;
        const maxAttempts = 3;
        let success = false;

        while (!success && attempt < maxAttempts) {
            try {
                console.log(`Attempt ${attempt + 1} to navigate to reel URL`);
                await page.goto(reelUrl, { waitUntil: 'networkidle2', timeout: 60000 });
                success = true;
                console.log('Successfully navigated to reel URL');
            } catch (e) {
                console.log(`Attempt ${attempt + 1} failed, retrying...`);
                attempt++;
                if (attempt === maxAttempts) {
                    throw e;
                }
            }
        }

        console.log('Extracting video URL');
        const videoUrl = await page.evaluate(() => {
            const videoElement = document.querySelector('video');
            return videoElement ? videoElement.src : null;
        });

        if (!videoUrl) {
            console.log('Unable to find video on the page');
            return res.status(400).json({ message: 'Unable to find the video on the page.' });
        }
        console.log(`Video URL found: ${videoUrl}`);

        console.log('Downloading video buffer');
        const videoBuffer = await page.evaluate(async (videoUrl) => {
            const response = await fetch(videoUrl);
            const buffer = await response.arrayBuffer();
            return Array.from(new Uint8Array(buffer));
        }, videoUrl);

        const buffer = Buffer.from(videoBuffer);
        
        // Save the downloaded video to a temporary file
        const tempFilePath = path.join(__dirname, '../uploads', `temp_reel_${Date.now()}.mp4`);
        console.log(`Saving temporary file: ${tempFilePath}`);
        fs.writeFileSync(tempFilePath, buffer);

        if (cleanMetadata) {
            console.log('Cleaning metadata requested, processing video');
            // Process the video to clean metadata
            const outputFilePath = path.join(__dirname, '../uploads', `processed_reel_${Date.now()}.mp4`);
            console.log(`Processing video, output file: ${outputFilePath}`);
            await processVideo(tempFilePath, outputFilePath);

            console.log('Sending processed video to client');
            // Send the processed video
            res.download(outputFilePath, 'processed_reel.mp4', (err) => {
                if (err) {
                    console.error('Error sending the processed file:', err);
                }
                console.log('Cleaning up temporary files');
                // Cleanup
                fs.unlinkSync(tempFilePath);
                fs.unlinkSync(outputFilePath);
            });
        } else {
            console.log('Sending original video to client without processing');
            // Send the original video without processing
            res.download(tempFilePath, 'reel.mp4', (err) => {
                if (err) {
                    console.error('Error sending the file:', err);
                }
                console.log('Cleaning up temporary file');
                // Cleanup
                fs.unlinkSync(tempFilePath);
            });
        }

    } catch (error) {
        console.error(`Error downloading the reel: ${error}`);
        res.status(500).json({ message: 'Error downloading the reel.' });
    } finally {
        console.log('Closing browser');
        await browser.close();
    }
}

// Route to handle download requests
router.post('/download-reel', downloadInstagramReel);

module.exports = router; */


//WORKS
/* const express = require('express');
const puppeteer = require('puppeteer');
const stream = require('stream');
const path = require('path');
const fs = require('fs');
const { processVideo } = require('../videoProcessor');

const router = express.Router();

// Function to validate Instagram Reel URL
const isValidInstagramUrl = (url) => {
    const regex = /^(https?:\/\/)?(www\.)?instagram\.com\/reel\/[A-Za-z0-9_-]+\/?(?:\?.*)?$/;
    return regex.test(url);
};

// Retry logic for page navigation
async function downloadInstagramReel(req, res) {
    console.log('Starting Instagram reel download process');
    const reelUrl = req.body.reelUrl;
    const cleanMetadata = req.body.cleanMetadata;
    console.log(`Reel URL: ${reelUrl}`);
    console.log(`Clean metadata option: ${cleanMetadata}`);

    // Validate if the Instagram reel URL is valid
    if (!isValidInstagramUrl(reelUrl)) {
        console.log('Invalid Instagram reel URL');
        return res.status(400).json({ message: 'Invalid Instagram reel URL.' });
    }

    let browser;
    try {
        console.log('Launching browser');
        browser = await puppeteer.launch({
            headless: "new",
            args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu',
            '--no-first-run',
            '--no-zygote',
            '--single-process', // Limits Puppeteer to a single process
            '--disable-background-networking', // Reduce network activity
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-breakpad',
            '--disable-client-side-phishing-detection',
            '--disable-default-apps',
            '--disable-extensions',
            '--disable-hang-monitor',
            '--disable-popup-blocking',
            '--disable-prompt-on-repost',
            '--disable-sync',
            '--disable-translate',
            '--metrics-recording-only',
            '--mute-audio',
            '--no-pings',
            '--disable-component-update',
            '--disable-features=TranslateUI'
            ]
        });
        const page = await browser.newPage();
        
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3');

        let attempt = 0;
        const maxAttempts = 3;
        let success = false;

        while (!success && attempt < maxAttempts) {
            try {
                console.log(`Attempt ${attempt + 1} to navigate to reel URL`);
                await page.goto(reelUrl, { waitUntil: 'networkidle2', timeout: 60000 });
                success = true;
                console.log('Successfully navigated to reel URL');
            } catch (e) {
                console.log(`Attempt ${attempt + 1} failed, retrying...`);
                attempt++;
                if (attempt === maxAttempts) {
                    throw e;
                }
            }
        }

        console.log('Extracting video URL');
        const videoUrl = await page.evaluate(() => {
            const videoElement = document.querySelector('video');
            return videoElement ? videoElement.src : null;
        });

        if (!videoUrl) {
            console.log('Unable to find video on the page');
            return res.status(400).json({ message: 'Unable to find the video on the page.' });
        }
        console.log(`Video URL found: ${videoUrl}`);

        console.log('Downloading video buffer');
        const videoBuffer = await page.evaluate(async (videoUrl) => {
            const response = await fetch(videoUrl);
            const buffer = await response.arrayBuffer();
            return Array.from(new Uint8Array(buffer));
        }, videoUrl);

        const buffer = Buffer.from(videoBuffer);
        
        // Save the downloaded video to a temporary file
        const tempFilePath = path.join(__dirname, '../uploads', `temp_reel_${Date.now()}.mp4`);
        console.log(`Saving temporary file: ${tempFilePath}`);
        fs.writeFileSync(tempFilePath, buffer);

        if (cleanMetadata) {
            console.log('Cleaning metadata requested, processing video');
            // Process the video to clean metadata
            const outputFilePath = path.join(__dirname, '../uploads', `processed_reel_${Date.now()}.mp4`);
            console.log(`Processing video, output file: ${outputFilePath}`);
            await processVideo(tempFilePath, outputFilePath);

            console.log('Sending processed video to client');
            // Send the processed video
            res.download(outputFilePath, 'processed_reel.mp4', (err) => {
                if (err) {
                    console.error('Error sending the processed file:', err);
                }
                console.log('Cleaning up temporary files');
                // Cleanup
                fs.unlinkSync(tempFilePath);
                fs.unlinkSync(outputFilePath);
            });
        } else {
            console.log('Sending original video to client without processing');
            // Send the original video without processing
            res.download(tempFilePath, 'reel.mp4', (err) => {
                if (err) {
                    console.error('Error sending the file:', err);
                }
                console.log('Cleaning up temporary file');
                // Cleanup
                fs.unlinkSync(tempFilePath);
            });
        }

    } catch (error) {
        console.error(`Error downloading the reel: ${error.stack}`);
        res.status(500).json({ message: 'Error downloading the reel.', error: error.message });
    } finally {
        if (browser) {
            console.log('Closing browser');
            await browser.close();
        }
    }
}

// Route to handle download requests
router.post('/download-reel', downloadInstagramReel);

module.exports = router;
 */


/* const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs').promises;
const { processVideo } = require('../videoProcessor');

const router = express.Router();

// Function to validate Instagram Reel URL
const isValidInstagramUrl = (url) => {
    const regex = /^(https?:\/\/)?(www\.)?instagram\.com\/reel\/[A-Za-z0-9_-]+\/?(?:\?.*)?$/;
    return regex.test(url);
};

// Main function to download Instagram Reel
async function downloadInstagramReel(req, res) {
    console.log('Starting Instagram reel download process');
    const reelUrl = req.body.reelUrl;
    const cleanMetadata = req.body.cleanMetadata;
    console.log(`Reel URL: ${reelUrl}`);
    console.log(`Clean metadata option: ${cleanMetadata}`);

    if (!isValidInstagramUrl(reelUrl)) {
        console.log('Invalid Instagram reel URL');
        return res.status(400).json({ message: 'Invalid Instagram reel URL.' });
    }

    let browser;
    let tempFilePath;
    let outputFilePath;

    try {
        console.log('Launching browser');
        browser = await puppeteer.launch({
            headless: "new",
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--disable-gpu',
                '--no-first-run',
                '--no-zygote',
                '--single-process',
                '--disable-background-networking',
                '--disable-background-timer-throttling',
                '--disable-backgrounding-occluded-windows',
                '--disable-breakpad',
                '--disable-client-side-phishing-detection',
                '--disable-default-apps',
                '--disable-extensions',
                '--disable-hang-monitor',
                '--disable-popup-blocking',
                '--disable-prompt-on-repost',
                '--disable-sync',
                '--disable-translate',
                '--metrics-recording-only',
                '--mute-audio',
                '--no-pings',
                '--disable-component-update',
                '--disable-features=TranslateUI'
            ],
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium'
        });

        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(60000);
        console.log('New page created');

        try {
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3');
            console.log('User agent set');

            let attempt = 0;
            const maxAttempts = 3;
            let success = false;

            while (!success && attempt < maxAttempts) {
                try {
                    console.log(`Attempt ${attempt + 1} to navigate to reel URL`);
                    await page.goto(reelUrl, { waitUntil: 'networkidle2', timeout: 60000 });
                    success = true;
                    console.log('Successfully navigated to reel URL');
                } catch (e) {
                    console.log(`Attempt ${attempt + 1} failed, retrying...`);
                    attempt++;
                    if (attempt === maxAttempts) {
                        throw e;
                    }
                    await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds before retrying
                }
            }

            console.log('Extracting video URL');
            const videoUrl = await page.evaluate(() => {
                const videoElement = document.querySelector('video');
                if (!videoElement) {
                    console.log('Video element not found');
                    return null;
                }
                console.log('Video element found');
                return videoElement.src || videoElement.querySelector('source')?.src;
            });

            if (!videoUrl) {
                console.log('Unable to find video on the page');
                return res.status(400).json({ message: 'Unable to find the video on the page.' });
            }
            console.log(`Video URL found: ${videoUrl}`);

            console.log('Downloading video buffer');
            const videoBuffer = await page.evaluate(async (videoUrl) => {
                const response = await fetch(videoUrl);
                const buffer = await response.arrayBuffer();
                return Array.from(new Uint8Array(buffer));
            }, videoUrl);

            const buffer = Buffer.from(videoBuffer);
            
            tempFilePath = path.join(__dirname, '../uploads', `temp_reel_${Date.now()}.mp4`);
            console.log(`Saving temporary file: ${tempFilePath}`);
            await fs.writeFile(tempFilePath, buffer);

            if (cleanMetadata) {
                console.log('Cleaning metadata requested, processing video');
                outputFilePath = path.join(__dirname, '../uploads', `processed_reel_${Date.now()}.mp4`);
                console.log(`Processing video, output file: ${outputFilePath}`);
                await processVideo(tempFilePath, outputFilePath);

                console.log('Sending processed video to client');
                res.download(outputFilePath, 'processed_reel.mp4', async (err) => {
                    if (err) {
                        console.error('Error sending the processed file:', err);
                    }
                    console.log('Cleaning up temporary files');
                    try {
                        await fs.unlink(tempFilePath);
                        await fs.unlink(outputFilePath);
                        console.log('Temporary files deleted');
                    } catch (unlinkError) {
                        console.error('Error deleting temporary files:', unlinkError);
                    }
                });
            } else {
                console.log('Sending original video to client without processing');
                res.download(tempFilePath, 'reel.mp4', async (err) => {
                    if (err) {
                        console.error('Error sending the file:', err);
                    }
                    console.log('Cleaning up temporary file');
                    try {
                        await fs.unlink(tempFilePath);
                        console.log('Temporary file deleted');
                    } catch (unlinkError) {
                        console.error('Error deleting temporary file:', unlinkError);
                    }
                });
            }
        } catch (pageError) {
            console.error(`Error in page operations: ${pageError.message}`);
            console.error(pageError.stack);
            throw pageError;
        } finally {
            await page.close();
            console.log('Page closed');
        }
    } catch (error) {
        console.error(`Error downloading the reel: ${error.message}`);
        console.error(`Stack trace: ${error.stack}`);
        if (!res.headersSent) {
            res.status(500).json({ message: 'Error downloading the reel.', error: error.message });
        }
    } finally {
        if (browser) {
            console.log('Closing browser');
            await browser.close();
        }
    }
}

// Route to handle download requests
router.post('/download-reel', async (req, res) => {
    const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Operation timed out')), 300000) // 5 minutes
    );

    try {
        await Promise.race([downloadInstagramReel(req, res), timeoutPromise]);
    } catch (error) {
        if (error.message === 'Operation timed out') {
            console.error('The operation timed out');
            if (!res.headersSent) {
                res.status(504).json({ message: 'The operation timed out.' });
            }
        } else {
            console.error(`Unexpected error: ${error.message}`);
            console.error(error.stack);
            if (!res.headersSent) {
                res.status(500).json({ message: 'An unexpected error occurred.', error: error.message });
            }
        }
    }
});

module.exports = router;

 */


/* const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs').promises;
const { processVideo } = require('../videoProcessor');
const { videoQueue } = require('../queue');

const router = express.Router();

// Function to validate Instagram Reel URL
const isValidInstagramUrl = (url) => {
    const regex = /^(https?:\/\/)?(www\.)?instagram\.com\/reel\/[A-Za-z0-9_-]+\/?(?:\?.*)?$/;
    return regex.test(url);
};

// Helper function to verify file existence
const verifyFile = async (filePath) => {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
};

// Main function to download Instagram Reel
async function downloadInstagramReel(req, res) {
    console.log('Starting Instagram reel download process');
    const reelUrl = req.body.reelUrl;
    const cleanMetadata = req.body.cleanMetadata;
    console.log(`Reel URL: ${reelUrl}`);
    console.log(`Clean metadata option: ${cleanMetadata}`);

    if (!isValidInstagramUrl(reelUrl)) {
        console.log('Invalid Instagram reel URL');
        return res.status(400).json({ message: 'Invalid Instagram reel URL.' });
    }

    let browser;
    let tempFilePath;
    let outputFilePath;
    let job;

    try {
        console.log('Launching browser');
        browser = await puppeteer.launch({
            headless: "new",
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--disable-gpu',
                '--no-first-run',
                '--no-zygote',
                '--single-process',
                '--disable-background-networking',
                '--disable-background-timer-throttling',
                '--disable-backgrounding-occluded-windows',
                '--disable-breakpad',
                '--disable-client-side-phishing-detection',
                '--disable-default-apps',
                '--disable-extensions',
                '--disable-hang-monitor',
                '--disable-popup-blocking',
                '--disable-prompt-on-repost',
                '--disable-sync',
                '--disable-translate',
                '--metrics-recording-only',
                '--mute-audio',
                '--no-pings',
                '--disable-component-update',
                '--disable-features=TranslateUI'
            ],
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium'
        });

        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(60000);
        console.log('New page created');

        try {
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3');
            console.log('User agent set');

            let attempt = 0;
            const maxAttempts = 3;
            let success = false;

            while (!success && attempt < maxAttempts) {
                try {
                    console.log(`Attempt ${attempt + 1} to navigate to reel URL`);
                    await page.goto(reelUrl, { waitUntil: 'networkidle2', timeout: 60000 });
                    success = true;
                    console.log('Successfully navigated to reel URL');
                } catch (e) {
                    console.log(`Attempt ${attempt + 1} failed, retrying...`);
                    attempt++;
                    if (attempt === maxAttempts) {
                        throw e;
                    }
                    await new Promise(resolve => setTimeout(resolve, 5000));
                }
            }

            console.log('Extracting video URL');
            const videoUrl = await page.evaluate(() => {
                const videoElement = document.querySelector('video');
                if (!videoElement) {
                    console.log('Video element not found');
                    return null;
                }
                console.log('Video element found');
                return videoElement.src || videoElement.querySelector('source')?.src;
            });

            if (!videoUrl) {
                console.log('Unable to find video on the page');
                return res.status(400).json({ message: 'Unable to find the video on the page.' });
            }
            console.log(`Video URL found: ${videoUrl}`);

            console.log('Downloading video buffer');
            const videoBuffer = await page.evaluate(async (videoUrl) => {
                const response = await fetch(videoUrl);
                const buffer = await response.arrayBuffer();
                return Array.from(new Uint8Array(buffer));
            }, videoUrl);

            const buffer = Buffer.from(videoBuffer);
            
            tempFilePath = path.join(__dirname, '../uploads', `temp_reel_${Date.now()}.mp4`);
            console.log(`Saving temporary file: ${tempFilePath}`);
            await fs.writeFile(tempFilePath, buffer);

            if (cleanMetadata) {
                console.log('Cleaning metadata requested, processing video');
                outputFilePath = path.join(__dirname, '../uploads', `processed_reel_${Date.now()}.mp4`);
                
                // Create processing job
                job = await videoQueue.add({
                    inputPath: tempFilePath,
                    outputPath: outputFilePath,
                    isReel: true,
                    originalName: 'instagram_reel.mp4'
                }, {
                    timeout: 300000,
                    attempts: 2,
                    backoff: {
                        type: 'exponential',
                        delay: 2000
                    },
                    removeOnComplete: false // Prevent premature removal
                });

                // Wait for job completion with improved monitoring
                await new Promise((resolve, reject) => {
                    let lastState = null;
                    let completed = false;
                    let processingTimeout;

                    const cleanup = () => {
                        if (processingTimeout) {
                            clearTimeout(processingTimeout);
                        }
                    };

                    // Set overall processing timeout
                    processingTimeout = setTimeout(() => {
                        cleanup();
                        reject(new Error('Processing timeout'));
                    }, 240000); // 4 minutes

                    const checkJob = async () => {
                        try {
                            if (completed) return;

                            const currentJob = await videoQueue.getJob(job.id);
                            
                            // Check if job completed and output file exists
                            if (!currentJob) {
                                const fileExists = await verifyFile(outputFilePath);
                                if (fileExists) {
                                    completed = true;
                                    cleanup();
                                    resolve();
                                    return;
                                }
                                reject(new Error('Job completed but output file not found'));
                                return;
                            }

                            const state = await currentJob.getState();
                            const progress = await currentJob.progress();

                            // Log state changes
                            if (state !== lastState) {
                                console.log(`Job ${job.id} state changed to: ${state}`);
                                lastState = state;
                            }

                            // Check job status
                            switch (state) {
                                case 'completed':
                                    const fileExists = await verifyFile(outputFilePath);
                                    if (fileExists) {
                                        completed = true;
                                        cleanup();
                                        resolve(currentJob);
                                        return;
                                    }
                                    reject(new Error('Job completed but output file not found'));
                                    return;
                                case 'failed':
                                    cleanup();
                                    reject(new Error(currentJob.failedReason || 'Job failed'));
                                    return;
                                case 'stuck':
                                    cleanup();
                                    reject(new Error('Job is stuck'));
                                    return;
                                default:
                                    console.log(`Processing: ${progress}%`);
                                    setTimeout(checkJob, 1000);
                            }
                        } catch (error) {
                            if (!completed) {
                                cleanup();
                                reject(error);
                            }
                        }
                    };

                    // Start checking
                    checkJob();
                });

                // Verify and send file
                console.log('Verifying processed file...');
                const fileExists = await verifyFile(outputFilePath);
                if (!fileExists) {
                    throw new Error('Processed file not found');
                }

                console.log('Sending processed file to client');
                res.download(outputFilePath, 'processed_reel.mp4', async (err) => {
                    if (err) {
                        console.error('Error sending the processed file:', err);
                    }
                    console.log('Cleaning up files after download');
                    await Promise.all([
                        fs.unlink(tempFilePath).catch(e => console.error('Error deleting temp file:', e)),
                        fs.unlink(outputFilePath).catch(e => console.error('Error deleting output file:', e))
                    ]);
                    
                    if (job) {
                        try {
                            const jobInstance = await videoQueue.getJob(job.id);
                            if (jobInstance) {
                                await jobInstance.remove();
                                console.log('Job cleaned up');
                            }
                        } catch (error) {
                            console.error('Error cleaning up job:', error);
                        }
                    }
                });
            } else {
                console.log('Sending original video to client without processing');
                res.download(tempFilePath, 'reel.mp4', async (err) => {
                    if (err) {
                        console.error('Error sending the file:', err);
                    }
                    console.log('Cleaning up temporary file');
                    try {
                        await fs.unlink(tempFilePath);
                        console.log('Temporary file deleted');
                    } catch (unlinkError) {
                        console.error('Error deleting temporary file:', unlinkError);
                    }
                });
            }
        } catch (pageError) {
            console.error(`Error in page operations: ${pageError.message}`);
            console.error(pageError.stack);
            throw pageError;
        } finally {
            await page.close();
            console.log('Page closed');
        }
    } catch (error) {
        console.error(`Error downloading the reel: ${error.message}`);
        console.error(`Stack trace: ${error.stack}`);
        
        // Enhanced cleanup
        try {
            if (tempFilePath) {
                await verifyFile(tempFilePath) && await fs.unlink(tempFilePath);
            }
            if (outputFilePath) {
                await verifyFile(outputFilePath) && await fs.unlink(outputFilePath);
            }
            if (job) {
                const jobInstance = await videoQueue.getJob(job.id);
                if (jobInstance) {
                    await jobInstance.remove();
                }
            }
        } catch (cleanupError) {
            console.error('Error during cleanup:', cleanupError);
        }

        if (!res.headersSent) {
            res.status(500).json({ 
                message: 'Error processing the reel.',
                error: error.message 
            });
        }
    } finally {
        if (browser) {
            console.log('Closing browser');
            await browser.close();
        }
    }
}

// Route to handle download requests
router.post('/download-reel', async (req, res) => {
    const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Operation timed out')), 300000) // 5 minutes
    );

    try {
        await Promise.race([downloadInstagramReel(req, res), timeoutPromise]);
    } catch (error) {
        if (error.message === 'Operation timed out') {
            console.error('The operation timed out');
            if (!res.headersSent) {
                res.status(504).json({ message: 'The operation timed out.' });
            }
        } else {
            console.error(`Unexpected error: ${error.message}`);
            console.error(error.stack);
            if (!res.headersSent) {
                res.status(500).json({ message: 'An unexpected error occurred.', error: error.message });
            }
        }
    }
});

module.exports = router; */

const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');
const { processVideo } = require('../videoProcessor');
const { videoQueue } = require('../queue');

const router = express.Router();

// Utility functions
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));


const getBackoffDelay = (attempt) => {
    return Math.min(1000 * Math.pow(2, attempt), 30000);
};

// Function to validate Instagram Reel URL
const isValidInstagramUrl = (url) => {
    const regex = /^(https?:\/\/)?(www\.)?instagram\.com\/reel\/[A-Za-z0-9_-]+\/?(?:\?.*)?$/;
    return regex.test(url);
};

// Helper function to verify file existence
const verifyFile = async (filePath) => {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
};

// Browser creation helper
// Simplified browser creation
async function createBrowser() {
    return await puppeteer.launch({
        headless: "new",
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-web-security',
            '--disable-features=IsolateOrigins',
            '--disable-site-isolation-trials',
            '--ignore-certificate-errors',
            '--disable-features=site-per-process',
            '--window-size=1920,1080',
            '--user-data-dir=/tmp/chrome-data'
        ],
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium',
        ignoreHTTPSErrors: true,
        timeout: 60000,
    });
}

const getContentLength = async (url) => {
    try {
        const response = await fetch(url, {
            method: 'HEAD',
            headers: {
                'Accept': 'video/mp4,video/*;q=0.9,*/*;q=0.8',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        return parseInt(response.headers.get('content-length') || '0');
    } catch (error) {
        console.error('Error getting content length:', error);
        return 0;
    }
};

// Add this function near the top of your file
async function waitForContent(page, timeout = 10000) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
        const content = await page.evaluate(() => {
            // Check for video element
            const video = document.querySelector('video');
            if (video) return true;
            
            // Check for error messages
            const errorTexts = ['Sorry, this page is not available.', 'Please wait a few minutes'];
            for (const text of errorTexts) {
                if (document.body.innerText.includes(text)) return false;
            }
            
            return null; // Still loading
        });
        
        if (content === true) return true;
        if (content === false) return false;
        await page.waitForTimeout(1000);
    }
    
    return false;
}

// Page creation helper
async function createPage(browser) {
    const page = await browser.newPage();
    
    await Promise.all([
        page.setViewport({ width: 1920, height: 1080 }),
        page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'),
        page.setExtraHTTPHeaders({
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
        })
    ]);

    // Only block unwanted resources
    await page.setRequestInterception(true);
    page.on('request', req => {
        if (['image', 'stylesheet', 'font'].includes(req.resourceType())) {
            req.abort();
        } else {
            req.continue();
        }
    });

    return page;
}

// Improved navigation with popup handling
async function navigateToReel(page, url, maxAttempts = 3) {
    let lastError;
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
            // Clear storage and cookies
            await page.evaluate(() => {
                try {
                    localStorage.clear();
                    sessionStorage.clear();
                    document.cookie.split(";").forEach(c => {
                        document.cookie = c.replace(/^ +/, "")
                            .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                    });
                } catch (e) {}
            });

            // Navigate to page
            await page.goto(url, { 
                waitUntil: 'networkidle0',
                timeout: 60000
            });

            // Handle login popup
            try {
                await page.waitForSelector('[role="dialog"]', { timeout: 3000 });
                await page.evaluate(() => {
                    document.querySelectorAll('button').forEach(button => {
                        if (button.textContent.includes('Not Now') || 
                            button.textContent.includes('Close')) {
                            button.click();
                        }
                    });
                });
            } catch (e) {} // No popup found

            // Wait for video
            await Promise.race([
                page.waitForSelector('video'),
                page.waitForFunction(() => {
                    return document.body.innerText.includes('Sorry, this page') ||
                           document.body.innerText.includes('is not available');
                })
            ]);

            // Check if page is available
            const isError = await page.evaluate(() => {
                return document.body.innerText.includes('Sorry, this page') ||
                       document.body.innerText.includes('isn not available');
            });

            if (isError) {
                throw new Error('Video not available');
            }

            // Extra wait for network
            await page.waitForTimeout(3000);
            return true;
        } catch (error) {
            console.error(`Navigation attempt ${attempt + 1} failed:`, error);
            lastError = error;
            
            if (attempt < maxAttempts - 1) {
                await page.waitForTimeout(5000 * (attempt + 1));
            }
        }
    }
    
    throw lastError || new Error('Failed to navigate to reel');
}

// Helper function to handle navigation with better reliability
async function navigateToUrl(page, url, maxAttempts = 5) {
    let attempt = 0;
    while (attempt < maxAttempts) {
        try {
            console.log(`Navigation attempt ${attempt + 1}/${maxAttempts} to: ${url}`);
            
            // Clear storage and cache
            await Promise.all([
                page.evaluate(() => {
                    try {
                        localStorage.clear();
                        sessionStorage.clear();
                        caches?.delete?.();
                    } catch (e) {}
                }),
                page.evaluate(() => {
                    document.cookie.split(";").forEach((c) => {
                        document.cookie = c
                            .replace(/^ +/, "")
                            .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
                    });
                })
            ]).catch(() => {});
            
            // Navigate with proper wait conditions
            await Promise.all([
                page.goto(url, {
                    waitUntil: ['networkidle0', 'domcontentloaded'],
                    timeout: 30000
                }),
                page.waitForFunction(() => document.readyState === 'complete'),
            ]);

            await page.waitForTimeout(2000);
            console.log('Navigation successful');
            return true;
        } catch (error) {
            console.error(`Navigation attempt ${attempt + 1} failed:`, error);
            attempt++;
            
            if (attempt === maxAttempts) {
                throw new Error('Failed to navigate after all attempts');
            }
            
            await page.waitForTimeout(getBackoffDelay(attempt));
        }
    }
    return false;
}

// Helper function for better cleanup
async function cleanup(browser, page, tempFilePath, outputFilePath, job) {
    console.log('Starting cleanup process...');
    
    try {
        // Close page
        if (page && !page.isClosed()) {
            console.log('Closing page...');
            await page.close().catch(e => console.error('Error closing page:', e));
            console.log('Page closed successfully');
        }
        
        // Close browser
        if (browser && browser.isConnected()) {
            console.log('Closing browser...');
            browser.removeAllListeners('disconnected');
            await browser.close().catch(e => console.error('Error closing browser:', e));
            console.log('Browser closed successfully');
        }
        
        // Clean up files
        if (tempFilePath) {
            console.log('Cleaning up temporary file...');
            await fs.unlink(tempFilePath).catch(e => 
                console.error('Error deleting temp file:', e));
        }
        
        if (outputFilePath) {
            console.log('Cleaning up output file...');
            await fs.unlink(outputFilePath).catch(e => 
                console.error('Error deleting output file:', e));
        }
        
        // Clean up job
        if (job) {
            console.log('Cleaning up job...');
            const jobInstance = await videoQueue.getJob(job.id);
            if (jobInstance) {
                await jobInstance.remove();
            }
        }
        
        console.log('Cleanup completed successfully');
    } catch (error) {
        console.error('Error during cleanup:', error);
    }
}

// Helper function to save debug information
async function saveDebugInfo(page, prefix = 'debug') {
    try {
        const timestamp = Date.now();
        const screenshotPath = path.join(__dirname, '../uploads', `${prefix}_screenshot_${timestamp}.png`);
        const htmlPath = path.join(__dirname, '../uploads', `${prefix}_html_${timestamp}.html`);

        await page.screenshot({ path: screenshotPath, fullPage: true });
        const html = await page.content();
        await fs.writeFile(htmlPath, html);

        console.log(`Debug files saved:
Screenshot: ${screenshotPath}
HTML: ${htmlPath}`);
    } catch (error) {
        console.error('Error saving debug info:', error);
    }
}

// Helper to get highest quality video URL
async function getBestVideoUrl(page) {
    const videoUrls = new Map();
    
    // Listen for video responses
    const client = await page.target().createCDPSession();
    await client.send('Network.enable');
    
    return new Promise((resolve) => {
        let resolved = false;
        
        client.on('Network.responseReceived', (event) => {
            const { response } = event;
            if (response.url.includes('cdninstagram.com') && 
                response.url.includes('.mp4') && 
                !response.url.includes('_audio')) {
                
                const url = response.url.split('&bytestart')[0];
                let quality = 0;
                
                // Determine quality
                if (url.includes('_q90') || url.includes('q90')) quality = 90;
                else if (url.includes('_q60') || url.includes('q60')) quality = 60;
                else if (url.includes('_q30') || url.includes('q30')) quality = 30;
                
                videoUrls.set(url, quality);
                
                // Resolve with highest quality found so far
                if (!resolved) {
                    const qualities = Array.from(videoUrls.values());
                    const maxQuality = Math.max(...qualities);
                    const bestUrl = Array.from(videoUrls.entries())
                        .find(([_, q]) => q === maxQuality)?.[0];
                    
                    if (bestUrl) {
                        resolved = true;
                        resolve(bestUrl);
                    }
                }
            }
        });
        
        // Timeout after 10s
        setTimeout(() => {
            if (!resolved) {
                const firstUrl = videoUrls.keys().next().value;
                resolve(firstUrl || null);
            }
        }, 10000);
    });
}

// Helper function to extract video URL with retries and rate limit handling
async function extractVideoUrl(page, maxAttempts = 5) {
    const videoUrls = new Map();
    let client;

    try {
        client = await page.target().createCDPSession();
        await client.send('Network.enable');

        const requestPromise = new Promise((resolve) => {
            client.on('Network.responseReceived', (event) => {
                const { response } = event;
                const url = response.url;
                
                if (url.includes('cdninstagram.com') && 
                    url.includes('.mp4') && 
                    response.mimeType.includes('video')) {
                    const cleanUrl = url.split('&bytestart')[0];
                    videoUrls.set(cleanUrl, response);
                }
            });

            setTimeout(() => resolve(null), 10000); // 10s timeout
        });

        // Wait for network idle
        await Promise.race([
            page.waitForNetworkIdle({idleTime: 1000}),
            requestPromise
        ]);

        // Get best quality URL
        const bestUrl = await getBestVideoUrl(videoUrls);
        if (bestUrl) return bestUrl;

        // If no URL found yet, try page reload
        for (let i = 0; i < maxAttempts && !bestUrl; i++) {
            await page.reload({ waitUntil: 'networkidle0' });
            await page.waitForTimeout(2000);
        }

        return await getBestVideoUrl(videoUrls);
    } finally {
        if (client) {
            await client.detach().catch(() => {});
        }
    }
}

// Helper function to validate video data
function isValidMP4Buffer(buffer) {
    try {
        if (buffer.length < 100 * 1024) return false; // Min 100KB
        
        // Check MP4 header
        const header = buffer.slice(0, 8);
        const size = header.readUInt32BE(0);
        const type = header.slice(4).toString();
        
        if (type !== 'ftyp') return false;
        
        // Check for moov and mdat boxes
        const hasMovieBox = buffer.includes(Buffer.from('moov'));
        const hasMediaBox = buffer.includes(Buffer.from('mdat'));
        
        return hasMovieBox && hasMediaBox;
    } catch (e) {
        console.error('Error validating MP4:', e);
        return false;
    }
}

// Add this rate limit handler
async function handleRateLimit(page, delay = 5000) {
    console.log(`Rate limit hit, waiting ${delay}ms before retry...`);
    await page.waitForTimeout(delay);
    // Clear cookies and cache
    await page.evaluate(() => {
        try {
            localStorage.clear();
            sessionStorage.clear();
            document.cookie.split(";").forEach((c) => {
                document.cookie = c
                    .replace(/^ +/, "")
                    .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
            });
        } catch (e) {}
    });
}

// Helper function to download video buffer with retries
async function downloadVideoBuffer(page, videoUrl, maxAttempts = 3) {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
            // Get content length first
            const { contentLength } = await page.evaluate(async (url) => {
                const response = await fetch(url, {
                    method: 'HEAD',
                    headers: {
                        'Accept': 'video/mp4,video/*;q=0.9,*/*;q=0.8',
                        'Referer': 'https://www.instagram.com/',
                    }
                });
                return { 
                    contentLength: response.headers.get('content-length'),
                    acceptRanges: response.headers.get('accept-ranges')
                };
            }, videoUrl);

            const totalSize = parseInt(contentLength);
            if (!totalSize) throw new Error('Could not determine video size');

            console.log(`Video size: ${totalSize} bytes`);

            // Download in chunks
            const chunkSize = 1024 * 1024; // 1MB chunks
            const chunks = [];
            let downloadedSize = 0;

            for (let start = 0; start < totalSize; start += chunkSize) {
                const end = Math.min(start + chunkSize - 1, totalSize - 1);
                
                const chunk = await page.evaluate(async (url, rangeStart, rangeEnd) => {
                    const response = await fetch(url, {
                        headers: {
                            'Range': `bytes=${rangeStart}-${rangeEnd}`,
                            'Accept': 'video/mp4,video/*;q=0.9,*/*;q=0.8',
                            'Referer': 'https://www.instagram.com/',
                            'Origin': 'https://www.instagram.com',
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                        }
                    });
                    
                    if (!response.ok) throw new Error(`HTTP ${response.status}`);
                    
                    const buffer = await response.arrayBuffer();
                    return Array.from(new Uint8Array(buffer));
                }, videoUrl, start, end);
                
                if (!chunk || !chunk.length) {
                    throw new Error(`Failed to download chunk ${start}-${end}`);
                }

                chunks.push(Buffer.from(chunk));
                downloadedSize += chunk.length;
                
                console.log(`Downloaded: ${((downloadedSize / totalSize) * 100).toFixed(1)}%`);
                
                // Small delay between chunks to avoid rate limiting
                await page.waitForTimeout(200);
            }

            const finalBuffer = Buffer.concat(chunks);
            if (finalBuffer.length !== totalSize) {
                throw new Error(`Size mismatch: expected ${totalSize}, got ${finalBuffer.length}`);
            }

            return finalBuffer;
        } catch (error) {
            console.error(`Download attempt ${attempt + 1} failed:`, error);
            if (attempt === maxAttempts - 1) throw error;
            await page.waitForTimeout(5000 * (attempt + 1));
        }
    }
    
    throw new Error('Failed to download video after all attempts');
}

// Add this function to check video URL and get alternative format if needed
async function getWorkingVideoUrl(page, videoUrl) {
    // Try different URL variations
    const urlVariations = [
        videoUrl,
        videoUrl.replace('_dashinit', ''),
        videoUrl.split('?')[0],
        videoUrl.replace('/o1/', '/v/').split('?')[0]
    ];

    for (const url of urlVariations) {
        try {
            const response = await page.evaluate(async (testUrl) => {
                const resp = await fetch(testUrl, {
                    method: 'HEAD',
                    headers: {
                        'Accept': '*/*',
                        'Referer': 'https://www.instagram.com/',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    }
                });
                return {
                    ok: resp.ok,
                    status: resp.status,
                    contentType: resp.headers.get('content-type'),
                    contentLength: resp.headers.get('content-length')
                };
            });

            if (response.ok && response.contentType?.includes('video')) {
                console.log(`Found working video URL: ${url}`);
                return url;
            }
        } catch (error) {
            console.error(`Error checking URL variation: ${error.message}`);
        }
    }

    return videoUrl; // Return original URL if no variations work
}

async function handleLoginPopup(page) {
    try {
        // Wait for either the close button or the video element
        await Promise.race([
            page.waitForSelector('[aria-label="Close"]', { timeout: 5000 }),
            page.waitForSelector('.x-closed', { timeout: 5000 }), // Alternative close button
            page.waitForSelector('button[type="button"]', { timeout: 5000 })
        ]);

        // Try different methods to close the popup
        await page.evaluate(() => {
            // Try all possible close buttons
            const selectors = [
                '[aria-label="Close"]',
                '.x-closed',
                'button[type="button"]',
                'button[class*="xy"]' // Instagram often uses this class pattern
            ];

            for (const selector of selectors) {
                const closeButton = document.querySelector(selector);
                if (closeButton) {
                    closeButton.click();
                    return true;
                }
            }

            // If no button found, try to remove the popup directly
            const popup = document.querySelector('div[role="presentation"]');
            if (popup) {
                popup.remove();
                return true;
            }

            return false;
        });

        // Wait a bit for the popup to disappear
        await page.waitForTimeout(1000);
        
        console.log('Login popup handled');
    } catch (error) {
        console.log('No login popup found or already closed');
    }
}

// Main function to download Instagram Reel
async function downloadInstagramReel(req, res) {
    let browser = null;
    let page = null;
    let tempFilePath = null;
    let outputFilePath = null;
    let job = null;

    try {
        if (!isValidInstagramUrl(req.body.reelUrl)) {
            return res.status(400).json({ message: 'Invalid Instagram reel URL' });
        }

        browser = await createBrowser();
        page = await createPage(browser);

        // Navigate to reel
        await navigateToReel(page, req.body.reelUrl);

        // Get best quality video URL
        const videoUrl = await getBestVideoUrl(page);
        if (!videoUrl) {
            throw new Error('Could not find video URL');
        }
        console.log('Found video URL:', videoUrl);

        // Download video
        const buffer = await downloadVideoBuffer(page, videoUrl);
        if (!buffer || !isValidMP4Buffer(buffer)) {
            throw new Error('Invalid video data received');
        }
        
        // Save temp file
        tempFilePath = path.join(__dirname, '../uploads', `reel_${Date.now()}.mp4`);
        await fs.writeFile(tempFilePath, buffer);
        
        // Verify file is valid MP4
        const fileStats = await fs.stat(tempFilePath);
        if (fileStats.size < 100 * 1024) { // Less than 100KB
            throw new Error('Downloaded file too small');
        }

        // Process or send directly
        if (req.body.cleanMetadata) {
            outputFilePath = path.join(__dirname, '../uploads', `processed_${Date.now()}.mp4`);
            
            // Add to processing queue
            job = await videoQueue.add({
                inputPath: tempFilePath,
                outputPath: outputFilePath,
                isReel: true
            }, {
                timeout: 300000,
                attempts: 2,
                backoff: { type: 'exponential', delay: 2000 }
            });

            // Wait for processing
            await new Promise((resolve, reject) => {
                const processingTimeout = setTimeout(() => {
                    reject(new Error('Processing timeout'));
                }, 240000);

                const checkJob = async () => {
                    const currentJob = await videoQueue.getJob(job.id);
                    if (!currentJob) return reject(new Error('Job not found'));

                    const state = await currentJob.getState();
                    if (state === 'completed') {
                        clearTimeout(processingTimeout);
                        resolve();
                    } else if (state === 'failed') {
                        clearTimeout(processingTimeout);
                        reject(new Error(currentJob.failedReason || 'Processing failed'));
                    } else {
                        setTimeout(checkJob, 1000);
                    }
                };

                checkJob();
            });

            // Send processed file
            const processedStats = await fs.stat(outputFilePath);
            res.setHeader('Content-Type', 'video/mp4');
            res.setHeader('Content-Disposition', 'attachment; filename="processed_reel.mp4"');
            res.setHeader('Content-Length', processedStats.size);
            
            const fileStream = fsSync.createReadStream(outputFilePath);
            fileStream.pipe(res);
            
            fileStream.on('end', async () => {
                await Promise.all([
                    fs.unlink(tempFilePath).catch(console.error),
                    fs.unlink(outputFilePath).catch(console.error)
                ]);
                if (job) await videoQueue.getJob(job.id)?.remove().catch(console.error);
            });
        } else {
            // Send file
            const stats = await fs.stat(tempFilePath);
            
            res.setHeader('Content-Type', 'video/mp4');
            res.setHeader('Content-Disposition', 'attachment; filename="instagram_reel.mp4"');
            res.setHeader('Content-Length', stats.size);
            res.setHeader('Connection', 'keep-alive');
            
            const stream = fsSync.createReadStream(tempFilePath);
            stream.pipe(res);
            
            await new Promise((resolve, reject) => {
                stream.on('end', resolve);
                stream.on('error', reject);
            });
            // Cleanup
            await fs.unlink(tempFilePath).catch(console.error);
        }
    } catch (error) {
        console.error('Download failed:', error);
        
        // Cleanup files
        if (tempFilePath) await fs.unlink(tempFilePath).catch(console.error);
        if (outputFilePath) await fs.unlink(outputFilePath).catch(console.error);
        if (job) await videoQueue.getJob(job.id)?.remove().catch(console.error);

        if (!res.headersSent) {
            res.status(500).json({ 
                message: 'Failed to download video',
                error: error.message 
            });
        }
    } finally {
        if (page) await page.close().catch(console.error);
        if (browser) await browser.close().catch(console.error);
    }
}

// Route to handle download requests
router.post('/download-reel', async (req, res) => {
    try {
        await Promise.race([
            downloadInstagramReel(req, res),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Operation timed out')), 300000))
        ]);
    } catch (error) {
        if (!res.headersSent) {
            res.status(error.message === 'Operation timed out' ? 504 : 500)
               .json({ message: error.message });
        }
    }
});

module.exports = router;