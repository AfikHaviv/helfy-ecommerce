#!/bin/sh
set -e

echo "Checking database initialization state..."

# Check the products table so that a partial seed (users inserted, products failed)
# is detected correctly and seeding is retried on restart.
# The connection is always closed (try and catch) to avoid the Node process hanging.
PRODUCT_COUNT=$(node -e "
const mysql = require('mysql2/promise');
(async () => {
  let conn;
  try {
    conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });
    const [rows] = await conn.execute('SELECT COUNT(*) AS cnt FROM products');
    console.log(rows[0].cnt);
    await conn.end();
  } catch (e) {
    if (conn) await conn.end().catch(() => {});
    console.log('0');
  }
})();
")

if [ "$PRODUCT_COUNT" = "0" ]; then
  echo "No products found — running seed..."
  node src/scripts/seedData.js
  echo "Database seeded."
else
  echo "Database already seeded ($PRODUCT_COUNT products) — skipping."
fi

exec node src/server.js
