const { success, error, paginated } = require('../utils/response');
const { getClient } = require('../services/database');

const getDepartments = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, type, status } = req.query;
    const prisma = getClient();

    const where = {};
    if (type) where.type = type;
    if (status) where.status = status;

    const [departments, total] = await Promise.all([
      prisma.department.findMany({
        where,
        skip: (page - 1) * limit,
        take: parseInt(limit),
        orderBy: { name: 'asc' }
      }),
      prisma.department.count({ where })
    ]);

    res.json(paginated(departments, page, limit, total));
  } catch (err) {
    next(err);
  }
};

const getDepartmentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const prisma = getClient();

    const department = await prisma.department.findUnique({
      where: { id },
      include: {
        faculty: {
          select: {
            id: true,
            employeeId: true,
            user: {
              select: { name: true, email: true }
            },
            designation: true
          }
        },
        students: {
          select: {
            id: true,
            rollNumber: true,
            user: {
              select: { name: true, email: true }
            },
            year: true,
            section: true
          }
        },
        courses: {
          select: {
            id: true,
            name: true,
            code: true,
            credits: true
          }
        }
      }
    });

    if (!department) {
      return res.status(404).json(error('Department not found', 404));
    }

    res.json(success(department));
  } catch (err) {
    next(err);
  }
};

const createDepartment = async (req, res, next) => {
  try {
    const prisma = getClient();
    
    const department = await prisma.department.create({
      data: req.body
    });

    res.status(201).json(success(department, 'Department created successfully'));
  } catch (err) {
    next(err);
  }
};

const updateDepartment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const prisma = getClient();

    const department = await prisma.department.update({
      where: { id },
      data: req.body
    });

    res.json(success(department, 'Department updated successfully'));
  } catch (err) {
    next(err);
  }
};

const deleteDepartment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const prisma = getClient();

    await prisma.department.delete({
      where: { id }
    });

    res.json(success(null, 'Department deleted successfully'));
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment
};