import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CategoriesPage: React.FC = () => {
  const { categories, navigateTo } = useApp();

  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-[#FAF9F5] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.28em] font-semibold text-[#997C24] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Haute Joaillerie Disciplines</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-neutral-900 mb-3">
            All Jewelry Collections
          </h1>
          <p className="text-sm text-neutral-600 font-light leading-relaxed">
            Explore our handcrafted suites by category, from bespoke engagement solitaires to solid gold Miami Cuban chains and Swiss horology.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedCategories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigateTo('shop', { categorySlug: cat.id })}
              className="group relative bg-white border border-neutral-200 overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-500 flex flex-col"
            >
              <div className="relative aspect-4/3 w-full bg-[#181210] overflow-hidden">
                <img
                  src={cat.image || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop'}
                  alt={cat.name}
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop';
                  }}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-[#E5D7B7] text-xs font-semibold px-3 py-1 border border-white/20">
                  {cat.productCount} Pieces Available
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="font-serif text-2xl font-normal text-neutral-900 group-hover:text-[#997C24] transition-colors">
                    {cat.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-500 font-light mt-2 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>

                  {/* Subcategories tags */}
                  {cat.subcategories && cat.subcategories.length > 0 && (
                    <div className="mt-3.5 flex flex-wrap gap-1.5" onClick={(e) => e.stopPropagation()}>
                      {cat.subcategories.slice(0, 6).map((sub) => (
                        <button
                          key={sub.id || sub.name}
                          type="button"
                          onClick={() =>
                            navigateTo('shop', {
                              categorySlug: cat.id,
                              subcategory: sub.name,
                            })
                          }
                          className="text-[10px] px-2 py-0.5 bg-[#FAF9F5] hover:bg-[#F3EEDF] text-neutral-600 hover:text-[#8C701B] border border-neutral-200 hover:border-[#D4AF37] transition-colors rounded-xs cursor-pointer"
                        >
                          {sub.name}
                        </button>
                      ))}
                      {cat.subcategories.length > 6 && (
                        <span className="text-[10px] px-1.5 py-0.5 text-neutral-400 font-medium self-center">
                          +{cat.subcategories.length - 6} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-xs uppercase tracking-widest font-semibold text-neutral-800">
                    Explore Collection
                  </span>
                  <div className="w-8 h-8 rounded-full bg-neutral-100 group-hover:bg-[#D4AF37] group-hover:text-black flex items-center justify-center transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
