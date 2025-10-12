const db = require('../config/database');

class QRCode {
    static async create(qrData) {
        const { user_id, qr_name, qr_data, qr_style, qr_color, qr_bg_color } = qrData;

        const sql = `INSERT INTO qr_codes (user_id, qr_name, qr_data, qr_style, qr_color, qr_bg_color) 
                     VALUES (?, ?, ?, ?, ?, ?)`;
        return new Promise((resolve, reject) => {
            db.execute(sql, [user_id, qr_name, qr_data, qr_style, qr_color, qr_bg_color], (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
    }

    static async findByUserId(userId) {
        const sql = `SELECT * FROM qr_codes WHERE user_id = ? ORDER BY created_at DESC`;
        return new Promise((resolve, reject) => {
            db.execute(sql, [userId], (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
    }

    static async findById(id) {
        const sql = `SELECT * FROM qr_codes WHERE id = ?`;
        return new Promise((resolve, reject) => {
            db.execute(sql, [id], (err, results) => {
                if (err) reject(err);
                resolve(results[0]);
            });
        });
    }

    static async getAllQRCodes() {
        const sql = `SELECT qr.*, u.username, u.email 
                     FROM qr_codes qr 
                     JOIN users u ON qr.user_id = u.id 
                     ORDER BY qr.created_at DESC`;
        return new Promise((resolve, reject) => {
            db.execute(sql, (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
    }

    static async getStats() {
        const sql = `
            SELECT
                COUNT(*) as total_qr_codes,
                COUNT(DISTINCT user_id) as total_users,
                DATE(created_at) as date,
                COUNT(*) as daily_count
            FROM qr_codes
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
            GROUP BY DATE(created_at)
            ORDER BY date DESC
        `;
        return new Promise((resolve, reject) => {
            db.execute(sql, (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
    }

    static async delete(id) {
        const sql = `DELETE FROM qr_codes WHERE id = ?`;
        return new Promise((resolve, reject) => {
            db.execute(sql, [id], (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
    }
}

module.exports = QRCode;