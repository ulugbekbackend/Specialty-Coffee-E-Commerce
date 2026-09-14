import { useEffect, useMemo, useState } from 'react';
import { fmt } from '../data/products';
import { createOrder, OrderError } from '../lib/api';
import { useStore } from '../store';
import {
  IconArrowRight,
  IconCard,
  IconCheck,
  IconClose,
  IconTruck,
} from './icons';

type Step = 'shipping' | 'payment' | 'done';

interface FieldErrors {
  [k: string]: string | undefined;
}

const inputCls =
  'w-full rounded-xl border border-cream-100/15 bg-espresso-950/70 px-4 py-3 text-[14.5px] text-cream-100 placeholder:text-cream-700 transition-all duration-300 focus:border-honey-400/70 focus:shadow-[0_0_0_4px_rgba(233,168,62,0.12)]';

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-cream-500">
        {label}
        {error && <span className="normal-case tracking-normal text-rust-300">{error}</span>}
      </span>
      {children}
    </label>
  );
}

function StepDots({ step }: { step: Step }) {
  const steps: { id: Step; label: string }[] = [
    { id: 'shipping', label: 'Shipping' },
    { id: 'payment', label: 'Payment' },
    { id: 'done', label: 'Done' },
  ];
  const activeIdx = steps.findIndex((s) => s.id === step);
  return (
    <div className="flex items-center gap-2">
      {steps.map((s, i) => (
        <div key={s.id} className="flex items-center gap-2">
          <span
            className={`flex items-center gap-2 rounded-full px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.14em] transition-all duration-300 ${
              i <= activeIdx
                ? 'bg-honey-400 font-semibold text-espresso-950'
                : 'border border-cream-100/15 text-cream-700'
            }`}
          >
            {i < activeIdx || step === 'done' ? <IconCheck className="h-3 w-3" /> : <span>{i + 1}</span>}
            <span className="hidden sm:inline">{s.label}</span>
          </span>
          {i < steps.length - 1 && (
            <span className={`h-px w-5 ${i < activeIdx ? 'bg-honey-400' : 'bg-cream-100/15'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export function CheckoutModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lines, subtotal, shipping, total, count, clear, pushToast } = useStore();
  const [step, setStep] = useState<Step>('shipping');
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [orderNo, setOrderNo] = useState('');
  const [paidTotal, setPaidTotal] = useState(0);
  const [orderError, setOrderError] = useState('');

  const [ship, setShip] = useState({ name: '', email: '', address: '', city: '', zip: '' });
  const [pay, setPay] = useState({ cardName: '', cardNumber: '', expiry: '', cvc: '' });

  const orderTotal = useMemo(() => total, [total]);

  useEffect(() => {
    if (open) {
      setStep('shipping');
      setProcessing(false);
      setErrors({});
      setOrderNo('');
      setOrderError('');
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !processing) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, processing]);

  if (!open) return null;

  const validateShipping = () => {
    const e: FieldErrors = {};
    if (!ship.name.trim()) e.name = 'required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(ship.email)) e.email = 'valid email needed';
    if (!ship.address.trim()) e.address = 'required';
    if (!ship.city.trim()) e.city = 'required';
    if (!/^[\w\s-]{3,10}$/.test(ship.zip.trim())) e.zip = 'invalid';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validatePayment = () => {
    const e: FieldErrors = {};
    if (!pay.cardName.trim()) e.cardName = 'required';
    if (pay.cardNumber.replace(/\s/g, '').length !== 16) e.cardNumber = '16 digits';
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(pay.expiry)) e.expiry = 'MM/YY';
    if (!/^\d{3,4}$/.test(pay.cvc)) e.cvc = '3–4 digits';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submitShipping = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (validateShipping()) setStep('payment');
  };

  const submitPayment = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validatePayment()) return;
    setProcessing(true);
    setOrderError('');
    try {
      const order = await createOrder({
        name: ship.name,
        email: ship.email,
        address: ship.address,
        city: ship.city,
        zip: ship.zip,
        items: lines.map((l) => ({ sku: l.product.id, grind: l.grind, quantity: l.qty })),
      });
      setOrderNo(order.order_no);
      setPaidTotal(order.total);
      setProcessing(false);
      setStep('done');
      clear();
      pushToast('Order confirmed', `${order.order_no} — thank you!`);
    } catch (err) {
      setProcessing(false);
      setOrderError(err instanceof OrderError ? err.message : 'Order could not be placed. Please try again.');
    }
  };

  const formatCard = (v: string) =>
    v
      .replace(/\D/g, '')
      .slice(0, 16)
      .replace(/(\d{4})(?=\d)/g, '$1 ');

  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  return (
    <div className="fixed inset-0 z-[65] flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label="Checkout">
      <button
        aria-label="Close checkout"
        onClick={() => !processing && onClose()}
        className="absolute inset-0 cursor-pointer bg-espresso-950/80 backdrop-blur-sm"
      />

      <div className="modal-in warm-scroll relative max-h-[94dvh] w-full max-w-xl overflow-y-auto rounded-t-[1.8rem] border border-cream-100/12 bg-espresso-900 p-6 shadow-[0_50px_120px_-30px_rgba(0,0,0,0.95)] sm:rounded-[1.8rem] sm:p-8">
        <div className="flex items-center justify-between gap-4">
          {step === 'done' ? (
            <h2 className="font-display text-3xl font-semibold text-cream-50">Order confirmed</h2>
          ) : (
            <>
              <h2 className="font-display text-3xl font-semibold text-cream-50">Checkout</h2>
              <div className="flex items-center gap-3">
                <StepDots step={step} />
                <button
                  onClick={onClose}
                  disabled={processing}
                  aria-label="Close"
                  className="btn-press grid h-10 w-10 place-items-center rounded-full border border-cream-100/15 text-cream-300 transition-colors hover:border-honey-400/60 hover:text-honey-300 disabled:opacity-40"
                >
                  <IconClose className="h-4.5 w-4.5" />
                </button>
              </div>
            </>
          )}
        </div>

        {/* ---------- order summary chip ---------- */}
        {step !== 'done' && (
          <div className="mt-5 flex items-center justify-between rounded-xl border border-cream-100/10 bg-espresso-850 px-4.5 py-3.5">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-cream-500">
              {count} {count === 1 ? 'bag' : 'bags'} · {lines.map((l) => l.product.name).join(', ')}
            </p>
            <p className="font-display text-xl font-semibold text-honey-300">{fmt(orderTotal)}</p>
          </div>
        )}

        {/* ---------- STEP 1: shipping ---------- */}
        {step === 'shipping' && (
          <form onSubmit={submitShipping} className="mt-6 flex flex-col gap-4" noValidate>
            <p className="flex items-center gap-2.5 font-mono text-[10.5px] uppercase tracking-[0.2em] text-honey-400">
              <IconTruck className="h-4 w-4" /> Where should the beans land?
            </p>
            <Field label="Full name" error={errors.name}>
              <input className={inputCls} value={ship.name} onChange={(e) => setShip({ ...ship, name: e.target.value })} placeholder="Ada Baristova" autoComplete="name" />
            </Field>
            <Field label="Email" error={errors.email}>
              <input className={inputCls} type="email" value={ship.email} onChange={(e) => setShip({ ...ship, email: e.target.value })} placeholder="ada@morningcup.co" autoComplete="email" />
            </Field>
            <Field label="Street address" error={errors.address}>
              <input className={inputCls} value={ship.address} onChange={(e) => setShip({ ...ship, address: e.target.value })} placeholder="214 Alder Yard, Apt 3" autoComplete="street-address" />
            </Field>
            <div className="grid grid-cols-[1fr_120px] gap-4">
              <Field label="City" error={errors.city}>
                <input className={inputCls} value={ship.city} onChange={(e) => setShip({ ...ship, city: e.target.value })} placeholder="Portland" />
              </Field>
              <Field label="ZIP" error={errors.zip}>
                <input className={inputCls} value={ship.zip} onChange={(e) => setShip({ ...ship, zip: e.target.value })} placeholder="97204" />
              </Field>
            </div>
            <button type="submit" className="btn-press group mt-2 flex items-center justify-center gap-3 rounded-full bg-honey-400 py-4 font-mono text-[12px] font-semibold uppercase tracking-[0.18em] text-espresso-950 hover:bg-honey-300">
              Continue to payment
              <IconArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </form>
        )}

        {/* ---------- STEP 2: payment ---------- */}
        {step === 'payment' && (
          <form onSubmit={submitPayment} className="mt-6 flex flex-col gap-4" noValidate>
            <p className="flex items-center gap-2.5 font-mono text-[10.5px] uppercase tracking-[0.2em] text-honey-400">
              <IconCard className="h-4 w-4" /> Payment — simulated, never charged
            </p>
            <Field label="Name on card" error={errors.cardName}>
              <input className={inputCls} value={pay.cardName} onChange={(e) => setPay({ ...pay, cardName: e.target.value })} placeholder="ADA BARISTOVA" autoComplete="cc-name" />
            </Field>
            <Field label="Card number" error={errors.cardNumber}>
              <input
                className={`${inputCls} font-mono tracking-[0.08em]`}
                inputMode="numeric"
                value={pay.cardNumber}
                onChange={(e) => setPay({ ...pay, cardNumber: formatCard(e.target.value) })}
                placeholder="4242 4242 4242 4242"
                autoComplete="cc-number"
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Expiry" error={errors.expiry}>
                <input className={`${inputCls} font-mono`} inputMode="numeric" value={pay.expiry} onChange={(e) => setPay({ ...pay, expiry: formatExpiry(e.target.value) })} placeholder="08/27" autoComplete="cc-exp" />
              </Field>
              <Field label="CVC" error={errors.cvc}>
                <input className={`${inputCls} font-mono`} inputMode="numeric" value={pay.cvc} onChange={(e) => setPay({ ...pay, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) })} placeholder="123" autoComplete="cc-csc" />
              </Field>
            </div>

            <dl className="mt-1 flex flex-col gap-1.5 rounded-xl border border-cream-100/10 bg-espresso-850 px-4.5 py-3.5 font-mono text-[11px] uppercase tracking-[0.12em]">
              <div className="flex justify-between text-cream-500">
                <dt>Subtotal</dt>
                <dd className="text-cream-100">{fmt(subtotal)}</dd>
              </div>
              <div className="flex justify-between text-cream-500">
                <dt>Shipping</dt>
                <dd className={shipping === 0 ? 'text-olive-300' : 'text-cream-100'}>{shipping === 0 ? 'Free' : fmt(shipping)}</dd>
              </div>
              <div className="flex justify-between border-t border-cream-100/10 pt-2 text-cream-300">
                <dt>Total</dt>
                <dd className="font-display text-lg font-semibold normal-case text-honey-300">{fmt(orderTotal)}</dd>
              </div>
            </dl>

            {orderError && (
              <p className="rounded-xl border border-rust-400/30 bg-rust-400/10 px-4 py-3 text-[13px] text-rust-300">
                {orderError}
              </p>
            )}

            <button
              type="submit"
              disabled={processing}
              className="btn-press mt-1 flex items-center justify-center gap-3 rounded-full bg-honey-400 py-4 font-mono text-[12px] font-semibold uppercase tracking-[0.18em] text-espresso-950 hover:bg-honey-300 disabled:cursor-wait disabled:opacity-80"
            >
              {processing ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-espresso-950/30 border-t-espresso-950" />
                  Talking to the roaster…
                </>
              ) : (
                <>Pay {fmt(orderTotal)}</>
              )}
            </button>
            <button
              type="button"
              onClick={() => setStep('shipping')}
              disabled={processing}
              className="btn-press text-center font-mono text-[10.5px] uppercase tracking-[0.18em] text-cream-500 hover:text-honey-300 disabled:opacity-40"
            >
              ← Back to shipping
            </button>
          </form>
        )}

        {/* ---------- STEP 3: done ---------- */}
        {step === 'done' && (
          <div className="mt-8 flex flex-col items-center text-center">
            <span className="grid h-20 w-20 place-items-center rounded-full bg-olive-400/15 text-olive-300">
              <IconCheck className="h-9 w-9" strokeWidth={2.4} />
            </span>
            <h3 className="mt-6 font-display text-3xl font-semibold text-cream-50">
              The kettle&rsquo;s on, {ship.name.split(' ')[0] || 'friend'}.
            </h3>
            <p className="mt-3 max-w-sm text-[14.5px] leading-relaxed text-cream-300">
              Order <span className="font-mono text-honey-300">{orderNo}</span> is confirmed for{' '}
              <span className="font-semibold text-cream-50">{fmt(paidTotal)}</span>. Your beans hit
              the roaster Tuesday and ship within 48 hours.
            </p>
            <div className="mt-6 w-full rounded-xl border border-cream-100/10 bg-espresso-850 px-5 py-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream-700">
                Confirmation sent to
              </p>
              <p className="mt-1 text-[14.5px] font-medium text-cream-100">{ship.email || 'you@home.brew'}</p>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-cream-700">
                Shipping to
              </p>
              <p className="mt-1 text-[13.5px] text-cream-300">
                {ship.address}, {ship.city} {ship.zip}
              </p>
            </div>
            <button
              onClick={onClose}
              className="btn-press group mt-7 inline-flex items-center gap-3 rounded-full bg-honey-400 px-7 py-3.5 font-mono text-[12px] font-semibold uppercase tracking-[0.18em] text-espresso-950 hover:bg-honey-300"
            >
              Back to the shelf
              <IconArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
