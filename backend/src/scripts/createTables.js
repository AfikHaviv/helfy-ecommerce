const mysql = require('mysql2/promise');
require('dotenv').config();

const createTables = async () => {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'helfy_ecommerce',
      port: process.env.DB_PORT || 3306,
      multipleStatements: true
    });

    console.log('Connected to database');

    // Drop existing tables in reverse order of dependencies
    console.log('Dropping existing tables...');
    await connection.query(`
      DROP TABLE IF EXISTS product_reviews;
      DROP TABLE IF EXISTS order_shipping_addresses;
      DROP TABLE IF EXISTS order_items;
      DROP TABLE IF EXISTS orders;
      DROP TABLE IF EXISTS cart_items;
      DROP TABLE IF EXISTS carts;
      DROP TABLE IF EXISTS product_images;
      DROP TABLE IF EXISTS product_categories;
      DROP TABLE IF EXISTS products;
      DROP TABLE IF EXISTS categories;
      DROP TABLE IF EXISTS user_addresses;
      DROP TABLE IF EXISTS users;
    `);

    console.log('Creating tables...');

    // Create users table
    await connection.query(`
      CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        role ENUM('customer', 'admin') DEFAULT 'customer',
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_role (role)
      ) ENGINE=InnoDB;
    `);
    console.log('✓ Created users table');

    // Create user_addresses table
    await connection.query(`
      CREATE TABLE user_addresses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        address_type ENUM('shipping', 'billing', 'both') DEFAULT 'shipping',
        is_default BOOLEAN DEFAULT FALSE,
        full_name VARCHAR(200) NOT NULL,
        address_line1 VARCHAR(255) NOT NULL,
        address_line2 VARCHAR(255),
        city VARCHAR(100) NOT NULL,
        state VARCHAR(100) NOT NULL,
        postal_code VARCHAR(20) NOT NULL,
        country VARCHAR(100) NOT NULL DEFAULT 'USA',
        phone VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
        INDEX idx_user_id (user_id)
      ) ENGINE=InnoDB;
    `);
    console.log('✓ Created user_addresses table');

    // Create categories table
    await connection.query(`
      CREATE TABLE categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        slug VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        parent_id INT NULL,
        image_url VARCHAR(500),
        is_active BOOLEAN DEFAULT TRUE,
        display_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL ON UPDATE CASCADE,
        INDEX idx_slug (slug),
        INDEX idx_parent_id (parent_id)
      ) ENGINE=InnoDB;
    `);
    console.log('✓ Created categories table');

    // Create products table
    await connection.query(`
      CREATE TABLE products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        description TEXT NOT NULL,
        short_description VARCHAR(500),
        price DECIMAL(10,2) NOT NULL,
        compare_at_price DECIMAL(10,2),
        cost_price DECIMAL(10,2),
        sku VARCHAR(100) UNIQUE,
        barcode VARCHAR(100),
        stock_quantity INT NOT NULL DEFAULT 0,
        low_stock_threshold INT DEFAULT 10,
        weight DECIMAL(8,2),
        dimensions VARCHAR(100),
        is_active BOOLEAN DEFAULT TRUE,
        is_featured BOOLEAN DEFAULT FALSE,
        rating_average DECIMAL(3,2) DEFAULT 0.00,
        rating_count INT DEFAULT 0,
        view_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_slug (slug),
        INDEX idx_sku (sku),
        INDEX idx_is_active (is_active),
        INDEX idx_price (price)
      ) ENGINE=InnoDB;
    `);
    console.log('✓ Created products table');

    // Create product_categories table
    await connection.query(`
      CREATE TABLE product_categories (
        product_id INT NOT NULL,
        category_id INT NOT NULL,
        PRIMARY KEY (product_id, category_id),
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB;
    `);
    console.log('✓ Created product_categories table');

    // Create product_images table
    await connection.query(`
      CREATE TABLE product_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        image_url VARCHAR(500) NOT NULL,
        alt_text VARCHAR(255),
        is_primary BOOLEAN DEFAULT FALSE,
        display_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE,
        INDEX idx_product_id (product_id)
      ) ENGINE=InnoDB;
    `);
    console.log('✓ Created product_images table');

    // Create carts table
    await connection.query(`
      CREATE TABLE carts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NULL,
        session_id VARCHAR(255) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_session_id (session_id),
        UNIQUE KEY unique_user_cart (user_id),
        UNIQUE KEY unique_session_cart (session_id)
      ) ENGINE=InnoDB;
    `);
    console.log('✓ Created carts table');

    // Create cart_items table
    await connection.query(`
      CREATE TABLE cart_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        cart_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        price_at_addition DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE,
        UNIQUE KEY unique_cart_product (cart_id, product_id)
      ) ENGINE=InnoDB;
    `);
    console.log('✓ Created cart_items table');

    // Create orders table
    await connection.query(`
      CREATE TABLE orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        order_number VARCHAR(50) NOT NULL UNIQUE,
        status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded') DEFAULT 'pending',
        payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
        payment_method VARCHAR(50),
        subtotal DECIMAL(10,2) NOT NULL,
        tax_amount DECIMAL(10,2) DEFAULT 0.00,
        shipping_amount DECIMAL(10,2) DEFAULT 0.00,
        discount_amount DECIMAL(10,2) DEFAULT 0.00,
        total_amount DECIMAL(10,2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'USD',
        notes TEXT,
        shipped_at TIMESTAMP NULL,
        delivered_at TIMESTAMP NULL,
        cancelled_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_order_number (order_number),
        INDEX idx_status (status)
      ) ENGINE=InnoDB;
    `);
    console.log('✓ Created orders table');

    // Create order_items table
    await connection.query(`
      CREATE TABLE order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        product_id INT NOT NULL,
        product_name VARCHAR(255) NOT NULL,
        product_sku VARCHAR(100),
        quantity INT NOT NULL,
        unit_price DECIMAL(10,2) NOT NULL,
        total_price DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT ON UPDATE CASCADE,
        INDEX idx_order_id (order_id)
      ) ENGINE=InnoDB;
    `);
    console.log('✓ Created order_items table');

    // Create order_shipping_addresses table
    await connection.query(`
      CREATE TABLE order_shipping_addresses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL UNIQUE,
        full_name VARCHAR(200) NOT NULL,
        address_line1 VARCHAR(255) NOT NULL,
        address_line2 VARCHAR(255),
        city VARCHAR(100) NOT NULL,
        state VARCHAR(100) NOT NULL,
        postal_code VARCHAR(20) NOT NULL,
        country VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB;
    `);
    console.log('✓ Created order_shipping_addresses table');

    // Create product_reviews table
    await connection.query(`
      CREATE TABLE product_reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        user_id INT NOT NULL,
        order_id INT NULL,
        rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        title VARCHAR(200),
        comment TEXT,
        is_verified_purchase BOOLEAN DEFAULT FALSE,
        is_approved BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL ON UPDATE CASCADE,
        INDEX idx_product_id (product_id)
      ) ENGINE=InnoDB;
    `);
    console.log('✓ Created product_reviews table');

    console.log('\n✓ All 13 tables created successfully!');

    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('✗ Error creating tables:', error.message);
    if (connection) {
      await connection.end();
    }
    process.exit(1);
  }
};

createTables();
