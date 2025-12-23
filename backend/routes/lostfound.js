const express = require('express');
const router = express.Router();
const LostFound = require('../models/LostFound');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   GET /api/lostfound
// @desc    Get all lost/found reports
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { type, petType, status } = req.query;

        let query = {};
        if (type) query.type = type;
        if (petType) query.petType = petType;
        if (status) query.status = status;

        const reports = await LostFound.find(query)
            .sort({ createdAt: -1 })
            .populate('user', 'name');
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/lostfound/:id
// @desc    Get single report
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const report = await LostFound.findById(req.params.id).populate('user', 'name email');
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }
        res.json(report);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/lostfound
// @desc    Create lost/found report
// @access  Private
router.post('/', protect, upload.single('image'), async (req, res) => {
    try {
        const reportData = {
            ...req.body,
            user: req.user._id,
            location: {
                address: req.body.address,
                lat: parseFloat(req.body.lat) || 0,
                lng: parseFloat(req.body.lng) || 0
            },
            image: req.file ? `/uploads/${req.file.filename}` : ''
        };
        delete reportData.address;
        delete reportData.lat;
        delete reportData.lng;

        const report = await LostFound.create(reportData);
        res.status(201).json(report);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/lostfound/:id
// @desc    Update report
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        const report = await LostFound.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        if (report.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const updatedReport = await LostFound.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedReport);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/lostfound/:id/resolve
// @desc    Mark as resolved
// @access  Private
router.put('/:id/resolve', protect, async (req, res) => {
    try {
        const report = await LostFound.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        if (report.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        report.status = 'resolved';
        await report.save();
        res.json(report);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   DELETE /api/lostfound/:id
// @desc    Delete report
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const report = await LostFound.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        if (report.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await report.deleteOne();
        res.json({ message: 'Report removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
