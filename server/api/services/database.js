// Database service wrapper
let prisma;

try {
  // Try to load Prisma client (will work when database is set up)
  prisma = require('../../database/client');
} catch (error) {
  console.warn('Prisma client not available. Database operations will fail until setup is complete.');
  prisma = null;
}

const getClient = () => {
  if (!prisma) {
    throw new Error('Database not initialized. Please run database setup first.');
  }
  return prisma;
};

module.exports = { getClient };