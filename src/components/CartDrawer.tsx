import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, Plus, Minus, Trash2, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    formatPrice,
    setIsCheckoutOpen,
  } = useStore();

  if (!isCartOpen) return null;

  const subtotalUSD = cart.reduce((acc, item) => acc + item.priceUSD * item.quantity, 0);
  const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const isFreePrime = subtotalUSD >= 500;

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="relative w-full max-w-md bg-white shadow-2xl flex flex-col h-full border-l border-[#d5d9d9]">
        {/* Amazon Cart Header */}
        <div className="p-4 bg-[#f0f2f2] border-b border-[#d5d9d9] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#0f1111]">
              Shopping Cart
            </h2>
            <span className="text-xs text-stone-500 font-mono">
              ({totalCount} {totalCount === 1 ? 'item' : 'items'})
            </span>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart"
            className="p-1.5 text-stone-500 hover:text-stone-900 rounded hover:bg-stone-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amazon Prime Free Shipping Bar */}
        <div className="px-4 py-2.5 bg-emerald-50 border-b border-emerald-200 text-xs flex items-center gap-2 text-emerald-900">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>
            {isFreePrime
              ? 'Your order qualifies for FREE Prime Two-Day Air Delivery.'
              : `Add ${formatPrice(500 - subtotalUSD)} more for complimentary Prime Air Delivery.`}
          </span>
        </div>

        {/* Itemized List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-3">
              <p className="text-stone-600 text-sm font-bold">Your MUNSI WORLD Cart is empty.</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-xs font-bold text-[#007185] hover:underline"
              >
                Continue shopping for luxury garments
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 pb-4 border-b border-[#d5d9d9] last:border-0"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-16 h-20 object-cover bg-stone-100 border border-stone-200 shrink-0"
                  referrerPolicy="no-referrer"
                />

                <div className="flex-1 text-xs flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-[#0f1111] line-clamp-1">{item.title}</h4>
                    <p className="text-emerald-700 font-semibold text-[11px]">In Stock</p>
                    <p className="text-stone-500 text-[11px]">
                      Size: {item.size} &bull; Color: {item.color}
                    </p>
                    <div className="flex items-center gap-1 text-[#00a8e1] font-bold text-[10px]">
                      <span className="bg-[#00a8e1] text-white px-1 py-0.2 rounded text-[8px]">prime</span>
                      <span>FREE Delivery</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center border border-[#d5d9d9] rounded-md bg-[#f0f2f2]">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-0.5 text-stone-600 hover:text-stone-900"
                      >
                        -
                      </button>
                      <span className="px-2 font-bold font-mono">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-0.5 text-stone-600 hover:text-stone-900"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-bold text-[#0f1111] font-mono text-sm">
                      {formatPrice(item.priceUSD * item.quantity)}
                    </span>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-[#007185] hover:underline text-[11px] self-start mt-1"
                  >
                    Delete item
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Amazon Checkout Summary Footer */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-[#d5d9d9] bg-[#f0f2f2] space-y-3">
            <div className="flex justify-between items-baseline text-sm">
              <span className="text-stone-700">Subtotal ({totalCount} items):</span>
              <span className="font-bold text-[#0f1111] text-lg font-mono">
                {formatPrice(subtotalUSD)}
              </span>
            </div>

            {/* Big Yellow Amazon "Proceed to checkout" Button */}
            <button
              onClick={handleProceedToCheckout}
              className="w-full py-2.5 btn-amazon-primary text-xs font-bold shadow-xs flex items-center justify-center gap-2"
            >
              <span>Proceed to checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-500">
              <ShieldCheck className="w-3.5 h-3.5 text-stone-600" />
              <span>Amazon 256-bit Encrypted Checkout</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
