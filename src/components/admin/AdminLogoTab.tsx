import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Check,
  RotateCcw,
  Sparkles,
  Eye,
  Sliders,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Monitor,
  Moon,
  Sun,
  Maximize2,
  Trash2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminLogoTab: React.FC = () => {
  const { siteSettings, updateSiteSettings, showToast, navigateTo } = useApp();

  const [previewUrl, setPreviewUrl] = useState<string>(
    siteSettings.logoUrl || ''
  );
  const [logoHeight, setLogoHeight] = useState<number>(
    siteSettings.logoHeight || 44
  );
  const [logoGlow, setLogoGlow] = useState<boolean>(
    siteSettings.logoGlow !== false
  );
  const [logoBoxBorder, setLogoBoxBorder] = useState<boolean>(
    siteSettings.logoBoxBorder !== false
  );
  const [urlInput, setUrlInput] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [imageMeta, setImageMeta] = useState<{
    width?: number;
    height?: number;
    format?: string;
    sizeKb?: number;
  }>({});
  const [isSaved, setIsSaved] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Measure current image resolution
  useEffect(() => {
    if (!previewUrl) {
      setImageMeta({});
      return;
    }
    const img = new Image();
    img.onload = () => {
      setImageMeta((prev) => ({
        ...prev,
        width: img.naturalWidth,
        height: img.naturalHeight,
      }));
    };
    img.src = previewUrl;
  }, [previewUrl]);

  // Keep in sync with siteSettings
  useEffect(() => {
    setPreviewUrl(siteSettings.logoUrl || '');
    setLogoHeight(siteSettings.logoHeight || 44);
    setLogoGlow(siteSettings.logoGlow !== false);
    setLogoBoxBorder(Boolean(siteSettings.logoBoxBorder));
  }, [siteSettings.logoUrl, siteSettings.logoHeight, siteSettings.logoGlow, siteSettings.logoBoxBorder]);

  const applyAndSaveLogo = (url: string, format: string, sizeKb: number) => {
    setPreviewUrl(url);
    setImageMeta({ format, sizeKb });
    
    // Immediately save and apply to entire store without requiring extra clicks
    updateSiteSettings({
      ...siteSettings,
      logoUrl: url,
      logoHeight: logoHeight,
      logoGlow: logoGlow,
      logoBoxBorder: logoBoxBorder,
    });
    setIsSaved(true);
    showToast('Logo uploaded and applied to storefront successfully!', 'success');
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file (PNG, SVG, JPG, WebP).', 'error');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      showToast('Logo file size cannot exceed 8 MB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const rawDataUrl = e.target?.result as string;
      if (!rawDataUrl) return;

      // For SVG files, keep vector data intact
      if (file.type === 'image/svg+xml') {
        applyAndSaveLogo(rawDataUrl, 'SVG', Math.round(file.size / 1024));
        return;
      }

      // For raster images (PNG, JPEG, WebP, etc.), optimize with high-DPI canvas
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const maxDim = 512;
          let width = img.naturalWidth || img.width;
          let height = img.naturalHeight || img.height;

          const originalWidth = width;
          const originalHeight = height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.clearRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);
            const optimizedDataUrl = canvas.toDataURL('image/png', 0.96);
            const approxKb = Math.round((optimizedDataUrl.length * 3) / 4 / 1024);
            
            setImageMeta({
              width: originalWidth,
              height: originalHeight,
              format: 'PNG',
              sizeKb: approxKb,
            });
            applyAndSaveLogo(optimizedDataUrl, 'PNG', approxKb);
          } else {
            applyAndSaveLogo(rawDataUrl, file.type.split('/')[1]?.toUpperCase() || 'PNG', Math.round(file.size / 1024));
          }
        } catch {
          applyAndSaveLogo(rawDataUrl, file.type.split('/')[1]?.toUpperCase() || 'PNG', Math.round(file.size / 1024));
        }
      };
      img.onerror = () => {
        applyAndSaveLogo(rawDataUrl, file.type.split('/')[1]?.toUpperCase() || 'PNG', Math.round(file.size / 1024));
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    setPreviewUrl(urlInput.trim());
    setIsSaved(false);
    showToast('Logo loaded from URL!', 'success');
  };

  const handleSaveLogo = () => {
    updateSiteSettings({
      ...siteSettings,
      logoUrl: previewUrl,
      logoHeight: logoHeight,
      logoGlow: logoGlow,
      logoBoxBorder: logoBoxBorder,
    });
    setIsSaved(true);
    showToast('Logo updated successfully across header, footer, admin and favicon!', 'success');
  };

  const handleRemoveLogo = () => {
    setPreviewUrl('');
    setImageMeta({});
    updateSiteSettings({
      ...siteSettings,
      logoUrl: '',
    });
    setIsSaved(true);
    showToast('Logo removed from menu bar and storefront.', 'info');
  };

  const handleResetToDefault = () => {
    const defaultUrl = '/assets/la-logo.svg';
    setPreviewUrl(defaultUrl);
    setLogoHeight(44);
    setLogoGlow(true);
    setLogoBoxBorder(true);
    updateSiteSettings({
      ...siteSettings,
      logoUrl: defaultUrl,
      logoHeight: 44,
      logoGlow: true,
      logoBoxBorder: true,
    });
    setIsSaved(true);
    showToast('Default monogram logo restored.', 'info');
  };

  return (
    <div className="space-y-3.5 sm:space-y-8 max-w-5xl">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 border-b border-[#2D211B] pb-3 sm:pb-6">
        <div>
          <div className="flex items-center gap-2 sm:gap-2.5">
            <span className="p-1.5 sm:p-2 bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 rounded-xs">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </span>
            <h2 className="font-serif text-lg sm:text-2xl font-normal text-white tracking-wide">
              Brand Logo &amp; Favicon Studio
            </h2>
          </div>
          <p className="text-[11px] sm:text-xs text-neutral-400 mt-1 max-w-2xl leading-relaxed">
            Upload or select your brand logo (PNG, SVG, WebP, JPG) for the storefront menu bar and branding.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2 sm:gap-2.5">
          {previewUrl && (
            <button
              type="button"
              onClick={handleRemoveLogo}
              className="px-3 py-1.5 sm:px-3.5 sm:py-2 bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-white border border-red-800/50 text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 transition-colors cursor-pointer rounded-xs"
              title="Remove logo from store"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-400" />
              <span>Remove</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleSaveLogo}
            className="w-full sm:w-auto px-4 py-2 sm:px-5 sm:py-2 bg-[#D4AF37] hover:bg-[#b59226] text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-[0_2px_12px_rgba(212,175,55,0.25)] cursor-pointer rounded-xs"
          >
            <Check className="w-4 h-4" />
            <span>Save &amp; Apply Logo</span>
          </button>
        </div>
      </div>

      {/* Grid: Upload & Controls + Live Previews */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-8">
        {/* Left Column: Upload Methods & Sizing (7 cols) */}
        <div className="lg:col-span-7 space-y-3.5 sm:space-y-6">
          {/* Direct File Dropzone */}
          <div className="bg-[#181210] border-2 border-[#D4AF37]/40 p-3.5 sm:p-6 space-y-3 sm:space-y-4 rounded-xs shadow-md">
            <div className="flex items-center justify-between">
              <label className="text-xs uppercase font-bold text-white tracking-wider flex items-center gap-2">
                <Upload className="w-4 h-4 text-[#D4AF37]" />
                <span>Menu Bar Logo Upload Box</span>
              </label>
              <span className="text-[9.5px] sm:text-[10px] text-amber-400 bg-amber-950/60 border border-amber-800/60 px-1.5 py-0.5 uppercase font-mono font-bold">
                Header Box
              </span>
            </div>

            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xs p-4 sm:p-8 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                  : 'border-[#4A372E] hover:border-[#D4AF37] bg-[#140E0C] hover:bg-[#1A1310]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/svg+xml,image/jpeg,image/webp,image/gif"
                onChange={handleFileInputChange}
                className="hidden"
              />

              <div className="w-10 h-10 sm:w-14 sm:h-14 mx-auto mb-2 sm:mb-3 rounded-xs bg-[#201714] border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] group-hover:scale-105 transition-transform shadow-xs">
                <Upload className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>

              <p className="text-xs sm:text-sm font-medium text-white mb-0.5 sm:mb-1">
                Click to upload or drag &amp; drop logo
              </p>
              <p className="text-[10.5px] sm:text-xs text-neutral-400 max-w-md mx-auto">
                Upload PNG, SVG, JPG, or WebP logo file (up to 8 MB).
              </p>
            </div>

            {/* Auto-Save Status & Resolution Meta Card */}
            <div className="p-2.5 sm:p-3 bg-[#130E0C] border border-[#2A1E19] flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-300 rounded-xs">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-emerald-400 font-semibold text-[10px] sm:text-[11px] uppercase tracking-wider">
                  Auto-Sync: Saved &amp; applied
                </span>
              </div>

              {imageMeta.format && (
                <div className="flex items-center gap-1.5 sm:gap-2 font-mono text-[10px] sm:text-[11px] text-neutral-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  {imageMeta.width && (
                    <span>{imageMeta.width}×{imageMeta.height}px</span>
                  )}
                  <span>{imageMeta.format}</span>
                  {imageMeta.sizeKb && (
                    <span>({imageMeta.sizeKb} KB)</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Alternative: Image URL Input */}
          <div className="bg-[#181210] border border-[#2D211B] p-3.5 sm:p-6 space-y-2.5 sm:space-y-4">
            <label className="text-xs uppercase font-bold text-white tracking-wider flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#D4AF37]" />
              <span>Or Provide Image URL</span>
            </label>

            <form onSubmit={handleApplyUrl} className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/brand-logo.png"
                className="flex-1 bg-[#120E0C] border border-[#3E2D25] px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
              />
              <button
                type="submit"
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-[#261E1A] hover:bg-[#342823] text-neutral-200 hover:text-white border border-[#3E2D25] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer shrink-0"
              >
                Load
              </button>
            </form>
            <p className="text-[10px] sm:text-[11px] text-neutral-400">
              Paste a direct image URL from external image hosting or cloud storage.
            </p>
          </div>

          {/* Quick Select: Curated Luxury Logo Styles */}
          <div className="bg-[#181210] border border-[#2D211B] p-3.5 sm:p-6 space-y-2.5 sm:space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs uppercase font-bold text-white tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <span>Curated Luxury Logo Presets</span>
              </label>
              <span className="text-[10px] text-neutral-400">1-Click Apply</span>
            </div>
            <p className="text-[10.5px] sm:text-[11px] text-neutral-400">
              Select any pre-designed luxury logo below to preview instantly:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
              {[
                {
                  id: 'classic-la',
                  title: 'Classic L.A Gold',
                  url: '/assets/la-logo.svg',
                  tag: 'Original Monogram',
                },
                {
                  id: 'royal-crown',
                  title: 'Royal Crown',
                  url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23FFF6D5"/><stop offset="50%" stop-color="%23D4AF37"/><stop offset="100%" stop-color="%238C7322"/></linearGradient></defs><polygon points="15,65 25,30 50,50 75,30 85,65" fill="none" stroke="url(%23g1)" stroke-width="4"/><circle cx="25" cy="28" r="4" fill="url(%23g1)"/><circle cx="50" cy="48" r="4" fill="url(%23g1)"/><circle cx="75" cy="28" r="4" fill="url(%23g1)"/><rect x="15" y="68" width="70" height="7" rx="2" fill="url(%23g1)"/><polygon points="50,22 55,30 45,30" fill="url(%23g1)"/></svg>',
                  tag: 'Jeweled Crown',
                },
                {
                  id: 'faceted-diamond',
                  title: 'Solitaire Diamond',
                  url: '/assets/diamond-logo.svg',
                  tag: 'Brilliant Diamond',
                },
                {
                  id: 'deco-crest',
                  title: 'Imperial Crest',
                  url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23FFE8A3"/><stop offset="50%" stop-color="%23D4AF37"/><stop offset="100%" stop-color="%237A5F14"/></linearGradient></defs><circle cx="50" cy="50" r="38" fill="none" stroke="url(%23g3)" stroke-width="3"/><circle cx="50" cy="50" r="34" fill="none" stroke="url(%23g3)" stroke-width="1" stroke-dasharray="2,2"/><text x="50" y="58" font-family="serif" font-size="28" font-weight="bold" fill="url(%23g3)" text-anchor="middle" letter-spacing="1">LA</text></svg>',
                  tag: 'Modern Crest',
                },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    applyAndSaveLogo(item.url, 'SVG Vector', 2);
                    showToast(`${item.title} logo selected and applied!`, 'success');
                  }}
                  className={`p-2.5 sm:p-3 bg-[#130E0C] border transition-all rounded-xs text-center flex flex-col items-center gap-1.5 sm:gap-2 cursor-pointer group hover:border-[#D4AF37] ${
                    previewUrl === item.url
                      ? 'border-[#D4AF37] ring-1 ring-[#D4AF37]/50 bg-[#1D1411]'
                      : 'border-[#2A1E19]'
                  }`}
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center p-1 bg-black/40 rounded-xs group-hover:scale-105 transition-transform">
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-contain filter drop-shadow-[0_1px_4px_rgba(212,175,55,0.4)]"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-medium text-neutral-200 block truncate w-full">
                    {item.title}
                  </span>
                  <span className="text-[8.5px] sm:text-[9px] text-[#D4AF37] block font-mono">
                    {item.tag}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Sizing & Visual Controls */}
          <div className="bg-[#181210] border border-[#2D211B] p-3.5 sm:p-6 space-y-3.5 sm:space-y-5">
            <div className="flex items-center justify-between">
              <label className="text-xs uppercase font-bold text-white tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#D4AF37]" />
                <span>Logo Display Size &amp; Styling</span>
              </label>
              <span className="text-xs font-mono font-bold text-[#D4AF37]">
                {logoHeight}px Height
              </span>
            </div>

            {/* Height Slider */}
            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex items-center justify-between text-[11px] sm:text-xs text-neutral-400">
                <span>Compact (28px)</span>
                <span>Standard (44px)</span>
                <span>Large (68px)</span>
              </div>
              <input
                type="range"
                min={28}
                max={72}
                step={2}
                value={logoHeight}
                onChange={(e) => {
                  setLogoHeight(Number(e.target.value));
                  setIsSaved(false);
                }}
                className="w-full accent-[#D4AF37] cursor-pointer"
              />
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 sm:gap-2 pt-1 flex-wrap">
              <span className="text-[10px] sm:text-[11px] text-neutral-400 uppercase tracking-wider mr-1">
                Presets:
              </span>
              {[
                { label: 'Compact', val: 34 },
                { label: 'Balanced', val: 42 },
                { label: 'Prominent', val: 50 },
                { label: 'Large', val: 60 },
              ].map((p) => (
                <button
                  key={p.val}
                  type="button"
                  onClick={() => {
                    setLogoHeight(p.val);
                    setIsSaved(false);
                  }}
                  className={`px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider transition-colors cursor-pointer border ${
                    logoHeight === p.val
                      ? 'bg-[#D4AF37] text-black font-bold border-[#D4AF37]'
                      : 'bg-[#120E0C] text-neutral-400 hover:text-white border-[#33251F]'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Box Border Toggle */}
            <div className="pt-2.5 sm:pt-3 border-t border-[#261E1A] flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-white block">
                  Dedicated Logo Box Frame
                </span>
                <span className="text-[10px] sm:text-[11px] text-neutral-400">
                  Displays a refined golden bordered frame in the header.
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={logoBoxBorder}
                  onChange={(e) => {
                    setLogoBoxBorder(e.target.checked);
                    setIsSaved(false);
                  }}
                  className="sr-only peer"
                />
                <div className="w-10 h-5.5 sm:w-11 sm:h-6 bg-[#251D19] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4.5 after:w-4.5 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-[#D4AF37]" />
              </label>
            </div>

            {/* Glow/Shadow Toggle */}
            <div className="pt-2.5 sm:pt-3 border-t border-[#261E1A] flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-white block">
                  Luxury Gold Glow / Drop Shadow
                </span>
                <span className="text-[10px] sm:text-[11px] text-neutral-400">
                  Adds a subtle luxury gold shadow behind the logo.
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={logoGlow}
                  onChange={(e) => {
                    setLogoGlow(e.target.checked);
                    setIsSaved(false);
                  }}
                  className="sr-only peer"
                />
                <div className="w-10 h-5.5 sm:w-11 sm:h-6 bg-[#251D19] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4.5 after:w-4.5 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-[#D4AF37]" />
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: High-Res Real-Time Live Previews (5 cols) */}
        <div className="lg:col-span-5 space-y-3.5 sm:space-y-6">
          <div className="bg-[#181210] border border-[#2D211B] p-3.5 sm:p-6 space-y-3 sm:space-y-6 lg:sticky lg:top-20">
            <div className="flex items-center justify-between border-b border-[#2D211B] pb-2.5 sm:pb-4">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#D4AF37]" />
                <h3 className="font-serif text-sm sm:text-base font-normal text-white tracking-wide">
                  Live Storefront Previews
                </h3>
              </div>
              <span className="text-[9.5px] sm:text-[10px] text-neutral-400 uppercase font-mono">
                Real-Time
              </span>
            </div>

            {/* Preview 1: Header Light Mode (Actual Storefront Header Look) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-neutral-400 uppercase tracking-wider">
                <span className="flex items-center gap-1.5 text-neutral-200">
                  <Sun className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Storefront Header (Light Bar)</span>
                </span>
                <span className="text-[10px] font-mono text-neutral-500">#FAF9F5</span>
              </div>

              <div className="bg-[#FAF9F5] border border-neutral-300 p-4 rounded-xs shadow-xs">
                <div className="flex items-center gap-3">
                  {/* Dedicated Logo Box - Shown only when logo is set */}
                  {previewUrl ? (
                    <div
                      className={`shrink-0 flex items-center justify-center rounded-xs overflow-hidden transition-all ${
                        logoBoxBorder
                          ? 'border border-[#D4AF37]/60 bg-white shadow-[0_1px_4px_rgba(212,175,55,0.18)] p-1'
                          : 'bg-transparent'
                      }`}
                      style={{
                        height: `${Math.min(Math.max(logoHeight, 36), 60)}px`,
                        width: `${Math.min(Math.max(logoHeight, 36), 60)}px`,
                      }}
                    >
                      <img
                        src={previewUrl}
                        alt="Brand Logo Preview"
                        className={`w-full h-full object-contain select-none transition-all ${
                          logoGlow ? 'filter drop-shadow-[0_1px_3px_rgba(212,175,55,0.35)]' : ''
                        }`}
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ) : null}
                  {/* Store Name - Exactly aligned and leveled with the logo box, no subtitle */}
                  <div className="flex items-center">
                    <span className="font-serif text-base lg:text-lg tracking-[0.1em] font-semibold text-[#1A1A1A] uppercase leading-none flex items-center">
                      L.A Center Jewelry
                    </span>
                  </div>
                </div>
                {!previewUrl && (
                  <div className="mt-3 py-2 px-3 bg-amber-50 border border-amber-200/80 rounded-xs text-[11px] text-amber-800 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>No logo uploaded. Store name only displayed in menu bar.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Preview 2: Footer Dark Mode */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-neutral-400 uppercase tracking-wider">
                <span className="flex items-center gap-1.5 text-neutral-200">
                  <Moon className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Storefront Footer (Dark Luxury)</span>
                </span>
                <span className="text-[10px] font-mono text-neutral-500">#16110F</span>
              </div>

              <div className="bg-[#16110F] border border-[#2E221C] p-4 rounded-xs">
                <div className="flex items-center gap-3">
                  {previewUrl ? (
                    <div className="shrink-0 flex items-center justify-center">
                      <img
                        src={previewUrl}
                        alt="Brand Logo Footer Preview"
                        style={{
                          height: `${Math.min(logoHeight + 4, 64)}px`,
                          width: 'auto',
                        }}
                        className={`object-contain select-none transition-all ${
                          logoGlow ? 'filter drop-shadow-[0_2px_8px_rgba(212,175,55,0.5)]' : ''
                        }`}
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ) : null}
                  <div className="min-w-0">
                    <span className="block font-serif text-base sm:text-lg tracking-[0.05em] font-semibold text-white uppercase leading-tight whitespace-nowrap">
                      L.A Center Jewelry Inc
                    </span>
                    <span className="block text-[8.5px] tracking-[0.12em] text-[#D4AF37] uppercase font-sans mt-0.5 leading-snug">
                      <span>Luxury Jewelry in the Heart</span>
                      <span className="block">of Los Angeles</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview 3: Browser Tab Favicon Simulation */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-neutral-400 uppercase tracking-wider">
                <span className="flex items-center gap-1.5 text-neutral-200">
                  <Monitor className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Browser Tab Favicon</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400">Auto-Synced</span>
              </div>

              <div className="bg-[#242424] border border-[#383838] p-2.5 rounded-t-md flex items-center gap-2 max-w-xs">
                <div className="w-5 h-5 shrink-0 rounded-xs bg-[#1A1A1A] p-0.5 flex items-center justify-center">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Favicon preview"
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  )}
                </div>
                <span className="text-[11px] text-neutral-200 truncate font-sans">
                  L.A Center Jewelry Inc | Luxury Fine Jewelry
                </span>
                <span className="text-neutral-500 text-xs ml-auto">×</span>
              </div>
            </div>

            {/* Direct Save Action Button in Card */}
            <div className="pt-3 border-t border-[#261E1A] space-y-2">
              <button
                type="button"
                onClick={handleSaveLogo}
                className="w-full py-3 bg-[#D4AF37] hover:bg-[#b59226] text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-lg cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Apply Logo to Entire Storefront</span>
              </button>

              <button
                type="button"
                onClick={() => navigateTo('home')}
                className="w-full py-2 bg-[#201714] hover:bg-[#2b1f1b] text-neutral-300 hover:text-white border border-[#3A2B23] text-[11px] uppercase tracking-wider font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>View Live Storefront</span>
                <ExternalLink className="w-3 h-3 text-[#D4AF37]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
