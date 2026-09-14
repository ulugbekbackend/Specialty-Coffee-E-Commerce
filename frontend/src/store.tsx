import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from 'react';
import {
  FREE_SHIPPING_THRESHOLD,
  PRODUCTS,
  SHIPPING_FLAT,
  type Product,
} from './data/products';
import { fetchCatalog } from './lib/api';

export interface CartLine {
  key: string;
  product: Product;
  grind: string;
  qty: number;
}

export interface Toast {
  id: number;
  title: string;
  sub?: string;
}

interface State {
  lines: CartLine[];
}

type Action =
  | { type: 'add'; product: Product; grind: string; qty: number }
  | { type: 'setQty'; key: string; qty: number }
  | { type: 'remove'; key: string }
  | { type: 'clear' };

const STORAGE_KEY = 'ember-oak-cart-v1';

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'add': {
      const key = `${action.product.id}:${action.grind}`;
      const existing = state.lines.find((l) => l.key === key);
      if (existing) {
        return {
          lines: state.lines.map((l) =>
            l.key === key ? { ...l, qty: Math.min(12, l.qty + action.qty) } : l
          ),
        };
      }
      return {
        lines: [
          ...state.lines,
          { key, product: action.product, grind: action.grind, qty: Math.min(12, action.qty) },
        ],
      };
    }
    case 'setQty': {
      if (action.qty <= 0) {
        return { lines: state.lines.filter((l) => l.key !== action.key) };
      }
      return {
        lines: state.lines.map((l) =>
          l.key === action.key ? { ...l, qty: Math.min(12, action.qty) } : l
        ),
      };
    }
    case 'remove':
      return { lines: state.lines.filter((l) => l.key !== action.key) };
    case 'clear':
      return { lines: [] };
  }
}

function init(): State {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.lines)) return { lines: parsed.lines };
    }
  } catch {
    /* corrupted storage — start fresh */
  }
  return { lines: [] };
}

interface StoreValue {
  products: Product[];
  catalogLoading: boolean;
  lines: CartLine[];
  count: number;
  subtotal: number;
  shipping: number;
  total: number;
  remainingForFree: number;
  freeShipProgress: number;
  add: (product: Product, grind?: string, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  toasts: Toast[];
  pushToast: (title: string, sub?: string) => void;
  dismissToast: (id: number) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, init);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [catalogLoading, setCatalogLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchCatalog().then((list) => {
      if (!cancelled) {
        if (list) setProducts(list);
        setCatalogLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable */
    }
  }, [state]);

  const dismissToast = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const pushToast = useCallback(
    (title: string, sub?: string) => {
      const id = Date.now() + Math.random();
      setToasts((t) => [...t.slice(-2), { id, title, sub }]);
      window.setTimeout(() => dismissToast(id), 2800);
    },
    [dismissToast]
  );

  const value = useMemo<StoreValue>(() => {
    const count = state.lines.reduce((s, l) => s + l.qty, 0);
    const subtotal = state.lines.reduce((s, l) => s + l.qty * l.product.price, 0);
    const shipping =
      subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
    const remainingForFree = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
    const freeShipProgress = Math.min(1, subtotal / FREE_SHIPPING_THRESHOLD);
    return {
      products,
      catalogLoading,
      lines: state.lines,
      count,
      subtotal,
      shipping,
      total: subtotal + shipping,
      remainingForFree,
      freeShipProgress,
      add: (product, grind = 'Whole bean', qty = 1) =>
        dispatch({ type: 'add', product, grind, qty }),
      setQty: (key, qty) => dispatch({ type: 'setQty', key, qty }),
      remove: (key) => dispatch({ type: 'remove', key }),
      clear: () => dispatch({ type: 'clear' }),
      toasts,
      pushToast,
      dismissToast,
    };
  }, [state, toasts, pushToast, dismissToast, products, catalogLoading]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}
