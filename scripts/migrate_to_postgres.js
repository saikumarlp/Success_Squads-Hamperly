process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 1. Ensure dependencies are installed
try {
  require.resolve('dotenv');
} catch (e) {
  console.log('Installing dotenv package locally...');
  execSync('npm install dotenv', { stdio: 'inherit', cwd: path.resolve(__dirname, '..') });
}

try {
  require.resolve('mysql2');
} catch (e) {
  console.log('Installing mysql2 package locally...');
  execSync('npm install mysql2', { stdio: 'inherit', cwd: path.resolve(__dirname, '..') });
}

try {
  require.resolve('pg');
} catch (e) {
  console.log('Installing pg (PostgreSQL) package locally...');
  execSync('npm install pg', { stdio: 'inherit', cwd: path.resolve(__dirname, '..') });
}

const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../backend/.env') });

const mysql = require('mysql2/promise');
const { Client } = require('pg');

let postgresUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
if (!postgresUrl && process.env.DB_URL) {
  postgresUrl = process.env.DB_URL.replace('jdbc:postgresql://', 'postgres://');
}

if (!postgresUrl) {
  console.error('Error: PostgreSQL database URL is missing in the environment or backend/.env configuration!');
  console.error('Please define DB_URL in backend/.env or run with POSTGRES_URL.');
  process.exit(1);
}

const mysqlHost = process.env.MYSQL_HOST || '127.0.0.1';
const mysqlPort = parseInt(process.env.MYSQL_PORT || '3306', 10);
const mysqlUser = process.env.MYSQL_USER || 'root';
const mysqlPassword = process.env.MYSQL_PASSWORD;
const mysqlDatabase = process.env.MYSQL_DATABASE || 'e_commerce';

if (mysqlPassword === undefined) {
  console.error('Error: MYSQL_PASSWORD environment variable is missing!');
  console.error('Please specify the MySQL password using the MYSQL_PASSWORD environment variable:');
  console.error('  Windows PowerShell: $env:MYSQL_PASSWORD="your_password"; node scripts/migrate_to_postgres.js');
  console.error('  Bash/Linux: MYSQL_PASSWORD="your_password" node scripts/migrate_to_postgres.js');
  process.exit(1);
}

