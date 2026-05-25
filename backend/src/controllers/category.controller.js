const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { pool } = require('../config/database');

/**
 * @desc    Get all categories
 * @route   GET /api/categories
 * @access  Public
 */
const getAllCategories = asyncHandler(async (req, res) => {
  const [categories] = await pool.execute(
    `SELECT * FROM categories 
     WHERE is_active = TRUE 
     ORDER BY display_order ASC, name ASC`
  );

  ApiResponse.success(res, { categories });
});

/**
 * @desc    Get category by ID
 * @route   GET /api/categories/:id
 * @access  Public
 */
const getCategoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [categories] = await pool.execute(
    'SELECT * FROM categories WHERE id = ?',
    [id]
  );

  if (categories.length === 0) {
    throw ApiError.notFound('Category not found');
  }

  const category = categories[0];

  // Get subcategories if any
  const [subcategories] = await pool.execute(
    'SELECT * FROM categories WHERE parent_id = ? AND is_active = TRUE ORDER BY display_order ASC, name ASC',
    [id]
  );

  category.subcategories = subcategories;

  ApiResponse.success(res, { category });
});

/**
 * @desc    Get products by category
 * @route   GET /api/categories/:id/products
 * @access  Public
 */
const getCategoryProducts = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    page = 1,
    limit = 20,
    sort = 'newest'
  } = req.query;

  // Check if category exists
  const [categories] = await pool.execute(
    'SELECT * FROM categories WHERE id = ?',
    [id]
  );

  if (categories.length === 0) {
    throw ApiError.notFound('Category not found');
  }

  const offset = (parseInt(page) - 1) * parseInt(limit);

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
    `SELECT COUNT(DISTINCT p.id) as total 
     FROM products p
     INNER JOIN product_categories pc ON p.id = pc.product_id
     WHERE pc.category_id = ? AND p.is_active = TRUE`,
    [id]
  );
  const total = countResult[0].total;

  // Get products
  const [products] = await pool.execute(
    `SELECT DISTINCT p.*, 
      (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as primary_image
     FROM products p
     INNER JOIN product_categories pc ON p.id = pc.product_id
     WHERE pc.category_id = ? AND p.is_active = TRUE
     ORDER BY ${orderBy}
     LIMIT ? OFFSET ?`,
    [id, parseInt(limit), offset]
  );

  const pagination = {
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    totalPages: Math.ceil(total / parseInt(limit))
  };

  ApiResponse.paginated(res, products, pagination);
});

/**
 * @desc    Create a new category
 * @route   POST /api/categories
 * @access  Private/Admin
 */
const createCategory = asyncHandler(async (req, res) => {
  const {
    name,
    slug,
    description,
    parent_id,
    image_url,
    is_active,
    display_order
  } = req.body;

  // Check if slug already exists
  const [existingCategories] = await pool.execute(
    'SELECT id FROM categories WHERE slug = ?',
    [slug]
  );

  if (existingCategories.length > 0) {
    throw ApiError.conflict('Category with this slug already exists', 'SLUG_EXISTS');
  }

  // If parent_id is provided, check if it exists
  if (parent_id) {
    const [parentCategories] = await pool.execute(
      'SELECT id FROM categories WHERE id = ?',
      [parent_id]
    );

    if (parentCategories.length === 0) {
      throw ApiError.notFound('Parent category not found');
    }
  }

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

  const [categories] = await pool.execute(
    'SELECT * FROM categories WHERE id = ?',
    [result.insertId]
  );

  ApiResponse.created(res, { category: categories[0] }, 'Category created successfully');
});

/**
 * @desc    Update category
 * @route   PUT /api/categories/:id
 * @access  Private/Admin
 */
const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    name,
    slug,
    description,
    parent_id,
    image_url,
    is_active,
    display_order
  } = req.body;

  // Check if category exists
  const [existingCategories] = await pool.execute(
    'SELECT * FROM categories WHERE id = ?',
    [id]
  );

  if (existingCategories.length === 0) {
    throw ApiError.notFound('Category not found');
  }

  // If slug is being updated, check if it's already taken
  if (slug && slug !== existingCategories[0].slug) {
    const [categoriesWithSlug] = await pool.execute(
      'SELECT id FROM categories WHERE slug = ? AND id != ?',
      [slug, id]
    );

    if (categoriesWithSlug.length > 0) {
      throw ApiError.conflict('Category with this slug already exists', 'SLUG_EXISTS');
    }
  }

  // If parent_id is being updated, check if it exists and prevent circular reference
  if (parent_id) {
    if (parseInt(parent_id) === parseInt(id)) {
      throw ApiError.badRequest('Category cannot be its own parent', 'CIRCULAR_REFERENCE');
    }

    const [parentCategories] = await pool.execute(
      'SELECT id FROM categories WHERE id = ?',
      [parent_id]
    );

    if (parentCategories.length === 0) {
      throw ApiError.notFound('Parent category not found');
    }
  }

  const fields = [];
  const values = [];

  if (name !== undefined) {
    fields.push('name = ?');
    values.push(name);
  }
  if (slug !== undefined) {
    fields.push('slug = ?');
    values.push(slug);
  }
  if (description !== undefined) {
    fields.push('description = ?');
    values.push(description);
  }
  if (parent_id !== undefined) {
    fields.push('parent_id = ?');
    values.push(parent_id || null);
  }
  if (image_url !== undefined) {
    fields.push('image_url = ?');
    values.push(image_url);
  }
  if (is_active !== undefined) {
    fields.push('is_active = ?');
    values.push(is_active);
  }
  if (display_order !== undefined) {
    fields.push('display_order = ?');
    values.push(display_order);
  }

  if (fields.length === 0) {
    throw ApiError.badRequest('No fields to update');
  }

  values.push(id);

  await pool.execute(
    `UPDATE categories SET ${fields.join(', ')} WHERE id = ?`,
    values
  );

  const [categories] = await pool.execute(
    'SELECT * FROM categories WHERE id = ?',
    [id]
  );

  ApiResponse.success(res, { category: categories[0] }, 'Category updated successfully');
});

/**
 * @desc    Delete category
 * @route   DELETE /api/categories/:id
 * @access  Private/Admin
 */
const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if category exists
  const [existingCategories] = await pool.execute(
    'SELECT * FROM categories WHERE id = ?',
    [id]
  );

  if (existingCategories.length === 0) {
    throw ApiError.notFound('Category not found');
  }

  // Check if category has subcategories
  const [subcategories] = await pool.execute(
    'SELECT COUNT(*) as count FROM categories WHERE parent_id = ?',
    [id]
  );

  if (subcategories[0].count > 0) {
    throw ApiError.badRequest('Cannot delete category with subcategories', 'HAS_SUBCATEGORIES');
  }

  // Check if category has products
  const [products] = await pool.execute(
    'SELECT COUNT(*) as count FROM product_categories WHERE category_id = ?',
    [id]
  );

  if (products[0].count > 0) {
    throw ApiError.badRequest('Cannot delete category with associated products', 'HAS_PRODUCTS');
  }

  const [result] = await pool.execute(
    'DELETE FROM categories WHERE id = ?',
    [id]
  );

  if (result.affectedRows === 0) {
    throw ApiError.internal('Failed to delete category');
  }

  ApiResponse.success(res, null, 'Category deleted successfully');
});

module.exports = {
  getAllCategories,
  getCategoryById,
  getCategoryProducts,
  createCategory,
  updateCategory,
  deleteCategory
};
