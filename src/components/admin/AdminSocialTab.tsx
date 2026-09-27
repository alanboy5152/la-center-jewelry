import React, { useState, useEffect } from 'react';
import {
  Share2,
  Instagram,
  Facebook,
  Youtube,
  Check,
  ExternalLink,
  Save,
  Globe,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminSocialTab: React.FC = () => {
  const { siteSettings, updateSiteSettings, showToast } = useApp();

  const [form, setForm] = useState({
    instagram: siteSettings.socialLinks?.instagram || '',
    facebook: siteSettings.socialLinks?.facebook || '',
    youtube: siteSettings.socialLinks?.youtube || '',
    tiktok: siteSettings.socialLinks?.tiktok || '',
  });

  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (siteSettings.socialLinks) {
      setForm({
        instagram: siteSettings.socialLinks.instagram || '',
        facebook: siteSettings.socialLinks.facebook || '',
        youtube: siteSettings.socialLinks.youtube || '',
        tiktok: siteSettings.socialLinks.tiktok || '',
      });
    }
  }, [siteSettings.socialLinks]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateSiteSettings({
      ...siteSettings,
      socialLinks: {
        instagram: form.instagram.trim(),
        facebook: form.facebook.trim(),
        youtube: form.youtube.trim(),
        tiktok: form.tiktok.trim(),
      },
    });

    setIsSaved(true);
    showToast('Social media links updated successfully and applied to storefront footer.', 'success');
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleTestLink = (url: string, platformName: string) => {
    if (!url.trim()) {
      showToast(`Please enter a valid ${platformName} URL first.`, 'error');
      return;
    }
    const targetUrl = url.startsWith('http') ? url : `https://${url}`;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-3 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 border-b border-[#2D211B] pb-3 sm:pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-lg sm:text-2xl font-normal text-white">
              Social Media Channels
            </h2>
            <span className="bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 text-[9.5px] sm:text-[10px] uppercase font-bold px-1.5 py-0.5 tracking-wider">
              Footer
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-neutral-400 mt-1">
            Connect your brand&apos;s verified social handles displayed under <strong className="text-white">&quot;FOLLOW THE ATELIER&quot;</strong>.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="w-full sm:w-auto px-4 py-2 sm:px-5 sm:py-2.5 bg-[#D4AF37] hover:bg-[#b59226] text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-md shrink-0"
        >
          {isSaved ? <Check className="w-4 h-4 text-emerald-950" /> : <Save className="w-4 h-4" />}
          <span>{isSaved ? 'Saved Live' : 'Save Social Links'}</span>
        </button>
      </div>

      {/* Live Storefront Footer Preview Card */}
      <div className="p-3 sm:p-5 bg-gradient-to-r from-[#1E1714] to-[#16100E] border border-[#3A2A22] rounded-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
          <div>
            <span className="text-[9.5px] sm:text-[10px] font-mono uppercase tracking-[0.2em] text-[#D4AF37] block mb-0.5 sm:mb-1">
              Live Storefront Preview
            </span>
            <span className="text-xs uppercase tracking-widest text-neutral-300 font-semibold block">
              FOLLOW THE ATELIER
            </span>
            <p className="text-[10.5px] sm:text-[11px] text-neutral-400 mt-0.5">
              How patrons experience your social links in the footer:
            </p>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3 bg-[#120E0C] p-2 sm:p-3 border border-[#2D211B] rounded-xs self-start sm:self-auto">
            {/* Instagram Preview */}
            <div
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all ${
                form.instagram.trim()
                  ? 'bg-[#202020] text-[#D4AF37] border border-[#D4AF37]/40 shadow-xs'
                  : 'bg-neutral-900 text-neutral-600 border border-neutral-800 opacity-40'
              }`}
              title={form.instagram.trim() ? `Instagram: ${form.instagram}` : 'Instagram (Not configured)'}
            >
              <Instagram className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>

            {/* Facebook Preview */}
            <div
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all ${
                form.facebook.trim()
                  ? 'bg-[#202020] text-[#D4AF37] border border-[#D4AF37]/40 shadow-xs'
                  : 'bg-neutral-900 text-neutral-600 border border-neutral-800 opacity-40'
              }`}
              title={form.facebook.trim() ? `Facebook: ${form.facebook}` : 'Facebook (Not configured)'}
            >
              <Facebook className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>

            {/* YouTube Preview */}
            <div
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all ${
                form.youtube.trim()
                  ? 'bg-[#202020] text-[#D4AF37] border border-[#D4AF37]/40 shadow-xs'
                  : 'bg-neutral-900 text-neutral-600 border border-neutral-800 opacity-40'
              }`}
              title={form.youtube.trim() ? `YouTube: ${form.youtube}` : 'YouTube (Not configured)'}
            >
              <Youtube className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>

            {/* TikTok Preview */}
            <div
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all ${
                form.tiktok.trim()
                  ? 'bg-[#202020] text-[#D4AF37] border border-[#D4AF37]/40 shadow-xs'
                  : 'bg-neutral-900 text-neutral-600 border border-neutral-800 opacity-40'
              }`}
              title={form.tiktok.trim() ? `TikTok: ${form.tiktok}` : 'TikTok (Not configured)'}
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.34 6.34 0 0 0 1.86-4.49V8.52a8.27 8.27 0 0 0 4.75 1.48V6.69h-.84z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main Configuration Form */}
      <form onSubmit={handleSubmit} className="bg-[#181210] border border-[#2D211B] p-3 sm:p-6 md:p-8 space-y-3 sm:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-6">
          {/* 1. Instagram */}
          <div className="p-2.5 sm:p-4 bg-[#140F0D] border border-[#2B1F19] rounded-xs space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-2.5">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xs bg-[#24171D] border border-[#4D2335] text-[#E1306C] flex items-center justify-center">
                  <Instagram className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Instagram Profile</h4>
                  <span className="text-[10px] text-neutral-400">Jewelry showcase &amp; stories</span>
                </div>
              </div>

              {form.instagram && (
                <button
                  type="button"
                  onClick={() => handleTestLink(form.instagram, 'Instagram')}
                  className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-[#201815] hover:bg-[#2C211C] border border-[#3E2D25] text-neutral-300 hover:text-white text-[10px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Test</span>
                  <ExternalLink className="w-3 h-3 text-[#D4AF37]" />
                </button>
              )}
            </div>

            <div>
              <label className="text-[10.5px] sm:text-[11px] text-neutral-400 font-medium block mb-1">
                Instagram URL
              </label>
              <input
                type="url"
                value={form.instagram}
                onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                placeholder="https://instagram.com/lacenterjewelry"
                className="w-full bg-[#100D0B] border border-[#3E2D25] focus:border-[#D4AF37] px-2.5 py-2 sm:py-2.5 text-xs text-white placeholder:text-neutral-600 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* 2. Facebook */}
          <div className="p-2.5 sm:p-4 bg-[#140F0D] border border-[#2B1F19] rounded-xs space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-2.5">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xs bg-[#121A28] border border-[#1E3A5F] text-[#1877F2] flex items-center justify-center">
                  <Facebook className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Facebook Page</h4>
                  <span className="text-[10px] text-neutral-400">Official business salon page</span>
                </div>
              </div>

              {form.facebook && (
                <button
                  type="button"
                  onClick={() => handleTestLink(form.facebook, 'Facebook')}
                  className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-[#201815] hover:bg-[#2C211C] border border-[#3E2D25] text-neutral-300 hover:text-white text-[10px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Test</span>
                  <ExternalLink className="w-3 h-3 text-[#D4AF37]" />
                </button>
              )}
            </div>

            <div>
              <label className="text-[10.5px] sm:text-[11px] text-neutral-400 font-medium block mb-1">
                Facebook URL
              </label>
              <input
                type="url"
                value={form.facebook}
                onChange={(e) => setForm({ ...form, facebook: e.target.value })}
                placeholder="https://facebook.com/lacenterjewelry"
                className="w-full bg-[#100D0B] border border-[#3E2D25] focus:border-[#D4AF37] px-2.5 py-2 sm:py-2.5 text-xs text-white placeholder:text-neutral-600 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* 3. YouTube */}
          <div className="p-2.5 sm:p-4 bg-[#140F0D] border border-[#2B1F19] rounded-xs space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-2.5">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xs bg-[#241313] border border-[#4F1E1E] text-[#FF0000] flex items-center justify-center">
                  <Youtube className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">YouTube Channel</h4>
                  <span className="text-[10px] text-neutral-400">Artisan craft &amp; diamond videos</span>
                </div>
              </div>

              {form.youtube && (
                <button
                  type="button"
                  onClick={() => handleTestLink(form.youtube, 'YouTube')}
                  className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-[#201815] hover:bg-[#2C211C] border border-[#3E2D25] text-neutral-300 hover:text-white text-[10px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Test</span>
                  <ExternalLink className="w-3 h-3 text-[#D4AF37]" />
                </button>
              )}
            </div>

            <div>
              <label className="text-[10.5px] sm:text-[11px] text-neutral-400 font-medium block mb-1">
                YouTube URL
              </label>
              <input
                type="url"
                value={form.youtube}
                onChange={(e) => setForm({ ...form, youtube: e.target.value })}
                placeholder="https://youtube.com/@lacenterjewelry"
                className="w-full bg-[#100D0B] border border-[#3E2D25] focus:border-[#D4AF37] px-2.5 py-2 sm:py-2.5 text-xs text-white placeholder:text-neutral-600 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* 4. TikTok */}
          <div className="p-2.5 sm:p-4 bg-[#140F0D] border border-[#2B1F19] rounded-xs space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-2.5">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xs bg-[#141A1C] border border-[#1E363D] text-[#00f2fe] flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.34 6.34 0 0 0 1.86-4.49V8.52a8.27 8.27 0 0 0 4.75 1.48V6.69h-.84z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">TikTok Handle</h4>
                  <span className="text-[10px] text-neutral-400">Viral jewelry styling &amp; BTS</span>
                </div>
              </div>

              {form.tiktok && (
                <button
                  type="button"
                  onClick={() => handleTestLink(form.tiktok, 'TikTok')}
                  className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-[#201815] hover:bg-[#2C211C] border border-[#3E2D25] text-neutral-300 hover:text-white text-[10px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Test</span>
                  <ExternalLink className="w-3 h-3 text-[#D4AF37]" />
                </button>
              )}
            </div>

            <div>
              <label className="text-[10.5px] sm:text-[11px] text-neutral-400 font-medium block mb-1">
                TikTok URL
              </label>
              <input
                type="url"
                value={form.tiktok}
                onChange={(e) => setForm({ ...form, tiktok: e.target.value })}
                placeholder="https://tiktok.com/@lacenterjewelry"
                className="w-full bg-[#100D0B] border border-[#3E2D25] focus:border-[#D4AF37] px-2.5 py-2 sm:py-2.5 text-xs text-white placeholder:text-neutral-600 focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="pt-3 sm:pt-4 border-t border-[#261E1A] flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4">
          <p className="text-[10.5px] sm:text-[11px] text-neutral-400 text-center sm:text-left">
            Empty fields will simply hide that icon in the footer so your storefront stays clean.
          </p>

          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2.5 sm:px-6 sm:py-3 bg-[#D4AF37] hover:bg-[#b59226] text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-lg"
          >
            <Check className="w-4 h-4" />
            <span>Save Social Links</span>
          </button>
        </div>
      </form>
    </div>
  );
};
