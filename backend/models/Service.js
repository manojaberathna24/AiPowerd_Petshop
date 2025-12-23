const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Service name is required'],
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['vet', 'grooming', 'petshop', 'boarding', 'training', 'other']
    },
    description: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    },
    website: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: ''
    },
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    openHours: {
        type: String,
        default: '9:00 AM - 6:00 PM'
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    numReviews: {
        type: Number,
        default: 0
    },
    services: [{
        type: String
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
