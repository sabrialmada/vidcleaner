
const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');
const { processVideo } = require('../videoProcessor');
const { videoQueue } = require('../queue');

const router = express.Router();

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const getBackoffDelay = (attempt) => {
    return Math.min(1000 * Math.pow(2, attempt), 30000);
};

// validate instagram reel url
const isValidInstagramUrl = (url) => {
    const regex = /^(https?:\/\/)?(www\.)?instagram\.com\/reel\/[A-Za-z0-9_-]+\/?(?:\?.*)?$/;
    return regex.test(url);
};

// verify file existence
const verifyFile = async (filePath) => {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
};

// browser creation
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

async function waitForContent(page, timeout = 10000) {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
        const content = await page.evaluate(() => {
            // check for video element
            const video = document.querySelector('video');
            if (video) return true;

            // check for error messages
            const errorTexts = ['Sorry, this page is not available.', 'Please wait a few minutes'];
            for (const text of errorTexts) {
                if (document.body.innerText.includes(text)) return false;
            }

            return null;
        });

        if (content === true) return true;
        if (content === false) return false;
        await page.waitForTimeout(1000);
    }

    return false;
}

// page creation 
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

    // block unwanted resources
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

// navigation with popup handling
async function navigateToReel(page, url, maxAttempts = 3) {
    let lastError;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
            // clear storage and cookies
            await page.evaluate(() => {
                try {
                    localStorage.clear();
                    sessionStorage.clear();
                    document.cookie.split(";").forEach(c => {
                        document.cookie = c.replace(/^ +/, "")
                            .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                    });
                } catch (e) { }
            });

            // navigate to page
            await page.goto(url, {
                waitUntil: 'networkidle0',
                timeout: 60000
            });

            // handle login popup
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
            } catch (e) { }

            // wait for video
            await Promise.race([
                page.waitForSelector('video'),
                page.waitForFunction(() => {
                    return document.body.innerText.includes('Sorry, this page') ||
                        document.body.innerText.includes('is not available');
                })
            ]);

            // check if page is available
            const isError = await page.evaluate(() => {
                return document.body.innerText.includes('Sorry, this page') ||
                    document.body.innerText.includes('isn not available');
            });

            if (isError) {
                throw new Error('Video not available');
            }

            // extra wait for network
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

