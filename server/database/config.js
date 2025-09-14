const { Pool } = require('pg');

const pool = new Pool({
  host: 'db-attendance.covgegce8sb0.us-east-1.rds.amazonaws.com',
  port: 5432,
  database: 'attendance-db',
  user: 'postgres',
  password: 'attendance123',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  ssl: {
    rejectUnauthorized: false,
    require: true
  }
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Database connection error:', err);
});

module.exports = pool;