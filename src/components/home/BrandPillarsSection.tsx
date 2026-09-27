import React from 'react';
import { ShieldCheck, Truck, RotateCcw } from 'lucide-react';

export const BrandPillarsSection: React.FC = () => {
  return (
    <section className="bg-[#140F0D] border-y border-[#2E221B] py-5 sm:py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-center md:text-left">
        {/* Pillar 1: Authenticity */}
        <div className="flex items-center gap-3.5 justify-center md:justify-start p-1.5 sm:p-0">
          <div className="w-11 h-11 rounded-full bg-[#1C1513] border border-[#3E2D25] flex items-center justify-center shrink-0 shadow-inner">
            <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-serif tracking-widest uppercase font-semibold text-white">
              Certified Authenticity
            </h4>
            <p className="text-[11px] sm:text-xs text-neutral-400 mt-0.5 font-light leading-relaxed">
              Every diamond and gemstone is appraised and certified.
            </p>
          </div>
        </div>

        {/* Pillar 2: Armored Shipping */}
        <div className="flex items-center gap-3.5 justify-center md:justify-start p-1.5 sm:p-0">
          <div className="w-11 h-11 rounded-full bg-[#1C1513] border border-[#3E2D25] flex items-center justify-center shrink-0 shadow-inner">
            <Truck className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-serif tracking-widest uppercase font-semibold text-white">
              Insured Armored Courier
            </h4>
            <p className="text-[11px] sm:text-xs text-neutral-400 mt-0.5 font-light leading-relaxed">
              Fully insured discreet shipping with adult signature required.
            </p>
          </div>
        </div>

        {/* Pillar 3: Atelier Care */}
        <div className="flex items-center gap-3.5 justify-center md:justify-start p-1.5 sm:p-0">
          <div className="w-11 h-11 rounded-full bg-[#1C1513] border border-[#3E2D25] flex items-center justify-center shrink-0 shadow-inner">
            <RotateCcw className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-serif tracking-widest uppercase font-semibold text-white">
              Broadway Atelier Care
            </h4>
            <p className="text-[11px] sm:text-xs text-neutral-400 mt-0.5 font-light leading-relaxed">
              Complimentary lifetime prong checks, ultrasonic cleaning &amp; sizing.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
