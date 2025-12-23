const express = require('express');
const router = express.Router();
const Offer = require('../models/Offer');
const { protect, admin } = require('../middleware/auth');

// IMPORTANT: Specific routes MUST come before parameterized routes

// @route   GET /api/offers/all
// @desc    Get ALL offers (including inactive) for admin
// @access  Public
router.get('/all', async (req, res) => {
    try {
        const offers = await Offer.find().sort({ createdAt: -1 });
        console.log(`Fetched ${offers.length} total offers`);
        res.json(offers);
    } catch (error) {
        console.error('Get all offers error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/offers/applicable
// @desc    Get applicable offers for a product
// @access  Public
router.get('/applicable', async (req, res) => {
    try {
        const { category, petType } = req.query;
        const now = new Date();

        const offers = await Offer.find({
            isActive: true,
            validFrom: { $lte: now },
            validUntil: { $gte: now },
            $or: [
                { category: 'all' },
                { category: category }
            ],
            $and: [
                {
                    $or: [
                        { petType: 'all' },
                        { petType: petType }
                    ]
                }
            ]
        }).sort({ discountPercentage: -1 });

        res.json(offers);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/offers
// @desc    Get all active offers
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { category, petType } = req.query;
        const now = new Date();

        let query = {
            isActive: true,
            validFrom: { $lte: now },
            validUntil: { $gte: now }
        };

        if (category && category !== 'all') {
            query.category = { $in: [category, 'all'] };
        }

        if (petType && petType !== 'all') {
            query.petType = { $in: [petType, 'all'] };
        }

        const offers = await Offer.find(query).sort({ discountPercentage: -1 });
        res.json(offers);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/offers
// @desc    Create new offer
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
    try {
        console.log('Creating offer:', req.body);
        const offer = await Offer.create(req.body);
        console.log('Offer created:', offer._id);
        res.status(201).json(offer);
    } catch (error) {
        console.error('Create offer error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/offers/:id
// @desc    Update offer
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
    try {
        console.log('Updating offer:', req.params.id);
        const offer = await Offer.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!offer) {
            return res.status(404).json({ message: 'Offer not found' });
        }

        console.log('Offer updated:', offer._id);
        res.json(offer);
    } catch (error) {
        console.error('Update offer error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   DELETE /api/offers/:id
// @desc    Delete offer
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        console.log('Deleting offer:', req.params.id);
        const offer = await Offer.findByIdAndDelete(req.params.id);

        if (!offer) {
            console.log('Offer not found:', req.params.id);
            return res.status(404).json({ message: 'Offer not found' });
        }

        console.log('Offer deleted successfully:', req.params.id);
        res.json({ message: 'Offer deleted successfully' });
    } catch (error) {
        console.error('Delete offer error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
