const mongoose = require('mongoose');
module.exports = mongoose.model('Product', new mongoose.Schema({
  name: { type: String, required: true },
  category: String,
  price: { type: Number, required: true },
  oldPrice: Number,
  rating: { type: Number, default: 4.5 },
  image: String,
  stock: { type: Number, default: 0 },
  description: String,
  badge: String
}, { timestamps: true }));
