import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { CategorySection } from '../components/CategorySection';
import { FeaturedCollectionSection } from '../components/home/FeaturedCollectionSection';
import { NewArrivalsSection } from '../components/home/NewArrivalsSection';
import { BestSellingSection } from '../components/home/BestSellingSection';
import { VisitStoreSection } from '../components/VisitStoreSection';
import { LuxuryTickerRibbon } from '../components/home/LuxuryTickerRibbon';
import { BrandPillarsSection } from '../components/home/BrandPillarsSection';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  MapPin,
  Clock,
  Phone,
  ArrowRight,
  Star,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const {
    homepageSections,
    banners,
    siteSettings,
    navigateTo,
  } = useApp();

  const activeBanners = banners.filter((b) => b.isActive);
  const midBanner = activeBanners.find((b) => b.position === 'middle') || activeBanners[0];

  return (
    <div className="min-h-screen bg-[#100D0B] text-neutral-100 overflow-x-hidden w-full max-w-full">
      {/* 1. Cinematic Storefront & Video Hero */}
      {homepageSections.hero && <HeroSection />}

      {/* Ticker / Marquee Ribbon (Between Hero and Category Sections) */}
      <LuxuryTickerRibbon />

      {/* Brand Value Pillars (Certified Authenticity, Insured Armored Courier, Broadway Atelier Care) */}
      <BrandPillarsSection />

      {/* 2. Shop by Category */}
      {homepageSections.categories && <CategorySection />}

      {/* 3. Best Selling */}
      {homepageSections.bestSelling !== false && <BestSellingSection />}

      {/* 4. New Arrivals */}
      {homepageSections.newArrivals !== false && <NewArrivalsSection />}

      {/* 5. Featured Showcase */}
      {homepageSections.featured !== false && <FeaturedCollectionSection />}

      {/* 4. Promotional Banner (Middle) */}
      {homepageSections.banners && midBanner && (
        <section
          id="promotional-jewelry-banner"
          className="relative py-12 sm:py-16 px-4 sm:px-6 bg-[#140F0D] text-white overflow-hidden border-y border-[#2E221B]"
        >
          <img
            src={midBanner.mediaUrl}
            alt={midBanner.title}
            className="absolute inset-0 w-full h-full object-cover object-right md:object-center opacity-100 filter contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#100D0B]/90 via-[#100D0B]/60 sm:via-[#100D0B]/35 to-transparent pointer-events-none" />
          <div className="relative z-10 max-w-4xl mx-auto text-center sm:text-left">
            {midBanner.badge && (
              <span className="inline-block px-3 py-1 bg-[#D4AF37] text-black text-[10px] uppercase font-bold tracking-widest mb-3 shadow-sm">
                {midBanner.badge}
              </span>
            )}
            <h2 className="font-serif text-2xl sm:text-4xl font-normal text-white mb-4 leading-tight drop-shadow-md whitespace-nowrap">
              {midBanner.title}
            </h2>
            <button
              type="button"
              id="promotional-banner-cta-btn"
              onClick={() => {
                if (midBanner.buttonLink?.includes('contact')) {
                  navigateTo('contact');
                } else if (midBanner.buttonLink?.startsWith('/shop') || midBanner.buttonLink?.startsWith('shop')) {
                  navigateTo('shop', { categorySlug: 'cat-bridal' });
                } else {
                  navigateTo('shop');
                }
              }}
              className="px-6 py-3 bg-[#D4AF37] hover:bg-[#b8952b] text-black text-xs font-bold uppercase tracking-[0.2em] transition-colors inline-flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <span>{midBanner.buttonText || 'EXPLORE BRIDAL'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* 7. Dedicated "Visit Our Store" Section (720 S Broadway) */}
      <VisitStoreSection />

      {/* 8. Client Reviews */}
      {homepageSections.testimonials && (
        <section className="py-10 sm:py-12 bg-[#120E0C] border-b border-[#2C211B]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-5 sm:mb-6">
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-white whitespace-nowrap">
                Client Reviews
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <div className="p-5 sm:p-6 bg-[#181311] border border-[#2E221B] shadow-xl space-y-3">
                <div className="flex text-[#D4AF37]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="font-serif text-sm sm:text-base italic text-[#E5D8BE] leading-relaxed">
                  &quot;Finding our engagement ring at L.A Center Jewelry on Broadway was the most relaxed, knowledgeable jewelry experience in Los Angeles. The diamond fire is unbelievable.&quot;
                </p>
                <div className="pt-2 border-t border-[#291E18] text-xs">
                  <p className="font-semibold text-white">Victoria &amp; James H.</p>
                  <p className="text-[#9E8E7D]">Beverly Hills, CA</p>
                </div>
              </div>

              <div className="p-5 sm:p-6 bg-[#181311] border border-[#2E221B] shadow-xl space-y-3">
                <div className="flex text-[#D4AF37]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="font-serif text-sm sm:text-base italic text-[#E5D8BE] leading-relaxed">
                  &quot;The Riviera tennis bracelet is crafted with incredible fluidity. You can tell immediately it is real high-jewelry quality. Shipped fully insured right to my door.&quot;
                </p>
                <div className="pt-2 border-t border-[#291E18] text-xs">
                  <p className="font-semibold text-white">Sophia R.</p>
                  <p className="text-[#9E8E7D]">Pasadena, CA</p>
                </div>
              </div>

              <div className="p-5 sm:p-6 bg-[#181311] border border-[#2E221B] shadow-xl space-y-3">
                <div className="flex text-[#D4AF37]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="font-serif text-sm sm:text-base italic text-[#E5D8BE] leading-relaxed">
                  &quot;Solid 14k Miami Cuban chain with authentic weight and immaculate high-polish bevels. Downtown LA jewelry at its finest.&quot;
                </p>
                <div className="pt-2 border-t border-[#291E18] text-xs">
                  <p className="font-semibold text-white">Marcus S.</p>
                  <p className="text-[#9E8E7D]">Downtown Los Angeles, CA</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
