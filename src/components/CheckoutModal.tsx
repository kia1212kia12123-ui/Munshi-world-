import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  CreditCard,
  Lock,
  ShieldCheck,
  CheckCircle2,
  Truck,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { ShippingCarrier } from '../types';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    formatPrice,
    placeOrder,
    setIsTrackingOpen,
    activeCustomer,
  } = useStore();

  const [step, setStep] = useState<'details' | 'payment' | 'processing' | 'confirmed'>('details');
  const [carrier, setCarrier] = useState<ShippingCarrier>('DHL Express');
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'apple_pay' | 'paypal' | 'klarna'>('credit_card');

  // Form states
  const [formData, setFormData] = useState({
    firstName: activeCustomer.name.split(' ')[0] || 'Claire',
    lastName: activeCustomer.name.split(' ')[1] || 'Beauchamp',
    email: activeCustomer.email || 'c.beauchamp@luxuryclient.fr',
    street: '14 Rue du Faubourg Saint-Honoré',
    city: activeCustomer.city || 'Paris',
    country: activeCustomer.country || 'France',
    postalCode: '75008',
    cardNumber: '4532 8920 1849 9204',
    cardExpiry: '11/29',
    cardCvc: '842',
    cardName: activeCustomer.name.toUpperCase(),
  });

  const [confirmedOrderId, setConfirmedOrderId] = useState<string>('');

  if (!isCheckoutOpen) return null;

  const subtotalUSD = cart.reduce((acc, item) => acc + item.priceUSD * item.quantity, 0);
  const shippingUSD = subtotalUSD >= 500 ? 0 : 35;
  const taxUSD = Math.round(subtotalUSD * 0.12 * 100) / 100;
  const totalUSD = subtotalUSD + shippingUSD + taxUSD;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNextToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handleExecutePayment = () => {
    setStep('processing');

    setTimeout(() => {
      const order = placeOrder({
        customerName: `${formData.firstName} ${formData.lastName}`,
        customerEmail: formData.email,
        carrier,
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          country: formData.country,
          postalCode: formData.postalCode,
        },
        subtotalUSD,
        shippingUSD,
        taxUSD,
        totalUSD,
        paymentMethod,
      });

      setConfirmedOrderId(order.id);
      setStep('confirmed');
    }, 1400);
  };

  const handleViewLiveTracking = () => {
    setIsCheckoutOpen(false);
    setIsTrackingOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="relative w-full max-w-3xl bg-white border border-[#d5d9d9] shadow-2xl rounded-lg overflow-hidden my-auto">
        {/* Amazon Checkout Top Header */}
        <div className="bg-[#f0f2f2] px-6 py-3 border-b border-[#d5d9d9] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-xs overflow-hidden bg-stone-900 border border-[#febd69]/50 shrink-0">
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
                <span className="text-base sm:text-lg font-black tracking-tight text-[#0f1111]">MUNSI WORLD</span>
                <span className="text-xs text-[#c45500] font-bold ml-1">checkout</span>
              </div>
            </div>
            <span className="text-stone-300">|</span>
            <div className="flex items-center gap-1 text-xs text-stone-600">
              <Lock className="w-3.5 h-3.5 text-stone-600" />
              <span>256-Bit SSL Secure Ordering</span>
            </div>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(false)}
            aria-label="Close"
            className="p-1 text-stone-500 hover:text-stone-900 rounded hover:bg-stone-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Address & Shipping speed */}
        {step === 'details' && (
          <form onSubmit={handleNextToPayment} className="p-6 space-y-6 text-xs">
            <div>
              <div className="flex items-center gap-2 pb-2 border-b border-[#d5d9d9] mb-4">
                <span className="w-5 h-5 bg-[#232f3e] text-white rounded-full flex items-center justify-center font-bold text-xs">
                  1
                </span>
                <h3 className="text-sm font-bold text-[#0f1111]">
                  Choose a shipping address &amp; destination
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full bg-[#f0f2f2] border border-[#d5d9d9] px-3 py-1.5 rounded focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full bg-[#f0f2f2] border border-[#d5d9d9] px-3 py-1.5 rounded focus:bg-white focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-bold text-stone-700 mb-1">Email address for DHL tracking</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-[#f0f2f2] border border-[#d5d9d9] px-3 py-1.5 rounded focus:bg-white focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-bold text-stone-700 mb-1">Street Address</label>
                  <input
                    type="text"
                    name="street"
                    required
                    value={formData.street}
                    onChange={handleInputChange}
                    className="w-full bg-[#f0f2f2] border border-[#d5d9d9] px-3 py-1.5 rounded focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full bg-[#f0f2f2] border border-[#d5d9d9] px-3 py-1.5 rounded focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Country / Region</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full bg-[#f0f2f2] border border-[#d5d9d9] px-3 py-1.5 rounded focus:bg-white focus:outline-none"
                  >
                    <option value="France">France</option>
                    <option value="United States">United States</option>
                    <option value="Japan">Japan</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Germany">Germany</option>
                    <option value="Italy">Italy</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    required
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full bg-[#f0f2f2] border border-[#d5d9d9] px-3 py-1.5 rounded focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Carrier speed selection */}
            <div>
              <div className="flex items-center gap-2 pb-2 border-b border-[#d5d9d9] mb-3">
                <span className="w-5 h-5 bg-[#232f3e] text-white rounded-full flex items-center justify-center font-bold text-xs">
                  2
                </span>
                <h3 className="text-sm font-bold text-[#0f1111]">
                  Choose your delivery option
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    name: 'DHL Express' as ShippingCarrier,
                    label: 'FREE Prime Two-Day Air Delivery',
                    time: 'Tomorrow, Oct 11',
                    rate: shippingUSD === 0 ? 'FREE' : formatPrice(35),
                  },
                  {
                    name: 'FedEx International' as ShippingCarrier,
                    label: 'FedEx Priority Air',
                    time: 'In 2 business days',
                    rate: shippingUSD === 0 ? 'FREE' : formatPrice(38),
                  },
                  {
                    name: 'UPS Worldwide' as ShippingCarrier,
                    label: 'UPS Worldwide Saver',
                    time: 'In 3 business days',
                    rate: shippingUSD === 0 ? 'FREE' : formatPrice(32),
                  },
                ].map((c) => (
                  <label
                    key={c.name}
                    className={`p-3 border rounded-md cursor-pointer flex flex-col justify-between ${
                      carrier === c.name
                        ? 'border-[#007185] bg-[#f0f2f2]'
                        : 'border-[#d5d9d9] hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-bold text-[#0f1111]">{c.name}</span>
                      <input
                        type="radio"
                        name="carrier"
                        checked={carrier === c.name}
                        onChange={() => setCarrier(c.name)}
                      />
                    </div>
                    <div className="mt-2 text-[11px] text-stone-600">
                      <p className="font-semibold text-emerald-800">{c.time}</p>
                      <p className="font-bold text-[#0f1111] mt-0.5">{c.rate}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Proceed to payment */}
            <div className="pt-4 border-t border-[#d5d9d9] flex items-center justify-between">
              <div>
                <span className="text-stone-500">Order Subtotal: </span>
                <span className="font-bold text-base text-[#0f1111] font-mono">
                  {formatPrice(totalUSD)}
                </span>
              </div>

              <button
                type="submit"
                className="py-2.5 px-6 btn-amazon-primary text-xs font-bold shadow-xs flex items-center gap-1.5"
              >
                <span>Continue to Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Payment method */}
        {step === 'payment' && (
          <div className="p-6 space-y-6 text-xs">
            <div className="flex items-center gap-2 pb-2 border-b border-[#d5d9d9]">
              <span className="w-5 h-5 bg-[#232f3e] text-white rounded-full flex items-center justify-center font-bold text-xs">
                3
              </span>
              <h3 className="text-sm font-bold text-[#0f1111]">
                Select a payment method
              </h3>
            </div>

            {/* Gateway choices */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('credit_card')}
                className={`p-3 border rounded-md flex flex-col items-center justify-center gap-1 ${
                  paymentMethod === 'credit_card'
                    ? 'border-[#007185] bg-[#f0f2f2] font-bold text-[#007185]'
                    : 'border-[#d5d9d9] bg-white text-stone-700'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Credit / Debit Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('apple_pay')}
                className={`p-3 border rounded-md flex flex-col items-center justify-center gap-1 ${
                  paymentMethod === 'apple_pay'
                    ? 'border-[#007185] bg-[#f0f2f2] font-bold text-[#007185]'
                    : 'border-[#d5d9d9] bg-white text-stone-700'
                }`}
              >
                <span className="font-bold text-sm">Pay</span>
                <span className="text-[10px]">1-Tap Biometric</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('paypal')}
                className={`p-3 border rounded-md flex flex-col items-center justify-center gap-1 ${
                  paymentMethod === 'paypal'
                    ? 'border-[#007185] bg-[#f0f2f2] font-bold text-[#007185]'
                    : 'border-[#d5d9d9] bg-white text-stone-700'
                }`}
              >
                <span className="font-bold text-sky-800 text-sm">PayPal</span>
                <span className="text-[10px]">Express Checkout</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('klarna')}
                className={`p-3 border rounded-md flex flex-col items-center justify-center gap-1 ${
                  paymentMethod === 'klarna'
                    ? 'border-[#007185] bg-[#f0f2f2] font-bold text-[#007185]'
                    : 'border-[#d5d9d9] bg-white text-stone-700'
                }`}
              >
                <span className="font-bold text-pink-700 text-sm">Klarna</span>
                <span className="text-[10px]">4x Installments</span>
              </button>
            </div>

            {/* Credit card form */}
            {paymentMethod === 'credit_card' && (
              <div className="bg-[#f0f2f2] p-4 border border-[#d5d9d9] rounded-md space-y-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Card number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-[#d5d9d9] p-2 font-mono text-xs rounded"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Expiration date</label>
                    <input
                      type="text"
                      name="cardExpiry"
                      value={formData.cardExpiry}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-[#d5d9d9] p-2 font-mono text-xs rounded"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Security code (CVV)</label>
                    <input
                      type="password"
                      name="cardCvc"
                      value={formData.cardCvc}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-[#d5d9d9] p-2 font-mono text-xs rounded"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Name on card</label>
                  <input
                    type="text"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-[#d5d9d9] p-2 text-xs rounded uppercase"
                  />
                </div>
              </div>
            )}

            {/* Order total review box & Yellow Place Order Button */}
            <div className="p-4 bg-[#f0f2f2] border border-[#d5d9d9] rounded-md flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-stone-500">Order Total: </span>
                <span className="font-bold text-xl text-[#0f1111] font-mono">
                  {formatPrice(totalUSD)}
                </span>
                <p className="text-[11px] text-stone-500">
                  By placing your order, you agree to Amazon Garments Conditions of Use.
                </p>
              </div>

              {/* Big Yellow Amazon Place Order Button */}
              <button
                type="button"
                onClick={handleExecutePayment}
                className="w-full sm:w-auto py-3 px-8 btn-amazon-primary text-xs font-bold shadow-md shrink-0"
              >
                Place your order
              </button>
            </div>
          </div>
        )}

        {/* Processing Step */}
        {step === 'processing' && (
          <div className="p-16 text-center space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-[#febd69] mx-auto" />
            <h4 className="text-base font-bold text-[#0f1111]">
              Placing your Amazon Garments Order...
            </h4>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Authorizing financial network and dispatching air freight manifest to DHL...
            </p>
          </div>
        )}

        {/* Confirmed Step */}
        {step === 'confirmed' && (
          <div className="p-8 text-center space-y-6">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                Order Placed, Thank You!
              </span>
              <h3 className="text-2xl font-bold text-[#0f1111] mt-1">
                Order #{confirmedOrderId}
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Confirmation email and DHL express airway tracking sent to <strong className="text-stone-800">{formData.email}</strong>.
              </p>
            </div>

            <div className="p-4 bg-[#f0f2f2] border border-[#d5d9d9] rounded-md max-w-md mx-auto text-xs space-y-1.5 text-left">
              <p className="font-bold text-[#0f1111]">
                Guaranteed Delivery: <span className="text-emerald-700">Tomorrow, Oct 11 by 8 PM</span>
              </p>
              <p className="text-stone-600">Carrier: {carrier} Priority Air Freight</p>
              <p className="text-stone-600">Shipping to: {formData.city}, {formData.country}</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleViewLiveTracking}
                className="w-full sm:w-auto py-2.5 px-6 btn-amazon-primary font-bold text-xs"
              >
                Track package live
              </button>
              <button
                type="button"
                onClick={() => setIsCheckoutOpen(false)}
                className="w-full sm:w-auto py-2.5 px-6 btn-amazon-white font-medium text-xs"
              >
                Return to store
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
