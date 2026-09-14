import { useEffect, useState } from 'react';
import { fmt, type Product } from '../data/products';
import { useStore } from '../store';
import { CountUp, Reveal } from './Reveal';
import { IconArrowDown, IconArrowRight, IconBean, IconFlame, IconStar } from './icons';

const ROTATING_NOTES = [
  'blackcurrant',
  'jasmine',
  'demerara',
  'bergamot',
  'molasses',
  'wild honey',
  'orange zest',
  'cedar',
];

function RotatingWord() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % ROTATING_NOTES.length), 2100);
    return () => clearInterval(t);
  }, []);
  return (
    <span key={i} className="word-swap font-display italic text-honey-300">
      {ROTATING_NOTES[i]}
    </span>
  );
}

function StampBadge() {
  return (
    <div className="anim-spin-slow absolute -top-7 left-1 z-20 hidden h-32 w-32 sm:block lg:-left-10 lg:h-36 lg:w-36">
      <svg viewBox="0 0 120 120" className="h-full w-full">
        <defs>
          <path id="stamp-circle" d="M60,60 m-45,0 a45,45 0 1,1 90,0 a45,45 0 1,1 -90,0" />
        </defs>
        <circle cx="60" cy="60" r="58" className="fill-espresso-900" />
        <circle cx="60" cy="60" r="58" fill="none" stroke="rgba(233,168,62,0.45)" />
        <circle cx="60" cy="60" r="30" fill="none" stroke="rgba(233,168,62,0.3)" />
        <text className="fill-honey-300 font-mono" fontSize="9.2" letterSpacing="2.6">
          <textPath href="#stamp-circle">FRESH ROAST · SMALL BATCH · CUPPED WEEKLY ·</textPath>
        </text>
      </svg>
      <span className="absolute inset-0 grid place-items-center text-honey-400">
        <IconBean className="h-8 w-8" />
      </span>
    </div>
  );
}

const STATS = [
  { value: 6, suffix: '', label: 'coffees on the bench', pad: true },
  { value: 12, suffix: '', label: 'partner farms, visited yearly', pad: true },
  { value: 48, suffix: 'h', label: 'from roaster to your door' },
  { value: 91, suffix: '', label: 'highest cup score this week' },
];

