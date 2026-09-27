import React from 'react';
import { Search, Sparkles, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';

export const SearchResultsPage: React.FC = () => {
  const { searchQuery, setSearchQuery, products, navigateTo } = useApp();

  const query = searchQuery.toLowerCase().trim();

  const results = products.filter((p) => {
    if (p.status !== 'published') return false;
    if (!query) return true;
    return (
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.categoryName.toLowerCase().includes(query) ||
      p.metalType.toLowerCase().includes(query) ||
      p.stoneType.toLowerCase().includes(query) ||
      p.sku.toLowerCase().includes(query) ||
      p.tags?.some((t) => t.toLowerCase().includes(query))
    );
  });

  const suggestions = ['Diamond', 'Platinum', 'Cuban Chain', 'Tennis Bracelet', 'Rolex', 'Sapphire'];

  return (
    <div className="min-h-screen bg-[#FAF9F5] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.28em] font-semibold text-[#997C24] mb-2">
            <Search className="w-3.5 h-3.5" />
            <span>Atelier Inventory Query</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-neutral-900 mb-4">
            Search Results for &quot;{searchQuery}&quot;
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 font-light">
            Found <strong className="text-neutral-900">{results.length}</strong> matching creations in our salon catalog.
          </p>

          {/* Search input field to refine */}
          <div className="mt-6 relative max-w-md mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by diamond cut, gold karat, ring or SKU..."
              className="w-full bg-white border border-neutral-300 px-4 py-3 text-xs focus:outline-none focus:border-[#D4AF37] shadow-xs"
            />
          </div>

          {/* Quick suggestions */}
          <div className="flex items-center justify-center flex-wrap gap-2 mt-4">
            <span className="text-[11px] text-neutral-400">Suggestions:</span>
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => setSearchQuery(s)}
                className="text-[11px] px-2.5 py-1 bg-white border border-neutral-200 text-neutral-600 hover:text-black hover:border-neutral-400 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Results Grid */}
        {results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-neutral-200 p-16 text-center space-y-4 max-w-lg mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-full bg-[#FAF9F5] mx-auto flex items-center justify-center text-neutral-400">
              <Sparkles className="w-8 h-8 text-[#997C24]" />
            </div>
            <h3 className="font-serif text-2xl font-normal text-neutral-900">
              No Pieces Matching Your Query
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed font-light">
              We could not find any creations matching &quot;{searchQuery}&quot;. Please explore our curated collections or speak with our Broadway concierge for custom sourcing.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => navigateTo('shop')}
                className="px-6 py-3 bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-widest"
              >
                View All Jewelry
              </button>
              <button
                type="button"
                onClick={() => navigateTo('contact')}
                className="px-6 py-3 border border-neutral-300 text-neutral-800 text-xs font-semibold uppercase tracking-widest"
              >
                Custom Request
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
