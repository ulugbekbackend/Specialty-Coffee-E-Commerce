import { useEffect, useState } from 'react';
import { useStore } from '../store';
import { IconBasket, IconBean, IconClose } from './icons';

const LINKS = [
  { href: '#shop', label: 'The shelf' },
  { href: '#craft', label: 'The craft' },
  { href: '#visit', label: 'Visit us' },
];

export function Navbar() {
  const { count } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-all duration-300 ${
        scrolled
          ? 'bg-espresso-950/92 backdrop-blur-md border-cream-100/10 shadow-[0_12px_40px_-18px_rgba(0,0,0,0.8)]'
          : 'bg-transparent border-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
        <a href="#top" className="group flex items-center gap-3" onClick={() => setMenuOpen(false)}>
          <span className="grid h-10 w-10 place-items-center rounded-full border border-honey-400/50 bg-espresso-800 text-honey-400 transition-transform duration-300 group-hover:rotate-[24deg]">
            <IconBean className="h-5.5 w-5.5" />
          </span>
          <span className="leading-none">
            <span className="block font-display text-xl font-semibold tracking-tight text-cream-50">
              Ember <span className="text-honey-400">&amp;</span> Oak
            </span>
            <span className="mt-1 block font-mono text-[9.5px] uppercase tracking-[0.3em] text-cream-500">
              Coffee Roasters
            </span>
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="group relative font-mono text-[12px] uppercase tracking-[0.2em] text-cream-300 transition-colors hover:text-honey-300"
            >
              {l.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-honey-400 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="#shop"
            className="btn-press hidden rounded-full border border-cream-100/15 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-cream-100 hover:border-honey-400/60 hover:text-honey-300 sm:block"
          >
            Order beans
          </a>
          <a
            href="#cart"
            onClick={(e) => {
              e.preventDefault();
              window.dispatchEvent(new CustomEvent('eo:open-cart'));
            }}
            aria-label="Open cart"
            className="btn-press relative grid h-11 w-11 place-items-center rounded-full bg-honey-400 text-espresso-950 transition-colors hover:bg-honey-300"
          >
            <IconBasket className="h-5.5 w-5.5" />
            {count > 0 && (
              <span
                key={count}
                className="cart-pop absolute -right-1 -top-1 grid h-5.5 min-w-5.5 place-items-center rounded-full bg-rust-400 px-1 font-mono text-[10.5px] font-semibold text-cream-50"
              >
                {count}
              </span>
            )}
          </a>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            className="btn-press grid h-11 w-11 place-items-center rounded-full border border-cream-100/15 text-cream-100 md:hidden"
          >
            {menuOpen ? (
              <IconClose className="h-5 w-5" />
            ) : (
              <span className="flex flex-col gap-[5px]">
                <span className="h-[1.8px] w-5 bg-cream-100" />
                <span className="h-[1.8px] w-3.5 bg-honey-400" />
                <span className="h-[1.8px] w-5 bg-cream-100" />
              </span>
            )}
          </button>
        </div>
      </nav>

      <div
        className={`overflow-hidden border-cream-100/10 transition-all duration-300 md:hidden ${
          menuOpen ? 'max-h-56 border-t' : 'max-h-0'
        }`}
      >
        <div className="flex flex-col gap-1 bg-espresso-900/95 px-5 py-4 backdrop-blur-md">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-3 py-2.5 font-mono text-[13px] uppercase tracking-[0.2em] text-cream-100 transition-colors hover:bg-espresso-800 hover:text-honey-300"
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