export function Hero({ onSelect }: { onSelect: (p: Product) => void }) {
  const { products, add, pushToast } = useStore();
  const featured = products[0];

  return (
    <section id="top" className="relative overflow-hidden">
      {/* floating embers */}
      <span className="ember-float pointer-events-none absolute left-[8%] top-[22%] h-2 w-2 rounded-full bg-honey-400/70 blur-[1px]" />
      <span className="ember-float ember-float-b pointer-events-none absolute left-[46%] top-[12%] h-1.5 w-1.5 rounded-full bg-rust-300/60 blur-[1px]" />
      <span className="ember-float ember-float-c pointer-events-none absolute right-[6%] top-[64%] h-2 w-2 rounded-full bg-honey-300/50 blur-[1px]" />

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-16 pt-12 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10 lg:pb-24 lg:pt-20">
        {/* ------- left: the roast board ------- */}
        <div>
          <Reveal>
            <p className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.28em] text-cream-500">
              <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-rust-400" />
              Roasting now — Tuesday&rsquo;s batch · Portland, OR
            </p>
          </Reveal>

          <Reveal delay={90}>
            <h1 className="mt-6 font-display text-[13vw] font-semibold leading-[0.98] tracking-tight text-cream-50 sm:text-6xl lg:text-[4.6rem]">
              Roasted at <em className="italic text-honey-400">dawn,</em>
              <br />
              gone by <em className="italic text-rust-300">Friday.</em>
            </h1>
          </Reveal>

          <Reveal delay={180}>
            <p className="mt-6 max-w-xl text-[15.5px] leading-relaxed text-cream-300 sm:text-lg">
              Six coffees on the bench this week — each one cupped, scored, and sealed
              within the hour. Whatever you order ships inside{' '}
              <span className="text-cream-50">48 hours of the roast.</span>
            </p>
          </Reveal>

          <Reveal delay={260}>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href="#shop"
                className="btn-press group inline-flex items-center gap-3 rounded-full bg-honey-400 px-7 py-3.5 font-mono text-[12px] font-semibold uppercase tracking-[0.18em] text-espresso-950 transition-colors hover:bg-honey-300"
              >
                Browse the shelf
                <IconArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a
                href="#craft"
                className="btn-press group inline-flex items-center gap-3 rounded-full border border-cream-100/20 px-7 py-3.5 font-mono text-[12px] uppercase tracking-[0.18em] text-cream-100 hover:border-honey-400/60 hover:text-honey-300"
              >
                <IconArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-1" />
                See the roast curve
              </a>
            </div>
          </Reveal>

          <Reveal delay={340}>
            <p className="mt-10 font-mono text-[12px] uppercase tracking-[0.2em] text-cream-500">
              In the cup this week — <RotatingWord />
            </p>
          </Reveal>
        </div>

        {/* ------- right: featured bag ------- */}
        <Reveal delay={200} className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative">
            <StampBadge />

            <div className="group relative overflow-hidden rounded-[2rem] border border-cream-100/12 bg-espresso-800 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.85)]">
              <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-center pt-5">
                <svg viewBox="0 0 60 56" className="h-14 w-14">
                  <path className="steam-line" d="M18 50 C14 42 22 38 18 30 C14 22 22 18 18 10" />
                  <path className="steam-line steam-2" d="M30 52 C26 43 34 39 30 30 C26 21 34 17 30 8" />
                  <path className="steam-line steam-3" d="M42 50 C38 42 46 38 42 30 C38 22 46 18 42 10" />
                </svg>
              </div>

              <button
                onClick={() => onSelect(featured)}
                className="block w-full cursor-pointer"
                aria-label={`View ${featured.name}`}
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={featured.image}
                    alt={`${featured.name} coffee bag`}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05] group-hover:rotate-[0.6deg]"
                  />
                </div>
              </button>

              <div className="pointer-events-none absolute right-4 top-4 z-20 rounded-full bg-rust-400 px-3.5 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-cream-50">
                {featured.badge}
              </div>

              <div className="relative z-10 -mt-14 rounded-t-[1.6rem] border-t border-cream-100/12 bg-espresso-900/95 p-5 backdrop-blur-sm sm:p-6">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.24em] text-cream-500">
                    {featured.origin} · {featured.region}
                  </p>
                  <p className="flex items-center gap-1.5 font-mono text-[11px] text-honey-300">
                    <IconStar className="h-3.5 w-3.5" /> {featured.cupScore}
                  </p>
                </div>
                <h3 className="mt-2 font-display text-2xl font-semibold text-cream-50">
                  {featured.name}
                </h3>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {featured.notes.map((n) => (
                    <span
                      key={n}
                      className="rounded-full border border-olive-400/40 px-2.5 py-0.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-olive-300"
                    >
                      {n}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <p className="font-display text-2xl font-semibold text-honey-300">
                    {fmt(featured.price)}
                    <span className="ml-1.5 font-body text-[12px] font-normal text-cream-500">
                      / {featured.weight}
                    </span>
                  </p>
                  <button
                    onClick={() => {
                      add(featured);
                      pushToast(`${featured.name} added to cart`, 'Whole bean · 250 g');
                    }}
                    className="btn-press rounded-full bg-honey-400 px-5 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-espresso-950 hover:bg-honey-300"
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            </div>

            <p className="mt-4 flex items-center justify-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.22em] text-cream-700">
              <IconFlame className="h-4 w-4 text-rust-400" />
              Roast date — this Tuesday · batch №41
            </p>
          </div>
        </Reveal>
      </div>

      {/* ------- stats strip ------- */}
      <div className="border-y border-cream-100/10 bg-espresso-900/60">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-cream-100/8 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 90} className="px-5 py-7 sm:px-8">
              <p className="font-display text-4xl font-semibold text-honey-300 sm:text-5xl">
                <CountUp to={s.value} suffix={s.suffix} />
                {'pad' in s && s.pad ? (
                  <span className="text-cream-700">&thinsp;</span>
                ) : null}
              </p>
              <p className="mt-1.5 font-mono text-[10.5px] uppercase tracking-[0.2em] text-cream-500">
                {s.label}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
