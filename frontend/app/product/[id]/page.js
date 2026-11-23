'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { API, rs } from '@/lib/api';
import { useCart } from '@/lib/cart';

export default function ProductPage() {
  const { id } = useParams();
  const { add } = useCart();
  const [p, setP] = useState(null);
  const [err, setErr] = useState('');
  const [qty, setQty] = useState(1);

  useEffect(() => {
    fetch(`${API}/api/products/${id}`).then(r => r.ok ? r.json() : Promise.reject()).then(setP).catch(() => setErr('We could not find this product.'));
  }, [id]);

  if (err) return <p className="mx-auto max-w-7xl px-4 py-24 font-bold">{err}</p>;
  if (!p) return <p className="mx-auto max-w-7xl px-4 py-24 font-bold">Loading…</p>;

  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-2">
      <img src={p.image} alt={p.name} className="w-full rounded-card shadow-[0_20px_40px_rgba(0,0,0,.12)]" />
      <div>
        <p className="font-bold text-accent">{p.category}</p>
        <h1 className="mt-1 text-4xl font-extrabold leading-tight">{p.name}</h1>
        <p className="mt-2 font-semibold text-neutral-500">★ {p.rating}</p>
        <p className="mt-6 flex items-baseline gap-3">
          <span className="text-4xl font-extrabold">{rs(p.price)}</span>
          {p.oldPrice && <span className="text-lg text-neutral-400 line-through">{rs(p.oldPrice)}</span>}
        </p>
        <p className="mt-6 max-w-prose font-medium leading-relaxed text-neutral-700">{p.description}</p>
        <p className="mt-4 text-sm font-bold">{p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}</p>
        <div className="mt-8 flex items-center gap-4">
          <div className="flex items-center gap-3 rounded-full bg-mist px-3 py-2">
            <button onClick={() => setQty(Math.max(1, qty - 1))} className="h-8 w-8 rounded-full bg-white font-bold" aria-label="Decrease quantity">−</button>
            <span className="w-6 text-center font-extrabold">{qty}</span>
            <button onClick={() => setQty(Math.min(p.stock, qty + 1))} className="h-8 w-8 rounded-full bg-white font-bold" aria-label="Increase quantity">+</button>
          </div>
          <button disabled={p.stock < 1} onClick={() => add(p, qty)} className="btn cta-gradient flex-1 disabled:opacity-40">Add to cart</button>
        </div>
      </div>
    </div>
  );
}
