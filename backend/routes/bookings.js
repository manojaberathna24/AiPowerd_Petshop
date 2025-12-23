const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { protect, admin } = require('../middleware/auth');

// @route   GET /api/bookings/mybookings
// @desc    Get user's bookings
// @access  Private
router.get('/mybookings', protect, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .sort({ date: -1 })
            .populate('service', 'name address phone');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/bookings
// @desc    Get all bookings (Admin)
// @access  Admin
router.get('/', protect, admin, async (req, res) => {
    try {
        const { status } = req.query;
        let query = {};
        if (status) query.status = status;

        const bookings = await Booking.find(query)
            .sort({ date: -1 })
            .populate('user', 'name email phone')
            .populate('service', 'name address');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/bookings
// @desc    Create booking
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { service, petName, petType, serviceType, date, timeSlot, notes } = req.body;

        // Check for existing booking at same time
        const existingBooking = await Booking.findOne({
            service,
            date: new Date(date),
            timeSlot,
            status: { $in: ['pending', 'confirmed'] }
        });

        if (existingBooking) {
            return res.status(400).json({ message: 'This time slot is already booked' });
        }

        const booking = await Booking.create({
            user: req.user._id,
            service,
            petName,
            petType,
            serviceType,
            date: new Date(date),
            timeSlot,
            notes
        });

        const populatedBooking = await Booking.findById(booking._id)
            .populate('service', 'name address phone');
        res.status(201).json(populatedBooking);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/bookings/:id/status
// @desc    Update booking status
// @access  Admin
router.put('/:id/status', protect, admin, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        booking.status = req.body.status;
        await booking.save();
        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/bookings/:id/cancel
// @desc    Cancel booking
// @access  Private
router.put('/:id/cancel', protect, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (booking.status === 'completed') {
            return res.status(400).json({ message: 'Cannot cancel completed booking' });
        }

        booking.status = 'cancelled';
        await booking.save();
        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
