const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { success, error } = require('../utils/response');
const { getClient } = require('../services/database');

const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role 
    },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

const login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    const prisma = getClient();

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        student: true,
        faculty: true
      }
    });

    if (!user) {
      return res.status(401).json(error('Invalid credentials', 401));
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json(error('Invalid credentials', 401));
    }

    // Check role if provided
    if (role && user.role !== role) {
      return res.status(401).json(error('Invalid credentials', 401));
    }
    
    // Generate token
    const token = generateToken(user);

    res.json(success({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar
      }
    }, 'Login successful'));

  } catch (err) {
    next(err);
  }
};

const me = async (req, res, next) => {
  try {
    const prisma = getClient();
    
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        student: true,
        faculty: true
      }
    });

    if (!user) {
      return res.status(404).json(error('User not found', 404));
    }

    res.json(success({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
      profile: user.student || user.faculty || null
    }));

  } catch (err) {
    next(err);
  }
};

module.exports = { login, me };