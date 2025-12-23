const mongoose = require('mongoose');

const adoptionSchema = new mongoose.Schema({
    pet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        default: ''
    },
    experience: {
        type: String,
        default: ''
    },
    livingCondition: {
        type: String,
        enum: ['house', 'apartment', 'farm', 'other'],
        default: 'house'
    },
    hasOtherPets: {
        type: Boolean,
        default: false
    },
    hasChildren: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    adminNote: {
        type: String,
        default: ''
    },
    reviewedAt: Date
}, { timestamps: true });

module.exports = mongoose.model('Adoption', adoptionSchema);
