const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

async function test() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');
  
  try {
    // Clean first
    await User.deleteMany({});
    console.log('Cleared users');
    
    // Create one test user
    const user = await User.create({
      name: 'Test Admin',
      email: 'admin@fpv.com',
      password: 'admin123',
      role: 'admin'
    });
    console.log('SUCCESS! Created user:', user.email, user.role);
    console.log('Password hashed:', user.password.substring(0, 10) + '...');
  } catch (err) {
    console.error('FULL ERROR:');
    console.error('Name:', err.name);
    console.error('Message:', err.message);
    console.error('Stack:', err.stack);
  }
  
  process.exit();
}

test();
