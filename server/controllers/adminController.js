const User = require('../models/User');
const QRCode = require('../models/QRCode');

exports.getAllUsers = async (req, res) => {
    try {
        // Check if user is admin
        const user = await User.findById(req.userId);
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        const users = await User.getAllUsers();
        res.json({ users });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllQRCodes = async (req, res) => {
    try {
        // Check if user is admin
        const user = await User.findById(req.userId);
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        const qrCodes = await QRCode.getAllQRCodes();
        res.json({ qrCodes });
    } catch (error) {
        console.error('Get QR codes error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getStats = async (req, res) => {
    try {
        // Check if user is admin
        const user = await User.findById(req.userId);
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        const stats = await QRCode.getStats();
        const totalUsers = await User.getAllUsers();

        res.json({
            total_qr_codes: stats[0]?.total_qr_codes || 0,
            total_users: totalUsers.length,
            recent_activity: stats
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if user exists
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prevent deleting admin users
        if (user.role === 'admin') {
            return res.status(403).json({ message: 'Cannot delete admin user' });
        }

        // Delete user (cascade will delete QR codes)
        await User.delete(id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteQRCode = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if QR code exists
        const qrCode = await QRCode.findById(id);
        if (!qrCode) {
            return res.status(404).json({ message: 'QR code not found' });
        }

        // Delete QR code
        await QRCode.delete(id);
        res.json({ message: 'QR code deleted successfully' });
    } catch (error) {
        console.error('Delete QR code error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
