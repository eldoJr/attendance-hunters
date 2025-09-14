const jwt = require('jsonwebtoken');
const { error } = require('../utils/response');

const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json(error('Access denied. No token provided.', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    req.user = decoded;
    next();
  } catch (err) {
    next(err);
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json(error('Access denied. Please authenticate.', 401));
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json(error('Access denied. Insufficient permissions.', 403));
    }

    next();
  };
};

module.exports = { authenticate, authorize };