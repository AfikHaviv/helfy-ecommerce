const { pool } = require('../config/database');

const ProductModel = {
  /**
   * Get all products with filters and pagination
   */
  async findAll(filters = {}) {
    const {
      page = 1,
      limit = 20,
      search = '',
      category = null,
      minPrice = null,
      maxPrice = null,
      sort = 'newest',
      inStock = null,
      featured = null
    } = filters;

    const offset = (page - 1) * limit;
    const conditions = ['p.is_active = TRUE'];
    const params = [];

    // Search filter
    if (search) {
      conditions.push('(p.name LIKE ? OR p.description LIKE ? OR p.short_description LIKE ?)');
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // Category filter
    if (category) {
      conditions.push('EXISTS (SELECT 1 FROM product_categories pc WHERE pc.product_id = p.id AND pc.category_id = ?)');
      params.push(category);
    }

    // Price filters
    if (minPrice !== null) {
      conditions.push('p.price >= ?');
      params.push(minPrice);
    }
    if (maxPrice !== null) {
      conditions.push('p.price <= ?');
      params.push(maxPrice);
    }

    // Stock filter
    if (inStock !== null && inStock) {
      conditions.push('p.stock_quantity > 0');
    }

    // Featured filter
    if (featured !== null) {
      conditions.push('p.is_featured = ?');
      params.push(featured);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Sort order
    let orderBy = 'p.created_at DESC';
    switch (sort) {
      case 'price_asc':
        orderBy = 'p.price ASC';
        break;
      case 'price_desc':
        orderBy = 'p.price DESC';
        break;
      case 'name_asc':
        orderBy = 'p.name ASC';
        break;
      case 'name_desc':
        orderBy = 'p.name DESC';
        break;
      case 'popular':
        orderBy = 'p.view_count DESC, p.rating_average DESC';
        break;
      case 'newest':
      default:
        orderBy = 'p.created_at DESC';
    }

    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM products p ${whereClause}`,
      params
    );
    const total = countResult[0].total;

    // Get products (LIMIT/OFFSET interpolated directly — values are already parseInt'd in the controller)
    const [products] = await pool.execute(
      `SELECT p.*,
        (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as primary_image
       FROM products p
       ${whereClause}
       ORDER BY ${orderBy}
       LIMIT ${limit} OFFSET ${offset}`,
      params
    );

    return { products, total };
  },

  /**
   * Get featured products
   */
  async findFeatured(limit = 10) {
    const [products] = await pool.execute(
      `SELECT p.*,
        (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as primary_image
       FROM products p
       WHERE p.is_active = TRUE AND p.is_featured = TRUE
       ORDER BY p.created_at DESC
       LIMIT ${parseInt(limit)}`,
      []
    );

    return products;
  },

  /**
   * Find product by ID
   */
  async findById(id) {
    const [products] = await pool.execute(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );

    if (products.length === 0) {
      return null;
    }

    const product = products[0];

    // Get images
    const [images] = await pool.execute(
      'SELECT * FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, display_order ASC',
      [id]
    );
    product.images = images;

    // Get categories
    const [categories] = await pool.execute(
      `SELECT c.* FROM categories c
       INNER JOIN product_categories pc ON c.id = pc.category_id
       WHERE pc.product_id = ?`,
      [id]
    );
    product.categories = categories;

    return product;
  },

  /**
   * Find product by slug
   */
  async findBySlug(slug) {
    const [products] = await pool.execute(
      'SELECT * FROM products WHERE slug = ?',
      [slug]
    );

    if (products.length === 0) {
      return null;
    }

    const product = products[0];

    // Get images
    const [images] = await pool.execute(
      'SELECT * FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, display_order ASC',
      [product.id]
    );
    product.images = images;

    // Get categories
    const [categories] = await pool.execute(
      `SELECT c.* FROM categories c
       INNER JOIN product_categories pc ON c.id = pc.category_id
       WHERE pc.product_id = ?`,
      [product.id]
    );
    product.categories = categories;

    return product;
  },

  /**
   * Create a new product
   */
  async create(productData) {
    const {
      name,
      slug,
      description,
      short_description,
      price,
      compare_at_price,
      cost_price,
      sku,
      barcode,
      stock_quantity,
      low_stock_threshold,
      weight,
      dimensions,
      is_active,
      is_featured,
      category_ids
    } = productData;

    const [result] = await pool.execute(
      `INSERT INTO products 
       (name, slug, description, short_description, price, compare_at_price, cost_price,
        sku, barcode, stock_quantity, low_stock_threshold, weight, dimensions, is_active, is_featured)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        slug,
        description,
        short_description || null,
        price,
        compare_at_price || null,
        cost_price || null,
        sku || null,
        barcode || null,
        stock_quantity || 0,
        low_stock_threshold || 10,
        weight || null,
        dimensions || null,
        is_active !== undefined ? is_active : true,
        is_featured !== undefined ? is_featured : false
      ]
    );

    const productId = result.insertId;

    // Add categories if provided
    if (category_ids && category_ids.length > 0) {
      await this.updateCategories(productId, category_ids);
    }

    return productId;
  },

  /**
   * Update product
   */
  async update(id, updates) {
    const fields = [];
    const values = [];

    const allowedFields = [
      'name', 'slug', 'description', 'short_description', 'price', 'compare_at_price',
      'cost_price', 'sku', 'barcode', 'stock_quantity', 'low_stock_threshold',
      'weight', 'dimensions', 'is_active', 'is_featured'
    ];

    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        fields.push(`${field} = ?`);
        values.push(updates[field]);
      }
    });

    if (fields.length === 0 && !updates.category_ids) {
      return false;
    }

    if (fields.length > 0) {
      values.push(id);
      await pool.execute(
        `UPDATE products SET ${fields.join(', ')} WHERE id = ?`,
        values
      );
    }

    // Update categories if provided
    if (updates.category_ids) {
      await this.updateCategories(id, updates.category_ids);
    }

    return true;
  },

  /**
   * Delete product
   */
  async delete(id) {
    const [result] = await pool.execute(
      'DELETE FROM products WHERE id = ?',
      [id]
    );

    return result.affectedRows > 0;
  },

  /**
   * Update product categories
   */
  async updateCategories(productId, categoryIds) {
    // Remove existing categories
    await pool.execute(
      'DELETE FROM product_categories WHERE product_id = ?',
      [productId]
    );

    // Add new categories
    if (categoryIds && categoryIds.length > 0) {
      const values = categoryIds.map(catId => [productId, catId]);
      await pool.query(
        'INSERT INTO product_categories (product_id, category_id) VALUES ?',
        [values]
      );
    }
  },

  /**
   * Increment view count
   */
  async incrementViewCount(id) {
    await pool.execute(
      'UPDATE products SET view_count = view_count + 1 WHERE id = ?',
      [id]
    );
  },

  /**
   * Update stock quantity
   */
  async updateStock(id, quantity) {
    const [result] = await pool.execute(
      'UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?',
      [quantity, id]
    );

    return result.affectedRows > 0;
  },

  /**
   * Check if product has sufficient stock
   */
  async checkStock(id, quantity) {
    const [products] = await pool.execute(
      'SELECT stock_quantity FROM products WHERE id = ?',
      [id]
    );

    if (products.length === 0) {
      return false;
    }

    return products[0].stock_quantity >= quantity;
  }
};

module.exports = ProductModel;
