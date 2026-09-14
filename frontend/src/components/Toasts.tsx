import { useStore } from '../store';
import { IconBasket, IconCheck, IconClose } from './icons';

export function Toasts() {
  const { toasts, dismissToast } = useStore();

  return (
    <div className="pointer-events-none fixed bottom-5 left-5 z-[80] flex w-[calc(100%-2.5rem)] max-w-sm flex-col gap-2.5">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="toast-in pointer-events-auto flex items-center gap-3.5 rounded-[1.1rem] border border-cream-100/12 bg-espresso-850/95 px-4.5 py-3.5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.85)] backdrop-blur-md"
          role="status"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-honey-400/15 text-honey-300">
            {t.sub?.includes('removed') ? (
              <IconClose className="h-4.5 w-4.5" />
            ) : t.sub?.includes('EO-') ? (
              <IconCheck className="h-4.5 w-4.5" />
            ) : (
              <IconBasket className="h-4.5 w-4.5" />
            )}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-[15.5px] font-semibold text-cream-50">{t.title}</p>
            {t.sub && (
              <p className="truncate font-mono text-[10px] uppercase tracking-[0.14em] text-cream-500">
                {t.sub}
              </p>
            )}
          </div>
          <button
            onClick={() => dismissToast(t.id)}
            aria-label="Dismiss notification"
            className="btn-press shrink-0 rounded-full p-1.5 text-cream-700 hover:text-honey-300"
          >
            <IconClose className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
