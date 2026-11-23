const mongoose = require('mongoose');
module.exports = mongoose.model('Order', new mongoose.Schema({
  items: [{ productId: String, name: String, qty: Number, price: Number }],
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  total: Number,
  payment: { type: String, enum: ['COD', 'UPI', 'Card'], default: 'COD' },
  status: { type: String, default: 'placed' }
}, { timestamps: true }));
