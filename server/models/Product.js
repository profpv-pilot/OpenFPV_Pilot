const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  brand: { type: String },
  description: { type: String },
  imageId: { type: String }, // GridFS file ID for image
  videoId: { type: String }, // GridFS file ID for video
  sku: { type: String },
  useCase: { type: String },
  smartTag: { type: String },
  specs: { type: mongoose.Schema.Types.Mixed, default: {} },
  stock: { type: Number, default: 10 },
  rating: { type: Number, default: 4.5 },
  numReviews: { type: Number, default: 0 }
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
