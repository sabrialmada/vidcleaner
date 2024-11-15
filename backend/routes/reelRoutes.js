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
async function createBrowser(options = {}) {
    const { maxRetries = 3, onDisconnect } = options;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            console.log(`Attempting to create browser (attempt ${attempt + 1}/${maxRetries})`);
            
            const browser = await puppeteer.launch({
                headless: "new",
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-gpu',
                    '--no-zygote',
                    '--single-process',
                    '--disable-extensions',
                    '--disable-background-networking',
                    '--disable-background-timer-throttling',
                    '--disable-backgrounding-occluded-windows',
                    '--disable-breakpad',
                    '--disable-client-side-phishing-detection',
                    '--disable-default-apps',
                    '--disable-popup-blocking',
                    '--disable-sync',
                    '--disable-translate',
                    '--metrics-recording-only',
                    '--no-first-run',
                    '--safebrowsing-disable-auto-update',
                    '--disable-features=IsolateOrigins,site-per-process',
                    '--disable-features=StorageAccessAPI',
                    '--disable-blink-features=StorageAPIWorkaround',
                    '--disable-web-security',
                    '--ignore-certificate-errors',
                    '--disable-blink-features',
                    '--disable-infobars',
                    '--window-size=1920,1080',
                    '--start-maximized'
                ],
                executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium',
                ignoreHTTPSErrors: true,
                timeout: 60000,
                pipe: true,
                defaultViewport: {
                    width: 1920,
                    height: 1080
                }
            });

            // Set up disconnect handling
            if (onDisconnect) {
                const disconnectHandler = async () => {
                    console.log('Browser disconnected event triggered');
                    browser._isConnected = false;
                    await onDisconnect();
                };
                browser.on('disconnected', disconnectHandler);
            }

            // Additional connection verification
            const pages = await browser.pages();
            if (!pages || pages.length === 0) {
                throw new Error('Browser created but no pages available');
            }

            console.log('Browser created successfully');
            return browser;
        } catch (error) {
            console.error(`Browser creation attempt ${attempt + 1} failed:`, error);
            if (attempt === maxRetries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
        }
    }
    throw new Error('Failed to create browser after all attempts');
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

