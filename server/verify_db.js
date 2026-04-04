const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');
require('dotenv').config();

const verifyConnection = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/openfpv_pilot');
    console.log('Connected Successfully!');
    
    const count = await Product.countDocuments();
    console.log(`Number of products in Database: ${count}`);
    
    const userCount = await User.countDocuments();
    console.log(`Number of users in Database: ${userCount}`);
    
    const users = await User.find({}, { email: 1, role: 1, _id: 0 });
    console.log('All Users:', JSON.stringify(users, null, 2));
    
    process.exit(0);
  } catch (err) {
    console.error('Connection Failed:', err.message);
    process.exit(1);
  }
};

verifyConnection();
