'use client';
import { useState } from 'react';
import { API } from '@/lib/api';
import ProductCard from './ProductCard';

export default function AIBox() {
  const [q, setQ] = useState('');
  const [res, setRes] = useState(null);
  const [busy, setBusy] = useState(false);

  const ask = async (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    setBusy(true);
    try {
      const r = await fetch(`${API}/api/ai/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question: q }) });
      setRes(await r.json());
    } catch { setRes({ answer: 'Could not reach the server. Check that the API is running.', results: [] }); }
    setBusy(false);
  };

  return (
    <section id="ai" className="mx-auto max-w-7xl px-4 py-16">
      <div className="rounded-card bg-ink p-8 text-white md:p-12">
        <h2 className="text-3xl font-extrabold md:text-4xl">Not sure what to buy?</h2>
        <p className="mt-2 font-semibold text-neutral-300">Tell us your budget, like “best under 999”.</p>
        <form onSubmit={ask} className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Best under 999?" className="input !border-transparent !text-ink" aria-label="Ask the assistant" />
          <button disabled={busy} className="btn cta-gradient whitespace-nowrap">{busy ? 'Finding…' : 'Ask AI'}</button>
        </form>
        {res && <p className="mt-6 font-bold text-orange-300">{res.answer}</p>}
        {res?.results?.length > 0 && (
          <div className="mt-6 grid gap-6 text-ink sm:grid-cols-2 lg:grid-cols-3">{res.results.map(p => <ProductCard key={p._id} p={p} />)}</div>
        )}
      </div>
    </section>
  );
}
