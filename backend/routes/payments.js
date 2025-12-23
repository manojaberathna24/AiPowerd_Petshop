const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');

// PayHere Configuration
const PAYHERE_MERCHANT_ID = process.env.PAYHERE_MERCHANT_ID || 'YOUR_MERCHANT_ID';
const PAYHERE_MERCHANT_SECRET = process.env.PAYHERE_MERCHANT_SECRET || 'YOUR_MERCHANT_SECRET';
const PAYHERE_MODE = process.env.PAYHERE_MODE || 'sandbox'; // 'sandbox' or 'live'

// PayHere URLs
const PAYHERE_URLS = {
    sandbox: 'https://sandbox.payhere.lk/pay/checkout',
    live: 'https://www.payhere.lk/pay/checkout'
};

// Generate PayHere hash
const generateHash = (orderId, amount, currency = 'LKR') => {
    const merchantSecret = PAYHERE_MERCHANT_SECRET;
    const hashedSecret = crypto.createHash('md5').update(merchantSecret).digest('hex').toUpperCase();

    const amountFormatted = parseFloat(amount).toFixed(2);
    const hash = crypto.createHash('md5')
        .update(PAYHERE_MERCHANT_ID + orderId + amountFormatted + currency + hashedSecret)
        .digest('hex')
        .toUpperCase();

    return hash;
};

// @route   POST /api/payments/initiate
// @desc    Initiate payment for an order
// @access  Private
router.post('/initiate', protect, async (req, res) => {
    try {
        const { orderId } = req.body;

        const order = await Order.findById(orderId).populate('user', 'name email phone');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Generate payment hash
        const hash = generateHash(order._id.toString(), order.totalPrice);

        // PayHere payment data
        const paymentData = {
            merchant_id: PAYHERE_MERCHANT_ID,
            return_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/success`,
            cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/cancel`,
            notify_url: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payments/notify`,
            order_id: order._id.toString(),
            items: `MPS PetCare Order #${order._id.toString().slice(-8)}`,
            currency: 'LKR',
            amount: order.totalPrice.toFixed(2),
            first_name: order.user.name.split(' ')[0] || 'Customer',
            last_name: order.user.name.split(' ')[1] || '',
            email: order.user.email,
            phone: order.user.phone || order.shippingAddress?.phone || '',
            address: order.shippingAddress?.address || '',
            city: order.shippingAddress?.city || '',
            country: 'Sri Lanka',
            hash: hash,
            payhere_url: PAYHERE_URLS[PAYHERE_MODE]
        };

        res.json(paymentData);

    } catch (error) {
        console.error('Payment initiation error:', error);
        res.status(500).json({ message: 'Payment initiation failed' });
    }
});

// @route   POST /api/payments/notify
// @desc    PayHere payment notification callback
// @access  Public (called by PayHere)
router.post('/notify', async (req, res) => {
    try {
        const {
            merchant_id,
            order_id,
            payhere_amount,
            payhere_currency,
            status_code,
            md5sig
        } = req.body;

        // Verify the payment signature
        const localSig = crypto.createHash('md5')
            .update(
                merchant_id +
                order_id +
                payhere_amount +
                payhere_currency +
                status_code +
                crypto.createHash('md5').update(PAYHERE_MERCHANT_SECRET).digest('hex').toUpperCase()
            )
            .digest('hex')
            .toUpperCase();

        if (localSig !== md5sig) {
            console.error('Payment signature verification failed');
            return res.status(400).send('Signature mismatch');
        }

        // Find the order
        const order = await Order.findById(order_id);

        if (!order) {
            return res.status(404).send('Order not found');
        }

        // Update order based on payment status
        // Status codes: 2 = success, 0 = pending, -1 = canceled, -2 = failed, -3 = chargedback
        if (status_code === '2') {
            order.isPaid = true;
            order.paidAt = new Date();
            order.paymentResult = {
                status: 'completed',
                transactionId: req.body.payment_id || '',
                updateTime: new Date()
            };
            order.status = 'processing';
        } else if (status_code === '0') {
            order.paymentResult = { status: 'pending' };
        } else {
            order.paymentResult = { status: 'failed', statusCode: status_code };
        }

        await order.save();
        console.log(`Payment ${status_code === '2' ? 'successful' : 'status: ' + status_code} for order: ${order_id}`);

        res.status(200).send('OK');

    } catch (error) {
        console.error('Payment notification error:', error);
        res.status(500).send('Error processing notification');
    }
});

// @route   GET /api/payments/status/:orderId
// @desc    Get payment status for an order
// @access  Private
router.get('/status/:orderId', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json({
            orderId: order._id,
            isPaid: order.isPaid,
            paidAt: order.paidAt,
            paymentResult: order.paymentResult,
            status: order.status
        });

    } catch (error) {
        res.status(500).json({ message: 'Error fetching payment status' });
    }
});

module.exports = router;
