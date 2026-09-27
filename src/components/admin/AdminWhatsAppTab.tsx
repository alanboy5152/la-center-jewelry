import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Check,
  ExternalLink,
  Phone,
  Sparkles,
  Bot,
  HelpCircle,
  Smartphone,
  Save,
  ShieldCheck,
  RefreshCw,
  Send,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminWhatsAppTab: React.FC = () => {
  const { siteSettings, updateSiteSettings, showToast } = useApp();

  const [whatsappNumber, setWhatsappNumber] = useState(
    siteSettings?.whatsappNumber || siteSettings?.phone || '+1 213-612-0106'
  );
  const [whatsappEnabled, setWhatsappEnabled] = useState(
    siteSettings?.whatsappEnabled !== false
  );
  const [whatsappGreeting, setWhatsappGreeting] = useState(
    siteSettings?.whatsappGreeting || 'Welcome! How can we assist you today? 💎'
  );

  const [isSaved, setIsSaved] = useState(false);

  // Sync with global settings if updated from elsewhere
  useEffect(() => {
    if (siteSettings) {
      if (siteSettings.whatsappNumber !== undefined) {
        setWhatsappNumber(siteSettings.whatsappNumber);
      } else if (siteSettings.phone) {
        setWhatsappNumber(siteSettings.phone);
      }
      if (siteSettings.whatsappEnabled !== undefined) {
        setWhatsappEnabled(siteSettings.whatsappEnabled);
      }
      if (siteSettings.whatsappGreeting !== undefined) {
        setWhatsappGreeting(siteSettings.whatsappGreeting);
      }
    }
  }, [siteSettings?.whatsappNumber, siteSettings?.whatsappEnabled, siteSettings?.whatsappGreeting, siteSettings?.phone]);

  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '') || '12136120106';
  const directLink = `https://wa.me/${cleanPhone}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!whatsappNumber.trim()) {
      showToast('Please enter a valid WhatsApp phone number.', 'error');
      return;
    }

    if (cleanPhone.length < 7) {
      showToast('The WhatsApp phone number is too short. Please include country code and digits.', 'error');
      return;
    }

    updateSiteSettings({
      ...siteSettings,
      whatsappNumber: whatsappNumber.trim(),
      whatsappEnabled,
      whatsappGreeting: whatsappGreeting.trim(),
    });

    setIsSaved(true);
    showToast('WhatsApp Chatbot settings updated successfully and applied to storefront.', 'success');
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleTestWhatsApp = () => {
    if (!cleanPhone || cleanPhone.length < 7) {
      showToast('Please enter a valid WhatsApp number first.', 'error');
      return;
    }
    const testText = encodeURIComponent('Hello L.A Center Jewelry Concierge, testing WhatsApp connection.');
    window.open(`https://wa.me/${cleanPhone}?text=${testText}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-3 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 border-b border-[#2D211B] pb-3 sm:pb-4">
        <div>
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center text-[#25D366]">
              <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <h2 className="font-serif text-lg sm:text-2xl font-normal text-white">
              WhatsApp Concierge &amp; Chatbot Settings
            </h2>
          </div>
          <p className="text-[11px] sm:text-xs text-neutral-400 mt-1">
            Configure the live WhatsApp customer support number, automated greeting, and storefront widget visibility.
          </p>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span
            className={`px-2.5 py-1 text-[11px] sm:text-xs font-mono font-semibold rounded-xs border flex items-center gap-1.5 ${
              whatsappEnabled
                ? 'bg-[#25D366]/10 border-[#25D366]/40 text-[#25D366]'
                : 'bg-neutral-800 border-neutral-700 text-neutral-400'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                whatsappEnabled ? 'bg-[#25D366] animate-pulse' : 'bg-neutral-500'
              }`}
            />
            {whatsappEnabled ? 'Widget Active' : 'Widget Disabled'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-6">
        {/* Main Settings Form (7 cols) */}
        <div className="lg:col-span-7 space-y-3 sm:space-y-6">
          <form
            onSubmit={handleSubmit}
            className="bg-[#181210] border border-[#2D211B] p-3 sm:p-6 md:p-8 space-y-3.5 sm:space-y-6 text-xs"
          >
            {/* Widget Visibility Toggle */}
            <div className="p-2.5 sm:p-4 bg-[#120E0C] border border-[#2A1F1A] rounded-xs flex items-center justify-between gap-3">
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-white flex items-center gap-2">
                  <span>Display WhatsApp Chatbot on Storefront</span>
                  <span className="px-1.5 py-0.5 bg-[#25D366]/20 text-[#25D366] text-[9.5px] font-bold uppercase rounded-xs">
                    Live
                  </span>
                </h4>
                <p className="text-[10.5px] sm:text-xs text-neutral-400 mt-0.5">
                  When enabled, visitors will see the floating WhatsApp concierge on all store pages.
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                <input
                  type="checkbox"
                  checked={whatsappEnabled}
                  onChange={(e) => setWhatsappEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5.5 sm:w-11 sm:h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4.5 after:w-4.5 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-[#25D366]" />
              </label>
            </div>

            {/* WhatsApp Phone Number Input */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="uppercase font-semibold text-neutral-300 flex items-center justify-between text-[11px] sm:text-xs">
                <span className="flex items-center gap-1.5 sm:gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>WhatsApp Phone Number *</span>
                </span>
                <span className="text-[10px] text-neutral-400 font-mono lowercase">
                  wa.me target
                </span>
              </label>

              <div className="relative">
                <input
                  type="text"
                  required
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="+1 (213) 612-0106"
                  className="w-full bg-[#120E0C] border border-[#3E2D25] focus:border-[#25D366] p-2.5 sm:p-3 text-white text-xs sm:text-sm font-mono focus:outline-none transition-colors"
                />
              </div>

              <p className="text-[10.5px] sm:text-[11px] text-neutral-400 leading-relaxed">
                Include standard US country code (e.g. <span className="text-[#D4AF37] font-mono">+1</span> followed by your 10-digit US area code and number).
              </p>

              {/* Parsed Clean Number Display & Test Link */}
              <div className="p-2.5 sm:p-3 bg-[#130E0C] border border-[#2D211B] rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-2.5">
                <div className="min-w-0">
                  <span className="text-[9.5px] sm:text-[10px] uppercase font-bold text-neutral-500 block">
                    Direct API wa.me Endpoint:
                  </span>
                  <span className="text-xs font-mono text-[#25D366] truncate block">
                    {directLink}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleTestWhatsApp}
                  className="px-2.5 py-1.5 bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-[#25D366] text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shrink-0 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Test Number</span>
                </button>
              </div>
            </div>

            {/* Chatbot Welcome Greeting */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="uppercase font-semibold text-neutral-300 flex items-center gap-2 text-[11px] sm:text-xs">
                <Bot className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Chatbot Initial Greeting Message</span>
              </label>

              <textarea
                rows={2}
                value={whatsappGreeting}
                onChange={(e) => setWhatsappGreeting(e.target.value)}
                placeholder="Welcome! How can we assist you today? 💎"
                className="w-full bg-[#120E0C] border border-[#3E2D25] focus:border-[#D4AF37] p-2.5 sm:p-3 text-white text-xs focus:outline-none transition-colors"
              />
              <p className="text-[10.5px] sm:text-[11px] text-neutral-400">
                This message appears automatically as the initial greeting whenever a client opens the chatbot popup.
              </p>
            </div>

            {/* Submit & Reset Button */}
            <div className="pt-3 sm:pt-4 border-t border-[#261E1A] flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={() => {
                  const showroom = siteSettings?.phone || '+1 213-612-0106';
                  setWhatsappNumber(showroom);
                  showToast('Reverted to showroom default telephone.', 'info');
                }}
                className="text-neutral-400 hover:text-white text-xs underline cursor-pointer"
              >
                Use Showroom Phone ({siteSettings?.phone || '+1 213-612-0106'})
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2.5 sm:px-6 sm:py-2.5 bg-[#D4AF37] hover:bg-[#b59226] text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
              >
                {isSaved ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-950 font-bold" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save WhatsApp Settings</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Informational Notice */}
          <div className="p-3 sm:p-4 bg-[#140F0D] border border-[#2D211B] rounded-xs space-y-1.5 sm:space-y-2 text-xs">
            <h4 className="font-semibold text-white flex items-center gap-1.5 text-xs">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>Instant Cloud &amp; Local Persistence</span>
            </h4>
            <p className="text-neutral-400 leading-relaxed text-[11px]">
              Whenever you update the WhatsApp phone number here, it is instantly synchronized with your Firestore Cloud database and stored in local cache. Visitors opening the WhatsApp chatbot on mobile or desktop will immediately route directly to this new number.
            </p>
          </div>
        </div>

        {/* Live Interactive Mockup / Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-3 sm:space-y-4">
          <div className="bg-[#181210] border border-[#2D211B] p-3.5 sm:p-5 rounded-xs space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xs sm:text-sm font-medium text-white flex items-center gap-1.5 sm:gap-2">
                <Smartphone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37]" />
                <span>Storefront Chatbot Live Preview</span>
              </h3>
              <span className="text-[9.5px] sm:text-[10px] text-neutral-400 font-mono">
                Realtime Preview
              </span>
            </div>

            {/* Chatbot Window Simulation */}
            <div className="w-full bg-[#140F0D] border border-[#3E2D24] rounded-xl overflow-hidden shadow-xl text-xs font-sans">
              {/* Header */}
              <div className="bg-[#1C1411] border-b border-[#30221B] px-3 py-2.5 sm:px-3.5 sm:py-3 flex items-center justify-between text-white">
                <div className="flex items-center gap-2 sm:gap-2.5">
                  <div className="relative">
                    <div className="w-6.5 h-6.5 sm:w-7.5 sm:h-7.5 rounded-full bg-[#241A16] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] font-serif font-bold text-xs">
                      LA
                    </div>
                    <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#25D366] border border-[#1C1411]"></span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <h4 className="font-serif text-xs font-medium text-white">
                        L.A Center Concierge
                      </h4>
                      <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                    </div>
                    <span className="text-[9px] text-emerald-400 font-mono block">
                      Target: +{cleanPhone}
                    </span>
                  </div>
                </div>

                <div className="w-6 h-6 rounded-full bg-[#25D366]/20 flex items-center justify-center text-[#25D366]">
                  <MessageSquare className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Chat Message Box */}
              <div className="p-2.5 sm:p-3 bg-[#100C0A] space-y-2.5 sm:space-y-3 min-h-[160px] sm:min-h-[220px]">
                {/* Greeting Bubble */}
                <div className="flex flex-col items-start">
                  <div className="max-w-[90%] px-2.5 py-1.5 sm:px-3 sm:py-2 bg-[#1E1613] border border-[#34241B] text-neutral-200 rounded-xl rounded-tl-xs text-[10.5px] sm:text-[11px] leading-relaxed">
                    {whatsappGreeting || 'Welcome! How can we assist you today? 💎'}
                  </div>
                  <span className="text-[9px] text-neutral-500 mt-0.5 px-1">
                    Just now
                  </span>
                </div>

                {/* Quick Topics Showcase */}
                <div className="space-y-1.5 pt-0.5">
                  <span className="text-[9.5px] sm:text-[10px] uppercase font-bold text-neutral-500 block px-1">
                    Quick Inquiries:
                  </span>
                  {[
                    '💎 Custom Rings & Diamonds',
                    '📦 Order Tracking',
                    '🏷️ Pricing & Appraisals',
                  ].map((topic, i) => (
                    <div
                      key={i}
                      className="py-1 px-2 bg-[#18120F] border border-[#30221B] text-neutral-300 rounded-md text-[10px] sm:text-[10.5px] flex items-center justify-between"
                    >
                      <span>{topic}</span>
                      <span className="text-[#D4AF37] font-bold text-xs">→</span>
                    </div>
                  ))}
                </div>

                {/* Sample Action Button */}
                <div className="pt-0.5">
                  <button
                    type="button"
                    onClick={handleTestWhatsApp}
                    className="w-full py-1.5 sm:py-2 bg-[#25D366] hover:bg-[#1EBE5D] text-black font-bold text-[10.5px] sm:text-[11px] uppercase tracking-wider rounded-md flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5 fill-black" />
                    <span>Open WhatsApp (+{cleanPhone})</span>
                  </button>
                </div>
              </div>

              {/* Footer Input Mock */}
              <div className="p-2 sm:p-2.5 bg-[#16100E] border-t border-[#2C1F18] flex items-center gap-2">
                <div className="flex-1 bg-[#0E0A08] border border-[#30221B] text-neutral-500 text-[10.5px] sm:text-[11px] px-2.5 py-1.5 rounded-md truncate">
                  Type a question...
                </div>
                <div className="p-1.5 bg-[#25D366] rounded-md text-black shrink-0">
                  <Send className="w-3 h-3" />
                </div>
              </div>
            </div>

            {/* Verification Note */}
            <p className="text-[10px] sm:text-[11px] text-neutral-500 text-center">
              Target Phone: <span className="font-mono text-neutral-300">+{cleanPhone}</span> • Direct API ready
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
