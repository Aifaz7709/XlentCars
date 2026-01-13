const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS || '';
const DB_NAME = process.env.DB_NAME || 'xlentcar';

async function run() {
  try {
    console.log('Connecting to MySQL server...');
    const withoutDb = await mysql.createConnection({ host: DB_HOST, user: DB_USER, password: DB_PASS });
    await withoutDb.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
    console.log(`Database \`${DB_NAME}\` ensured.`);
    await withoutDb.end();

    const withDb = await mysql.createConnection({ host: DB_HOST, user: DB_USER, password: DB_PASS, database: DB_NAME, multipleStatements: true });
    const sqlPath = path.join(__dirname, '..', 'migrations', 'create_users.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    await withDb.query(sql);
    console.log('Migrations applied.');
    await withDb.end();
  } catch (err) {
    console.error('Migration error:', err.message || err);
    process.exit(1);
  }
}

run();
