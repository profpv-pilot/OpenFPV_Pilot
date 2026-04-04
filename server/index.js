const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const Product = require('./models/Product');
const session = require('express-session');
const passport = require('passport');
const { protect } = require('./middleware/auth');
const User = require('./models/User');
const upload = require('./config/storage');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const { ObjectId } = require('mongodb');


connectDB();
require('./config/passport')(passport);

// Init GridFS
let gfs, gridfsBucket;
const conn = mongoose.connection;
conn.once('open', () => {
  gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'uploads'
  });
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

const app = express();

// ── Middleware ──────────────────────────────────────────────
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'fpv_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

app.use(passport.initialize());
app.use(passport.session());

// ── Auth Routes ────────────────────────────────────────────

// Local login
app.post('/api/auth/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return res.status(500).json({ message: err.message });
    if (!user) return res.status(401).json({ message: info?.message || 'Invalid credentials' });
    req.logIn(user, (err) => {
      if (err) return res.status(500).json({ message: err.message });
      return res.json(user);
    });
  })(req, res, next);
});

// Get current user
app.get('/api/auth/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

// Logout
app.get('/api/auth/logout', (req, res) => {
  req.logout(() => {
    res.json({ message: 'Logged out successfully' });
  });
});

// Google OAuth
app.get('/api/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
app.get('/api/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => res.redirect('http://localhost:1337/shop')
);

// GitHub OAuth
app.get('/api/auth/github',
  passport.authenticate('github', { scope: ['user:email'] })
);
app.get('/api/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => res.redirect('http://localhost:1337/shop')
);

// GET current user profile
app.get('/api/auth/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address,
        phone: user.phone,
        bio: user.bio,
        avatarId: user.avatarId
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE user profile
app.put('/api/auth/profile', protect, upload.single('avatar'), async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.address = req.body.address || user.address;
      user.phone = req.body.phone || user.phone;
      user.bio = req.body.bio || user.bio;
      
      if (req.file) {
        user.avatarId = req.file.id;
      }

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        address: updatedUser.address,
        phone: updatedUser.phone,
        bio: updatedUser.bio,
        avatarId: updatedUser.avatarId
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Product Routes ─────────────────────────────────────────
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Cart Routes (Protected) ───────────────────────────────
app.get('/api/cart', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/cart', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = req.body.cart;
    await user.save();
    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Product Admin Routes ───────────────────────────────────

// Admin middleware
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

// Create Product (with media)
app.post('/api/products', protect, admin, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), async (req, res) => {
  try {
    const { name, category, price, brand, description, specs, stock, sku, useCase, smartTag } = req.body;
    
    const product = new Product({
      name,
      category,
      price,
      brand,
      description,
      stock: parseInt(stock) || 0,
      sku,
      useCase,
      smartTag,
      specs: specs ? JSON.parse(specs) : {},
      imageId: req.files['image'] ? req.files['image'][0].id : null,
      videoId: req.files['video'] ? req.files['video'][0].id : null
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update Product
app.put('/api/products/:id', protect, admin, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const { name, category, price, brand, description, specs, stock, sku, useCase, smartTag } = req.body;
    
    product.name = name || product.name;
    product.category = category || product.category;
    product.price = price || product.price;
    product.brand = brand || product.brand;
    product.description = description || product.description;
    product.stock = parseInt(stock) || product.stock;
    if (sku !== undefined) product.sku = sku;
    if (useCase !== undefined) product.useCase = useCase;
    if (smartTag !== undefined) product.smartTag = smartTag;
    if (specs) {
      product.specs = typeof specs === 'string' ? JSON.parse(specs) : specs;
    }

    if (req.files['image']) product.imageId = req.files['image'][0].id;
    if (req.files['video']) product.videoId = req.files['video'][0].id;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete Product
app.delete('/api/products/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Remove from DB
    await Product.findByIdAndDelete(req.params.id);
    
    // Cleanup media (optional, GridFS files remain otherwise)
    if (product.imageId) gridfsBucket.delete(new ObjectId(product.imageId));
    if (product.videoId) gridfsBucket.delete(new ObjectId(product.videoId));

    res.json({ message: 'Product removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Media Stream
app.get('/api/media/:id', (req, res) => {
  try {
    const _id = new ObjectId(req.params.id);
    const readstream = gridfsBucket.openDownloadStream(_id);
    readstream.pipe(res);
    
    readstream.on('error', () => {
      res.status(404).json({ message: 'Media not found' });
    });
  } catch (err) {
    res.status(400).json({ message: 'Invalid ID' });
  }
});

// ── Start Server ───────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
