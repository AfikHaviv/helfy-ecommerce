const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const productValidator = require('../validators/product.validator');

router.get('/', productController.getAllProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/:id', productController.getProductById);
router.get('/slug/:slug', productController.getProductBySlug);
router.post('/', protect, authorize('admin'), validate(productValidator.createProduct), productController.createProduct);
router.put('/:id', protect, authorize('admin'), validate(productValidator.updateProduct), productController.updateProduct);
router.delete('/:id', protect, authorize('admin'), productController.deleteProduct);

module.exports = router;
