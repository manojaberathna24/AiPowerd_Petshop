const express = require('express');
const router = express.Router();
const Offer = require('../models/Offer');
const { protect, admin } = require('../middleware/auth');

// @route   GET /api/admin/offers
// @desc    Get all offers (including inactive)  
// @access  Private/Admin
router.get('/offers', protect, admin, async (req, res) => {
    try {
        const offers = await Offer.find().sort({ createdAt: -1 });
        res.json(offers);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
