require('dotenv').config();
const bcrypt = require('bcryptjs');
const prisma = require('./client');

async function seedDatabase() {
  try {
    console.log('Seeding database...');

    // Hash passwords
    const adminPassword = await bcrypt.hash('admin123', 12);
    const staffPassword = await bcrypt.hash('staff123', 12);
    const studentPassword = await bcrypt.hash('student123', 12);

    // Create departments (upsert to handle existing data)
    const departments = [
      {
        id: 'dept_001',
        name: 'Electronics Engineering',
        code: 'EE',
        type: 'Engineering',
        status: 'Active',
        established: 1985,
        building: 'Engineering Block C'
      },
      {
        id: 'dept_002',
        name: 'Computer Science & Engineering',
        code: 'CSE',
        type: 'Technology',
        status: 'Active',
        established: 1995,
        building: 'Tech Building A'
      },
      {
        id: 'dept_003',
        name: 'Mathematics',
        code: 'MATH',
        type: 'Science',
        status: 'Active',
        established: 1975,
        building: 'Science Building A'
      }
    ];

    let deptCount = 0;
    for (const dept of departments) {
      await prisma.department.upsert({
        where: { code: dept.code },
        update: dept,
        create: dept
      });
      deptCount++;
    }
    console.log(`✅ Processed ${deptCount} departments`);

    // Create users (upsert to handle existing data)
    const users = [
      {
        id: 'user_001',
        email: 'admin@university.edu',
        password: adminPassword,
        name: 'System Admin',
        role: 'admin'
      },
      {
        id: 'user_002',
        email: 'sarah.smith@university.edu',
        password: staffPassword,
        name: 'Dr. Sarah Smith',
        role: 'staff'
      },
      {
        id: 'user_003',
        email: 'alice.johnson@university.edu',
        password: studentPassword,
        name: 'Alice Johnson',
        role: 'student'
      }
    ];

    let userCount = 0;
    for (const user of users) {
      await prisma.user.upsert({
        where: { email: user.email },
        update: { password: user.password, name: user.name, role: user.role },
        create: user
      });
      userCount++;
    }
    console.log(`✅ Processed ${userCount} users`);

    console.log('\n Database seeded successfully!');
    console.log('\n Login Credentials:');
    console.log('Admin: admin@university.edu / admin123');
    console.log('Staff: sarah.smith@university.edu / staff123');
    console.log('Student: alice.johnson@university.edu / student123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();