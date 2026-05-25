const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const OrderModel = require('../models/order.model');
const ProductModel = require('../models/product.model');
const CartModel = require('../models/cart.model');
const { pool } = require('../config/database');

const getUserOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;

  const filters = {
    page: parseInt(page),
    limit: parseInt(limit),
    status
  };

  const { orders, total } = await OrderModel.findByUserId(req.user.id, filters);

  const pagination = {
    page: filters.page,
    limit: filters.limit,
    total,
    totalPages: Math.ceil(total / filters.limit)
  };

  ApiResponse.paginated(res, orders, pagination);
});

const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = await OrderModel.findById(id);

  if (!order) {
    throw ApiError.notFound('Order not found');
  }

  if (order.user_id !== req.user.id && req.user.role !== 'admin') {
    throw ApiError.forbidden('Access denied');
  }

  const items = await OrderModel.getOrderItems(id);
  const shippingAddress = await OrderModel.getShippingAddress(id);

  order.items = items;
  order.shipping_address = shippingAddress;

  ApiResponse.success(res, { order });
});

const createOrder = asyncHandler(async (req, res) => {
  const {
    shipping_address,
    payment_method,
    notes
  } = req.body;

  const cart = await CartModel.findByUserId(req.user.id);

  if (!cart) {
    throw ApiError.badRequest('Cart is empty');
  }

  const cartItems = await CartModel.getCartItems(cart.id);

  if (cartItems.length === 0) {
    throw ApiError.badRequest('Cart is empty');
  }

  for (const item of cartItems) {
    const product = await ProductModel.findById(item.product_id);
    
    if (!product || !product.is_active) {
      throw ApiError.badRequest(`Product ${item.name} is not available`);
    }

    if (product.stock_quantity < item.quantity) {
      throw ApiError.badRequest(`Insufficient stock for ${item.name}`);
    }
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax_amount = subtotal * 0.1;
  const shipping_amount = 10.00;
  const total_amount = subtotal + tax_amount + shipping_amount;

  const order_number = await OrderModel.generateOrderNumber();

  const orderId = await OrderModel.create({
    user_id: req.user.id,
    order_number,
    subtotal,
    tax_amount,
    shipping_amount,
    discount_amount: 0,
    total_amount,
    payment_method,
    notes
  });

  for (const item of cartItems) {
    await OrderModel.addOrderItem({
      order_id: orderId,
      product_id: item.product_id,
      product_name: item.name,
      product_sku: item.sku,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity
    });

    await ProductModel.updateStock(item.product_id, -item.quantity);
  }

  await OrderModel.addShippingAddress({
    order_id: orderId,
    ...shipping_address
  });

  await CartModel.clearCart(cart.id);

  const order = await OrderModel.findById(orderId);
  const items = await OrderModel.getOrderItems(orderId);
  const shippingAddr = await OrderModel.getShippingAddress(orderId);

  order.items = items;
  order.shipping_address = shippingAddr;

  ApiResponse.created(res, { order }, 'Order created successfully');
});

const cancelOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = await OrderModel.findById(id);

  if (!order) {
    throw ApiError.notFound('Order not found');
  }

  if (order.user_id !== req.user.id) {
    throw ApiError.forbidden('Access denied');
  }

  if (order.status !== 'pending' && order.status !== 'processing') {
    throw ApiError.badRequest('Order cannot be cancelled');
  }

  const items = await OrderModel.getOrderItems(id);

  for (const item of items) {
    await ProductModel.updateStock(item.product_id, item.quantity);
  }

  await OrderModel.cancelOrder(id);

  const updatedOrder = await OrderModel.findById(id);

  ApiResponse.success(res, { order: updatedOrder }, 'Order cancelled successfully');
});

const getOrderInvoice = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = await OrderModel.findById(id);

  if (!order) {
    throw ApiError.notFound('Order not found');
  }

  if (order.user_id !== req.user.id && req.user.role !== 'admin') {
    throw ApiError.forbidden('Access denied');
  }

  const items = await OrderModel.getOrderItems(id);
  const shippingAddress = await OrderModel.getShippingAddress(id);

  order.items = items;
  order.shipping_address = shippingAddress;

  ApiResponse.success(res, { order });
});

const getAllOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, payment_status } = req.query;

  const filters = {
    page: parseInt(page),
    limit: parseInt(limit),
    status,
    payment_status
  };

  const { orders, total } = await OrderModel.findAll(filters);

  const pagination = {
    page: filters.page,
    limit: filters.limit,
    total,
    totalPages: Math.ceil(total / filters.limit)
  };

  ApiResponse.paginated(res, orders, pagination);
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const order = await OrderModel.findById(id);

  if (!order) {
    throw ApiError.notFound('Order not found');
  }

  if (status === 'shipped') {
    await OrderModel.markAsShipped(id);
  } else if (status === 'delivered') {
    await OrderModel.markAsDelivered(id);
  } else {
    await OrderModel.updateStatus(id, status);
  }

  const updatedOrder = await OrderModel.findById(id);

  ApiResponse.success(res, { order: updatedOrder }, 'Order status updated successfully');
});

module.exports = {
  getUserOrders,
  getOrderById,
  createOrder,
  cancelOrder,
  getOrderInvoice,
  getAllOrders,
  updateOrderStatus
};
