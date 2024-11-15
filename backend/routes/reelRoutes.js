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
async function createBrowser() {
    try {
        const browser = await puppeteer.launch({
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
                '--disable-features=site-per-process',
                '--disable-hang-monitor',
                '--disable-popup-blocking',
                '--disable-prompt-on-repost',
                '--disable-sync',
                '--disable-translate',
                '--metrics-recording-only',
                '--mute-audio',
                '--no-pings',
                '--disable-component-update',
                '--disable-features=TranslateUI',
                '--disable-web-security',
                '--disable-features=IsolateOrigins',
                '--blink-settings=imagesEnabled=true',
                '--disable-features=StorageAccessAPI',
                '--disable-blink-features=StorageAPIWorkaround'
            ],
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium',
            ignoreHTTPSErrors: true,
            timeout: 60000
        });

        return browser;
    } catch (error) {
        console.error('Error creating browser:', error);
        throw error;
    }
}

// Page creation helper
async function createPage(browser) {
    try {
        const page = await browser.newPage();
        
        // Block unnecessary resources
        await page.setRequestInterception(true);
        page.on('request', (request) => {
            const resourceType = request.resourceType();
            if (['stylesheet', 'font', 'image'].includes(resourceType)) {
                request.abort();
            } else {
                request.continue();
            }
        });

        // Set viewport and user agent
        await page.setViewport({ width: 1280, height: 800 });
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        
        // Bypass localStorage and sessionStorage errors
        await page.evaluateOnNewDocument(() => {
            Object.defineProperties(window, {
                'localStorage': {
                    value: {},
                    configurable: true,
                    writable: true
                },
                'sessionStorage': {
                    value: {},
                    configurable: true,
                    writable: true
                }
            });
        });

        return page;
    } catch (error) {
        console.error('Error creating page:', error);
        throw error;
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
async function extractVideoUrl(page, maxAttempts = 10) {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
            // Wait for video element with timeout
            await page.waitForSelector('video', { timeout: 5000 });
            
            const videoUrl = await page.evaluate(() => {
                const video = document.querySelector('video');
                if (video && video.src) {
                    return video.src;
                }
                
                // Fallback to source elements
                const sources = document.querySelectorAll('source');
                for (const source of sources) {
                    if (source.src && source.src.includes('cdninstagram.com')) {
                        return source.src;
                    }
                }
                
                return null;
            });

            if (videoUrl && videoUrl.includes('cdninstagram.com')) {
                return videoUrl;
            }

            // If no video found, try to find it in network requests
            const client = await page.target().createCDPSession();
            await client.send('Network.enable');
            
            const videoUrls = [];
            client.on('Network.responseReceived', (event) => {
                const { response } = event;
                if (response.url.includes('cdninstagram.com') && response.url.includes('.mp4')) {
                    videoUrls.push(response.url);
                }
            });

            // Refresh page and wait for new requests
            await page.reload({ waitUntil: 'networkidle0' });
            await page.waitForTimeout(3000);

            if (videoUrls.length > 0) {
                return videoUrls[0];
            }

        } catch (error) {
            console.error(`Attempt ${attempt + 1} failed:`, error);
            if (attempt === maxAttempts - 1) throw error;
            await page.waitForTimeout(2000);
        }
    }

    return null;
}

// Helper function to download video buffer with retries
async function downloadVideoBuffer(page, videoUrl, maxAttempts = 3) {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
            console.log(`Downloading video buffer (attempt ${attempt + 1}/${maxAttempts})`);
            const buffer = await page.evaluate(async (url) => {
                try {
                    const response = await fetch(url, {
                        headers: {
                            'Accept': 'video/mp4,video/*;q=0.9,*/*;q=0.8',
                            'Range': 'bytes=0-',
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                        }
                    });
                    
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    
                    const buffer = await response.arrayBuffer();
                    if (buffer.byteLength === 0) {
                        throw new Error('Empty buffer received');
                    }
                    
                    return Array.from(new Uint8Array(buffer));
                } catch (error) {
                    console.error('Error downloading video:', error);
                    return null;
                }
            }, videoUrl);

            if (buffer && buffer.length > 0) {
                return Buffer.from(buffer);
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

    try {
        console.log('Initializing browser...');
        browser = await createBrowser();
        console.log('Browser created successfully');

        browser.on('disconnected', () => {
            console.log('Browser was disconnected');
        });

        console.log('Creating page...');
        page = await createPage(browser);
        console.log('Page created successfully');

        let attempt = 0;
        const maxAttempts = 5;
        let success = false;

        while (attempt < maxAttempts && !success) {
            try {
                console.log(`Navigation attempt ${attempt + 1}/${maxAttempts}`);
                
                // Clear cookies and cache before each attempt
                await page.evaluate(() => {
                    localStorage.clear();
                    sessionStorage.clear();
                });
                
                await page.goto(reelUrl, {
                    waitUntil: ['networkidle0', 'domcontentloaded'],
                    timeout: 60000
                });
                
                await delay(2000);
                success = true;
                console.log('Navigation successful');
            } catch (error) {
                console.error(`Navigation attempt ${attempt + 1} failed:`, error.message);
                attempt++;
                
                if (attempt === maxAttempts) {
                    throw new Error('Failed to navigate to reel URL after all attempts');
                }
                
                const backoffDelay = getBackoffDelay(attempt);
                console.log(`Waiting ${backoffDelay}ms before retry...`);
                await delay(backoffDelay);
                
                try {
                    await page.close();
                    page = await createPage(browser);
                } catch (e) {
                    console.error('Error recreating page:', e);
                }
            }
        }

        const videoUrl = await extractVideoUrl(page);
        if (!videoUrl) {
            await saveDebugInfo(page, 'no_video_found');
            return res.status(400).json({ 
                message: 'Unable to find the video. The reel might be private or unavailable.' 
            });
        }
        console.log(`Video URL found: ${videoUrl}`);

        const buffer = await downloadVideoBuffer(page, videoUrl);
        
        tempFilePath = path.join(__dirname, '../uploads', `temp_reel_${Date.now()}.mp4`);
        console.log(`Saving temporary file: ${tempFilePath}`);
        await fs.writeFile(tempFilePath, buffer);

        // Verify the saved file
        const fileStats = await fs.stat(tempFilePath);
        if (fileStats.size === 0) {
            throw new Error('Downloaded file is empty');
        }

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
        if (page) {
            try {
                console.log('Closing page...');
                await page.close().catch(e => console.error('Error closing page:', e));
                console.log('Page closed successfully');
            } catch (error) {
                console.error('Error during page cleanup:', error);
            }
        }
        
        if (browser) {
            try {
                console.log('Closing browser...');
                await browser.close().catch(e => console.error('Error closing browser:', e));
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