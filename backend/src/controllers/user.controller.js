const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const UserModel = require('../models/user.model');

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
const getProfile = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.user.id);

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  ApiResponse.success(res, { user });
});

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateProfile = asyncHandler(async (req, res) => {
  const { first_name, last_name, phone } = req.body;

  const updated = await UserModel.updateProfile(req.user.id, {
    first_name,
    last_name,
    phone
  });

  if (!updated) {
    throw ApiError.badRequest('No fields to update');
  }

  const user = await UserModel.findById(req.user.id);

  ApiResponse.success(res, { user }, 'Profile updated successfully');
});

/**
 * @desc    Update user password
 * @route   PATCH /api/users/password
 * @access  Private
 */
const updatePassword = asyncHandler(async (req, res) => {
  const { current_password, new_password } = req.body;

  // Get user with password
  const user = await UserModel.findByEmail(req.user.email);

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  // Verify current password
  const isPasswordValid = await UserModel.verifyPassword(current_password, user.password_hash);
  if (!isPasswordValid) {
    throw ApiError.unauthorized('Current password is incorrect', 'INVALID_PASSWORD');
  }

  // Update password
  await UserModel.updatePassword(req.user.id, new_password);

  ApiResponse.success(res, null, 'Password updated successfully');
});

/**
 * @desc    Get user addresses
 * @route   GET /api/users/addresses
 * @access  Private
 */
const getAddresses = asyncHandler(async (req, res) => {
  const addresses = await UserModel.getAddresses(req.user.id);

  ApiResponse.success(res, { addresses });
});

/**
 * @desc    Create user address
 * @route   POST /api/users/addresses
 * @access  Private
 */
const createAddress = asyncHandler(async (req, res) => {
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
  } = req.body;

  const addressId = await UserModel.createAddress(req.user.id, {
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
  });

  const address = await UserModel.getAddressById(addressId, req.user.id);

  ApiResponse.created(res, { address }, 'Address created successfully');
});

/**
 * @desc    Update user address
 * @route   PUT /api/users/addresses/:id
 * @access  Private
 */
const updateAddress = asyncHandler(async (req, res) => {
  const { id } = req.params;
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
  } = req.body;

  // Check if address exists and belongs to user
  const existingAddress = await UserModel.getAddressById(id, req.user.id);
  if (!existingAddress) {
    throw ApiError.notFound('Address not found');
  }

  const updated = await UserModel.updateAddress(id, req.user.id, {
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
  });

  if (!updated) {
    throw ApiError.badRequest('No fields to update');
  }

  const address = await UserModel.getAddressById(id, req.user.id);

  ApiResponse.success(res, { address }, 'Address updated successfully');
});

/**
 * @desc    Delete user address
 * @route   DELETE /api/users/addresses/:id
 * @access  Private
 */
const deleteAddress = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if address exists and belongs to user
  const existingAddress = await UserModel.getAddressById(id, req.user.id);
  if (!existingAddress) {
    throw ApiError.notFound('Address not found');
  }

  const deleted = await UserModel.deleteAddress(id, req.user.id);

  if (!deleted) {
    throw ApiError.internal('Failed to delete address');
  }

  ApiResponse.success(res, null, 'Address deleted successfully');
});

/**
 * @desc    Set address as default
 * @route   PATCH /api/users/addresses/:id/default
 * @access  Private
 */
const setDefaultAddress = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if address exists and belongs to user
  const existingAddress = await UserModel.getAddressById(id, req.user.id);
  if (!existingAddress) {
    throw ApiError.notFound('Address not found');
  }

  const updated = await UserModel.setDefaultAddress(id, req.user.id);

  if (!updated) {
    throw ApiError.internal('Failed to set default address');
  }

  const address = await UserModel.getAddressById(id, req.user.id);

  ApiResponse.success(res, { address }, 'Default address updated successfully');
});

module.exports = {
  getProfile,
  updateProfile,
  updatePassword,
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
};
