const express = require('express');
const router = express.Router();
const QRCode = require('../models/qr');
const { authenticateToken } = require('../middleware/auth');
const qrcode = require('qrcode');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Generate QR code
router.post('/generate', authenticateToken, async (req, res) => {
    const { type, data } = req.body; // type: 'url', 'text', 'email', 'phone', 'wifi'
    try {
        let qrData;
        switch (type) {
            case 'url':
                qrData = data;
                break;
            case 'text':
                qrData = data;
                break;
            case 'email':
                qrData = `mailto:${data}`;
                break;
            case 'phone':
                qrData = `tel:${data}`;
                break;
            case 'wifi':
                // Assume data is { ssid, password, encryption }
                const { ssid, password, encryption = 'WPA' } = data;
                qrData = `WIFI:S:${ssid};T:${encryption};P:${password};;`;
                break;
            default:
                return res.status(400).json({ message: 'Invalid QR type' });
        }

        const qrImagePath = `qr_${Date.now()}_${req.user.id}.png`;
        const fullPath = path.join(uploadsDir, qrImagePath);
        await qrcode.toFile(fullPath, qrData);

        const qrId = await QRCode.create(req.user.id, qrData, qrImagePath);
        const qr = await QRCode.findById(qrId);

        res.status(201).json({ qr, downloadUrl: `/uploads/${qrImagePath}` });
    } catch (error) {
        res.status(500).json({ message: 'Error generating QR code', error: error.message });
    }
});

// Get user's QR codes
router.get('/user', authenticateToken, async (req, res) => {
    try {
        const qrs = await QRCode.findByUserId(req.user.id);
        res.json(qrs);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete QR code
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const qr = await QRCode.findById(req.params.id);
        if (!qr || qr.user_id !== req.user.id) {
            return res.status(404).json({ message: 'QR code not found' });
        }
        await QRCode.delete(req.params.id);
        res.json({ message: 'QR code deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Scan QR code (increment count)
router.post('/scan/:id', async (req, res) => {
    try {
        await QRCode.incrementScanCount(req.params.id);
        res.json({ message: 'Scan count incremented' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
