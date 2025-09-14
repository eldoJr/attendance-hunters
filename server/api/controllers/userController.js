const { success, error, paginated } = require('../utils/response');
const { getClient } = require('../services/database');

const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    const prisma = getClient();

    const where = {};
    if (role) where.role = role;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: parseInt(limit),
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          avatar: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count({ where })
    ]);

    res.json(paginated(users, page, limit, total));
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const prisma = getClient();

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        student: {
          include: {
            department: true
          }
        },
        faculty: {
          include: {
            department: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json(error('User not found', 404));
    }

    res.json(success(user));
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, avatar } = req.body;
    const prisma = getClient();

    const user = await prisma.user.update({
      where: { id },
      data: { name, email, avatar },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        updatedAt: true
      }
    });

    res.json(success(user, 'User updated successfully'));
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const prisma = getClient();

    await prisma.user.delete({
      where: { id }
    });

    res.json(success(null, 'User deleted successfully'));
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser
};