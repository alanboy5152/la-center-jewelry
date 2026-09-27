import React from 'react';
import { Heart, Eye, ShoppingBag, Star, Sparkles, Play } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    navigateTo,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setQuickViewProduct,
  } = useApp();

  const isSaved = isInWishlist(product.id);
  const hasDiscount = product.salePrice && product.salePrice < product.price;

  return (
    <div className="group relative bg-white border border-neutral-200/90 rounded-none overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full w-full">
      {/* Image Container */}
      <div className="relative aspect-square w-full bg-[#F5F4F0] overflow-hidden">
        {/* Main Image */}
        <img
          src={product.images[0] || product.thumbnail}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-700 ease-out"
        />

        {/* Secondary image on hover if available */}
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out"
          />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none z-10">
          {product.isNewArrival && (
            <span className="bg-[#D4AF37] text-neutral-950 text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 shadow-xs flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-neutral-950" /> New Arrival
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-[#8C2D19] text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 shadow-xs flex items-center gap-1">
              <Star className="w-2.5 h-2.5 fill-current text-[#FCD34D]" /> Best Seller
            </span>
          )}
          {hasDiscount && (
            <span className="bg-[#997C24] text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 shadow-xs">
              Special Reserve
            </span>
          )}
          {product.isFeatured && !product.isNewArrival && (
            <span className="bg-neutral-900 text-[#E5D7B7] text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 shadow-xs flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-[#D4AF37]" /> Signature
            </span>
          )}
          {product.videos && product.videos.length > 0 && product.videos[0]?.url && (
            <span className="bg-black/85 backdrop-blur-xs text-[#E5D7B7] border border-[#D4AF37]/50 text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 shadow-xs flex items-center gap-1">
              <Play className="w-2.5 h-2.5 fill-current text-[#D4AF37]" /> Video
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-colors shadow-xs ${
            isSaved
              ? 'bg-[#D4AF37] text-white'
              : 'bg-white/90 text-neutral-700 hover:text-black hover:bg-white'
          }`}
          aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View & Add to Cart Hover Actions Bar */}
        <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="flex-1 py-2.5 bg-white hover:bg-neutral-100 text-neutral-900 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product, 1);
            }}
            className="px-3.5 py-2.5 bg-[#D4AF37] hover:bg-[#b59226] text-black text-xs font-bold shadow-md transition-colors"
            aria-label="Add to bag"
            title="Add to shopping bag"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-[#8C827A] mb-0.5">
            <span className="truncate max-w-[170px]" title={product.subcategory || product.categoryName}>
              {product.subcategory || product.categoryName}
            </span>
            <span className="font-mono text-[10px] shrink-0">{product.sku}</span>
          </div>

          <h3
            onClick={() => navigateTo('product-details', { productId: product.id })}
            className="font-serif text-sm sm:text-base font-normal text-neutral-900 hover:text-[#997C24] transition-colors cursor-pointer line-clamp-2 leading-snug min-h-[2.4rem] sm:min-h-[2.75rem] flex items-start"
            title={product.name}
          >
            {product.name}
          </h3>

          <p className="text-xs text-neutral-500 line-clamp-1 mt-0.5 font-light min-h-[1.1rem]">
            {product.metalType} • {product.stoneType}
          </p>
        </div>

        <div className="pt-2 mt-auto border-t border-neutral-100 flex items-center justify-between shrink-0">
          {/* Price */}
          <div className="flex items-baseline gap-1.5">
            {hasDiscount ? (
              <>
                <span className="text-sm sm:text-base font-semibold text-neutral-900 font-serif">
                  ${product.salePrice?.toLocaleString()}
                </span>
                <span className="text-xs text-neutral-400 line-through">
                  ${product.price.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-sm sm:text-base font-semibold text-neutral-900 font-serif">
                ${product.price.toLocaleString()}
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 text-xs text-neutral-600">
            <Star className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
            <span className="font-medium text-[11px] sm:text-xs">{product.rating.toFixed(1)}</span>
            <span className="text-[10px] text-neutral-400">({product.reviewsCount})</span>
          </div>
        </div>
      </div>
    </div>
  );
};
