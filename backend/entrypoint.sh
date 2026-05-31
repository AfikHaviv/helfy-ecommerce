#!/bin/sh
set -e

echo "Checking database initialization state..."

USER_COUNT=$(node -e "
const mysql = require('mysql2/promise');
(async () => {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });
    const [rows] = await conn.execute('SELECT COUNT(*) AS cnt FROM users');
    console.log(rows[0].cnt);
    await conn.end();
  } catch (e) {
    console.log('0');
  }
})();
")

if [ "$USER_COUNT" = "0" ]; then
  echo "Empty database — running table migrations and seed data..."
  node src/scripts/createTables.js
  node src/scripts/seedData.js
  echo "Database ready."
else
  echo "Database already contains data — skipping initialization."
fi

exec node src/server.js
