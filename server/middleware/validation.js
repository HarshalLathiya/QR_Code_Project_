const { body } = require('express-validator');

exports.registerValidation = [
    body('username')
        .isLength({ min: 3 })
        .withMessage('Username must be at least 3 characters long'),
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
];

exports.loginValidation = [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email'),
    body('password')
        .exists()
        .withMessage('Password is required')
];

exports.qrValidation = [
    body('qr_name')
        .isLength({ min: 1 })
        .withMessage('QR name is required'),
    body('qr_data')
        .isLength({ min: 1 })
        .withMessage('QR data is required')
];