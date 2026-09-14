import { useState } from 'react';
import { Reveal } from './Reveal';
import { IconArrowRight, IconBean, IconCheck, IconClock, IconPin } from './icons';

export function Footer() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setError('That email looks off — try again?');
      return;
    }
    setError('');
    setDone(true);
  };

  return (
    <footer id="visit" className="relative scroll-mt-24 border-t border-cream-100/8 bg-espresso-950">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20">
          {/* newsletter */}
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-honey-400">
              The roast schedule
            </p>
            <h2 className="mt-3 max-w-xl font-display text-4xl font-semibold tracking-tight text-cream-50 sm:text-5xl">
              Know what&rsquo;s hitting the bench <em className="italic text-honey-300">before it sells out.</em>
            </h2>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-cream-500">
              One email every Monday: the week&rsquo;s six coffees, cup scores, and first
              dibs on limited lots. No drip campaigns — just drip coffee.
            </p>

            {done ? (
              <div className="toast-in mt-7 flex max-w-md items-center gap-3.5 rounded-[1.1rem] border border-olive-400/40 bg-olive-500/10 px-5 py-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-olive-400/20 text-olive-300">
                  <IconCheck className="h-4.5 w-4.5" />
                </span>
                <p className="text-[14px] text-cream-100">
                  You&rsquo;re on the list — <span className="text-olive-300">first pour&rsquo;s on us.</span>
                </p>
              </div>
            ) : (
              <form onSubmit={subscribe} className="mt-7 flex max-w-md flex-col gap-3 sm:flex-row" noValidate>
                <div className="flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@morningcup.co"
                    aria-label="Email address"
                    className={`w-full rounded-full border bg-espresso-900/80 px-5 py-3.5 text-[14.5px] text-cream-100 placeholder:text-cream-700 transition-all duration-300 focus:border-honey-400/70 focus:shadow-[0_0_0_4px_rgba(233,168,62,0.12)] ${
                      error ? 'border-rust-400/70' : 'border-cream-100/15'
                    }`}
                  />
                  {error && <p className="mt-2 pl-4 font-mono text-[10.5px] uppercase tracking-[0.12em] text-rust-300">{error}</p>}
                </div>
                <button
                  type="submit"
                  className="btn-press group inline-flex shrink-0 items-center justify-center gap-2.5 rounded-full bg-honey-400 px-7 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-espresso-950 hover:bg-honey-300"
                >
                  Sign me up
                  <IconArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </form>
            )}
          </Reveal>

          {/* visit info */}
          <Reveal delay={150}>
            <div className="overflow-hidden rounded-[1.6rem] border border-cream-100/10 bg-espresso-900/70">
              <div className="group h-44 overflow-hidden">
                <img
                  src="https://image.qwenlm.ai/generated-images/c6bf649f-eb21-4b2e-b6e6-93316106a6ac/_result.png"
                  alt="Inside the Ember & Oak roastery"
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col gap-6 p-7">
              <div className="flex items-start gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-honey-400/40 text-honey-400">
                  <IconPin className="h-4.5 w-4.5" />
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-cream-50">The roastery bar</h3>
                  <p className="mt-1 text-[13.5px] leading-relaxed text-cream-500">
                    214 Alder Yard, Portland OR
                    <br />
                    Espresso pulled on the bench, every batch.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-honey-400/40 text-honey-400">
                  <IconClock className="h-4.5 w-4.5" />
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-cream-50">Cupping hours</h3>
                  <dl className="mt-1 flex flex-col gap-1 font-mono text-[11.5px] uppercase tracking-[0.1em] text-cream-500">
                    <div className="flex justify-between gap-6">
                      <dt>Tue — Fri</dt>
                      <dd className="text-cream-300">7:00 – 17:00</dd>
                    </div>
                    <div className="flex justify-between gap-6">
                      <dt>Sat — Sun</dt>
                      <dd className="text-cream-300">8:00 – 16:00</dd>
                    </div>
                    <div className="flex justify-between gap-6">
                      <dt>Public cupping</dt>
                      <dd className="text-honey-300">Sat 10:00</dd>
                    </div>
                  </dl>
                </div>
              </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-6 border-t border-cream-100/8 pt-8 sm:flex-row">
          <a href="#top" className="group flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-full border border-honey-400/50 text-honey-400 transition-transform duration-300 group-hover:rotate-[24deg]">
              <IconBean className="h-4 w-4" />
            </span>
            <span className="font-display text-lg font-semibold text-cream-100">
              Ember <span className="text-honey-400">&amp;</span> Oak
            </span>
          </a>
          <nav className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2">
            {[
              { href: '#shop', label: 'Shop' },
              { href: '#craft', label: 'Craft' },
              { href: '#visit', label: 'Visit' },
              { href: '#top', label: 'Back to top' },
            ].map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-cream-500 transition-colors hover:text-honey-300"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-cream-700">
            © 2026 Ember &amp; Oak Roasters — brewed with patience
          </p>
        </div>
      </div>
    </footer>
  );
}
