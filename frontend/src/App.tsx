import { useCallback, useEffect, useState } from 'react';
import type { Product } from './data/products';
import { StoreProvider } from './store';
import { Ticker } from './components/Ticker';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ShopSection } from './components/ShopSection';
import { CraftSection } from './components/CraftSection';
import { Footer } from './components/Footer';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { Toasts } from './components/Toasts';

function Shell() {
  const [selected, setSelected] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const openCart = useCallback(() => setCartOpen(true), []);

  useEffect(() => {
    window.addEventListener('eo:open-cart', openCart);
    return () => window.removeEventListener('eo:open-cart', openCart);
  }, [openCart]);

  const startCheckout = () => {
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  return (
    <div className="relative min-h-screen font-body text-cream-100 antialiased">
      <div className="ambient" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      <div className="relative z-10">
        <Ticker />
        <Navbar />
        <main>
          <Hero onSelect={setSelected} />
          <ShopSection onSelect={setSelected} />
          <CraftSection />
        </main>
        <Footer />
      </div>

      <ProductModal product={selected} onClose={() => setSelected(null)} />
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={startCheckout}
      />
      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
      <Toasts />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  );
}
