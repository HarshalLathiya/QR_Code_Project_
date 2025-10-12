const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
    static async create(userData) {
        const { username, email, password } = userData;
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
        return new Promise((resolve, reject) => {
            db.execute(sql, [username, email, hashedPassword], (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
    }

    static async findByEmail(email) {
        const sql = `SELECT * FROM users WHERE email = ?`;
        return new Promise((resolve, reject) => {
            db.execute(sql, [email], (err, results) => {
                if (err) reject(err);
                resolve(results[0]);
            });
        });
    }

    static async findById(id) {
        const sql = `SELECT id, username, email, role, created_at FROM users WHERE id = ?`;
        return new Promise((resolve, reject) => {
            db.execute(sql, [id], (err, results) => {
                if (err) reject(err);
                resolve(results[0]);
            });
        });
    }

    static async getAllUsers() {
        const sql = `SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC`;
        return new Promise((resolve, reject) => {
            db.execute(sql, (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
    }

    static comparePassword(password, hashedPassword) {
        return bcrypt.compare(password, hashedPassword);
    }

    static async delete(id) {
        const sql = `DELETE FROM users WHERE id = ?`;
        return new Promise((resolve, reject) => {
            db.execute(sql, [id], (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
    }
}

module.exports = User;