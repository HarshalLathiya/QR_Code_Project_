const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function insertAdmin() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: 3307,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    const hashedPassword = await bcrypt.hash('admin123', 10);

    await connection.execute(
        'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
        ['admin', 'admin@gmail.com', hashedPassword, 'admin']
    );

    console.log('Admin user inserted: email: admin@gmail.com, password: admin123');
    await connection.end();
}

insertAdmin().catch(console.error);
