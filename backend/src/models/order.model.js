const { pool } = require('../config/database');

const OrderModel = {
  async create(orderData) {
    const {
      user_id,
      order_number,
      subtotal,
      tax_amount,
      shipping_amount,
      discount_amount,
      total_amount,
      payment_method,
      notes
    } = orderData;

    const [result] = await pool.execute(
      `INSERT INTO orders (user_id, order_number, subtotal, tax_amount, shipping_amount, discount_amount, total_amount, payment_method, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        order_number,
        subtotal,
        tax_amount || 0,
        shipping_amount || 0,
        discount_amount || 0,
        total_amount,
        payment_method || null,
        notes || null
      ]
    );

    return result.insertId;
  },

  async findById(id) {
    const [orders] = await pool.execute(
      'SELECT * FROM orders WHERE id = ?',
      [id]
    );
    return orders[0] || null;
  },

  async findByOrderNumber(orderNumber) {
    const [orders] = await pool.execute(
      'SELECT * FROM orders WHERE order_number = ?',
      [orderNumber]
    );
    return orders[0] || null;
  },

  async findByUserId(userId, filters = {}) {
    const {
      page = 1,
      limit = 20,
      status = null
    } = filters;

    const offset = (page - 1) * limit;
    const conditions = ['user_id = ?'];
    const params = [userId];

    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }

    const whereClause = conditions.join(' AND ');

    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM orders WHERE ${whereClause}`,
      params
    );
    const total = countResult[0].total;

    const [orders] = await pool.execute(
      `SELECT * FROM orders WHERE ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    return { orders, total };
  },

  async findAll(filters = {}) {
    const {
      page = 1,
      limit = 20,
      status = null,
      payment_status = null
    } = filters;

    const offset = (page - 1) * limit;
    const conditions = [];
    const params = [];

    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }

    if (payment_status) {
      conditions.push('payment_status = ?');
      params.push(payment_status);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM orders ${whereClause}`,
      params
    );
    const total = countResult[0].total;

    const [orders] = await pool.execute(
      `SELECT * FROM orders ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    return { orders, total };
  },

  async addOrderItem(orderItemData) {
    const {
      order_id,
      product_id,
      product_name,
      product_sku,
      quantity,
      unit_price,
      total_price
    } = orderItemData;

    const [result] = await pool.execute(
      `INSERT INTO order_items (order_id, product_id, product_name, product_sku, quantity, unit_price, total_price)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        order_id,
        product_id,
        product_name,
        product_sku || null,
        quantity,
        unit_price,
        total_price
      ]
    );

    return result.insertId;
  },

  async getOrderItems(orderId) {
    const [items] = await pool.execute(
      'SELECT * FROM order_items WHERE order_id = ?',
      [orderId]
    );
    return items;
  },

  async addShippingAddress(addressData) {
    const {
      order_id,
      full_name,
      address_line1,
      address_line2,
      city,
      state,
      postal_code,
      country,
      phone
    } = addressData;

    const [result] = await pool.execute(
      `INSERT INTO order_shipping_addresses (order_id, full_name, address_line1, address_line2, city, state, postal_code, country, phone)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        order_id,
        full_name,
        address_line1,
        address_line2 || null,
        city,
        state,
        postal_code,
        country,
        phone
      ]
    );

    return result.insertId;
  },

  async getShippingAddress(orderId) {
    const [addresses] = await pool.execute(
      'SELECT * FROM order_shipping_addresses WHERE order_id = ?',
      [orderId]
    );
    return addresses[0] || null;
  },

  async updateStatus(orderId, status) {
    const [result] = await pool.execute(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, orderId]
    );
    return result.affectedRows > 0;
  },

  async updatePaymentStatus(orderId, paymentStatus) {
    const [result] = await pool.execute(
      'UPDATE orders SET payment_status = ? WHERE id = ?',
      [paymentStatus, orderId]
    );
    return result.affectedRows > 0;
  },

  async cancelOrder(orderId) {
    const [result] = await pool.execute(
      'UPDATE orders SET status = ?, cancelled_at = NOW() WHERE id = ?',
      ['cancelled', orderId]
    );
    return result.affectedRows > 0;
  },

  async markAsShipped(orderId) {
    const [result] = await pool.execute(
      'UPDATE orders SET status = ?, shipped_at = NOW() WHERE id = ?',
      ['shipped', orderId]
    );
    return result.affectedRows > 0;
  },

  async markAsDelivered(orderId) {
    const [result] = await pool.execute(
      'UPDATE orders SET status = ?, delivered_at = NOW() WHERE id = ?',
      ['delivered', orderId]
    );
    return result.affectedRows > 0;
  },

  async generateOrderNumber() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD-${timestamp}-${random}`;
  }
};

module.exports = OrderModel;
