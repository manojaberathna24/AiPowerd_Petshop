const express = require('express');
const router = express.Router();
const Pet = require('../models/Pet');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   GET /api/pets
// @desc    Get all pets for adoption
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { type, gender, status, search } = req.query;

        let query = {};

        if (type) query.type = type;
        if (gender) query.gender = gender;
        if (status) query.status = status;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { breed: { $regex: search, $options: 'i' } }
            ];
        }

        const pets = await Pet.find(query).sort({ createdAt: -1 });
        res.json(pets);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/pets/available
// @desc    Get available pets for adoption
// @access  Public
router.get('/available', async (req, res) => {
    try {
        const pets = await Pet.find({ status: 'available' }).sort({ createdAt: -1 });
        res.json(pets);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/pets/:id
// @desc    Get single pet
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.id).populate('owner', 'name email');
        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }
        res.json(pet);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/pets
// @desc    Create pet listing
// @access  Admin
router.post('/', protect, admin, upload.single('image'), async (req, res) => {
    try {
        const petData = {
            ...req.body,
            image: req.file ? `/uploads/${req.file.filename}` : ''
        };
        const pet = await Pet.create(petData);
        res.status(201).json(pet);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/pets/:id
// @desc    Update pet
// @access  Admin
router.put('/:id', protect, admin, upload.single('image'), async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.id);
        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        const updateData = { ...req.body };
        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
        }

        const updatedPet = await Pet.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );
        res.json(updatedPet);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   DELETE /api/pets/:id
// @desc    Delete pet
// @access  Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const pet = await Pet.findByIdAndDelete(req.params.id);
        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }
        res.json({ message: 'Pet removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
