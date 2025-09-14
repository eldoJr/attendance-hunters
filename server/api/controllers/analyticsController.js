const { success, error } = require('../utils/response');
const { getClient } = require('../services/database');

const getOverview = async (req, res, next) => {
  try {
    const prisma = getClient();

    const [
      totalStudents,
      totalFaculty,
      totalClasses,
      totalDepartments,
      activeClasses,
      todayAttendance,
      weeklyStats
    ] = await Promise.all([
      prisma.student.count({ where: { status: 'Active' } }),
      prisma.faculty.count({ where: { status: 'active' } }),
      prisma.class.count(),
      prisma.department.count({ where: { status: 'Active' } }),
      prisma.class.count({ where: { status: 'active' } }),
      getTodayAttendanceStats(prisma),
      getWeeklyAttendanceStats(prisma)
    ]);

    const overview = {
      totalStudents,
      totalFaculty,
      totalClasses,
      totalDepartments,
      activeClasses,
      todayAttendance,
      weeklyStats
    };

    res.json(success(overview));
  } catch (err) {
    next(err);
  }
};

const getDepartmentAnalytics = async (req, res, next) => {
  try {
    const { id } = req.params;
    const prisma = getClient();

    const department = await prisma.department.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            faculty: true,
            students: true,
            classes: true,
            courses: true
          }
        }
      }
    });

    if (!department) {
      return res.status(404).json(error('Department not found', 404));
    }

    // Get attendance statistics for department
    const attendanceStats = await prisma.attendanceRecord.groupBy({
      by: ['status'],
      where: {
        class: {
          departmentId: id
        },
        date: {
          gte: new Date(new Date().setDate(new Date().getDate() - 30))
        }
      },
      _count: { status: true }
    });

    const analytics = {
      ...department,
      attendanceStats: {
        present: attendanceStats.find(s => s.status === 'present')?._count?.status || 0,
        absent: attendanceStats.find(s => s.status === 'absent')?._count?.status || 0,
        late: attendanceStats.find(s => s.status === 'late')?._count?.status || 0,
        excused: attendanceStats.find(s => s.status === 'excused')?._count?.status || 0
      }
    };

    res.json(success(analytics));
  } catch (err) {
    next(err);
  }
};

const getClassAnalytics = async (req, res, next) => {
  try {
    const { id } = req.params;
    const prisma = getClient();

    const classData = await prisma.class.findUnique({
      where: { id },
      include: {
        course: true,
        faculty: { include: { user: { select: { name: true } } } },
        _count: { select: { enrollments: true } }
      }
    });

    if (!classData) {
      return res.status(404).json(error('Class not found', 404));
    }

    // Get attendance statistics
    const [attendanceStats, sessionStats, topStudents] = await Promise.all([
      prisma.attendanceRecord.groupBy({
        by: ['status'],
        where: { classId: id },
        _count: { status: true }
      }),
      prisma.attendanceSession.aggregate({
        where: { classId: id },
        _avg: { attendancePercentage: true },
        _count: { id: true }
      }),
      prisma.attendanceRecord.groupBy({
        by: ['studentId'],
        where: { 
          classId: id,
          status: { in: ['present', 'late'] }
        },
        _count: { studentId: true },
        orderBy: { _count: { studentId: 'desc' } },
        take: 5
      })
    ]);

    const analytics = {
      ...classData,
      attendanceStats: {
        present: attendanceStats.find(s => s.status === 'present')?._count?.status || 0,
        absent: attendanceStats.find(s => s.status === 'absent')?._count?.status || 0,
        late: attendanceStats.find(s => s.status === 'late')?._count?.status || 0,
        excused: attendanceStats.find(s => s.status === 'excused')?._count?.status || 0
      },
      averageAttendance: sessionStats._avg.attendancePercentage || 0,
      totalSessions: sessionStats._count.id,
      topStudents: await getStudentDetails(topStudents, prisma)
    };

    res.json(success(analytics));
  } catch (err) {
    next(err);
  }
};

