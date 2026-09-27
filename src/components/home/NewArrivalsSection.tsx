import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Sparkles, ArrowRight, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../ProductCard';

export const NewArrivalsSection: React.FC = () => {
  const { products, navigateTo } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  // Filter products tagged as new arrivals
  const newArrivals = useMemo(() => {
    const tagged = products.filter((p) => p.isNewArrival && p.status === 'published');
    if (tagged.length >= 3) return tagged;
    // Fallback: take latest published products if admin hasn't tagged enough yet
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

  const maxIndex = Math.max(0, newArrivals.length - itemsPerPage);

  // Auto-scrolling / moving carousel timer
  useEffect(() => {
    if (!autoPlay || isPaused || maxIndex <= 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 3800);

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

  if (newArrivals.length === 0) return null;

  return (
    <section
      id="new-arrivals-section"
      className="py-10 sm:py-12 bg-[#FAF8F5] text-neutral-900 border-b border-neutral-200 relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 sm:mb-6">
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal tracking-tight text-neutral-900 whitespace-nowrap">
            New Arrivals
          </h2>

          {/* Controls: Prev/Next & View Shop */}
          <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center">
            {/* Auto-motion state indicator */}
            <button
              type="button"
              onClick={() => setAutoPlay((prev) => !prev)}
              className="p-2 text-neutral-500 hover:text-neutral-900 bg-white border border-neutral-300 hover:border-neutral-400 transition-colors shadow-2xs"
              title={autoPlay ? 'Pause moving slider' : 'Resume moving slider'}
              aria-label={autoPlay ? 'Pause moving slider' : 'Resume moving slider'}
            >
              {autoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-[#997C24]" />}
            </button>

            {/* Prev Button */}
            <button
              type="button"
              onClick={handlePrev}
              disabled={newArrivals.length <= itemsPerPage}
              className="p-2 text-neutral-700 hover:text-neutral-950 bg-white hover:bg-neutral-100 border border-neutral-300 transition-all shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed"
              title="Previous New Arrival"
              aria-label="Previous New Arrival"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Next Button */}
            <button
              type="button"
              onClick={handleNext}
              disabled={newArrivals.length <= itemsPerPage}
              className="p-2 text-neutral-700 hover:text-neutral-950 bg-white hover:bg-neutral-100 border border-neutral-300 transition-all shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed"
              title="Next New Arrival"
              aria-label="Next New Arrival"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* View All Button */}
            <button
              type="button"
              onClick={() => navigateTo('shop')}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 hover:bg-[#997C24] text-white text-xs uppercase tracking-widest font-semibold transition-colors shadow-2xs cursor-pointer ml-1"
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
            {newArrivals.map((product) => (
              <div
                key={`new-${product.id}`}
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
          <div className="flex items-center justify-between mt-5 pt-3 border-t border-neutral-200/80">
            <div className="flex items-center gap-1.5">
              {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                <button
                  key={`dot-${idx}`}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 transition-all duration-300 rounded-full ${
                    currentIndex === idx ? 'w-8 bg-[#997C24]' : 'w-2 bg-neutral-300 hover:bg-neutral-400'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
              <span className="text-neutral-900 font-bold">{currentIndex + 1}</span>
              <span>/</span>
              <span>{maxIndex + 1}</span>
              <span className="hidden sm:inline text-neutral-400 ml-1">({newArrivals.length} new items)</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
