const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const UserModel = require('../models/user.model');
const { generateToken, getCookieOptions } = require('../config/jwt');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/signup
 * @access  Public
 */
const signup = asyncHandler(async (req, res) => {
  const { email, password, first_name, last_name, phone } = req.body;

  // Check if user already exists
  const existingUser = await UserModel.findByEmail(email);
  if (existingUser) {
    throw ApiError.conflict('User with this email already exists', 'EMAIL_EXISTS');
  }

  // Create user
  const userId = await UserModel.create({
    email,
    password,
    first_name,
    last_name,
    phone
  });

  // Get created user
  const user = await UserModel.findById(userId);

  // Generate token
  const token = generateToken(userId);

  // Set cookie
  res.cookie('token', token, getCookieOptions());

  ApiResponse.created(res, { user, token }, 'User registered successfully');
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await UserModel.findByEmail(email);
  if (!user) {
    throw ApiError.unauthorized('Invalid email or password', 'INVALID_CREDENTIALS');
  }

  // Check if user is active
  if (!user.is_active) {
    throw ApiError.forbidden('Your account has been deactivated', 'ACCOUNT_DEACTIVATED');
  }

  // Verify password
  const isPasswordValid = await UserModel.verifyPassword(password, user.password_hash);
  if (!isPasswordValid) {
    throw ApiError.unauthorized('Invalid email or password', 'INVALID_CREDENTIALS');
  }

  // Remove password from response
  delete user.password_hash;

  // Generate token
  const token = generateToken(user.id);

  // Set cookie
  res.cookie('token', token, getCookieOptions());

  ApiResponse.success(res, { user, token }, 'Login successful');
});

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = asyncHandler(async (req, res) => {
  // Clear cookie
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0)
  });

  ApiResponse.success(res, null, 'Logout successful');
});

/**
 * @desc    Get current user
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.user.id);

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  ApiResponse.success(res, { user });
});

/**
 * @desc    Refresh token
 * @route   POST /api/auth/refresh-token
 * @access  Public
 */
const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    throw ApiError.unauthorized('No token provided', 'NO_TOKEN');
  }

  // Verify token
  const { verifyToken } = require('../config/jwt');
  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (error) {
    throw ApiError.unauthorized('Invalid or expired token', 'INVALID_TOKEN');
  }

  // Get user
  const user = await UserModel.findById(decoded.id);
  if (!user) {
    throw ApiError.notFound('User not found');
  }

  if (!user.is_active) {
    throw ApiError.forbidden('Account deactivated', 'ACCOUNT_DEACTIVATED');
  }

  // Generate new token
  const newToken = generateToken(user.id);

  // Set new cookie
  res.cookie('token', newToken, getCookieOptions());

  delete user.password_hash;

  ApiResponse.success(res, { user, token: newToken }, 'Token refreshed successfully');
});

/**
 * @desc    Forgot password
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await UserModel.findByEmail(email);
  if (!user) {
    // Don't reveal if email exists
    ApiResponse.success(res, null, 'If the email exists, a password reset link has been sent');
    return;
  }

  // TODO: Implement password reset token generation and email sending
  // For now, just return success message
  ApiResponse.success(res, null, 'If the email exists, a password reset link has been sent');
});

/**
 * @desc    Reset password
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  // TODO: Implement password reset token verification
  // For now, just return error
  throw ApiError.badRequest('Password reset functionality not yet implemented', 'NOT_IMPLEMENTED');
});

module.exports = {
  signup,
  login,
  logout,
  getMe,
  refreshToken,
  forgotPassword,
  resetPassword
};