// Page creation helper
async function createPage(browser, maxRetries = 3) {
    let retryCount = 0;
    let page = null;

    while (retryCount < maxRetries) {
        try {
            // Verify browser connection
            if (!browser.isConnected()) {
                throw new Error('Browser is disconnected');
            }

            console.log(`Creating page (attempt ${retryCount + 1}/${maxRetries})`);
            page = await browser.newPage();

            // Configure page settings
            await Promise.all([
                page.setDefaultNavigationTimeout(60000),
                page.setDefaultTimeout(60000),
                page.setViewport({
                    width: 1920,
                    height: 1080,
                    deviceScaleFactor: 1,
                }),
                page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.84 Safari/537.36'),
                page.setExtraHTTPHeaders({
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Connection': 'keep-alive'
                })
            ]);

            // Set up request interception for performance
            await page.setRequestInterception(true);
            page.on('request', (request) => {
                const resourceType = request.resourceType();
                if (['stylesheet', 'font', 'image'].includes(resourceType)) {
                    request.abort();
                } else {
                    request.continue();
                }
            });

            // Set up error logging
            page.on('error', err => console.error('Page error:', err));
            page.on('pageerror', err => console.error('Page error:', err));
            page.on('console', msg => {
                if (msg.type() === 'error' || msg.type() === 'warning') {
                    console.log(`Console ${msg.type()}: ${msg.text()}`);
                }
            });

            // Additional page verification
            const isPageValid = await page.evaluate(() => true).catch(() => false);
            if (!isPageValid) {
                throw new Error('Page verification failed');
            }

            console.log('Page created and configured successfully');
            return page;
        } catch (error) {
            console.error(`Failed to create page (attempt ${retryCount + 1}):`, error);
            
            if (page) {
                try {
                    await page.close().catch(() => {});
                } catch (closeError) {
                    console.error('Error closing failed page:', closeError);
                }
            }
            
            retryCount++;
            if (retryCount === maxRetries) {
                throw new Error(`Failed to create page after ${maxRetries} attempts`);
            }
            
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
        }
    }
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

// Helper function to extract video URL with retries and rate limit handling
async function extractVideoUrl(page, maxAttempts = 5) {
    const videoStreams = new Map();
    
    // Set up network monitoring
    const client = await page.target().createCDPSession();
    await client.send('Network.enable');
    
    return new Promise((resolve, reject) => {
        let resolved = false;
        
        // Network response handler
        client.on('Network.responseReceived', (event) => {
            const { response } = event;
            if (response.url.includes('cdninstagram.com')) {
                // For video streams
                if (response.url.includes('.mp4') && !response.url.includes('_audio')) {
                    // Parse quality from URL
                    let quality = 0;
                    if (response.url.includes('dash_r2evevp9-r1gen2vp9_q90')) quality = 90;
                    else if (response.url.includes('dash_r2evevp9-r1gen2vp9_q60')) quality = 60;
                    else if (response.url.includes('dash_r2evevp9-r1gen2vp9_q30')) quality = 30;
                    // Check vcodec in URL parameters
                    const urlParams = new URLSearchParams(new URL(response.url).search);
                    const efg = urlParams.get('efg');
                    if (efg) {
                        try {
                            const efgData = JSON.parse(decodeURIComponent(efg));
                            if (efgData.vencode_tag && efgData.vencode_tag.includes('q90')) quality = Math.max(quality, 90);
                        } catch (e) {}
                    }
                    
                    // Store stream URL without byte range parameters
                    const baseUrl = response.url.split('&bytestart')[0];
                    console.log(`Found video stream (quality: ${quality}):`, baseUrl);
                    videoStreams.set(quality, baseUrl);
                    
                    // Resolve with highest quality stream so far
                    if (!resolved) {
                        const qualities = Array.from(videoStreams.keys());
                        if (qualities.length > 0) {
                            const maxQuality = Math.max(...qualities);
                            resolved = true;
                            resolve(videoStreams.get(maxQuality));
                        }
                    }
                }
            }
        });

        // Start page interaction
        (async () => {
            for (let attempt = 0; attempt < maxAttempts && !resolved; attempt++) {
                try {
                    await page.waitForTimeout(2000);
                    if (attempt < maxAttempts - 1) {
                        await page.reload({ 
                            waitUntil: 'networkidle0',
                            timeout: 30000 
                        });
                    }
                } catch (error) {
                    console.error(`Attempt ${attempt + 1} failed:`, error);
                }
            }
            
            // If we haven't resolved by now, try one last time with any quality
            if (!resolved && videoStreams.size > 0) {
                const firstUrl = videoStreams.values().next().value;
                resolved = true;
                resolve(firstUrl);
            } else if (!resolved) {
                reject(new Error('No video stream found'));
            }
        })();

        // Set timeout
        setTimeout(() => {
            if (!resolved) {
                reject(new Error('Video extraction timeout'));
            }
        }, 30000);
    });
}

// Helper function to validate video data
function isValidMP4Buffer(buffer) {
    if (!buffer || buffer.length < 8) return false;
    
    // Check for MP4 signature
    const signature = buffer.slice(4, 8).toString();
    if (signature !== 'ftyp') return false;
    
    // Check for minimum valid size (100KB)
    if (buffer.length < 100 * 1024) return false;
    
    return true;
}

// Helper function to download video buffer with retries
async function downloadVideoBuffer(page, videoUrl, maxAttempts = 3) {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
            console.log(`Downloading video (attempt ${attempt + 1}/${maxAttempts})`);
            
            // Get video using fetch with proper headers
            const buffer = await page.evaluate(async (url) => {
                try {
                    const response = await fetch(url, {
                        method: 'GET',
                        headers: {
                            'Accept': '*/*',
                            'Accept-Encoding': 'gzip, deflate, br',
                            'Accept-Language': 'en-US,en;q=0.9',
                            'Connection': 'keep-alive',
                            'Range': 'bytes=0-',
                            'Referer': 'https://www.instagram.com/',
                            'Sec-Fetch-Dest': 'video',
                            'Sec-Fetch-Mode': 'cors',
                            'Sec-Fetch-Site': 'same-site',
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                            'Origin': 'https://www.instagram.com'
                        },
                        credentials: 'include',
                        mode: 'cors'
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const reader = response.body.getReader();
                    const chunks = [];
                    let totalLength = 0;

                    while (true) {
                        const { done, value } = await reader.read();
                        
                        if (done) {
                            break;
                        }

                        chunks.push(value);
                        totalLength += value.length;
                        console.log(`Downloaded ${totalLength} bytes`);
                    }

                    // Combine chunks
                    const result = new Uint8Array(totalLength);
                    let offset = 0;
                    for (const chunk of chunks) {
                        result.set(chunk, offset);
                        offset += chunk.length;
                    }

                    return Array.from(result);
                } catch (error) {
                    console.error('Download error:', error);
                    return null;
                }
            }, videoUrl);

            if (buffer && buffer.length > 0) {
                const videoBuffer = Buffer.from(buffer);
                console.log(`Downloaded buffer size: ${videoBuffer.length} bytes`);

                // Basic validation
                if (videoBuffer.length > 1000) { // At least 1KB
                    return videoBuffer;
                }
            }

            console.log('Invalid buffer received, retrying...');
            await delay(getBackoffDelay(attempt));

        } catch (error) {
            console.error(`Download attempt ${attempt + 1} failed:`, error);
            if (attempt === maxAttempts - 1) throw error;
            await delay(getBackoffDelay(attempt));
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

    let browser = null;
    let page = null;
    let tempFilePath = null;
    let outputFilePath = null;
    let job = null;
    let browserReconnectAttempts = 0;
    const maxBrowserReconnectAttempts = 2;
    let isDownloadComplete = false;

    try {
        // Initialize browser with proper disconnect handling
        const initializeBrowser = async () => {
            try {
                browser = await createBrowser();
                
                // Set up disconnect handler that won't cause unhandled rejections
                const handleDisconnect = async () => {
                    console.log('Browser was disconnected');
                    if (!isDownloadComplete && !res.headersSent && 
                        browserReconnectAttempts < maxBrowserReconnectAttempts) {
                        browserReconnectAttempts++;
                        console.log(`Attempting browser reconnection (${browserReconnectAttempts}/${maxBrowserReconnectAttempts})`);
                        try {
                            await initializeBrowser();
                        } catch (error) {
                            console.error('Failed to reconnect browser:', error);
                        }
                    } else {
                        console.log('Skipping browser reconnection - download complete or max attempts reached');
                    }
                };

                browser.on('disconnected', handleDisconnect);
                return browser;
            } catch (error) {
                throw new Error(`Failed to initialize browser: ${error.message}`);
            }
        };

        console.log('Initializing browser...');
        browser = await initializeBrowser();
        console.log('Browser created successfully');

        // Create page with retry logic
        let pageCreated = false;
        let pageAttempt = 0;
        const maxPageAttempts = 2;

        while (!pageCreated && pageAttempt < maxPageAttempts) {
            try {
                console.log(`Creating page attempt ${pageAttempt + 1}/${maxPageAttempts}...`);
                if (!browser.isConnected()) {
                    throw new Error('Browser disconnected during page creation');
                }
                page = await createPage(browser);
                pageCreated = true;
                console.log('Page created successfully');
            } catch (error) {
                console.error(`Page creation attempt ${pageAttempt + 1} failed:`, error);
                pageAttempt++;
                if (pageAttempt === maxPageAttempts) {
                    throw new Error('Failed to create page after multiple attempts');
                }
                await delay(1000 * pageAttempt);
            }
        }

        // Navigation with retry logic
        let navigationAttempt = 0;
        const maxNavigationAttempts = 5;
        let navigationSuccess = false;

        while (navigationAttempt < maxNavigationAttempts && !navigationSuccess) {
            try {
                console.log(`Navigation attempt ${navigationAttempt + 1}/${maxNavigationAttempts}`);
                
                // Clear storage with error handling
                await page.evaluate(() => {
                    try {
                        localStorage.clear();
                        sessionStorage.clear();
                    } catch (e) {
                        console.log('Storage clear failed, continuing...');
                    }
                }).catch(() => console.log('Storage clear evaluation failed'));
                
                await page.goto(reelUrl, {
                    waitUntil: ['networkidle0', 'domcontentloaded'],
                    timeout: 30000
                });
                
                await delay(2000);
                navigationSuccess = true;
                console.log('Navigation successful');
            } catch (error) {
                console.error(`Navigation attempt ${navigationAttempt + 1} failed:`, error.message);
                navigationAttempt++;
                
                if (navigationAttempt === maxNavigationAttempts) {
                    throw new Error('Failed to navigate to reel URL after all attempts');
                }
                
                const backoffDelay = getBackoffDelay(navigationAttempt);
                console.log(`Waiting ${backoffDelay}ms before retry...`);
                await delay(backoffDelay);
                
                // Recreate page on navigation failure
                try {
                    await page.close().catch(() => console.log('Failed to close old page'));
                    page = await createPage(browser);
                } catch (e) {
                    console.error('Error recreating page:', e);
                }
            }
        }

        // Extract video URL with enhanced error handling
        const videoUrl = await extractVideoUrl(page).catch(async (error) => {
            console.error('Error extracting video URL:', error);
            await saveDebugInfo(page, 'video_extraction_failed');
            return null;
        });
        
        if (!videoUrl) {
            await saveDebugInfo(page, 'no_video_found');
            return res.status(400).json({ 
                message: 'Unable to find the video. The reel might be private or unavailable.' 
            });
        }

        // Get working video URL
        const workingVideoUrl = await getWorkingVideoUrl(page, videoUrl);
        console.log(`Using video URL: ${workingVideoUrl}`);


        // Download video with retry logic
        let downloadAttempt = 0;
        const maxDownloadAttempts = 3;
        let buffer = null;

        while (downloadAttempt < maxDownloadAttempts && !buffer) {
            try {
                buffer = await downloadVideoBuffer(page, workingVideoUrl);
                if (!buffer || buffer.length === 0) {
                    throw new Error('Empty buffer received');
                }
            } catch (error) {
                console.error(`Download attempt ${downloadAttempt + 1} failed:`, error);
                downloadAttempt++;
                if (downloadAttempt === maxDownloadAttempts) {
                    throw new Error('Failed to download video after all attempts');
                }
                await delay(getBackoffDelay(downloadAttempt));
            }
        }
        
        tempFilePath = path.join(__dirname, '../uploads', `temp_reel_${Date.now()}.mp4`);
        console.log(`Saving temporary file: ${tempFilePath}`);
        await fs.writeFile(tempFilePath, buffer);

        // Verify the saved file
        const fileStats = await fs.stat(tempFilePath);
        if (fileStats.size === 0) {
            throw new Error('Downloaded file is empty');
        }

        // Verify MP4 structure
        const fileBuffer = await fs.readFile(tempFilePath);
        if (!isValidMP4Structure(fileBuffer)) {
            await fs.unlink(tempFilePath);
            throw new Error('Invalid MP4 file structure');
        }

        // Set flag before sending response
        isDownloadComplete = true;

        if (cleanMetadata) {
            console.log('Cleaning metadata requested, processing video');
            outputFilePath = path.join(__dirname, '../uploads', `processed_reel_${Date.now()}.mp4`);
            
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
                removeOnComplete: false
            });

            await new Promise((resolve, reject) => {
                let lastState = null;
                let completed = false;
                let processingTimeout;

                const cleanup = () => {
                    if (processingTimeout) {
                        clearTimeout(processingTimeout);
                    }
                };

                processingTimeout = setTimeout(() => {
                    cleanup();
                    reject(new Error('Processing timeout'));
                }, 240000);

                const checkJob = async () => {
                    try {
                        if (completed) return;

                        const currentJob = await videoQueue.getJob(job.id);
                        
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

                        if (state !== lastState) {
                            console.log(`Job ${job.id} state changed to: ${state}`);
                            lastState = state;
                        }

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

                checkJob();
            });

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
                message: 'Error downloading the reel.',
                error: error.message 
            });
        }
    } finally {
        // Enhanced cleanup with proper order and error handling
        if (page) {
            try {
                console.log('Closing page...');
                if (!page.isClosed()) {
                    await page.close().catch(e => console.error('Error closing page:', e));
                }
                console.log('Page closed successfully');
            } catch (error) {
                console.error('Error during page cleanup:', error);
            }
        }
        
        if (browser) {
            try {
                console.log('Closing browser...');
                // Remove all listeners before closing to prevent disconnect events
                browser.removeAllListeners('disconnected');
                if (browser.isConnected()) {
                    await browser.close().catch(e => console.error('Error closing browser:', e));
                }
                console.log('Browser closed successfully');
            } catch (error) {
                console.error('Error during browser cleanup:', error);
            }
        }
    }
}

// Route to handle download requests
router.post('/download-reel', async (req, res) => {
    const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Operation timed out')), 300000)
    );

    try{
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