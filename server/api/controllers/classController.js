const { success, error, paginated } = require('../utils/response');
const { getClient } = require('../services/database');

const getClasses = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, facultyId, departmentId, semester, status } = req.query;
    const prisma = getClient();

    const where = {};
    if (facultyId) where.facultyId = facultyId;
    if (departmentId) where.departmentId = departmentId;
    if (semester) where.semester = semester;
    if (status) where.status = status;

    const [classes, total] = await Promise.all([
      prisma.class.findMany({
        where,
        skip: (page - 1) * limit,
        take: parseInt(limit),
        include: {
          course: { select: { name: true, code: true, credits: true } },
          faculty: {
            include: { user: { select: { name: true } } }
          },
          department: { select: { name: true, code: true } },
          _count: { select: { enrollments: true } }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.class.count({ where })
    ]);

    res.json(paginated(classes, page, limit, total));
  } catch (err) {
    next(err);
  }
};

const getClassById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const prisma = getClient();

    const classData = await prisma.class.findUnique({
      where: { id },
      include: {
        course: true,
        faculty: {
          include: { user: true }
        },
        department: true,
        schedules: true,
        enrollments: {
          include: {
            student: {
              include: {
                user: { select: { name: true, email: true } }
              }
            }
          }
        },
        attendanceSessions: {
          orderBy: { date: 'desc' },
          take: 5
        }
      }
    });

    if (!classData) {
      return res.status(404).json(error('Class not found', 404));
    }

    res.json(success(classData));
  } catch (err) {
    next(err);
  }
};

const createClass = async (req, res, next) => {
  try {
    const prisma = getClient();
    const { schedules, ...classData } = req.body;
    
    const newClass = await prisma.class.create({
      data: {
        ...classData,
        schedules: schedules ? {
          create: schedules
        } : undefined
      },
      include: {
        course: true,
        faculty: { include: { user: true } },
        department: true,
        schedules: true
      }
    });

    res.status(201).json(success(newClass, 'Class created successfully'));
  } catch (err) {
    next(err);
  }
};

const updateClass = async (req, res, next) => {
  try {
    const { id } = req.params;
    const prisma = getClient();

    const updatedClass = await prisma.class.update({
      where: { id },
      data: req.body,
      include: {
        course: true,
        faculty: { include: { user: true } },
        department: true,
        schedules: true
      }
    });

    res.json(success(updatedClass, 'Class updated successfully'));
  } catch (err) {
    next(err);
  }
};

const deleteClass = async (req, res, next) => {
  try {
    const { id } = req.params;
    const prisma = getClient();

    await prisma.class.delete({
      where: { id }
    });

    res.json(success(null, 'Class deleted successfully'));
  } catch (err) {
    next(err);
  }
};

const enrollStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { studentId } = req.body;
    const prisma = getClient();

    const enrollment = await prisma.studentEnrollment.create({
      data: {
        studentId,
        classId: id,
        enrollmentDate: new Date()
      },
      include: {
        student: {
          include: { user: { select: { name: true } } }
        },
        class: {
          include: { course: { select: { name: true } } }
        }
      }
    });

    // Update class enrollment count
    await prisma.class.update({
      where: { id },
      data: {
        currentEnrollment: {
          increment: 1
        }
      }
    });

    res.status(201).json(success(enrollment, 'Student enrolled successfully'));
  } catch (err) {
    next(err);
  }
};

const removeStudent = async (req, res, next) => {
  try {
    const { id, studentId } = req.params;
    const prisma = getClient();

    await prisma.studentEnrollment.delete({
      where: {
        unique_enrollment: {
          studentId,
          classId: id
        }
      }
    });

    // Update class enrollment count
    await prisma.class.update({
      where: { id },
      data: {
        currentEnrollment: {
          decrement: 1
        }
      }
    });

    res.json(success(null, 'Student removed successfully'));
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
  enrollStudent,
  removeStudent
};