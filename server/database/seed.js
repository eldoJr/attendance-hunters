const prisma = require('./client');

async function seedDatabase() {
  try {
    console.log('Seeding database...');

    // Create departments
    const departments = await prisma.department.createMany({
      data: [
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
      ]
    });

    console.log(`Created ${departments.count} departments`);

    // Create sample users
    const users = await prisma.user.createMany({
      data: [
        {
          id: 'user_001',
          email: 'admin@university.edu',
          name: 'System Admin',
          role: 'admin'
        },
        {
          id: 'user_002',
          email: 'sarah.smith@university.edu',
          name: 'Dr. Sarah Smith',
          role: 'staff'
        },
        {
          id: 'user_003',
          email: 'alice.johnson@university.edu',
          name: 'Alice Johnson',
          role: 'student'
        }
      ]
    });

    console.log(`Created ${users.count} users`);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();