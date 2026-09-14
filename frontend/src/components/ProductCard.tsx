import { fmt, type Product } from '../data/products';
import { useStore } from '../store';
import { IconBasket, IconStar } from './icons';

export function RoastMeter({ level, className = '' }: { level: number; className?: string }) {
  return (
    <span className={`flex items-center gap-1 ${className}`} aria-label={`Roast level ${level} of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`h-1.5 w-1.5 rounded-full transition-colors ${
            i <= level ? 'bg-honey-400' : 'bg-cream-100/15'
          }`}
        />
      ))}
    </span>
  );
}

const BADGE_TONE: Record<string, string> = {
  'New crop': 'bg-olive-500 text-cream-50',
  'Best seller': 'bg-honey-400 text-espresso-950',
  'Limited — 40 bags': 'bg-rust-400 text-cream-50',
  'Espresso pick': 'bg-espresso-950/85 text-honey-300 border border-honey-400/40',
  'Evening cup': 'bg-espresso-950/85 text-olive-300 border border-olive-400/40',
};

export function ProductCard({
  product,
  onOpen,
  index,
}: {
  product: Product;
  onOpen: (p: Product) => void;
  index: number;
}) {
  const { add, pushToast } = useStore();

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-[1.4rem] border border-cream-100/10 bg-espresso-850 transition-all duration-400 hover:-translate-y-1.5 hover:border-honey-400/35 hover:shadow-[0_30px_60px_-25px_rgba(0,0,0,0.85)]"
      style={{ transitionDelay: `${(index % 3) * 40}ms` }}
    >
      <button
        onClick={() => onOpen(product)}
        className="relative block w-full cursor-pointer overflow-hidden text-left"
        aria-label={`View details for ${product.name}`}
      >
        <div className="aspect-[5/4] w-full overflow-hidden bg-espresso-800">
          <img
            src={product.image}
            alt={`${product.name} — ${product.origin}`}
            loading="lazy"
            className="h-full w-full object-cover object-[50%_30%] transition-transform duration-700 ease-out group-hover:scale-[1.07] group-hover:rotate-[0.8deg]"
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-espresso-950/70 via-transparent to-transparent opacity-0 transition-opacity duration-400 group-hover:opacity-100" />
        <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 translate-y-3 whitespace-nowrap rounded-full border border-cream-100/20 bg-espresso-950/90 px-4 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.2em] text-honey-300 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          Quick view
        </span>
        {product.badge && (
          <span
            className={`absolute left-3 top-3 rounded-full px-3 py-1 font-mono text-[9.5px] font-semibold uppercase tracking-[0.14em] ${
              BADGE_TONE[product.badge] ?? 'bg-honey-400 text-espresso-950'
            }`}
          >
            {product.badge}
          </span>
        )}
        <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-espresso-950/80 px-2.5 py-1 font-mono text-[10px] text-honey-300 backdrop-blur-sm">
          <IconStar className="h-3 w-3" /> {product.cupScore}
        </span>
      </button>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-cream-500">
            {product.origin} · {product.categoryLabel}
          </p>
          <RoastMeter level={product.roastLevel} />
        </div>

        <h3 className="mt-2 font-display text-[1.55rem] font-semibold leading-tight text-cream-50">
          {product.name}
        </h3>
        <p className="mt-1 font-display text-[14.5px] italic text-cream-500">
          {product.notes.join(' · ')}
        </p>

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div>
            <p className="font-display text-[1.45rem] font-semibold text-honey-300">
              {fmt(product.price)}
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-cream-700">
              {product.weight} · {product.process.split('·')[0].trim()}
            </p>
          </div>
          <button
            onClick={() => {
              add(product);
              pushToast(`${product.name} added to cart`, 'Whole bean · ' + product.weight);
            }}
            className="btn-press inline-flex items-center gap-2 rounded-full border border-honey-400/50 px-4 py-2.5 font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-honey-300 transition-colors hover:bg-honey-400 hover:text-espresso-950"
          >
            <IconBasket className="h-4 w-4" />
            Add
          </button>
        </div>
      </div>
    </article>
  );
}
