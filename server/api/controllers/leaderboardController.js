const { success, error } = require('../utils/response');
const { getClient } = require('../services/database');

const getStudentLeaderboard = async (req, res, next) => {
  try {
    const { limit = 10, departmentId, classId, period = 30 } = req.query;
    const prisma = getClient();

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    const where = {
      date: { gte: startDate },
      status: { in: ['present', 'late'] }
    };

    if (departmentId) {
      where.student = { departmentId };
    }
    if (classId) {
      where.classId = classId;
    }

    const topStudents = await prisma.attendanceRecord.groupBy({
      by: ['studentId'],
      where,
      _count: { studentId: true },
      orderBy: { _count: { studentId: 'desc' } },
      take: parseInt(limit)
    });

    // Get student details
    const studentIds = topStudents.map(s => s.studentId);
    const students = await prisma.student.findMany({
      where: { id: { in: studentIds } },
      include: {
        user: { select: { name: true, avatar: true } },
        department: { select: { name: true, code: true } }
      }
    });

    // Calculate attendance percentage for each student
    const leaderboard = await Promise.all(
      topStudents.map(async (student) => {
        const studentData = students.find(s => s.id === student.studentId);
        
        // Get total records for percentage calculation
        const totalRecords = await prisma.attendanceRecord.count({
          where: {
            studentId: student.studentId,
            date: { gte: startDate },
            ...(classId && { classId })
          }
        });

        const attendancePercentage = totalRecords > 0 
          ? (student._count.studentId / totalRecords) * 100 
          : 0;

        return {
          rank: topStudents.indexOf(student) + 1,
          student: {
            id: student.studentId,
            name: studentData?.user?.name || 'Unknown',
            rollNumber: studentData?.rollNumber,
            avatar: studentData?.user?.avatar,
            department: studentData?.department
          },
          attendanceCount: student._count.studentId,
          attendancePercentage: Math.round(attendancePercentage * 100) / 100,
          totalRecords
        };
      })
    );

    res.json(success(leaderboard));
  } catch (err) {
    next(err);
  }
};

const getDepartmentRankings = async (req, res, next) => {
  try {
    const { period = 30 } = req.query;
    const prisma = getClient();

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Get attendance stats by department
    const departmentStats = await prisma.attendanceRecord.groupBy({
      by: ['studentId'],
      where: {
        date: { gte: startDate },
        status: { in: ['present', 'late'] }
      },
      _count: { studentId: true }
    });

    // Get student department mapping
    const studentIds = departmentStats.map(s => s.studentId);
    const students = await prisma.student.findMany({
      where: { id: { in: studentIds } },
      select: { id: true, departmentId: true }
    });

    // Group by department
    const departmentAttendance = {};
    departmentStats.forEach(stat => {
      const student = students.find(s => s.id === stat.studentId);
      if (student?.departmentId) {
        if (!departmentAttendance[student.departmentId]) {
          departmentAttendance[student.departmentId] = {
            totalAttendance: 0,
            studentCount: 0
          };
        }
        departmentAttendance[student.departmentId].totalAttendance += stat._count.studentId;
        departmentAttendance[student.departmentId].studentCount += 1;
      }
    });

    // Get department details and calculate averages
    const departmentIds = Object.keys(departmentAttendance);
    const departments = await prisma.department.findMany({
      where: { id: { in: departmentIds } },
      select: { id: true, name: true, code: true, studentCount: true }
    });

    const rankings = departments.map(dept => {
      const stats = departmentAttendance[dept.id];
      const averageAttendance = stats ? stats.totalAttendance / stats.studentCount : 0;
      
      return {
        department: dept,
        averageAttendance: Math.round(averageAttendance * 100) / 100,
        activeStudents: stats?.studentCount || 0,
        totalStudents: dept.studentCount
      };
    }).sort((a, b) => b.averageAttendance - a.averageAttendance);

    // Add rankings
    const rankedDepartments = rankings.map((dept, index) => ({
      ...dept,
      rank: index + 1
    }));

    res.json(success(rankedDepartments));
  } catch (err) {
    next(err);
  }
};

const getAchievements = async (req, res, next) => {
  try {
    const { studentId } = req.query;
    const prisma = getClient();

    if (!studentId) {
      return res.status(400).json(error('Student ID is required', 400));
    }

    // Get student attendance data
    const [totalRecords, presentRecords, streakData] = await Promise.all([
      prisma.attendanceRecord.count({
        where: { studentId }
      }),
      prisma.attendanceRecord.count({
        where: { 
          studentId,
          status: { in: ['present', 'late'] }
        }
      }),
      prisma.attendanceRecord.findMany({
        where: { 
          studentId,
          status: { in: ['present', 'late'] }
        },
        select: { date: true },
        orderBy: { date: 'desc' }
      })
    ]);

    const attendancePercentage = totalRecords > 0 ? (presentRecords / totalRecords) * 100 : 0;

    // Calculate current streak
    let currentStreak = 0;
    const today = new Date();
    for (let i = 0; i < streakData.length; i++) {
      const recordDate = new Date(streakData[i].date);
      const daysDiff = Math.floor((today - recordDate) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === i) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Define achievements
    const achievements = [
      {
        id: 'perfect_attendance',
        name: 'Perfect Attendance',
        description: '100% attendance rate',
        icon: '🏆',
        earned: attendancePercentage === 100,
        progress: attendancePercentage
      },
      {
        id: 'excellent_attendance',
        name: 'Excellent Attendance',
        description: '95% or higher attendance rate',
        icon: '⭐',
        earned: attendancePercentage >= 95,
        progress: attendancePercentage
      },
      {
        id: 'good_attendance',
        name: 'Good Attendance',
        description: '85% or higher attendance rate',
        icon: '👍',
        earned: attendancePercentage >= 85,
        progress: attendancePercentage
      },
      {
        id: 'streak_7',
        name: '7-Day Streak',
        description: 'Attend classes for 7 consecutive days',
        icon: '🔥',
        earned: currentStreak >= 7,
        progress: Math.min(currentStreak, 7)
      },
      {
        id: 'streak_30',
        name: '30-Day Streak',
        description: 'Attend classes for 30 consecutive days',
        icon: '💎',
        earned: currentStreak >= 30,
        progress: Math.min(currentStreak, 30)
      },
      {
        id: 'early_bird',
        name: 'Early Bird',
        description: 'Never marked late',
        icon: '🐦',
        earned: await checkEarlyBird(studentId, prisma),
        progress: 100
      }
    ];

    res.json(success({
      studentId,
      totalAchievements: achievements.length,
      earnedAchievements: achievements.filter(a => a.earned).length,
      achievements,
      stats: {
        totalRecords,
        presentRecords,
        attendancePercentage: Math.round(attendancePercentage * 100) / 100,
        currentStreak
      }
    }));
  } catch (err) {
    next(err);
  }
};

// Helper function
const checkEarlyBird = async (studentId, prisma) => {
  const lateRecords = await prisma.attendanceRecord.count({
    where: {
      studentId,
      status: 'late'
    }
  });
  return lateRecords === 0;
};

module.exports = {
  getStudentLeaderboard,
  getDepartmentRankings,
  getAchievements
};