const getStudentPerformance = async (req, res, next) => {
  try {
    const { id } = req.params;
    const prisma = getClient();

    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, email: true } },
        department: { select: { name: true } }
      }
    });

    if (!student) {
      return res.status(404).json(error('Student not found', 404));
    }

    // Get attendance statistics
    const [attendanceStats, classPerformance, monthlyTrend] = await Promise.all([
      prisma.attendanceRecord.groupBy({
        by: ['status'],
        where: { studentId: id },
        _count: { status: true }
      }),
      getStudentClassPerformance(id, prisma),
      getStudentMonthlyTrend(id, prisma)
    ]);

    const totalRecords = attendanceStats.reduce((sum, stat) => sum + stat._count.status, 0);
    const presentRecords = attendanceStats.find(s => s.status === 'present')?._count?.status || 0;
    const lateRecords = attendanceStats.find(s => s.status === 'late')?._count?.status || 0;

    const performance = {
      ...student,
      overallAttendance: totalRecords > 0 ? ((presentRecords + lateRecords) / totalRecords) * 100 : 0,
      attendanceStats: {
        present: presentRecords,
        absent: attendanceStats.find(s => s.status === 'absent')?._count?.status || 0,
        late: lateRecords,
        excused: attendanceStats.find(s => s.status === 'excused')?._count?.status || 0,
        total: totalRecords
      },
      classPerformance,
      monthlyTrend
    };

    res.json(success(performance));
  } catch (err) {
    next(err);
  }
};

const getAttendanceTrends = async (req, res, next) => {
  try {
    const { period = '30', departmentId, classId } = req.query;
    const prisma = getClient();

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    const where = {
      date: { gte: startDate }
    };

    if (departmentId) {
      where.class = { departmentId };
    }
    if (classId) {
      where.classId = classId;
    }

    const trends = await prisma.attendanceRecord.groupBy({
      by: ['date', 'status'],
      where,
      _count: { status: true },
      orderBy: { date: 'asc' }
    });

    // Group by date
    const trendData = trends.reduce((acc, record) => {
      const dateKey = record.date.toISOString().split('T')[0];
      if (!acc[dateKey]) {
        acc[dateKey] = { date: dateKey, present: 0, absent: 0, late: 0, excused: 0 };
      }
      acc[dateKey][record.status] = record._count.status;
      return acc;
    }, {});

    res.json(success(Object.values(trendData)));
  } catch (err) {
    next(err);
  }
};

// Helper functions
const getTodayAttendanceStats = async (prisma) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const stats = await prisma.attendanceRecord.groupBy({
    by: ['status'],
    where: {
      date: { gte: today }
    },
    _count: { status: true }
  });

  return {
    present: stats.find(s => s.status === 'present')?._count?.status || 0,
    absent: stats.find(s => s.status === 'absent')?._count?.status || 0,
    late: stats.find(s => s.status === 'late')?._count?.status || 0,
    excused: stats.find(s => s.status === 'excused')?._count?.status || 0
  };
};

const getWeeklyAttendanceStats = async (prisma) => {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const stats = await prisma.attendanceRecord.groupBy({
    by: ['date'],
    where: {
      date: { gte: weekAgo },
      status: { in: ['present', 'late'] }
    },
    _count: { date: true },
    orderBy: { date: 'asc' }
  });

  return stats.map(stat => ({
    date: stat.date.toISOString().split('T')[0],
    count: stat._count.date
  }));
};

const getStudentDetails = async (topStudents, prisma) => {
  const studentIds = topStudents.map(s => s.studentId);
  const students = await prisma.student.findMany({
    where: { id: { in: studentIds } },
    include: {
      user: { select: { name: true } }
    }
  });

  return topStudents.map(stat => {
    const student = students.find(s => s.id === stat.studentId);
    return {
      student: student?.user?.name || 'Unknown',
      attendanceCount: stat._count.studentId
    };
  });
};

const getStudentClassPerformance = async (studentId, prisma) => {
  return await prisma.attendanceRecord.groupBy({
    by: ['classId'],
    where: { studentId },
    _count: { status: true },
    _sum: {
      status: true // This won't work directly, we'll need to calculate manually
    }
  });
};

const getStudentMonthlyTrend = async (studentId, prisma) => {
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  return await prisma.attendanceRecord.groupBy({
    by: ['date'],
    where: {
      studentId,
      date: { gte: threeMonthsAgo },
      status: { in: ['present', 'late'] }
    },
    _count: { date: true },
    orderBy: { date: 'asc' }
  });
};

module.exports = {
  getOverview,
  getDepartmentAnalytics,
  getClassAnalytics,
  getStudentPerformance,
  getAttendanceTrends
};