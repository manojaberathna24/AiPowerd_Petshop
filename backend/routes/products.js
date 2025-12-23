const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   GET /api/products
// @desc    Get all products with filtering
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { category, petType, search, minPrice, maxPrice, sort } = req.query;

        let query = { isActive: true };

        if (category) query.category = category;
        if (petType) query.petType = petType;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        let sortOption = { createdAt: -1 };
        if (sort === 'price-low') sortOption = { price: 1 };
        if (sort === 'price-high') sortOption = { price: -1 };
        if (sort === 'rating') sortOption = { rating: -1 };

        const products = await Product.find(query).sort(sortOption);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/products
// @desc    Create product
// @access  Admin
router.post('/', protect, admin, upload.single('image'), async (req, res) => {
    try {
        const productData = {
            ...req.body,
            image: req.file ? `/uploads/${req.file.filename}` : ''
        };
        const product = await Product.create(productData);
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Admin
router.put('/:id', protect, admin, upload.single('image'), async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const updateData = { ...req.body };
        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   DELETE /api/products/:id
// @desc    Delete product
// @access  Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/products/categories/list
// @desc    Get all categories
// @access  Public
router.get('/categories/list', async (req, res) => {
    try {
        const categories = await Product.distinct('category');
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
