const mysql = require('mysql2/promise');

async function checkDatabase() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: '127.0.0.1',
      port: 3309,
      user: 'root',
      password: 'Anusha@1234',
      database: 'luxury_gift_hampers'
    });

    console.log('\n=========================================');
    console.log('  MySQL Database Connection: SUCCESSFUL  ');
    console.log('=========================================\n');

    // 1. Show Tables
    const [tables] = await connection.query('SHOW TABLES;');
    console.log('--- TABLES IN DATABASE ---');
    console.table(tables);

    // 2. Show Users
    console.log('\n--- DATA IN "users" TABLE ---');
    const [users] = await connection.query('SELECT id, full_name, email, role, created_at, updated_at FROM users;');
    console.table(users);

    // 3. Show JWT Tokens
    console.log('\n--- DATA IN "jwt_tokens" TABLE ---');
    const [tokens] = await connection.query('SELECT token_id, user_id, token, created_at, expires_at FROM jwt_tokens;');
    console.table(tokens);

    // 4. Show Categories
    console.log('\n--- DATA IN "categories" TABLE ---');
    const [categories] = await connection.query('SELECT category_id, category_name FROM categories;');
    console.table(categories);

    // 5. Show Products
    console.log('\n--- DATA IN "products" TABLE ---');
    const [products] = await connection.query('SELECT product_id, name, price, stock, category_id, created_at FROM products;');
    console.table(products);

    // 6. Show Product Images
    console.log('\n--- DATA IN "productimages" TABLE ---');
    const [images] = await connection.query('SELECT image_id, product_id, image_url FROM productimages;');
    console.table(images);

    // 7. Show Cart Items
    console.log('\n--- DATA IN "cart_items" TABLE ---');
    const [cart] = await connection.query('SELECT id, user_id, product_id, quantity FROM cart_items;');
    console.table(cart);

    // 8. Show Orders
    console.log('\n--- DATA IN "orders" TABLE ---');
    const [orders] = await connection.query('SELECT order_id, user_id, total_amount, status, created_at FROM orders;');
    console.table(orders);

    // 9. Show Order Items
    console.log('\n--- DATA IN "order_items" TABLE ---');
    const [orderItems] = await connection.query('SELECT id, order_id, product_id, quantity, price_per_unit, total_price FROM order_items;');
    console.table(orderItems);

  } catch (error) {
    console.error('Error querying database:', error.message);
    console.log('\nEnsure your MySQL server is running on port 3309.');
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

checkDatabase();
