const { success, error, paginated } = require('../utils/response');
const { getClient } = require('../services/database');
const { v4: uuidv4 } = require('uuid');

const getReports = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, type, status, classId } = req.query;
    const prisma = getClient();

    const where = {};
    if (type) where.type = type;
    if (status) where.status = status;
    if (classId) where.classId = classId;

    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        where,
        skip: (page - 1) * limit,
        take: parseInt(limit),
        include: {
          class: {
            include: {
              course: { select: { name: true, code: true } }
            }
          },
          creator: { select: { name: true } }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.report.count({ where })
    ]);

    res.json(paginated(reports, page, limit, total));
  } catch (err) {
    next(err);
  }
};

const getReportById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const prisma = getClient();

    const report = await prisma.report.findUnique({
      where: { id },
      include: {
        class: {
          include: {
            course: true,
            faculty: {
              include: { user: { select: { name: true } } }
            }
          }
        },
        creator: { select: { name: true, email: true } }
      }
    });

    if (!report) {
      return res.status(404).json(error('Report not found', 404));
    }

    res.json(success(report));
  } catch (err) {
    next(err);
  }
};

const generateReport = async (req, res, next) => {
  try {
    const { type, classId, period, startDate, endDate } = req.body;
    const prisma = getClient();

    // Create report record
    const report = await prisma.report.create({
      data: {
        id: uuidv4(),
        type,
        classId,
        period,
        status: 'Processing',
        createdBy: req.user.id,
        generatedDate: new Date()
      }
    });

    // Generate report data based on type
    let reportData;
    switch (type) {
      case 'attendance_summary':
        reportData = await generateAttendanceSummary(classId, startDate, endDate, prisma);
        break;
      case 'student_performance':
        reportData = await generateStudentPerformance(classId, startDate, endDate, prisma);
        break;
      case 'class_analytics':
        reportData = await generateClassAnalytics(classId, startDate, endDate, prisma);
        break;
      case 'department_overview':
        reportData = await generateDepartmentOverview(classId, startDate, endDate, prisma);
        break;
      default:
        reportData = { error: 'Unknown report type' };
    }

    // Update report with generated data
    const updatedReport = await prisma.report.update({
      where: { id: report.id },
      data: {
        status: 'Generated',
        attendancePercentage: reportData.overallAttendance || null,
        studentCount: reportData.totalStudents || null,
        filePath: `/reports/${report.id}.json` // In real implementation, save to file system
      },
      include: {
        class: {
          include: {
            course: { select: { name: true, code: true } }
          }
        }
      }
    });

    res.status(201).json(success({
      report: updatedReport,
      data: reportData
    }, 'Report generated successfully'));
  } catch (err) {
    // Update report status to failed
    if (req.body.reportId) {
      await prisma.report.update({
        where: { id: req.body.reportId },
        data: { status: 'Failed' }
      });
    }
    next(err);
  }
};

const downloadReport = async (req, res, next) => {
  try {
    const { id } = req.params;
    const prisma = getClient();

    const report = await prisma.report.findUnique({
      where: { id },
      include: {
        class: {
          include: {
            course: true,
            faculty: { include: { user: { select: { name: true } } } }
          }
        }
      }
    });

    if (!report) {
      return res.status(404).json(error('Report not found', 404));
    }

    if (report.status !== 'Generated') {
      return res.status(400).json(error('Report is not ready for download', 400));
    }

    // In real implementation, serve the actual file
    // For now, return the report data as JSON
    const reportData = await getReportData(report, prisma);

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="report_${report.id}.json"`);
    res.json(reportData);
  } catch (err) {
    next(err);
  }
};

// Helper functions for different report types
const generateAttendanceSummary = async (classId, startDate, endDate, prisma) => {
  const where = { classId };
  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = new Date(startDate);
    if (endDate) where.date.lte = new Date(endDate);
  }

  const [attendanceStats, sessions, students] = await Promise.all([
    prisma.attendanceRecord.groupBy({
      by: ['status'],
      where,
      _count: { status: true }
    }),
    prisma.attendanceSession.findMany({
      where: { classId, date: where.date },
      select: { date: true, attendancePercentage: true }
    }),
    prisma.studentEnrollment.count({
      where: { classId, status: 'enrolled' }
    })
  ]);

  const totalRecords = attendanceStats.reduce((sum, stat) => sum + stat._count.status, 0);
  const presentRecords = attendanceStats.find(s => s.status === 'present')?._count?.status || 0;
  const lateRecords = attendanceStats.find(s => s.status === 'late')?._count?.status || 0;

  return {
    totalStudents: students,
    totalSessions: sessions.length,
    overallAttendance: totalRecords > 0 ? ((presentRecords + lateRecords) / totalRecords) * 100 : 0,
    attendanceBreakdown: {
      present: presentRecords,
      absent: attendanceStats.find(s => s.status === 'absent')?._count?.status || 0,
      late: lateRecords,
      excused: attendanceStats.find(s => s.status === 'excused')?._count?.status || 0
    },
    sessionDetails: sessions
  };
};

const generateStudentPerformance = async (classId, startDate, endDate, prisma) => {
  const where = { classId };
  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = new Date(startDate);
    if (endDate) where.date.lte = new Date(endDate);
  }

  const studentPerformance = await prisma.attendanceRecord.groupBy({
    by: ['studentId'],
    where,
    _count: { status: true }
  });

  const studentDetails = await prisma.student.findMany({
    where: {
      id: { in: studentPerformance.map(p => p.studentId) }
    },
    include: {
      user: { select: { name: true } }
    }
  });

  return {
    totalStudents: studentPerformance.length,
    studentPerformance: studentPerformance.map(perf => {
      const student = studentDetails.find(s => s.id === perf.studentId);
      return {
        studentId: perf.studentId,
        studentName: student?.user?.name || 'Unknown',
        rollNumber: student?.rollNumber,
        totalRecords: perf._count.status
      };
    })
  };
};

const generateClassAnalytics = async (classId, startDate, endDate, prisma) => {
  const classData = await prisma.class.findUnique({
    where: { id: classId },
    include: {
      course: true,
      faculty: { include: { user: { select: { name: true } } } },
      _count: { select: { enrollments: true } }
    }
  });

  const attendanceSummary = await generateAttendanceSummary(classId, startDate, endDate, prisma);

  return {
    classInfo: classData,
    ...attendanceSummary
  };
};

const generateDepartmentOverview = async (departmentId, startDate, endDate, prisma) => {
  // This would be implemented for department-wide reports
  return {
    message: 'Department overview report not implemented yet'
  };
};

const getReportData = async (report, prisma) => {
  // Regenerate report data for download
  switch (report.type) {
    case 'attendance_summary':
      return await generateAttendanceSummary(report.classId, null, null, prisma);
    default:
      return { report };
  }
};

module.exports = {
  getReports,
  getReportById,
  generateReport,
  downloadReport
};