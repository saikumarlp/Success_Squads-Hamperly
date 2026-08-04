const path = require('path');
const { execSync } = require('child_process');

// Load environment variables using dotenv
try {
  require.resolve('dotenv');
} catch (e) {
  console.log('Installing dotenv package locally...');
  execSync('npm install dotenv', { stdio: 'inherit', cwd: path.resolve(__dirname, '..') });
}

const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../backend/.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const dbPassword = process.env.DB_PASSWORD;
if (!dbPassword) {
  console.error('Error: DB_PASSWORD environment variable is missing in the configuration file!');
  process.exit(1);
}

const dbHost = process.env.DB_HOST || '127.0.0.1';
const dbPort = parseInt(process.env.DB_PORT || '3306', 10);
const dbUser = process.env.DB_USERNAME || 'root';
const dbName = process.env.DB_NAME || 'e_commerce';

// 1. Check and install mysql2 dependency if missing
try {
  require.resolve('mysql2');
} catch (e) {
  console.log('Installing mysql2 package locally...');
  execSync('npm install mysql2', { stdio: 'inherit', cwd: path.resolve(__dirname, '..') });
}

const mysql = require('mysql2/promise');

async function probe() {
  try {
    const connection = await mysql.createConnection({
      host: dbHost,
      port: dbPort,
      user: dbUser,
      password: dbPassword,
      database: dbName
    });
    console.log('Connected!');

    const [rows] = await connection.query('SELECT product_id, name FROM products WHERE category_id = 4;');
    console.table(rows);
    await connection.end();
  } catch (err) {
    console.error(err);
  }
}

probe();
