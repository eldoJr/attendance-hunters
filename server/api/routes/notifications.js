const express = require('express');
const { body, param, query } = require('express-validator');
const { authenticate, authorize } = require('../middleware/auth');
const { handleValidation } = require('../middleware/validation');
const { 
  getNotifications,
  markAsRead,
  markAllAsRead,
  sendNotification,
  broadcastNotification,
  deleteNotification,
  getUnreadCount
} = require('../controllers/notificationController');

const router = express.Router();

const validateNotificationId = [
  param('id').isInt().withMessage('Valid notification ID is required')
];

const validateSendNotification = [
  body('userId').isUUID().withMessage('Valid user ID is required'),
  body('title').isLength({ min: 1 }).withMessage('Notification title is required'),
  body('message').isLength({ min: 1 }).withMessage('Notification message is required'),
  body('type').optional().isIn(['info', 'success', 'warning', 'error']),
  body('data').optional().isObject()
];

const validateBroadcastNotification = [
  body('title').isLength({ min: 1 }).withMessage('Notification title is required'),
  body('message').isLength({ min: 1 }).withMessage('Notification message is required'),
  body('type').optional().isIn(['info', 'success', 'warning', 'error']),
  body('departmentId').optional().isUUID().withMessage('Valid department ID is required'),
  body('role').optional().isIn(['student', 'staff', 'admin'])
];

const validateNotificationsQuery = [
  query('read').optional().isBoolean().withMessage('Read must be a boolean value')
];

// Routes
router.get('/', authenticate, validateNotificationsQuery, handleValidation, getNotifications);
router.get('/unread-count', authenticate, getUnreadCount);
router.put('/:id/read', authenticate, validateNotificationId, handleValidation, markAsRead);
router.put('/mark-all-read', authenticate, markAllAsRead);
router.post('/send', authenticate, authorize('admin', 'staff'), validateSendNotification, handleValidation, sendNotification);
router.post('/broadcast', authenticate, authorize('admin'), validateBroadcastNotification, handleValidation, broadcastNotification);
router.delete('/:id', authenticate, validateNotificationId, handleValidation, deleteNotification);

module.exports = router;