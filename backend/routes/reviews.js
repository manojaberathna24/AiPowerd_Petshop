const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Product = require('../models/Product');
const Service = require('../models/Service');
const { protect } = require('../middleware/auth');

// Helper to update average rating
const updateRating = async (targetType, targetId) => {
    const reviews = await Review.find({ targetType, targetId });
    const avgRating = reviews.length > 0
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        : 0;

    const Model = targetType === 'product' ? Product : Service;
    await Model.findByIdAndUpdate(targetId, {
        rating: Math.round(avgRating * 10) / 10,
        numReviews: reviews.length
    });
};

// @route   GET /api/reviews/:targetType/:targetId
// @desc    Get reviews for a product/service
// @access  Public
router.get('/:targetType/:targetId', async (req, res) => {
    try {
        const { targetType, targetId } = req.params;
        const reviews = await Review.find({ targetType, targetId })
            .sort({ createdAt: -1 })
            .populate('user', 'name avatar');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/reviews
// @desc    Create review
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { targetType, targetId, rating, title, comment } = req.body;

        // Check if already reviewed
        const existingReview = await Review.findOne({
            user: req.user._id,
            targetType,
            targetId
        });
        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this item' });
        }

        const review = await Review.create({
            user: req.user._id,
            targetType,
            targetId,
            rating,
            title,
            comment
        });

        await updateRating(targetType, targetId);

        const populatedReview = await Review.findById(review._id).populate('user', 'name avatar');
        res.status(201).json(populatedReview);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/reviews/:id
// @desc    Update review
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        review.rating = req.body.rating || review.rating;
        review.title = req.body.title || review.title;
        review.comment = req.body.comment || review.comment;
        await review.save();

        await updateRating(review.targetType, review.targetId);

        res.json(review);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete review
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const { targetType, targetId } = review;
        await review.deleteOne();
        await updateRating(targetType, targetId);

        res.json({ message: 'Review removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
