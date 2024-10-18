const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const router = express.Router();

router.get('/check-uploads', async (req, res) => {
    try {
        const uploadsDir = path.join(__dirname, '../uploads'); // Adjust this path as needed
        const files = await fs.readdir(uploadsDir);
        
        const fileDetails = await Promise.all(files.map(async (file) => {
            const filePath = path.join(uploadsDir, file);
            const stats = await fs.stat(filePath);
            return {
                name: file,
                size: stats.size,
                created: stats.birthtime,
                modified: stats.mtime
            };
        }));

        res.json({
            totalFiles: files.length,
            files: fileDetails
        });
    } catch (error) {
        console.error('Error checking uploads directory:', error);
        res.status(500).json({ error: 'Failed to check uploads directory' });
    }
});

module.exports = router;