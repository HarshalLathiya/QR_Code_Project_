const db = require('../config/db');
const bcrypt = require('bcrypt');

class User {
    static async create(name, email, password, role = 'user') {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.execute(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, role]
        );
        return result.insertId;
    }

    static async findByEmail(email) {
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    }

    static async findById(id) {
        const [rows] = await db.execute('SELECT id, name, email, role FROM users WHERE id = ?', [id]);
        return rows[0];
    }

    static async updateProfile(id, name, email) {
        await db.execute('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id]);
    }

    static async getAllUsers() {
        const [rows] = await db.execute('SELECT id, name, email, role FROM users');
        return rows;
    }

    static async deleteUser(id) {
        await db.execute('DELETE FROM users WHERE id = ?', [id]);
    }

    static async verifyPassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }
}

module.exports = User;
