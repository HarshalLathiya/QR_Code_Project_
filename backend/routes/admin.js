const express = require('express');
const router = express.Router();
const User = require('../models/user');
const QRCode = require('../models/qr');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Get all users
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const users = await User.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete user
router.delete('/users/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        await User.deleteUser(req.params.id);
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get all QR codes
router.get('/qrcodes', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const qrs = await QRCode.findAll();
        res.json(qrs);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete QR code
router.delete('/qrcodes/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        await QRCode.delete(req.params.id);
        res.json({ message: 'QR code deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
