import React from 'react';
import { MapPin, Phone, ShieldCheck, Gem, Sparkles, Clock, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AboutPage: React.FC = () => {
  const { siteSettings, navigateTo } = useApp();

  return (
    <div className="min-h-screen bg-[#FAF9F5] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Banner */}
        <div className="relative bg-neutral-900 text-white p-8 sm:p-16 mb-16 overflow-hidden border border-neutral-800">
          <img
            src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=1600&auto=format&fit=crop"
            alt="Jewelry atelier workshop"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
          <div className="relative z-10 max-w-2xl">
            <span className="text-[11px] uppercase tracking-[0.3em] font-semibold text-[#D4AF37] block mb-3">
              About L.A Center Jewelry Inc
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-normal text-white leading-tight mb-4">
              Downtown Los Angeles Fine Jewelry Atelier
            </h1>
            <p className="text-neutral-300 text-sm sm:text-base font-light leading-relaxed">
              Located on historic Broadway in the heart of Los Angeles, we curate and handcraft exceptional diamond jewelry, bespoke engagement pieces, and fine precious metal designs.
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <span className="text-[11px] uppercase tracking-[0.28em] font-semibold text-[#997C24] block">
              720 S Broadway Atelier
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-neutral-900 leading-tight">
              Artisanal Dedication in Every Micro-Prong
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed font-light">
              At L.A Center Jewelry Inc, our salon is established on one principle: delivering uncompromised jewelry craftsmanship with radical transparency. Operating from our Downtown Los Angeles showroom, our team pairs traditional European goldsmithing techniques with modern laser precision.
            </p>
            <p className="text-sm text-neutral-600 leading-relaxed font-light">
              Whether selecting an investment-grade GIA certified diamond solitaire or commissioning a one-of-a-kind anniversary suite, each client receives dedicated gemological guidance without high-pressure sales tactics.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-200">
              <div>
                <p className="font-serif text-2xl font-bold text-neutral-900">100% Solid</p>
                <p className="text-xs text-neutral-500 mt-0.5">14k, 18k &amp; 950 Platinum</p>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-neutral-900">GIA &amp; IGI</p>
                <p className="text-xs text-neutral-500 mt-0.5">Certified Natural &amp; Lab Diamonds</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop"
              alt="Diamond evaluation"
              className="w-full h-[450px] object-cover shadow-xl border border-neutral-200"
            />
            <div className="absolute -bottom-6 -left-6 bg-white p-6 border border-neutral-200 shadow-lg hidden sm:block max-w-xs">
              <Sparkles className="w-5 h-5 text-[#997C24] mb-2" />
              <p className="font-serif text-sm font-semibold text-neutral-900">
                Downtown Los Angeles
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                720 S Broadway, Los Angeles, CA 90014
              </p>
            </div>
          </div>
        </div>

        {/* Pillars of Trust */}
        <div className="bg-white border border-neutral-200 p-8 sm:p-12 mb-20 shadow-xs">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[11px] uppercase tracking-[0.28em] font-semibold text-[#997C24] block mb-1">
              Our Commitments
            </span>
            <h3 className="font-serif text-3xl font-normal text-neutral-900">
              Guiding Principles of Our Salon
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-[#FAF9F5] border border-neutral-200/80 space-y-3">
              <Gem className="w-6 h-6 text-[#997C24]" />
              <h4 className="font-serif text-lg font-semibold text-neutral-900">
                Certified Provenance
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed font-light">
                We work strictly with ethically sourced diamonds and conflict-free gemstones inspected for optimal fire and scintillation.
              </p>
            </div>

            <div className="p-6 bg-[#FAF9F5] border border-neutral-200/80 space-y-3">
              <ShieldCheck className="w-6 h-6 text-[#997C24]" />
              <h4 className="font-serif text-lg font-semibold text-neutral-900">
                Appraisal &amp; Authentication
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed font-light">
                Every high jewelry purchase includes a formal insurance appraisal stating stone specifications, precious metal purity, and replacement value.
              </p>
            </div>

            <div className="p-6 bg-[#FAF9F5] border border-neutral-200/80 space-y-3">
              <Clock className="w-6 h-6 text-[#997C24]" />
              <h4 className="font-serif text-lg font-semibold text-neutral-900">
                Lifetime Care
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed font-light">
                Complimentary prong inspection, sonic steam cleaning, and rhodium rejuvenation for all creations acquired through our salon.
              </p>
            </div>
          </div>
        </div>

        {/* Visit Showroom CTA */}
        <div className="bg-[#181818] text-white p-8 sm:p-12 border border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[11px] uppercase tracking-[0.28em] font-semibold text-[#D4AF37]">
              Visit Our Salon
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-normal text-white">
              Schedule a Private Viewing Consultation
            </h3>
            <p className="text-xs text-neutral-400 max-w-lg font-light">
              Experience the weight, luster, and fire of our fine jewelry creations in person at our Broadway boutique in Los Angeles.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigateTo('contact')}
            className="px-8 py-4 bg-[#D4AF37] hover:bg-[#b59226] text-black text-xs font-bold uppercase tracking-[0.2em] transition-colors flex items-center gap-2 cursor-pointer flex-shrink-0"
          >
            <span>Book Appointment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
