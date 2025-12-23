const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    targetType: {
        type: String,
        enum: ['product', 'service'],
        required: true
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'targetType'
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    title: {
        type: String,
        default: ''
    },
    comment: {
        type: String,
        required: true
    },
    images: [{
        type: String
    }],
    isVerified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Ensure one review per user per target
reviewSchema.index({ user: 1, targetType: 1, targetId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