// handle navigation with better reliability
async function navigateToUrl(page, url, maxAttempts = 5) {
    let attempt = 0;
    while (attempt < maxAttempts) {
        try {
            console.log(`Navigation attempt ${attempt + 1}/${maxAttempts} to: ${url}`);

            // clear storage and cache
            await Promise.all([
                page.evaluate(() => {
                    try {
                        localStorage.clear();
                        sessionStorage.clear();
                        caches?.delete?.();
                    } catch (e) { }
                }),
                page.evaluate(() => {
                    document.cookie.split(";").forEach((c) => {
                        document.cookie = c
                            .replace(/^ +/, "")
                            .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
                    });
                })
            ]).catch(() => { });

            // navigate with proper wait conditions
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

// function for better cleanup
async function cleanup(browser, page, tempFilePath, outputFilePath, job) {
    console.log('Starting cleanup process...');

    try {
        // close page
        if (page && !page.isClosed()) {
            console.log('Closing page...');
            await page.close().catch(e => console.error('Error closing page:', e));
            console.log('Page closed successfully');
        }

        // close browser
        if (browser && browser.isConnected()) {
            console.log('Closing browser...');
            browser.removeAllListeners('disconnected');
            await browser.close().catch(e => console.error('Error closing browser:', e));
            console.log('Browser closed successfully');
        }

        // clean up files
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

        // clean up job
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

// function to save debug information
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

// get highest quality video url
async function getBestVideoUrl(page) {
    const videoUrls = new Map();

    // listen for video responses
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

                // determine quality
                if (url.includes('_q90') || url.includes('q90')) quality = 90;
                else if (url.includes('_q60') || url.includes('q60')) quality = 60;
                else if (url.includes('_q30') || url.includes('q30')) quality = 30;

                videoUrls.set(url, quality);

                // resolve with highest quality found so far
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

        // timeout after 10s
        setTimeout(() => {
            if (!resolved) {
                const firstUrl = videoUrls.keys().next().value;
                resolve(firstUrl || null);
            }
        }, 10000);
    });
}

// extract video url with retries and rate limit handling
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

        // wait for network idle
        await Promise.race([
            page.waitForNetworkIdle({ idleTime: 1000 }),
            requestPromise
        ]);

        // get best quality url
        const bestUrl = await getBestVideoUrl(videoUrls);
        if (bestUrl) return bestUrl;

        // if no url found yet, try page reload
        for (let i = 0; i < maxAttempts && !bestUrl; i++) {
            await page.reload({ waitUntil: 'networkidle0' });
            await page.waitForTimeout(2000);
        }

        return await getBestVideoUrl(videoUrls);
    } finally {
        if (client) {
            await client.detach().catch(() => { });
        }
    }
}

// validate video data
function isValidMP4Buffer(buffer) {
    try {
        if (buffer.length < 100 * 1024) return false; // Min 100KB

        // check mp4 header
        const header = buffer.slice(0, 8);
        const size = header.readUInt32BE(0);
        const type = header.slice(4).toString();

        if (type !== 'ftyp') return false;

        // check for moov and mdat boxes
        const hasMovieBox = buffer.includes(Buffer.from('moov'));
        const hasMediaBox = buffer.includes(Buffer.from('mdat'));

        return hasMovieBox && hasMediaBox;
    } catch (e) {
        console.error('Error validating MP4:', e);
        return false;
    }
}

// rate limit handler
async function handleRateLimit(page, delay = 5000) {
    console.log(`Rate limit hit, waiting ${delay}ms before retry...`);
    await page.waitForTimeout(delay);
    // clear cookies and cache
    await page.evaluate(() => {
        try {
            localStorage.clear();
            sessionStorage.clear();
            document.cookie.split(";").forEach((c) => {
                document.cookie = c
                    .replace(/^ +/, "")
                    .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
            });
        } catch (e) { }
    });
}

// download video buffer with retries
async function downloadVideoBuffer(page, videoUrl, maxAttempts = 3) {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
            // get content length first
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

            // download in chunks
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

                // small delay between chunks to avoid rate limiting
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

// check video url and get alternative format if needed
async function getWorkingVideoUrl(page, videoUrl) {
    // try different url variations
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

    return videoUrl; // return original url if no variations work
}

async function handleLoginPopup(page) {
    try {
        // wait for the close button or the video element
        await Promise.race([
            page.waitForSelector('[aria-label="Close"]', { timeout: 5000 }),
            page.waitForSelector('.x-closed', { timeout: 5000 }), // Alternative close button
            page.waitForSelector('button[type="button"]', { timeout: 5000 })
        ]);

        // different methods to close the popup
        await page.evaluate(() => {
            // possible close buttons
            const selectors = [
                '[aria-label="Close"]',
                '.x-closed',
                'button[type="button"]',
                'button[class*="xy"]'
            ];

            for (const selector of selectors) {
                const closeButton = document.querySelector(selector);
                if (closeButton) {
                    closeButton.click();
                    return true;
                }
            }

            // try to remove the popup directly
            const popup = document.querySelector('div[role="presentation"]');
            if (popup) {
                popup.remove();
                return true;
            }

            return false;
        });

        // wait a bit for the popup to disappear
        await page.waitForTimeout(1000);

        console.log('Login popup handled');
    } catch (error) {
        console.log('No login popup found or already closed');
    }
}

// download instagram reel
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

        // navigate to reel
        await navigateToReel(page, req.body.reelUrl);

        // get best quality video URL
        const videoUrl = await getBestVideoUrl(page);
        if (!videoUrl) {
            throw new Error('Could not find video URL');
        }
        console.log('Found video URL:', videoUrl);

        // download video
        const buffer = await downloadVideoBuffer(page, videoUrl);
        if (!buffer || !isValidMP4Buffer(buffer)) {
            throw new Error('Invalid video data received');
        }

        // save temp file
        tempFilePath = path.join(__dirname, '../uploads', `reel_${Date.now()}.mp4`);
        await fs.writeFile(tempFilePath, buffer);

        // verify file is valid mp4
        const fileStats = await fs.stat(tempFilePath);
        if (fileStats.size < 100 * 1024) {
            throw new Error('Downloaded file too small');
        }

        // process or send directly
        if (req.body.cleanMetadata) {
            outputFilePath = path.join(__dirname, '../uploads', `processed_${Date.now()}.mp4`);

            // add to processing queue
            job = await videoQueue.add({
                inputPath: tempFilePath,
                outputPath: outputFilePath,
                isReel: true
            }, {
                timeout: 300000,
                attempts: 2,
                backoff: { type: 'exponential', delay: 2000 }
            });

            // wait for processing
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

            // send processed file
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
            // send file
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
            // cleanup
            await fs.unlink(tempFilePath).catch(console.error);
        }
    } catch (error) {
        console.error('Download failed:', error);

        // cleanup files
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

// handle download requests
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