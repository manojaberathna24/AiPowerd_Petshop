const express = require('express');
const router = express.Router();
const Adoption = require('../models/Adoption');
const Pet = require('../models/Pet');
const User = require('../models/User');
const { protect, admin } = require('../middleware/auth');

// @route   POST /api/adoptions
// @desc    Create adoption request
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { petId, message, experience, livingCondition, hasOtherPets, hasChildren } = req.body;

        // Check if pet exists and is available
        const pet = await Pet.findById(petId);
        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }
        if (pet.status !== 'available') {
            return res.status(400).json({ message: 'Pet is not available for adoption' });
        }

        // Check for existing pending request
        const existingRequest = await Adoption.findOne({
            pet: petId,
            user: req.user._id,
            status: 'pending'
        });
        if (existingRequest) {
            return res.status(400).json({ message: 'You already have a pending request for this pet' });
        }

        const adoption = await Adoption.create({
            pet: petId,
            user: req.user._id,
            message,
            experience,
            livingCondition,
            hasOtherPets,
            hasChildren
        });

        // Update pet status to pending
        pet.status = 'pending';
        await pet.save();

        res.status(201).json(adoption);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/adoptions/myrequests
// @desc    Get user's adoption requests
// @access  Private
router.get('/myrequests', protect, async (req, res) => {
    try {
        const adoptions = await Adoption.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .populate('pet');
        res.json(adoptions);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/adoptions
// @desc    Get all adoption requests (Admin)
// @access  Admin
router.get('/', protect, admin, async (req, res) => {
    try {
        const { status } = req.query;
        let query = {};
        if (status) query.status = status;

        const adoptions = await Adoption.find(query)
            .sort({ createdAt: -1 })
            .populate('pet')
            .populate('user', 'name email phone');
        res.json(adoptions);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/adoptions/:id/approve
// @desc    Approve adoption request
// @access  Admin
router.put('/:id/approve', protect, admin, async (req, res) => {
    try {
        const adoption = await Adoption.findById(req.params.id);
        if (!adoption) {
            return res.status(404).json({ message: 'Adoption request not found' });
        }

        adoption.status = 'approved';
        adoption.reviewedAt = Date.now();
        adoption.adminNote = req.body.note || '';
        await adoption.save();

        // Update pet status and owner
        const pet = await Pet.findById(adoption.pet);
        if (pet) {
            pet.status = 'adopted';
            pet.owner = adoption.user;
            await pet.save();
        }

        // Add pet to user's myPets
        await User.findByIdAndUpdate(adoption.user, {
            $push: { myPets: adoption.pet }
        });

        // Reject other pending requests for this pet
        await Adoption.updateMany(
            { pet: adoption.pet, _id: { $ne: adoption._id }, status: 'pending' },
            { status: 'rejected', adminNote: 'Pet has been adopted by another user' }
        );

        res.json(adoption);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/adoptions/:id/reject
// @desc    Reject adoption request
// @access  Admin
router.put('/:id/reject', protect, admin, async (req, res) => {
    try {
        const adoption = await Adoption.findById(req.params.id);
        if (!adoption) {
            return res.status(404).json({ message: 'Adoption request not found' });
        }

        adoption.status = 'rejected';
        adoption.reviewedAt = Date.now();
        adoption.adminNote = req.body.note || '';
        await adoption.save();

        // Check if there are other pending requests for this pet
        const otherPendingRequests = await Adoption.countDocuments({
            pet: adoption.pet,
            status: 'pending'
        });

        // If no other pending requests, set pet back to available
        if (otherPendingRequests === 0) {
            await Pet.findByIdAndUpdate(adoption.pet, { status: 'available' });
        }

        res.json(adoption);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
