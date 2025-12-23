const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   POST /api/upload
// @desc    Upload image
// @access  Private
router.post('/', protect, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Return the file path
        res.json({
            message: 'File uploaded successfully',
            path: `/uploads/${req.file.filename}`
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Upload failed', error: error.message });
    }
});

module.exports = router;
