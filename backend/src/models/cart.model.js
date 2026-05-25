const { pool } = require('../config/database');

const CartModel = {
  async findByUserId(userId) {
    const [carts] = await pool.execute(
      'SELECT * FROM carts WHERE user_id = ?',
      [userId]
    );
    return carts[0] || null;
  },

  async findBySessionId(sessionId) {
    const [carts] = await pool.execute(
      'SELECT * FROM carts WHERE session_id = ?',
      [sessionId]
    );
    return carts[0] || null;
  },

  async createForUser(userId) {
    const [result] = await pool.execute(
      'INSERT INTO carts (user_id) VALUES (?)',
      [userId]
    );
    return result.insertId;
  },

  async createForSession(sessionId) {
    const [result] = await pool.execute(
      'INSERT INTO carts (session_id) VALUES (?)',
      [sessionId]
    );
    return result.insertId;
  },

  async getCartItems(cartId) {
    const [items] = await pool.execute(
      `SELECT ci.*, p.name, p.slug, p.price, p.stock_quantity, p.is_active,
        (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as image_url
       FROM cart_items ci
       INNER JOIN products p ON ci.product_id = p.id
       WHERE ci.cart_id = ?`,
      [cartId]
    );
    return items;
  },

  async findCartItem(cartId, productId) {
    const [items] = await pool.execute(
      'SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?',
      [cartId, productId]
    );
    return items[0] || null;
  },

  async findCartItemById(itemId, cartId) {
    const [items] = await pool.execute(
      'SELECT * FROM cart_items WHERE id = ? AND cart_id = ?',
      [itemId, cartId]
    );
    return items[0] || null;
  },

  async addItem(cartId, productId, quantity, price) {
    const [result] = await pool.execute(
      'INSERT INTO cart_items (cart_id, product_id, quantity, price_at_addition) VALUES (?, ?, ?, ?)',
      [cartId, productId, quantity, price]
    );
    return result.insertId;
  },

  async updateItemQuantity(itemId, quantity) {
    const [result] = await pool.execute(
      'UPDATE cart_items SET quantity = ? WHERE id = ?',
      [quantity, itemId]
    );
    return result.affectedRows > 0;
  },

  async incrementItemQuantity(itemId, quantity) {
    const [result] = await pool.execute(
      'UPDATE cart_items SET quantity = quantity + ? WHERE id = ?',
      [quantity, itemId]
    );
    return result.affectedRows > 0;
  },

  async removeItem(itemId, cartId) {
    const [result] = await pool.execute(
      'DELETE FROM cart_items WHERE id = ? AND cart_id = ?',
      [itemId, cartId]
    );
    return result.affectedRows > 0;
  },

  async clearCart(cartId) {
    const [result] = await pool.execute(
      'DELETE FROM cart_items WHERE cart_id = ?',
      [cartId]
    );
    return result.affectedRows;
  },

  async deleteCart(cartId) {
    const [result] = await pool.execute(
      'DELETE FROM carts WHERE id = ?',
      [cartId]
    );
    return result.affectedRows > 0;
  },

  async mergeSessionCartToUser(sessionCartId, userCartId) {
    const [sessionItems] = await pool.execute(
      'SELECT * FROM cart_items WHERE cart_id = ?',
      [sessionCartId]
    );

    for (const item of sessionItems) {
      const [existingItems] = await pool.execute(
        'SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?',
        [userCartId, item.product_id]
      );

      if (existingItems.length > 0) {
        await pool.execute(
          'UPDATE cart_items SET quantity = quantity + ? WHERE id = ?',
          [item.quantity, existingItems[0].id]
        );
      } else {
        await pool.execute(
          'INSERT INTO cart_items (cart_id, product_id, quantity, price_at_addition) VALUES (?, ?, ?, ?)',
          [userCartId, item.product_id, item.quantity, item.price_at_addition]
        );
      }
    }

    await pool.execute(
      'DELETE FROM carts WHERE id = ?',
      [sessionCartId]
    );

    return true;
  }
};

module.exports = CartModel;
