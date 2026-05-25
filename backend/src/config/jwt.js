const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';
const JWT_COOKIE_EXPIRE = parseInt(process.env.JWT_COOKIE_EXPIRE) || 7;

/**
 * Generate JWT token
 * @param {number} userId - User ID
 * @returns {string} JWT token
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE
  });
};

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @returns {object} Decoded token payload
 */
const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

/**
 * Get cookie options for JWT
 * @returns {object} Cookie options
 */
const getCookieOptions = () => {
  return {
    expires: new Date(Date.now() + JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };
};

module.exports = {
  generateToken,
  verifyToken,
  getCookieOptions,
  JWT_SECRET,
  JWT_EXPIRE,
  JWT_COOKIE_EXPIRE
};
