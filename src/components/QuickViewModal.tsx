import React, { useState } from 'react';
import {
  X,
  Star,
  ShoppingBag,
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  Play,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const QuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
    navigateTo,
  } = useApp();

  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const isSaved = isInWishlist(product.id);
  const hasDiscount = product.salePrice && product.salePrice < product.price;

  // Media list combining images + videos
  const allMedia: { type: 'image' | 'video'; url: string; poster?: string }[] = [
    ...product.images.map((url) => ({ type: 'image' as const, url })),
    ...(product.videos?.map((v) => ({
      type: 'video' as const,
      url: v.url,
      poster: v.poster || product.thumbnail,
    })) || []),
  ];

  const currentMedia = allMedia[activeMediaIndex] || {
    type: 'image',
    url: product.thumbnail,
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize || product.size);
    setQuickViewProduct(null);
  };

  const handleViewDetails = () => {
    navigateTo('product-details', { productId: product.id });
    setQuickViewProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={() => setQuickViewProduct(null)}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white w-full max-w-4xl shadow-2xl z-10 overflow-hidden border border-neutral-200 animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 p-2 text-neutral-500 hover:text-black hover:bg-neutral-100 rounded-full transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Media Gallery */}
          <div className="p-6 bg-[#FAF9F5] border-r border-neutral-200 flex flex-col justify-between">
            {/* Active Display */}
            <div className="relative aspect-square w-full bg-white overflow-hidden border border-neutral-200 flex items-center justify-center">
              {currentMedia.type === 'video' ? (
                <div className="relative w-full h-full bg-black">
                  <video
                    src={currentMedia.url}
                    poster={currentMedia.poster}
                    controls
                    autoPlay
                    muted
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <img
                  src={currentMedia.url}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                />
              )}

              {hasDiscount && (
                <span className="absolute top-3 left-3 bg-[#997C24] text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5">
                  Special Reserve
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {allMedia.length > 1 && (
              <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
                {allMedia.map((media, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setActiveMediaIndex(idx);
                      setIsVideoPlaying(media.type === 'video');
                    }}
                    className={`relative w-16 h-16 flex-shrink-0 border-2 overflow-hidden bg-white ${
                      activeMediaIndex === idx ? 'border-[#D4AF37]' : 'border-neutral-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    {media.type === 'video' ? (
                      <div className="w-full h-full bg-black flex items-center justify-center">
                        <Play className="w-5 h-5 text-white" />
                      </div>
                    ) : (
                      <img
                        src={media.url}
                        alt="thumbnail"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Product Summary & Actions */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              {/* Category & SKU */}
              <div className="flex items-center justify-between text-xs text-[#8C827A] uppercase tracking-widest mb-1">
                <span>{product.categoryName}</span>
                <span className="font-mono text-[11px] text-neutral-400">SKU: {product.sku}</span>
              </div>

              {/* Title */}
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-neutral-900 leading-tight">
                {product.name}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center text-[#D4AF37]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.round(product.rating)
                          ? 'fill-[#D4AF37]'
                          : 'text-neutral-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-neutral-700">
                  {product.rating.toFixed(1)}
                </span>
                <span className="text-xs text-neutral-400">
                  ({product.reviewsCount} atelier reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mt-4 flex items-baseline gap-3">
                {hasDiscount ? (
                  <>
                    <span className="text-2xl font-serif font-bold text-neutral-900">
                      ${product.salePrice?.toLocaleString()}
                    </span>
                    <span className="text-sm text-neutral-400 line-through">
                      ${product.price.toLocaleString()}
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-serif font-bold text-neutral-900">
                    ${product.price.toLocaleString()}
                  </span>
                )}
                <span className="text-xs text-emerald-600 font-medium">In Stock</span>
              </div>

              {/* Description Snippet */}
              <p className="mt-4 text-xs sm:text-sm text-neutral-600 leading-relaxed font-light">
                {product.shortDescription || product.description}
              </p>

              {/* Specs Summary */}
              <div className="mt-4 p-3 bg-neutral-50 border border-neutral-200/80 text-xs space-y-1 text-neutral-700">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Metal</span>
                  <span className="font-medium">{product.metalType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Stone</span>
                  <span className="font-medium">{product.stoneType} ({product.stoneColor || 'Natural'})</span>
                </div>
                {product.weight && (
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Weight</span>
                    <span className="font-medium">{product.weight}</span>
                  </div>
                )}
                {product.size && (
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Dimensions / Size</span>
                    <span className="font-medium">{product.size}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4 pt-4 border-t border-neutral-200">
              {/* Quantity Selector */}
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase tracking-wider text-neutral-600 font-medium">
                  Quantity
                </span>
                <div className="flex items-center border border-neutral-300">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-100"
                  >
                    -
                  </button>
                  <span className="px-3 py-1.5 text-xs font-semibold">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-100"
                  >
                    +
                  </button>
                </div>

                {/* Wishlist button */}
                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-2.5 border transition-colors ml-auto ${
                    isSaved
                      ? 'border-[#D4AF37] bg-[#D4AF37] text-white'
                      : 'border-neutral-300 text-neutral-700 hover:border-black'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Add to Cart & View Details */}
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 bg-[#D4AF37] hover:bg-[#b59226] text-black text-xs font-bold uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Shopping Bag</span>
                </button>

                <button
                  type="button"
                  onClick={handleViewDetails}
                  className="py-3.5 px-5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Full Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Confidence badges */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-500 pt-2">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Certificate Included</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Free Armored Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
