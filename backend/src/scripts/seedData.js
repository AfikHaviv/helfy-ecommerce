const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();

const seedData = async () => {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'helfy_ecommerce',
      port: process.env.DB_PORT || 3306
    });

    console.log('Connected to database');

    // Hash password for all users
    const hashedPassword = await bcrypt.hash('Password123!', 10);

    // 1. Insert Users (2 admins + 10 customers)
    console.log('Seeding users...');
    const users = [
      ['admin@helfy.com', hashedPassword, 'Admin', 'User', '555-0001', 'admin'],
      ['superadmin@helfy.com', hashedPassword, 'Super', 'Admin', '555-0002', 'admin'],
      ['john.doe@email.com', hashedPassword, 'John', 'Doe', '555-0101', 'customer'],
      ['jane.smith@email.com', hashedPassword, 'Jane', 'Smith', '555-0102', 'customer'],
      ['mike.johnson@email.com', hashedPassword, 'Mike', 'Johnson', '555-0103', 'customer'],
      ['sarah.williams@email.com', hashedPassword, 'Sarah', 'Williams', '555-0104', 'customer'],
      ['david.brown@email.com', hashedPassword, 'David', 'Brown', '555-0105', 'customer'],
      ['emily.davis@email.com', hashedPassword, 'Emily', 'Davis', '555-0106', 'customer'],
      ['chris.miller@email.com', hashedPassword, 'Chris', 'Miller', '555-0107', 'customer'],
      ['lisa.wilson@email.com', hashedPassword, 'Lisa', 'Wilson', '555-0108', 'customer'],
      ['robert.moore@email.com', hashedPassword, 'Robert', 'Moore', '555-0109', 'customer'],
      ['amanda.taylor@email.com', hashedPassword, 'Amanda', 'Taylor', '555-0110', 'customer']
    ];

    for (const user of users) {
      await connection.query(
        'INSERT INTO users (email, password_hash, first_name, last_name, phone, role) VALUES (?, ?, ?, ?, ?, ?)',
        user
      );
    }
    console.log('✓ Seeded 12 users (2 admins, 10 customers)');

    // 2. Insert User Addresses (5 addresses)
    console.log('Seeding user addresses...');
    const addresses = [
      [3, 'shipping', true, 'John Doe', '123 Main St', 'Apt 4B', 'New York', 'NY', '10001', 'USA', '555-0101'],
      [4, 'both', true, 'Jane Smith', '456 Oak Ave', '', 'Los Angeles', 'CA', '90001', 'USA', '555-0102'],
      [5, 'shipping', true, 'Mike Johnson', '789 Pine Rd', 'Suite 200', 'Chicago', 'IL', '60601', 'USA', '555-0103'],
      [6, 'billing', false, 'Sarah Williams', '321 Elm St', '', 'Houston', 'TX', '77001', 'USA', '555-0104'],
      [7, 'shipping', true, 'David Brown', '654 Maple Dr', 'Unit 5', 'Phoenix', 'AZ', '85001', 'USA', '555-0105']
    ];

    for (const address of addresses) {
      await connection.query(
        'INSERT INTO user_addresses (user_id, address_type, is_default, full_name, address_line1, address_line2, city, state, postal_code, country, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        address
      );
    }
    console.log('✓ Seeded 5 user addresses');

    // 3. Insert Categories (15 categories with hierarchy)
    console.log('Seeding categories...');
    const categories = [
      ['Electronics', 'electronics', 'Electronic devices and accessories', null, 'https://images.unsplash.com/photo-1498049794561-7780e7231661', 1],
      ['Computers', 'computers', 'Laptops, desktops, and accessories', 1, 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c', 1],
      ['Smartphones', 'smartphones', 'Mobile phones and accessories', 1, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9', 2],
      ['Audio', 'audio', 'Headphones, speakers, and audio equipment', 1, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e', 3],
      ['Clothing', 'clothing', 'Fashion and apparel', null, 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f', 2],
      ['Men\'s Clothing', 'mens-clothing', 'Clothing for men', 5, 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59', 1],
      ['Women\'s Clothing', 'womens-clothing', 'Clothing for women', 5, 'https://images.unsplash.com/photo-1483985988355-763728e1935b', 2],
      ['Home & Garden', 'home-garden', 'Home improvement and garden supplies', null, 'https://images.unsplash.com/photo-1484101403633-562f891dc89a', 3],
      ['Furniture', 'furniture', 'Indoor and outdoor furniture', 8, 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc', 1],
      ['Kitchen', 'kitchen', 'Kitchen appliances and tools', 8, 'https://images.unsplash.com/photo-1556911220-bff31c812dba', 2],
      ['Sports & Outdoors', 'sports-outdoors', 'Sports equipment and outdoor gear', null, 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211', 4],
      ['Fitness', 'fitness', 'Fitness equipment and accessories', 11, 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438', 1],
      ['Books', 'books', 'Books and reading materials', null, 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d', 5],
      ['Toys & Games', 'toys-games', 'Toys and games for all ages', null, 'https://images.unsplash.com/photo-1558060370-d644479cb6f7', 6],
      ['Beauty & Personal Care', 'beauty-personal-care', 'Beauty products and personal care items', null, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348', 7]
    ];

    for (const category of categories) {
      await connection.query(
        'INSERT INTO categories (name, slug, description, parent_id, image_url, display_order) VALUES (?, ?, ?, ?, ?, ?)',
        category
      );
    }
    console.log('✓ Seeded 15 categories');

    // 4. Insert Products (50 products)
    console.log('Seeding products...');
    const products = [
      // Electronics - Computers
      ['MacBook Pro 16"', 'macbook-pro-16', 'Powerful laptop with M2 Pro chip, 16GB RAM, 512GB SSD', 'High-performance laptop for professionals', 2499.99, 2799.99, 1800.00, 'MBP-16-001', '123456789001', 25, 5, 4.5, '16 x 11 x 0.66 inches', true, true, 4.8, 156],
      ['Dell XPS 15', 'dell-xps-15', 'Premium laptop with Intel i7, 16GB RAM, 1TB SSD', 'Sleek and powerful Windows laptop', 1899.99, 2199.99, 1400.00, 'DELL-XPS-15', '123456789002', 18, 5, 4.2, '13.6 x 9.1 x 0.7 inches', true, true, 4.6, 203],
      ['HP Pavilion Desktop', 'hp-pavilion-desktop', 'Desktop computer with AMD Ryzen 5, 12GB RAM, 512GB SSD', 'Reliable desktop for home and office', 799.99, 999.99, 550.00, 'HP-PAV-DT', '123456789003', 30, 5, 15.0, '13 x 6 x 14 inches', true, false, 4.3, 89],
      ['Logitech MX Master 3', 'logitech-mx-master-3', 'Advanced wireless mouse with ergonomic design', 'Premium mouse for productivity', 99.99, 129.99, 55.00, 'LOG-MX3', '123456789004', 150, 20, 0.3, '4.9 x 3.3 x 2 inches', true, false, 4.7, 1024],
      ['Mechanical Keyboard RGB', 'mechanical-keyboard-rgb', 'Gaming keyboard with Cherry MX switches and RGB lighting', 'Professional gaming keyboard', 149.99, 199.99, 80.00, 'KB-RGB-001', '123456789005', 75, 10, 2.5, '17.5 x 5.5 x 1.5 inches', true, false, 4.5, 567],
      
      // Electronics - Smartphones
      ['iPhone 14 Pro', 'iphone-14-pro', 'Latest iPhone with A16 chip, 128GB storage, Pro camera system', 'Premium smartphone from Apple', 999.99, 1099.99, 700.00, 'IPH-14P-128', '123456789006', 45, 5, 0.45, '5.81 x 2.81 x 0.31 inches', true, true, 4.9, 2341],
      ['Samsung Galaxy S23', 'samsung-galaxy-s23', 'Flagship Android phone with Snapdragon 8 Gen 2, 256GB', 'Powerful Android smartphone', 899.99, 999.99, 600.00, 'SAM-S23-256', '123456789007', 60, 5, 0.38, '5.76 x 2.79 x 0.3 inches', true, true, 4.7, 1876],
      ['Google Pixel 7', 'google-pixel-7', 'Google phone with Tensor G2 chip, 128GB, excellent camera', 'Pure Android experience', 599.99, 699.99, 400.00, 'GOO-PIX7-128', '123456789008', 40, 5, 0.43, '6.13 x 2.88 x 0.34 inches', true, false, 4.6, 934],
      ['Phone Case Premium', 'phone-case-premium', 'Protective case with military-grade drop protection', 'Universal phone protection', 29.99, 39.99, 8.00, 'CASE-PREM-001', '123456789009', 500, 50, 0.1, '6 x 3 x 0.5 inches', true, false, 4.4, 3421],
      ['Wireless Charger Fast', 'wireless-charger-fast', '15W fast wireless charging pad for all Qi devices', 'Quick wireless charging', 39.99, 49.99, 15.00, 'CHRG-WIRE-15', '123456789010', 200, 30, 0.25, '4 x 4 x 0.5 inches', true, false, 4.5, 876],
      
      // Electronics - Audio
      ['Sony WH-1000XM5', 'sony-wh-1000xm5', 'Premium noise-cancelling headphones with 30hr battery', 'Industry-leading noise cancellation', 399.99, 449.99, 220.00, 'SONY-XM5', '123456789011', 85, 10, 0.55, '7.3 x 3.0 x 9.9 inches', true, true, 4.8, 2156],
      ['AirPods Pro 2nd Gen', 'airpods-pro-2', 'Apple wireless earbuds with active noise cancellation', 'Premium wireless earbuds', 249.99, 279.99, 150.00, 'APP-PRO2', '123456789012', 120, 15, 0.12, '2.4 x 2.1 x 0.9 inches', true, true, 4.7, 3421],
      ['JBL Flip 6', 'jbl-flip-6', 'Portable Bluetooth speaker with powerful sound', 'Waterproof portable speaker', 129.99, 149.99, 65.00, 'JBL-FLIP6', '123456789013', 95, 15, 1.2, '7 x 2.8 x 2.8 inches', true, false, 4.6, 1234],
      ['Blue Yeti Microphone', 'blue-yeti-microphone', 'Professional USB microphone for streaming and recording', 'Studio-quality microphone', 129.99, 159.99, 70.00, 'BLUE-YETI', '123456789014', 65, 10, 1.2, '4.7 x 4.7 x 11.6 inches', true, false, 4.7, 987],
      
      // Clothing - Men's
      ['Men\'s Cotton T-Shirt', 'mens-cotton-tshirt', 'Comfortable 100% cotton t-shirt in various colors', 'Classic everyday t-shirt', 24.99, 34.99, 8.00, 'TSHIRT-M-001', '123456789015', 500, 50, 0.4, 'One Size', true, false, 4.3, 2341],
      ['Men\'s Denim Jeans', 'mens-denim-jeans', 'Classic fit denim jeans with stretch comfort', 'Durable and stylish jeans', 59.99, 79.99, 25.00, 'JEANS-M-001', '123456789016', 300, 30, 1.2, 'Various Sizes', true, false, 4.4, 1567],
      ['Men\'s Leather Jacket', 'mens-leather-jacket', 'Genuine leather jacket with premium finish', 'Timeless leather jacket', 299.99, 399.99, 150.00, 'JACKET-M-001', '123456789017', 45, 5, 3.5, 'Various Sizes', true, true, 4.6, 432],
      ['Men\'s Running Shoes', 'mens-running-shoes', 'Lightweight running shoes with cushioned sole', 'Performance running shoes', 89.99, 119.99, 40.00, 'SHOES-M-RUN', '123456789018', 200, 20, 1.8, 'Various Sizes', true, false, 4.5, 1876],
      
      // Clothing - Women's
      ['Women\'s Summer Dress', 'womens-summer-dress', 'Flowy summer dress in floral pattern', 'Elegant summer dress', 49.99, 69.99, 20.00, 'DRESS-W-001', '123456789019', 150, 15, 0.6, 'Various Sizes', true, false, 4.5, 876],
      ['Women\'s Yoga Pants', 'womens-yoga-pants', 'High-waist yoga pants with moisture-wicking fabric', 'Comfortable activewear', 39.99, 54.99, 15.00, 'YOGA-W-001', '123456789020', 250, 25, 0.5, 'Various Sizes', true, false, 4.6, 1234],
      ['Women\'s Handbag', 'womens-handbag', 'Stylish leather handbag with multiple compartments', 'Designer-inspired handbag', 79.99, 99.99, 35.00, 'BAG-W-001', '123456789021', 100, 10, 1.5, '12 x 10 x 5 inches', true, false, 4.4, 654],
      ['Women\'s Sneakers', 'womens-sneakers', 'Casual sneakers with memory foam insole', 'Comfortable everyday sneakers', 69.99, 89.99, 30.00, 'SNEAK-W-001', '123456789022', 180, 20, 1.5, 'Various Sizes', true, false, 4.5, 987],
      
      // Home & Garden - Furniture
      ['Modern Sofa 3-Seater', 'modern-sofa-3seater', 'Contemporary 3-seater sofa with premium fabric', 'Stylish living room sofa', 899.99, 1199.99, 500.00, 'SOFA-3S-001', '123456789023', 25, 3, 85.0, '84 x 36 x 33 inches', true, true, 4.7, 234],
      ['Office Desk Ergonomic', 'office-desk-ergonomic', 'Height-adjustable standing desk with spacious surface', 'Modern office desk', 399.99, 499.99, 200.00, 'DESK-ERG-001', '123456789024', 40, 5, 65.0, '60 x 30 x 29 inches', true, false, 4.6, 456],
      ['Dining Table Set', 'dining-table-set', 'Wooden dining table with 6 chairs', 'Complete dining set', 799.99, 999.99, 450.00, 'DINING-SET-6', '123456789025', 15, 2, 120.0, '72 x 36 x 30 inches', true, false, 4.5, 178],
      ['Bookshelf 5-Tier', 'bookshelf-5tier', 'Tall bookshelf with 5 shelves for storage', 'Versatile storage solution', 149.99, 199.99, 70.00, 'SHELF-5T-001', '123456789026', 60, 8, 45.0, '31.5 x 11.8 x 70.9 inches', true, false, 4.4, 567],
      
      // Home & Garden - Kitchen
      ['Stainless Steel Cookware Set', 'cookware-set-stainless', '10-piece stainless steel cookware set', 'Professional cookware set', 249.99, 349.99, 120.00, 'COOK-SS-10', '123456789027', 50, 5, 18.0, 'Various Sizes', true, false, 4.6, 432],
      ['Coffee Maker Automatic', 'coffee-maker-automatic', 'Programmable coffee maker with thermal carafe', 'Perfect morning coffee', 89.99, 119.99, 45.00, 'COFFEE-AUTO', '123456789028', 80, 10, 5.5, '8 x 9 x 13 inches', true, false, 4.5, 876],
      ['Blender High-Speed', 'blender-high-speed', 'Professional blender with 1500W motor', 'Powerful blending', 179.99, 229.99, 90.00, 'BLEND-HS-001', '123456789029', 70, 10, 8.0, '8 x 9 x 17 inches', true, false, 4.7, 654],
      ['Kitchen Knife Set', 'kitchen-knife-set', '15-piece professional knife set with block', 'Complete knife collection', 129.99, 179.99, 60.00, 'KNIFE-SET-15', '123456789030', 90, 12, 6.0, '9 x 4 x 14 inches', true, false, 4.6, 543],
      
      // Sports & Outdoors - Fitness
      ['Yoga Mat Premium', 'yoga-mat-premium', 'Extra thick yoga mat with carrying strap', 'Non-slip yoga mat', 39.99, 54.99, 15.00, 'YOGA-MAT-001', '123456789031', 200, 25, 2.5, '72 x 24 x 0.5 inches', true, false, 4.5, 1234],
      ['Dumbbell Set Adjustable', 'dumbbell-set-adjustable', 'Adjustable dumbbells 5-52.5 lbs per hand', 'Space-saving weights', 299.99, 399.99, 150.00, 'DUMB-ADJ-001', '123456789032', 35, 5, 52.5, '15.7 x 8.1 x 9 inches', true, true, 4.8, 876],
      ['Resistance Bands Set', 'resistance-bands-set', 'Set of 5 resistance bands with handles', 'Portable workout equipment', 29.99, 39.99, 10.00, 'RESIST-BAND', '123456789033', 300, 40, 1.0, '12 x 8 x 2 inches', true, false, 4.4, 1567],
      ['Treadmill Folding', 'treadmill-folding', 'Compact folding treadmill with LCD display', 'Home cardio equipment', 599.99, 799.99, 350.00, 'TREAD-FOLD', '123456789034', 20, 3, 110.0, '55 x 26 x 49 inches', true, false, 4.5, 234],
      
      // Sports & Outdoors
      ['Camping Tent 4-Person', 'camping-tent-4person', 'Waterproof tent for 4 people with easy setup', 'Family camping tent', 149.99, 199.99, 75.00, 'TENT-4P-001', '123456789035', 45, 5, 12.0, '20 x 8 x 8 inches', true, false, 4.6, 432],
      ['Hiking Backpack 50L', 'hiking-backpack-50l', 'Large capacity backpack with rain cover', 'Adventure backpack', 89.99, 119.99, 40.00, 'BACK-HIK-50', '123456789036', 75, 10, 3.5, '24 x 12 x 8 inches', true, false, 4.5, 654],
      ['Bicycle Mountain 27.5"', 'bicycle-mountain-275', 'Mountain bike with 21-speed and disc brakes', 'Off-road bicycle', 499.99, 699.99, 280.00, 'BIKE-MTN-275', '123456789037', 30, 3, 35.0, '68 x 42 x 12 inches', true, true, 4.7, 345],
      
      // Books
      ['The Great Novel', 'the-great-novel', 'Bestselling fiction novel by renowned author', 'Captivating story', 19.99, 24.99, 5.00, 'BOOK-001', '123456789038', 200, 20, 1.2, '8 x 5.5 x 1.5 inches', true, false, 4.6, 2341],
      ['Cookbook Healthy Meals', 'cookbook-healthy-meals', '100 recipes for nutritious and delicious meals', 'Healthy cooking guide', 29.99, 39.99, 10.00, 'BOOK-COOK-001', '123456789039', 150, 15, 2.0, '10 x 8 x 1 inches', true, false, 4.5, 876],
      ['Self-Help Success', 'self-help-success', 'Guide to personal development and success', 'Motivational book', 24.99, 29.99, 8.00, 'BOOK-SELF-001', '123456789040', 180, 20, 1.0, '8 x 5.5 x 1 inches', true, false, 4.4, 1234],
      
      // Toys & Games
      ['LEGO Building Set', 'lego-building-set', '1000-piece LEGO set for creative building', 'Educational toy', 79.99, 99.99, 35.00, 'TOY-LEGO-001', '123456789041', 100, 12, 3.0, '15 x 10 x 3 inches', true, false, 4.7, 1567],
      ['Board Game Strategy', 'board-game-strategy', 'Award-winning strategy board game for 2-4 players', 'Family game night', 49.99, 59.99, 20.00, 'GAME-STRAT-001', '123456789042', 120, 15, 2.5, '12 x 12 x 3 inches', true, false, 4.6, 987],
      ['Remote Control Car', 'remote-control-car', 'High-speed RC car with rechargeable battery', 'Fun outdoor toy', 69.99, 89.99, 30.00, 'TOY-RC-CAR', '123456789043', 85, 10, 2.0, '14 x 8 x 6 inches', true, false, 4.5, 654],
      ['Puzzle 1000 Pieces', 'puzzle-1000-pieces', 'Beautiful landscape puzzle with 1000 pieces', 'Relaxing activity', 24.99, 29.99, 8.00, 'PUZZLE-1000', '123456789044', 150, 20, 1.5, '14 x 10 x 2 inches', true, false, 4.4, 876],
      
      // Beauty & Personal Care
      ['Skincare Set Premium', 'skincare-set-premium', 'Complete skincare routine with cleanser, toner, and moisturizer', 'Radiant skin care', 89.99, 119.99, 40.00, 'SKIN-SET-001', '123456789045', 100, 12, 1.5, '8 x 6 x 4 inches', true, true, 4.7, 1234],
      ['Hair Dryer Professional', 'hair-dryer-professional', 'Ionic hair dryer with multiple heat settings', 'Salon-quality styling', 79.99, 99.99, 35.00, 'HAIR-DRY-PRO', '123456789046', 75, 10, 1.8, '10 x 4 x 9 inches', true, false, 4.6, 876],
      ['Electric Toothbrush', 'electric-toothbrush', 'Rechargeable toothbrush with 5 brushing modes', 'Superior oral care', 59.99, 79.99, 25.00, 'TOOTH-ELEC', '123456789047', 120, 15, 0.5, '9 x 3 x 3 inches', true, false, 4.5, 1567],
      ['Perfume Luxury', 'perfume-luxury', 'Premium fragrance with long-lasting scent', 'Elegant perfume', 129.99, 159.99, 60.00, 'PERF-LUX-001', '123456789048', 60, 8, 0.8, '5 x 3 x 6 inches', true, true, 4.8, 543],
      ['Makeup Brush Set', 'makeup-brush-set', 'Professional 12-piece makeup brush set', 'Complete brush collection', 49.99, 69.99, 20.00, 'MAKEUP-BRUSH', '123456789049', 140, 18, 0.8, '10 x 8 x 2 inches', true, false, 4.6, 987],
      ['Face Mask Sheet Pack', 'face-mask-sheet-pack', 'Pack of 20 hydrating sheet masks', 'Spa treatment at home', 34.99, 44.99, 12.00, 'MASK-SHEET-20', '123456789050', 200, 25, 0.6, '8 x 6 x 2 inches', true, false, 4.5, 1234]
    ];

    for (const product of products) {
      await connection.query(
        'INSERT INTO products (name, slug, description, short_description, price, compare_at_price, cost_price, sku, barcode, stock_quantity, low_stock_threshold, weight, dimensions, is_active, is_featured, rating_average, rating_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        product
      );
    }
    console.log('✓ Seeded 50 products');

    // 5. Link Products to Categories
    console.log('Linking products to categories...');
    const productCategories = [
      // Computers (category 2)
      [1, 2], [2, 2], [3, 2], [4, 2], [5, 2],
      // Smartphones (category 3)
      [6, 3], [7, 3], [8, 3], [9, 3], [10, 3],
      // Audio (category 4)
      [11, 4], [12, 4], [13, 4], [14, 4],
      // Men's Clothing (category 6)
      [15, 6], [16, 6], [17, 6], [18, 6],
      // Women's Clothing (category 7)
      [19, 7], [20, 7], [21, 7], [22, 7],
      // Furniture (category 9)
      [23, 9], [24, 9], [25, 9], [26, 9],
      // Kitchen (category 10)
      [27, 10], [28, 10], [29, 10], [30, 10],
      // Fitness (category 12)
      [31, 12], [32, 12], [33, 12], [34, 12],
      // Sports & Outdoors (category 11)
      [35, 11], [36, 11], [37, 11],
      // Books (category 13)
      [38, 13], [39, 13], [40, 13],
      // Toys & Games (category 14)
      [41, 14], [42, 14], [43, 14], [44, 14],
      // Beauty & Personal Care (category 15)
      [45, 15], [46, 15], [47, 15], [48, 15], [49, 15], [50, 15]
    ];

    for (const [productId, categoryId] of productCategories) {
      await connection.query(
        'INSERT INTO product_categories (product_id, category_id) VALUES (?, ?)',
        [productId, categoryId]
      );
    }
    console.log('✓ Linked products to categories');

    // 6. Insert Product Images (150+ images - 3 per product)
    console.log('Seeding product images...');
    for (let productId = 1; productId <= 50; productId++) {
      const images = [
        [productId, `https://images.unsplash.com/photo-${1500000000000 + productId}`, `Product ${productId} main image`, true, 1],
        [productId, `https://images.unsplash.com/photo-${1500000000000 + productId + 100}`, `Product ${productId} side view`, false, 2],
        [productId, `https://images.unsplash.com/photo-${1500000000000 + productId + 200}`, `Product ${productId} detail view`, false, 3]
      ];
      
      for (const image of images) {
        await connection.query(
          'INSERT INTO product_images (product_id, image_url, alt_text, is_primary, display_order) VALUES (?, ?, ?, ?, ?)',
          image
        );
      }
    }
    console.log('✓ Seeded 150 product images');

    // 7. Insert Carts (3 carts)
    console.log('Seeding carts...');
    const carts = [
      [3, null],
      [5, null],
      [null, 'session_abc123xyz']
    ];

    for (const cart of carts) {
      await connection.query(
        'INSERT INTO carts (user_id, session_id) VALUES (?, ?)',
        cart
      );
    }
    console.log('✓ Seeded 3 carts');

    // 8. Insert Cart Items
    console.log('Seeding cart items...');
    const cartItems = [
      [1, 1, 1, 2499.99],
      [1, 11, 1, 399.99],
      [2, 6, 2, 999.99],
      [2, 31, 1, 39.99],
      [3, 15, 3, 24.99]
    ];

    for (const item of cartItems) {
      await connection.query(
        'INSERT INTO cart_items (cart_id, product_id, quantity, price_at_addition) VALUES (?, ?, ?, ?)',
        item
      );
    }
    console.log('✓ Seeded cart items');

    // 9. Insert Orders (10 orders)
    console.log('Seeding orders...');
    const orders = [
      [3, 'ORD-2026-0001', 'delivered', 'paid', 'credit_card', 2899.98, 231.99, 15.00, 0.00, 3146.97, 'USD', null, '2026-05-20 10:00:00', '2026-05-23 14:30:00', null],
      [4, 'ORD-2026-0002', 'shipped', 'paid', 'paypal', 1999.98, 159.99, 20.00, 50.00, 2129.97, 'USD', 'Gift wrap requested', '2026-05-24 09:00:00', null, null],
      [5, 'ORD-2026-0003', 'processing', 'paid', 'credit_card', 549.97, 43.99, 10.00, 0.00, 603.96, 'USD', null, null, null, null],
      [6, 'ORD-2026-0004', 'delivered', 'paid', 'credit_card', 899.99, 71.99, 0.00, 0.00, 971.98, 'USD', null, '2026-05-18 11:00:00', '2026-05-21 16:00:00', null],
      [7, 'ORD-2026-0005', 'pending', 'pending', 'credit_card', 299.99, 23.99, 15.00, 0.00, 338.98, 'USD', null, null, null, null],
      [8, 'ORD-2026-0006', 'delivered', 'paid', 'paypal', 179.98, 14.39, 10.00, 0.00, 204.37, 'USD', null, '2026-05-19 13:00:00', '2026-05-22 10:00:00', null],
      [9, 'ORD-2026-0007', 'cancelled', 'refunded', 'credit_card', 499.99, 39.99, 15.00, 0.00, 554.98, 'USD', 'Customer requested cancellation', null, null, '2026-05-24 15:00:00'],
      [10, 'ORD-2026-0008', 'shipped', 'paid', 'credit_card', 1299.97, 103.99, 25.00, 100.00, 1328.96, 'USD', null, '2026-05-24 08:00:00', null, null],
      [11, 'ORD-2026-0009', 'delivered', 'paid', 'paypal', 89.99, 7.19, 5.00, 0.00, 102.18, 'USD', null, '2026-05-17 14:00:00', '2026-05-20 11:00:00', null],
      [12, 'ORD-2026-0010', 'processing', 'paid', 'credit_card', 649.98, 51.99, 15.00, 0.00, 716.97, 'USD', null, null, null, null]
    ];

    for (const order of orders) {
      await connection.query(
        'INSERT INTO orders (user_id, order_number, status, payment_status, payment_method, subtotal, tax_amount, shipping_amount, discount_amount, total_amount, currency, notes, shipped_at, delivered_at, cancelled_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        order
      );
    }
    console.log('✓ Seeded 10 orders');

    // 10. Insert Order Items
    console.log('Seeding order items...');
    const orderItems = [
      [1, 1, 'MacBook Pro 16"', 'MBP-16-001', 1, 2499.99, 2499.99],
      [1, 11, 'Sony WH-1000XM5', 'SONY-XM5', 1, 399.99, 399.99],
      [2, 6, 'iPhone 14 Pro', 'IPH-14P-128', 2, 999.99, 1999.98],
      [3, 15, 'Men\'s Cotton T-Shirt', 'TSHIRT-M-001', 3, 24.99, 74.97],
      [3, 16, 'Men\'s Denim Jeans', 'JEANS-M-001', 2, 59.99, 119.98],
      [3, 18, 'Men\'s Running Shoes', 'SHOES-M-RUN', 4, 89.99, 359.96],
      [4, 23, 'Modern Sofa 3-Seater', 'SOFA-3S-001', 1, 899.99, 899.99],
      [5, 32, 'Dumbbell Set Adjustable', 'DUMB-ADJ-001', 1, 299.99, 299.99],
      [6, 27, 'Stainless Steel Cookware Set', 'COOK-SS-10', 1, 89.99, 89.99],
      [6, 28, 'Coffee Maker Automatic', 'COFFEE-AUTO', 1, 89.99, 89.99],
      [7, 37, 'Bicycle Mountain 27.5"', 'BIKE-MTN-275', 1, 499.99, 499.99],
      [8, 17, 'Men\'s Leather Jacket', 'JACKET-M-001', 1, 299.99, 299.99],
      [8, 2, 'Dell XPS 15', 'DELL-XPS-15', 1, 1899.99, 1899.99],
      [9, 4, 'Logitech MX Master 3', 'LOG-MX3', 1, 99.99, 99.99],
      [10, 45, 'Skincare Set Premium', 'SKIN-SET-001', 2, 89.99, 179.98],
      [10, 48, 'Perfume Luxury', 'PERF-LUX-001', 1, 129.99, 129.99],
      [10, 20, 'Women\'s Yoga Pants', 'YOGA-W-001', 3, 39.99, 119.97],
      [10, 19, 'Women\'s Summer Dress', 'DRESS-W-001', 4, 49.99, 199.96]
    ];

    for (const item of orderItems) {
      await connection.query(
        'INSERT INTO order_items (order_id, product_id, product_name, product_sku, quantity, unit_price, total_price) VALUES (?, ?, ?, ?, ?, ?, ?)',
        item
      );
    }
    console.log('✓ Seeded order items');

    // 11. Insert Order Shipping Addresses
    console.log('Seeding order shipping addresses...');
    const shippingAddresses = [
      [1, 'John Doe', '123 Main St', 'Apt 4B', 'New York', 'NY', '10001', 'USA', '555-0101'],
      [2, 'Jane Smith', '456 Oak Ave', '', 'Los Angeles', 'CA', '90001', 'USA', '555-0102'],
      [3, 'Mike Johnson', '789 Pine Rd', 'Suite 200', 'Chicago', 'IL', '60601', 'USA', '555-0103'],
      [4, 'Sarah Williams', '321 Elm St', '', 'Houston', 'TX', '77001', 'USA', '555-0104'],
      [5, 'David Brown', '654 Maple Dr', 'Unit 5', 'Phoenix', 'AZ', '85001', 'USA', '555-0105'],
      [6, 'Emily Davis', '987 Cedar Ln', '', 'Philadelphia', 'PA', '19101', 'USA', '555-0106'],
      [7, 'Chris Miller', '147 Birch Ave', 'Apt 2C', 'San Antonio', 'TX', '78201', 'USA', '555-0107'],
      [8, 'Lisa Wilson', '258 Spruce St', '', 'San Diego', 'CA', '92101', 'USA', '555-0108'],
      [9, 'Robert Moore', '369 Willow Rd', 'Suite 100', 'Dallas', 'TX', '75201', 'USA', '555-0109'],
      [10, 'Amanda Taylor', '741 Ash Dr', '', 'San Jose', 'CA', '95101', 'USA', '555-0110']
    ];

    for (const address of shippingAddresses) {
      await connection.query(
        'INSERT INTO order_shipping_addresses (order_id, full_name, address_line1, address_line2, city, state, postal_code, country, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        address
      );
    }
    console.log('✓ Seeded order shipping addresses');

    console.log('\n✅ Database seeded successfully!');
    console.log('\nSummary:');
    console.log('- 12 users (2 admins, 10 customers)');
    console.log('- 5 user addresses');
    console.log('- 15 categories');
    console.log('- 50 products');
    console.log('- 150 product images');
    console.log('- 3 carts with items');
    console.log('- 10 orders with items and shipping addresses');

    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('✗ Error seeding data:', error.message);
    if (connection) {
      await connection.end();
    }
    process.exit(1);
  }
};

seedData();
