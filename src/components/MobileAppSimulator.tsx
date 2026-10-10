import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  Smartphone,
  ShoppingBag,
  Bell,
  Wifi,
  Battery,
  ShieldCheck,
  Check,
  Trash2,
  Plus,
  Minus,
  Sparkles,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

export const MobileAppSimulator: React.FC = () => {
  const {
    isMobileSimulatorOpen,
    setIsMobileSimulatorOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    formatPrice,
    orders,
    products,
    syncTimestamp,
    placeOrder,
  } = useStore();

  const [activeMobileTab, setActiveMobileTab] = useState<'shop' | 'bag' | 'tracking'>('bag');
  const [biometricPaying, setBiometricPaying] = useState(false);
  const [mobileOrderSuccess, setMobileOrderSuccess] = useState<string | null>(null);

  if (!isMobileSimulatorOpen) return null;

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotalUSD = cart.reduce((acc, item) => acc + item.priceUSD * item.quantity, 0);

  const handleMobileBiometricCheckout = () => {
    setBiometricPaying(true);
    setTimeout(() => {
      const newOrder = placeOrder({
        customerName: 'Mobile App User (iOS)',
        customerEmail: 'mobile.shopper@appleid.com',
        carrier: 'DHL Express',
        paymentMethod: 'apple_pay',
        subtotalUSD,
        shippingUSD: subtotalUSD >= 500 ? 0 : 35,
        taxUSD: Math.round(subtotalUSD * 0.12 * 100) / 100,
        totalUSD: subtotalUSD + (subtotalUSD >= 500 ? 0 : 35) + Math.round(subtotalUSD * 0.12 * 100) / 100,
      });
      setBiometricPaying(false);
      setMobileOrderSuccess(newOrder.id);
      setActiveMobileTab('tracking');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      {/* Container with simulation instructions */}
      <div className="relative flex flex-col lg:flex-row items-center gap-8 max-w-5xl w-full justify-center">
        {/* Left Side Explanatory Card */}
        <div className="bg-stone-900 text-stone-100 p-6 max-w-md w-full border border-stone-700 space-y-4 hidden md:block">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-emerald-400 font-semibold">
            <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
            <span>Bi-Directional Desktop &bull; Mobile Sync</span>
          </div>

          <h3 className="text-2xl font-bold text-white">
            MUNSI WORLD iOS &amp; Android Companion App
          </h3>

          <p className="text-xs text-stone-300 font-light leading-relaxed">
            Every change made on the desktop storefront (items added to the bag, orders submitted, or inventory restocked by merchant) propagates in sub-millisecond real time to this mobile device frame.
          </p>

          <div className="p-3 bg-stone-800/80 border border-stone-700 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-stone-400">Sync Status:</span>
              <span className="text-emerald-400 font-mono font-semibold">Active · 0ms latency</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-400">Last Broadcast:</span>
              <span className="text-stone-300 font-mono">{syncTimestamp}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-400">Items in Synced Bag:</span>
              <span className="text-white font-mono font-semibold">{totalCartCount}</span>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-stone-400">
            <p>&bull; Try adding a garment on Desktop, then watch it appear here.</p>
            <p>&bull; Tap &quot;Pay with Face ID&quot; on the mobile phone to trigger desktop order synchronization.</p>
          </div>
        </div>

        {/* Realistic Mobile Device Frame (iPhone 16 Pro Style) */}
        <div className="relative w-[340px] sm:w-[375px] h-[720px] bg-black rounded-[50px] p-3 shadow-2xl border-[6px] border-stone-700 flex flex-col shrink-0">
          {/* Hardware Island Notch */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-30 flex items-center justify-end px-2">
            <div className="w-2.5 h-2.5 rounded-full bg-stone-900 border border-stone-700" />
          </div>

          {/* Close Simulator Floating Button */}
          <button
            onClick={() => setIsMobileSimulatorOpen(false)}
            aria-label="Close mobile simulator"
            className="absolute -top-3 -right-3 z-40 p-2 bg-stone-800 hover:bg-stone-700 text-white rounded-full border border-stone-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Screen Content Wrapper */}
          <div className="relative w-full h-full bg-[#FAF9F6] rounded-[42px] overflow-hidden flex flex-col text-stone-900">
            {/* iOS Status Bar */}
            <div className="h-10 px-6 pt-3 flex items-center justify-between text-[11px] font-semibold text-stone-900 z-20">
              <span>9:41</span>
              <div className="flex items-center gap-1.5 text-stone-700">
                <Wifi className="w-3.5 h-3.5" />
                <Battery className="w-4 h-4" />
              </div>
            </div>

            {/* In-App Sync Header */}
            <div className="px-4 py-2 bg-white/90 border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <img
                  src="/src/assets/images/munsi_world_logo_1791647206349.jpg"
                  alt="Logo"
                  className="w-4 h-4 rounded-xs object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <span className="text-xs font-black tracking-tight uppercase">
                  MUNSI WORLD APP
                </span>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Synced
              </span>
            </div>

            {/* Mobile View Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeMobileTab === 'bag' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold font-serif-luxury text-stone-900">
                      Synchronized Shopping Bag
                    </h4>
                    <span className="text-xs text-stone-500 font-mono">({totalCartCount} items)</span>
                  </div>

                  {cart.length === 0 ? (
                    <div className="py-16 text-center space-y-2">
                      <ShoppingBag className="w-8 h-8 text-stone-300 mx-auto" />
                      <p className="text-xs text-stone-500">Your bag is synchronized and empty.</p>
                      <button
                        onClick={() => setActiveMobileTab('shop')}
                        className="text-xs font-semibold text-stone-900 underline"
                      >
                        Browse Mobile Catalog
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {cart.map((item) => (
                        <div
                          key={item.id}
                          className="flex gap-3 p-2.5 bg-white border border-stone-200 shadow-xs"
                        >
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-14 h-16 object-cover bg-stone-100 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-1 flex flex-col justify-between text-xs">
                            <div>
                              <div className="flex justify-between">
                                <h5 className="font-semibold text-stone-900 line-clamp-1">{item.title}</h5>
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="text-stone-400 hover:text-rose-600"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                              <p className="text-[11px] text-stone-500 mt-0.5">
                                Size {item.size} &bull; {item.color}
                              </p>
                            </div>

                            <div className="flex items-center justify-between pt-1">
                              <div className="flex items-center border border-stone-300">
                                <button
                                  onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                  className="px-1.5 py-0.5 text-stone-500"
                                >
                                  -
                                </button>
                                <span className="px-1.5 font-mono text-[11px]">{item.quantity}</span>
                                <button
                                  onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                  className="px-1.5 py-0.5 text-stone-500"
                                >
                                  +
                                </button>
                              </div>

                              <span className="font-mono font-semibold text-stone-900 text-xs">
                                {formatPrice(item.priceUSD * item.quantity)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Subtotal summary */}
                      <div className="p-3 bg-stone-100 text-xs space-y-1">
                        <div className="flex justify-between">
                          <span className="text-stone-500">Subtotal</span>
                          <span className="font-mono font-semibold">{formatPrice(subtotalUSD)}</span>
                        </div>
                        <div className="flex justify-between text-stone-500 text-[11px]">
                          <span>Air Express Shipping</span>
                          <span>{subtotalUSD >= 500 ? 'Complimentary' : formatPrice(35)}</span>
                        </div>
                      </div>

                      {/* Native Apple Pay 1-Tap Biometric button */}
                      <button
                        onClick={handleMobileBiometricCheckout}
                        disabled={biometricPaying}
                        className="w-full py-3 bg-black text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 active:scale-98 transition-transform shadow-md"
                      >
                        {biometricPaying ? (
                          <span>Authorizing with Face ID...</span>
                        ) : (
                          <>
                            <span className="text-base font-bold">Pay</span>
                            <span>Double-Click to Authorize</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeMobileTab === 'shop' && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold font-serif-luxury text-stone-900">
                    Quick Mobile Lookbook
                  </h4>
                  {products.slice(0, 3).map((prod) => (
                    <div key={prod.id} className="bg-white p-2.5 border border-stone-200 flex gap-3">
                      <img
                        src={prod.image}
                        alt={prod.title}
                        className="w-14 h-16 object-cover bg-stone-100 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 text-xs">
                        <p className="font-semibold text-stone-900 line-clamp-1">{prod.title}</p>
                        <p className="text-[11px] text-stone-500 capitalize">{prod.category} &bull; {prod.season}</p>
                        <p className="font-mono font-bold text-stone-900 mt-1">{formatPrice(prod.priceUSD)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeMobileTab === 'tracking' && (
                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold font-serif-luxury text-stone-900">
                      Mobile Tracking Updates
                    </h4>
                    <span className="text-[11px] text-emerald-700 font-semibold">Push Enabled</span>
                  </div>

                  {orders.slice(0, 2).map((order) => (
                    <div key={order.id} className="bg-white p-3 border border-stone-200 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold font-mono text-stone-900">{order.trackingNumber}</span>
                        <span className="text-[10px] bg-stone-900 text-white px-1.5 py-0.5 uppercase">
                          {order.carrier}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-600">
                        Status: <strong className="capitalize text-stone-900">{order.shippingStatus.replace(/_/g, ' ')}</strong>
                      </p>
                      <p className="text-[11px] text-stone-400">Destination: {order.shippingAddress.city}, {order.shippingAddress.country}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom iOS Navigation Bar */}
            <div className="h-14 border-t border-stone-200 bg-white flex items-center justify-around px-4 text-[10px] text-stone-500">
              <button
                onClick={() => setActiveMobileTab('shop')}
                className={`flex flex-col items-center gap-1 ${
                  activeMobileTab === 'shop' ? 'text-stone-900 font-bold' : ''
                }`}
              >
                <span>Lookbook</span>
              </button>

              <button
                onClick={() => setActiveMobileTab('bag')}
                className={`relative flex flex-col items-center gap-1 ${
                  activeMobileTab === 'bag' ? 'text-stone-900 font-bold' : ''
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Bag</span>
                {totalCartCount > 0 && (
                  <span className="absolute -top-1 right-1 w-3.5 h-3.5 bg-stone-900 text-white rounded-full text-[9px] flex items-center justify-center font-mono">
                    {totalCartCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveMobileTab('tracking')}
                className={`flex flex-col items-center gap-1 ${
                  activeMobileTab === 'tracking' ? 'text-stone-900 font-bold' : ''
                }`}
              >
                <Bell className="w-4 h-4" />
                <span>Shipments</span>
              </button>
            </div>

            {/* iOS Home Indicator Bar */}
            <div className="h-4 bg-white flex justify-center items-center pb-1">
              <div className="w-32 h-1 bg-stone-400 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
