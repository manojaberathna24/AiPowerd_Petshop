const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   GET /api/services
// @desc    Get all services
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { type, search } = req.query;

        let query = { isActive: true };

        if (type) query.type = type;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { address: { $regex: search, $options: 'i' } }
            ];
        }

        const services = await Service.find(query).sort({ rating: -1 });
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/services/types
// @desc    Get service types
// @access  Public
router.get('/types', async (req, res) => {
    try {
        const types = ['vet', 'grooming', 'petshop', 'boarding', 'training'];
        res.json(types);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/services/:id
// @desc    Get single service
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.json(service);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/services
// @desc    Create service
// @access  Admin
router.post('/', protect, admin, upload.single('image'), async (req, res) => {
    try {
        const serviceData = {
            ...req.body,
            location: {
                lat: parseFloat(req.body.lat),
                lng: parseFloat(req.body.lng)
            },
            image: req.file ? `/uploads/${req.file.filename}` : ''
        };
        delete serviceData.lat;
        delete serviceData.lng;

        const service = await Service.create(serviceData);
        res.status(201).json(service);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/services/:id
// @desc    Update service
// @access  Admin
router.put('/:id', protect, admin, upload.single('image'), async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        const updateData = { ...req.body };
        if (req.body.lat && req.body.lng) {
            updateData.location = {
                lat: parseFloat(req.body.lat),
                lng: parseFloat(req.body.lng)
            };
            delete updateData.lat;
            delete updateData.lng;
        }
        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
        }

        const updatedService = await Service.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );
        res.json(updatedService);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   DELETE /api/services/:id
// @desc    Delete service
// @access  Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const service = await Service.findByIdAndDelete(req.params.id);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.json({ message: 'Service removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
