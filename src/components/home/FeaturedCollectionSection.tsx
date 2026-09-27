import React, { useState, useMemo } from 'react';
import { Sparkles, ArrowRight, Gem, ShieldCheck, Award } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../ProductCard';

export const FeaturedCollectionSection: React.FC = () => {
  const { products, navigateTo } = useApp();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  // Filter products that are marked as featured
  const featuredProducts = useMemo(() => {
    const tagged = products.filter((p) => p.isFeatured && p.status === 'published');
    // If fewer than 4 are explicitly tagged, backfill with published luxury pieces
    if (tagged.length >= 4) return tagged;
    const published = products.filter((p) => p.status === 'published');
    const existingIds = new Set(tagged.map((p) => p.id));
    const backfill = published.filter((p) => !existingIds.has(p.id));
    return [...tagged, ...backfill];
  }, [products]);

  // Sub-filtering by category tab
  const filteredList = useMemo(() => {
    if (selectedFilter === 'all') return featuredProducts;
    return featuredProducts.filter((p) => {
      const cat = p.categoryId?.toLowerCase() || '';
      const name = p.name?.toLowerCase() || '';
      const sub = p.subcategory?.toLowerCase() || '';

      if (selectedFilter === 'rings') {
        return cat.includes('ring') || name.includes('ring') || sub.includes('ring');
      }
      if (selectedFilter === 'necklaces') {
        return cat.includes('necklace') || name.includes('necklace') || sub.includes('necklace') || name.includes('pendant');
      }
      if (selectedFilter === 'earrings') {
        return cat.includes('earring') || name.includes('earring') || sub.includes('earring');
      }
      if (selectedFilter === 'bracelets') {
        return cat.includes('bracelet') || name.includes('bracelet') || sub.includes('cuff');
      }
      if (selectedFilter === 'bridal') {
        return cat.includes('bridal') || name.includes('bridal') || sub.includes('bridal') || name.includes('solitaire');
      }
      return true;
    });
  }, [featuredProducts, selectedFilter]);

  if (featuredProducts.length === 0) return null;

  const displayList = filteredList.slice(0, 8);

  return (
    <section
      id="featured-collection-section"
      className="py-10 sm:py-12 bg-[#140F0D] text-white border-b border-[#2C211B] relative overflow-hidden"
    >
      {/* Subtle luxury ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-[#D4AF37]/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-5">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-white tracking-tight whitespace-nowrap">
            Featured Showcase
          </h2>

          <button
            type="button"
            id="featured-view-all-btn"
            onClick={() => navigateTo('shop')}
            className="self-start sm:self-center px-4 py-2 bg-transparent hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black border border-[#D4AF37]/60 text-xs font-bold uppercase tracking-[0.2em] transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2.5 mb-5 scrollbar-none border-b border-[#261C17]">
          {[
            { id: 'all', label: 'All' },
            { id: 'rings', label: 'Rings' },
            { id: 'necklaces', label: 'Necklaces' },
            { id: 'earrings', label: 'Earrings' },
            { id: 'bracelets', label: 'Bracelets' },
            { id: 'bridal', label: 'Bridal' },
          ].map((tab) => {
            const isActive = selectedFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedFilter(tab.id)}
                className={`px-3.5 py-1.5 text-xs font-medium tracking-wider transition-all whitespace-nowrap cursor-pointer rounded-xs ${
                  isActive
                    ? 'bg-[#D4AF37] text-neutral-950 font-bold shadow-md'
                    : 'bg-[#1C1613] text-neutral-300 hover:text-white border border-[#2D211B] hover:border-[#4B372D]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Product Cards Grid */}
        {displayList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
            {displayList.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center bg-[#17110F] border border-[#2B201A] p-6 rounded-xs">
            <Gem className="w-8 h-8 text-[#D4AF37] mx-auto mb-3 opacity-60" />
            <p className="text-sm text-neutral-300 font-serif">
              No featured items available in this category.
            </p>
            <button
              type="button"
              onClick={() => setSelectedFilter('all')}
              className="mt-4 px-4 py-2 bg-[#D4AF37] text-neutral-950 text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              View All Items
            </button>
          </div>
        )}

        {/* Value Badges Footer */}
        <div className="mt-8 pt-5 border-t border-[#261C17] grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="flex items-center gap-3 p-3 sm:p-3.5 bg-[#18120F] border border-[#2B1F19]">
            <ShieldCheck className="w-5 h-5 text-[#D4AF37] shrink-0" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white">
                100% Solid Gold &amp; GIA Diamonds
              </p>
              <p className="text-[11px] text-neutral-400">Natural certified stones, never plated.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 sm:p-3.5 bg-[#18120F] border border-[#2B1F19]">
            <Award className="w-5 h-5 text-[#D4AF37] shrink-0" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white">
                Downtown Los Angeles Atelier
              </p>
              <p className="text-[11px] text-neutral-400">720 S Broadway master craftsmanship.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 sm:p-3.5 bg-[#18120F] border border-[#2B1F19]">
            <Sparkles className="w-5 h-5 text-[#D4AF37] shrink-0" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white">
                Insured Express Delivery
              </p>
              <p className="text-[11px] text-neutral-400">Complimentary secured shipping worldwide.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
