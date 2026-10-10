import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Star, CheckCircle } from 'lucide-react';
import { Review } from '../types';

export const ReviewModal: React.FC = () => {
  const {
    isReviewModalOpen,
    setIsReviewModalOpen,
    selectedProductId,
    products,
    submitReview,
    activeCustomer,
  } = useStore();

  const product = products.find((p) => p.id === selectedProductId) || products[0];

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [fitFeedback, setFitFeedback] = useState<Review['fitFeedback']>('true_to_size');
  const [author, setAuthor] = useState(activeCustomer?.name || 'Claire Beauchamp');
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [sizePurchased, setSizePurchased] = useState('Medium (40)');

  if (!isReviewModalOpen || !product) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author || !comment) return;

    submitReview(product.id, {
      author,
      rating,
      title: title || 'Exceptional craftsmanship and garment drape',
      comment,
      fitFeedback,
      verifiedBuyer: true,
      sizePurchased,
    });

    setIsReviewModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-lg bg-white border border-[#d5d9d9] shadow-2xl rounded-lg p-6 space-y-4 text-xs text-[#0f1111]">
        <div className="flex items-center justify-between pb-3 border-b border-[#d5d9d9]">
          <div className="flex items-center gap-3">
            <img
              src={product.image}
              alt={product.title}
              className="w-12 h-14 object-cover border border-[#d5d9d9] rounded"
              referrerPolicy="no-referrer"
            />
            <div>
              <span className="text-[10px] uppercase font-bold text-[#c45500]">
                Create Review &bull; Amazon Garments
              </span>
              <h3 className="text-sm font-bold text-[#0f1111] line-clamp-1">
                {product.title}
              </h3>
            </div>
          </div>

          <button
            onClick={() => setIsReviewModalOpen(false)}
            className="p-1 text-stone-400 hover:text-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Overall rating */}
          <div>
            <label className="block font-bold text-[#0f1111] mb-1.5">Overall rating</label>
            <div className="flex items-center gap-1 text-[#de7921]">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= (hoverRating || rating)
                        ? 'fill-[#de7921] text-[#de7921]'
                        : 'text-stone-300'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 font-bold text-[#0f1111]">{rating} out of 5 stars</span>
            </div>
          </div>

          {/* Sizing & Fit */}
          <div>
            <label className="block font-bold text-[#0f1111] mb-1.5">How does this garment fit?</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'runs_small', label: 'Runs Small' },
                { id: 'true_to_size', label: 'True to Size' },
                { id: 'runs_large', label: 'Runs Large' },
              ].map((fit) => (
                <button
                  type="button"
                  key={fit.id}
                  onClick={() => setFitFeedback(fit.id as any)}
                  className={`py-2 px-2 border rounded-md text-center font-medium ${
                    fitFeedback === fit.id
                      ? 'border-[#007185] bg-[#f0f2f2] text-[#007185] font-bold'
                      : 'border-[#d5d9d9] bg-white text-stone-700'
                  }`}
                >
                  {fit.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Public Name</label>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full bg-[#f0f2f2] border border-[#d5d9d9] p-2 rounded"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1">Size Purchased</label>
              <select
                value={sizePurchased}
                onChange={(e) => setSizePurchased(e.target.value)}
                className="w-full bg-[#f0f2f2] border border-[#d5d9d9] p-2 rounded"
              >
                <option value="XS">Extra Small (XS)</option>
                <option value="S">Small (S)</option>
                <option value="Medium (40)">Medium (M / 40)</option>
                <option value="Large (42)">Large (L / 42)</option>
                <option value="XL">Extra Large (XL)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Add a headline</label>
            <input
              type="text"
              placeholder="What's most important to know?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white border border-[#d5d9d9] p-2 rounded"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Write your review</label>
            <textarea
              required
              rows={4}
              placeholder="What did you like or dislike about the wool hand, cashmere warmth, or trouser break?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-white border border-[#d5d9d9] p-2 rounded resize-none"
            />
          </div>

          <div className="pt-3 border-t border-[#d5d9d9] flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsReviewModalOpen(false)}
              className="px-4 py-2 btn-amazon-white font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 btn-amazon-primary font-bold shadow-xs"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
