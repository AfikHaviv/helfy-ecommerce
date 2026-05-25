const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { protect, authorize } = require('../middleware/auth');

router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.get('/:id/products', categoryController.getCategoryProducts);
router.post('/', protect, authorize('admin'), categoryController.createCategory);
router.put('/:id', protect, authorize('admin'), categoryController.updateCategory);
router.delete('/:id', protect, authorize('admin'), categoryController.deleteCategory);

module.exports = router;
