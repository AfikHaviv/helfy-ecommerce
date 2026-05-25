const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { protect, restrictTo } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const productValidator = require('../validators/product.validator');

router.get('/', productController.getAllProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/:id', productController.getProductById);
router.get('/slug/:slug', productController.getProductBySlug);
router.post('/', protect, restrictTo('admin'), validate(productValidator.createProduct), productController.createProduct);
router.put('/:id', protect, restrictTo('admin'), validate(productValidator.updateProduct), productController.updateProduct);
router.delete('/:id', protect, restrictTo('admin'), productController.deleteProduct);

module.exports = router;
