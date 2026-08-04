const fs = require('fs');
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
// Look for .env in backend/ or root folder
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

// 1. Check and install mysql2 dependency if missing
try {
  require.resolve('mysql2');
} catch (e) {
  console.log('Installing mysql2 package locally...');
  execSync('npm install mysql2', { stdio: 'inherit', cwd: path.resolve(__dirname, '..') });
}

const mysql = require('mysql2/promise');

async function resetDatabase() {
  const schemaPath = path.resolve(__dirname, '../schema.sql');
  if (!fs.existsSync(schemaPath)) {
    console.error(`schema.sql not found at ${schemaPath}`);
    process.exit(1);
  }

  console.log('Reading schema.sql...');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');

  // Clean comments (lines starting with -- or #) before splitting by semicolon
  const cleanSql = schemaSql
    .split('\n')
    .filter(line => !line.trim().startsWith('--') && !line.trim().startsWith('#'))
    .join('\n');

  // Split SQL file by statement delimiter (semicolon)
  const statements = cleanSql
    .split(';')
    .map(stmt => stmt.trim())
    .filter(stmt => stmt.length > 0);

  console.log(`Found ${statements.length} SQL statements to execute.`);

  let connection;
  try {
    // Connect to MySQL
    connection = await mysql.createConnection({
      host: dbHost,
      port: dbPort,
      user: dbUser,
      password: dbPassword,
      multipleStatements: true
    });

    console.log(`Connected to MySQL server on ${dbHost}:${dbPort}.`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      const sqlToRun = statement + ';';
      
      const preview = statement.split('\n')[0].substring(0, 80);
      console.log(`[${i + 1}/${statements.length}] Executing: ${preview}...`);
      
      await connection.query(sqlToRun);
    }

    console.log('\n=========================================');
    console.log('  Database and tables reset successfully!');
    console.log('=========================================\n');

  } catch (error) {
    console.error('Error executing database reset:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

resetDatabase();
