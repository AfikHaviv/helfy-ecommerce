const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { pool } = require('../config/database');
const ProductModel = require('../models/product.model');

/**
 * @desc    Get user cart
 * @route   GET /api/cart
 * @access  Private/Session
 */
const getCart = asyncHandler(async (req, res) => {
  const userId = req.user ? req.user.id : null;
  const sessionId = req.sessionId || null;

  if (!userId && !sessionId) {
    throw ApiError.unauthorized('User or session required', 'NO_AUTH');
  }

  // Find cart
  let cart;
  if (userId) {
    const [carts] = await pool.execute(
      'SELECT * FROM carts WHERE user_id = ?',
      [userId]
    );
    cart = carts[0];
  } else {
    const [carts] = await pool.execute(
      'SELECT * FROM carts WHERE session_id = ?',
      [sessionId]
    );
    cart = carts[0];
  }

  if (!cart) {
    // Return empty cart
    ApiResponse.success(res, { cart: null, items: [], total: 0 });
    return;
  }

  // Get cart items with product details
  const [items] = await pool.execute(
    `SELECT ci.*, p.name, p.slug, p.price, p.stock_quantity, p.is_active,
      (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as image_url
     FROM cart_items ci
     INNER JOIN products p ON ci.product_id = p.id
     WHERE ci.cart_id = ?`,
    [cart.id]
  );

  // Calculate total
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  ApiResponse.success(res, { cart, items, total });
});

/**
 * @desc    Add item to cart
 * @route   POST /api/cart/items
 * @access  Private/Session
 */
const addToCart = asyncHandler(async (req, res) => {
  const { product_id, quantity = 1 } = req.body;
  const userId = req.user ? req.user.id : null;
  const sessionId = req.sessionId || null;

  if (!userId && !sessionId) {
    throw ApiError.unauthorized('User or session required', 'NO_AUTH');
  }

  // Validate product exists and is active
  const product = await ProductModel.findById(product_id);
  if (!product) {
    throw ApiError.notFound('Product not found');
  }

  if (!product.is_active) {
    throw ApiError.badRequest('Product is not available', 'PRODUCT_INACTIVE');
  }

  // Check stock
  if (product.stock_quantity < quantity) {
    throw ApiError.badRequest('Insufficient stock', 'INSUFFICIENT_STOCK');
  }

  // Find or create cart
  let cart;
  if (userId) {
    const [carts] = await pool.execute(
      'SELECT * FROM carts WHERE user_id = ?',
      [userId]
    );
    
    if (carts.length === 0) {
      const [result] = await pool.execute(
        'INSERT INTO carts (user_id) VALUES (?)',
        [userId]
      );
      const [newCarts] = await pool.execute(
        'SELECT * FROM carts WHERE id = ?',
        [result.insertId]
      );
      cart = newCarts[0];
    } else {
      cart = carts[0];
    }
  } else {
    const [carts] = await pool.execute(
      'SELECT * FROM carts WHERE session_id = ?',
      [sessionId]
    );
    
    if (carts.length === 0) {
      const [result] = await pool.execute(
        'INSERT INTO carts (session_id) VALUES (?)',
        [sessionId]
      );
      const [newCarts] = await pool.execute(
        'SELECT * FROM carts WHERE id = ?',
        [result.insertId]
      );
      cart = newCarts[0];
    } else {
      cart = carts[0];
    }
  }

  // Check if item already exists in cart
  const [existingItems] = await pool.execute(
    'SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?',
    [cart.id, product_id]
  );

  if (existingItems.length > 0) {
    // Update quantity
    const newQuantity = existingItems[0].quantity + quantity;
    
    // Check stock for new quantity
    if (product.stock_quantity < newQuantity) {
      throw ApiError.badRequest('Insufficient stock', 'INSUFFICIENT_STOCK');
    }

    await pool.execute(
      'UPDATE cart_items SET quantity = ? WHERE id = ?',
      [newQuantity, existingItems[0].id]
    );
  } else {
    // Add new item
    await pool.execute(
      'INSERT INTO cart_items (cart_id, product_id, quantity, price_at_addition) VALUES (?, ?, ?, ?)',
      [cart.id, product_id, quantity, product.price]
    );
  }

  // Get updated cart
  const [items] = await pool.execute(
    `SELECT ci.*, p.name, p.slug, p.price, p.stock_quantity, p.is_active,
      (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as image_url
     FROM cart_items ci
     INNER JOIN products p ON ci.product_id = p.id
     WHERE ci.cart_id = ?`,
    [cart.id]
  );

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  ApiResponse.success(res, { cart, items, total }, 'Item added to cart');
});

