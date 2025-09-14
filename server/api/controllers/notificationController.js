const { success, error, paginated } = require('../utils/response');
const { getClient } = require('../services/database');

// Mock notification system (in real app, would use database table)
let notifications = [];
let notificationId = 1;

const getNotifications = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, read } = req.query;
    const userId = req.user.id;

    let userNotifications = notifications.filter(n => n.userId === userId);
    
    if (read !== undefined) {
      userNotifications = userNotifications.filter(n => n.read === (read === 'true'));
    }

    const total = userNotifications.length;
    const startIndex = (page - 1) * limit;
    const paginatedNotifications = userNotifications
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(startIndex, startIndex + parseInt(limit));

    res.json(paginated(paginatedNotifications, page, limit, total));
  } catch (err) {
    next(err);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = notifications.find(n => n.id === parseInt(id) && n.userId === userId);
    
    if (!notification) {
      return res.status(404).json(error('Notification not found', 404));
    }

    notification.read = true;
    notification.readAt = new Date();

    res.json(success(notification, 'Notification marked as read'));
  } catch (err) {
    next(err);
  }
};

const markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id;

    notifications.forEach(n => {
      if (n.userId === userId && !n.read) {
        n.read = true;
        n.readAt = new Date();
      }
    });

    res.json(success(null, 'All notifications marked as read'));
  } catch (err) {
    next(err);
  }
};

const sendNotification = async (req, res, next) => {
  try {
    const { userId, title, message, type = 'info', data = {} } = req.body;

    const notification = {
      id: notificationId++,
      userId,
      title,
      message,
      type,
      data,
      read: false,
      createdAt: new Date(),
      readAt: null
    };

    notifications.push(notification);

    res.status(201).json(success(notification, 'Notification sent successfully'));
  } catch (err) {
    next(err);
  }
};

const broadcastNotification = async (req, res, next) => {
  try {
    const { title, message, type = 'info', departmentId, role } = req.body;
    const prisma = getClient();

    // Get target users
    let users = [];
    if (departmentId) {
      if (role === 'student') {
        users = await prisma.student.findMany({
          where: { departmentId },
          include: { user: { select: { id: true } } }
        });
        users = users.map(s => s.user);
      } else if (role === 'staff') {
        users = await prisma.faculty.findMany({
          where: { departmentId },
          include: { user: { select: { id: true } } }
        });
        users = users.map(f => f.user);
      }
    } else {
      users = await prisma.user.findMany({
        where: role ? { role } : {},
        select: { id: true }
      });
    }

    // Create notifications for all users
    const newNotifications = users.map(user => ({
      id: notificationId++,
      userId: user.id,
      title,
      message,
      type,
      data: { broadcast: true, departmentId, role },
      read: false,
      createdAt: new Date(),
      readAt: null
    }));

    notifications.push(...newNotifications);

    res.status(201).json(success({
      count: newNotifications.length,
      notifications: newNotifications.slice(0, 5) // Return first 5 as sample
    }, `Notification sent to ${newNotifications.length} users`));
  } catch (err) {
    next(err);
  }
};

const deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const index = notifications.findIndex(n => n.id === parseInt(id) && n.userId === userId);
    
    if (index === -1) {
      return res.status(404).json(error('Notification not found', 404));
    }

    notifications.splice(index, 1);

    res.json(success(null, 'Notification deleted successfully'));
  } catch (err) {
    next(err);
  }
};

const getUnreadCount = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const unreadCount = notifications.filter(n => n.userId === userId && !n.read).length;

    res.json(success({ unreadCount }));
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  sendNotification,
  broadcastNotification,
  deleteNotification,
  getUnreadCount
};