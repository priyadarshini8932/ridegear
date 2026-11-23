'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API, rs } from '@/lib/api';
import { useCart } from '@/lib/cart';

export default function Checkout() {
  const { items, total, clear } = useCart();
  const router = useRouter();
  const [f, setF] = useState({ name: '', phone: '', address: '', payment: 'COD' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setBusy(true);
    try {
      const r = await fetch(`${API}/api/orders`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...f, items: items.map(i => ({ productId: i._id, qty: i.qty })) })
      });
      const d = await r.json();
      if (!d.success) throw new Error(d.error || 'Order failed');
      clear();
      router.push(`/orders?phone=${encodeURIComponent(f.phone)}&placed=1`);
    } catch (e) { setErr(e.message); }
    setBusy(false);
  };

  if (!items.length) return <p className="mx-auto max-w-7xl px-4 py-24 font-bold">Your cart is empty. Add something from the shop first.</p>;

  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 md:grid-cols-5">
      <form onSubmit={submit} className="space-y-4 md:col-span-3">
        <h1 className="text-3xl font-extrabold">Checkout</h1>
        <input required className="input" placeholder="Full name" value={f.name} onChange={set('name')} />
        <input required className="input" placeholder="Phone number" inputMode="tel" pattern="[0-9+ ]{10,15}" value={f.phone} onChange={set('phone')} />
        <textarea required rows={3} className="input" placeholder="Delivery address" value={f.address} onChange={set('address')} />
        <select className="input" value={f.payment} onChange={set('payment')} aria-label="Payment method">
          <option value="COD">Cash on delivery</option><option value="UPI">UPI</option><option value="Card">Card</option>
        </select>
        <p className="text-sm font-semibold text-neutral-500">UPI and card are recorded as your choice only. Online payment is not connected yet.</p>
        {err && <p className="font-bold text-accent" role="alert">{err}</p>}
        <button disabled={busy} className="btn cta-gradient w-full">{busy ? 'Placing order…' : `Place order · ${rs(total)}`}</button>
      </form>
      <aside className="card h-fit p-6 md:col-span-2">
        <h2 className="font-extrabold">Order summary</h2>
        {items.map(i => <p key={i._id} className="mt-3 flex justify-between text-sm font-semibold"><span>{i.name} × {i.qty}</span><span>{rs(i.price * i.qty)}</span></p>)}
        <p className="mt-5 flex justify-between border-t pt-4 text-lg font-extrabold"><span>Total</span><span>{rs(total)}</span></p>
      </aside>
    </div>
  );
}
