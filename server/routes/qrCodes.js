const express = require('express');
const { generateQR, getUserQRCodes, saveQRCode } = require('../controllers/qrController');
const { auth } = require('../middleware/auth');
const { qrValidation } = require('../middleware/validation');

const router = express.Router();

router.post('/generate', auth, qrValidation, generateQR);
router.post('/save', auth, qrValidation, saveQRCode);
router.get('/my-codes', auth, getUserQRCodes);

module.exports = router;