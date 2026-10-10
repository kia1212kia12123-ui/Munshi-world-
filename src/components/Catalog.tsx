import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { GarmentProduct } from '../types';
import { Star, Check, Plus, ShieldCheck, Heart, X, Search } from 'lucide-react';

export const Catalog: React.FC = () => {
  const {
    products,
    formatPrice,
    setSelectedProductId,
    addToCart,
    wishlist,
    toggleWishlist,
    searchQuery,
    setSearchQuery,
    searchCategory,
    setSearchCategory,
    showNotification,
  } = useStore();

  const [selectedSeason, setSelectedSeason] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'rating'>('featured');
  const [addedItemEffect, setAddedItemEffect] = useState<string | null>(null);

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        const catFilter = searchCategory.toLowerCase();
        if (catFilter !== 'all' && p.category.toLowerCase() !== catFilter) {
          return false;
        }

        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchSubtitle = p.subtitle.toLowerCase().includes(q);
          const matchComposition = p.composition.toLowerCase().includes(q);
          const matchCategory = p.category.toLowerCase().includes(q);
          const matchDescription = p.description.toLowerCase().includes(q);
          const matchSeason = p.season.toLowerCase().includes(q);
          if (!matchTitle && !matchSubtitle && !matchComposition && !matchCategory && !matchDescription && !matchSeason) {
            return false;
          }
        }

        // Season filter
        if (selectedSeason !== 'all' && p.season !== selectedSeason) return false;

        // Size filter
        if (selectedSize !== 'all') {
          const hasSize = p.variants.some((v) => v.size === selectedSize && v.stock > 0);
          if (!hasSize) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.priceUSD - b.priceUSD;
        if (sortBy === 'price_desc') return b.priceUSD - a.priceUSD;
        if (sortBy === 'rating') return b.reviews.length - a.reviews.length;
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, searchCategory, searchQuery, selectedSeason, selectedSize, sortBy]);

  const handleQuickAdd = (product: GarmentProduct, e: React.MouseEvent) => {
    e.stopPropagation();
    const availableVariant =
      product.variants.find((v) => v.size === 'M' && v.stock > 0) ||
      product.variants.find((v) => v.stock > 0);

    if (availableVariant) {
      addToCart(product, availableVariant, 1);
      setAddedItemEffect(product.id);
      showNotification(`Added "${product.title}" (Size ${availableVariant.size}) to MUNSI WORLD Cart.`, 'success');
      setTimeout(() => setAddedItemEffect(null), 1800);
    } else {
      setSelectedProductId(product.id);
    }
  };

  const getAverageRating = (reviews: GarmentProduct['reviews']) => {
    if (!reviews.length) return 5.0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getTotalStock = (variants: GarmentProduct['variants']) => {
    return variants.reduce((acc, v) => acc + v.stock, 0);
  };

  const clearAllFilters = () => {
    setSearchCategory('All');
    setSearchQuery('');
    setSelectedSeason('all');
    setSelectedSize('all');
  };

  return (
    <section id="garments-collection" className="bg-[#eaeded] py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Amazon Category Ribbon Bar */}
        <div className="bg-white border border-[#d5d9d9] p-3 rounded-md shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-1.5 font-medium text-stone-700">
            <span className="font-bold text-[#0f1111] mr-2">Department:</span>
            {[
              { id: 'All', label: 'All Garments' },
              { id: 'outerwear', label: 'Outerwear & Coats' },
              { id: 'knitwear', label: 'Cashmere Knitwear' },
              { id: 'trousers', label: 'Tailored Trousers' },
              { id: 'overshirts', label: 'Denim & Overshirts' },
              { id: 'essentials', label: 'Essentials' },
            ].map((cat) => {
              const isActive = searchCategory.toLowerCase() === cat.id.toLowerCase();
              return (
                <button
                  key={cat.id}
                  onClick={() => setSearchCategory(cat.id)}
                  className={`px-3 py-1 rounded-full transition-colors ${
                    isActive
                      ? 'bg-[#232f3e] text-white font-bold'
                      : 'bg-[#f0f2f2] hover:bg-stone-200 text-[#0f1111]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Amazon Sort By Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-stone-500 font-medium">Sort by:</span>
            <select
              value={sortBy}
              aria-label="Sort products by"
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#f0f2f2] border border-[#d5d9d9] px-2.5 py-1 text-xs text-[#0f1111] rounded-md focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Avg. Customer Review</option>
            </select>
          </div>
        </div>

        {/* Results Counter Bar & Active Filter Chips */}
        <div className="bg-white border border-[#d5d9d9] px-4 py-2.5 rounded-md shadow-xs flex flex-wrap items-center justify-between gap-2 text-xs text-stone-600">
          <div className="flex items-center flex-wrap gap-2">
            <span>
              1-{filteredProducts.length} of {products.length} results
            </span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1 bg-[#febd69]/20 text-[#131921] px-2 py-0.5 rounded font-medium border border-[#febd69]/60">
                Keyword: &quot;{searchQuery}&quot;
                <button
                  onClick={() => setSearchQuery('')}
                  className="hover:text-black ml-0.5"
                  title="Remove search filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {searchCategory.toLowerCase() !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-stone-100 text-stone-800 px-2 py-0.5 rounded font-medium border border-stone-300">
                Dept: {searchCategory}
                <button
                  onClick={() => setSearchCategory('All')}
                  className="hover:text-black ml-0.5"
                  title="Remove department filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {(searchQuery || searchCategory.toLowerCase() !== 'all') && (
              <button
                onClick={clearAllFilters}
                className="text-[#007185] hover:underline font-bold ml-1"
              >
                Clear all filters
              </button>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 font-bold text-[#00a8e1]">
              <span className="bg-[#00a8e1] text-white px-1 py-0.2 rounded text-[10px]">prime</span>
              <span>Next-Day Eligible</span>
            </span>
            <span>Global Express Escrow</span>
          </div>
        </div>

        {/* Amazon Grid Results */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white border border-[#d5d9d9] p-12 text-center rounded-md space-y-3">
            <Search className="w-10 h-10 text-stone-300 mx-auto" />
            <h3 className="text-base font-bold text-[#0f1111]">
              No garments found matching your filters.
            </h3>
            <p className="text-xs text-stone-500">
              Try checking your spelling or use more general terms like &quot;wool&quot;, &quot;cashmere&quot;, or &quot;denim&quot;.
            </p>
            <button
              onClick={clearAllFilters}
              className="px-4 py-2 btn-amazon-primary font-bold text-xs shadow-xs mt-2"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => {
              const avgRating = getAverageRating(product.reviews);
              const totalStock = getTotalStock(product.variants);
              const isWishlisted = wishlist.includes(product.id);
              const isJustAdded = addedItemEffect === product.id;

              return (
                <div
                  key={product.id}
                  onClick={() => setSelectedProductId(product.id)}
                  className="bg-white border border-[#d5d9d9] rounded-xs hover:shadow-lg transition-shadow duration-200 cursor-pointer flex flex-col justify-between p-3.5 relative group"
                >
                  <div>
                    {/* Image Area with badges */}
                    <div className="relative aspect-3/4 w-full bg-[#f8f8f8] mb-3 overflow-hidden rounded-xs">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />

                      {/* MUNSI WORLD's Choice Badge */}
                      {product.featured && (
                        <div className="absolute top-0 left-0 bg-[#232f3e] text-white text-[10px] font-bold px-2 py-0.5 rounded-br-xs flex items-center gap-1 shadow-xs">
                          <span className="text-[#febd69]">MUNSI&apos;s</span>
                          <span>Choice</span>
                        </div>
                      )}

                      {/* Wishlist Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product.id);
                        }}
                        className={`absolute top-2 right-2 p-1.5 rounded-full bg-white/90 backdrop-blur-xs transition-colors shadow-xs ${
                          isWishlisted ? 'text-[#cc0c39]' : 'text-stone-400 hover:text-stone-700'
                        }`}
                        title="Add to Wishlist"
                      >
                        <Heart
                          className={`w-4 h-4 ${isWishlisted ? 'fill-[#cc0c39]' : ''}`}
                        />
                      </button>

                      {/* Fabric pill overlay at bottom */}
                      <div className="absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-xs text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
                        {product.season} &bull; {product.gender.toUpperCase()}
                      </div>
                    </div>

                    {/* Product Title and Subtitle */}
                    <h3 className="text-sm font-semibold text-[#0f1111] hover:text-[#c45500] line-clamp-2 leading-snug">
                      {product.title}
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">
                      {product.subtitle}
                    </p>

                    {/* Amazon Star Rating & Review Count */}
                    <div className="flex items-center gap-1.5 mt-1.5 text-xs">
                      <div className="flex text-[#de7921]">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < Math.floor(Number(avgRating))
                                ? 'fill-[#de7921]'
                                : 'text-stone-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[#007185] hover:underline font-medium text-xs">
                        {avgRating} ({product.reviews.length})
                      </span>
                    </div>

                    {/* Price Block */}
                    <div className="mt-2 flex items-baseline gap-1.5">
                      <span className="text-lg font-bold text-[#0f1111]">
                        {formatPrice(product.priceUSD)}
                      </span>
                      <span className="text-xs text-stone-400 line-through">
                        {formatPrice(Math.round(product.priceUSD * 1.25))}
                      </span>
                      <span className="text-xs font-bold text-[#cc0c39]">
                        Save 20%
                      </span>
                    </div>

                    {/* Amazon Prime Badge & Delivery estimation */}
                    <div className="mt-1 flex items-center gap-1 text-[11px] text-stone-600">
                      <span className="text-sky-700 font-black italic">prime</span>
                      <span className="font-semibold text-stone-800">
                        FREE Delivery Tomorrow
                      </span>
                    </div>

                    {/* Stock Alert */}
                    <p
                      className={`text-[11px] mt-1 ${
                        totalStock <= 5
                          ? 'text-[#b12704] font-bold'
                          : 'text-stone-500'
                      }`}
                    >
                      {totalStock <= 5
                        ? `Only ${totalStock} left in stock - order soon.`
                        : 'In Stock & Ready to Ship.'}
                    </p>
                  </div>

                  {/* Add to Cart Amazon Button */}
                  <div className="mt-3 pt-2 border-t border-stone-100">
                    <button
                      onClick={(e) => handleQuickAdd(product, e)}
                      className={`w-full py-1.5 px-3 text-xs font-bold rounded-full transition-all flex items-center justify-center gap-1.5 shadow-xs ${
                        isJustAdded
                          ? 'bg-emerald-600 text-white'
                          : 'btn-amazon-primary'
                      }`}
                    >
                      {isJustAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added to Cart</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
