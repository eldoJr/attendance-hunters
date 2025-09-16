const jwt = require('jsonwebtoken');

// Create an admin token for development
const adminUser = {
  id: 'admin_001',
  email: 'admin@test.com',
  name: 'Test Admin',
  role: 'admin'
};

const token = jwt.sign(adminUser, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '24h' });

console.log('Admin token for development:');
console.log(token);
console.log('\nAdd this to localStorage in browser console:');
console.log(`localStorage.setItem('auth_token', '${token}');`);