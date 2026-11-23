require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Product = require('./models/Product');
const Order = require('./models/Order');

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(e => { console.error('MongoDB error:', e.message); process.exit(1); });

app.get('/', (_, res) => res.json({ ok: true, service: 'RideGear API' }));

// List products: ?category= &search= &minPrice= &maxPrice= &rating= &sort=
app.get('/api/products', async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, rating, sort } = req.query;
    const q = {};
    if (category) q.category = category;
    if (search) q.name = { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
    if (minPrice || maxPrice) q.price = {
      ...(minPrice && { $gte: +minPrice }), ...(maxPrice && { $lte: +maxPrice })
    };
    if (rating) q.rating = { $gte: +rating };
    const sorts = { 'price-asc': { price: 1 }, 'price-desc': { price: -1 }, rating: { rating: -1 }, new: { createdAt: -1 } };
    res.json(await Product.find(q).sort(sorts[sort] || { createdAt: -1 }));
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ success: false, error: 'Product not found' });
    res.json(p);
  } catch { res.status(400).json({ success: false, error: 'Invalid product id' }); }
});

app.get('/api/categories', async (_, res) => res.json(await Product.distinct('category')));

// Place order. Prices and total are recalculated from the DB, never trusted from the client.
app.post('/api/orders', async (req, res) => {
  try {
    const { items = [], name, phone, address, payment } = req.body;
    if (!name || !phone || !address) return res.status(400).json({ success: false, error: 'Name, phone and address are required' });
    if (!items.length) return res.status(400).json({ success: false, error: 'Cart is empty' });

    const lines = [];
    let total = 0;
    for (const it of items) {
      const p = await Product.findById(it.productId);
      const qty = Math.max(1, parseInt(it.qty) || 1);
      if (!p) return res.status(400).json({ success: false, error: 'A product in your cart no longer exists' });
      if (p.stock < qty) return res.status(400).json({ success: false, error: `Only ${p.stock} left of ${p.name}` });
      lines.push({ productId: String(p._id), name: p.name, qty, price: p.price });
      total += p.price * qty;
    }
    for (const l of lines) await Product.updateOne({ _id: l.productId }, { $inc: { stock: -l.qty } });
    const order = await Order.create({ items: lines, name, phone, address, payment, total });
    res.status(201).json({ success: true, order });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// NOTE: no auth yet, so this returns every order. Add login before going public.
app.get('/api/orders', async (req, res) => {
  const q = req.query.phone ? { phone: req.query.phone } : {};
  res.json(await Order.find(q).sort({ createdAt: -1 }));
});

// AI assistant: understands a budget ("best under 999?") and a category word, then ranks by rating.
app.post('/api/ai/chat', async (req, res) => {
  try {
    const question = String(req.body.question || '');
    const m = question.match(/(\d[\d,]*)/);
    const budget = m ? parseInt(m[1].replace(/,/g, '')) : null;
    const q = { stock: { $gt: 0 } };
    if (budget) q.price = { $lte: budget };
    let list = await Product.find(q).sort({ rating: -1 }).limit(3);
    if (!list.length) list = await Product.find({ stock: { $gt: 0 } }).sort({ price: 1 }).limit(3);
    const answer = list.length
      ? `Top picks${budget ? ` under Rs ${budget}` : ''}: ` + list.map(p => `${p.name} (Rs ${p.price}, ${p.rating}★)`).join(', ')
      : 'No products in stock right now.';
    res.json({ success: true, answer, results: list });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.listen(process.env.PORT || 5000, () => console.log('API on', process.env.PORT || 5000));
