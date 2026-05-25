const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const userValidator = require('../validators/user.validator');

router.get('/profile', protect, userController.getProfile);
router.put('/profile', protect, validate(userValidator.updateProfile), userController.updateProfile);
router.patch('/password', protect, validate(userValidator.updatePassword), userController.updatePassword);
router.get('/addresses', protect, userController.getAddresses);
router.post('/addresses', protect, validate(userValidator.createAddress), userController.createAddress);
router.put('/addresses/:id', protect, validate(userValidator.updateAddress), userController.updateAddress);
router.delete('/addresses/:id', protect, userController.deleteAddress);
router.patch('/addresses/:id/default', protect, userController.setDefaultAddress);

module.exports = router;
