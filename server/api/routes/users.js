const express = require('express');
const { body, param, query } = require('express-validator');
const { authenticate, authorize } = require('../middleware/auth');
const { handleValidation } = require('../middleware/validation');
const { getUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');

const router = express.Router();

// Validation rules
const validateUserId = [
  param('id').isUUID().withMessage('Valid user ID is required')
];

const validateUpdateUser = [
  body('name').optional().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('avatar').optional().isURL().withMessage('Avatar must be a valid URL')
];

const validateQuery = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('role').optional().isIn(['student', 'staff', 'admin']).withMessage('Invalid role')
];

// Routes
router.get('/', authenticate, authorize('admin'), validateQuery, handleValidation, getUsers);
router.get('/:id', authenticate, validateUserId, handleValidation, getUserById);
router.put('/:id', authenticate, validateUserId, validateUpdateUser, handleValidation, updateUser);
router.delete('/:id', authenticate, authorize('admin'), validateUserId, handleValidation, deleteUser);

module.exports = router;