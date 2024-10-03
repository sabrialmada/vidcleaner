/* const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');
const { processImages } = require('../imageProcessor'); // Adjust the path as necessary

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Temporary storage for uploaded files

router.post('/process-images', upload.array('images', 10), async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No image files uploaded' });
    }

    try {
        const outputFiles = await Promise.all(req.files.map(async (imageFile) => {
            const inputFilePath = path.join(__dirname, '../', imageFile.path);
            const outputFilePath = path.join(__dirname, '../', `processed_${imageFile.originalname}`);

            await processImages([{ path: inputFilePath, originalname: imageFile.originalname }]);
            return { path: outputFilePath, name: `processed_${imageFile.originalname}` };
        }));

        const zipFilePath = path.join(__dirname, '../', 'processed_images.zip');
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

                fs.unlinkSync(zipFilePath);
                outputFiles.forEach(file => fs.unlinkSync(file.path));
                req.files.forEach(file => fs.unlinkSync(path.join(__dirname, '../', file.path)));
            });
        });

        archive.on('error', (err) => {
            throw err;
        });

    } catch (error) {
        console.error('Error processing images:', error);
        res.status(500).json({ message: 'Image processing failed' });
        req.files.forEach(file => fs.unlinkSync(path.join(__dirname, '../', file.path)));
    }
});

module.exports = router; */


/* const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');
const { processImages } = require('../imageProcessor'); // Adjust the path as necessary

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Temporary storage for uploaded files

router.post('/process-images', upload.array('images', 10), async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No image files uploaded' });
    }

    const processedFiles = [];

    // Process each image file sequentially
    for (const imageFile of req.files) {
        const inputFilePath = path.join(__dirname, '../', imageFile.path);
        const outputFilePath = path.join(__dirname, '../', `processed_${imageFile.originalname}`);

        await processImages([{ path: inputFilePath, originalname: imageFile.originalname }]);
        
        // Check if the processed image exists before adding to the list
        if (fs.existsSync(outputFilePath)) {
            processedFiles.push({ path: outputFilePath, name: `processed_${imageFile.originalname}` });
        } else {
            console.error(`Processed file does not exist: ${outputFilePath}`);
        }

        // Clean up the original uploaded file
        fs.unlinkSync(inputFilePath);
    }

    // Create a zip archive for the processed images
    const zipFilePath = path.join(__dirname, '../', 'processed_images.zip');
    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.pipe(output);

    // Add processed files to the archive only if they exist
    processedFiles.forEach(file => {
        if (fs.existsSync(file.path)) {
            archive.file(file.path, { name: file.name });
        } else {
            console.log(`Skipping file, does not exist when adding to archive: ${file.path}`);
        }
    });

    try {
        await archive.finalize();
    } catch (err) {
        console.error('Error finalizing archive:', err);
        res.status(500).json({ message: 'Failed to create zip file' });
        return;
    }

    output.on('close', () => {
        res.download(zipFilePath, 'processed_images.zip', (err) => {
            if (err) {
                console.error('Error sending the zip file:', err);
                return;
            }

            // Clean up after sending the file
            fs.unlinkSync(zipFilePath);
            processedFiles.forEach(file => fs.unlinkSync(file.path)); // Remove processed files
        });
    });

    output.on('error', (err) => {
        console.error('Error with zip file creation:', err);
        res.status(500).json({ message: 'Error creating zip file' });
    });
});

module.exports = router;
 */


