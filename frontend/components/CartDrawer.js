'use client';
import Link from 'next/link';
import { useCart, FREE_DELIVERY_AT } from '@/lib/cart';
import { rs } from '@/lib/api';

export default function CartDrawer() {
  const { items, open, setOpen, setQty, remove, total } = useCart();
  const left = Math.max(0, FREE_DELIVERY_AT - total);
  const pct = Math.min(100, (total / FREE_DELIVERY_AT) * 100);

  return (
    <>
      <div onClick={() => setOpen(false)} className={`fixed inset-0 z-40 bg-black/50 transition-opacity ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`} />
      <aside aria-hidden={!open} className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between border-b p-5">
          <h2 className="text-xl font-extrabold">Your cart</h2>
          <button onClick={() => setOpen(false)} className="text-2xl font-bold" aria-label="Close cart">×</button>
        </div>

        <div className="border-b p-5">
          <p className="mb-2 text-sm font-bold">{left ? `Add ${rs(left)} more for free delivery` : 'You get free delivery'}</p>
          <div className="h-2 overflow-hidden rounded-full bg-mist"><div className="h-full rounded-full bg-gradient-to-r from-accent to-orange-400 transition-all" style={{ width: pct + '%' }} /></div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {!items.length && <p className="font-semibold text-neutral-500">Your cart is empty. Pick something from the shop.</p>}
          {items.map(i => (
            <div key={i._id} className="flex gap-3">
              <img src={i.image} alt="" className="h-20 w-20 rounded-2xl object-cover" />
              <div className="flex-1">
                <p className="font-bold leading-tight">{i.name}</p>
                <p className="text-sm font-semibold text-neutral-500">{rs(i.price)}</p>
                <div className="mt-2 flex items-center gap-2">
                  <button onClick={() => setQty(i._id, i.qty - 1)} className="h-8 w-8 rounded-full bg-mist font-bold" aria-label="Decrease quantity">−</button>
                  <span className="w-6 text-center font-bold">{i.qty}</span>
                  <button onClick={() => setQty(i._id, i.qty + 1)} className="h-8 w-8 rounded-full bg-mist font-bold" aria-label="Increase quantity">+</button>
                  <button onClick={() => remove(i._id)} className="ml-auto text-sm font-bold text-accent">Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t p-5">
          <p className="mb-3 flex justify-between text-lg font-extrabold"><span>Total</span><span>{rs(total)}</span></p>
          <Link href="/checkout" onClick={() => setOpen(false)} className={`btn cta-gradient w-full ${items.length ? '' : 'pointer-events-none opacity-40'}`}>Go to checkout</Link>
        </div>
      </aside>
    </>
  );
}
