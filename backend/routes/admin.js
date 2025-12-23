const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const Pet = require('../models/Pet');
const Order = require('../models/Order');
const Adoption = require('../models/Adoption');
const Service = require('../models/Service');
const { protect, admin } = require('../middleware/auth');

// @route   GET /api/admin/stats
// @desc    Get dashboard statistics
// @access  Admin
router.get('/stats', protect, admin, async (req, res) => {
    try {
        const [
            totalUsers,
            totalProducts,
            totalPets,
            totalOrders,
            totalServices,
            pendingAdoptions,
            pendingOrders,
            recentOrders,
            recentAdoptions
        ] = await Promise.all([
            User.countDocuments(),
            Product.countDocuments(),
            Pet.countDocuments(),
            Order.countDocuments(),
            Service.countDocuments(),
            Adoption.countDocuments({ status: 'pending' }),
            Order.countDocuments({ status: 'pending' }),
            Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name'),
            Adoption.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name').populate('pet', 'name')
        ]);

        // Calculate revenue
        const orders = await Order.find({ status: { $ne: 'cancelled' } });
        const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

        res.json({
            totalUsers,
            totalProducts,
            totalPets,
            totalOrders,
            totalServices,
            pendingAdoptions,
            pendingOrders,
            totalRevenue,
            recentOrders,
            recentAdoptions
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Admin
router.get('/users', protect, admin, async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/admin/users/:id/role
// @desc    Update user role
// @access  Admin
router.put('/users/:id/role', protect, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = req.body.role;
        await user.save();
        res.json({ message: 'User role updated', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/admin/users/:id/status
// @desc    Activate/Deactivate user
// @access  Admin
router.put('/users/:id/status', protect, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.isActive = req.body.isActive;
        await user.save();
        res.json({ message: 'User status updated', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
// @access  Admin
router.delete('/users/:id', protect, admin, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/admin/offers
// @desc    Get all offers (including inactive) for admin
// @access  Admin
router.get('/offers', protect, admin, async (req, res) => {
    try {
        const Offer = require('../models/Offer');
        const offers = await Offer.find().sort({ createdAt: -1 });
        res.json(offers);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
