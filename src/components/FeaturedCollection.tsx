import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductCard } from './ProductCard';

export const FeaturedCollection: React.FC = () => {
  const { products, navigateTo } = useApp();

  // Filter only featured products
  const featuredProducts = products.filter((p) => p.isFeatured && p.status === 'published');

  const filterTabs = [
    { label: 'Diamonds', id: 'diamonds', type: 'stone' as const, value: 'Diamond' },
    { label: 'Pearls', id: 'pearls', type: 'stone' as const, value: 'Pearl' },
    { label: 'Gold', id: 'gold', type: 'metal' as const, value: 'Gold' },
    { label: 'Platinum', id: 'platinum', type: 'metal' as const, value: 'Platinum' },
    { label: 'Silver', id: 'silver', type: 'metal' as const, value: 'Silver' },
  ];

  const handleTabClick = (tab: (typeof filterTabs)[number]) => {
    if (tab.type === 'stone') {
      navigateTo('shop', { stone: tab.value, metal: null, categorySlug: undefined, subcategory: null });
    } else {
      navigateTo('shop', { metal: tab.value, stone: null, categorySlug: undefined, subcategory: null });
    }
  };

  return (
    <section className="py-20 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.28em] font-semibold text-[#997C24] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hand-Selected Masterpieces</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-neutral-900 mb-4">
            The Featured Collection
          </h2>
          <p className="text-sm sm:text-base text-neutral-500 font-light max-w-lg mx-auto leading-relaxed">
            Exquisite jewelry pieces created with uncompromised precision, timeless geometry, and certified gemstones.
          </p>
        </div>

        {/* Filter Tabs - Diamonds, Pearls, Gold, Platinum, Silver */}
        <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3 mb-12">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabClick(tab)}
              className="group px-5 py-2.5 text-xs uppercase tracking-widest font-semibold bg-neutral-100 hover:bg-neutral-900 text-neutral-800 hover:text-white transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-2xs hover:shadow-xs"
              title={`View ${tab.label} jewelry in shop`}
            >
              <span>{tab.label}</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-[#D4AF37]" />
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {featuredProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-neutral-500">
            <p className="text-sm">No featured items currently in this selection.</p>
            <button
              onClick={() => navigateTo('shop')}
              className="mt-3 text-xs uppercase tracking-wider text-[#997C24] underline"
            >
              View All Pieces
            </button>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-14 text-center">
          <button
            type="button"
            onClick={() => navigateTo('shop')}
            className="inline-flex items-center gap-3 px-8 py-4 bg-neutral-900 hover:bg-[#D4AF37] hover:text-black text-white text-xs font-bold uppercase tracking-[0.22em] transition-all duration-300"
          >
            <span>Explore Complete Vault</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
