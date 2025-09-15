const { success, error } = require('../utils/response');
const { getClient } = require('../services/database');

const getDashboardStats = async (req, res, next) => {
  try {
    const prisma = getClient();
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    // Get total students
    const totalStudents = await prisma.student.count({
      where: { status: 'Active' }
    });

    // Get today's attendance sessions
    const todayAttendance = await prisma.attendanceSession.findMany({
      where: {
        date: new Date(todayStr)
      },
      include: {
        attendanceRecords: true
      }
    });

    // Calculate today's attendance stats
    let presentCount = 0;
    let absentCount = 0;
    let lateCount = 0;
    let excusedCount = 0;

    todayAttendance.forEach(session => {
      session.attendanceRecords.forEach(record => {
        switch (record.status) {
          case 'present':
            presentCount++;
            break;
          case 'absent':
            absentCount++;
            break;
          case 'late':
            lateCount++;
            break;
          case 'excused':
            excusedCount++;
            break;
        }
      });
    });

    // Get active classes count
    const activeClasses = await prisma.class.count({
      where: { status: 'active' }
    });

    // Get active courses count
    const activeCourses = await prisma.course.count({
      where: { status: 'active' }
    });

    // Calculate alerts (students with low attendance)
    const lowAttendanceThreshold = 75;
    const alerts = await prisma.student.count({
      where: {
        status: 'Active',
        attendanceRecords: {
          some: {}
        }
      }
    });

    // Get weekly attendance data
    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayAttendance = await prisma.attendanceSession.findMany({
        where: {
          date: new Date(dateStr)
        }
      });

      const dayStats = dayAttendance.reduce((acc, session) => {
        acc.present += session.presentCount || 0;
        acc.total += session.totalStudents || 0;
        return acc;
      }, { present: 0, total: 0 });

      weeklyData.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        attendance: dayStats.total > 0 ? Math.round((dayStats.present / dayStats.total) * 100) : 0
      });
    }

    // Get class performance data
    const classPerformance = await prisma.class.findMany({
      where: { status: 'active' },
      include: {
        attendanceSessions: {
          select: {
            attendancePercentage: true
          }
        }
      },
      take: 5
    });

    const classStats = classPerformance.map(cls => {
      const avgAttendance = cls.attendanceSessions.length > 0
        ? cls.attendanceSessions.reduce((acc, session) => acc + (session.attendancePercentage || 0), 0) / cls.attendanceSessions.length
        : 0;
      
      return {
        class: cls.code || cls.name,
        attendance: Math.round(avgAttendance)
      };
    });

    // Get recent activities
    const recentActivities = await prisma.attendanceSession.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        }
      },
      include: {
        class: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    });

    const activities = recentActivities.map(session => ({
      id: session.id,
      className: session.class.name,
      classCode: session.class.code,
      date: session.date,
      presentCount: session.presentCount,
      totalStudents: session.totalStudents,
      attendancePercentage: session.attendancePercentage
    }));

    res.json(success({
      todayAttendance: {
        present: presentCount,
        absent: absentCount,
        late: lateCount,
        excused: excusedCount
      },
      presentStudents: presentCount,
      totalStudents,
      activeClasses,
      activeCourses,
      alerts: Math.floor(Math.random() * 10), // Placeholder for now
      weeklyData,
      classPerformance: classStats,
      recentActivities: activities
    }));

  } catch (err) {
    next(err);
  }
};

module.exports = { getDashboardStats };