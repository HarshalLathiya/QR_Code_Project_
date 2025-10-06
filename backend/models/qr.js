const db = require('../config/db');
const fs = require('fs');
const path = require('path');

class QRCode {
    static async create(userId, url, qrImagePath) {
        const [result] = await db.execute(
            'INSERT INTO qrcodes (user_id, url, qr_image_path, created_at, scan_count) VALUES (?, ?, ?, NOW(), 0)',
            [userId, url, qrImagePath]
        );
        return result.insertId;
    }

    static async findByUserId(userId) {
        const [rows] = await db.execute('SELECT * FROM qrcodes WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        return rows;
    }

    static async findAll() {
        const [rows] = await db.execute('SELECT q.*, u.name as user_name FROM qrcodes q JOIN users u ON q.user_id = u.id ORDER BY q.created_at DESC');
        return rows;
    }

    static async delete(id) {
        const [qr] = await db.execute('SELECT qr_image_path FROM qrcodes WHERE id = ?', [id]);
        if (qr[0] && qr[0].qr_image_path) {
            const filePath = path.join(__dirname, '..', 'uploads', qr[0].qr_image_path);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        await db.execute('DELETE FROM qrcodes WHERE id = ?', [id]);
    }

    static async incrementScanCount(id) {
        await db.execute('UPDATE qrcodes SET scan_count = scan_count + 1 WHERE id = ?', [id]);
    }

    static async findById(id) {
        const [rows] = await db.execute('SELECT * FROM qrcodes WHERE id = ?', [id]);
        return rows[0];
    }
}

module.exports = QRCode;
