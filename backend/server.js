require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
const qrRoutes = require('./routes/qr');
const adminRoutes = require('./routes/admin');
const path = require('path');

// Basic route
app.get('/', (req, res) => {
    res.send('QR Code Generator Backend is running');
});

// Serve uploads folder statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/qr', qrRoutes);
app.use('/api/admin', adminRoutes);

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
