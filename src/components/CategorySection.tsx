import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CategorySection: React.FC = () => {
  const { categories, navigateTo } = useApp();

  // Sort categories by order
  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

  return (
    <section className="py-10 sm:py-12 bg-[#FAF9F5] border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 sm:mb-6">
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal tracking-tight text-neutral-900 whitespace-nowrap">
            Shop by Category
          </h2>
          <button
            type="button"
            onClick={() => navigateTo('categories')}
            className="text-xs uppercase tracking-[0.2em] font-semibold text-neutral-800 hover:text-[#997C24] transition-colors flex items-center gap-2 cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4.5">
          {sortedCategories.slice(0, 8).map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigateTo('shop', { categorySlug: cat.id })}
              className="group relative bg-white border border-neutral-200/80 overflow-hidden cursor-pointer shadow-xs hover:shadow-xl transition-all duration-500"
            >
              {/* Category Image */}
              <div className="relative aspect-square w-full overflow-hidden bg-[#181210]">
                <img
                  src={cat.image || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop'}
                  alt={cat.name}
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop';
                  }}
                  className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                {/* Badge count */}
                {cat.productCount && (
                  <span className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-md text-[#E5D7B7] text-[10px] uppercase font-semibold px-2 py-0.5 tracking-wider border border-white/10">
                    {cat.productCount} Pieces
                  </span>
                )}

                {/* Overlay Text */}
                <div className="absolute bottom-0 inset-x-0 p-3.5 sm:p-4 text-white">
                  <h3 className="font-serif text-lg sm:text-xl font-normal tracking-wide text-white group-hover:text-[#D4AF37] transition-colors drop-shadow-sm">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-neutral-200 line-clamp-1 mt-0.5 font-light opacity-90 group-hover:opacity-100 transition-opacity">
                    {cat.description}
                  </p>
                  <div className="mt-2 flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-[#D4AF37] font-semibold opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
