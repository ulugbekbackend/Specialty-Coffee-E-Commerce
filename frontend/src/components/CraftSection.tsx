import { CountUp, Reveal, useInView } from './Reveal';
import { IconFlame } from './icons';

const STEPS = [
  {
    n: '01',
    title: 'Source',
    body: 'Direct lots from twelve farms we visit every harvest — priced above commodity, paid on the spot.',
  },
  {
    n: '02',
    title: 'Sample & cup',
    body: 'Every lot is sample-roasted and blind-cupped against the bench. Only scores of 84+ make the shelf.',
  },
  {
    n: '03',
    title: 'Profile the roast',
    body: 'Curves built batch by batch on our 12-kilo Probat, with first crack called by ear and by eye.',
  },
  {
    n: '04',
    title: 'Seal & ship',
    body: 'Bags are sealed within the hour of roasting and leave the roastery inside 48 hours.',
  },
];

function RoastCurve() {
  const { ref, inView } = useInView<HTMLDivElement>(0.35);

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden rounded-[1.6rem] border border-cream-100/12 bg-espresso-900 p-6 sm:p-8 ${
        inView ? 'curve-drawn' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-cream-500">
          Roast log — Cloud Forest · batch №41
        </p>
        <span className="flex items-center gap-1.5 rounded-full bg-rust-500/20 px-3 py-1 font-mono text-[9.5px] uppercase tracking-[0.14em] text-rust-300">
          <IconFlame className="h-3.5 w-3.5" /> live profile
        </span>
      </div>

      <svg viewBox="0 0 340 220" className="mt-6 w-full" role="img" aria-label="Roast temperature curve from charge to drop">
        {/* grid */}
        {[40, 85, 130, 175].map((y) => (
          <line key={y} x1="16" y1={y} x2="324" y2={y} stroke="rgba(242,230,207,0.07)" strokeWidth="1" />
        ))}
        {[70, 140, 210, 280].map((x) => (
          <line key={x} x1={x} y1="24" x2={x} y2="196" stroke="rgba(242,230,207,0.05)" strokeWidth="1" />
        ))}

        {/* axis labels */}
        <text x="16" y="212" className="fill-cream-700 font-mono" fontSize="8" letterSpacing="1">0:00</text>
        <text x="150" y="212" className="fill-cream-700 font-mono" fontSize="8" letterSpacing="1">6:00</text>
        <text x="296" y="212" className="fill-cream-700 font-mono" fontSize="8" letterSpacing="1">11:45</text>
        <text x="16" y="18" className="fill-cream-700 font-mono" fontSize="8" letterSpacing="1">°C</text>

        {/* the curve: charge high, crash to turning point, climb to drop */}
        <path
          d="M20,42 C48,118 68,158 104,160 C150,162 196,128 240,88 C266,64 296,48 322,40"
          fill="none"
          stroke="url(#curveGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          pathLength={1}
          className="curve-path"
        />
        <defs>
          <linearGradient id="curveGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#c96f4c" />
            <stop offset="55%" stopColor="#e9a83e" />
            <stop offset="100%" stopColor="#f4c76f" />
          </linearGradient>
        </defs>

        {/* markers */}
        <g className="curve-marker">
          <circle cx="20" cy="42" r="4.5" fill="#c96f4c" />
          <text x="28" y="34" className="fill-cream-300 font-mono" fontSize="9" letterSpacing="1">charge 198°</text>
        </g>
        <g className="curve-marker">
          <circle cx="104" cy="160" r="4.5" fill="#e9a83e" />
          <text x="66" y="182" className="fill-cream-300 font-mono" fontSize="9" letterSpacing="1">turning point</text>
        </g>
        <g className="curve-marker">
          <circle cx="240" cy="88" r="4.5" fill="#f4c76f" />
          <text x="196" y="76" className="fill-cream-300 font-mono" fontSize="9" letterSpacing="1">first crack 9:12</text>
        </g>
        <g className="curve-marker">
          <circle cx="322" cy="40" r="4.5" fill="#f4c76f" stroke="rgba(244,199,111,0.4)" strokeWidth="4" />
          <text x="268" y="28" className="fill-honey-300 font-mono" fontSize="9" letterSpacing="1">drop 11:45</text>
        </g>
      </svg>

      <div className="mt-5 grid grid-cols-3 gap-3 border-t border-cream-100/10 pt-5">
        {[
          { k: 'Development', v: '1:58 · 16.8%' },
          { k: 'End temp', v: '204.5 °C' },
          { k: 'Weight loss', v: '13.2%' },
        ].map((s) => (
          <div key={s.k}>
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-cream-700">{s.k}</p>
            <p className="mt-1 font-mono text-[12.5px] font-medium text-honey-300">{s.v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CraftSection() {
  return (
    <section id="craft" className="relative scroll-mt-24 border-t border-cream-100/8 bg-espresso-900/45">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-16">
          {/* left: headline + timeline */}
          <div>
            <Reveal>
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-honey-400">The craft</p>
              <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-cream-50 sm:text-5xl">
                Twelve minutes
                <br />
                that decide <em className="italic text-honey-300">everything.</em>
              </h2>
              <p className="mt-5 max-w-md text-[15px] leading-relaxed text-cream-500">
                A roast is a conversation between heat and sugar. Push too hard and you
                burn the story; pull too early and it never gets told. Here&rsquo;s how every
                batch on the shelf earns its place.
              </p>
            </Reveal>

            <div className="mt-10 flex flex-col">
              {STEPS.map((s, i) => (
                <Reveal key={s.n} delay={i * 100}>
                  <div className="group flex gap-5 border-t border-cream-100/10 py-5 transition-all duration-300 last:border-b hover:bg-espresso-850/50 hover:pl-3 sm:gap-7">
                    <span className="font-display text-2xl font-semibold text-espresso-600 transition-colors duration-300 group-hover:text-honey-400 sm:text-3xl">
                      {s.n}
                    </span>
                    <div>
                      <h3 className="font-display text-xl font-semibold text-cream-50">{s.title}</h3>
                      <p className="mt-1.5 max-w-md text-[14px] leading-relaxed text-cream-500">{s.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* right: roast curve + numbers */}
          <div className="flex flex-col gap-8">
            <Reveal delay={140}>
              <RoastCurve />
            </Reveal>

            <Reveal delay={220}>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-[1.2rem] border border-cream-100/10 bg-espresso-850 px-5 py-5 transition-colors hover:border-olive-400/40">
                  <p className="font-display text-4xl font-semibold text-olive-300">
                    <CountUp to={5} />×
                  </p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-cream-500">
                    cupped before a profile ships
                  </p>
                </div>
                <div className="rounded-[1.2rem] border border-cream-100/10 bg-espresso-850 px-5 py-5 transition-colors hover:border-honey-400/40">
                  <p className="font-display text-4xl font-semibold text-honey-300">
                    <CountUp to={204} suffix="°" />
                  </p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-cream-500">
                    hottest moment of every batch
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
