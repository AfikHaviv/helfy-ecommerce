const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { protect, authorize } = require('../middleware/auth');

// Admin order management routes
router.get('/orders', protect, authorize('admin'), orderController.getAllOrders);
router.patch('/orders/:id/status', protect, authorize('admin'), orderController.updateOrderStatus);

module.exports = router;
