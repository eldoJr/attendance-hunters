const { success, error, paginated } = require('../utils/response');
const { getClient } = require('../services/database');

const getCourses = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, departmentId, level, category, status } = req.query;
    const prisma = getClient();

    const where = {};
    if (departmentId) where.departmentId = departmentId;
    if (level) where.level = level;
    if (category) where.category = category;
    if (status) where.status = status;

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        skip: (page - 1) * limit,
        take: parseInt(limit),
        include: {
          department: {
            select: { name: true, code: true }
          },
          _count: {
            select: { classes: true }
          }
        },
        orderBy: { code: 'asc' }
      }),
      prisma.course.count({ where })
    ]);

    res.json(paginated(courses, page, limit, total));
  } catch (err) {
    next(err);
  }
};

const getCourseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const prisma = getClient();

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        department: true,
        classes: {
          include: {
            faculty: {
              include: {
                user: { select: { name: true } }
              }
            },
            _count: {
              select: { enrollments: true }
            }
          }
        }
      }
    });

    if (!course) {
      return res.status(404).json(error('Course not found', 404));
    }

    res.json(success(course));
  } catch (err) {
    next(err);
  }
};

const createCourse = async (req, res, next) => {
  try {
    const prisma = getClient();
    
    const course = await prisma.course.create({
      data: req.body,
      include: {
        department: true
      }
    });

    res.status(201).json(success(course, 'Course created successfully'));
  } catch (err) {
    next(err);
  }
};

const updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const prisma = getClient();

    const course = await prisma.course.update({
      where: { id },
      data: req.body,
      include: {
        department: true
      }
    });

    res.json(success(course, 'Course updated successfully'));
  } catch (err) {
    next(err);
  }
};

const deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const prisma = getClient();

    await prisma.course.delete({
      where: { id }
    });

    res.json(success(null, 'Course deleted successfully'));
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
};