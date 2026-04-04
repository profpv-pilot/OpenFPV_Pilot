const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

dotenv.config();

const mockUsers = [
  { name: "Admin User", email: "admin@fpv.com", password: "admin123", role: "admin" },
  { name: "Power User", email: "power@fpv.com", password: "power123", role: "power_user" },
  { name: "Student User", email: "student@fpv.com", password: "student123", role: "student" },
  { name: "Buyer User", email: "buyer@fpv.com", password: "buyer123", role: "buyer" }
];

const products = [
  {
    id: "hx5-carbon",
    name: "HX5 Carbon Frame",
    price: 3499,
    category: "Frames",
    description: "High-grade 5mm 3K Carbon Fiber frame for freestyle agility.",
    image: "/images/products/frame1.jpg",
    specs: { material: "3K Carbon", weight: "125g", size: "220mm" }
  },
  {
    id: "nexus-2507",
    name: "Nexus 2507 Motor",
    price: 1850,
    category: "Motors",
    description: "2507 1850KV Brushless motor for 6S high-torque performance.",
    image: "/images/products/motor1.jpg",
    specs: { kv: "1850KV", cells: "4-6S", weight: "38g" }
  },
  {
    id: "storm-6s-1300",
    name: "Storm 6S 1300mAh",
    price: 2200,
    category: "Batteries",
    description: "High-discharge 120C LiPo battery for racing and freestyle.",
    image: "/images/products/battery1.jpg",
    specs: { capacity: "1300mAh", voltage: "22.2V", discharge: "120C" }
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/openfpv_pilot');
    
    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});
    await User.syncIndexes();

    // Insert new
    await Product.insertMany(products);

    // Pre-hash passwords before inserting (bypass Mongoose pre-save hook)
    const hashedUsers = mockUsers.map(u => ({
      ...u,
      password: bcrypt.hashSync(u.password, 10)
    }));
    await User.insertMany(hashedUsers);

    console.log('Seeding Process Completed');
    
    // Verify
    const userCount = await User.countDocuments();
    console.log(`Users created: ${userCount}`);

    process.exit();
  } catch (err) {
    console.error('CRITICAL SEED ERROR:', err.stack || err);
    process.exit(1);
  }
};

seedDB();
