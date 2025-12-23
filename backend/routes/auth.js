const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            phone
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });
    } catch (error) {
        console.error('Register Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(401).json({ message: 'Account is deactivated' });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            phone: user.phone,
            address: user.address,
            token: generateToken(user._id)
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/auth/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select('-password')
            .populate('myPets');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.phone = req.body.phone || user.phone;
            user.address = req.body.address || user.address;
            user.avatar = req.body.avatar || user.avatar;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                phone: updatedUser.phone,
                address: updatedUser.address,
                avatar: updatedUser.avatar,
                token: generateToken(updatedUser._id)
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/auth/check-admin
// @desc    Check if any admin exists
// @access  Public
router.get('/check-admin', async (req, res) => {
    try {
        const adminExists = await User.findOne({ role: 'admin' });
        res.json({ adminExists: !!adminExists });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/auth/admin-setup
// @desc    Create admin account (first time setup or with secret key)
// @access  Public
router.post('/admin-setup', async (req, res) => {
    try {
        const { name, email, password, phone, secretKey, shopName, shopAddress, bankDetails } = req.body;

        // Check if admin already exists
        const adminExists = await User.findOne({ role: 'admin' });

        // If admin exists, require secret key
        if (adminExists) {
            const validSecretKey = process.env.ADMIN_SECRET_KEY || 'MPS_ADMIN_2024';
            if (secretKey !== validSecretKey) {
                return res.status(403).json({ message: 'Invalid admin secret key' });
            }
        }

        // Check if email already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Create admin user with shop and bank details
        const admin = await User.create({
            name,
            email,
            password,
            phone,
            role: 'admin',
            shopName: shopName || '',
            shopAddress: shopAddress || '',
            bankDetails: bankDetails || {}
        });

        res.status(201).json({
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
            token: generateToken(admin._id)
        });
    } catch (error) {
        console.error('Admin Setup Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
