const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Product = require('./models/Product');

dotenv.config();
connectDB();

const products = [
  {
    name: 'HX5 Carbon Frame',
    category: 'frames',
    price: 89.99,
    brand: 'OpenFPV',
    image: '/images/products/hx5_frame.jpg', // Generalized path
    description: 'The HX5 is our flagship 5-inch freestyle frame — ultra-stiff, ultra-light, built for maximum impact resistance.',
    specs: {
      'Wheelbase': '215mm',
      'Weight': '98g',
      'Material': '3K Toray Carbon'
    },
    stock: 25,
    rating: 4.8,
    numReviews: 142
  },
  {
    name: 'Nexus 2507 Motor',
    category: 'motors',
    price: 24.99,
    brand: 'OpenFPV',
    image: '/images/products/nexus_motor.jpg',
    description: 'Precision-wound for maximum thrust-to-weight ratio. The Nexus 2507 delivers crisp response.',
    specs: {
      'Stator': '25x7mm',
      'KV': '2450KV',
      'Weight': '30.2g'
    },
    stock: 100,
    rating: 4.9,
    numReviews: 318
  },
  {
    name: 'Alpha F7 Flight Controller',
    category: 'flight-controllers',
    price: 64.99,
    brand: 'OpenFPV',
    image: '/images/products/alpha_fc.jpg',
    description: 'Flagship flight controller featuring the latest ICM-42688P gyro for silky-smooth filtering.',
    specs: {
      'MCU': 'STM32F745',
      'Gyro': 'ICM-42688P'
    },
    stock: 15,
    rating: 4.7,
    numReviews: 87
  },
  {
    name: 'Raptor FPV Camera',
    category: 'cameras',
    price: 44.99,
    brand: 'OpenFPV',
    image: '/images/products/raptor_cam.jpg',
    description: 'Crystal-clear, ultra-low-latency FPV imagery with exceptional dynamic range.',
    specs: {
      'Resolution': '1200TVL',
      'FOV': '165°'
    },
    stock: 40,
    rating: 4.6,
    numReviews: 203
  },
  {
    name: 'Helix FPV Goggles V2',
    category: 'goggles',
    price: 279.99,
    brand: 'OpenFPV',
    image: '/images/products/helix_goggles.jpg',
    description: 'Immersive flying experience with dual OLED panels and built-in DVR.',
    specs: {
      'Display': 'Dual 1080p OLED',
      'FOV': '46°'
    },
    stock: 5,
    rating: 4.9,
    numReviews: 521
  }
];

const importData = async () => {
  try {
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();
