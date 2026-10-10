import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Tag,
  Zap,
} from 'lucide-react';

export const Hero: React.FC = () => {
  const { setSelectedProductId, setSearchCategory, setSearchQuery } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 'munsi-banner-1',
      image: '/src/assets/images/munsi_world_banner_1791647216292.jpg',
      badge: 'MUNSI WORLD PRIME EXCLUSIVE',
      title: 'Spring Garment Days: Luxury Tailoring & Textiles',
      subtitle: 'Save up to 40% on Biella virgin wool, grade-A Mongolian cashmere, and artisanal selvedge denim.',
      cta: 'Shop Spring Garment Deals',
    },
    {
      id: 'munsi-banner-2',
      image: '/src/assets/images/hero_garments_campaign_1791643409986.jpg',
      badge: 'SS26 EDITORIAL CAMPAIGN',
      title: 'Double-Breasted Overcoats & Relaxed Silhouettes',
      subtitle: 'Engineered for international transit. Weatherproof virgin wool with natural horn buttons.',
      cta: 'Explore Outerwear Deals',
    },
  ];

  // Auto advance slides every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const scrollToCatalog = () => {
    const el = document.getElementById('garments-collection');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const activeSlide = slides[currentSlide];

  return (
    <div className="relative bg-[#eaeded] pb-4">
      {/* Amazon Full-Width Hero Carousel Banner */}
      <div className="relative w-full h-[320px] sm:h-[400px] md:h-[460px] overflow-hidden bg-stone-900 group">
        <img
          src={activeSlide.image}
          alt={activeSlide.title}
          className="w-full h-full object-cover object-top transition-opacity duration-700"
          referrerPolicy="no-referrer"
        />

        {/* Amazon Signature Gradient Fade into Body #eaeded */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-[#eaeded]" />

        {/* Left Carousel Arrow */}
        <button
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="absolute left-2 top-1/3 -translate-y-1/2 w-11 h-20 bg-black/20 hover:bg-black/50 text-white flex items-center justify-center rounded-xs transition-colors z-30 opacity-70 group-hover:opacity-100"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>

        {/* Right Carousel Arrow */}
        <button
          onClick={handleNext}
          aria-label="Next Slide"
          className="absolute right-2 top-1/3 -translate-y-1/2 w-11 h-20 bg-black/20 hover:bg-black/50 text-white flex items-center justify-center rounded-xs transition-colors z-30 opacity-70 group-hover:opacity-100"
        >
          <ChevronRight className="w-8 h-8" />
        </button>

        {/* Banner Copy & Call to Action */}
        <div className="absolute top-6 sm:top-12 left-4 sm:left-14 max-w-xl text-white space-y-2 z-20">
          <div className="flex items-center gap-2">
            <span className="bg-[#febd69] text-[#131921] text-[11px] font-black px-2.5 py-0.5 rounded-xs tracking-wide">
              {activeSlide.badge}
            </span>
            <span className="text-xs font-semibold text-stone-200">
              MUNSI WORLD Official Store
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight drop-shadow-md">
            {activeSlide.title}
          </h1>

          <p className="text-xs sm:text-sm text-stone-200 line-clamp-2 max-w-md drop-shadow-sm font-medium">
            {activeSlide.subtitle}
          </p>

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={scrollToCatalog}
              className="px-6 py-2.5 btn-amazon-primary text-xs font-bold shadow-md flex items-center gap-1.5 transition-transform active:scale-98"
            >
              <span>{activeSlide.cta}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <span className="text-xs text-stone-300 hidden sm:inline-block">
              Free Express Delivery on orders over $250
            </span>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-28 sm:bottom-36 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentSlide ? 'w-6 bg-[#febd69]' : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Amazon 4-Card Department Showcase (Overlapping Hero) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 sm:-mt-32 relative z-30">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Tile 1: Outerwear */}
          <div className="bg-white p-4 rounded-xs shadow-md border border-[#d5d9d9] flex flex-col justify-between hover:shadow-lg transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-bold text-[#0f1111]">Virgin Wool Outerwear</h3>
                <span className="text-[10px] font-bold text-white bg-[#cc0c39] px-1.5 py-0.5 rounded-xs">
                  -25%
                </span>
              </div>
              <div
                onClick={() => setSelectedProductId('garment-01')}
                className="aspect-square w-full overflow-hidden bg-stone-100 cursor-pointer mb-2 rounded-xs group/img relative"
              >
                <img
                  src="/src/assets/images/product_tailored_overcoat_1791643431821.jpg"
                  alt="Overcoat"
                  className="w-full h-full object-cover group-hover/img:scale-104 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded backdrop-blur-xs font-semibold">
                  Biella 620gsm Wool
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setSearchCategory('outerwear');
                setSearchQuery('');
                scrollToCatalog();
              }}
              className="text-xs text-[#007185] hover:underline hover:text-[#c7511f] font-medium text-left pt-1"
            >
              See more outerwear deals &rsaquo;
            </button>
          </div>

          {/* Tile 2: Cashmere */}
          <div className="bg-white p-4 rounded-xs shadow-md border border-[#d5d9d9] flex flex-col justify-between hover:shadow-lg transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-bold text-[#0f1111]">Mongolian Cashmere</h3>
                <span className="text-[10px] font-bold text-white bg-[#e67a00] px-1.5 py-0.5 rounded-xs">
                  Best Seller
                </span>
              </div>
              <div
                onClick={() => setSelectedProductId('garment-02')}
                className="aspect-square w-full overflow-hidden bg-stone-100 cursor-pointer mb-2 rounded-xs group/img relative"
              >
                <img
                  src="/src/assets/images/product_cashmere_knit_1791643421788.jpg"
                  alt="Cashmere knitwear"
                  className="w-full h-full object-cover group-hover/img:scale-104 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded backdrop-blur-xs font-semibold">
                  Seamless WholeGarment
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setSearchCategory('knitwear');
                setSearchQuery('');
                scrollToCatalog();
              }}
              className="text-xs text-[#007185] hover:underline hover:text-[#c7511f] font-medium text-left pt-1"
            >
              Shop 450gsm cashmere &rsaquo;
            </button>
          </div>

          {/* Tile 3: Linen Trousers */}
          <div className="bg-white p-4 rounded-xs shadow-md border border-[#d5d9d9] flex flex-col justify-between hover:shadow-lg transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-bold text-[#0f1111]">Normandy Linen Trousers</h3>
                <span className="text-[10px] font-bold text-[#007185] bg-sky-50 border border-sky-200 px-1.5 py-0.5 rounded-xs">
                  SS26
                </span>
              </div>
              <div
                onClick={() => setSelectedProductId('garment-03')}
                className="aspect-square w-full overflow-hidden bg-stone-100 cursor-pointer mb-2 rounded-xs group/img relative"
              >
                <img
                  src="/src/assets/images/product_pleated_trousers_1791643441082.jpg"
                  alt="Linen trousers"
                  className="w-full h-full object-cover group-hover/img:scale-104 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded backdrop-blur-xs font-semibold">
                  Double Pleats &bull; Tab Waist
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setSearchCategory('trousers');
                setSearchQuery('');
                scrollToCatalog();
              }}
              className="text-xs text-[#007185] hover:underline hover:text-[#c7511f] font-medium text-left pt-1"
            >
              Discover pleated tailoring &rsaquo;
            </button>
          </div>

          {/* Tile 4: Denim & Utility */}
          <div className="bg-white p-4 rounded-xs shadow-md border border-[#d5d9d9] flex flex-col justify-between hover:shadow-lg transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-bold text-[#0f1111]">Kurashiki Raw Denim</h3>
                <span className="text-[10px] font-bold text-white bg-indigo-700 px-1.5 py-0.5 rounded-xs">
                  14.5oz
                </span>
              </div>
              <div
                onClick={() => setSelectedProductId('garment-04')}
                className="aspect-square w-full overflow-hidden bg-stone-100 cursor-pointer mb-2 rounded-xs group/img relative"
              >
                <img
                  src="/src/assets/images/product_silk_overshirt_1791643452698.jpg"
                  alt="Denim utility jacket"
                  className="w-full h-full object-cover group-hover/img:scale-104 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded backdrop-blur-xs font-semibold">
                  Red-Line Shuttle Selvedge
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setSearchCategory('overshirts');
                setSearchQuery('');
                scrollToCatalog();
              }}
              className="text-xs text-[#007185] hover:underline hover:text-[#c7511f] font-medium text-left pt-1"
            >
              Explore Japanese denim &rsaquo;
            </button>
          </div>
        </div>

        {/* Amazon Prime Guarantee Strip */}
        <div className="mt-4 bg-white border border-[#d5d9d9] p-3 rounded-xs flex flex-wrap items-center justify-between gap-4 text-xs text-stone-700 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="text-sky-700 font-black text-sm italic">prime</span>
            <span className="font-semibold text-stone-900">
              FREE Next-Day Delivery on Luxury Garment Orders
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 text-stone-600">
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>Automated DHL &amp; FedEx Tracking</span>
            </div>
            <div className="flex items-center gap-1.5 text-stone-600">
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              <span>3D Secure 2.0 &amp; Escrow Payments</span>
            </div>
            <div className="flex items-center gap-1.5 text-stone-600">
              <RotateCcw className="w-4 h-4 text-amber-600" />
              <span>30-Day Compliant Tailoring Returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
