import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Youtube,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ArrowRight,
  User,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { navigateTo, siteSettings, showToast, currentUser, isUserLoggedIn, isAdminLoggedIn, currentRoute } = useApp();
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    showToast('Thank you for subscribing to L.A Center Jewelry private invitations.', 'success');
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-[#141414] text-[#E0DCD3] border-t border-[#262626]">
      {/* Brand Value Pillars (Shown on non-home pages so it is not duplicated on homepage) */}
      {currentRoute !== 'home' && (
        <div className="border-b border-[#262626] py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="w-12 h-12 rounded-full bg-[#202020] border border-[#3A3A3A] flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <div>
                <h4 className="text-sm font-serif tracking-widest uppercase font-semibold text-white">
                  Certified Authenticity
                </h4>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Every diamond and gemstone is appraised and certified.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="w-12 h-12 rounded-full bg-[#202020] border border-[#3A3A3A] flex items-center justify-center flex-shrink-0">
                <Truck className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <div>
                <h4 className="text-sm font-serif tracking-widest uppercase font-semibold text-white">
                  Insured Armored Courier
                </h4>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Fully insured discreet shipping with adult signature required.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="w-12 h-12 rounded-full bg-[#202020] border border-[#3A3A3A] flex items-center justify-center flex-shrink-0">
                <RotateCcw className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <div>
                <h4 className="text-sm font-serif tracking-widest uppercase font-semibold text-white">
                  Broadway Atelier Care
                </h4>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Complimentary lifetime prong checks, ultrasonic cleaning & sizing.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-12">
          {/* Col 1: Brand & Contact Info */}
          <div className="sm:col-span-2 lg:col-span-4 xl:col-span-4 space-y-5">
            <div className="flex items-center gap-3 sm:gap-3.5">
              {siteSettings?.logoUrl ? (
                <div
                  className="w-11 h-11 sm:w-13 sm:h-13 lg:w-14 lg:h-14 shrink-0 flex items-center justify-center"
                >
                  <img
                    src={siteSettings.logoUrl}
                    alt={`${siteSettings.businessName} Official Emblem`}
                    className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(212,175,55,0.4)] select-none"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : null}
              <div className="flex flex-col justify-center min-w-0">
                <span className="block font-serif text-sm sm:text-base lg:text-[18px] xl:text-[20px] tracking-[0.04em] sm:tracking-[0.06em] font-semibold text-white uppercase leading-tight whitespace-nowrap">
                  {siteSettings.businessName}
                </span>
                <span className="block text-[8.5px] sm:text-[9.5px] tracking-[0.12em] text-[#D4AF37] uppercase font-sans mt-0.5 leading-snug">
                  <span>Luxury Jewelry in the Heart</span>
                  <span className="block">of Los Angeles</span>
                </span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-neutral-300">
              <a
                href="https://maps.app.goo.gl/Cndjp3ewGuDpumts6"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2.5 hover:text-[#D4AF37] transition-colors"
              >
                <MapPin className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <span>{siteSettings.address}</span>
              </a>

              <a
                href={`tel:${siteSettings.phone.replace(/[^0-9+]/g, '')}`}
                className="flex items-center gap-2.5 hover:text-[#D4AF37] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                <span>{siteSettings.phone}</span>
              </a>

              <a
                href={`mailto:${siteSettings.email}`}
                className="flex items-center gap-2.5 hover:text-[#D4AF37] transition-colors"
              >
                <Mail className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                <span>{siteSettings.email}</span>
              </a>
            </div>

            {/* Newsletter */}
            <div className="pt-2">
              <p className="text-xs uppercase tracking-widest text-neutral-300 font-medium mb-2">
                Join the Private Salon Reserve
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex max-w-sm">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="bg-[#202020] border border-[#3A3A3A] px-3.5 py-2 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#D4AF37] flex-1"
                />
                <button
                  type="submit"
                  className="bg-[#D4AF37] text-black px-4 py-2 text-xs font-semibold uppercase tracking-wider hover:bg-[#b59226] transition-colors flex items-center gap-1"
                >
                  Join <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>

          {/* Col 2: Shop */}
          <div className="sm:col-span-1 lg:col-span-2 xl:col-span-2">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-white mb-4">
              Shop Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <button
                  onClick={() => navigateTo('shop')}
                  className="hover:text-white transition-colors text-left"
                >
                  All Fine Jewelry
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('shop', { categorySlug: 'cat-rings' })}
                  className="hover:text-white transition-colors text-left"
                >
                  Engagement & Rings
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('shop', { categorySlug: 'cat-necklaces' })}
                  className="hover:text-white transition-colors text-left"
                >
                  Diamond Necklaces
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('shop', { categorySlug: 'cat-earrings' })}
                  className="hover:text-white transition-colors text-left"
                >
                  Earrings & Drops
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('shop', { categorySlug: 'cat-bracelets' })}
                  className="hover:text-white transition-colors text-left"
                >
                  Riviera Bracelets
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('shop', { categorySlug: 'cat-mens' })}
                  className="hover:text-white transition-colors text-left"
                >
                  Men&apos;s Gold Jewelry
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('shop', { categorySlug: 'cat-bridal' })}
                  className="hover:text-white transition-colors text-left"
                >
                  Bridal Suites
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Service */}
          <div className="sm:col-span-1 lg:col-span-3 xl:col-span-3">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-white mb-4">
              Client Concierge
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <button
                  onClick={() => navigateTo('contact')}
                  className="hover:text-white transition-colors text-left"
                >
                  Contact Us & Appointments
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('shipping-policy')}
                  className="hover:text-white transition-colors text-left"
                >
                  Armored Shipping Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('return-policy')}
                  className="hover:text-white transition-colors text-left"
                >
                  Returns & Guarantee
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('contact')}
                  className="hover:text-white transition-colors text-left"
                >
                  Bespoke Ring Consultations
                </button>
              </li>
              <li>
                <a
                  href={`tel:${siteSettings.phone.replace(/[^0-9+]/g, '')}`}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  Call Store Concierge
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Company & Administration */}
          <div className="sm:col-span-2 lg:col-span-3 xl:col-span-3">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-white mb-4">
              The Salon
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <button
                  onClick={() => navigateTo('about')}
                  className="hover:text-white transition-colors"
                >
                  About Our Craftsmanship
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('privacy-policy')}
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('terms-conditions')}
                  className="hover:text-white transition-colors"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo(isUserLoggedIn ? 'customer-account' : 'customer-auth')}
                  className="flex items-center gap-1.5 text-neutral-300 hover:text-[#D4AF37] transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{isUserLoggedIn ? 'My Patron Profile' : 'Sign Up / Client Salon'}</span>
                </button>
              </li>
              <li className="pt-2 border-t border-[#262626]">
                <button
                  type="button"
                  onClick={() => navigateTo(isAdminLoggedIn ? 'admin-dashboard' : 'admin-login')}
                  className="flex items-center gap-1.5 text-neutral-400 hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{isAdminLoggedIn ? 'Atelier Admin Dashboard' : 'Admin Panel Portal'}</span>
                </button>
              </li>
            </ul>

            {/* Social Icons */}
            <div className="mt-6">
              <span className="block text-[11px] uppercase tracking-widest text-neutral-400 mb-2">
                Follow The Atelier
              </span>
              <div className="flex items-center space-x-3 text-neutral-400">
                {siteSettings?.socialLinks?.instagram && (
                  <a
                    href={siteSettings.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-[#202020] hover:bg-[#D4AF37] hover:text-black flex items-center justify-center transition-colors"
                    aria-label="Instagram"
                    title="Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {siteSettings?.socialLinks?.facebook && (
                  <a
                    href={siteSettings.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-[#202020] hover:bg-[#D4AF37] hover:text-black flex items-center justify-center transition-colors"
                    aria-label="Facebook"
                    title="Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
                {siteSettings?.socialLinks?.youtube && (
                  <a
                    href={siteSettings.socialLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-[#202020] hover:bg-[#D4AF37] hover:text-black flex items-center justify-center transition-colors"
                    aria-label="YouTube"
                    title="YouTube"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                )}
                {siteSettings?.socialLinks?.tiktok && (
                  <a
                    href={siteSettings.socialLinks.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-[#202020] hover:bg-[#D4AF37] hover:text-black flex items-center justify-center transition-colors"
                    aria-label="TikTok"
                    title="TikTok"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.34 6.34 0 0 0 1.86-4.49V8.52a8.27 8.27 0 0 0 4.75 1.48V6.69h-.84z" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-14 pt-8 border-t border-[#262626] flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4 text-center sm:text-left">
          <p>© {new Date().getFullYear()} {siteSettings.businessName}. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-6">
            <span>720 S Broadway, Los Angeles, CA 90014</span>
            <span className="hidden sm:inline">•</span>
            <span>Handcrafted in Los Angeles</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
