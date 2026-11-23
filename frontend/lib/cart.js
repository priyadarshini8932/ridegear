'use client';
import { createContext, useContext, useEffect, useState } from 'react';

const Ctx = createContext(null);
export const useCart = () => useContext(Ctx);
export const FREE_DELIVERY_AT = 999;

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try { setItems(JSON.parse(localStorage.getItem('rg-cart') || '[]')); } catch {}
    setReady(true);
  }, []);
  useEffect(() => { if (ready) localStorage.setItem('rg-cart', JSON.stringify(items)); }, [items, ready]);

  const add = (p, qty = 1) => {
    setItems(cur => {
      const found = cur.find(i => i._id === p._id);
      if (found) return cur.map(i => i._id === p._id ? { ...i, qty: Math.min(i.qty + qty, p.stock || 99) } : i);
      return [...cur, { _id: p._id, name: p.name, price: p.price, image: p.image, stock: p.stock, qty }];
    });
    setOpen(true);
  };
  const setQty = (id, qty) => setItems(cur => cur.flatMap(i => i._id !== id ? [i] : qty < 1 ? [] : [{ ...i, qty: Math.min(qty, i.stock || 99) }]));
  const remove = (id) => setItems(cur => cur.filter(i => i._id !== id));
  const clear = () => setItems([]);
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);

  return <Ctx.Provider value={{ items, add, setQty, remove, clear, total, count, open, setOpen }}>{children}</Ctx.Provider>;
}
