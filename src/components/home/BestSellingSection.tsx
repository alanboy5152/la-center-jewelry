import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Star, ArrowRight, ChevronLeft, ChevronRight, Play, Pause, Flame } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../ProductCard';

export const BestSellingSection: React.FC = () => {
  const { products, navigateTo } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  // Filter products tagged as best sellers
  const bestSellers = useMemo(() => {
    const tagged = products.filter((p) => p.isBestSeller && p.status === 'published');
    if (tagged.length >= 3) return tagged;
    // Fallback: take featured or highest rated products if not enough tagged
    const published = products.filter((p) => p.status === 'published');
    return published.slice(0, 8);
  }, [products]);

  // Responsive items per page calculation
  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2);
      } else if (window.innerWidth < 1280) {
        setItemsPerPage(3);
      } else {
        setItemsPerPage(4);
      }
    };

    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  const maxIndex = Math.max(0, bestSellers.length - itemsPerPage);

  // Auto-scrolling / moving carousel timer
  useEffect(() => {
    if (!autoPlay || isPaused || maxIndex <= 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4200);

    return () => clearInterval(timer);
  }, [autoPlay, isPaused, maxIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
  };

  if (bestSellers.length === 0) return null;

  return (
    <section
      id="best-selling-section"
      className="py-10 sm:py-12 bg-[#120E0C] text-neutral-100 border-b border-[#2C201A] relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 sm:mb-6">
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal tracking-tight text-white whitespace-nowrap">
            Best Selling
          </h2>

          {/* Controls: Prev/Next & View Shop */}
          <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center">
            {/* Auto-motion state toggle */}
            <button
              type="button"
              onClick={() => setAutoPlay((prev) => !prev)}
              className="p-2 text-neutral-400 hover:text-white bg-[#1A1411] border border-[#38281F] hover:border-[#D4AF37] transition-colors shadow-2xs"
              title={autoPlay ? 'Pause moving slider' : 'Resume moving slider'}
              aria-label={autoPlay ? 'Pause moving slider' : 'Resume moving slider'}
            >
              {autoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-[#D4AF37]" />}
            </button>

            {/* Prev Button */}
            <button
              type="button"
              onClick={handlePrev}
              disabled={bestSellers.length <= itemsPerPage}
              className="p-2 text-neutral-300 hover:text-white bg-[#1A1411] hover:bg-[#251D18] border border-[#38281F] hover:border-[#D4AF37]/60 transition-all shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed"
              title="Previous Best Seller"
              aria-label="Previous Best Seller"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Next Button */}
            <button
              type="button"
              onClick={handleNext}
              disabled={bestSellers.length <= itemsPerPage}
              className="p-2 text-neutral-300 hover:text-white bg-[#1A1411] hover:bg-[#251D18] border border-[#38281F] hover:border-[#D4AF37]/60 transition-all shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed"
              title="Next Best Seller"
              aria-label="Next Best Seller"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* View All Button */}
            <button
              type="button"
              onClick={() => navigateTo('shop')}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-[#D4AF37] hover:bg-[#b89528] text-neutral-950 text-xs uppercase tracking-widest font-bold transition-colors shadow-2xs cursor-pointer ml-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Carousel Slider Track */}
        <div
          ref={containerRef}
          className="relative overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`,
            }}
          >
            {bestSellers.map((product) => (
              <div
                key={`best-${product.id}`}
                className="shrink-0 px-1.5 sm:px-2.5 flex flex-col"
                style={{ width: `${100 / itemsPerPage}%` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Progress and Pagination Dots */}
        {maxIndex > 0 && (
          <div className="flex items-center justify-between mt-5 pt-3 border-t border-[#261B16]">
            <div className="flex items-center gap-1.5">
              {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                <button
                  key={`best-dot-${idx}`}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 transition-all duration-300 rounded-full ${
                    currentIndex === idx ? 'w-8 bg-[#D4AF37]' : 'w-2 bg-neutral-700 hover:bg-neutral-500'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs text-neutral-400 font-medium">
              <span className="text-[#D4AF37] font-bold">{currentIndex + 1}</span>
              <span>/</span>
              <span>{maxIndex + 1}</span>
              <span className="hidden sm:inline text-neutral-500 ml-1">({bestSellers.length} best sellers)</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
