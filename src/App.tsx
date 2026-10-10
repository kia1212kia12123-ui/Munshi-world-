/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Catalog } from './components/Catalog';
import { CustomerPortal } from './components/CustomerPortal';
import { AdminDashboard } from './components/AdminDashboard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ShippingTrackerModal } from './components/ShippingTrackerModal';
import { MobileAppSimulator } from './components/MobileAppSimulator';
import { ReviewModal } from './components/ReviewModal';
import { NotificationToast } from './components/NotificationToast';
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  const { activeView } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-stone-900 selection:bg-stone-900 selection:text-white">
      {/* 3-Zone Top Bar Navigation */}
      <Header />

      {/* Main View Area */}
      <main className="flex-1">
        {activeView === 'store' && (
          <>
            <Hero />
            <Catalog />
          </>
        )}

        {activeView === 'customers' && <CustomerPortal />}

        {activeView === 'admin' && <AdminDashboard />}
      </main>

      {/* Global Modals, Drawers & Overlays */}
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <ShippingTrackerModal />
      <MobileAppSimulator />
      <ReviewModal />
      <NotificationToast />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
