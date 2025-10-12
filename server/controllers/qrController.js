const QRCode = require('../models/QRCode');
const qrcode = require('qrcode');
const { validationResult } = require('express-validator');

exports.generateQR = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { qr_name, qr_data, qr_style, qr_color, qr_bg_color } = req.body;
        const user_id = req.userId;

        // Save QR code data to database
        await QRCode.create({
            user_id,
            qr_name,
            qr_data,
            qr_style: qr_style || 'standard',
            qr_color: qr_color || '#000000',
            qr_bg_color: qr_bg_color || '#FFFFFF'
        });

        // Generate QR code image
        const options = {
            color: {
                dark: qr_color || '#000000',
                light: qr_bg_color || '#FFFFFF'
            },
            width: 300,
            margin: 1
        };
        const qr_png = await qrcode.toBuffer(qr_data, options);

        res.setHeader('Content-type', 'image/png');
        res.send(qr_png);
    } catch (error) {
        console.error('QR generation error:', error);
        res.status(500).json({ message: 'Server error during QR generation' });
    }
};

exports.getUserQRCodes = async (req, res) => {
    try {
        const user_id = req.userId;
        const qrCodes = await QRCode.findByUserId(user_id);
        res.json({ qrCodes });
    } catch (error) {
        console.error('Get QR codes error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.saveQRCode = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { qr_name, qr_data, qr_style, qr_color, qr_bg_color } = req.body;
        const user_id = req.userId;

        const result = await QRCode.create({
            user_id,
            qr_name,
            qr_data,
            qr_style: qr_style || 'standard',
            qr_color: qr_color || '#000000',
            qr_bg_color: qr_bg_color || '#FFFFFF'
        });

        res.status(201).json({
            message: 'QR Code saved successfully',
            qrCode: {
                id: result.insertId,
                qr_name,
                qr_data,
                qr_style,
                qr_color,
                qr_bg_color,
                created_at: new Date()
            }
        });
    } catch (error) {
        console.error('Save QR code error:', error);
        res.status(500).json({ message: 'Server error while saving QR code' });
    }
};