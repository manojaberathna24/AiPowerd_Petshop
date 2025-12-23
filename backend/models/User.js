const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: function () {
            return this.authProvider === 'local';
        },
        minlength: 6
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    authProvider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local'
    },
    avatar: {
        type: String,
        default: ''
    },
    phone: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        default: ''
    },
    avatar: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    myPets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet'
    }],
    // Admin specific fields
    shopName: {
        type: String,
        default: ''
    },
    shopAddress: {
        type: String,
        default: ''
    },
    bankDetails: {
        bankName: { type: String, default: '' },
        bankBranch: { type: String, default: '' },
        accountNumber: { type: String, default: '' },
        accountHolderName: { type: String, default: '' }
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
