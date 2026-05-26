const { pool } = require('../config/database');

const CategoryModel = {
  async findAll() {
    const [categories] = await pool.execute(
      'SELECT * FROM categories WHERE is_active = TRUE ORDER BY display_order ASC, name ASC'
    );
    return categories;
  },

  async findById(id) {
    const [categories] = await pool.execute(
      'SELECT * FROM categories WHERE id = ?',
      [id]
    );
    return categories[0] || null;
  },

  async findBySlug(slug) {
    const [categories] = await pool.execute(
      'SELECT * FROM categories WHERE slug = ?',
      [slug]
    );
    return categories[0] || null;
  },

  async findSubcategories(parentId) {
    const [categories] = await pool.execute(
      'SELECT * FROM categories WHERE parent_id = ? AND is_active = TRUE ORDER BY display_order ASC, name ASC',
      [parentId]
    );
    return categories;
  },

  async create(categoryData) {
    const {
      name,
      slug,
      description,
      parent_id,
      image_url,
      is_active,
      display_order
    } = categoryData;

    const [result] = await pool.execute(
      `INSERT INTO categories (name, slug, description, parent_id, image_url, is_active, display_order)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        slug,
        description || null,
        parent_id || null,
        image_url || null,
        is_active !== undefined ? is_active : true,
        display_order || 0
      ]
    );

    return result.insertId;
  },

  async update(id, updates) {
    const fields = [];
    const values = [];

    const allowedFields = [
      'name', 'slug', 'description', 'parent_id', 'image_url', 'is_active', 'display_order'
    ];

    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        fields.push(`${field} = ?`);
        values.push(updates[field]);
      }
    });

    if (fields.length === 0) {
      return false;
    }

    values.push(id);

    const [result] = await pool.execute(
      `UPDATE categories SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return result.affectedRows > 0;
  },

  async delete(id) {
    const [result] = await pool.execute(
      'DELETE FROM categories WHERE id = ?',
      [id]
    );

    return result.affectedRows > 0;
  },

  async getCategoryProducts(categoryId, filters = {}) {
    const {
      page = 1,
      limit = 20,
      sort = 'newest'
    } = filters;

    const offset = (page - 1) * limit;

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

    const [countResult] = await pool.execute(
      `SELECT COUNT(DISTINCT p.id) as total 
       FROM products p
       INNER JOIN product_categories pc ON p.id = pc.product_id
       WHERE pc.category_id = ? AND p.is_active = TRUE`,
      [categoryId]
    );
    const total = countResult[0].total;

    const [products] = await pool.execute(
      `SELECT DISTINCT p.*,
        (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as primary_image
       FROM products p
       INNER JOIN product_categories pc ON p.id = pc.product_id
       WHERE pc.category_id = ? AND p.is_active = TRUE
       ORDER BY ${orderBy}
       LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`,
      [categoryId]
    );

    return { products, total };
  }
};

module.exports = CategoryModel;
