#!/bin/sh
set -e

echo "Checking database initialization state..."

# Returns the product count, or "missing" if the table doesn't exist yet.
# The connection is always closed (in both try and catch) so the Node process
# never hangs due to an open socket keeping the event loop alive.
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
    console.log('missing');
  }
})();
")

if [ "$PRODUCT_COUNT" = "missing" ]; then
  echo "Schema not found — creating tables and seeding data..."
  node src/scripts/createTables.js
  node src/scripts/seedData.js
  echo "Database initialised and seeded."
elif [ "$PRODUCT_COUNT" = "0" ]; then
  echo "Tables exist but no products — seeding data..."
  node src/scripts/seedData.js
  echo "Database seeded."
else
  echo "Database already has $PRODUCT_COUNT products — skipping seed."
fi

exec node src/server.js
