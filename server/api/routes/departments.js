const express = require('express');
const { body, param } = require('express-validator');
const { authenticate, authorize } = require('../middleware/auth');
const { handleValidation } = require('../middleware/validation');
const { 
  getDepartments, 
  getDepartmentById, 
  createDepartment, 
  updateDepartment, 
  deleteDepartment 
} = require('../controllers/departmentController');

const router = express.Router();

// Validation rules
const validateDepartmentId = [
  param('id').isUUID().withMessage('Valid department ID is required')
];

const validateCreateDepartment = [
  body('name').isLength({ min: 2 }).withMessage('Department name is required'),
  body('code').isLength({ min: 2, max: 10 }).withMessage('Department code is required (2-10 characters)'),
  body('type').isIn(['Technology', 'Engineering', 'Science']).withMessage('Invalid department type'),
  body('head').optional().isString(),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('phone').optional().isMobilePhone(),
  body('established').optional().isInt({ min: 1800, max: new Date().getFullYear() }),
  body('building').optional().isString(),
  body('description').optional().isString()
];

const validateUpdateDepartment = [
  body('name').optional().isLength({ min: 2 }).withMessage('Department name must be at least 2 characters'),
  body('code').optional().isLength({ min: 2, max: 10 }).withMessage('Department code must be 2-10 characters'),
  body('type').optional().isIn(['Technology', 'Engineering', 'Science']).withMessage('Invalid department type'),
  body('status').optional().isIn(['Active', 'Inactive']).withMessage('Invalid status'),
  body('head').optional().isString(),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('phone').optional().isMobilePhone(),
  body('established').optional().isInt({ min: 1800, max: new Date().getFullYear() }),
  body('building').optional().isString(),
  body('description').optional().isString()
];

// Routes
router.get('/', getDepartments);
router.get('/:id', validateDepartmentId, handleValidation, getDepartmentById);
router.post('/', authenticate, authorize('admin'), validateCreateDepartment, handleValidation, createDepartment);
router.put('/:id', authenticate, authorize('admin'), validateDepartmentId, validateUpdateDepartment, handleValidation, updateDepartment);
router.delete('/:id', authenticate, authorize('admin'), validateDepartmentId, handleValidation, deleteDepartment);

module.exports = router;