/**
 * @desc    Update cart item quantity
 * @route   PUT /api/cart/items/:id
 * @access  Private/Session
 */
const updateCartItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  const userId = req.user ? req.user.id : null;
  const sessionId = req.sessionId || null;

  if (!userId && !sessionId) {
    throw ApiError.unauthorized('User or session required', 'NO_AUTH');
  }

  if (quantity < 1) {
    throw ApiError.badRequest('Quantity must be at least 1');
  }

  // Find cart
  let cart;
  if (userId) {
    const [carts] = await pool.execute(
      'SELECT * FROM carts WHERE user_id = ?',
      [userId]
    );
    cart = carts[0];
  } else {
    const [carts] = await pool.execute(
      'SELECT * FROM carts WHERE session_id = ?',
      [sessionId]
    );
    cart = carts[0];
  }

  if (!cart) {
    throw ApiError.notFound('Cart not found');
  }

  // Get cart item
  const [items] = await pool.execute(
    'SELECT * FROM cart_items WHERE id = ? AND cart_id = ?',
    [id, cart.id]
  );

  if (items.length === 0) {
    throw ApiError.notFound('Cart item not found');
  }

  const cartItem = items[0];

  // Check product stock
  const product = await ProductModel.findById(cartItem.product_id);
  if (!product) {
    throw ApiError.notFound('Product not found');
  }

  if (product.stock_quantity < quantity) {
    throw ApiError.badRequest('Insufficient stock', 'INSUFFICIENT_STOCK');
  }

  // Update quantity
  await pool.execute(
    'UPDATE cart_items SET quantity = ? WHERE id = ?',
    [quantity, id]
  );

  // Get updated cart
  const [updatedItems] = await pool.execute(
    `SELECT ci.*, p.name, p.slug, p.price, p.stock_quantity, p.is_active,
      (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as image_url
     FROM cart_items ci
     INNER JOIN products p ON ci.product_id = p.id
     WHERE ci.cart_id = ?`,
    [cart.id]
  );

  const total = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  ApiResponse.success(res, { cart, items: updatedItems, total }, 'Cart updated');
});

/**
 * @desc    Remove item from cart
 * @route   DELETE /api/cart/items/:id
 * @access  Private/Session
 */
const removeFromCart = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user ? req.user.id : null;
  const sessionId = req.sessionId || null;

  if (!userId && !sessionId) {
    throw ApiError.unauthorized('User or session required', 'NO_AUTH');
  }

  // Find cart
  let cart;
  if (userId) {
    const [carts] = await pool.execute(
      'SELECT * FROM carts WHERE user_id = ?',
      [userId]
    );
    cart = carts[0];
  } else {
    const [carts] = await pool.execute(
      'SELECT * FROM carts WHERE session_id = ?',
      [sessionId]
    );
    cart = carts[0];
  }

  if (!cart) {
    throw ApiError.notFound('Cart not found');
  }

  // Delete item
  const [result] = await pool.execute(
    'DELETE FROM cart_items WHERE id = ? AND cart_id = ?',
    [id, cart.id]
  );

  if (result.affectedRows === 0) {
    throw ApiError.notFound('Cart item not found');
  }

  // Get updated cart
  const [items] = await pool.execute(
    `SELECT ci.*, p.name, p.slug, p.price, p.stock_quantity, p.is_active,
      (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as image_url
     FROM cart_items ci
     INNER JOIN products p ON ci.product_id = p.id
     WHERE ci.cart_id = ?`,
    [cart.id]
  );

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  ApiResponse.success(res, { cart, items, total }, 'Item removed from cart');
});

