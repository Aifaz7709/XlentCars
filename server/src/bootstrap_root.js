const mysql = require('mysql2/promise');

async function run() {
  const host = '127.0.0.1';
  const rootUser = 'root';
  const rootPass = 'Root@123';
  const dbName = 'xlentcar';
  const appUser = 'Xlent';
  const appPass = 'XlentServer';

  try {
    console.log('Connecting as root...');
    const conn = await mysql.createConnection({ host, user: rootUser, password: rootPass });
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    console.log(`Database ${dbName} ensured.`);

    // Create user and grant privileges
    await conn.query(`CREATE USER IF NOT EXISTS '${appUser}'@'localhost' IDENTIFIED BY ?`, [appPass]);
    await conn.query(`GRANT ALL PRIVILEGES ON \`${dbName}\`.* TO '${appUser}'@'localhost'`);
    await conn.query('FLUSH PRIVILEGES');
    console.log(`User ${appUser} created/granted.`);

    await conn.end();
    console.log('Done.');
  } catch (err) {
    console.error('Bootstrap error:', err.message || err);
    process.exit(1);
  }
}

run();
