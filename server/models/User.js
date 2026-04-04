const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional for OAuth
  role: { 
    type: String, 
    required: true, 
    enum: ['admin', 'power_user', 'student', 'buyer'],
    default: 'buyer' 
  },
  avatarId: { type: mongoose.Schema.Types.ObjectId }, // GridFS reference
  address: { type: String },
  phone: { type: String },
  bio: { type: String },
  cart: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, default: 1 }
    }
  ]
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', function(next) {
  if (!this.isModified('password')) return next();
  try {
    this.password = bcrypt.hashSync(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
