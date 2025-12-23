const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Pet name is required'],
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['dog', 'cat', 'bird', 'fish', 'rabbit', 'hamster', 'other']
    },
    breed: {
        type: String,
        default: 'Unknown'
    },
    age: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: ''
    },
    location: {
        type: String,
        default: ''
    },
    vaccinated: {
        type: Boolean,
        default: false
    },
    neutered: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['available', 'pending', 'adopted'],
        default: 'available'
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    healthInfo: {
        type: String,
        default: ''
    },
    personality: {
        type: String,
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.model('Pet', petSchema);
