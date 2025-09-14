const { success, error, paginated } = require('../utils/response');
const { getClient } = require('../services/database');
const { v4: uuidv4 } = require('uuid');

const createSession = async (req, res, next) => {
  try {
    const { classId, date, startTime, endTime } = req.body;
    const prisma = getClient();

    // Get enrolled students count
    const enrollmentCount = await prisma.studentEnrollment.count({
      where: { classId, status: 'enrolled' }
    });

    const session = await prisma.attendanceSession.create({
      data: {
        id: uuidv4(),
        classId,
        facultyId: req.user.id,
        date: new Date(date),
        startTime: new Date(`1970-01-01T${startTime}`),
        endTime: new Date(`1970-01-01T${endTime}`),
        totalStudents: enrollmentCount,
        status: 'active'
      },
      include: {
        class: {
          include: {
            course: { select: { name: true, code: true } }
          }
        }
      }
    });

    res.status(201).json(success(session, 'Attendance session created successfully'));
  } catch (err) {
    next(err);
  }
};

const getSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    const prisma = getClient();

    const session = await prisma.attendanceSession.findUnique({
      where: { id },
      include: {
        class: {
          include: {
            course: true,
            enrollments: {
              include: {
                student: {
                  include: {
                    user: { select: { name: true } }
                  }
                }
              }
            }
          }
        },
        attendanceRecords: {
          include: {
            student: {
              include: {
                user: { select: { name: true } }
              }
            }
          }
        }
      }
    });

    if (!session) {
      return res.status(404).json(error('Session not found', 404));
    }

    res.json(success(session));
  } catch (err) {
    next(err);
  }
};

const markAttendance = async (req, res, next) => {
  try {
    const { studentId, classId, sessionId, status, method = 'manual', notes } = req.body;
    const prisma = getClient();

    const record = await prisma.attendanceRecord.create({
      data: {
        id: uuidv4(),
        studentId,
        classId,
        facultyId: req.user.id,
        sessionId,
        date: new Date(),
        status,
        checkInTime: status === 'present' || status === 'late' ? new Date() : null,
        method,
        notes
      },
      include: {
        student: {
          include: {
            user: { select: { name: true } }
          }
        },
        class: {
          include: {
            course: { select: { name: true } }
          }
        }
      }
    });

    // Update session counts
    await updateSessionCounts(sessionId, prisma);

    res.status(201).json(success(record, 'Attendance marked successfully'));
  } catch (err) {
    next(err);
  }
};

const updateAttendance = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const prisma = getClient();

    const record = await prisma.attendanceRecord.update({
      where: { id },
      data: {
        status,
        notes,
        checkInTime: status === 'present' || status === 'late' ? new Date() : null
      },
      include: {
        student: {
          include: {
            user: { select: { name: true } }
          }
        }
      }
    });

    // Update session counts
    await updateSessionCounts(record.sessionId, prisma);

    res.json(success(record, 'Attendance updated successfully'));
  } catch (err) {
    next(err);
  }
};

const getAttendanceRecords = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, classId, studentId, startDate, endDate, status } = req.query;
    const prisma = getClient();

    const where = {};
    if (classId) where.classId = classId;
    if (studentId) where.studentId = studentId;
    if (status) where.status = status;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    const [records, total] = await Promise.all([
      prisma.attendanceRecord.findMany({
        where,
        skip: (page - 1) * limit,
        take: parseInt(limit),
        include: {
          student: {
            include: {
              user: { select: { name: true } }
            }
          },
          class: {
            include: {
              course: { select: { name: true, code: true } }
            }
          },
          session: { select: { date: true, startTime: true } }
        },
        orderBy: { date: 'desc' }
      }),
      prisma.attendanceRecord.count({ where })
    ]);

    res.json(paginated(records, page, limit, total));
  } catch (err) {
    next(err);
  }
};

const getClassAttendance = async (req, res, next) => {
  try {
    const { classId } = req.params;
    const { startDate, endDate } = req.query;
    const prisma = getClient();

    const where = { classId };
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    const sessions = await prisma.attendanceSession.findMany({
      where,
      include: {
        attendanceRecords: {
          include: {
            student: {
              include: {
                user: { select: { name: true } }
              }
            }
          }
        }
      },
      orderBy: { date: 'desc' }
    });

    res.json(success(sessions));
  } catch (err) {
    next(err);
  }
};

const completeSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    const prisma = getClient();

    const session = await prisma.attendanceSession.update({
      where: { id },
      data: { status: 'completed' }
    });

    res.json(success(session, 'Session completed successfully'));
  } catch (err) {
    next(err);
  }
};

// Helper function to update session counts
const updateSessionCounts = async (sessionId, prisma) => {
  const counts = await prisma.attendanceRecord.groupBy({
    by: ['status'],
    where: { sessionId },
    _count: { status: true }
  });

  const presentCount = counts.find(c => c.status === 'present')?._count?.status || 0;
  const absentCount = counts.find(c => c.status === 'absent')?._count?.status || 0;
  const lateCount = counts.find(c => c.status === 'late')?._count?.status || 0;
  const totalMarked = presentCount + absentCount + lateCount;

  const session = await prisma.attendanceSession.findUnique({
    where: { id: sessionId },
    select: { totalStudents: true }
  });

  const attendancePercentage = session?.totalStudents 
    ? ((presentCount + lateCount) / session.totalStudents) * 100 
    : 0;

  await prisma.attendanceSession.update({
    where: { id: sessionId },
    data: {
      presentCount,
      absentCount,
      lateCount,
      attendancePercentage: Math.round(attendancePercentage * 100) / 100
    }
  });
};

module.exports = {
  createSession,
  getSession,
  markAttendance,
  updateAttendance,
  getAttendanceRecords,
  getClassAttendance,
  completeSession
};