const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const ProductModel = require('../models/product.model');

/**
 * @desc    Get all products with filters and pagination
 * @route   GET /api/products
 * @access  Public
 */
const getAllProducts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    search,
    category,
    minPrice,
    maxPrice,
    sort,
    inStock,
    featured
  } = req.query;

  const filters = {
    page: parseInt(page),
    limit: parseInt(limit),
    search,
    category: category ? parseInt(category) : null,
    minPrice: minPrice ? parseFloat(minPrice) : null,
    maxPrice: maxPrice ? parseFloat(maxPrice) : null,
    sort,
    inStock: inStock === 'true',
    featured: featured === 'true' ? true : featured === 'false' ? false : null
  };

  const { products, total } = await ProductModel.findAll(filters);

  const pagination = {
    page: filters.page,
    limit: filters.limit,
    total,
    totalPages: Math.ceil(total / filters.limit)
  };

  ApiResponse.paginated(res, products, pagination);
});

/**
 * @desc    Get featured products
 * @route   GET /api/products/featured
 * @access  Public
 */
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;

  const products = await ProductModel.findFeatured(parseInt(limit));

  ApiResponse.success(res, { products });
});

/**
 * @desc    Get product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await ProductModel.findById(id);

  if (!product) {
    throw ApiError.notFound('Product not found');
  }

  // Increment view count
  await ProductModel.incrementViewCount(id);

  ApiResponse.success(res, { product });
});

/**
 * @desc    Get product by slug
 * @route   GET /api/products/slug/:slug
 * @access  Public
 */
const getProductBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const product = await ProductModel.findBySlug(slug);

  if (!product) {
    throw ApiError.notFound('Product not found');
  }

  // Increment view count
  await ProductModel.incrementViewCount(product.id);

  ApiResponse.success(res, { product });
});

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Private/Admin
 */
const createProduct = asyncHandler(async (req, res) => {
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
  } = req.body;

  // Check if slug already exists
  const existingProduct = await ProductModel.findBySlug(slug);
  if (existingProduct) {
    throw ApiError.conflict('Product with this slug already exists', 'SLUG_EXISTS');
  }

  const productId = await ProductModel.create({
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
  });

  const product = await ProductModel.findById(productId);

  ApiResponse.created(res, { product }, 'Product created successfully');
});

/**
 * @desc    Update product
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
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
  } = req.body;

  // Check if product exists
  const existingProduct = await ProductModel.findById(id);
  if (!existingProduct) {
    throw ApiError.notFound('Product not found');
  }

  // If slug is being updated, check if it's already taken
  if (slug && slug !== existingProduct.slug) {
    const productWithSlug = await ProductModel.findBySlug(slug);
    if (productWithSlug) {
      throw ApiError.conflict('Product with this slug already exists', 'SLUG_EXISTS');
    }
  }

  const updated = await ProductModel.update(id, {
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
  });

  if (!updated) {
    throw ApiError.badRequest('No fields to update');
  }

  const product = await ProductModel.findById(id);

  ApiResponse.success(res, { product }, 'Product updated successfully');
});

/**
 * @desc    Delete product
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if product exists
  const existingProduct = await ProductModel.findById(id);
  if (!existingProduct) {
    throw ApiError.notFound('Product not found');
  }

  const deleted = await ProductModel.delete(id);

  if (!deleted) {
    throw ApiError.internal('Failed to delete product');
  }

  ApiResponse.success(res, null, 'Product deleted successfully');
});

module.exports = {
  getAllProducts,
  getFeaturedProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct
};
