'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { API } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import AIBox from '@/components/AIBox';

const PERKS = ['Free delivery over ₹999', 'Cash on delivery', 'Easy returns', '4.9 rated by riders'];

function Shop() {
  const params = useSearchParams();
  const [products, setProducts] = useState([]);
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [f, setF] = useState({ search: params.get('search') || '', category: '', maxPrice: '', rating: '', sort: 'new' });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  useEffect(() => { setF(cur => ({ ...cur, search: params.get('search') || '' })); }, [params]);
  useEffect(() => { fetch(`${API}/api/categories`).then(r => r.json()).then(setCats).catch(() => {}); }, []);
  useEffect(() => {
    setLoading(true);
    const qs = new URLSearchParams(Object.entries(f).filter(([, v]) => v)).toString();
    fetch(`${API}/api/products?${qs}`).then(r => r.json()).then(d => setProducts(Array.isArray(d) ? d : [])).catch(() => setProducts([])).finally(() => setLoading(false));
  }, [f]);

  return (
    <section id="shop" className="mx-auto max-w-7xl px-4 py-16">
      <h2 className="text-3xl font-extrabold md:text-4xl">Shop</h2>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <input className="input" placeholder="Search" value={f.search} onChange={set('search')} aria-label="Search" />
        <select className="input" value={f.category} onChange={set('category')} aria-label="Category">
          <option value="">All categories</option>{cats.map(c => <option key={c}>{c}</option>)}
        </select>
        <select className="input" value={f.maxPrice} onChange={set('maxPrice')} aria-label="Max price">
          <option value="">Any price</option><option value="500">Under ₹500</option><option value="1000">Under ₹1,000</option><option value="2000">Under ₹2,000</option>
        </select>
        <select className="input" value={f.rating} onChange={set('rating')} aria-label="Minimum rating">
          <option value="">Any rating</option><option value="4.5">4.5 and up</option><option value="4.8">4.8 and up</option>
        </select>
        <select className="input" value={f.sort} onChange={set('sort')} aria-label="Sort">
          <option value="new">Newest</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="rating">Top rated</option>
        </select>
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map(p => <ProductCard key={p._id} p={p} />)}
      </div>
      {!loading && !products.length && <p className="mt-10 font-semibold text-neutral-500">Nothing matches those filters. Clear a filter to see more.</p>}
      {loading && <p className="mt-10 font-semibold text-neutral-500">Loading products…</p>}
    </section>
  );
}

export default function Home() {
  return (
    <>
      <section className="hero-bg text-white">
        <div className="mx-auto max-w-7xl px-4 py-24 md:py-36">
          <h1 className="text-6xl font-extrabold leading-none tracking-tight md:text-8xl">Ride<span className="text-accent">Gear</span></h1>
          <p className="mt-6 max-w-xl text-lg font-semibold text-neutral-300">Premium bike and car accessories, delivered fast. Ask our assistant what fits your budget.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#shop" className="btn cta-gradient">Shop now</a>
            <a href="#ai" className="btn btn-ghost">Ask AI</a>
          </div>
        </div>
      </section>

      <div className="overflow-hidden bg-accent py-3 text-white" aria-label="Store perks">
        <div className="marquee-track flex gap-12 font-extrabold">
          {[...PERKS, ...PERKS, ...PERKS, ...PERKS].map((t, i) => <span key={i} className="whitespace-nowrap">{t}</span>)}
        </div>
      </div>

      <Suspense fallback={null}><Shop /></Suspense>
      <AIBox />
    </>
  );
}
