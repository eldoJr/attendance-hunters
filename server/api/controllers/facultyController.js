const { success, error, paginated } = require('../utils/response');
const { getClient } = require('../services/database');

const getFaculty = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, departmentId, designation, status } = req.query;
    const prisma = getClient();

    const where = {};
    if (departmentId) where.departmentId = departmentId;
    if (designation) where.designation = designation;
    if (status) where.status = status;

    const [faculty, total] = await Promise.all([
      prisma.faculty.findMany({
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
        orderBy: { createdAt: 'desc' }
      }),
      prisma.faculty.count({ where })
    ]);

    res.json(paginated(faculty, page, limit, total));
  } catch (err) {
    next(err);
  }
};

const getFacultyById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const prisma = getClient();

    const faculty = await prisma.faculty.findUnique({
      where: { id },
      include: {
        user: true,
        department: true,
        classes: {
          include: {
            course: true,
            _count: {
              select: { enrollments: true }
            }
          }
        }
      }
    });

    if (!faculty) {
      return res.status(404).json(error('Faculty not found', 404));
    }

    res.json(success(faculty));
  } catch (err) {
    next(err);
  }
};

const createFaculty = async (req, res, next) => {
  try {
    const prisma = getClient();
    
    const faculty = await prisma.faculty.create({
      data: req.body,
      include: {
        user: true,
        department: true
      }
    });

    res.status(201).json(success(faculty, 'Faculty created successfully'));
  } catch (err) {
    next(err);
  }
};

const updateFaculty = async (req, res, next) => {
  try {
    const { id } = req.params;
    const prisma = getClient();

    const faculty = await prisma.faculty.update({
      where: { id },
      data: req.body,
      include: {
        user: true,
        department: true
      }
    });

    res.json(success(faculty, 'Faculty updated successfully'));
  } catch (err) {
    next(err);
  }
};

const deleteFaculty = async (req, res, next) => {
  try {
    const { id } = req.params;
    const prisma = getClient();

    await prisma.faculty.delete({
      where: { id }
    });

    res.json(success(null, 'Faculty deleted successfully'));
  } catch (err) {
    next(err);
  }
};

const getFacultyClasses = async (req, res, next) => {
  try {
    const { id } = req.params;
    const prisma = getClient();

    const classes = await prisma.class.findMany({
      where: { facultyId: id },
      include: {
        course: true,
        department: true,
        _count: {
          select: { enrollments: true }
        }
      }
    });

    res.json(success(classes));
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getFaculty,
  getFacultyById,
  createFaculty,
  updateFaculty,
  deleteFaculty,
  getFacultyClasses
};