async function migrate() {
  console.log('Connecting to local MySQL...');
  const mysqlConn = await mysql.createConnection({
    host: mysqlHost,
    port: mysqlPort,
    user: mysqlUser,
    password: mysqlPassword,
    database: mysqlDatabase
  });
  console.log('MySQL Connected successfully.');

  console.log('Connecting to PostgreSQL...');
  const pgClient = new Client({
    connectionString: postgresUrl,
    ssl: {
      rejectUnauthorized: false
    }
  });
  await pgClient.connect();
  console.log('PostgreSQL Connected successfully.');

  // DDL Statements for PostgreSQL
  const ddlStatements = [
    // Drop tables if they exist in reverse order of foreign keys
    `DROP TABLE IF EXISTS review_images CASCADE;`,
    `DROP TABLE IF EXISTS reviews CASCADE;`,
    `DROP TABLE IF EXISTS wishlists CASCADE;`,
    `DROP TABLE IF EXISTS cart_items CASCADE;`,
    `DROP TABLE IF EXISTS productimages CASCADE;`,
    `DROP TABLE IF EXISTS products CASCADE;`,
    `DROP TABLE IF EXISTS categories CASCADE;`,
    `DROP TABLE IF EXISTS jwt_tokens CASCADE;`,
    `DROP TABLE IF EXISTS password_reset_tokens CASCADE;`,
    `DROP TABLE IF EXISTS invoices CASCADE;`,
    `DROP TABLE IF EXISTS order_items CASCADE;`,
    `DROP TABLE IF EXISTS orders CASCADE;`,
    `DROP TABLE IF EXISTS notifications CASCADE;`,
    `DROP TABLE IF EXISTS users CASCADE;`,

    // Create tables
    `CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        mobile_number VARCHAR(10) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'CUSTOMER',
        blocked BOOLEAN DEFAULT FALSE,
        profile_picture_url VARCHAR(500) DEFAULT NULL,
        date_of_birth DATE DEFAULT NULL,
        gender VARCHAR(20) DEFAULT NULL,
        bio VARCHAR(500) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,

    `CREATE TABLE jwt_tokens (
        token_id SERIAL PRIMARY KEY,
        user_id INT NOT NULL,
        token VARCHAR(2555) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );`,

    `CREATE TABLE password_reset_tokens (
        id SERIAL PRIMARY KEY,
        token_hash VARCHAR(255) NOT NULL UNIQUE,
        user_id INT NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        used BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );`,

    `CREATE TABLE categories (
        category_id SERIAL PRIMARY KEY,
        category_name VARCHAR(255) NOT NULL UNIQUE
    );`,

    `CREATE TABLE products (
        product_id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        stock INT NOT NULL,
        category_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
    );`,

    `CREATE TABLE productimages (
        image_id SERIAL PRIMARY KEY,
        product_id INT NOT NULL,
        image_url TEXT NOT NULL,
        FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
    );`,

    `CREATE TABLE cart_items (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
    );`,

    `CREATE TABLE wishlists (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
        CONSTRAINT unique_user_product UNIQUE (user_id, product_id)
    );`,

    `CREATE TABLE orders (
        order_id VARCHAR(255) PRIMARY KEY,
        user_id INT NOT NULL,
        total_amount DECIMAL(10,2) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
        item_total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        discount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        coupon_discount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        shipping_charge DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        tax DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        grand_total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        shipping_address VARCHAR(500) NULL,
        city VARCHAR(100) NULL,
        state VARCHAR(100) NULL,
        country VARCHAR(100) NULL,
        postal_code VARCHAR(20) NULL,
        payment_id VARCHAR(255) NULL,
        payment_method VARCHAR(100) NULL,
        payment_status VARCHAR(50) NULL DEFAULT 'PENDING',
        estimated_delivery TIMESTAMP NULL,
        order_date TIMESTAMP NULL,
        expected_delivery_date TIMESTAMP NULL,
        tracking_number VARCHAR(255) NULL,
        confirmed_at TIMESTAMP NULL,
        packed_at TIMESTAMP NULL,
        shipped_at TIMESTAMP NULL,
        out_for_delivery_at TIMESTAMP NULL,
        delivered_at TIMESTAMP NULL,
        cancelled_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );`,

    `CREATE TABLE reviews (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        order_id VARCHAR(255) NOT NULL,
        rating INT NOT NULL,
        title VARCHAR(255),
        comment TEXT NOT NULL,
        verified_purchase BOOLEAN DEFAULT TRUE,
        is_hidden BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
        FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
        CONSTRAINT unique_user_product_review UNIQUE (user_id, product_id)
    );`,

    `CREATE TABLE review_images (
        id SERIAL PRIMARY KEY,
        review_id INT NOT NULL,
        image_url TEXT NOT NULL,
        FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE
    );`,

    `CREATE TABLE order_items (
        id SERIAL PRIMARY KEY,
        order_id VARCHAR(255) NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL,
        price_per_unit DECIMAL(10,2) NOT NULL,
        total_price DECIMAL(10,2) NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
    );`,

    `CREATE TABLE invoices (
        invoice_id SERIAL PRIMARY KEY,
        order_id VARCHAR(255) NOT NULL,
        invoice_number VARCHAR(255) NOT NULL UNIQUE,
        pdf_path VARCHAR(255) NOT NULL,
        generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
    );`,

    `CREATE TABLE notifications (
        notification_id SERIAL PRIMARY KEY,
        user_id INT NOT NULL,
        message VARCHAR(500) NOT NULL,
        is_read BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );`
  ];

  console.log('Recreating tables in PostgreSQL...');
  for (const sql of ddlStatements) {
    await pgClient.query(sql);
  }
  console.log('PostgreSQL schema initialized.');

  // Migration tables sequence in order of dependency resolution
  const tableConfigs = [
    {
      mysqlTable: 'users',
      pgTable: 'users',
      serialCol: 'id',
      boolCols: ['blocked']
    },
    {
      mysqlTable: 'categories',
      pgTable: 'categories',
      serialCol: 'category_id',
      boolCols: []
    },
    {
      mysqlTable: 'products',
      pgTable: 'products',
      serialCol: 'product_id',
      boolCols: []
    },
    {
      mysqlTable: 'productimages',
      pgTable: 'productimages',
      serialCol: 'image_id',
      boolCols: []
    },
    {
      mysqlTable: 'orders',
      pgTable: 'orders',
      serialCol: null, // order_id is VARCHAR primary key
      boolCols: []
    },
    {
      mysqlTable: 'cart_items',
      pgTable: 'cart_items',
      serialCol: 'id',
      boolCols: []
    },
    {
      mysqlTable: 'wishlists',
      pgTable: 'wishlists',
      serialCol: 'id',
      boolCols: []
    },
    {
      mysqlTable: 'reviews',
      pgTable: 'reviews',
      serialCol: 'id',
      boolCols: ['verified_purchase', 'is_hidden']
    },
    {
      mysqlTable: 'review_images',
      pgTable: 'review_images',
      serialCol: 'id',
      boolCols: []
    },
    {
      mysqlTable: 'order_items',
      pgTable: 'order_items',
      serialCol: 'id',
      boolCols: []
    },
    {
      mysqlTable: 'invoices',
      pgTable: 'invoices',
      serialCol: 'invoice_id',
      boolCols: []
    },
    {
      mysqlTable: 'notifications',
      pgTable: 'notifications',
      serialCol: 'notification_id',
      boolCols: ['is_read']
    },
    {
      mysqlTable: 'jwt_tokens',
      pgTable: 'jwt_tokens',
      serialCol: 'token_id',
      boolCols: []
    },
    {
      mysqlTable: 'password_reset_tokens',
      pgTable: 'password_reset_tokens',
      serialCol: 'id',
      boolCols: ['used']
    }
  ];

  for (const config of tableConfigs) {
    console.log(`Migrating table ${config.mysqlTable} -> ${config.pgTable}...`);
    // Read from MySQL
    const [rows] = await mysqlConn.query(`SELECT * FROM \`${config.mysqlTable}\``);
    console.log(`Found ${rows.length} rows in MySQL table ${config.mysqlTable}.`);

    if (rows.length > 0) {
      // Get all columns from first row
      const columns = Object.keys(rows[0]);
      
      // Build batch INSERT query
      const columnsCsv = columns.map(c => `"${c}"`).join(', ');
      
      for (const row of rows) {
        const values = [];
        const placeholders = [];
        
        columns.forEach((col, idx) => {
          let val = row[col];
          
          // Map tinyint values to boolean if it's a boolean column
          if (config.boolCols.includes(col)) {
            val = val === 1 || val === true || val === '1';
          }
          
          values.push(val);
          placeholders.push(`$${idx + 1}`);
        });

        const insertQuery = `INSERT INTO "${config.pgTable}" (${columnsCsv}) VALUES (${placeholders.join(', ')})`;
        await pgClient.query(insertQuery, values);
      }
      console.log(`Successfully migrated ${rows.length} rows to ${config.pgTable}.`);
    }

    // Reset SERIAL sequence if applicable
    if (config.serialCol && rows.length > 0) {
      const seqResetQuery = `SELECT setval(pg_get_serial_sequence('${config.pgTable}', '${config.serialCol}'), COALESCE(MAX("${config.serialCol}"), 1)) FROM "${config.pgTable}";`;
      await pgClient.query(seqResetQuery);
      console.log(`Reset sequence for ${config.pgTable}.${config.serialCol}.`);
    }
  }

  console.log('\n======================================================');
  console.log('  Database Migration and Seeding: COMPLETED SUCCESS!');
  console.log('======================================================\n');

  await mysqlConn.end();
  await pgClient.end();
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
