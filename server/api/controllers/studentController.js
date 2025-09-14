const { success, error, paginated } = require('../utils/response');
const { getClient } = require('../services/database');

const getStudents = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, departmentId, year, section, status, search } = req.query;
    const prisma = getClient();

    const where = {};
    if (departmentId) where.departmentId = departmentId;
    if (year) where.year = parseInt(year);
    if (section) where.section = section;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { rollNumber: { contains: search, mode: 'insensitive' } },
        { enrollmentNumber: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } }
      ];
    }

    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where,
        skip: (page - 1) * limit,
        take: parseInt(limit),
        include: {
          user: {
            select: { name: true, email: true, avatar: true }
          },
          department: {
            select: { name: true, code: true }
          }
        },
        orderBy: { rollNumber: 'asc' }
      }),
      prisma.student.count({ where })
    ]);

    res.json(paginated(students, page, limit, total));
  } catch (err) {
    next(err);
  }
};

const getStudentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const prisma = getClient();

    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        user: true,
        department: true,
        enrollments: {
          include: {
            class: {
              include: {
                course: true,
                faculty: {
                  include: {
                    user: { select: { name: true } }
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!student) {
      return res.status(404).json(error('Student not found', 404));
    }

    res.json(success(student));
  } catch (err) {
    next(err);
  }
};

const createStudent = async (req, res, next) => {
  try {
    const prisma = getClient();
    
    const student = await prisma.student.create({
      data: req.body,
      include: {
        user: true,
        department: true
      }
    });

    res.status(201).json(success(student, 'Student created successfully'));
  } catch (err) {
    next(err);
  }
};

const updateStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const prisma = getClient();

    const student = await prisma.student.update({
      where: { id },
      data: req.body,
      include: {
        user: true,
        department: true
      }
    });

    res.json(success(student, 'Student updated successfully'));
  } catch (err) {
    next(err);
  }
};

const deleteStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const prisma = getClient();

    await prisma.student.delete({
      where: { id }
    });

    res.json(success(null, 'Student deleted successfully'));
  } catch (err) {
    next(err);
  }
};

const getStudentClasses = async (req, res, next) => {
  try {
    const { id } = req.params;
    const prisma = getClient();

    const enrollments = await prisma.studentEnrollment.findMany({
      where: { studentId: id },
      include: {
        class: {
          include: {
            course: true,
            faculty: {
              include: {
                user: { select: { name: true } }
              }
            },
            schedules: true
          }
        }
      }
    });

    res.json(success(enrollments));
  } catch (err) {
    next(err);
  }
};

const getStudentAttendance = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { classId, startDate, endDate } = req.query;
    const prisma = getClient();

    const where = { studentId: id };
    if (classId) where.classId = classId;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    const attendance = await prisma.attendanceRecord.findMany({
      where,
      include: {
        class: {
          include: {
            course: { select: { name: true, code: true } }
          }
        },
        session: true
      },
      orderBy: { date: 'desc' }
    });

    res.json(success(attendance));
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentClasses,
  getStudentAttendance
};