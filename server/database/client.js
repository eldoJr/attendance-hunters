const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['info', 'warn', 'error'],
  errorFormat: 'pretty',
});

// Connection health check
let isConnected = false;

const checkConnection = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    if (!isConnected) {
      console.log('Database connected successfully');
      isConnected = true;
    }
    return true;
  } catch (error) {
    console.error('Database connection failed:', error.message);
    isConnected = false;
    return false;
  }
};

// Initial connection check
checkConnection();

// Periodic health check
setInterval(checkConnection, 30000); // Check every 30 seconds

// Handle graceful shutdown
process.on('beforeExit', async () => {
  console.log('Disconnecting from database...');
  await prisma.$disconnect();
});

process.on('SIGINT', async () => {
  console.log('Disconnecting from database...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Disconnecting from database...');
  await prisma.$disconnect();
  process.exit(0);
});

module.exports = prisma;