const mysql = require('mysql2/promise');

async function probe() {
  try {
    const connection = await mysql.createConnection({
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password: 'sai1234',
      database: 'e_commerce'
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
