const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Mock data imports
const {
  MOCK_DEPARTMENTS,
  FACULTY,
  COURSES,
  CLASSES,
  MOCK_STUDENTS,
  ATTENDANCE_SESSIONS,
  ATTENDANCE_RECORDS
} = require('./mockData');

async function main() {
  console.log('🌱 Starting comprehensive database seeding...');

  try {
    // 1. Create Departments
    console.log('📁 Seeding departments...');
    const departmentMap = new Map();
    
    for (const dept of MOCK_DEPARTMENTS) {
      const department = await prisma.department.upsert({
        where: { code: dept.code },
        update: {
          name: dept.name,
          head: dept.head,
          email: dept.email,
          phone: dept.phone,
          type: dept.type,
          status: dept.status,
          established: dept.established,
          building: dept.building,
          description: dept.description
        },
        create: {
          id: dept.id,
          name: dept.name,
          code: dept.code,
          head: dept.head,
          email: dept.email,
          phone: dept.phone,
          type: dept.type,
          status: dept.status,
          established: dept.established,
          building: dept.building,
          description: dept.description
        }
      });
      departmentMap.set(dept.id, department.id);
      departmentMap.set(dept.code, department.id);
    }
    console.log(`✅ Created ${MOCK_DEPARTMENTS.length} departments`);

    // 2. Create Users and Faculty
    console.log('👥 Seeding faculty users...');
    const facultyMap = new Map();
    
    for (const fac of FACULTY) {
      // Create user first
      const hashedPassword = await bcrypt.hash('faculty123', 12);
      const user = await prisma.user.upsert({
        where: { email: fac.email },
        update: {
          name: fac.name,
          password: hashedPassword,
          role: 'staff'
        },
        create: {
          name: fac.name,
          email: fac.email,
          password: hashedPassword,
          role: 'staff'
        }
      });

      // Create faculty record
      const faculty = await prisma.faculty.upsert({
        where: { employeeId: fac.employeeId },
        update: {
          userId: user.id,
          departmentId: departmentMap.get('dept_001') || departmentMap.get('1'),
          designation: fac.designation.replace(' ', '_'),
          specialization: fac.specialization,
          qualifications: fac.qualifications,
          experienceYears: fac.experience,
          joinDate: new Date(fac.joinDate),
          status: fac.status,
          officeRoom: fac.officeRoom,
          researchAreas: fac.researchAreas || [],
          publicationsCount: fac.publications || 0
        },
        create: {
          id: fac.id,
          employeeId: fac.employeeId,
          userId: user.id,
          departmentId: departmentMap.get('dept_001') || departmentMap.get('1'),
          designation: fac.designation.replace(' ', '_'),
          specialization: fac.specialization,
          qualifications: fac.qualifications,
          experienceYears: fac.experience,
          joinDate: new Date(fac.joinDate),
          status: fac.status,
          officeRoom: fac.officeRoom,
          researchAreas: fac.researchAreas || [],
          publicationsCount: fac.publications || 0
        }
      });
      facultyMap.set(fac.id, faculty.id);
    }
    console.log(`✅ Created ${FACULTY.length} faculty members`);

    // 3. Create Courses
    console.log('📚 Seeding courses...');
    const courseMap = new Map();
    
    for (const course of COURSES) {
      const courseRecord = await prisma.course.upsert({
        where: { code: course.code },
        update: {
          name: course.name,
          departmentId: departmentMap.get('dept_001') || departmentMap.get('1'),
          credits: course.credits,
          description: course.description,
          level: course.level,
          category: course.category,
          status: course.status
        },
        create: {
          id: course.id,
          name: course.name,
          code: course.code,
          departmentId: departmentMap.get('dept_001') || departmentMap.get('1'),
          credits: course.credits,
          description: course.description,
          level: course.level,
          category: course.category,
          status: course.status
        }
      });
      courseMap.set(course.id, courseRecord.id);
      courseMap.set(course.code, courseRecord.id);
    }
    console.log(`✅ Created ${COURSES.length} courses`);

    // 4. Create Classes
    console.log('🏫 Seeding classes...');
    const classMap = new Map();
    
    for (const cls of CLASSES) {
      const classRecord = await prisma.class.upsert({
        where: { id: cls.id },
        update: {
          name: cls.name,
          courseId: courseMap.get(cls.courseId),
          facultyId: facultyMap.get(cls.facultyId),
          departmentId: departmentMap.get(cls.departmentId) || departmentMap.get('1'),
          section: cls.section,
          semester: cls.semester,
          academicYear: cls.academicYear,
          maxCapacity: cls.maxCapacity,
          room: cls.room,
          status: cls.status,
          startDate: new Date(cls.startDate),
          endDate: new Date(cls.endDate),
          credits: cls.credits,
          description: cls.description
        },
        create: {
          id: cls.id,
          name: cls.name,
          code: cls.code,
          courseId: courseMap.get(cls.courseId),
          facultyId: facultyMap.get(cls.facultyId),
          departmentId: departmentMap.get(cls.departmentId) || departmentMap.get('1'),
          section: cls.section,
          semester: cls.semester,
          academicYear: cls.academicYear,
          maxCapacity: cls.maxCapacity,
          room: cls.room,
          status: cls.status,
          startDate: new Date(cls.startDate),
          endDate: new Date(cls.endDate),
          credits: cls.credits,
          description: cls.description
        }
      });
      classMap.set(cls.id, classRecord.id);
    }
    console.log(`✅ Created ${CLASSES.length} classes`);

    // 5. Create Student Users and Students
    console.log('🎓 Seeding students...');
    const studentMap = new Map();
    
    for (const student of MOCK_STUDENTS) {
      // Create user first
      const hashedPassword = await bcrypt.hash('student123', 12);
      const user = await prisma.user.upsert({
        where: { email: student.email },
        update: {
          name: student.name,
          password: hashedPassword,
          role: 'student'
        },
        create: {
          name: student.name,
          email: student.email,
          password: hashedPassword,
          role: 'student'
        }
      });

      // Determine department based on course/class
      let deptId = departmentMap.get('1'); // Default
      if (student.department === 'Computer Science & Engineering') {
        deptId = departmentMap.get('1');
      } else if (student.department === 'Electronics Engineering') {
        deptId = departmentMap.get('8');
      } else if (student.department === 'Information Technology') {
        deptId = departmentMap.get('2');
      }

      // Create student record
      const studentRecord = await prisma.student.upsert({
        where: { rollNumber: student.rollNumber },
        update: {
          userId: user.id,
          enrollmentNumber: student.enrollmentNumber,
          departmentId: deptId,
          year: student.year,
          section: student.section,
          status: student.status || 'Active',
          phone: student.phone,
          enrollmentDate: new Date(student.enrollmentDate || '2024-01-10'),
          gpa: student.gpa || 0.0
        },
        create: {
          id: student.id,
          rollNumber: student.rollNumber,
          enrollmentNumber: student.enrollmentNumber,
          userId: user.id,
          departmentId: deptId,
          year: student.year,
          section: student.section,
          status: student.status || 'Active',
          phone: student.phone,
          enrollmentDate: new Date(student.enrollmentDate || '2024-01-10'),
          gpa: student.gpa || 0.0
        }
      });
      studentMap.set(student.id, studentRecord.id);
    }
    console.log(`✅ Created ${MOCK_STUDENTS.length} students`);

    // 6. Create Class Enrollments
    console.log('📝 Creating class enrollments...');
    let enrollmentCount = 0;
    
    for (const cls of CLASSES) {
      if (cls.enrolledStudents && cls.enrolledStudents.length > 0) {
        for (const studentId of cls.enrolledStudents) {
          const student = studentMap.get(studentId);
          const classId = classMap.get(cls.id);
          
          if (student && classId) {
            try {
              await prisma.studentEnrollment.upsert({
                where: {
                  unique_enrollment: {
                    studentId: student,
                    classId: classId
                  }
                },
                update: {
                  status: 'enrolled',
                  enrollmentDate: new Date('2024-01-10')
                },
                create: {
                  studentId: student,
                  classId: classId,
                  status: 'enrolled',
                  enrollmentDate: new Date('2024-01-10')
                }
              });
              enrollmentCount++;
            } catch (error) {
              console.log(`⚠️  Enrollment already exists for student ${studentId} in class ${cls.id}`);
            }
          }
        }
      }
    }
    console.log(`✅ Created ${enrollmentCount} enrollments`);

    // 7. Create Attendance Sessions
    console.log('📊 Seeding attendance sessions...');
    const sessionMap = new Map();
    
    for (const session of ATTENDANCE_SESSIONS) {
      const sessionRecord = await prisma.attendanceSession.upsert({
        where: { id: session.id },
        update: {
          classId: classMap.get(session.classId),
          facultyId: facultyMap.get(session.facultyId),
          date: new Date(session.date),
          startTime: new Date(`1970-01-01T${session.startTime}`),
          endTime: new Date(`1970-01-01T${session.endTime}`),
          status: session.status,
          totalStudents: session.totalStudents,
          presentCount: session.presentCount,
          absentCount: session.absentCount,
          lateCount: session.lateCount,
          attendancePercentage: session.attendancePercentage
        },
        create: {
          id: session.id,
          classId: classMap.get(session.classId),
          facultyId: facultyMap.get(session.facultyId),
          date: new Date(session.date),
          startTime: new Date(`1970-01-01T${session.startTime}`),
          endTime: new Date(`1970-01-01T${session.endTime}`),
          status: session.status,
          totalStudents: session.totalStudents,
          presentCount: session.presentCount,
          absentCount: session.absentCount,
          lateCount: session.lateCount,
          attendancePercentage: session.attendancePercentage
        }
      });
      sessionMap.set(session.id, sessionRecord.id);
    }
    console.log(`✅ Created ${ATTENDANCE_SESSIONS.length} attendance sessions`);

    // 8. Create Attendance Records
    console.log('✅ Seeding attendance records...');
    
    for (const record of ATTENDANCE_RECORDS) {
      await prisma.attendanceRecord.upsert({
        where: { id: record.id },
        update: {
          studentId: studentMap.get(record.studentId),
          classId: classMap.get(record.classId),
          facultyId: facultyMap.get(record.facultyId),
          date: new Date(record.date),
          status: record.status,
          checkInTime: record.checkInTime ? new Date(`1970-01-01T${record.checkInTime}`) : null,
          checkOutTime: record.checkOutTime ? new Date(`1970-01-01T${record.checkOutTime}`) : null,
          method: record.method,
          location: record.location,
          notes: record.notes
        },
        create: {
          id: record.id,
          studentId: studentMap.get(record.studentId),
          classId: classMap.get(record.classId),
          facultyId: facultyMap.get(record.facultyId),
          sessionId: sessionMap.get('ses_001'),
          date: new Date(record.date),
          status: record.status,
          checkInTime: record.checkInTime ? new Date(`1970-01-01T${record.checkInTime}`) : null,
          checkOutTime: record.checkOutTime ? new Date(`1970-01-01T${record.checkOutTime}`) : null,
          method: record.method,
          location: record.location,
          notes: record.notes
        }
      });
    }
    console.log(`✅ Created ${ATTENDANCE_RECORDS.length} attendance records`);

    // 9. Generate additional attendance data for analytics
    console.log('📈 Generating additional attendance data...');
    const dates = [];
    const today = new Date();
    for (let i = 30; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      dates.push(date);
    }

    let additionalRecords = 0;
    for (const date of dates) {
      for (const cls of CLASSES) {
        if (cls.enrolledStudents && cls.enrolledStudents.length > 0) {
          const classId = classMap.get(cls.id);
          const facultyId = facultyMap.get(cls.facultyId);
          
          for (const studentId of cls.enrolledStudents) {
            const student = studentMap.get(studentId);
            if (student && classId && facultyId) {
              // Random attendance status
              const rand = Math.random();
              let status = 'present';
              if (rand < 0.1) status = 'absent';
              else if (rand < 0.15) status = 'late';
              else if (rand < 0.17) status = 'excused';

              const recordId = `att_${date.getTime()}_${studentId}_${cls.id}`;
              
              try {
                await prisma.attendanceRecord.create({
                  data: {
                    id: recordId,
                    studentId: student,
                    classId: classId,
                    facultyId: facultyId,
                    date: date,
                    status: status,
                    checkInTime: status !== 'absent' ? '14:00:00' : null,
                    checkOutTime: status !== 'absent' ? '16:00:00' : null,
                    method: 'manual',
                    location: cls.room
                  }
                });
                additionalRecords++;
              } catch (error) {
                // Record might already exist, skip
              }
            }
          }
        }
      }
    }
    console.log(`✅ Generated ${additionalRecords} additional attendance records`);

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Departments: ${MOCK_DEPARTMENTS.length}`);
    console.log(`- Faculty: ${FACULTY.length}`);
    console.log(`- Courses: ${COURSES.length}`);
    console.log(`- Classes: ${CLASSES.length}`);
    console.log(`- Students: ${MOCK_STUDENTS.length}`);
    console.log(`- Enrollments: ${enrollmentCount}`);
    console.log(`- Attendance Sessions: ${ATTENDANCE_SESSIONS.length}`);
    console.log(`- Attendance Records: ${ATTENDANCE_RECORDS.length + additionalRecords}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });