import React from 'react';
import { MapPin, Phone, Clock, Car, CalendarX, Compass, ShieldCheck, Mail, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const VisitStoreSection: React.FC = () => {
  const { siteSettings } = useApp();

  const storeName = siteSettings?.businessName || 'L.A Center Jewelry Inc';
  const address = siteSettings?.address || '720 S Broadway, Los Angeles, CA 90014, United States';
  const phone = siteSettings?.phone || '+1 213-612-0106';

  const handleGetDirections = () => {
    window.open('https://maps.app.goo.gl/Cndjp3ewGuDpumts6', '_blank');
  };

  const handleCallStore = () => {
    window.location.href = 'tel:+12136120106';
  };

  return (
    <section className="py-10 sm:py-12 bg-[#120F0D] text-white border-t border-[#291F1A]" id="visit-our-store">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-6">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal tracking-tight text-white whitespace-nowrap">
            Visit Our Store
          </h2>
        </div>

        {/* Storefront Feature Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
          {/* Left Column: Business Details & Contact Cards (7 cols) */}
          <div className="lg:col-span-7 bg-[#1A1412] border border-[#32251E] p-4 sm:p-6 flex flex-col justify-between shadow-2xl">
            <div>
              {/* Authentic Store Title & Script Tagline */}
              <div className="border-b border-[#2C1F19] pb-4 mb-4">
                <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#FFF2B2] tracking-wide">
                  {storeName}
                </h3>
                <p className="font-serif italic text-xs sm:text-sm text-[#D4AF37] tracking-[0.18em] mt-0.5 font-light">
                  “Jewelry for a Lifetime”
                </p>
              </div>

              {/* Core Store Info Cards */}
              <div className="space-y-3 sm:space-y-3.5">
                {/* Address Card */}
                <div className="flex items-start gap-3.5 p-3 sm:p-3.5 bg-[#140F0D] border border-[#2B1E18]">
                  <div className="p-2 rounded-full bg-[#261B16] border border-[#443127] text-[#D4AF37] shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[11px] uppercase tracking-[0.2em] text-[#CBB279] font-semibold mb-0.5">
                      Store Address
                    </h4>
                    <p className="text-sm sm:text-base text-white font-medium">
                      {address}
                    </p>
                    <p className="text-xs text-[#9E8C7A] mt-0.5">
                      Historic Broadway Theater District • Downtown Los Angeles
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 pt-1.5 border-t border-[#261B16] text-[11px] font-mono text-[#D4AF37]">
                      <Compass className="w-3.5 h-3.5" />
                      <span>34.0445523° N, 118.2537474° W</span>
                    </div>
                  </div>
                </div>

                {/* Telephone Card */}
                <div className="flex items-start gap-3.5 p-3 sm:p-3.5 bg-[#140F0D] border border-[#2B1E18]">
                  <div className="p-2 rounded-full bg-[#261B16] border border-[#443127] text-[#D4AF37] shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[11px] uppercase tracking-[0.2em] text-[#CBB279] font-semibold mb-0.5">
                      Direct Telephone
                    </h4>
                    <p className="text-base sm:text-lg font-serif text-[#FFF2B2] tracking-wider">
                      {phone}
                    </p>
                    <p className="text-xs text-[#9E8C7A] mt-0.5">
                      Speak directly with our master gemologists &amp; consultants
                    </p>
                  </div>
                </div>

                {/* Hours & Important Store Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Hours */}
                  <div className="p-3 bg-[#140F0D] border border-[#2B1E18]">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#CBB279] font-semibold mb-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Business Hours</span>
                    </div>
                    <ul className="text-xs space-y-1 text-[#B8A895]">
                      <li className="flex justify-between items-center gap-2">
                        <span>Monday – Friday</span>
                        <span className="text-white font-medium text-right">10:00 AM – 5:30 PM</span>
                      </li>
                      <li className="flex justify-between items-center gap-2 text-[#E5A8A8]">
                        <span className="flex items-center gap-1">
                          <CalendarX className="w-3 h-3 text-[#E58383]" />
                          Saturday
                        </span>
                        <span className="font-semibold text-right">CLOSED</span>
                      </li>
                      <li className="flex justify-between items-center gap-2">
                        <span>Sunday</span>
                        <span className="text-white font-medium text-right">By Appointment</span>
                      </li>
                    </ul>
                  </div>

                  {/* Amenities: Free Parking & Saturday Closed */}
                  <div className="p-3 bg-[#140F0D] border border-[#2B1E18] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#CBB279] font-semibold mb-1.5">
                        <Car className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Client Amenities</span>
                      </div>
                      <div className="space-y-1 mt-1">
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#251A15] border border-[#483429] rounded text-[10px] text-[#D4AF37] font-semibold">
                          <Car className="w-3 h-3" />
                          <span>Free Parking Available</span>
                        </div>
                        <p className="text-[10px] sm:text-[11px] text-[#9E8C7A] leading-relaxed">
                          Complimentary client parking validation upon visit.
                        </p>
                      </div>
                    </div>

                    <div className="mt-2 pt-1.5 border-t border-[#251A15] flex items-center gap-1.5 text-[10px] text-[#C5B08A]">
                      <ShieldCheck className="w-3 h-3 text-[#D4AF37]" />
                      <span>Licensed DTLA Fine Jewelry Atelier</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS: GET DIRECTIONS & CALL STORE */}
            <div className="mt-5 pt-4 border-t border-[#2C1F19] grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleGetDirections}
                className="w-full py-3 bg-[#D4AF37] hover:bg-[#b8952b] text-black text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2 shadow-xl hover:shadow-[#D4AF37]/30 cursor-pointer"
              >
                <Compass className="w-4 h-4" />
                <span>GET DIRECTIONS</span>
              </button>

              <button
                type="button"
                onClick={handleCallStore}
                className="w-full py-3 bg-[#221A16] hover:bg-[#2C211D] border border-[#48362D] hover:border-[#D4AF37] text-white text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Phone className="w-4 h-4 text-[#D4AF37]" />
                <span>CALL STORE</span>
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Map & Storefront Architectural Visual (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Embedded Google Map */}
            <div className="relative w-full h-56 sm:h-64 bg-[#1A1412] border border-[#32251E] overflow-hidden shadow-2xl group">
              <iframe
                title="L.A Center Jewelry Inc Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.815757754406!2d-118.25632232345585!3d34.0445523!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2c7caa17bc4bd%3A0x66e43e25f20a36e5!2sL.A%20Center%20Jewelry%20Inc!5e0!3m2!1sen!2sus!4v1710000000000!5m2!1sen!2sus"
                className="w-full h-full border-0 filter invert contrast-125 opacity-85 hover:opacity-100 transition-opacity"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />

              {/* Map Floating Pin Badge with Google Maps link */}
              <a
                href="https://maps.app.goo.gl/Cndjp3ewGuDpumts6"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-2.5 left-2.5 bg-[#16110F]/90 hover:bg-black/95 backdrop-blur-md border border-[#44332A] hover:border-[#D4AF37] px-2.5 py-1 text-xs text-white shadow-xl flex items-center gap-2 transition-all cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
                <span className="font-semibold text-[11px] text-[#FFF2B2]">720 S Broadway • L.A Center Jewelry</span>
              </a>
            </div>

            {/* Storefront Architectural Identity Card */}
            <div className="bg-[#181311] border border-[#2F231D] p-4 shadow-xl flex flex-col justify-between flex-1">
              <div>
                <div className="flex items-center justify-between pb-2.5 border-b border-[#2B1E18]">
                  <span className="text-xs uppercase tracking-[0.2em] text-[#CBB279] font-medium">
                    Storefront Architecture
                  </span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-[#251A15] border border-[#3E2C22] text-[#D4AF37]">
                    Broadway Historic Corridor
                  </span>
                </div>
                <p className="text-xs text-[#B8A895] mt-2.5 leading-relaxed font-light">
                  Distinguished by our dark brown fascia, hand-finished warm gold lettering, and expansive illuminated jewelry display windows showcasing solid gold chains, diamond solitaire rings, and fine timepieces.
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-[#261B16] flex items-center justify-between text-[11px] text-[#9E8C7A]">
                <span>Concierge &amp; Private Viewing:</span>
                <a
                  href="mailto:info@lacenterjewelry.com"
                  className="text-[#D4AF37] hover:underline flex items-center gap-1 font-medium"
                >
                  <Mail className="w-3 h-3" />
                  <span>info@lacenterjewelry.com</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
