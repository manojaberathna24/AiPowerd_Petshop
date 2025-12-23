const mongoose = require('mongoose');

const knowledgeBaseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['nutrition', 'health', 'training', 'grooming', 'general', 'emergency'],
        required: true
    },
    petType: {
        type: String,
        enum: ['dog', 'cat', 'bird', 'fish', 'all'],
        default: 'all'
    },
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    keywords: [{
        type: String
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// Text search index
knowledgeBaseSchema.index({
    question: 'text',
    answer: 'text',
    keywords: 'text',
    title: 'text'
});

module.exports = mongoose.model('KnowledgeBase', knowledgeBaseSchema);
