// Script to fix user login - Updates password for test admin
// Run this if you created a user through admin panel and can't login

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

const fixUserPassword = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mps-petcare');
        console.log('✅ Connected to MongoDB');

        // Find the user
        const email = 't@gmail.com'; // Change this to the email you created
        const newPassword = '123456'; // The password you want to set

        const user = await User.findOne({ email });

        if (!user) {
            console.log('❌ User not found with email:', email);
            process.exit(1);
        }

        console.log('Found user:', user.name, '-', user.email);
        console.log('Current role:', user.role);

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update user password
        user.password = hashedPassword;
        await user.save();

        console.log('✅ Password updated successfully!');
        console.log('You can now login with:');
        console.log('Email:', email);
        console.log('Password:', newPassword);

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        mongoose.connection.close();
        process.exit(0);
    }
};

fixUserPassword();
