require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const img = (t) => `https://placehold.co/800x800/0A0A0A/FF3D00?text=${encodeURIComponent(t)}`;
const data = [
  { name: 'Carbon Phone Mount', category: 'Bike', price: 499, oldPrice: 999, rating: 4.8, stock: 50, badge: 'Bestseller', description: 'Vibration-damped handlebar phone mount with one-hand release.' },
  { name: 'LED Fog Light Pair', category: 'Bike', price: 799, oldPrice: 1299, rating: 4.7, stock: 30, badge: 'New', description: 'Waterproof dual-colour auxiliary lights with a switch kit.' },
  { name: 'Waterproof Tank Bag', category: 'Bike', price: 1299, oldPrice: 1999, rating: 4.6, stock: 20, description: 'Magnetic 12L tank bag with a clear map pocket.' },
  { name: 'Leather Steering Cover', category: 'Car', price: 599, oldPrice: 1099, rating: 4.5, stock: 40, description: 'Anti-slip stitched cover that fits most 37–39 cm wheels.' },
  { name: 'Tyre Inflator 12V', category: 'Car', price: 999, oldPrice: 1799, rating: 4.9, stock: 25, badge: 'Top rated', description: 'Digital auto-stop inflator with a built-in torch.' },
  { name: 'Dash Cam 1080p', category: 'Car', price: 2499, oldPrice: 3999, rating: 4.4, stock: 15, description: 'Wide-angle loop-recording cam with night mode.' }
].map(p => ({ ...p, image: img(p.name) }));

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Product.deleteMany({});
  await Product.insertMany(data);
  console.log(`Seeded ${data.length} products`);
  process.exit(0);
})();
