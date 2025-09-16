const jwt = require('jsonwebtoken');

// Create a test token for development
const testUser = {
  id: 'fac_001',
  email: 'faculty@test.com',
  name: 'Test Faculty',
  role: 'staff'
};

const token = jwt.sign(testUser, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '24h' });

console.log('Test token for development:');
console.log(token);
console.log('\nAdd this to localStorage in browser console:');
console.log(`localStorage.setItem('auth_token', '${token}');`);