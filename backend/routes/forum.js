const express = require('express');
const router = express.Router();
const ForumPost = require('../models/ForumPost');
const { protect, admin } = require('../middleware/auth');

// @route   GET /api/forum
// @desc    Get all forum posts
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { category, search } = req.query;

        let query = { isActive: true };
        if (category) query.category = category;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } }
            ];
        }

        const posts = await ForumPost.find(query)
            .sort({ isPinned: -1, createdAt: -1 })
            .populate('user', 'name avatar');
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/forum/:id
// @desc    Get single post
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const post = await ForumPost.findById(req.params.id)
            .populate('user', 'name avatar')
            .populate('replies.user', 'name avatar');

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Increment views
        post.views += 1;
        await post.save();

        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/forum
// @desc    Create post
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { title, content, category, images } = req.body;

        const post = await ForumPost.create({
            user: req.user._id,
            title,
            content,
            category,
            images
        });

        const populatedPost = await ForumPost.findById(post._id).populate('user', 'name avatar');
        res.status(201).json(populatedPost);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/forum/:id/reply
// @desc    Add reply to post
// @access  Private
router.post('/:id/reply', protect, async (req, res) => {
    try {
        const post = await ForumPost.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        post.replies.push({
            user: req.user._id,
            content: req.body.content
        });
        await post.save();

        const updatedPost = await ForumPost.findById(req.params.id)
            .populate('user', 'name avatar')
            .populate('replies.user', 'name avatar');
        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/forum/:id/like
// @desc    Like/Unlike post
// @access  Private
router.put('/:id/like', protect, async (req, res) => {
    try {
        const post = await ForumPost.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const likeIndex = post.likes.indexOf(req.user._id);
        if (likeIndex > -1) {
            post.likes.splice(likeIndex, 1);
        } else {
            post.likes.push(req.user._id);
        }
        await post.save();

        res.json({ likes: post.likes.length, liked: likeIndex === -1 });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   DELETE /api/forum/:id
// @desc    Delete post
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const post = await ForumPost.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await post.deleteOne();
        res.json({ message: 'Post removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/forum/:id/pin
// @desc    Pin/Unpin post (Admin)
// @access  Admin  
router.put('/:id/pin', protect, admin, async (req, res) => {
    try {
        const post = await ForumPost.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        post.isPinned = !post.isPinned;
        await post.save();
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
