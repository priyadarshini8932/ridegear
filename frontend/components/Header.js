'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useCart } from '@/lib/cart';

export default function Header() {
  const { count, setOpen } = useCart();
  const [q, setQ] = useState('');
  const router = useRouter();
  const go = (e) => { e.preventDefault(); router.push(`/?search=${encodeURIComponent(q)}#shop`); };

  return (
    <header className="sticky top-0 z-40 glass">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
        <Link href="/" className="text-2xl font-extrabold tracking-tight">Ride<span className="text-accent">Gear</span></Link>
        <form onSubmit={go} className="mx-auto hidden w-full max-w-md sm:block">
          <input value={q} onChange={e => setQ(e.target.value)} className="input !rounded-full !py-2" placeholder="Search accessories" aria-label="Search products" />
        </form>
        <nav className="ml-auto flex items-center gap-4 text-sm font-bold">
          <Link href="/#shop" className="hidden md:block hover:text-accent">Shop</Link>
          <Link href="/orders" className="hover:text-accent">Orders</Link>
          <button onClick={() => setOpen(true)} className="btn btn-dark !px-4 !py-2" aria-label="Open cart">
            Cart <span className="rounded-full bg-accent px-2 text-xs">{count}</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
