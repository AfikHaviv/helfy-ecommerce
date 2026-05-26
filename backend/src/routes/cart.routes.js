const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const { protect, optionalAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const cartValidator = require('../validators/cart.validator');
const sessionMiddleware = require('../middleware/session');

router.get('/', sessionMiddleware, optionalAuth, cartController.getCart);
router.post('/items', sessionMiddleware, optionalAuth, validate(cartValidator.addToCart), cartController.addToCart);
router.put('/items/:id', sessionMiddleware, optionalAuth, validate(cartValidator.updateCartItem), cartController.updateCartItem);
router.delete('/items/:id', sessionMiddleware, optionalAuth, cartController.removeFromCart);
router.delete('/', sessionMiddleware, optionalAuth, cartController.clearCart);
router.post('/merge', protect, cartController.mergeCart);

module.exports = router;
