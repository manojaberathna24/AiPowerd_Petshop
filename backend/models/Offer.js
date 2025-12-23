const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['food', 'toys', 'accessories', 'grooming', 'all'],
        default: 'all'
    },
    petType: {
        type: String,
        enum: ['dog', 'cat', 'bird', 'fish', 'all'],
        default: 'all'
    },
    discountPercentage: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    validFrom: {
        type: Date,
        required: true
    },
    validUntil: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    bannerImage: {
        type: String,
        default: ''
    }
}, { timestamps: true });

// Method to check if offer is currently valid
offerSchema.methods.isValid = function () {
    const now = new Date();
    return this.isActive && now >= this.validFrom && now <= this.validUntil;
};

module.exports = mongoose.model('Offer', offerSchema);
