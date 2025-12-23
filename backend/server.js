const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mps-petcare')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/auth/google', require('./routes/google-auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/pets', require('./routes/pets'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/services', require('./routes/services'));
app.use('/api/adoptions', require('./routes/adoptions'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/lostfound', require('./routes/lostfound'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/forum', require('./routes/forum'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/knowledge', require('./routes/knowledge'));
app.use('/api/offers', require('./routes/offers'));
app.use('/api/users', require('./routes/users'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'MPS PetCare API is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 MPS PetCare Server running on port ${PORT}`);
});
