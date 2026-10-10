import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Package,
  Shield,
  CreditCard,
  MapPin,
  Ruler,
  MessageSquare,
  Search,
  CheckCircle2,
  Clock,
  ChevronRight,
  ExternalLink,
  Save,
  RotateCcw,
  Sparkles,
  Truck,
  Send,
  Plus,
  HelpCircle,
  FileText,
  Lock,
} from 'lucide-react';
import { Order } from '../types';

export const CustomerPortal: React.FC = () => {
  const {
    customers,
    activeCustomerId,
    setActiveCustomerId,
    activeCustomer,
    orders,
    formatPrice,
    updateCustomerMeasurements,
    setIsTrackingOpen,
    setActiveTrackingOrder,
    setIsReviewModalOpen,
    setSelectedProductId,
    addToCart,
    products,
    showNotification,
    customerSection,
    setCustomerSection,
    setActiveView,
  } = useStore();

  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderTimeframe, setOrderTimeframe] = useState('past3months');

  // Measurements form state
  const [measurements, setMeasurements] = useState(
    activeCustomer?.measurements || {
      chestCm: 96,
      waistCm: 78,
      hipsCm: 98,
      inseamCm: 81,
    }
  );

  // Concierge chat state
  const [conciergeMessages, setConciergeMessages] = useState<Array<{ sender: 'user' | 'concierge'; text: string; time: string }>>([
    {
      sender: 'concierge',
      text: `Hello ${activeCustomer.name.split(' ')[0]}, welcome to MUNSI WORLD Private Tailor Concierge. How may our Milan and Tokyo ateliers assist with your garments today?`,
      time: '10:00 AM',
    },
  ]);
  const [chatInput, setChatInput] = useState('');

  // Payment methods state
  const [paymentCards, setPaymentCards] = useState([
    { id: 'c1', type: 'Visa', last4: '9204', expiry: '11/29', holder: activeCustomer.name.toUpperCase(), isDefault: true },
    { id: 'c2', type: 'Apple Pay', last4: 'Device Token', expiry: 'Active', holder: 'Face ID Verified', isDefault: false },
    { id: 'c3', type: 'MUNSI Store Card', last4: '4108', expiry: '05/30', holder: activeCustomer.name.toUpperCase(), isDefault: false },
  ]);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardExpiry, setNewCardExpiry] = useState('');

  const customerOrders = orders.filter((o) => {
    const matchUser =
      o.customerEmail.toLowerCase() === activeCustomer.email.toLowerCase() ||
      o.customerName.toLowerCase() === activeCustomer.name.toLowerCase();
    if (!matchUser) return false;
    if (orderSearchQuery.trim()) {
      const q = orderSearchQuery.toLowerCase();
      const matchItem = o.items.some((i) => i.title.toLowerCase().includes(q));
      const matchId = o.id.toLowerCase().includes(q) || o.trackingNumber.toLowerCase().includes(q);
      return matchItem || matchId;
    }
    return true;
  });

  const handleSaveMeasurements = (e: React.FormEvent) => {
    e.preventDefault();
    updateCustomerMeasurements(activeCustomer.id, measurements);
    showNotification('Garment sizing dossier successfully saved to MUNSI WORLD fit engine.', 'success');
  };

  const handleBuyAgain = (order: Order) => {
    if (order.items.length > 0) {
      const item = order.items[0];
      const prod = products.find((p) => p.id === item.productId);
      if (prod) {
        const variant = prod.variants.find((v) => v.id === item.variantId) || prod.variants[0];
        addToCart(prod, variant, 1);
        showNotification(`Re-ordered "${item.title}" (Size ${variant.size}). Added to Cart.`, 'success');
      }
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = { sender: 'user' as const, text: chatInput.trim(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setConciergeMessages((prev) => [...prev, userMsg]);
    setChatInput('');

    setTimeout(() => {
      const replies = [
        `Thank you for inquiring, ${activeCustomer.name.split(' ')[0]}. Your personal master tailor has noted this request for your bespoke garments.`,
        'We have checked your order with DHL Air Express. It is cleared and traveling via priority courier.',
        'Our Biella virgin wool and Mongolian cashmere collections come with complimentary lifetime button replacement and fit adjustments.',
      ];
      const replyText = replies[Math.floor(Math.random() * replies.length)];
      setConciergeMessages((prev) => [
        ...prev,
        {
          sender: 'concierge',
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1000);
  };

  const handleAddNewCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardNumber.trim()) return;
    const newCard = {
      id: `c-${Date.now()}`,
      type: newCardNumber.startsWith('4') ? 'Visa' : 'Mastercard',
      last4: newCardNumber.slice(-4) || '1234',
      expiry: newCardExpiry || '12/28',
      holder: activeCustomer.name.toUpperCase(),
      isDefault: false,
    };
    setPaymentCards([...paymentCards, newCard]);
    setIsAddCardOpen(false);
    setNewCardNumber('');
    setNewCardExpiry('');
    showNotification('New credit card added to your secure wallet.', 'success');
  };

  return (
    <div className="min-h-screen bg-[#eaeded] py-6 px-4 sm:px-6 lg:px-8 text-[#0f1111]">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Amazon Account Breadcrumb & Section Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#d5d9d9] text-xs">
          <div className="text-stone-600 flex items-center gap-1.5">
            <button
              onClick={() => setCustomerSection('hub')}
              className="amazon-link font-semibold hover:underline"
            >
              Your Account
            </button>
            <span>&rsaquo;</span>
            <span className="text-[#c45500] font-bold capitalize">
              {customerSection === 'hub'
                ? 'Account Overview'
                : customerSection === 'orders'
                ? 'Your Orders'
                : customerSection === 'measurements'
                ? 'Fit & Sizing Profile'
                : customerSection === 'addresses'
                ? 'Your Addresses'
                : customerSection === 'payments'
                ? 'Your Payments & Wallet'
                : customerSection === 'prime'
                ? 'MUNSI Prime Membership'
                : 'Customer Service Concierge'}
            </span>
          </div>

          {/* Quick tab switcher strip */}
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap text-xs">
            {[
              { id: 'hub', label: 'Overview' },
              { id: 'orders', label: `Orders (${customerOrders.length})` },
              { id: 'measurements', label: 'Fit Profile' },
              { id: 'addresses', label: 'Addresses' },
              { id: 'payments', label: 'Payments' },
              { id: 'prime', label: 'Prime Benefits' },
              { id: 'concierge', label: 'Concierge Chat' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCustomerSection(tab.id as any)}
                className={`px-3 py-1 rounded-sm text-xs font-medium transition-colors ${
                  customerSection === tab.id
                    ? 'bg-[#232f3e] text-white font-bold'
                    : 'bg-white border border-[#d5d9d9] text-[#0f1111] hover:bg-stone-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Client Demo Switcher Bar */}
        <div className="bg-white border border-[#d5d9d9] p-4 rounded-md shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-[#232f3e] text-white rounded-full flex items-center justify-center font-bold text-base shadow-xs">
              {activeCustomer.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-[#0f1111]">{activeCustomer.name}</h1>
                <span className="text-[11px] font-bold px-2 py-0.5 bg-[#febd69] text-[#131921] rounded-sm">
                  {activeCustomer.tier === 'private_client'
                    ? 'Prime VIP Member'
                    : activeCustomer.tier === 'vip_gold'
                    ? 'Prime Gold'
                    : 'Amazon Standard'}
                </span>
              </div>
              <p className="text-xs text-stone-500">
                {activeCustomer.email} &bull; {activeCustomer.city}, {activeCustomer.country} &bull; Preferred Size: {activeCustomer.preferredSize}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-stone-600 font-medium">Switch Active Account:</span>
            <select
              value={activeCustomerId}
              aria-label="Switch Customer Profile"
              onChange={(e) => setActiveCustomerId(e.target.value)}
              className="bg-[#f0f2f2] border border-[#d5d9d9] px-3 py-1.5 text-xs text-[#0f1111] font-medium rounded-md focus:outline-none cursor-pointer"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.city})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Amazon 3x2 Account Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Card 1: Your Orders */}
          <div
            onClick={() => setCustomerSection('orders')}
            className={`bg-white border p-4 rounded-lg cursor-pointer transition-all flex items-start gap-4 hover:border-stone-400 ${
              customerSection === 'orders' ? 'border-[#007185] ring-2 ring-[#007185]/20 bg-sky-50/20' : 'border-[#d5d9d9]'
            }`}
          >
            <div className="p-3 bg-[#f0f2f2] rounded-full shrink-0">
              <Package className="w-6 h-6 text-[#007185]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0f1111]">Your Orders</h2>
              <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                Track DHL packages, return garments, or buy items again.
              </p>
              <span className="text-[11px] font-bold text-[#007185] mt-1 block">
                {customerOrders.length} Recent Orders
              </span>
            </div>
          </div>

          {/* Card 2: Garment Sizing Profile */}
          <div
            onClick={() => setCustomerSection('measurements')}
            className={`bg-white border p-4 rounded-lg cursor-pointer transition-all flex items-start gap-4 hover:border-stone-400 ${
              customerSection === 'measurements' ? 'border-[#007185] ring-2 ring-[#007185]/20 bg-sky-50/20' : 'border-[#d5d9d9]'
            }`}
          >
            <div className="p-3 bg-[#f0f2f2] rounded-full shrink-0">
              <Ruler className="w-6 h-6 text-[#007185]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0f1111]">Garment Sizing Profile</h2>
              <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                Chest, waist, and inseam measurements for tailored coats &amp; trousers.
              </p>
              <span className="text-[11px] font-bold text-[#007185] mt-1 block">
                Size {activeCustomer.preferredSize} Recommended
              </span>
            </div>
          </div>

          {/* Card 3: Your Addresses */}
          <div
            onClick={() => setCustomerSection('addresses')}
            className={`bg-white border p-4 rounded-lg cursor-pointer transition-all flex items-start gap-4 hover:border-stone-400 ${
              customerSection === 'addresses' ? 'border-[#007185] ring-2 ring-[#007185]/20 bg-sky-50/20' : 'border-[#d5d9d9]'
            }`}
          >
            <div className="p-3 bg-[#f0f2f2] rounded-full shrink-0">
              <MapPin className="w-6 h-6 text-[#007185]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0f1111]">Your Addresses</h2>
              <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                Manage global shipping addresses &amp; 1-Click courier preferences.
              </p>
              <span className="text-[11px] font-bold text-[#007185] mt-1 block">
                Default: {activeCustomer.city}, {activeCustomer.country}
              </span>
            </div>
          </div>

          {/* Card 4: MUNSI Prime Membership */}
          <div
            onClick={() => setCustomerSection('prime')}
            className={`bg-white border p-4 rounded-lg cursor-pointer transition-all flex items-start gap-4 hover:border-stone-400 ${
              customerSection === 'prime' ? 'border-[#007185] ring-2 ring-[#007185]/20 bg-sky-50/20' : 'border-[#d5d9d9]'
            }`}
          >
            <div className="p-3 bg-[#f0f2f2] rounded-full shrink-0">
              <Shield className="w-6 h-6 text-[#007185]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0f1111]">MUNSI Prime Benefits</h2>
              <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                Complimentary DHL Air Worldwide &amp; 24/7 tailor concierge.
              </p>
              <span className="text-[11px] font-bold text-[#007185] mt-1 block">
                Lifetime Spend: {formatPrice(activeCustomer.totalSpendUSD)}
              </span>
            </div>
          </div>

          {/* Card 5: Your Payments */}
          <div
            onClick={() => setCustomerSection('payments')}
            className={`bg-white border p-4 rounded-lg cursor-pointer transition-all flex items-start gap-4 hover:border-stone-400 ${
              customerSection === 'payments' ? 'border-[#007185] ring-2 ring-[#007185]/20 bg-sky-50/20' : 'border-[#d5d9d9]'
            }`}
          >
            <div className="p-3 bg-[#f0f2f2] rounded-full shrink-0">
              <CreditCard className="w-6 h-6 text-[#007185]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0f1111]">Your Payments</h2>
              <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                Manage stored cards, Apple Pay, PayPal, and digital wallet.
              </p>
              <span className="text-[11px] font-bold text-[#007185] mt-1 block">
                {paymentCards.length} Active Methods
              </span>
            </div>
          </div>

          {/* Card 6: Customer Service Concierge */}
          <div
            onClick={() => setCustomerSection('concierge')}
            className={`bg-white border p-4 rounded-lg cursor-pointer transition-all flex items-start gap-4 hover:border-stone-400 ${
              customerSection === 'concierge' ? 'border-[#007185] ring-2 ring-[#007185]/20 bg-sky-50/20' : 'border-[#d5d9d9]'
            }`}
          >
            <div className="p-3 bg-[#f0f2f2] rounded-full shrink-0">
              <MessageSquare className="w-6 h-6 text-[#007185]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0f1111]">Customer Service</h2>
              <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                Live chat with Milan &amp; Tokyo master tailor concierge anytime.
              </p>
              <span className="text-[11px] font-bold text-emerald-700 mt-1 block">
                Live Concierge Online
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 0: Amazon Account Hub Overview */}
        {customerSection === 'hub' && (
          <div className="space-y-6">
            <div className="bg-white border border-[#d5d9d9] p-6 rounded-lg shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#d5d9d9]">
                <div>
                  <h2 className="text-xl font-bold text-[#0f1111]">Recent Activity &amp; Highlights</h2>
                  <p className="text-xs text-stone-500">Quick snapshot of your MUNSI WORLD account, shipments, and sizing status.</p>
                </div>
                <button
                  onClick={() => setCustomerSection('orders')}
                  className="px-4 py-1.5 btn-amazon-primary text-xs font-bold"
                >
                  View All Orders
                </button>
              </div>

              {customerOrders.length > 0 ? (
                <div className="bg-[#f0f2f2] p-4 rounded-md border border-[#d5d9d9] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded border border-[#d5d9d9] flex items-center justify-center shrink-0">
                      <Truck className="w-6 h-6 text-[#007185]" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-[#007185] uppercase tracking-wide">Most Recent Order #{customerOrders[0].id}</span>
                      <h3 className="text-sm font-bold text-[#0f1111]">{customerOrders[0].items[0]?.title}</h3>
                      <p className="text-xs text-stone-600">
                        Status: <span className="font-bold capitalize text-emerald-800">{customerOrders[0].shippingStatus.replace(/_/g, ' ')}</span> &bull; Carrier: {customerOrders[0].carrier} ({customerOrders[0].trackingNumber})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setActiveTrackingOrder(customerOrders[0]);
                        setIsTrackingOpen(true);
                      }}
                      className="px-3 py-1.5 btn-amazon-primary text-xs font-bold"
                    >
                      Track Package
                    </button>
                    <button
                      onClick={() => handleBuyAgain(customerOrders[0])}
                      className="px-3 py-1.5 btn-amazon-white text-xs font-medium"
                    >
                      Buy Again
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-stone-500">No recent orders placed.</p>
              )}

              {/* Fast links */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div
                  onClick={() => setCustomerSection('measurements')}
                  className="p-3 border border-[#d5d9d9] rounded hover:bg-stone-50 cursor-pointer"
                >
                  <span className="font-bold text-[#0f1111] block">Bespoke Fit Status: Confirmed</span>
                  <p className="text-stone-500 mt-1">Chest: {activeCustomer.measurements.chestCm}cm, Waist: {activeCustomer.measurements.waistCm}cm. Click to edit.</p>
                </div>
                <div
                  onClick={() => setCustomerSection('addresses')}
                  className="p-3 border border-[#d5d9d9] rounded hover:bg-stone-50 cursor-pointer"
                >
                  <span className="font-bold text-[#0f1111] block">Default Address: {activeCustomer.city}</span>
                  <p className="text-stone-500 mt-1">14 Rue du Faubourg Saint-Honoré, {activeCustomer.country}. Click to manage.</p>
                </div>
                <div
                  onClick={() => setCustomerSection('prime')}
                  className="p-3 border border-[#d5d9d9] rounded hover:bg-stone-50 cursor-pointer"
                >
                  <span className="font-bold text-[#0f1111] block">Prime Status: Active</span>
                  <p className="text-stone-500 mt-1">Complimentary DHL Air Express Worldwide included with every order.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 1: Amazon Your Orders View */}
        {customerSection === 'orders' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#d5d9d9]">
              <h2 className="text-2xl font-bold text-[#0f1111]">Your Orders</h2>

              {/* Order Search Bar */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search all orders..."
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    className="bg-white border border-[#d5d9d9] px-3 py-1.5 pl-8 text-xs text-[#0f1111] rounded-md focus:outline-none focus:ring-1 focus:ring-[#e77600]"
                  />
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                </div>

                <select
                  value={orderTimeframe}
                  aria-label="Order Timeframe"
                  onChange={(e) => setOrderTimeframe(e.target.value)}
                  className="bg-[#f0f2f2] border border-[#d5d9d9] px-2.5 py-1.5 text-xs text-[#0f1111] rounded-md focus:outline-none cursor-pointer"
                >
                  <option value="past3months">past 3 months</option>
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="archived">Archived Orders</option>
                </select>
              </div>
            </div>

            {/* List of Amazon Order Cards */}
            {customerOrders.length === 0 ? (
              <div className="bg-white border border-[#d5d9d9] p-12 text-center rounded-lg space-y-3">
                <Package className="w-10 h-10 text-stone-300 mx-auto" />
                <h3 className="text-base font-bold text-[#0f1111]">You have not placed any garment orders in this period.</h3>
                <p className="text-xs text-stone-500">Explore the latest Spring / Summer 2026 outerwear and knitwear collections.</p>
                <button
                  onClick={() => setActiveView('store')}
                  className="px-4 py-2 btn-amazon-primary font-bold text-xs"
                >
                  Browse MUNSI WORLD Catalog
                </button>
              </div>
            ) : (
              customerOrders.map((order) => {
                const isDelivered = order.shippingStatus === 'delivered';

                return (
                  <div
                    key={order.id}
                    className="bg-white border border-[#d5d9d9] rounded-lg shadow-xs overflow-hidden text-xs"
                  >
                    {/* Order Card Amazon Header Bar: #f0f2f2 */}
                    <div className="bg-[#f0f2f2] px-4 sm:px-6 py-3 border-b border-[#d5d9d9] flex flex-wrap items-center justify-between gap-4 text-stone-600">
                      <div className="flex flex-wrap items-center gap-6 sm:gap-10">
                        <div>
                          <span className="block text-[11px] uppercase tracking-wider text-stone-500">
                            Order Placed
                          </span>
                          <span className="font-bold text-[#0f1111]">
                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>

                        <div>
                          <span className="block text-[11px] uppercase tracking-wider text-stone-500">
                            Total
                          </span>
                          <span className="font-bold text-[#0f1111]">
                            {formatPrice(order.totalUSD)}
                          </span>
                        </div>

                        <div>
                          <span className="block text-[11px] uppercase tracking-wider text-stone-500">
                            Ship To
                          </span>
                          <span className="font-medium text-[#007185] hover:underline cursor-pointer">
                            {order.customerName}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="block text-[11px] text-stone-500">
                          Order # {order.id}
                        </span>
                        <div className="space-x-3 text-[11px] text-[#007185]">
                          <span
                            onClick={() => {
                              setActiveTrackingOrder(order);
                              setIsTrackingOpen(true);
                            }}
                            className="hover:underline cursor-pointer"
                          >
                            View order details
                          </span>
                          <span>&bull;</span>
                          <span
                            onClick={() => showNotification(`Commercial Invoice & Customs Packing Slip downloaded for ${order.id}`, 'success')}
                            className="hover:underline cursor-pointer"
                          >
                            Invoice
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Order Status & Delivery Date Strip */}
                    <div className="p-4 sm:p-6 space-y-4">
                      <div className="flex items-center gap-2">
                        {isDelivered ? (
                          <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                            <CheckCircle2 className="w-5 h-5" />
                            <span>Delivered on {new Date(order.estimatedDelivery).toLocaleDateString()}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-[#007185] font-bold text-sm">
                            <Clock className="w-5 h-5 text-[#c45500]" />
                            <span>
                              Estimated Delivery: {new Date(order.estimatedDelivery).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                            </span>
                            <span className="text-[11px] font-normal text-stone-500">
                              via {order.carrier} (Tracking: {order.trackingNumber})
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Items in this Order */}
                      <div className="divide-y divide-stone-100">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-4">
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-16 h-20 object-cover rounded-xs border border-[#d5d9d9] shrink-0"
                                referrerPolicy="no-referrer"
                              />
                              <div>
                                <h3
                                  onClick={() => setSelectedProductId(item.productId)}
                                  className="font-bold text-[#007185] hover:underline cursor-pointer text-sm line-clamp-1"
                                >
                                  {item.title}
                                </h3>
                                <p className="text-stone-500 text-xs mt-0.5">
                                  Size: <span className="font-semibold text-stone-800">{item.size}</span> &bull; Color: <span className="font-semibold text-stone-800">{item.color}</span>
                                </p>
                                <p className="font-bold text-[#0f1111] mt-1">
                                  {formatPrice(item.priceUSD)} &times; {item.quantity}
                                </p>
                              </div>
                            </div>

                            {/* Amazon Action Buttons Right */}
                            <div className="flex flex-col gap-1.5 sm:w-44 shrink-0">
                              <button
                                onClick={() => {
                                  setActiveTrackingOrder(order);
                                  setIsTrackingOpen(true);
                                }}
                                className="w-full py-1.5 px-3 btn-amazon-primary font-bold text-xs"
                              >
                                Track package
                              </button>
                              <button
                                onClick={() => handleBuyAgain(order)}
                                className="w-full py-1.5 px-3 btn-amazon-white font-medium text-xs flex items-center justify-center gap-1"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Buy it again</span>
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedProductId(item.productId);
                                  setIsReviewModalOpen(true);
                                }}
                                className="w-full py-1.5 px-3 btn-amazon-white text-stone-700 text-xs hover:bg-stone-100"
                              >
                                Write a product review
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* SECTION 2: Garment Sizing & Bespoke Fit */}
        {customerSection === 'measurements' && (
          <div className="bg-white border border-[#d5d9d9] p-6 rounded-lg shadow-xs space-y-6">
            <div className="pb-4 border-b border-stone-200">
              <h2 className="text-xl font-bold text-[#0f1111]">Your Garment Sizing &amp; Fit Profile</h2>
              <p className="text-xs text-stone-500 mt-1">
                Save your body dimensions for 1-Click garment size recommendations across Italian wool coats, Japanese denim, and cashmere knits.
              </p>
            </div>

            <form onSubmit={handleSaveMeasurements} className="space-y-4 max-w-xl text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Chest Girth (cm)</label>
                  <input
                    type="number"
                    value={measurements.chestCm}
                    onChange={(e) => setMeasurements({ ...measurements, chestCm: Number(e.target.value) })}
                    className="w-full bg-white border border-[#d5d9d9] p-2 text-xs text-[#0f1111] rounded-md focus:ring-1 focus:ring-[#e77600]"
                  />
                  <span className="text-[11px] text-stone-400 mt-0.5 block">Standard: 88 - 110 cm</span>
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">Waist (cm)</label>
                  <input
                    type="number"
                    value={measurements.waistCm}
                    onChange={(e) => setMeasurements({ ...measurements, waistCm: Number(e.target.value) })}
                    className="w-full bg-white border border-[#d5d9d9] p-2 text-xs text-[#0f1111] rounded-md focus:ring-1 focus:ring-[#e77600]"
                  />
                  <span className="text-[11px] text-stone-400 mt-0.5 block">Standard: 68 - 94 cm</span>
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">Hips (cm)</label>
                  <input
                    type="number"
                    value={measurements.hipsCm}
                    onChange={(e) => setMeasurements({ ...measurements, hipsCm: Number(e.target.value) })}
                    className="w-full bg-white border border-[#d5d9d9] p-2 text-xs text-[#0f1111] rounded-md focus:ring-1 focus:ring-[#e77600]"
                  />
                  <span className="text-[11px] text-stone-400 mt-0.5 block">Standard: 88 - 108 cm</span>
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">Inseam (cm)</label>
                  <input
                    type="number"
                    value={measurements.inseamCm}
                    onChange={(e) => setMeasurements({ ...measurements, inseamCm: Number(e.target.value) })}
                    className="w-full bg-white border border-[#d5d9d9] p-2 text-xs text-[#0f1111] rounded-md focus:ring-1 focus:ring-[#e77600]"
                  />
                  <span className="text-[11px] text-stone-400 mt-0.5 block">Standard: 74 - 88 cm</span>
                </div>
              </div>

              <div className="p-3 bg-[#f0f2f2] border border-[#d5d9d9] rounded text-xs space-y-1">
                <span className="font-bold text-[#0f1111] block">Automatic Fit Recommendation:</span>
                <p className="text-stone-600">
                  Based on chest {measurements.chestCm}cm and waist {measurements.waistCm}cm, our Biella and Tokyo master patterns recommend <strong className="text-[#007185]">Size {activeCustomer.preferredSize}</strong> for outerwear and tailored knitwear.
                </p>
              </div>

              <button
                type="submit"
                className="py-2 px-6 btn-amazon-primary text-xs font-bold shadow-xs mt-2"
              >
                Save Sizing Profile
              </button>
            </form>
          </div>
        )}

        {/* SECTION 3: Addresses */}
        {customerSection === 'addresses' && (
          <div className="bg-white border border-[#d5d9d9] p-6 rounded-lg shadow-xs space-y-4">
            <h2 className="text-xl font-bold text-[#0f1111]">Your Saved Delivery Addresses</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="border-2 border-[#e77600] p-4 rounded-md space-y-1 relative bg-white">
                <span className="text-[10px] font-bold uppercase text-[#c45500] block mb-1">Default Address</span>
                <p className="font-bold text-[#0f1111]">{activeCustomer.name}</p>
                <p className="text-stone-600">14 Rue du Faubourg Saint-Honoré</p>
                <p className="text-stone-600">{activeCustomer.city}, {activeCustomer.country} 75008</p>
                <p className="text-stone-500 font-mono pt-1">Phone: {activeCustomer.phone}</p>
                <div className="pt-2 flex gap-3 text-[11px] text-[#007185]">
                  <span className="hover:underline cursor-pointer" onClick={() => showNotification('Address set as primary 1-Click destination.', 'info')}>Set as Primary</span>
                  <span>&bull;</span>
                  <span className="hover:underline cursor-pointer" onClick={() => showNotification('DHL courier instructions updated.', 'info')}>Add delivery notes</span>
                </div>
              </div>

              <div
                onClick={() => showNotification('International courier destination added.', 'info')}
                className="border border-dashed border-[#d5d9d9] p-6 rounded-md flex flex-col items-center justify-center text-center space-y-2 cursor-pointer hover:bg-stone-50"
              >
                <MapPin className="w-8 h-8 text-stone-400" />
                <span className="text-sm font-bold text-[#0f1111]">Add a new address</span>
                <p className="text-xs text-stone-500">Add international delivery destinations with DHL express courier.</p>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4: Your Payments & Digital Wallet */}
        {customerSection === 'payments' && (
          <div className="bg-white border border-[#d5d9d9] p-6 rounded-lg shadow-xs space-y-6 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#d5d9d9]">
              <div>
                <h2 className="text-xl font-bold text-[#0f1111]">Your Payments &amp; Digital Wallet</h2>
                <p className="text-xs text-stone-500">Manage stored credit cards, Apple Pay, PayPal, and 1-Click checkout preferences.</p>
              </div>

              <button
                onClick={() => setIsAddCardOpen(true)}
                className="px-4 py-1.5 btn-amazon-primary font-bold text-xs flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Payment Method</span>
              </button>
            </div>

            {/* List of cards */}
            <div className="space-y-3">
              {paymentCards.map((card) => (
                <div
                  key={card.id}
                  className="p-4 border border-[#d5d9d9] rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white hover:border-stone-400"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-[#f0f2f2] rounded border border-[#d5d9d9]">
                      <CreditCard className="w-6 h-6 text-[#007185]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#0f1111]">{card.type} ending in {card.last4}</span>
                        {card.isDefault && (
                          <span className="bg-[#febd69] text-[#131921] text-[10px] font-bold px-1.5 py-0.2 rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-stone-500 text-xs">Name on card: {card.holder} &bull; Expires: {card.expiry}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    {!card.isDefault && (
                      <button
                        onClick={() => {
                          setPaymentCards(paymentCards.map((c) => ({ ...c, isDefault: c.id === card.id })));
                          showNotification(`Set ${card.type} ending in ${card.last4} as default payment method.`, 'success');
                        }}
                        className="text-[#007185] hover:underline font-medium"
                      >
                        Set as Default
                      </button>
                    )}
                    <button
                      onClick={() => showNotification(`Removed card ending in ${card.last4}.`, 'info')}
                      className="text-stone-500 hover:text-rose-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal for adding a card */}
            {isAddCardOpen && (
              <form onSubmit={handleAddNewCard} className="p-4 bg-[#f0f2f2] border border-[#d5d9d9] rounded-md space-y-3 max-w-md">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-[#0f1111] text-sm">Add a new credit or debit card</h3>
                  <button type="button" onClick={() => setIsAddCardOpen(false)} className="text-stone-500">Cancel</button>
                </div>
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Card number</label>
                  <input
                    type="text"
                    required
                    placeholder="4532 •••• •••• 9204"
                    value={newCardNumber}
                    onChange={(e) => setNewCardNumber(e.target.value)}
                    className="w-full bg-white border border-[#d5d9d9] p-2 rounded"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-700 font-bold mb-1">Expiration</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={newCardExpiry}
                      onChange={(e) => setNewCardExpiry(e.target.value)}
                      className="w-full bg-white border border-[#d5d9d9] p-2 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 font-bold mb-1">Security Code (CVV)</label>
                    <input
                      type="password"
                      placeholder="•••"
                      maxLength={4}
                      className="w-full bg-white border border-[#d5d9d9] p-2 rounded"
                    />
                  </div>
                </div>
                <button type="submit" className="py-2 px-6 btn-amazon-primary font-bold text-xs">
                  Save card
                </button>
              </form>
            )}

            <div className="p-3 bg-stone-50 border border-stone-200 rounded text-stone-600 flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#007185] shrink-0" />
              <span>All payment methods are encrypted with PCI-DSS Level 1 &amp; 256-bit AES encryption with escrow security.</span>
            </div>
          </div>
        )}

        {/* SECTION 5: MUNSI Prime Luxury Membership */}
        {customerSection === 'prime' && (
          <div className="bg-white border border-[#d5d9d9] p-6 rounded-lg shadow-xs space-y-6 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#d5d9d9]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#232f3e] text-[#febd69] rounded-lg flex items-center justify-center font-black text-xl italic shadow-xs">
                  prime
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#0f1111]">MUNSI Prime Luxury Membership</h2>
                  <p className="text-xs text-stone-500">Your luxury garment tier: <strong className="text-emerald-700">Active Prime VIP Member</strong></p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-stone-500 block">Next Renewal Date</span>
                <span className="font-bold text-[#0f1111]">January 15, 2027 (Complimentary)</span>
              </div>
            </div>

            {/* Benefits cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-[#f0f2f2] border border-[#d5d9d9] rounded-md space-y-2">
                <Truck className="w-6 h-6 text-[#007185]" />
                <h3 className="font-bold text-sm text-[#0f1111]">Free Worldwide Air Priority</h3>
                <p className="text-stone-600">Complimentary DHL Express Worldwide delivery on all orders over $250 with customs pre-cleared (DDP).</p>
              </div>

              <div className="p-4 bg-[#f0f2f2] border border-[#d5d9d9] rounded-md space-y-2">
                <RotateCcw className="w-6 h-6 text-[#007185]" />
                <h3 className="font-bold text-sm text-[#0f1111]">30-Day Bespoke Returns</h3>
                <p className="text-stone-600">Free courier pickup from your home or office for tailoring alterations or returns with zero hassle.</p>
              </div>

              <div className="p-4 bg-[#f0f2f2] border border-[#d5d9d9] rounded-md space-y-2">
                <Sparkles className="w-6 h-6 text-[#007185]" />
                <h3 className="font-bold text-sm text-[#0f1111]">Runway &amp; Trunk Shows</h3>
                <p className="text-stone-600">Exclusive 48-hour early access to limited artisanal drops in Biella wool, Mongolian cashmere, and raw selvedge denim.</p>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => setCustomerSection('concierge')}
                className="py-2 px-5 btn-amazon-primary font-bold text-xs"
              >
                Contact Prime Concierge
              </button>
              <button
                onClick={() => showNotification('Prime membership preferences saved.', 'info')}
                className="py-2 px-5 btn-amazon-white font-medium text-xs"
              >
                Manage Membership Settings
              </button>
            </div>
          </div>
        )}

        {/* SECTION 6: Customer Service Concierge */}
        {customerSection === 'concierge' && (
          <div className="bg-white border border-[#d5d9d9] p-6 rounded-lg shadow-xs space-y-6 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#d5d9d9]">
              <div>
                <h2 className="text-xl font-bold text-[#0f1111]">MUNSI WORLD Prime Tailor Concierge</h2>
                <p className="text-xs text-stone-500">
                  Instant live chat with master tailors in Milan and Tokyo. Direct access to tailoring alterations and order support.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-emerald-800">Master Tailor Online</span>
              </div>
            </div>

            {/* Live Concierge Chat Box */}
            <div className="border border-[#d5d9d9] rounded-md overflow-hidden bg-stone-50 flex flex-col h-80">
              <div className="p-3 bg-[#232f3e] text-white font-bold flex items-center justify-between">
                <span>MUNSI WORLD Atelier Live Support</span>
                <span className="text-[11px] text-stone-300 font-normal">Average response time: &lt; 1 min</span>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {conciergeMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-md p-3 rounded-lg text-xs ${
                        msg.sender === 'user'
                          ? 'bg-[#232f3e] text-white rounded-br-none'
                          : 'bg-white border border-[#d5d9d9] text-[#0f1111] rounded-bl-none shadow-xs'
                      }`}
                    >
                      <p>{msg.text}</p>
                    </div>
                    <span className="text-[10px] text-stone-400 mt-0.5">{msg.time}</span>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="p-2.5 bg-white border-t border-[#d5d9d9] flex gap-2">
                <input
                  type="text"
                  placeholder="Ask about fabric specifications, measurements, or order tracking..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 bg-[#f0f2f2] border border-[#d5d9d9] px-3 py-1.5 text-xs text-[#0f1111] rounded focus:bg-white focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 btn-amazon-primary font-bold text-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>

            {/* Direct atelier contacts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-[#f0f2f2] rounded border border-[#d5d9d9] space-y-1">
                <span className="font-bold text-[#0f1111] block">Milan Atelier Direct Line:</span>
                <p className="text-stone-700 font-mono">+39 02 8734 9110</p>
                <p className="text-stone-500 text-[11px]">Hours: Mon &ndash; Fri 9 AM &ndash; 7 PM CET</p>
              </div>

              <div className="p-4 bg-[#f0f2f2] rounded border border-[#d5d9d9] space-y-1">
                <span className="font-bold text-[#0f1111] block">Email Concierge &amp; Customs Resolution:</span>
                <p className="text-stone-700 font-mono">concierge@munsiworld.com</p>
                <p className="text-stone-500 text-[11px]">Priority handling for VIP clients</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
