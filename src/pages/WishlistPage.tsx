import React from 'react';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';

export const WishlistPage: React.FC = () => {
  const { wishlist, products, clearWishlist, navigateTo } = useApp();

  const savedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="min-h-screen bg-[#FAF9F5] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-neutral-200 pb-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-neutral-900">
              Your Private Wishlist
            </h1>
            <p className="text-xs text-neutral-500 mt-1 uppercase tracking-wider">
              {savedProducts.length} {savedProducts.length === 1 ? 'Curated Piece Saved' : 'Curated Pieces Saved'}
            </p>
          </div>

          {savedProducts.length > 0 && (
            <button
              type="button"
              onClick={clearWishlist}
              className="mt-3 sm:mt-0 text-xs text-neutral-500 hover:text-rose-600 transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear Wishlist
            </button>
          )}
        </div>

        {savedProducts.length === 0 ? (
          <div className="bg-white border border-neutral-200 p-16 text-center space-y-4 max-w-lg mx-auto my-12 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-[#FAF9F5] mx-auto flex items-center justify-center text-neutral-400">
              <Heart className="w-8 h-8 text-[#997C24]" />
            </div>
            <h2 className="font-serif text-2xl font-normal text-neutral-900">
              No Saved Jewelry Yet
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 font-light leading-relaxed">
              Explore our diamond solitaires, necklaces, and Swiss timepieces and click the heart icon to curate your personal wish collection.
            </p>
            <button
              type="button"
              onClick={() => navigateTo('shop')}
              className="mt-4 px-8 py-3.5 bg-[#D4AF37] hover:bg-[#b59226] text-black text-xs font-bold uppercase tracking-[0.2em] transition-colors"
            >
              Explore Creations
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {savedProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
