const express = require('express');
const { body } = require('express-validator');
const { authenticate } = require('../middleware/auth');
const { handleValidation } = require('../middleware/validation');
const { login, me } = require('../controllers/authController');

const router = express.Router();

// Validation middleware
const validateLogin = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 1 }).withMessage('Password is required'),
  body('role').optional().isIn(['admin', 'staff', 'student']).withMessage('Invalid role')
];

// Routes
router.post('/login', validateLogin, handleValidation, login);
router.get('/me', authenticate, me);

module.exports = router;