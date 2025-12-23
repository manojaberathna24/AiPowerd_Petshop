const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @route   POST /api/auth/google
// @desc    Authenticate with Google
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { credential } = req.body;

        // Verify Google token
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        const { sub: googleId, email, name, picture } = payload;

        // Check if user already exists
        let user = await User.findOne({ $or: [{ googleId }, { email }] });

        if (user) {
            // User exists - update Google ID if not set
            if (!user.googleId) {
                user.googleId = googleId;
                user.authProvider = 'google';
                user.avatar = picture || user.avatar;
                await user.save();
            }
        } else {
            // Create new user
            user = await User.create({
                name,
                email,
                googleId,
                authProvider: 'google',
                avatar: picture || '',
                isActive: true
            });
        }

        // Return user data with token
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
        console.error('Google Auth Error:', error);
        res.status(401).json({
            message: 'Google authentication failed',
            error: error.message
        });
    }
});

module.exports = router;
