import React from 'react';
import { Sparkles } from 'lucide-react';

const TICKER_ITEMS = [
  { label: 'Gold', type: 'gem' },
  { label: 'Silver', type: 'gem' },
  { label: 'Diamond', type: 'gem' },
  { label: 'Pearl', type: 'gem' },
  { label: 'Emerald', type: 'gem' },
  { label: 'Platinum', type: 'gem' },
  { label: 'Sapphire', type: 'gem' },
  { label: '30% to 50% Off', type: 'promo' },
  { label: 'Free Shipping', type: 'highlight' },
];

export const LuxuryTickerRibbon: React.FC = () => {
  // Repeating the set 4 times ensures seamless infinity loop across all screens
  const repeatedBatches = [0, 1, 2, 3];

  return (
    <div
      id="storefront-luxury-ticker"
      className="relative w-full overflow-hidden bg-[#18120E] border-y border-[#38281F] select-none pointer-events-none py-2.5 sm:py-3 z-20 shadow-sm"
      aria-hidden="true"
    >
      {/* Subtle edge fades for luxury aesthetic */}
      <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-[#18120E] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-[#18120E] to-transparent z-10 pointer-events-none" />

      {/* Infinite Scrolling Track */}
      <div className="flex w-max items-center animate-luxury-marquee">
        {repeatedBatches.map((batchIdx) => (
          <div key={`batch-${batchIdx}`} className="flex items-center shrink-0">
            {TICKER_ITEMS.map((item, idx) => (
              <div key={`item-${batchIdx}-${idx}`} className="flex items-center">
                {/* Text Token */}
                <span
                  className={`tracking-[0.22em] uppercase text-[11px] sm:text-xs font-medium whitespace-nowrap px-3 sm:px-4 ${
                    item.type === 'promo'
                      ? 'text-[#E5B842] font-semibold tracking-[0.25em]'
                      : item.type === 'highlight'
                      ? 'text-white font-semibold'
                      : 'text-neutral-300'
                  }`}
                >
                  {item.label}
                </span>

                {/* Separator Accent */}
                <span className="text-[#8C6D2B] opacity-60 px-1 inline-flex items-center justify-center">
                  <Sparkles className="w-2.5 h-2.5 text-[#D4AF37]" />
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
