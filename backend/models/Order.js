const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    name: String,
    image: String,
    price: Number,
    quantity: {
        type: Number,
        required: true,
        min: 1
    }
});

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [orderItemSchema],
    shippingAddress: {
        fullName: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        phone: { type: String, required: true }
    },
    paymentMethod: {
        type: String,
        enum: ['cod', 'card', 'bank'],
        default: 'cod'
    },
    totalPrice: {
        type: Number,
        required: true
    },
    shippingPrice: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    paidAt: Date,
    deliveredAt: Date,
    statusHistory: [{
        status: {
            type: String,
            enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        note: String
    }]
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
