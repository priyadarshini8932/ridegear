'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { API, rs } from '@/lib/api';

function Orders() {
  const params = useSearchParams();
  const [phone, setPhone] = useState(params.get('phone') || '');
  const [orders, setOrders] = useState(null);

  const load = (p) => fetch(`${API}/api/orders${p ? `?phone=${encodeURIComponent(p)}` : ''}`).then(r => r.json()).then(setOrders).catch(() => setOrders([]));
  useEffect(() => { if (params.get('phone')) load(params.get('phone')); }, []); // eslint-disable-line

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      {params.get('placed') && <p className="mb-6 rounded-2xl bg-ink p-4 font-bold text-white">Order placed. We will confirm it by phone.</p>}
      <h1 className="text-3xl font-extrabold">Your orders</h1>
      <form onSubmit={e => { e.preventDefault(); load(phone); }} className="mt-6 flex gap-3">
        <input className="input" placeholder="Phone number used at checkout" value={phone} onChange={e => setPhone(e.target.value)} />
        <button className="btn btn-dark">Find orders</button>
      </form>
      <div className="mt-8 space-y-4">
        {orders?.length === 0 && <p className="font-semibold text-neutral-500">No orders found for that number.</p>}
        {orders?.map(o => (
          <div key={o._id} className="card p-5">
            <div className="flex justify-between font-extrabold"><span>{new Date(o.createdAt).toLocaleDateString('en-IN')}</span><span>{rs(o.total)}</span></div>
            <p className="mt-1 text-sm font-bold text-accent">{o.status} · {o.payment}</p>
            {o.items.map((i, k) => <p key={k} className="mt-2 text-sm font-semibold">{i.name || i.productId} × {i.qty}</p>)}
          </div>
        ))}
      </div>
    </div>
  );
}
export default function Page() { return <Suspense fallback={null}><Orders /></Suspense>; }
