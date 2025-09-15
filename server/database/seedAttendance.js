require('dotenv').config();
const prisma = require('./client');

async function seedAttendanceData() {
  try {
    console.log('Seeding attendance data...');

    // Create sample students
    const students = [];
    for (let i = 1; i <= 50; i++) {
      const student = await prisma.student.upsert({
        where: { rollNumber: `STU${String(i).padStart(3, '0')}` },
        update: {},
        create: {
          id: `student_${String(i).padStart(3, '0')}`,
          rollNumber: `STU${String(i).padStart(3, '0')}`,
          enrollmentNumber: `2024${String(i).padStart(4, '0')}`,
          departmentId: i <= 25 ? 'dept_002' : 'dept_001', // CSE or EE
          year: Math.floor((i - 1) / 12) + 1,
          section: ['A', 'B', 'C'][i % 3],
          status: 'Active',
          enrollmentDate: new Date('2024-01-10'),
          phone: `+1-555-${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
          gpa: Math.round((Math.random() * 2 + 2) * 100) / 100
        }
      });
      students.push(student);
    }

    // Create sample faculty
    const faculty = await prisma.faculty.upsert({
      where: { employeeId: 'FAC001' },
      update: {
        departmentId: 'dept_002',
        designation: 'Assistant_Professor',
        experienceYears: 5,
        joinDate: new Date('2020-01-01'),
        status: 'active'
      },
      create: {
        id: 'faculty_001',
        employeeId: 'FAC001',
        departmentId: 'dept_002',
        designation: 'Assistant_Professor',
        experienceYears: 5,
        joinDate: new Date('2020-01-01'),
        status: 'active'
      }
    });

    // Create sample courses
    const courses = [
      {
        id: 'course_001',
        departmentId: 'dept_002',
        name: 'Data Structures & Algorithms',
        code: 'CSE301',
        credits: 4,
        level: 'undergraduate',
        category: 'core',
        status: 'active'
      },
      {
        id: 'course_002',
        departmentId: 'dept_001',
        name: 'Digital Electronics',
        code: 'ECE201',
        credits: 3,
        level: 'undergraduate',
        category: 'core',
        status: 'active'
      }
    ];

    for (const course of courses) {
      await prisma.course.upsert({
        where: { code: course.code },
        update: course,
        create: course
      });
    }

    // Create sample classes
    const classes = [
      {
        id: 'class_001',
        courseId: 'course_001',
        facultyId: 'faculty_001',
        departmentId: 'dept_002',
        name: 'Data Structures & Algorithms - Section A',
        code: 'CSE301-A',
        section: 'A',
        semester: 'Fall 2024',
        academicYear: '2024-25',
        maxCapacity: 30,
        currentEnrollment: 25,
        room: 'Lab-101',
        status: 'active',
        credits: 4
      },
      {
        id: 'class_002',
        courseId: 'course_002',
        facultyId: 'faculty_001',
        departmentId: 'dept_001',
        name: 'Digital Electronics - Section B',
        code: 'ECE201-B',
        section: 'B',
        semester: 'Fall 2024',
        academicYear: '2024-25',
        maxCapacity: 25,
        currentEnrollment: 20,
        room: 'Room-205',
        status: 'active',
        credits: 3
      }
    ];

    for (const cls of classes) {
      await prisma.class.upsert({
        where: { id: cls.id },
        update: cls,
        create: cls
      });
    }

    // Create attendance sessions for the last 7 days
    const sessions = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      for (const cls of classes) {
        const session = await prisma.attendanceSession.upsert({
          where: { id: `session_${cls.id}_${i}` },
          update: {},
          create: {
            id: `session_${cls.id}_${i}`,
            classId: cls.id,
            facultyId: 'faculty_001',
            date: date,
            startTime: new Date(`1970-01-01T09:00:00Z`),
            endTime: new Date(`1970-01-01T10:30:00Z`),
            status: 'completed',
            totalStudents: cls.currentEnrollment,
            presentCount: Math.floor(cls.currentEnrollment * (0.8 + Math.random() * 0.15)),
            absentCount: 0,
            lateCount: 0
          }
        });
        
        // Update present/absent counts
        const presentCount = session.presentCount;
        const absentCount = cls.currentEnrollment - presentCount;
        const attendancePercentage = (presentCount / cls.currentEnrollment) * 100;
        
        await prisma.attendanceSession.update({
          where: { id: session.id },
          data: {
            absentCount,
            attendancePercentage
          }
        });

        sessions.push(session);
      }
    }

    // Create attendance records
    for (const session of sessions) {
      const classData = classes.find(c => c.id === session.classId);
      const enrolledStudents = students.slice(0, classData.currentEnrollment);
      
      for (let j = 0; j < session.presentCount; j++) {
        const student = enrolledStudents[j];
        await prisma.attendanceRecord.upsert({
          where: { id: `record_${session.id}_${student.id}` },
          update: {},
          create: {
            id: `record_${session.id}_${student.id}`,
            studentId: student.id,
            classId: session.classId,
            facultyId: session.facultyId,
            sessionId: session.id,
            date: session.date,
            status: 'present',
            checkInTime: new Date(`1970-01-01T09:${String(Math.floor(Math.random() * 15)).padStart(2, '0')}:00Z`),
            method: 'manual'
          }
        });
      }
    }

    console.log('✅ Attendance data seeded successfully!');
    console.log(`Created ${students.length} students`);
    console.log(`Created ${sessions.length} attendance sessions`);

  } catch (error) {
    console.error('❌ Error seeding attendance data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAttendanceData();