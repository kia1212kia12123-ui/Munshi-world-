import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { GarmentVariant } from '../types';
import {
  X,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  ThumbsUp,
  Check,
  Plus,
  Minus,
  Lock,
  MapPin,
  Heart,
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const {
    products,
    selectedProductId,
    setSelectedProductId,
    formatPrice,
    addToCart,
    activeCustomer,
    setIsCheckoutOpen,
    setIsCartOpen,
    voteReviewHelpful,
    setIsReviewModalOpen,
  } = useStore();

  const product = products.find((p) => p.id === selectedProductId);

  // Default variant state
  const [selectedVariant, setSelectedVariant] = useState<GarmentVariant | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [justAdded, setJustAdded] = useState<boolean>(false);

  // Sync variant when product opens
  React.useEffect(() => {
    if (product && product.variants.length > 0) {
      const defaultVar =
        product.variants.find((v) => v.size === 'M' && v.stock > 0) ||
        product.variants.find((v) => v.stock > 0) ||
        product.variants[0];
      setSelectedVariant(defaultVar);
      setQuantity(1);
    }
  }, [product]);

  if (!product || !selectedVariant) return null;

  const handleClose = () => {
    setSelectedProductId(null);
  };

  const handleAddToCart = () => {
    if (selectedVariant.stock <= 0) return;
    addToCart(product, selectedVariant, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (selectedVariant.stock <= 0) return;
    addToCart(product, selectedVariant, quantity);
    setSelectedProductId(null);
    setIsCheckoutOpen(true);
  };

  const totalReviews = product.reviews.length;
  const avgRating =
    totalReviews > 0
      ? (product.reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
      : '5.0';

  const fitTrueToSize = product.reviews.filter((r) => r.fitFeedback === 'true_to_size').length;
  const trueToSizePct = totalReviews > 0 ? Math.round((fitTrueToSize / totalReviews) * 100) : 86;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="relative w-full max-w-6xl bg-white border border-[#d5d9d9] shadow-2xl rounded-md overflow-hidden my-auto max-h-[95vh] flex flex-col">
        {/* Amazon Top Bar of Modal */}
        <div className="bg-[#f0f2f2] px-4 py-2 border-b border-[#d5d9d9] flex items-center justify-between text-xs text-stone-600 shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#0f1111]">MUNSI WORLD Garments Details</span>
            <span>&bull;</span>
            <span className="amazon-link">Brand: MUNSI WORLD Official Store</span>
          </div>

          <button
            onClick={handleClose}
            aria-label="Close"
            className="p-1 text-stone-500 hover:text-stone-900 rounded-sm hover:bg-stone-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Amazon 3-Column Split */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Column 1: Image Gallery (Left, 4 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="relative aspect-square w-full overflow-hidden bg-stone-50 border border-[#d5d9d9] rounded-md">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-[11px] text-stone-500 text-center">
              Roll over image to zoom in &bull; High resolution studio fashion photography
            </p>
          </div>

          {/* Column 2: Product Specifications (Center, 4 cols) */}
          <div className="lg:col-span-4 space-y-4 text-xs">
            <div>
              <span className="amazon-link font-medium block mb-1">
                Visit the MUNSI WORLD Luxury Store
              </span>
              <h1 className="text-lg sm:text-xl font-bold text-[#0f1111] leading-snug">
                {product.title}
              </h1>
              <p className="text-stone-500 text-xs mt-1">{product.subtitle}</p>

              {/* Star Rating & Answered Questions */}
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-stone-200">
                <div className="flex items-center text-[#de7921]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.round(Number(avgRating))
                          ? 'fill-[#de7921] text-[#de7921]'
                          : 'text-stone-300'
                      }`}
                    />
                  ))}
                  <span className="ml-1 text-[#007185] font-bold">{avgRating}</span>
                </div>
                <span className="text-stone-400">|</span>
                <span className="amazon-link">{totalReviews * 14 + 28} ratings</span>
              </div>
            </div>

            {/* Price section */}
            <div className="py-2 border-t border-stone-200">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[#0f1111] font-mono">
                  {formatPrice(product.priceUSD)}
                </span>
                <span className="text-stone-400 line-through text-xs">
                  {formatPrice(Math.round(product.priceUSD * 1.25))}
                </span>
              </div>
              <p className="text-[#007185] text-xs font-semibold mt-1">
                FREE Returns &bull; All Import Customs &amp; Taxes Included
              </p>
            </div>

            {/* Color selection */}
            <div>
              <span className="text-stone-700 font-bold block mb-1.5">
                Color: <span className="font-normal">{selectedVariant.color}</span>
              </span>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 p-1.5 border-2 border-[#e77600] rounded-md bg-stone-50">
                  <span
                    className="w-4 h-4 rounded-full border border-stone-400 inline-block"
                    style={{ backgroundColor: selectedVariant.colorHex }}
                  />
                  <span className="text-xs font-medium">{selectedVariant.color}</span>
                </button>
              </div>
            </div>

            {/* Size selection */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-stone-700 font-bold">Size:</span>
                <span className="amazon-link text-[11px] cursor-pointer">Size Chart</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => {
                  const isSelected = selectedVariant.id === v.id;
                  const isOutOfStock = v.stock <= 0;
                  return (
                    <button
                      key={v.id}
                      disabled={isOutOfStock}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-3 py-1.5 border text-xs font-semibold rounded-md ${
                        isSelected
                          ? 'border-[#007185] bg-[#f0f2f2] text-[#0f1111] shadow-xs'
                          : isOutOfStock
                          ? 'border-stone-200 bg-stone-100 text-stone-400 line-through cursor-not-allowed'
                          : 'border-[#d5d9d9] bg-white text-stone-800 hover:bg-stone-50'
                      }`}
                    >
                      {v.size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Product specifications table */}
            <div className="pt-3 border-t border-stone-200 space-y-1.5">
              <span className="font-bold text-stone-900 block mb-2">Product Specifications:</span>
              <div className="grid grid-cols-3 gap-1 text-[11px]">
                <span className="text-stone-500 font-medium">Material:</span>
                <span className="col-span-2 text-stone-900">{product.composition}</span>

                <span className="text-stone-500 font-medium">Fit Type:</span>
                <span className="col-span-2 text-stone-900">{product.fitDetails}</span>

                <span className="text-stone-500 font-medium">Model Sizing:</span>
                <span className="col-span-2 text-stone-900">{product.modelMeasurements}</span>

                <span className="text-stone-500 font-medium">SKU:</span>
                <span className="col-span-2 text-stone-900 font-mono">{selectedVariant.sku}</span>
              </div>
            </div>

            {/* About this item bullet list */}
            <div className="pt-3 border-t border-stone-200">
              <span className="font-bold text-stone-900 block mb-1.5">About this item:</span>
              <ul className="list-disc list-inside space-y-1 text-stone-600 font-light text-[11px]">
                <li>{product.description}</li>
                <li>Sustainable natural fiber sourcing with master artisan finishing.</li>
                <li>Includes protective canvas garment bag and contour cedar hanger.</li>
              </ul>
            </div>
          </div>

          {/* Column 3: Amazon Buy Box Card (Right, 3 cols) */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-[#d5d9d9] rounded-lg p-4 space-y-3 shadow-xs text-xs">
              <span className="text-2xl font-bold text-[#0f1111] font-mono block">
                {formatPrice(product.priceUSD * quantity)}
              </span>

              {/* Prime badge & delivery */}
              <div className="space-y-1">
                <div className="flex items-center gap-1 font-bold text-[#00a8e1]">
                  <span className="bg-[#00a8e1] text-white px-1 py-0.2 rounded text-[9px]">prime</span>
                  <span className="text-stone-800 font-normal">Two-Day Air Delivery</span>
                </div>
                <p className="text-stone-600">
                  FREE delivery <strong className="text-[#0f1111]">Tomorrow, Oct 11</strong>. Order within 4 hrs 12 mins.
                </p>
              </div>

              {/* Deliver to address */}
              <div className="flex items-center gap-1 text-stone-600 text-[11px] pt-1">
                <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span>Deliver to {activeCustomer.name.split(' ')[0]} - {activeCustomer.city} 75008</span>
              </div>

              {/* In stock status */}
              <div className="pt-1">
                {selectedVariant.stock > 0 ? (
                  <span className="text-emerald-700 font-bold text-sm block">In Stock</span>
                ) : (
                  <span className="text-[#b12704] font-bold text-sm block">Currently Unavailable</span>
                )}
                {selectedVariant.stock <= 5 && selectedVariant.stock > 0 && (
                  <span className="text-[#b12704] text-[11px] font-medium block">
                    Only {selectedVariant.stock} left in stock - order soon.
                  </span>
                )}
              </div>

              {/* Quantity selector */}
              <div className="flex items-center gap-2">
                <label className="text-stone-700 font-medium">Quantity:</label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="bg-[#f0f2f2] border border-[#d5d9d9] rounded-md px-2 py-1 text-xs font-medium focus:outline-none"
                >
                  {[...Array(Math.min(10, selectedVariant.stock || 1))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              {/* Amazon Yellow "Add to Cart" Button */}
              <button
                type="button"
                disabled={selectedVariant.stock <= 0}
                onClick={handleAddToCart}
                className="w-full py-2 px-3 text-xs font-semibold btn-amazon-primary shadow-xs"
              >
                {justAdded ? 'Added to Cart' : 'Add to Cart'}
              </button>

              {/* Amazon Orange "Buy Now" 1-Click Button */}
              <button
                type="button"
                disabled={selectedVariant.stock <= 0}
                onClick={handleBuyNow}
                className="w-full py-2 px-3 text-xs font-semibold btn-amazon-secondary shadow-xs"
              >
                Buy Now
              </button>

              {/* Secure transaction lock */}
              <div className="pt-2 border-t border-stone-200 text-[11px] text-stone-500 space-y-1">
                <div className="flex items-center gap-1.5 text-stone-600">
                  <Lock className="w-3.5 h-3.5 text-stone-500" />
                  <span>Secure transaction</span>
                </div>
                <div className="grid grid-cols-2 text-stone-500 pt-1">
                  <span>Ships from:</span>
                  <span className="text-stone-800">MUNSI WORLD Air Hub</span>
                  <span>Sold by:</span>
                  <span className="text-stone-800">MUNSI WORLD Store</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Bottom Section */}
        <div className="bg-[#f0f2f2] p-4 sm:p-6 border-t border-[#d5d9d9] space-y-4 text-xs shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-[#0f1111]">Customer Reviews &amp; Fit Ratings</h3>
              <p className="text-stone-500">
                {avgRating} out of 5 stars &bull; {trueToSizePct}% of clients report this garment fits true to size.
              </p>
            </div>

            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="py-1.5 px-4 btn-amazon-white text-xs font-medium self-start sm:self-auto"
            >
              Write a customer review
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {product.reviews.slice(0, 2).map((rev) => (
              <div key={rev.id} className="bg-white p-3.5 border border-[#d5d9d9] rounded-md space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#0f1111]">{rev.author}</span>
                  <span className="text-[10px] text-emerald-700 font-bold">Verified Purchase</span>
                </div>
                <div className="flex items-center gap-1 text-[#de7921]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < rev.rating ? 'fill-[#de7921] text-[#de7921]' : 'text-stone-300'
                      }`}
                    />
                  ))}
                  <span className="font-bold text-[#0f1111] ml-1">{rev.title}</span>
                </div>
                <p className="text-stone-600 font-light">{rev.comment}</p>
                <span className="text-[10px] text-stone-400 block pt-1">
                  Reviewed on {rev.date} &bull; Size: {rev.sizePurchased}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
