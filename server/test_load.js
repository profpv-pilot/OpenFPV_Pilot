try {
  console.log('Testing express...');
  require('express');
  console.log('Testing dotenv...');
  require('dotenv').config();
  console.log('Testing cors...');
  require('cors');
  console.log('Testing connect-mongo...');
  require('connect-mongo');
  console.log('Testing express-session...');
  require('express-session');
  console.log('Testing passport...');
  require('passport');
  console.log('Testing User model...');
  require('./models/User');
  console.log('Testing Passport config...');
  require('./config/passport');
  console.log('Testing auth middleware...');
  require('./middleware/auth');
  
  console.log('Testing connectDB function execution...');
  const connectDB = require('./config/db');
  console.log('Type of connectDB:', typeof connectDB);
  // Do not actually connect to avoid hanging, just check the mongoose object
  const mongoose = require('mongoose');
  console.log('Type of mongoose.connect:', typeof mongoose.connect);

  console.log('All dependencies and modules loaded successfully!');
} catch (e) {
  console.error('FAILED TO LOAD:');
  console.error(e);
}
