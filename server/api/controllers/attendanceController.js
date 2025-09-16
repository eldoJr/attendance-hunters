const { success, error, paginated } = require('../utils/response');
const { getClient } = require('../services/database');
const { v4: uuidv4 } = require('uuid');

const createSession = async (req, res, next) => {
  try {
    console.log('=== CREATE SESSION REQUEST ===');
    console.log('Headers:', req.headers);
    console.log('User:', req.user);
    console.log('Body:', req.body);
    console.log('Looking for faculty with userId:', req.user.id);
    
    const { classId, date, startTime, endTime, location, notes, sessionType, conductedBy, plannedTopic, planningStatus, targetLearning, tgLevel } = req.body;
    const prisma = getClient();

    // Validate required fields
    if (!classId || !date || !startTime || !endTime) {
      return res.status(400).json(error('Missing required fields: classId, date, startTime, endTime', 400));
    }

    // Find faculty record for this user (admins might not have one)
    let faculty = await prisma.faculty.findFirst({
      where: { userId: req.user.id }
    });

    // For admin users, use any available faculty record
    if (!faculty && req.user.role === 'admin') {
      faculty = await prisma.faculty.findFirst();
      if (!faculty) {
        return res.status(400).json(error('No faculty records found in system', 400));
      }
    } else if (!faculty) {
      return res.status(400).json(error('Faculty record not found for user', 400));
    }

    // Validate class exists
    const classRecord = await prisma.class.findFirst({
      where: { id: classId }
    });

    if (!classRecord) {
      return res.status(400).json(error('Class not found', 400));
    }

    // For non-admin users, check if faculty owns this class
    if (req.user.role !== 'admin' && classRecord.facultyId !== faculty.id) {
      return res.status(403).json(error('Access denied. You can only create sessions for your own classes', 403));
    }

    // Check for existing active session
    const existingSession = await prisma.attendanceSession.findFirst({
      where: {
        classId,
        date: new Date(date),
        status: 'active'
      }
    });

    if (existingSession) {
      return res.status(409).json(error('An active session already exists for this class today', 409));
    }

    // Get enrolled students count
    const enrollmentCount = await prisma.studentEnrollment.count({
      where: { classId, status: 'enrolled' }
    });

    const session = await prisma.attendanceSession.create({
      data: {
        id: uuidv4(),
        classId,
        facultyId: faculty.id,
        date: new Date(date),
        startTime: new Date(`1970-01-01T${startTime}`),
        endTime: new Date(`1970-01-01T${endTime}`),
        location: location || null,
        notes: notes || null,
        sessionType: sessionType || 'lecture',
        conductedBy: conductedBy || null,
        plannedTopic: plannedTopic || null,
        planningStatus: planningStatus || null,
        targetLearning: targetLearning || null,
        tgLevel: tgLevel || null,
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
    console.error('=== CREATE SESSION ERROR ===');
    console.error('Error:', err);
    console.error('Stack:', err.stack);
    
    // Handle specific Prisma errors
    if (err.code === 'P2003') {
      return res.status(400).json(error('Invalid class or faculty reference', 400));
    }
    if (err.code === 'P2002') {
      return res.status(409).json(error('Session already exists', 409));
    }
    
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

    // Find faculty record for this user
    const faculty = await prisma.faculty.findFirst({
      where: { userId: req.user.id }
    });

    if (!faculty) {
      return res.status(400).json(error('Faculty record not found for user', 400));
    }

    const record = await prisma.attendanceRecord.create({
      data: {
        id: uuidv4(),
        studentId,
        classId,
        facultyId: faculty.id,
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