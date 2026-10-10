import React from 'react';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const { setActiveView, setIsTrackingOpen, currency, language } = useStore();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full text-white text-xs select-none">
      {/* Amazon "Back to top" bar: #37475a */}
      <button
        onClick={scrollToTop}
        className="w-full py-4 bg-[#37475a] hover:bg-[#485769] text-center font-medium transition-colors"
      >
        Back to top
      </button>

      {/* Main 4-Column Footer: #232f3e */}
      <div className="bg-[#232f3e] py-10 px-4 sm:px-8 border-b border-stone-700">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Column 1 */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white text-sm">Get to Know Us</h4>
            <ul className="space-y-1.5 text-stone-300">
              <li className="hover:underline cursor-pointer" onClick={() => setActiveView('store')}>
                About MUNSI WORLD
              </li>
              <li className="hover:underline cursor-pointer" onClick={() => setActiveView('store')}>
                Artisanal Tailoring &amp; Mills
              </li>
              <li className="hover:underline cursor-pointer" onClick={() => setActiveView('store')}>
                Sustainability &amp; Natural Fibers
              </li>
              <li className="hover:underline cursor-pointer" onClick={() => setActiveView('store')}>
                MUNSI WORLD Innovation &amp; Apparel Tech
              </li>
            </ul>
          </div>

          {/* Column 2 */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white text-sm">Make Money with Us</h4>
            <ul className="space-y-1.5 text-stone-300">
              <li>
                <button
                  onClick={() => setActiveView('admin')}
                  className="hover:underline text-left text-stone-300"
                >
                  Sell on MUNSI WORLD Seller Central
                </button>
              </li>
              <li className="hover:underline cursor-pointer">Fulfillment by Munsi (FBM/FBA)</li>
              <li className="hover:underline cursor-pointer">Supply Garments to MUNSI WORLD</li>
              <li className="hover:underline cursor-pointer">Advertise Your Apparel Brand</li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white text-sm">Payment Products</h4>
            <ul className="space-y-1.5 text-stone-300">
              <li className="hover:underline cursor-pointer">MUNSI WORLD Prime Rewards</li>
              <li className="hover:underline cursor-pointer">MUNSI WORLD Store Card</li>
              <li className="hover:underline cursor-pointer">Global Currency Converter</li>
              <li className="hover:underline cursor-pointer">Gift Cards &amp; Klarna 4x</li>
            </ul>
          </div>

          {/* Column 4 */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white text-sm">Let Us Help You</h4>
            <ul className="space-y-1.5 text-stone-300">
              <li>
                <button
                  onClick={() => setActiveView('customers')}
                  className="hover:underline text-left text-stone-300"
                >
                  Your Account &amp; Sizing Profile
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('customers')}
                  className="hover:underline text-left text-stone-300"
                >
                  Your Orders &amp; Receipts
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsTrackingOpen(true)}
                  className="hover:underline text-left text-stone-300"
                >
                  Shipping Rates &amp; Air Tracking
                </button>
              </li>
              <li className="hover:underline cursor-pointer">Returns &amp; Replacements</li>
              <li className="hover:underline cursor-pointer">VIP Concierge Help</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Sub-Footer: #131921 */}
      <div className="bg-[#131921] py-8 px-4 text-center text-[11px] text-stone-400 space-y-3">
        <div className="flex items-center justify-center gap-6">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveView('store')}>
            <div className="w-6 h-6 rounded-xs overflow-hidden bg-black/40 border border-[#febd69]/50 shrink-0">
              <img
                src="/src/assets/images/munsi_world_logo_1791647206349.jpg"
                alt="MUNSI WORLD Logo"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="flex items-baseline">
              <span className="text-lg font-black tracking-tight text-white">MUNSI WORLD</span>
              <span className="text-xs text-[#febd69] font-medium ml-1">.garments</span>
            </div>
          </div>

          <div className="flex items-center gap-2 border border-stone-600 px-3 py-1 rounded-sm text-stone-300">
            <span>Language: {language.toUpperCase()}</span>
            <span>&bull;</span>
            <span>Currency: {currency}</span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 text-stone-400">
          <span className="hover:underline cursor-pointer">Conditions of Use</span>
          <span className="hover:underline cursor-pointer">Privacy Notice</span>
          <span className="hover:underline cursor-pointer">Consumer Health Data Privacy</span>
          <span className="hover:underline cursor-pointer">Your Ads Privacy Choices</span>
        </div>

        <p>&copy; 1996-{new Date().getFullYear()}, MUNSI WORLD, Inc. or its affiliates. Amazon-Style Global Garments Platform.</p>
      </div>
    </footer>
  );
};
