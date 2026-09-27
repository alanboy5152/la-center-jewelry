import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Calendar, Compass, ExternalLink, Navigation } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ContactPage: React.FC = () => {
  const { siteSettings, showToast } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [interest, setInterest] = useState('Bespoke Engagement Ring');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      showToast('Please provide your name and email address.', 'error');
      return;
    }

    setIsSubmitted(true);
    showToast('Your consultation request has been received. Our concierge will contact you.', 'success');
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[11px] uppercase tracking-[0.3em] font-semibold text-[#997C24] block mb-2">
            Salon Concierge
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-neutral-900 mb-3">
            Visit Our Broadway Boutique
          </h1>
          <p className="text-sm text-neutral-600 font-light leading-relaxed">
            Schedule a private consultation with our master gemologists in Downtown Los Angeles or reach our client services team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Contact & Location Info (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white border border-neutral-200 p-8 space-y-6 shadow-xs">
              <h2 className="font-serif text-2xl font-normal text-neutral-900 border-b border-neutral-200 pb-4">
                Atelier Coordinates
              </h2>

              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#FAF9F5] border border-neutral-200 flex items-center justify-center text-[#997C24] flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs uppercase font-bold tracking-wider text-neutral-800">
                    Location
                  </h4>
                  <p className="text-sm text-neutral-700 mt-1 font-medium">
                    {siteSettings.address}
                  </p>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Downtown Los Angeles Historic Diamond Corridor
                  </p>
                  <a
                    href="https://maps.app.goo.gl/Cndjp3ewGuDpumts6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#997C24] hover:underline mt-2"
                  >
                    <span>Get Driving &amp; Walking Directions</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Geographic Coordinates (GPS) */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#FAF9F5] border border-neutral-200 flex items-center justify-center text-[#997C24] flex-shrink-0">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs uppercase font-bold tracking-wider text-neutral-800">
                    Geographic Coordinates
                  </h4>
                  <p className="text-sm font-mono text-neutral-800 mt-1 font-semibold">
                    34.0445523° N, 118.2537474° W
                  </p>
                  <p className="text-xs text-neutral-500 mt-0.5 font-mono">
                    Lat: 34.0445523 • Long: -118.2537474
                  </p>
                  <a
                    href="https://maps.app.goo.gl/Cndjp3ewGuDpumts6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#997C24] hover:underline mt-2"
                  >
                    <span>Open in Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#FAF9F5] border border-neutral-200 flex items-center justify-center text-[#997C24] flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs uppercase font-bold tracking-wider text-neutral-800">
                    Telephone
                  </h4>
                  <a
                    href={`tel:${siteSettings.phone.replace(/[^0-9+]/g, '')}`}
                    className="text-sm font-semibold text-neutral-900 hover:text-[#997C24] transition-colors block mt-1"
                  >
                    {siteSettings.phone}
                  </a>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Direct showroom assistance during store hours
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#FAF9F5] border border-neutral-200 flex items-center justify-center text-[#997C24] flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs uppercase font-bold tracking-wider text-neutral-800">
                    Direct Inquiries
                  </h4>
                  <a
                    href={`mailto:${siteSettings.email}`}
                    className="text-sm text-neutral-700 hover:text-[#997C24] transition-colors block mt-1"
                  >
                    {siteSettings.email}
                  </a>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-4 pt-4 border-t border-neutral-100">
                <div className="w-10 h-10 rounded-full bg-[#FAF9F5] border border-neutral-200 flex items-center justify-center text-[#997C24] flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="space-y-1 text-xs text-neutral-600">
                  <h4 className="uppercase font-bold tracking-wider text-neutral-800">
                    Salon Hours
                  </h4>
                  <div className="flex justify-between gap-6 pt-1">
                    <span>Monday – Friday:</span>
                    <span className="font-semibold text-neutral-900">10:00 AM – 6:00 PM</span>
                  </div>
                  <div className="flex justify-between gap-6">
                    <span>Saturday:</span>
                    <span className="font-semibold text-neutral-900">11:00 AM – 5:00 PM</span>
                  </div>
                  <div className="flex justify-between gap-6 text-neutral-500">
                    <span>Sunday:</span>
                    <span>By Concierge Appointment</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Map Embed */}
            <div className="bg-white border border-neutral-200 p-2 shadow-xs overflow-hidden h-64 sm:h-72 relative group">
              <iframe
                title="L.A Center Jewelry Inc Showroom Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.815757754406!2d-118.25632232345585!3d34.0445523!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2c7caa17bc4bd%3A0x66e43e25f20a36e5!2sL.A%20Center%20Jewelry%20Inc!5e0!3m2!1sen!2sus!4v1710000000000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute bottom-3 right-3">
                <a
                  href="https://maps.app.goo.gl/Cndjp3ewGuDpumts6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900/90 hover:bg-black text-white text-[11px] font-medium shadow-md backdrop-blur-xs transition-colors rounded-sm"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Appointment Booking / Inquiries Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-neutral-200 p-8 sm:p-10 shadow-xs">
              {isSubmitted ? (
                <div className="py-16 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-2xl font-normal text-neutral-900">
                    Consultation Requested
                  </h3>
                  <p className="text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
                    Thank you, {name}. A senior gemologist from L.A Center Jewelry Inc will review your appointment request and contact you at {email || phone} within 2 business hours to confirm your private viewing.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setName('');
                      setEmail('');
                      setPhone('');
                      setMessage('');
                    }}
                    className="mt-6 px-6 py-2.5 bg-neutral-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#D4AF37] hover:text-black transition-colors"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <span className="text-[11px] uppercase tracking-[0.28em] font-semibold text-[#997C24] block mb-1">
                      Private Appointment
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl font-normal text-neutral-900">
                      Reserve a Viewing or Request Details
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1 font-light">
                      Please let us know how we may assist you with diamonds, custom ring design, or jewelry appraisals.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs uppercase tracking-wider font-semibold text-neutral-700 block mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Eleanor Vance"
                        className="w-full bg-[#FAF9F5] border border-neutral-300 p-3 text-xs focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="text-xs uppercase tracking-wider font-semibold text-neutral-700 block mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. eleanor@example.com"
                        className="w-full bg-[#FAF9F5] border border-neutral-300 p-3 text-xs focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs uppercase tracking-wider font-semibold text-neutral-700 block mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. (213) 555-0199"
                        className="w-full bg-[#FAF9F5] border border-neutral-300 p-3 text-xs focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="text-xs uppercase tracking-wider font-semibold text-neutral-700 block mb-1.5">
                        Primary Interest
                      </label>
                      <select
                        value={interest}
                        onChange={(e) => setInterest(e.target.value)}
                        className="w-full bg-[#FAF9F5] border border-neutral-300 p-3 text-xs focus:outline-none focus:border-[#D4AF37]"
                      >
                        <option value="Bespoke Engagement Ring">Bespoke Engagement Ring</option>
                        <option value="Diamond Solitaires & Eternity Bands">Diamond Solitaires &amp; Eternity Bands</option>
                        <option value="Tennis Bracelets & Necklaces">Tennis Bracelets &amp; Necklaces</option>
                        <option value="Solid Gold Chains & Pendants">Solid Gold Chains &amp; Pendants</option>
                        <option value="Fine Horology & Watches">Fine Horology &amp; Watches</option>
                        <option value="Insurance Appraisal & Consultation">Insurance Appraisal &amp; Consultation</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider font-semibold text-neutral-700 block mb-1.5">
                      Preferred Date (Optional)
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                        className="w-full bg-[#FAF9F5] border border-neutral-300 p-3 text-xs focus:outline-none focus:border-[#D4AF37]"
                      />
                      <Calendar className="w-4 h-4 text-neutral-400 absolute right-3 top-3.5 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider font-semibold text-neutral-700 block mb-1.5">
                      Message or Specific Requests
                    </label>
                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Share details regarding diamond shapes, metal choices, budget parameters, or heirloom redesigns..."
                      className="w-full bg-[#FAF9F5] border border-neutral-300 p-3 text-xs focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-[#D4AF37] hover:bg-[#b59226] text-black text-xs font-bold uppercase tracking-[0.22em] transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Consultation Request</span>
                  </button>

                  <p className="text-[11px] text-neutral-400 text-center">
                    Your information is treated with strict discretion. We never disclose client details to third parties.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
