import React, { useState, useMemo } from 'react';
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';

export const ShopPage: React.FC = () => {
  const {
    products,
    categories,
    selectedCategorySlug,
    selectedSubcategory: globalSubcategory,
    selectedMetal: globalMetal,
    selectedStone: globalStone,
    setSelectedMetal: setGlobalMetal,
    setSelectedStone: setGlobalStone,
    navigateTo,
  } = useApp();

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>(selectedCategorySlug || 'all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(globalSubcategory || 'all');
  const [selectedMetal, setSelectedMetal] = useState<string>(globalMetal || 'all');
  const [selectedStone, setSelectedStone] = useState<string>(globalStone || 'all');
  const [maxPrice, setMaxPrice] = useState<number>(40000);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync if selectedCategorySlug or globalSubcategory changes from outside
  React.useEffect(() => {
    if (selectedCategorySlug) {
      setSelectedCategory(selectedCategorySlug);
    }
  }, [selectedCategorySlug]);

  React.useEffect(() => {
    if (globalSubcategory) {
      setSelectedSubcategory(globalSubcategory);
    } else if (globalSubcategory === null) {
      setSelectedSubcategory('all');
    }
  }, [globalSubcategory]);

  React.useEffect(() => {
    if (globalMetal) {
      setSelectedMetal(globalMetal);
    } else if (globalMetal === null) {
      setSelectedMetal('all');
    }
  }, [globalMetal]);

  React.useEffect(() => {
    if (globalStone) {
      setSelectedStone(globalStone);
    } else if (globalStone === null) {
      setSelectedStone('all');
    }
  }, [globalStone]);

  const metalsList = [
    'Gold',
    'Platinum',
    'Silver',
    '18k Yellow Gold',
    '18k White Gold',
    '18k Rose Gold',
    '14k Yellow Gold',
    'Sterling Silver',
  ];

  const stonesList = ['Diamond', 'Pearl', 'Sapphire', 'Emerald', 'None'];

  // Current category object & its subcategories
  const currentCategoryObj = useMemo(() => {
    if (selectedCategory === 'all') return null;
    return categories.find((c) => c.id === selectedCategory || c.slug === selectedCategory) || null;
  }, [categories, selectedCategory]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (p.status !== 'published') return false;

        // Category
        if (selectedCategory !== 'all') {
          const catMatch = categories.find((c) => c.id === selectedCategory || c.slug === selectedCategory);
          const targetId = catMatch ? catMatch.id : selectedCategory;
          if (p.categoryId !== targetId && p.categoryId !== selectedCategory) {
            return false;
          }
        }

        // Subcategory
        if (selectedSubcategory !== 'all') {
          if (!p.subcategory || p.subcategory.trim().toLowerCase() !== selectedSubcategory.trim().toLowerCase()) {
            return false;
          }
        }

        // Metal
        if (selectedMetal !== 'all') {
          const m = selectedMetal.toLowerCase();
          const matchesMetal =
            p.metalType.toLowerCase().includes(m) ||
            p.material.toLowerCase().includes(m) ||
            p.tags.some((t) => t.toLowerCase().includes(m));
          if (!matchesMetal) {
            return false;
          }
        }

        // Stone
        if (selectedStone !== 'all') {
          const s = selectedStone.toLowerCase();
          const matchesStone =
            p.stoneType.toLowerCase().includes(s) ||
            p.material.toLowerCase().includes(s) ||
            p.tags.some((t) => t.toLowerCase().includes(s));
          if (!matchesStone) {
            return false;
          }
        }

        // Price
        const effectivePrice = p.salePrice || p.price;
        if (effectivePrice > maxPrice) {
          return false;
        }

        // Stock
        if (onlyInStock && p.stockQuantity <= 0) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = a.salePrice || a.price;
        const priceB = b.salePrice || b.price;

        if (sortBy === 'price-low') return priceA - priceB;
        if (sortBy === 'price-high') return priceB - priceA;
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'best-selling') return b.reviewsCount - a.reviewsCount;
        // Default 'featured'
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, selectedCategory, selectedSubcategory, categories, selectedMetal, selectedStone, maxPrice, onlyInStock, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedSubcategory('all');
    setSelectedMetal('all');
    setSelectedStone('all');
    if (setGlobalMetal) setGlobalMetal(null);
    if (setGlobalStone) setGlobalStone(null);
    setMaxPrice(40000);
    setOnlyInStock(false);
    setSortBy('featured');
  };

  const activeFilterCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    (selectedSubcategory !== 'all' ? 1 : 0) +
    (selectedMetal !== 'all' ? 1 : 0) +
    (selectedStone !== 'all' ? 1 : 0) +
    (maxPrice < 40000 ? 1 : 0) +
    (onlyInStock ? 1 : 0);

  return (
    <div className="min-h-screen bg-[#FAF9F5] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Header */}
        <div className="mb-6">
          <div className="text-xs uppercase tracking-widest text-[#8C827A] flex flex-wrap items-center gap-2 mb-2">
            <button onClick={() => navigateTo('home')} className="hover:text-black cursor-pointer">
              Home
            </button>
            <span>/</span>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedSubcategory('all');
              }}
              className="text-neutral-900 font-semibold hover:text-[#997C24] cursor-pointer"
            >
              Fine Jewelry Shop
            </button>
            {selectedCategory !== 'all' && (
              <>
                <span>/</span>
                <button
                  onClick={() => setSelectedSubcategory('all')}
                  className={`hover:text-black cursor-pointer ${
                    selectedSubcategory === 'all' ? 'text-[#997C24] font-semibold' : 'text-neutral-600'
                  }`}
                >
                  {currentCategoryObj?.name || selectedCategory}
                </button>
              </>
            )}
            {selectedSubcategory !== 'all' && (
              <>
                <span>/</span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#F8F5EC] border border-[#E4D7BA] text-[#8C701B] font-semibold rounded-xs">
                  <span>{selectedSubcategory}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedSubcategory('all')}
                    className="text-[#8C701B] hover:text-black"
                    title="Remove subcategory filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              </>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-neutral-900">
                {selectedSubcategory !== 'all'
                  ? selectedSubcategory
                  : currentCategoryObj
                  ? currentCategoryObj.name
                  : 'The Atelier Catalog'}
              </h1>
              <p className="text-sm text-neutral-500 font-light mt-1 max-w-2xl">
                {currentCategoryObj?.description ||
                  'Browse handcrafted gold, certified diamond jewelry, and luxury watches.'}
              </p>
            </div>

            {/* Clear subcategory shortcut if active */}
            {selectedSubcategory !== 'all' && (
              <button
                type="button"
                onClick={() => setSelectedSubcategory('all')}
                className="text-xs uppercase tracking-wider text-[#997C24] font-semibold hover:underline flex items-center gap-1 self-start sm:self-auto cursor-pointer"
              >
                <span>View All {currentCategoryObj?.name || 'Category'}</span>
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Interactive Sub-Collections Horizontal Pills Strip (when a category with subcategories is selected) */}
          {currentCategoryObj && currentCategoryObj.subcategories && currentCategoryObj.subcategories.length > 0 && (
            <div className="mt-6 pt-4 border-t border-neutral-200">
              <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-400 mb-2.5">
                Explore {currentCategoryObj.name} Sub-Collections:
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                <button
                  type="button"
                  onClick={() => setSelectedSubcategory('all')}
                  className={`px-3 py-1.5 text-xs rounded-full whitespace-nowrap transition-all cursor-pointer ${
                    selectedSubcategory === 'all'
                      ? 'bg-neutral-900 text-white font-medium shadow-xs'
                      : 'bg-white border border-neutral-200 text-neutral-700 hover:border-[#D4AF37] hover:text-black'
                  }`}
                >
                  All {currentCategoryObj.name}
                </button>

                {currentCategoryObj.subcategories.map((sub) => {
                  const isSelected = selectedSubcategory.toLowerCase() === sub.name.toLowerCase();
                  return (
                    <button
                      key={sub.id || sub.name}
                      type="button"
                      onClick={() => setSelectedSubcategory(sub.name)}
                      className={`px-3 py-1.5 text-xs rounded-full whitespace-nowrap transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#181818] text-[#E0C068] font-semibold shadow-xs border border-[#D4AF37]'
                          : 'bg-white border border-neutral-200 text-neutral-700 hover:border-[#D4AF37] hover:text-black'
                      }`}
                    >
                      {sub.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Precious Materials & Gemstones Filter Strip */}
          <div className="mt-4 pt-4 border-t border-neutral-200">
            <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-400 mb-2">
              Filter by Material & Gemstones:
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                type="button"
                onClick={() => {
                  setSelectedMetal('all');
                  setSelectedStone('all');
                  if (setGlobalMetal) setGlobalMetal(null);
                  if (setGlobalStone) setGlobalStone(null);
                }}
                className={`px-3.5 py-1.5 text-xs rounded-full whitespace-nowrap transition-all cursor-pointer ${
                  selectedMetal === 'all' && selectedStone === 'all'
                    ? 'bg-neutral-900 text-white font-medium shadow-xs'
                    : 'bg-white border border-neutral-200 text-neutral-700 hover:border-[#D4AF37] hover:text-black'
                }`}
              >
                All Materials
              </button>

              {[
                { label: 'Diamonds', stone: 'Diamond', metal: null },
                { label: 'Pearls', stone: 'Pearl', metal: null },
                { label: 'Gold', stone: null, metal: 'Gold' },
                { label: 'Platinum', stone: null, metal: 'Platinum' },
                { label: 'Silver', stone: null, metal: 'Silver' },
              ].map((item) => {
                const isActive =
                  (item.stone && selectedStone.toLowerCase().includes(item.stone.toLowerCase())) ||
                  (item.metal && selectedMetal.toLowerCase().includes(item.metal.toLowerCase()));

                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      if (item.stone) {
                        setSelectedStone(item.stone);
                        setSelectedMetal('all');
                        if (setGlobalStone) setGlobalStone(item.stone);
                        if (setGlobalMetal) setGlobalMetal(null);
                      } else if (item.metal) {
                        setSelectedMetal(item.metal);
                        setSelectedStone('all');
                        if (setGlobalMetal) setGlobalMetal(item.metal);
                        if (setGlobalStone) setGlobalStone(null);
                      }
                    }}
                    className={`px-3.5 py-1.5 text-xs rounded-full whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-[#181818] text-[#E0C068] font-semibold shadow-xs border border-[#D4AF37]'
                        : 'bg-white border border-neutral-200 text-neutral-700 hover:border-[#D4AF37] hover:text-black'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#E0C068]"></span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Top Control Bar (Mobile toggle & Sorting) */}
        <div className="bg-white border border-neutral-200 p-4 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Mobile Filter Button */}
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden px-4 py-2 bg-neutral-900 text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
            </button>

            <span className="text-xs text-neutral-500">
              Showing <strong className="text-neutral-900">{filteredProducts.length}</strong> creations
            </span>
          </div>

          {/* Sorting Dropdown */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort-select" className="text-xs uppercase tracking-wider text-neutral-500 font-medium">
              Sort By:
            </label>
            <div className="relative">
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-[#FAF9F5] border border-neutral-200 text-xs px-3.5 py-2 pr-8 font-medium text-neutral-800 focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="featured">Featured Curations</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="best-selling">Best Selling</option>
                <option value="rating">Highest Rated</option>
              </select>
              <ChevronDown className="w-4 h-4 text-neutral-500 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block space-y-6">
            <div className="bg-white border border-neutral-200 p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
                <span className="font-serif text-lg font-medium text-neutral-900">
                  Refine Collection
                </span>
                {activeFilterCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className="text-xs text-[#997C24] hover:underline flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset
                  </button>
                )}
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-xs uppercase tracking-widest font-semibold text-neutral-900 mb-3">
                  Categories
                </h4>
                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedSubcategory('all');
                    }}
                    className={`block w-full text-left text-xs py-1.5 px-2 transition-colors cursor-pointer ${
                      selectedCategory === 'all'
                        ? 'bg-neutral-900 text-white font-medium'
                        : 'text-neutral-600 hover:text-black hover:bg-neutral-50'
                    }`}
                  >
                    All Jewelry ({products.length})
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setSelectedSubcategory('all');
                      }}
                      className={`block w-full text-left text-xs py-1.5 px-2 transition-colors cursor-pointer ${
                        selectedCategory === cat.id
                          ? 'bg-neutral-900 text-white font-medium'
                          : 'text-neutral-600 hover:text-black hover:bg-neutral-50'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subcategories (when a category with subcategories is selected) */}
              {currentCategoryObj && currentCategoryObj.subcategories && currentCategoryObj.subcategories.length > 0 && (
                <div className="pt-4 border-t border-neutral-100">
                  <div className="flex items-center justify-between mb-2.5">
                    <h4 className="text-xs uppercase tracking-widest font-semibold text-neutral-900">
                      Sub-Collections
                    </h4>
                    {selectedSubcategory !== 'all' && (
                      <button
                        type="button"
                        onClick={() => setSelectedSubcategory('all')}
                        className="text-[10px] text-[#997C24] hover:underline cursor-pointer"
                      >
                        Show All
                      </button>
                    )}
                  </div>
                  <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                    <button
                      type="button"
                      onClick={() => setSelectedSubcategory('all')}
                      className={`block w-full text-left text-xs py-1 px-2 rounded-xs transition-colors cursor-pointer ${
                        selectedSubcategory === 'all'
                          ? 'bg-[#F5F2EA] text-[#8C701B] font-semibold'
                          : 'text-neutral-600 hover:text-black hover:bg-neutral-50'
                      }`}
                    >
                      All {currentCategoryObj.name}
                    </button>
                    {currentCategoryObj.subcategories.map((sub) => {
                      const isSelected = selectedSubcategory.toLowerCase() === sub.name.toLowerCase();
                      return (
                        <button
                          key={sub.id || sub.name}
                          type="button"
                          onClick={() => setSelectedSubcategory(sub.name)}
                          className={`block w-full text-left text-xs py-1 px-2 rounded-xs transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-[#F5F2EA] text-[#8C701B] font-semibold border-l-2 border-[#D4AF37]'
                              : 'text-neutral-600 hover:text-black hover:bg-neutral-50'
                          }`}
                        >
                          {sub.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Price Range */}
              <div className="pt-4 border-t border-neutral-100">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-xs uppercase tracking-widest font-semibold text-neutral-900">
                    Max Price
                  </h4>
                  <span className="text-xs font-serif font-bold text-[#997C24]">
                    ${maxPrice.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="2000"
                  max="40000"
                  step="1000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#D4AF37] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                  <span>$2,000</span>
                  <span>$40,000+</span>
                </div>
              </div>

              {/* Metal Type */}
              <div className="pt-4 border-t border-neutral-100">
                <h4 className="text-xs uppercase tracking-widest font-semibold text-neutral-900 mb-2.5">
                  Precious Metal
                </h4>
                <div className="space-y-1">
                  <label className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer">
                    <input
                      type="radio"
                      name="metal"
                      checked={selectedMetal === 'all'}
                      onChange={() => setSelectedMetal('all')}
                      className="accent-[#D4AF37]"
                    />
                    <span>All Metals</span>
                  </label>
                  {metalsList.map((metal) => (
                    <label
                      key={metal}
                      className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="metal"
                        checked={selectedMetal === metal}
                        onChange={() => setSelectedMetal(metal)}
                        className="accent-[#D4AF37]"
                      />
                      <span>{metal}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Stone Type */}
              <div className="pt-4 border-t border-neutral-100">
                <h4 className="text-xs uppercase tracking-widest font-semibold text-neutral-900 mb-2.5">
                  Gemstone
                </h4>
                <div className="space-y-1">
                  <label className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer">
                    <input
                      type="radio"
                      name="stone"
                      checked={selectedStone === 'all'}
                      onChange={() => setSelectedStone('all')}
                      className="accent-[#D4AF37]"
                    />
                    <span>All Gemstones</span>
                  </label>
                  {stonesList.map((stone) => (
                    <label
                      key={stone}
                      className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="stone"
                        checked={selectedStone === stone}
                        onChange={() => setSelectedStone(stone)}
                        className="accent-[#D4AF37]"
                      />
                      <span>{stone}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="pt-4 border-t border-neutral-100">
                <label className="flex items-center gap-2 text-xs text-neutral-800 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={onlyInStock}
                    onChange={(e) => setOnlyInStock(e.target.checked)}
                    className="accent-[#D4AF37]"
                  />
                  <span>Show In-Stock Only</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="lg:col-span-3">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-neutral-200 p-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#FAF9F5] mx-auto flex items-center justify-center text-neutral-400">
                  <Sparkles className="w-6 h-6 text-[#997C24]" />
                </div>
                <h3 className="font-serif text-xl font-medium text-neutral-900">
                  No matching jewelry pieces
                </h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  Try adjusting your price range or filter selections to view available salon creations.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-6 py-2.5 bg-neutral-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#D4AF37] hover:text-black transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-2xl z-10 p-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
              <span className="font-serif text-lg font-semibold text-neutral-900">
                Filter Jewelry
              </span>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 text-neutral-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="py-6 space-y-6">
              {/* Category */}
              <div>
                <h4 className="text-xs uppercase tracking-widest font-semibold text-neutral-900 mb-2">
                  Category
                </h4>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedSubcategory('all');
                  }}
                  className="w-full bg-[#FAF9F5] border border-neutral-200 text-xs p-2"
                >
                  <option value="all">All Jewelry</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sub-Category (Mobile) */}
              {currentCategoryObj && currentCategoryObj.subcategories && currentCategoryObj.subcategories.length > 0 && (
                <div>
                  <h4 className="text-xs uppercase tracking-widest font-semibold text-neutral-900 mb-2">
                    Sub-Category
                  </h4>
                  <select
                    value={selectedSubcategory}
                    onChange={(e) => setSelectedSubcategory(e.target.value)}
                    className="w-full bg-[#FAF9F5] border border-[#D4AF37] text-xs p-2 text-neutral-900 font-medium"
                  >
                    <option value="all">All {currentCategoryObj.name} Sub-Categories</option>
                    {currentCategoryObj.subcategories.map((sub) => (
                      <option key={sub.id || sub.name} value={sub.name}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Price */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Max Price:</span>
                  <span className="font-bold text-[#997C24]">${maxPrice.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="2000"
                  max="40000"
                  step="1000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#D4AF37]"
                />
              </div>

              {/* Metal */}
              <div>
                <h4 className="text-xs uppercase tracking-widest font-semibold text-neutral-900 mb-2">
                  Metal
                </h4>
                <select
                  value={selectedMetal}
                  onChange={(e) => setSelectedMetal(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-neutral-200 text-xs p-2"
                >
                  <option value="all">All Metals</option>
                  {metalsList.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stone */}
              <div>
                <h4 className="text-xs uppercase tracking-widest font-semibold text-neutral-900 mb-2">
                  Gemstone
                </h4>
                <select
                  value={selectedStone}
                  onChange={(e) => setSelectedStone(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-neutral-200 text-xs p-2"
                >
                  <option value="all">All Gemstones</option>
                  {stonesList.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* In stock */}
              <label className="flex items-center gap-2 text-xs font-medium">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="accent-[#D4AF37]"
                />
                <span>In-Stock Only</span>
              </label>

              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-3 bg-[#D4AF37] text-black font-bold uppercase tracking-wider text-xs shadow-md"
              >
                Apply Filters ({filteredProducts.length} Results)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
