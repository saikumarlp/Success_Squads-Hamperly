const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 1. Check and install mysql2 dependency if missing
try {
  require.resolve('mysql2');
} catch (e) {
  console.log('Installing mysql2 package locally...');
  execSync('npm install mysql2', { stdio: 'inherit', cwd: __dirname });
}

const mysql = require('mysql2/promise');

async function resetDatabase() {
  const schemaPath = path.join(__dirname, 'schema.sql');
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
    // Connect to MySQL (without selecting a DB first, in case it does not exist)
    connection = await mysql.createConnection({
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password: 'sai1234',
      multipleStatements: true
    });

    console.log('Connected to MySQL server on port 3306.');

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      // Append semicolon back to statement since split removed it
      const sqlToRun = statement + ';';
      
      // Log short preview of the query
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
