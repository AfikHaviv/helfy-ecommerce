const { pool } = require('../config/database');
const bcrypt = require('bcrypt');

const UserModel = {
  /**
   * Create a new user
   */
  async create(userData) {
    const { email, password, first_name, last_name, phone, role = 'customer' } = userData;
    
    // Hash password
    const password_hash = await bcrypt.hash(password, 10);
    
    const [result] = await pool.execute(
      `INSERT INTO users (email, password_hash, first_name, last_name, phone, role) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [email, password_hash, first_name, last_name, phone || null, role]
    );
    
    return result.insertId;
  },

  /**
   * Find user by ID
   */
  async findById(id) {
    const [users] = await pool.execute(
      'SELECT id, email, first_name, last_name, phone, role, is_active, created_at, updated_at FROM users WHERE id = ?',
      [id]
    );
    
    return users[0] || null;
  },

  /**
   * Find user by email
   */
  async findByEmail(email) {
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    return users[0] || null;
  },

  /**
   * Update user profile
   */
  async updateProfile(id, updates) {
    const fields = [];
    const values = [];
    
    if (updates.first_name !== undefined) {
      fields.push('first_name = ?');
      values.push(updates.first_name);
    }
    if (updates.last_name !== undefined) {
      fields.push('last_name = ?');
      values.push(updates.last_name);
    }
    if (updates.phone !== undefined) {
      fields.push('phone = ?');
      values.push(updates.phone || null);
    }
    
    if (fields.length === 0) {
      return false;
    }
    
    values.push(id);
    
    const [result] = await pool.execute(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    
    return result.affectedRows > 0;
  },

  /**
   * Update user password
   */
  async updatePassword(id, newPassword) {
    const password_hash = await bcrypt.hash(newPassword, 10);
    
    const [result] = await pool.execute(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [password_hash, id]
    );
    
    return result.affectedRows > 0;
  },

  /**
   * Verify password
   */
  async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  },

  /**
   * Get user addresses
   */
  async getAddresses(userId) {
    const [addresses] = await pool.execute(
      'SELECT * FROM user_addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC',
      [userId]
    );
    
    return addresses;
  },

  /**
   * Get address by ID
   */
  async getAddressById(addressId, userId) {
    const [addresses] = await pool.execute(
      'SELECT * FROM user_addresses WHERE id = ? AND user_id = ?',
      [addressId, userId]
    );
    
    return addresses[0] || null;
  },

  /**
   * Create user address
   */
  async createAddress(userId, addressData) {
    const {
      address_type,
      is_default,
      full_name,
      address_line1,
      address_line2,
      city,
      state,
      postal_code,
      country,
      phone
    } = addressData;
    
    // If this is set as default, unset other defaults
    if (is_default) {
      await pool.execute(
        'UPDATE user_addresses SET is_default = FALSE WHERE user_id = ?',
        [userId]
      );
    }
    
    const [result] = await pool.execute(
      `INSERT INTO user_addresses 
       (user_id, address_type, is_default, full_name, address_line1, address_line2, 
        city, state, postal_code, country, phone) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        address_type || 'shipping',
        is_default || false,
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

  /**
   * Update user address
   */
  async updateAddress(addressId, userId, updates) {
    const fields = [];
    const values = [];
    
    // If setting as default, unset other defaults first
    if (updates.is_default) {
      await pool.execute(
        'UPDATE user_addresses SET is_default = FALSE WHERE user_id = ?',
        [userId]
      );
    }
    
    const allowedFields = [
      'address_type', 'is_default', 'full_name', 'address_line1', 'address_line2',
      'city', 'state', 'postal_code', 'country', 'phone'
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
    
    values.push(addressId, userId);
    
    const [result] = await pool.execute(
      `UPDATE user_addresses SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`,
      values
    );
    
    return result.affectedRows > 0;
  },

  /**
   * Delete user address
   */
  async deleteAddress(addressId, userId) {
    const [result] = await pool.execute(
      'DELETE FROM user_addresses WHERE id = ? AND user_id = ?',
      [addressId, userId]
    );
    
    return result.affectedRows > 0;
  },

  /**
   * Set address as default
   */
  async setDefaultAddress(addressId, userId) {
    // Unset all defaults for this user
    await pool.execute(
      'UPDATE user_addresses SET is_default = FALSE WHERE user_id = ?',
      [userId]
    );
    
    // Set the specified address as default
    const [result] = await pool.execute(
      'UPDATE user_addresses SET is_default = TRUE WHERE id = ? AND user_id = ?',
      [addressId, userId]
    );
    
    return result.affectedRows > 0;
  }
};

module.exports = UserModel;
