const express = require('express');
const router = express.Router();
const KnowledgeBase = require('../models/KnowledgeBase');

// @route   GET /api/knowledge
// @desc    Search knowledge base
// @access  Public
router.get('/search', async (req, res) => {
    try {
        const { query, category, petType } = req.query;

        let searchQuery = { isActive: true };

        if (category) {
            searchQuery.category = category;
        }

        if (petType && petType !== 'all') {
            searchQuery.petType = { $in: [petType, 'all'] };
        }

        // Text search
        if (query) {
            searchQuery.$text = { $search: query };

            const results = await KnowledgeBase.find(searchQuery)
                .select('title question answer category petType')
                .limit(5)
                .sort({ score: { $meta: 'textScore' } });

            return res.json(results);
        }

        // Get all if no search query
        const results = await KnowledgeBase.find(searchQuery)
            .select('title question answer category petType')
            .limit(10);

        res.json(results);
    } catch (error) {
        console.error('Knowledge search error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/knowledge
// @desc    Get all knowledge base items
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { category, petType } = req.query;

        let query = { isActive: true };

        if (category) query.category = category;
        if (petType) query.petType = { $in: [petType, 'all'] };

        const items = await KnowledgeBase.find(query)
            .select('title question answer category petType');

        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
