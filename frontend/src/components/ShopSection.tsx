import { useMemo, useState } from 'react';
import {
  CATEGORY_FILTERS,
  type Product,
  type RoastCategory,
} from '../data/products';
import { useStore } from '../store';
import { Reveal } from './Reveal';
import { ProductCard } from './ProductCard';
import { IconBean, IconClose, IconSearch } from './icons';

type SortId = 'featured' | 'price-asc' | 'price-desc' | 'score';

const SORTS: { id: SortId; label: string }[] = [
  { id: 'featured', label: 'Featured' },
  { id: 'price-asc', label: 'Price · low to high' },
  { id: 'price-desc', label: 'Price · high to low' },
  { id: 'score', label: 'Cup score' },
];

export function ShopSection({ onSelect }: { onSelect: (p: Product) => void }) {
  const { products, catalogLoading } = useStore();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<RoastCategory | 'all'>('all');
  const [sort, setSort] = useState<SortId>('featured');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products.filter((p) => {
      const inCategory = category === 'all' || p.category === category;
      if (!inCategory) return false;
      if (!q) return true;
      const haystack = [p.name, p.origin, p.region, p.process, p.categoryLabel, ...p.notes]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
    switch (sort) {
      case 'price-asc':
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case 'score':
        list = [...list].sort((a, b) => b.cupScore - a.cupScore);
        break;
    }
    return list;
  }, [query, category, sort, products]);

  const countFor = (id: RoastCategory | 'all') =>
    id === 'all' ? products.length : products.filter((p) => p.category === id).length;

  const reset = () => {
    setQuery('');
    setCategory('all');
    setSort('featured');
  };

  return (
    <section id="shop" className="relative scroll-mt-24">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        {/* heading */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-honey-400">
              The shelf
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-cream-50 sm:text-5xl lg:text-6xl">
              Six coffees,
              <br className="hidden sm:block" />{' '}
              <em className="italic text-cream-300">zero filler.</em>
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="max-w-sm text-[15px] leading-relaxed text-cream-500">
              Everything below was on the roasting bench this week. When a lot sells
              through, it&rsquo;s gone — no warehouse bags, no stale stock.
            </p>
          </Reveal>
        </div>

        {/* controls */}
        <Reveal delay={160}>
          <div className="mt-12 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* category chips */}
            <div className="warm-scroll -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:flex-wrap">
              {CATEGORY_FILTERS.map((c) => {
                const active = category === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setCategory(c.id)}
                    className={`btn-press shrink-0 rounded-full px-4.5 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-all duration-300 ${
                      active
                        ? 'bg-honey-400 font-semibold text-espresso-950 shadow-[0_8px_24px_-8px_rgba(233,168,62,0.7)]'
                        : 'border border-cream-100/15 text-cream-300 hover:border-honey-400/50 hover:text-honey-300'
                    }`}
                  >
                    {c.label}
                    <span className={`ml-1.5 ${active ? 'text-espresso-950/60' : 'text-cream-700'}`}>
                      {countFor(c.id)}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* search + sort */}
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-end lg:max-w-xl">
              <label className="relative block flex-1">
                <IconSearch className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-cream-700" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search origin, notes, name…"
                  className="w-full rounded-full border border-cream-100/15 bg-espresso-900/80 py-3 pl-11 pr-10 text-[14.5px] text-cream-100 placeholder:text-cream-700 transition-all duration-300 focus:border-honey-400/70 focus:bg-espresso-900 focus:shadow-[0_0_0_4px_rgba(233,168,62,0.12)]"
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    aria-label="Clear search"
                    className="btn-press absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-cream-500 hover:text-honey-300"
                  >
                    <IconClose className="h-4 w-4" />
                  </button>
                )}
              </label>

              <label className="relative block sm:w-52">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortId)}
                  className="w-full cursor-pointer appearance-none rounded-full border border-cream-100/15 bg-espresso-900/80 py-3 pl-4.5 pr-10 font-mono text-[11px] uppercase tracking-[0.12em] text-cream-300 transition-colors focus:border-honey-400/70"
                >
                  {SORTS.map((s) => (
                    <option key={s.id} value={s.id} className="bg-espresso-900">
                      {s.label}
                    </option>
                  ))}
                </select>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-cream-500"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </label>
            </div>
          </div>
        </Reveal>

        {/* results meta */}
        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-cream-700" aria-live="polite">
          {results.length} {results.length === 1 ? 'coffee' : 'coffees'}
          {query && (
            <>
              {' '}for &ldquo;<span className="text-honey-300">{query}</span>&rdquo;
            </>
          )}
          {category !== 'all' && <> · {CATEGORY_FILTERS.find((c) => c.id === category)?.label}</>}
        </p>

        {/* grid */}
        {catalogLoading ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-[440px] animate-pulse rounded-[1.4rem] border border-cream-100/8 bg-espresso-800/70"
              />
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 90}>
                <ProductCard product={p} onOpen={onSelect} index={i} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="mt-10 flex flex-col items-center rounded-[1.6rem] border border-dashed border-cream-100/15 bg-espresso-900/50 px-6 py-20 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full border border-cream-100/12 text-cream-700">
              <IconBean className="h-8 w-8" />
            </span>
            <h3 className="mt-5 font-display text-2xl font-semibold text-cream-100">
              Nothing in the hopper
            </h3>
            <p className="mt-2 max-w-sm text-[14.5px] text-cream-500">
              No coffees match &ldquo;{query}&rdquo;
              {category !== 'all' ? ' in that roast' : ''}. Try a note like{' '}
              <button onClick={() => { setQuery('chocolate'); setCategory('all'); }} className="text-honey-300 underline decoration-honey-400/50 underline-offset-4 hover:text-honey-400">
                chocolate
              </button>{' '}
              or{' '}
              <button onClick={() => { setQuery('jasmine'); setCategory('all'); }} className="text-honey-300 underline decoration-honey-400/50 underline-offset-4 hover:text-honey-400">
                jasmine
              </button>
              .
            </p>
            <button
              onClick={reset}
              className="btn-press mt-6 rounded-full border border-honey-400/50 px-6 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-honey-300 hover:bg-honey-400 hover:text-espresso-950"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