/**
 * @desc    Clear cart
 * @route   DELETE /api/cart
 * @access  Private/Session
 */
const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user ? req.user.id : null;
  const sessionId = req.sessionId || null;

  if (!userId && !sessionId) {
    throw ApiError.unauthorized('User or session required', 'NO_AUTH');
  }

  // Find cart
  let cart;
  if (userId) {
    const [carts] = await pool.execute(
      'SELECT * FROM carts WHERE user_id = ?',
      [userId]
    );
    cart = carts[0];
  } else {
    const [carts] = await pool.execute(
      'SELECT * FROM carts WHERE session_id = ?',
      [sessionId]
    );
    cart = carts[0];
  }

  if (!cart) {
    ApiResponse.success(res, null, 'Cart already empty');
    return;
  }

  // Delete all items
  await pool.execute(
    'DELETE FROM cart_items WHERE cart_id = ?',
    [cart.id]
  );

  ApiResponse.success(res, null, 'Cart cleared');
});

/**
 * @desc    Merge session cart with user cart
 * @route   POST /api/cart/merge
 * @access  Private
 */
const mergeCart = asyncHandler(async (req, res) => {
  const { sessionId } = req.body;
  const userId = req.user.id;

  if (!sessionId) {
    throw ApiError.badRequest('Session ID required');
  }

  // Find session cart
  const [sessionCarts] = await pool.execute(
    'SELECT * FROM carts WHERE session_id = ?',
    [sessionId]
  );

  if (sessionCarts.length === 0) {
    ApiResponse.success(res, null, 'No session cart to merge');
    return;
  }

  const sessionCart = sessionCarts[0];

  // Find or create user cart
  let userCart;
  const [userCarts] = await pool.execute(
    'SELECT * FROM carts WHERE user_id = ?',
    [userId]
  );

  if (userCarts.length === 0) {
    const [result] = await pool.execute(
      'INSERT INTO carts (user_id) VALUES (?)',
      [userId]
    );
    const [newCarts] = await pool.execute(
      'SELECT * FROM carts WHERE id = ?',
      [result.insertId]
    );
    userCart = newCarts[0];
  } else {
    userCart = userCarts[0];
  }

  // Get session cart items
  const [sessionItems] = await pool.execute(
    'SELECT * FROM cart_items WHERE cart_id = ?',
    [sessionCart.id]
  );

  // Merge items
  for (const item of sessionItems) {
    // Check if item exists in user cart
    const [existingItems] = await pool.execute(
      'SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?',
      [userCart.id, item.product_id]
    );

    if (existingItems.length > 0) {
      // Update quantity
      await pool.execute(
        'UPDATE cart_items SET quantity = quantity + ? WHERE id = ?',
        [item.quantity, existingItems[0].id]
      );
    } else {
      // Add new item
      await pool.execute(
        'INSERT INTO cart_items (cart_id, product_id, quantity, price_at_addition) VALUES (?, ?, ?, ?)',
        [userCart.id, item.product_id, item.quantity, item.price_at_addition]
      );
    }
  }

  // Delete session cart
  await pool.execute(
    'DELETE FROM carts WHERE id = ?',
    [sessionCart.id]
  );

  // Get merged cart
  const [items] = await pool.execute(
    `SELECT ci.*, p.name, p.slug, p.price, p.stock_quantity, p.is_active,
      (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as image_url
     FROM cart_items ci
     INNER JOIN products p ON ci.product_id = p.id
     WHERE ci.cart_id = ?`,
    [userCart.id]
  );

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  ApiResponse.success(res, { cart: userCart, items, total }, 'Cart merged successfully');
});

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  mergeCart
};
