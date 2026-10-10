import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  RefreshCw,
  Download,
  Package,
} from 'lucide-react';
import { Order } from '../types';

export const ShippingTrackerModal: React.FC = () => {
  const {
    isTrackingOpen,
    setIsTrackingOpen,
    orders,
    activeTrackingOrder,
    setActiveTrackingOrder,
    lookupTracking,
    formatPrice,
  } = useStore();

  const [inputCode, setInputCode] = useState<string>('');
  const [searchError, setSearchError] = useState<string | null>(null);

  if (!isTrackingOpen) return null;

  const currentOrder: Order = activeTrackingOrder || orders[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError(null);
    const found = lookupTracking(inputCode);
    if (!found) {
      setSearchError('No shipment found for this tracking ID. Try DHL-849204 or FDX-993812.');
    }
  };

  const handleAdvanceMilestone = () => {
    if (!currentOrder) return;
    const milestones = [...currentOrder.milestones];
    const currentIndex = milestones.findIndex((m) => m.current);

    if (currentIndex >= 0 && currentIndex < milestones.length - 1) {
      milestones[currentIndex].completed = true;
      milestones[currentIndex].current = false;
      milestones[currentIndex + 1].completed = true;
      milestones[currentIndex + 1].current = true;
      milestones[currentIndex + 1].timestamp = 'Updated just now';

      const updatedOrder: Order = {
        ...currentOrder,
        milestones,
        shippingStatus:
          currentIndex + 1 === milestones.length - 1 ? 'delivered' : 'out_for_delivery',
      };
      setActiveTrackingOrder(updatedOrder);
    }
  };

  const isDelivered = currentOrder.shippingStatus === 'delivered';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-3xl bg-white border border-[#d5d9d9] shadow-2xl rounded-lg overflow-hidden my-auto max-h-[92vh] flex flex-col text-xs text-[#0f1111]">
        {/* Amazon Tracking Top Bar */}
        <div className="bg-[#f0f2f2] px-6 py-3 border-b border-[#d5d9d9] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-xs overflow-hidden bg-stone-900 border border-[#febd69]/50 shrink-0">
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
                <span className="text-base font-black tracking-tight text-[#0f1111]">MUNSI WORLD</span>
                <span className="text-xs text-[#c45500] font-bold ml-1">tracking</span>
              </div>
            </div>
            <span className="text-stone-300">|</span>
            <span className="text-stone-600 font-medium">Order #{currentOrder.id}</span>
          </div>

          <button
            onClick={() => setIsTrackingOpen(false)}
            aria-label="Close"
            className="p-1 text-stone-500 hover:text-stone-900 rounded hover:bg-stone-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Carrier Bar */}
        <div className="p-4 bg-[#f0f2f2] border-b border-[#d5d9d9] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search tracking code (e.g. DHL-849204)..."
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              className="bg-white border border-[#d5d9d9] px-3 py-1.5 text-xs text-[#0f1111] rounded flex-1 focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-1.5 btn-amazon-primary text-xs font-bold shrink-0"
            >
              Track
            </button>
          </form>

          <button
            onClick={handleAdvanceMilestone}
            className="px-3 py-1.5 btn-amazon-white text-xs font-medium flex items-center gap-1.5 self-end sm:self-auto shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5 text-stone-600" />
            <span>Simulate next hub scan</span>
          </button>
        </div>

        {searchError && (
          <div className="px-4 py-2 bg-rose-50 border-b border-rose-200 text-rose-700 text-xs">
            {searchError}
          </div>
        )}

        {/* Main Tracking Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Main Delivery Headline */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              {isDelivered ? 'Delivered' : 'On the way'}
            </span>
            <h2 className="text-2xl font-bold text-[#0f1111] mt-0.5">
              {isDelivered ? 'Delivered to your address' : `Arriving ${currentOrder.estimatedDelivery}`}
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Carrier: <strong className="text-stone-800">{currentOrder.carrier}</strong> &bull; Tracking ID:{' '}
              <strong className="text-[#007185] font-mono">{currentOrder.trackingNumber}</strong>
            </p>
          </div>

          {/* Amazon 4-Stage Horizontal Progress Bar */}
          <div className="py-4">
            <div className="relative flex items-center justify-between">
              {/* Progress Line */}
              <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1.5 bg-stone-200 -z-0">
                <div
                  className="h-full bg-emerald-600 transition-all duration-500"
                  style={{
                    width: isDelivered
                      ? '100%'
                      : currentOrder.shippingStatus === 'out_for_delivery'
                      ? '75%'
                      : currentOrder.shippingStatus === 'customs_cleared'
                      ? '50%'
                      : '25%',
                  }}
                />
              </div>

              {/* 4 Nodes */}
              {[
                { label: 'Ordered', done: true },
                { label: 'Shipped (Air)', done: currentOrder.shippingStatus !== 'label_created' },
                { label: 'Out for delivery', done: currentOrder.shippingStatus === 'out_for_delivery' || isDelivered },
                { label: 'Delivered', done: isDelivered },
              ].map((step, idx) => (
                <div key={idx} className="relative z-10 flex flex-col items-center bg-white px-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                      step.done
                        ? 'bg-emerald-600 text-white'
                        : 'bg-stone-200 text-stone-500'
                    }`}
                  >
                    {step.done ? '✓' : idx + 1}
                  </div>
                  <span className={`text-[11px] mt-1.5 font-medium ${step.done ? 'text-[#0f1111]' : 'text-stone-400'}`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Milestone Details */}
          <div className="bg-[#f0f2f2] p-4 rounded-md border border-[#d5d9d9] space-y-3">
            <h4 className="font-bold text-xs text-[#0f1111]">Tracking History</h4>
            <div className="space-y-3">
              {currentOrder.milestones.map((milestone) => (
                <div key={milestone.id} className="flex items-start gap-3 text-xs">
                  <div className="mt-0.5">
                    {milestone.completed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="font-bold text-[#0f1111]">{milestone.title}</span>
                      <span className="text-[11px] text-stone-500 font-mono">{milestone.timestamp}</span>
                    </div>
                    <span className="text-[11px] text-stone-500 block">{milestone.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Package Items Manifest */}
          <div>
            <h4 className="font-bold text-xs text-[#0f1111] mb-2">Package Contents:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentOrder.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-2.5 bg-white border border-[#d5d9d9] rounded">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-12 h-14 object-cover border border-stone-200 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="text-xs">
                    <p className="font-bold text-[#0f1111] line-clamp-1">{item.title}</p>
                    <p className="text-stone-500 text-[11px]">
                      Size: {item.size} &bull; Qty: {item.quantity}
                    </p>
                    <p className="font-bold text-[#0f1111] font-mono mt-0.5">{formatPrice(item.priceUSD)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
