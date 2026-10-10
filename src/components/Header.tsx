import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Search,
  ShoppingCart,
  MapPin,
  Menu,
  ChevronDown,
  Smartphone,
  Globe,
  ShieldCheck,
  Package,
  X,
  Sparkles,
  Tag,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { CurrencyCode, LanguageCode } from '../types';

export const Header: React.FC = () => {
  const {
    currency,
    setCurrency,
    language,
    setLanguage,
    cart,
    setIsCartOpen,
    activeView,
    setActiveView,
    activeCustomer,
    setIsMobileSimulatorOpen,
    isMobileSimulatorOpen,
    setAdminTab,
    customerSection,
    setCustomerSection,
    searchQuery,
    setSearchQuery,
    searchCategory,
    setSearchCategory,
    setIsTrackingOpen,
    showNotification,
  } = useStore();

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [isAllMenuOpen, setIsAllMenuOpen] = useState(false);

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    setActiveView('store');
    const el = document.getElementById('garments-collection');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    showNotification(`Searching garments for: "${localSearch || searchCategory}"`, 'info');
  };

  const handleGoToOrders = () => {
    setActiveView('customers');
    setCustomerSection('orders');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToAccountHub = () => {
    setActiveView('customers');
    setCustomerSection('hub');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToAdmin = () => {
    setActiveView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full text-white select-none">
        {/* Top Main Nav Bar: Amazon Dark Navy #131921 */}
        <div className="bg-[#131921] px-3 sm:px-4 py-2 flex items-center justify-between gap-2 sm:gap-3 text-xs">
          {/* MUNSI WORLD Logo with Amazon Smile styling */}
          <button
            onClick={() => {
              setActiveView('store');
              setSearchQuery('');
              setLocalSearch('');
              setSearchCategory('All');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 p-1.5 hover:outline hover:outline-1 hover:outline-white shrink-0 text-left rounded-xs transition-all"
            title="MUNSI WORLD Homepage"
          >
            {/* App Logo Image */}
            <div className="relative w-8 h-8 rounded-sm overflow-hidden bg-black/40 border border-[#febd69]/50 shrink-0">
              <img
                src="/src/assets/images/munsi_world_logo_1791647206349.jpg"
                alt="MUNSI WORLD Logo"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>

            {/* Brand Wordmark with Amazon smile accent */}
            <div className="flex flex-col">
              <div className="flex items-baseline">
                <span className="text-lg sm:text-xl font-black tracking-tight text-white leading-none">
                  MUNSI<span className="text-[#febd69] font-black ml-0.5">WORLD</span>
                </span>
                <span className="text-[10px] text-stone-300 font-semibold tracking-wider ml-1 hidden sm:inline">
                  .garments
                </span>
              </div>
              {/* Curved smile bar in Amazon amber */}
              <div className="w-16 h-1 bg-gradient-to-r from-[#febd69] to-[#f08804] rounded-full mt-0.5" />
            </div>
          </button>

          {/* Deliver To Location Widget */}
          <button
            onClick={() => {
              setActiveView('customers');
              setCustomerSection('addresses');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="hidden md:flex items-center gap-1.5 p-1.5 hover:outline hover:outline-1 hover:outline-white text-left shrink-0 rounded-xs"
          >
            <MapPin className="w-4 h-4 text-stone-300 mt-0.5 shrink-0" />
            <div className="leading-tight">
              <span className="text-[11px] text-stone-400 block truncate max-w-[110px]">
                Deliver to {activeCustomer.name.split(' ')[0]}
              </span>
              <span className="text-xs font-bold text-white block truncate max-w-[110px]">
                {activeCustomer.city} {activeCustomer.country === 'France' ? '75008' : '10001'}
              </span>
            </div>
          </button>

          {/* Central Amazon Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-3xl flex h-10 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-[#f3a847] bg-white"
          >
            {/* Department dropdown */}
            <select
              value={searchCategory}
              onChange={(e) => {
                setSearchCategory(e.target.value);
                setActiveView('store');
                const el = document.getElementById('garments-collection');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-[#e6e6e6] hover:bg-[#d4d4d4] text-[#0f1111] px-2.5 text-xs font-normal border-r border-stone-300 focus:outline-none cursor-pointer shrink-0 hidden sm:block"
            >
              <option value="All">All Garments</option>
              <option value="outerwear">Outerwear &amp; Coats</option>
              <option value="knitwear">Cashmere Knitwear</option>
              <option value="trousers">Tailored Trousers</option>
              <option value="overshirts">Selvedge Denim</option>
              <option value="essentials">Luxury Essentials</option>
            </select>

            {/* Search input field */}
            <input
              type="text"
              placeholder="Search MUNSI WORLD, double-breasted overcoats, cashmere knits..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="flex-1 bg-white text-[#0f1111] px-3 py-2 text-sm focus:outline-none placeholder-stone-500 min-w-0"
            />

            {/* Clear search if entered */}
            {localSearch && (
              <button
                type="button"
                onClick={() => {
                  setLocalSearch('');
                  setSearchQuery('');
                }}
                className="px-2 text-stone-400 hover:text-stone-700 bg-white"
                title="Clear Search"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Amazon Orange Search Submit Button */}
            <button
              type="submit"
              className="bg-[#febd69] hover:bg-[#f3a847] text-[#131921] px-4 flex items-center justify-center transition-colors shrink-0"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-stone-900" />
            </button>
          </form>

          {/* Right Action Island */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Language & Currency selector */}
            <div className="relative flex items-center p-1.5 hover:outline hover:outline-1 hover:outline-white cursor-pointer rounded-xs">
              <Globe className="w-3.5 h-3.5 text-stone-300 mr-1 hidden sm:inline" />
              <select
                value={language}
                aria-label="Select Language"
                onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                className="bg-transparent text-xs font-bold text-white uppercase cursor-pointer focus:outline-none"
              >
                <option value="en" className="text-stone-900">EN</option>
                <option value="fr" className="text-stone-900">FR</option>
                <option value="de" className="text-stone-900">DE</option>
                <option value="es" className="text-stone-900">ES</option>
                <option value="ja" className="text-stone-900">JA</option>
                <option value="it" className="text-stone-900">IT</option>
              </select>

              <span className="text-stone-500 mx-1">|</span>

              <select
                value={currency}
                aria-label="Select Currency"
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="bg-transparent text-xs font-bold text-white cursor-pointer focus:outline-none"
              >
                <option value="USD" className="text-stone-900">USD</option>
                <option value="EUR" className="text-stone-900">EUR</option>
                <option value="GBP" className="text-stone-900">GBP</option>
                <option value="JPY" className="text-stone-900">JPY</option>
                <option value="CAD" className="text-stone-900">CAD</option>
                <option value="AUD" className="text-stone-900">AUD</option>
                <option value="CHF" className="text-stone-900">CHF</option>
              </select>
            </div>

            {/* Account & Lists (Customer Portal) */}
            <button
              onClick={handleGoToAccountHub}
              className={`p-1.5 hover:outline hover:outline-1 hover:outline-white text-left leading-tight hidden lg:block rounded-xs ${
                activeView === 'customers' ? 'outline outline-1 outline-white bg-[#232f3e]' : ''
              }`}
            >
              <span className="text-[11px] text-stone-300 block">
                Hello, {activeCustomer.name.split(' ')[0]}
              </span>
              <span className="text-xs font-bold text-white flex items-center gap-0.5">
                Account &amp; Lists <ChevronDown className="w-3 h-3 text-stone-400" />
              </span>
            </button>

            {/* Returns & Orders */}
            <button
              onClick={handleGoToOrders}
              className="p-1.5 hover:outline hover:outline-1 hover:outline-white text-left leading-tight hidden sm:block rounded-xs"
            >
              <span className="text-[11px] text-stone-300 block">Returns</span>
              <span className="text-xs font-bold text-white block">&amp; Orders</span>
            </button>

            {/* Shopping Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="View Shopping Cart"
              className="flex items-center gap-1 p-1.5 hover:outline hover:outline-1 hover:outline-white rounded-xs"
            >
              <div className="relative">
                <ShoppingCart className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                <span className="absolute top-0 left-1/2 -translate-x-1/2 -mt-0.5 text-xs font-bold text-[#f08804] tabular-nums">
                  {totalCartCount}
                </span>
              </div>
              <span className="text-xs font-bold text-white hidden sm:inline self-end mb-1">
                Cart
              </span>
            </button>
          </div>
        </div>

        {/* Secondary Amazon Sub-Nav Bar: #232f3e */}
        <div className="bg-[#232f3e] px-4 py-1.5 flex items-center justify-between text-xs overflow-x-auto whitespace-nowrap border-b border-stone-800">
          <div className="flex items-center gap-4 text-stone-200">
            {/* All menu hamburger */}
            <button
              onClick={() => setIsAllMenuOpen(true)}
              className="flex items-center gap-1 font-bold text-white p-1 hover:outline hover:outline-1 hover:outline-white rounded-xs"
            >
              <Menu className="w-4 h-4" />
              <span>All Departments</span>
            </button>

            {/* Storefront View Button */}
            <button
              onClick={() => {
                setActiveView('store');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`p-1 hover:outline hover:outline-1 hover:outline-white rounded-xs ${
                activeView === 'store' ? 'text-white font-bold underline' : ''
              }`}
            >
              Storefront
            </button>

            <button
              onClick={() => {
                setActiveView('store');
                setSearchCategory('All');
                setSearchQuery('');
                setLocalSearch('');
                const el = document.getElementById('garments-collection');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                showNotification('Viewing MUNSI WORLD deals — up to 40% off SS26 items.', 'success');
              }}
              className="p-1 hover:outline hover:outline-1 hover:outline-white rounded-xs"
            >
              Today&apos;s Garment Deals
            </button>

            <button
              onClick={() => {
                setActiveView('customers');
                setCustomerSection('orders');
              }}
              className={`p-1 hover:outline hover:outline-1 hover:outline-white rounded-xs ${
                activeView === 'customers' && customerSection === 'orders' ? 'text-white font-bold underline' : ''
              }`}
            >
              Your Account &amp; Orders
            </button>

            <button
              onClick={() => {
                setActiveView('customers');
                setCustomerSection('measurements');
              }}
              className={`p-1 hover:outline hover:outline-1 hover:outline-white hidden md:inline rounded-xs ${
                activeView === 'customers' && customerSection === 'measurements' ? 'text-white font-bold underline' : ''
              }`}
            >
              Bespoke Fit Guide
            </button>

            <button
              onClick={() => {
                setActiveView('customers');
                setCustomerSection('prime');
              }}
              className={`p-1 hover:outline hover:outline-1 hover:outline-white hidden lg:inline rounded-xs ${
                activeView === 'customers' && customerSection === 'prime' ? 'text-white font-bold underline' : ''
              }`}
            >
              Munsi Prime Luxury
            </button>

            <button
              onClick={() => {
                setActiveView('store');
                const el = document.getElementById('garments-collection');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="p-1 hover:outline hover:outline-1 hover:outline-white hidden xl:inline rounded-xs"
            >
              SS26 Collection
            </button>
          </div>

          {/* Right Secondary Actions: Seller Central (Admin) and Mobile Sync */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile App Sync toggle */}
            <button
              onClick={() => setIsMobileSimulatorOpen(!isMobileSimulatorOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium bg-[#131921] hover:bg-black text-stone-200 border border-stone-600 rounded-sm"
              title="Toggle Mobile App Sync Simulator"
            >
              <Smartphone className="w-3.5 h-3.5 text-[#febd69]" />
              <span className="hidden sm:inline">Mobile App Sync</span>
            </button>

            {/* Seller Central (Admin Page Trigger) */}
            <button
              onClick={handleGoToAdmin}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-[#131921] bg-[#febd69] hover:bg-[#f3a847] rounded-sm transition-colors shadow-xs ${
                activeView === 'admin' ? 'ring-2 ring-white' : ''
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#131921]" />
              <span>Seller Central (Admin)</span>
            </button>
          </div>
        </div>
      </header>

      {/* Amazon "All" Drawer Modal */}
      {isAllMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            onClick={() => setIsAllMenuOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
          />

          {/* Side Drawer */}
          <div className="relative w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 text-[#0f1111] overflow-y-auto">
            {/* Header with Customer Welcome */}
            <div className="bg-[#232f3e] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-[#febd69] text-[#131921] rounded-full flex items-center justify-center font-bold text-xs">
                  {activeCustomer.name[0]}
                </div>
                <span className="font-bold text-base">Hello, {activeCustomer.name}</span>
              </div>
              <button
                onClick={() => setIsAllMenuOpen(false)}
                className="text-stone-300 hover:text-white p-1"
                aria-label="Close Department Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu Sections */}
            <div className="py-2 divide-y divide-stone-200 text-xs">
              {/* Category 1: Garment Departments */}
              <div className="py-2">
                <h4 className="px-5 py-2 font-bold text-stone-500 uppercase tracking-wider text-[11px]">
                  Shop By Category
                </h4>
                <button
                  onClick={() => {
                    setActiveView('store');
                    setSearchCategory('outerwear');
                    setSearchQuery('');
                    setIsAllMenuOpen(false);
                    const el = document.getElementById('garments-collection');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full text-left px-5 py-2.5 hover:bg-stone-100 flex items-center justify-between font-medium"
                >
                  <span>Virgin Wool Outerwear &amp; Overcoats</span>
                  <span className="text-stone-400">&rsaquo;</span>
                </button>
                <button
                  onClick={() => {
                    setActiveView('store');
                    setSearchCategory('knitwear');
                    setSearchQuery('');
                    setIsAllMenuOpen(false);
                    const el = document.getElementById('garments-collection');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full text-left px-5 py-2.5 hover:bg-stone-100 flex items-center justify-between font-medium"
                >
                  <span>450gsm Mongolian Cashmere Knitwear</span>
                  <span className="text-stone-400">&rsaquo;</span>
                </button>
                <button
                  onClick={() => {
                    setActiveView('store');
                    setSearchCategory('trousers');
                    setSearchQuery('');
                    setIsAllMenuOpen(false);
                    const el = document.getElementById('garments-collection');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full text-left px-5 py-2.5 hover:bg-stone-100 flex items-center justify-between font-medium"
                >
                  <span>Normandy Pleated Linen Trousers</span>
                  <span className="text-stone-400">&rsaquo;</span>
                </button>
                <button
                  onClick={() => {
                    setActiveView('store');
                    setSearchCategory('overshirts');
                    setSearchQuery('');
                    setIsAllMenuOpen(false);
                    const el = document.getElementById('garments-collection');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full text-left px-5 py-2.5 hover:bg-stone-100 flex items-center justify-between font-medium"
                >
                  <span>Japanese Raw Selvedge Denim Jackets</span>
                  <span className="text-stone-400">&rsaquo;</span>
                </button>
              </div>

              {/* Category 2: Programs & Features */}
              <div className="py-2">
                <h4 className="px-5 py-2 font-bold text-stone-500 uppercase tracking-wider text-[11px]">
                  Programs &amp; Features
                </h4>
                <button
                  onClick={() => {
                    setActiveView('customers');
                    setCustomerSection('prime');
                    setIsAllMenuOpen(false);
                  }}
                  className="w-full text-left px-5 py-2.5 hover:bg-stone-100 flex items-center justify-between font-medium"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#c45500]" />
                    Munsi Prime VIP Membership
                  </span>
                  <span className="text-stone-400">&rsaquo;</span>
                </button>
                <button
                  onClick={() => {
                    setActiveView('customers');
                    setCustomerSection('measurements');
                    setIsAllMenuOpen(false);
                  }}
                  className="w-full text-left px-5 py-2.5 hover:bg-stone-100 flex items-center justify-between font-medium"
                >
                  <span className="flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-[#007185]" />
                    Bespoke Sizing &amp; Measurement Guide
                  </span>
                  <span className="text-stone-400">&rsaquo;</span>
                </button>
                <button
                  onClick={() => {
                    setIsAllMenuOpen(false);
                    setIsTrackingOpen(true);
                  }}
                  className="w-full text-left px-5 py-2.5 hover:bg-stone-100 flex items-center justify-between font-medium"
                >
                  <span className="flex items-center gap-2">
                    <Package className="w-3.5 h-3.5 text-stone-600" />
                    Track Automated Shipments
                  </span>
                  <span className="text-stone-400">&rsaquo;</span>
                </button>
                <button
                  onClick={() => {
                    setActiveView('customers');
                    setCustomerSection('payments');
                    setIsAllMenuOpen(false);
                  }}
                  className="w-full text-left px-5 py-2.5 hover:bg-stone-100 flex items-center justify-between font-medium"
                >
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Your Payments &amp; 1-Click Settings
                  </span>
                  <span className="text-stone-400">&rsaquo;</span>
                </button>
              </div>

              {/* Category 3: Admin & Operations */}
              <div className="py-2">
                <h4 className="px-5 py-2 font-bold text-stone-500 uppercase tracking-wider text-[11px]">
                  Seller Central Operations
                </h4>
                <button
                  onClick={() => {
                    setActiveView('admin');
                    setAdminTab('inventory');
                    setIsAllMenuOpen(false);
                  }}
                  className="w-full text-left px-5 py-2.5 hover:bg-stone-100 flex items-center justify-between font-medium text-[#c45500]"
                >
                  <span>Inventory Matrix &amp; SKUs</span>
                  <span className="text-stone-400">&rsaquo;</span>
                </button>
                <button
                  onClick={() => {
                    setActiveView('admin');
                    setAdminTab('orders');
                    setIsAllMenuOpen(false);
                  }}
                  className="w-full text-left px-5 py-2.5 hover:bg-stone-100 flex items-center justify-between font-medium"
                >
                  <span>Fulfillment &amp; Automated Carrier Scans</span>
                  <span className="text-stone-400">&rsaquo;</span>
                </button>
                <button
                  onClick={() => {
                    setActiveView('admin');
                    setAdminTab('analytics');
                    setIsAllMenuOpen(false);
                  }}
                  className="w-full text-left px-5 py-2.5 hover:bg-stone-100 flex items-center justify-between font-medium"
                >
                  <span>Seasonal Performance &amp; Reports</span>
                  <span className="text-stone-400">&rsaquo;</span>
                </button>
                <button
                  onClick={() => {
                    setActiveView('admin');
                    setAdminTab('customers');
                    setIsAllMenuOpen(false);
                  }}
                  className="w-full text-left px-5 py-2.5 hover:bg-stone-100 flex items-center justify-between font-medium"
                >
                  <span>Client Dossiers &amp; Customer Support</span>
                  <span className="text-stone-400">&rsaquo;</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
