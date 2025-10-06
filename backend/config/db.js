const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'qruser',
    password: process.env.DB_PASSWORD || 'qrpassword',
    database: process.env.DB_NAME || 'qr_code_generator',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool.promise();
