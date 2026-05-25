const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const orderValidator = require('../validators/order.validator');

router.get('/', protect, orderController.getUserOrders);
router.get('/:id', protect, orderController.getOrderById);
router.post('/', protect, validate(orderValidator.createOrder), orderController.createOrder);
router.patch('/:id/cancel', protect, orderController.cancelOrder);
router.get('/:id/invoice', protect, orderController.getOrderInvoice);

module.exports = router;
