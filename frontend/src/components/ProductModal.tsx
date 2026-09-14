import { useEffect, useState } from 'react';
import { GRINDS, fmt, type Grind, type Product } from '../data/products';
import { useStore } from '../store';
import { RoastMeter } from './ProductCard';
import {
  IconBasket,
  IconBean,
  IconClose,
  IconLeaf,
  IconMinus,
  IconMountain,
  IconPlus,
  IconStar,
  IconTruck,
} from './icons';

export function ProductModal({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const { add, pushToast } = useStore();
  const [grind, setGrind] = useState<Grind>('Whole bean');
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (product) {
      setGrind('Whole bean');
      setQty(1);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [product]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!product) return null;

  const specs = [
    { icon: <IconMountain className="h-4.5 w-4.5" />, label: 'Altitude', value: product.altitude },
    { icon: <IconBean className="h-4.5 w-4.5" />, label: 'Varietal', value: product.varietal },
    { icon: <IconLeaf className="h-4.5 w-4.5" />, label: 'Process', value: product.process },
    { icon: <IconTruck className="h-4.5 w-4.5" />, label: 'Ships within', value: '48 h of roast' },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={product.name}>
      <button
        aria-label="Close details"
        onClick={onClose}
        className="absolute inset-0 cursor-pointer bg-espresso-950/78 backdrop-blur-sm"
      />

      <div className="modal-in warm-scroll relative max-h-[92dvh] w-full max-w-4xl overflow-y-auto rounded-t-[1.8rem] border border-cream-100/12 bg-espresso-900 shadow-[0_50px_120px_-30px_rgba(0,0,0,0.95)] sm:rounded-[1.8rem]">
        <button
          onClick={onClose}
          aria-label="Close"
          className="btn-press absolute right-4 top-4 z-20 grid h-10 w-10 place-items-center rounded-full border border-cream-100/15 bg-espresso-950/70 text-cream-300 backdrop-blur-sm transition-colors hover:border-honey-400/60 hover:text-honey-300"
        >
          <IconClose className="h-4.5 w-4.5" />
        </button>

        <div className="grid md:grid-cols-[0.9fr_1.1fr]">
          {/* image */}
          <div className="relative">
            <div className="h-64 overflow-hidden sm:h-80 md:h-full md:min-h-[560px]">
              <img
                src={product.image}
                alt={`${product.name} coffee bag`}
                className="h-full w-full object-cover"
              />
            </div>
            {product.badge && (
              <span className="absolute left-4 top-4 rounded-full bg-rust-400 px-3.5 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-cream-50">
                {product.badge}
              </span>
            )}
            <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-espresso-950/85 px-4 py-2 backdrop-blur-sm">
              <IconStar className="h-3.5 w-3.5 text-honey-300" />
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-cream-100">
                Cup score {product.cupScore}
              </span>
            </div>
          </div>

          {/* details */}
          <div className="p-6 sm:p-8 lg:p-10">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.26em] text-honey-400">
              {product.origin} · {product.region}
            </p>
            <h2 className="mt-2.5 font-display text-4xl font-semibold tracking-tight text-cream-50">
              {product.name}
            </h2>
            <p className="mt-1.5 font-display text-lg italic text-cream-500">
              {product.notes.join(' · ')}
            </p>

            <div className="mt-5 flex items-center gap-4">
              <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-cream-700">
                Roast
              </span>
              <RoastMeter level={product.roastLevel} />
              <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-cream-500">
                {product.categoryLabel}
              </span>
            </div>

            <p className="mt-5 text-[15px] leading-relaxed text-cream-300">{product.description}</p>

            {/* specs */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              {specs.map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-cream-100/10 bg-espresso-850 px-4 py-3 transition-colors hover:border-honey-400/30"
                >
                  <p className="flex items-center gap-2 font-mono text-[9.5px] uppercase tracking-[0.2em] text-cream-700">
                    <span className="text-honey-400">{s.icon}</span> {s.label}
                  </p>
                  <p className="mt-1 text-[13px] font-medium text-cream-100">{s.value}</p>
                </div>
              ))}
            </div>

            {/* grind */}
            <div className="mt-6">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-cream-500">
                Grind — <span className="text-honey-300">{grind.toLowerCase()}</span>
              </p>
              <div className="mt-2.5 flex gap-2">
                {GRINDS.map((g) => (
                  <button
                    key={g}
                    onClick={() => setGrind(g)}
                    className={`btn-press flex-1 rounded-full border px-3 py-2.5 font-mono text-[10.5px] uppercase tracking-[0.1em] transition-all duration-200 ${
                      grind === g
                        ? 'border-honey-400 bg-honey-400 font-semibold text-espresso-950'
                        : 'border-cream-100/15 text-cream-300 hover:border-honey-400/50 hover:text-honey-300'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* qty + add */}
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <div className="flex items-center rounded-full border border-cream-100/15">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={qty <= 1}
                  aria-label="Decrease quantity"
                  className="btn-press grid h-12 w-12 place-items-center text-cream-300 transition-colors hover:text-honey-300 disabled:opacity-30"
                >
                  <IconMinus className="h-4.5 w-4.5" />
                </button>
                <span className="w-8 text-center font-display text-xl font-semibold text-cream-50" aria-live="polite">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => Math.min(12, q + 1))}
                  disabled={qty >= 12}
                  aria-label="Increase quantity"
                  className="btn-press grid h-12 w-12 place-items-center text-cream-300 transition-colors hover:text-honey-300 disabled:opacity-30"
                >
                  <IconPlus className="h-4.5 w-4.5" />
                </button>
              </div>

              <button
                onClick={() => {
                  add(product, grind, qty);
                  pushToast(`${qty} × ${product.name} added`, `${grind} grind · ${product.weight}`);
                  onClose();
                }}
                className="btn-press group inline-flex flex-1 items-center justify-center gap-3 rounded-full bg-honey-400 px-7 py-3.5 font-mono text-[12px] font-semibold uppercase tracking-[0.16em] text-espresso-950 transition-colors hover:bg-honey-300 sm:flex-none"
              >
                <IconBasket className="h-4.5 w-4.5" />
                Add to cart — {fmt(product.price * qty)}
              </button>
            </div>

            {/* story */}
            <div className="mt-7 rounded-xl border-l-2 border-honey-400/70 bg-espresso-850/70 px-5 py-4">
              <p className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-honey-400">
                From the sourcing log
              </p>
              <p className="mt-1.5 text-[13.5px] italic leading-relaxed text-cream-300">
                {product.story}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
