const express = require('express');
const { getAllUsers, getAllQRCodes, getStats, deleteUser, deleteQRCode } = require('../controllers/adminController');
const { auth, isAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/users', auth, isAdmin, getAllUsers);
router.delete('/users/:id', auth, isAdmin, deleteUser);
router.get('/qr-codes', auth, isAdmin, getAllQRCodes);
router.delete('/qr-codes/:id', auth, isAdmin, deleteQRCode);
router.get('/stats', auth, isAdmin, getStats);

module.exports = router;
