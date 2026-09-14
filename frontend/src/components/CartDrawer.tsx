import { useEffect } from 'react';
import { fmt } from '../data/products';
import { useStore } from '../store';
import {
  IconArrowRight,
  IconBasket,
  IconClose,
  IconMinus,
  IconPlus,
  IconTrash,
  IconTruck,
} from './icons';

export function CartDrawer({
  open,
  onClose,
  onCheckout,
}: {
  open: boolean;
  onClose: () => void;
  onCheckout: () => void;
}) {
  const { lines, setQty, remove, subtotal, shipping, total, remainingForFree, freeShipProgress, count, pushToast } =
    useStore();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    if (open) {
      window.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  return (
    <div className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      {/* backdrop */}
      <button
        aria-label="Close cart"
        onClick={onClose}
        className={`absolute inset-0 w-full cursor-pointer bg-espresso-950/70 backdrop-blur-[2px] transition-opacity duration-400 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
        tabIndex={open ? 0 : -1}
      />

      {/* panel */}
      <aside
        role="dialog"
        aria-label="Shopping cart"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-cream-100/12 bg-espresso-900 shadow-[-30px_0_80px_-20px_rgba(0,0,0,0.8)] transition-transform duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* header */}
        <div className="flex items-center justify-between border-b border-cream-100/10 px-6 py-5">
          <h2 className="flex items-center gap-3 font-display text-2xl font-semibold text-cream-50">
            Your bag
            <span className="rounded-full bg-honey-400 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-espresso-950">
              {count}
            </span>
          </h2>
          <button
            onClick={onClose}
            aria-label="Close cart"
            className="btn-press grid h-10 w-10 place-items-center rounded-full border border-cream-100/15 text-cream-300 transition-colors hover:border-honey-400/60 hover:text-honey-300"
          >
            <IconClose className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* free shipping meter */}
        <div className="border-b border-cream-100/10 bg-espresso-850/60 px-6 py-4">
          <p className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-cream-300">
            <IconTruck className="h-4 w-4 text-honey-400" />
            {remainingForFree > 0 ? (
              <>
                <span className="text-honey-300">{fmt(remainingForFree)}</span> away from free
                shipping
              </>
            ) : (
              <span className="text-olive-300">Free shipping unlocked — nice.</span>
            )}
          </p>
          <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-espresso-700">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                remainingForFree > 0 ? 'bg-honey-400' : 'bg-olive-400'
              }`}
              style={{ width: `${freeShipProgress * 100}%` }}
            />
          </div>
        </div>

        {/* lines */}
        <div className="warm-scroll flex-1 overflow-y-auto px-6 py-5">
          {lines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <span className="grid h-20 w-20 place-items-center rounded-full border border-dashed border-cream-100/20 text-cream-700">
                <IconBasket className="h-9 w-9" />
              </span>
              <h3 className="mt-5 font-display text-2xl font-semibold text-cream-100">
                The bag is empty
              </h3>
              <p className="mt-2 max-w-[240px] text-[14px] text-cream-500">
                Six fresh roasts are waiting on the shelf. Go pick a flavor.
              </p>
              <button
                onClick={onClose}
                className="btn-press group mt-6 inline-flex items-center gap-2.5 rounded-full bg-honey-400 px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-espresso-950 hover:bg-honey-300"
              >
                Back to the shelf
                <IconArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          ) : (
            <ul className="flex flex-col gap-5">
              {lines.map((line) => (
                <li
                  key={line.key}
                  className="toast-in flex gap-4 rounded-[1.1rem] border border-cream-100/10 bg-espresso-850 p-3.5 transition-colors hover:border-honey-400/25"
                >
                  <div className="h-20 w-16 shrink-0 overflow-hidden rounded-lg">
                    <img
                      src={line.product.image}
                      alt={line.product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className="truncate font-display text-[16.5px] font-semibold text-cream-50">
                          {line.product.name}
                        </h4>
                        <p className="mt-0.5 font-mono text-[9.5px] uppercase tracking-[0.14em] text-cream-700">
                          {line.grind} grind · {line.product.weight}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          remove(line.key);
                          pushToast(`${line.product.name} removed`);
                        }}
                        aria-label={`Remove ${line.product.name}`}
                        className="btn-press shrink-0 rounded-full p-1.5 text-cream-700 transition-colors hover:bg-rust-500/20 hover:text-rust-300"
                      >
                        <IconTrash className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-2.5 flex items-center justify-between">
                      <div className="flex items-center rounded-full border border-cream-100/15">
                        <button
                          onClick={() => setQty(line.key, line.qty - 1)}
                          aria-label="Decrease quantity"
                          className="btn-press grid h-8 w-8 place-items-center text-cream-300 hover:text-honey-300"
                        >
                          <IconMinus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-7 text-center font-display text-[15px] font-semibold text-cream-50">
                          {line.qty}
                        </span>
                        <button
                          onClick={() => setQty(line.key, line.qty + 1)}
                          aria-label="Increase quantity"
                          className="btn-press grid h-8 w-8 place-items-center text-cream-300 hover:text-honey-300"
                        >
                          <IconPlus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="font-display text-[17px] font-semibold text-honey-300">
                        {fmt(line.product.price * line.qty)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* footer */}
        {lines.length > 0 && (
          <div className="border-t border-cream-100/10 bg-espresso-850/80 px-6 py-5">
            <dl className="flex flex-col gap-2 font-mono text-[12px] uppercase tracking-[0.12em]">
              <div className="flex justify-between text-cream-500">
                <dt>Subtotal</dt>
                <dd className="text-cream-100">{fmt(subtotal)}</dd>
              </div>
              <div className="flex justify-between text-cream-500">
                <dt>Shipping</dt>
                <dd className={shipping === 0 ? 'text-olive-300' : 'text-cream-100'}>
                  {shipping === 0 ? 'Free' : fmt(shipping)}
                </dd>
              </div>
              <div className="mt-1 flex justify-between border-t border-cream-100/10 pt-3 text-[13px]">
                <dt className="text-cream-300">Total</dt>
                <dd className="font-display text-xl font-semibold normal-case tracking-normal text-honey-300">
                  {fmt(total)}
                </dd>
              </div>
            </dl>
            <button
              onClick={onCheckout}
              className="btn-press group mt-4 flex w-full items-center justify-center gap-3 rounded-full bg-honey-400 py-4 font-mono text-[12px] font-semibold uppercase tracking-[0.18em] text-espresso-950 transition-colors hover:bg-honey-300"
            >
              Checkout · {fmt(total)}
              <IconArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <p className="mt-3 text-center font-mono text-[9.5px] uppercase tracking-[0.16em] text-cream-700">
              Demo checkout — no real payment is taken
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}
