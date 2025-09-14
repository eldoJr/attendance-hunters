const express = require('express');
const { body, query } = require('express-validator');
const { authenticate, authorize } = require('../middleware/auth');
const { handleValidation } = require('../middleware/validation');
const { 
  getSettings,
  updateSettings,
  resetSettings,
  exportSettings,
  importSettings,
  getSystemInfo
} = require('../controllers/settingsController');

const router = express.Router();

const validateSettingsQuery = [
  query('category').optional().isIn(['general', 'attendance', 'notifications', 'security', 'reports', 'academic'])
];

const validateUpdateSettings = [
  body().isObject().withMessage('Settings must be an object')
];

const validateResetSettings = [
  body('category').optional().isIn(['general', 'attendance', 'notifications', 'security', 'reports', 'academic'])
];

const validateImportSettings = [
  body('settings').isObject().withMessage('Settings object is required')
];

// Routes
router.get('/', authenticate, authorize('admin'), validateSettingsQuery, handleValidation, getSettings);
router.put('/', authenticate, authorize('admin'), validateUpdateSettings, handleValidation, updateSettings);
router.post('/reset', authenticate, authorize('admin'), validateResetSettings, handleValidation, resetSettings);
router.get('/export', authenticate, authorize('admin'), exportSettings);
router.post('/import', authenticate, authorize('admin'), validateImportSettings, handleValidation, importSettings);
router.get('/system-info', authenticate, authorize('admin'), getSystemInfo);

module.exports = router;