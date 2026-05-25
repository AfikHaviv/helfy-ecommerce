const { verifyToken } = require('../config/jwt');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { pool } = require('../config/database');

/**
 * Protect routes - verify JWT token
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Get token from cookie
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // Check if token exists
  if (!token) {
    throw ApiError.unauthorized('Not authorized to access this route', 'NO_TOKEN');
  }

  try {
    // Verify token
    const decoded = verifyToken(token);

    // Get user from database
    const [users] = await pool.execute(
      'SELECT id, email, first_name, last_name, role, is_active FROM users WHERE id = ?',
      [decoded.id]
    );

    if (users.length === 0) {
      throw ApiError.unauthorized('User not found', 'USER_NOT_FOUND');
    }

    const user = users[0];

    // Check if user is active
    if (!user.is_active) {
      throw ApiError.forbidden('User account is deactivated', 'ACCOUNT_DEACTIVATED');
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw ApiError.unauthorized('Invalid token', 'INVALID_TOKEN');
    }
    if (error.name === 'TokenExpiredError') {
      throw ApiError.unauthorized('Token expired', 'TOKEN_EXPIRED');
    }
    throw error;
  }
});

/**
 * Authorize specific roles
 * @param {...string} roles - Allowed roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw ApiError.unauthorized('Not authorized to access this route', 'NO_USER');
    }

    if (!roles.includes(req.user.role)) {
      throw ApiError.forbidden(
        `User role '${req.user.role}' is not authorized to access this route`,
        'INSUFFICIENT_PERMISSIONS'
      );
    }

    next();
  };
};

/**
 * Optional auth - attach user if token exists, but don't require it
 */
const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  // Get token from cookie
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // If no token, continue without user
  if (!token) {
    return next();
  }

  try {
    // Verify token
    const decoded = verifyToken(token);

    // Get user from database
    const [users] = await pool.execute(
      'SELECT id, email, first_name, last_name, role, is_active FROM users WHERE id = ?',
      [decoded.id]
    );

    if (users.length > 0 && users[0].is_active) {
      req.user = users[0];
    }
  } catch (error) {
    // Ignore token errors for optional auth
    console.log('Optional auth token error:', error.message);
  }

  next();
});

module.exports = { protect, authorize, optionalAuth };
