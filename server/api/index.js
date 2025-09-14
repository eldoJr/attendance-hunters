const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database client (will be available when database is set up)
// const prisma = require('../database/client');

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API server is running' });
});

// Database test endpoint (uncomment when database is set up)
// app.get('/api/db-test', async (req, res) => {
//   try {
//     const result = await prisma.$queryRaw`SELECT NOW()`;
//     res.json({ status: 'OK', timestamp: result[0].now });
//   } catch (error) {
//     res.status(500).json({ status: 'ERROR', message: error.message });
//   }
// });

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});