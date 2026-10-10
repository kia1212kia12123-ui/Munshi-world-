import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Package,
  Layers,
  BarChart3,
  Settings,
  Truck,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Download,
  Users,
  ShieldCheck,
  ExternalLink,
  DollarSign,
  TrendingUp,
  Globe,
  Bell,
  HelpCircle,
} from 'lucide-react';
import { Customer, CustomerTier, Order } from '../types';
import { InventoryDashboard } from './InventoryDashboard';
import { AnalyticsDashboard } from './AnalyticsDashboard';

export const AdminDashboard: React.FC = () => {
  const {
    adminTab,
    setAdminTab,
    orders,
    customers,
    updateOrderStatus,
    updateCustomerTier,
    addCustomerNote,
    formatPrice,
    setIsTrackingOpen,
    setActiveTrackingOrder,
    setActiveCustomerId,
    setActiveView,
    showNotification,
  } = useStore();

  const [customerSearch, setCustomerSearch] = useState('');
  const [tierFilter, setTierFilter] = useState<'all' | CustomerTier>('all');
  const [selectedCustomerDossier, setSelectedCustomerDossier] = useState<Customer | null>(customers[0]);
  const [newNoteText, setNewNoteText] = useState('');
  const [orderFilter, setOrderFilter] = useState<string>('all');

  const filteredCustomers = customers.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.city.toLowerCase().includes(customerSearch.toLowerCase());
    if (!matchSearch) return false;
    if (tierFilter !== 'all' && c.tier !== tierFilter) return false;
    return true;
  });

  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'all') return true;
    return o.shippingStatus === orderFilter;
  });

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerDossier || !newNoteText.trim()) return;
    addCustomerNote(selectedCustomerDossier.id, newNoteText.trim());
    setNewNoteText('');
  };

  return (
    <div className="min-h-screen bg-[#eaeded] text-[#0f1111]">
      {/* Amazon Seller Central Top Header: #131921 */}
      <div className="bg-[#131921] text-white px-4 py-2.5 flex items-center justify-between text-xs border-b border-stone-800">
        <div className="flex items-center gap-4">
          {/* Seller Central Logo */}
          <div className="flex items-center gap-2">
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
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-black tracking-tight text-white">MUNSI WORLD</span>
              <span className="text-xs text-[#febd69] font-semibold">seller central</span>
            </div>
          </div>

          <span className="text-stone-600 hidden sm:inline">|</span>

          {/* Marketplace Selector */}
          <div className="hidden sm:flex items-center gap-1.5 text-stone-300">
            <Globe className="w-3.5 h-3.5 text-stone-400" />
            <span className="font-semibold text-white">MUNSI WORLD Global Merchant</span>
            <span className="text-[10px] bg-[#232f3e] px-1.5 py-0.5 rounded text-stone-300">US &bull; EU &bull; JP</span>
          </div>
        </div>

        {/* Seller Performance Health Strip */}
        <div className="flex items-center gap-4 text-xs">
          <div className="hidden md:flex items-center gap-2">
            <span className="text-stone-400">Account Health:</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Healthy (100%)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveView('store')}
              className="px-2.5 py-1 text-[11px] font-semibold text-stone-900 bg-[#febd69] hover:bg-[#f3a847] rounded-sm transition-colors"
            >
              Storefront
            </button>
            <button
              onClick={() => setActiveView('customers')}
              className="px-2.5 py-1 text-[11px] font-medium text-white bg-[#232f3e] hover:bg-stone-700 border border-stone-600 rounded-sm transition-colors"
            >
              Customer Portal
            </button>
          </div>
        </div>
      </div>

      {/* Seller Central Navigation Tabs Bar: #232f3e */}
      <div className="bg-[#232f3e] text-stone-200 px-4 py-1.5 text-xs flex items-center justify-between overflow-x-auto whitespace-nowrap">
        <div className="flex items-center gap-5">
          <button
            onClick={() => setAdminTab('orders')}
            className={`py-1 hover:text-white transition-colors ${
              adminTab === 'orders' ? 'text-white font-bold border-b-2 border-[#febd69]' : ''
            }`}
          >
            Orders ({orders.length})
          </button>

          <button
            onClick={() => setAdminTab('customers')}
            className={`py-1 hover:text-white transition-colors ${
              adminTab === 'customers' ? 'text-white font-bold border-b-2 border-[#febd69]' : ''
            }`}
          >
            Customer CRM &amp; Dossiers ({customers.length})
          </button>

          <button
            onClick={() => setAdminTab('inventory')}
            className={`py-1 hover:text-white transition-colors ${
              adminTab === 'inventory' ? 'text-white font-bold border-b-2 border-[#febd69]' : ''
            }`}
          >
            Manage Inventory
          </button>

          <button
            onClick={() => setAdminTab('analytics')}
            className={`py-1 hover:text-white transition-colors ${
              adminTab === 'analytics' ? 'text-white font-bold border-b-2 border-[#febd69]' : ''
            }`}
          >
            Business Reports &amp; Analytics
          </button>

          <button
            onClick={() => setAdminTab('settings')}
            className={`py-1 hover:text-white transition-colors ${
              adminTab === 'settings' ? 'text-white font-bold border-b-2 border-[#febd69]' : ''
            }`}
          >
            Fulfillment Settings
          </button>
        </div>

        <div className="text-[11px] text-stone-400 hidden lg:block font-mono">
          Merchant Token: MUNSI-WORLD-GLOBAL-9204
        </div>
      </div>

      {/* Seller Central Main Body */}
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Quick Performance Widget Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-[#d5d9d9] p-4 rounded-md shadow-xs">
            <span className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Today's Sales</span>
            <p className="text-xl font-bold text-[#0f1111] mt-1 font-mono">
              {formatPrice(3480)}
            </p>
            <span className="text-[11px] text-emerald-700 font-medium">4 orders placed today</span>
          </div>

          <div className="bg-white border border-[#d5d9d9] p-4 rounded-md shadow-xs">
            <span className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Open Orders</span>
            <p className="text-xl font-bold text-[#0f1111] mt-1 font-mono">
              {orders.filter((o) => o.shippingStatus !== 'delivered').length} Orders
            </p>
            <span className="text-[11px] text-[#007185] font-medium">Awaiting delivery verification</span>
          </div>

          <div className="bg-white border border-[#d5d9d9] p-4 rounded-md shadow-xs">
            <span className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Buy Box Win Rate</span>
            <p className="text-xl font-bold text-[#0f1111] mt-1 font-mono">
              100%
            </p>
            <span className="text-[11px] text-emerald-700 font-medium">Sole brand manufacturer</span>
          </div>

          <div className="bg-white border border-[#d5d9d9] p-4 rounded-md shadow-xs">
            <span className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Customer Reviews</span>
            <p className="text-xl font-bold text-[#0f1111] mt-1 font-mono">
              4.9 ★ Rating
            </p>
            <span className="text-[11px] text-stone-500">100% Verified purchases</span>
          </div>
        </div>

        {/* TAB 1: Manage Orders (Amazon Seller Central Style) */}
        {adminTab === 'orders' && (
          <div className="bg-white border border-[#d5d9d9] rounded-md shadow-xs overflow-hidden">
            <div className="p-4 border-b border-[#d5d9d9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-[#0f1111]">Manage Orders</h2>
                <p className="text-xs text-stone-500">
                  Fulfill garment packages, update DHL/FedEx tracking milestones, and print shipping invoices.
                </p>
              </div>

              {/* Status Filter buttons */}
              <div className="flex items-center gap-1.5 text-xs">
                {['all', 'in_transit', 'customs_cleared', 'delivered'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderFilter(st)}
                    className={`px-3 py-1 rounded-sm border capitalize text-xs ${
                      orderFilter === st
                        ? 'bg-[#f0f2f2] border-[#007185] text-[#007185] font-bold'
                        : 'border-[#d5d9d9] text-[#0f1111] hover:bg-stone-50'
                    }`}
                  >
                    {st.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#f0f2f2] text-stone-700 border-b border-[#d5d9d9] uppercase text-[11px]">
                    <th className="py-2.5 px-4 font-bold">Order Date / ID</th>
                    <th className="py-2.5 px-4 font-bold">Customer Contact</th>
                    <th className="py-2.5 px-4 font-bold">Ship-to Address</th>
                    <th className="py-2.5 px-4 font-bold">Carrier &amp; Tracking</th>
                    <th className="py-2.5 px-4 font-bold text-right">Order Total</th>
                    <th className="py-2.5 px-4 font-bold text-center">Fulfillment Status</th>
                    <th className="py-2.5 px-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d5d9d9]">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-stone-50 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-bold text-[#007185] hover:underline cursor-pointer">
                          {order.id}
                        </span>
                        <p className="text-stone-500 text-[11px] mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </td>

                      <td className="py-3 px-4">
                        <p className="font-medium text-[#0f1111]">{order.customerName}</p>
                        <p className="text-stone-400 text-[11px]">{order.customerEmail}</p>
                      </td>

                      <td className="py-3 px-4 text-stone-600">
                        {order.shippingAddress.city}, {order.shippingAddress.country}
                      </td>

                      <td className="py-3 px-4">
                        <p className="font-bold font-mono text-[#0f1111]">{order.carrier}</p>
                        <p className="font-mono text-stone-500 text-[11px]">{order.trackingNumber}</p>
                      </td>

                      <td className="py-3 px-4 text-right font-bold text-[#0f1111] font-mono tabular-nums">
                        {formatPrice(order.totalUSD)}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <select
                          value={order.shippingStatus}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                          className="bg-[#f0f2f2] border border-[#d5d9d9] px-2 py-1 text-[11px] font-bold text-stone-800 rounded-sm focus:outline-none"
                        >
                          <option value="label_created">Label Created</option>
                          <option value="picked">Picked</option>
                          <option value="in_transit">In Transit (Air)</option>
                          <option value="customs_cleared">Customs Cleared</option>
                          <option value="out_for_delivery">Out for Delivery</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </td>

                      <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => {
                            setActiveTrackingOrder(order);
                            setIsTrackingOpen(true);
                          }}
                          className="px-2.5 py-1 btn-amazon-primary text-[11px] font-semibold"
                        >
                          Track
                        </button>
                        <button
                          onClick={() => showNotification(`Commercial packing slip and shipping label generated for order #${order.id}`, 'success')}
                          className="px-2.5 py-1 btn-amazon-white text-[11px] font-medium"
                        >
                          Print slip
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: Customer CRM & Dossiers (Amazon Buyer CRM) */}
        {adminTab === 'customers' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Customer Directory */}
            <div className="lg:col-span-6 bg-white border border-[#d5d9d9] p-5 rounded-md shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
                <div>
                  <h3 className="text-base font-bold text-[#0f1111]">
                    MUNSI WORLD Client Directory &amp; Dossiers
                  </h3>
                  <p className="text-xs text-stone-500">
                    High-value clients, VIP status, and custom tailoring notes.
                  </p>
                </div>

                <select
                  value={tierFilter}
                  onChange={(e) => setTierFilter(e.target.value as any)}
                  className="bg-[#f0f2f2] border border-[#d5d9d9] px-2 py-1 text-xs text-[#0f1111] rounded-md focus:outline-none"
                >
                  <option value="all">All VIP Tiers</option>
                  <option value="private_client">Prime VIP Clients</option>
                  <option value="vip_gold">Gold Tier</option>
                  <option value="regular">Standard</option>
                </select>
              </div>

              {/* Search input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search client by name, email, or city..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="w-full bg-[#f0f2f2] border border-[#d5d9d9] pl-8 pr-3 py-1.5 text-xs text-[#0f1111] rounded-md focus:bg-white focus:outline-none"
                />
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
              </div>

              {/* Customer rows */}
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {filteredCustomers.map((cust) => {
                  const isSelected = selectedCustomerDossier?.id === cust.id;

                  return (
                    <div
                      key={cust.id}
                      onClick={() => setSelectedCustomerDossier(cust)}
                      className={`p-3 border rounded-md cursor-pointer transition-colors flex items-center justify-between ${
                        isSelected
                          ? 'border-[#007185] bg-[#f0f2f2]'
                          : 'border-[#d5d9d9] bg-white hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#232f3e] text-white rounded-full flex items-center justify-center font-bold text-xs">
                          {cust.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div className="text-xs">
                          <p className="font-bold text-[#0f1111]">{cust.name}</p>
                          <p className="text-stone-500 text-[11px]">{cust.email} &bull; {cust.city}</p>
                        </div>
                      </div>

                      <div className="text-right text-xs">
                        <span className="font-bold text-[#0f1111] font-mono block">
                          {formatPrice(cust.totalSpendUSD)}
                        </span>
                        <span className="text-[10px] text-stone-400">{cust.ordersCount} orders</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Customer Dossier Card */}
            <div className="lg:col-span-6 bg-white border border-[#d5d9d9] p-5 rounded-md shadow-xs space-y-4 text-xs">
              {selectedCustomerDossier ? (
                <>
                  <div className="flex items-start justify-between pb-3 border-b border-stone-200">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-[#c45500]">
                        Buyer Dossier &bull; ID {selectedCustomerDossier.id}
                      </span>
                      <h3 className="text-lg font-bold text-[#0f1111] mt-0.5">
                        {selectedCustomerDossier.name}
                      </h3>
                      <p className="text-stone-500 text-xs">
                        {selectedCustomerDossier.email} &bull; {selectedCustomerDossier.phone}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setActiveCustomerId(selectedCustomerDossier.id);
                        setActiveView('customers');
                      }}
                      className="px-3 py-1.5 btn-amazon-white font-medium text-xs flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>View in Account</span>
                    </button>
                  </div>

                  {/* VIP Tier Selector */}
                  <div>
                    <label className="block text-stone-700 font-bold mb-1">VIP Membership Tier:</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'private_client' as CustomerTier, label: 'Prime VIP' },
                        { id: 'vip_gold' as CustomerTier, label: 'Prime Gold' },
                        { id: 'regular' as CustomerTier, label: 'Standard' },
                      ].map((tier) => (
                        <button
                          key={tier.id}
                          onClick={() => updateCustomerTier(selectedCustomerDossier.id, tier.id)}
                          className={`py-1.5 px-2 border rounded text-center text-xs font-medium ${
                            selectedCustomerDossier.tier === tier.id
                              ? 'bg-[#232f3e] text-white border-[#232f3e]'
                              : 'bg-[#f0f2f2] text-stone-800 border-[#d5d9d9] hover:bg-stone-200'
                          }`}
                        >
                          {tier.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sizing Profile */}
                  <div className="p-3 bg-[#f0f2f2] rounded border border-[#d5d9d9] space-y-1">
                    <span className="font-bold text-[#0f1111] block">Bespoke Fit Measurements:</span>
                    <div className="grid grid-cols-4 gap-2 font-mono text-stone-700 text-xs pt-1">
                      <div>Chest: {selectedCustomerDossier.measurements.chestCm}cm</div>
                      <div>Waist: {selectedCustomerDossier.measurements.waistCm}cm</div>
                      <div>Hips: {selectedCustomerDossier.measurements.hipsCm}cm</div>
                      <div>Inseam: {selectedCustomerDossier.measurements.inseamCm}cm</div>
                    </div>
                  </div>

                  {/* Private CRM Notes */}
                  <div className="space-y-2">
                    <span className="font-bold text-[#0f1111] block">
                      Internal Merchant Notes ({selectedCustomerDossier.notes.length})
                    </span>

                    <div className="space-y-2 max-h-36 overflow-y-auto">
                      {selectedCustomerDossier.notes.map((note, idx) => (
                        <div key={idx} className="p-2.5 bg-stone-50 border border-stone-200 text-stone-700 rounded text-xs">
                          {note}
                        </div>
                      ))}
                    </div>

                    <form onSubmit={handleAddNote} className="flex gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="Add private note (e.g. priority runway garment reservation)..."
                        value={newNoteText}
                        onChange={(e) => setNewNoteText(e.target.value)}
                        className="flex-1 bg-white border border-[#d5d9d9] px-3 py-1.5 text-xs text-[#0f1111] rounded-md focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="px-4 py-1.5 btn-amazon-primary font-bold text-xs"
                      >
                        Add Note
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="py-12 text-center text-stone-400">
                  Select a buyer from the directory to review their account dossier.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: Inventory Matrix Embed */}
        {adminTab === 'inventory' && <InventoryDashboard />}

        {/* TAB 4: Seasonal Analytics Embed */}
        {adminTab === 'analytics' && <AnalyticsDashboard />}

        {/* TAB 5: Global Logistics Settings */}
        {adminTab === 'settings' && (
          <div className="bg-white border border-[#d5d9d9] p-6 rounded-md shadow-xs space-y-6 max-w-4xl text-xs">
            <h2 className="text-lg font-bold text-[#0f1111]">Fulfillment &amp; Global Shipping Settings</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">
                    Free International Prime Delivery Threshold
                  </label>
                  <input
                    type="number"
                    defaultValue={500}
                    className="w-full bg-[#f0f2f2] border border-[#d5d9d9] p-2 font-mono rounded"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">
                    Default Air Priority Carrier
                  </label>
                  <select className="w-full bg-[#f0f2f2] border border-[#d5d9d9] p-2 rounded">
                    <option>DHL Express Air Priority</option>
                    <option>FedEx International Priority</option>
                    <option>UPS Worldwide Saver</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">
                    Return Window Days
                  </label>
                  <input
                    type="number"
                    defaultValue={14}
                    className="w-full bg-[#f0f2f2] border border-[#d5d9d9] p-2 font-mono rounded"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">
                    Customs Duty Model
                  </label>
                  <input
                    type="text"
                    readOnly
                    value="DDP (Delivered Duty Paid) Pre-Cleared"
                    className="w-full bg-stone-100 border border-stone-200 p-2 font-mono text-stone-600 rounded"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => showNotification('Fulfillment and shipping rules saved to MUNSI WORLD merchant backend.', 'success')}
              className="py-2 px-6 btn-amazon-primary font-bold text-xs"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
