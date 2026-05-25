const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const cartValidator = require('../validators/cart.validator');

router.get('/', cartController.getCart);
router.post('/items', validate(cartValidator.addToCart), cartController.addToCart);
router.put('/items/:id', validate(cartValidator.updateCartItem), cartController.updateCartItem);
router.delete('/items/:id', cartController.removeFromCart);
router.delete('/', cartController.clearCart);
router.post('/merge', protect, cartController.mergeCart);

module.exports = router;
