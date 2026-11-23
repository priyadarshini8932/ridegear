'use client';
import Link from 'next/link';
import { useCart } from '@/lib/cart';
import { rs } from '@/lib/api';

export default function ProductCard({ p }) {
  const { add } = useCart();
  const off = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
  return (
    <article className="card flex flex-col">
      <Link href={`/product/${p._id}`} className="relative block overflow-hidden bg-mist">
        <img src={p.image} alt={p.name} className="zoom aspect-square w-full object-cover" loading="lazy" />
        {p.badge && <span className="absolute left-3 top-3 rounded-full bg-ink px-3 py-1 text-xs font-bold text-white">{p.badge}</span>}
        {off > 0 && <span className="absolute right-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-bold text-white">{off}% off</span>}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <Link href={`/product/${p._id}`} className="font-extrabold leading-snug hover:text-accent">{p.name}</Link>
        <p className="text-sm font-semibold text-neutral-500">★ {p.rating} · {p.category}</p>
        <p className="mt-auto flex items-baseline gap-2">
          <span className="text-xl font-extrabold">{rs(p.price)}</span>
          {p.oldPrice && <span className="text-sm text-neutral-400 line-through">{rs(p.oldPrice)}</span>}
        </p>
        <button disabled={p.stock < 1} onClick={() => add(p)} className="btn cta-gradient disabled:opacity-40">
          {p.stock < 1 ? 'Out of stock' : 'Add to cart'}
        </button>
      </div>
    </article>
  );
}
