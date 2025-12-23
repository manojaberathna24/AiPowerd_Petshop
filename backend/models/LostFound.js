const mongoose = require('mongoose');

const lostFoundSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['lost', 'found'],
        required: true
    },
    petType: {
        type: String,
        required: true,
        enum: ['dog', 'cat', 'bird', 'rabbit', 'other']
    },
    breed: {
        type: String,
        default: 'Unknown'
    },
    color: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: ''
    },
    location: {
        address: { type: String, required: true },
        lat: { type: Number },
        lng: { type: Number }
    },
    date: {
        type: Date,
        required: true
    },
    contactName: {
        type: String,
        required: true
    },
    contactPhone: {
        type: String,
        required: true
    },
    contactEmail: {
        type: String,
        default: ''
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'resolved'],
        default: 'active'
    },
    reward: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('LostFound', lostFoundSchema);
