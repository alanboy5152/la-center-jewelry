import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Banner } from '../../types';
import {
  Upload,
  Image as ImageIcon,
  Check,
  Save,
  Sparkles,
  Eye,
  RefreshCw,
  ExternalLink,
  Plus,
  Trash2,
  Layers,
  ArrowRight,
  X,
} from 'lucide-react';

const DEFAULT_PRESET_JEWELRY_BANNERS = [
  {
    id: 'preset-bridal-svg',
    title: 'Bridal Solitaire Ring & Sapphire Earrings (Uploaded Artwork)',
    url: '/assets/bridal-jewelry-banner.svg',
    tag: 'Custom Vector Artwork',
  },
  {
    id: 'preset-sapphire-halo',
    title: 'Royal Ceylon Sapphire & Diamond Halo Cluster',
    url: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=1600&auto=format&fit=crop',
    tag: 'Sapphire & Diamonds',
  },
  {
    id: 'preset-elysian-solitaire',
    title: 'Elysian Solitaire Platinum Engagement Ring',
    url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1600&auto=format&fit=crop',
    tag: 'Diamond Solitaire',
  },
  {
    id: 'preset-haute-collection',
    title: 'Atelier Diamond Cascade High Jewelry',
    url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1600&auto=format&fit=crop',
    tag: 'Haute Joaillerie',
  },
];

const PRESETS_STORAGE_KEY = 'la_center_preset_banners_v1';

export const AdminBannersTab: React.FC = () => {
  const {
    banners,
    updateBanner,
    addBanner,
    deleteBanner,
    storefrontMedia,
    deleteStorefrontMedia,
    showToast,
  } = useApp();

  // Preset Banners with Delete/Restore capability
  const [presets, setPresets] = useState<typeof DEFAULT_PRESET_JEWELRY_BANNERS>(() => {
    try {
      const saved = localStorage.getItem(PRESETS_STORAGE_KEY);
      if (saved !== null) {
        return JSON.parse(saved);
      }
    } catch {}
    return DEFAULT_PRESET_JEWELRY_BANNERS;
  });

  const handleDeletePreset = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = presets.filter((p) => p.id !== id);
    setPresets(updated);
    try {
      localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
    showToast('Default preset image deleted.', 'info');
  };

  const handleRestorePresets = () => {
    setPresets(DEFAULT_PRESET_JEWELRY_BANNERS);
    try {
      localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(DEFAULT_PRESET_JEWELRY_BANNERS));
    } catch {}
    showToast('Default presets restored.', 'success');
  };

  // Selected banner to edit (defaults to middle bridal banner)
  const [selectedBannerId, setSelectedBannerId] = useState<string>(() => {
    const middle = banners.find((b) => b.position === 'middle');
    return middle ? middle.id : banners[0]?.id || 'ban-bridal';
  });

  const activeBanner = banners.find((b) => b.id === selectedBannerId) || banners[0];

  // Local editing form
  const [formData, setFormData] = useState<Banner>(
    activeBanner || {
      id: 'ban-bridal',
      title: 'The Broadway Bridal Atelier',
      subtitle: 'Private appointments and bespoke engagement consultations available.',
      buttonText: 'EXPLORE BRIDAL',
      buttonLink: '/shop?category=cat-bridal',
      mediaUrl: '/assets/bridal-jewelry-banner.svg',
      mediaType: 'image',
      position: 'middle',
      isActive: true,
      badge: 'EXCLUSIVE SALON',
    }
  );

  // Sync form when banner tab or selection changes
  const handleSelectBanner = (banner: Banner) => {
    setSelectedBannerId(banner.id);
    setFormData({ ...banner });
  };

  // Drag & drop upload state
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle local image file upload (converts to base64 DataURL for immediate persistent storage)
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WebP, SVG).', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        setFormData((prev) => ({
          ...prev,
          mediaUrl: dataUrl,
          mediaType: 'image',
        }));
        setUploadedFileName(`${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
        showToast(`Image "${file.name}" added. Click SAVE to apply.`, 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // Clear or delete currently assigned image
  const handleClearCurrentImage = () => {
    setFormData((prev) => ({ ...prev, mediaUrl: '' }));
    setUploadedFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    showToast('Banner image cleared.', 'info');
  };

  // Save changes
  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Banner title is required.', 'error');
      return;
    }

    const exists = banners.some((b) => b.id === formData.id);
    if (exists) {
      updateBanner(formData);
    } else {
      addBanner(formData);
    }
    showToast('Banner saved successfully.', 'success');
  };

  // Add new banner
  const handleAddNewBanner = () => {
    const newId = `ban-${Date.now()}`;
    const newBanner: Banner = {
      id: newId,
      title: 'New Professional Banner',
      subtitle: 'Exclusive luxury jewelry reserve and private viewings.',
      buttonText: 'EXPLORE RESERVE',
      buttonLink: '/shop',
      mediaUrl: '',
      mediaType: 'image',
      position: 'middle',
      isActive: true,
      badge: 'SPECIAL COLLECTION',
    };
    addBanner(newBanner);
    setSelectedBannerId(newId);
    setFormData(newBanner);
    showToast('New banner created.', 'success');
  };

  // Delete banner
  const handleDeleteCurrentBanner = () => {
    if (banners.length <= 1) {
      const resetBanner: Banner = {
        ...formData,
        mediaUrl: '',
        title: 'New Professional Banner',
        subtitle: '',
        isActive: false,
      };
      updateBanner(resetBanner);
      setFormData(resetBanner);
      showToast('Banner reset to empty draft.', 'info');
      return;
    }
    deleteBanner(formData.id);
    const remaining = banners.filter((b) => b.id !== formData.id);
    if (remaining[0]) {
      setSelectedBannerId(remaining[0].id);
      setFormData(remaining[0]);
    }
    showToast('Banner deleted.', 'info');
  };

  return (
    <div className="space-y-8 text-neutral-200">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#2C221D]">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="font-serif text-2xl font-normal text-white">
              Professional Banners
            </h2>
            <span className="px-2.5 py-0.5 bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider rounded-sm">
              Live Showcase
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Manage homepage promotional and bridal banners, upload custom images, or select presets.
          </p>
        </div>

        <button
          type="button"
          id="admin-add-banner-btn"
          onClick={handleAddNewBanner}
          className="px-4 py-2 bg-[#1E1714] hover:bg-[#2A201B] border border-[#3E2D25] hover:border-[#D4AF37] text-white text-xs uppercase font-bold tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>New Banner</span>
        </button>
      </div>

      {/* Banner Selector Pills */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 border-b border-[#241A15] scrollbar-none">
        {banners.map((banner) => {
          const isSelected = banner.id === selectedBannerId;
          const isMiddleHomepage = banner.position === 'middle';
          return (
            <div
              key={banner.id}
              className={`flex items-center text-xs uppercase tracking-wider transition-all rounded-xs overflow-hidden ${
                isSelected
                  ? 'bg-[#D4AF37] text-black font-bold shadow-md'
                  : 'bg-[#181210] text-neutral-300 hover:text-white border border-[#2D211B]'
              }`}
            >
              <button
                type="button"
                onClick={() => handleSelectBanner(banner)}
                className="px-4 py-2 flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{banner.title || 'Untitled Banner'}</span>
                {isMiddleHomepage && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                      isSelected ? 'bg-black/20 text-black' : 'bg-[#D4AF37]/20 text-[#D4AF37]'
                    }`}
                  >
                    Homepage
                  </span>
                )}
                {banner.isActive ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Active on Storefront" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-500" title="Inactive" />
                )}
              </button>

              {banners.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Delete banner "${banner.title || 'Untitled'}"?`)) {
                      deleteBanner(banner.id);
                      if (banner.id === selectedBannerId) {
                        const next = banners.find((b) => b.id !== banner.id);
                        if (next) {
                          setSelectedBannerId(next.id);
                          setFormData(next);
                        }
                      }
                      showToast('Banner deleted.', 'info');
                    }
                  }}
                  title="Delete this banner"
                  className={`px-2 py-2 transition-colors cursor-pointer ${
                    isSelected
                      ? 'text-black/60 hover:text-red-950 hover:bg-black/10'
                      : 'text-neutral-500 hover:text-red-400 hover:bg-neutral-800'
                  }`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Main Grid: Left Controls (7 cols) / Right Live Preview (5 cols) */}
      <form onSubmit={handleSaveBanner} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form & Image Upload Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Banner Image Upload */}
          <div className="bg-[#181210] border border-[#2D211B] p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ImageIcon className="w-4 h-4 text-[#D4AF37]" />
                <h3 className="font-serif text-base font-medium text-white tracking-wide">
                  Jewelry Banner Image
                </h3>
              </div>
              <span className="text-[11px] text-neutral-400">
                Recommended: 1600×800px or wide ratio
              </span>
            </div>

            {/* Drag and Drop Zone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed p-6 text-center cursor-pointer transition-all rounded-sm flex flex-col items-center justify-center gap-3 ${
                isDragging
                  ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                  : 'border-[#3D2C24] hover:border-[#D4AF37] bg-[#120E0C]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
                id="banner-image-file-input"
              />
              <div className="w-12 h-12 rounded-full bg-[#241A16] border border-[#3E2D25] flex items-center justify-center text-[#D4AF37]">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">
                  Click to choose an image or drag &amp; drop here
                </p>
                <p className="text-[11px] text-neutral-400 mt-1">
                  Upload your jewelry image (PNG, JPG, WebP, or SVG) directly from your device
                </p>
              </div>

              {/* Current Loaded Image Card with prominent DELETE button */}
              {formData.mediaUrl && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="w-full mt-2 p-3 bg-[#1D1613] border border-[#3E2D25] rounded-xs flex items-center justify-between gap-3 text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={formData.mediaUrl}
                      alt="Banner Preview"
                      className="w-14 h-10 object-cover border border-[#D4AF37]/50 rounded-xs bg-black shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">
                        {uploadedFileName || 'Active banner image'}
                      </p>
                      <p className="text-[10px] text-neutral-400 font-mono truncate max-w-[260px]">
                        {formData.mediaUrl.startsWith('data:')
                          ? 'Uploaded Base64 image'
                          : formData.mediaUrl}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleClearCurrentImage}
                    title="Remove current image"
                    className="px-3 py-1.5 bg-red-950/60 hover:bg-red-800 border border-red-700/60 text-red-200 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-300" />
                    <span>Remove Image</span>
                  </button>
                </div>
              )}
            </div>

            {/* Direct Image URL input + Delete Button */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs uppercase font-semibold text-neutral-300">
                  Or Paste Image URL / Asset Path
                </label>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="banner-image-url-input"
                  value={formData.mediaUrl}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, mediaUrl: e.target.value }))
                  }
                  placeholder="/assets/bridal-jewelry-banner.svg or https://images.unsplash.com/..."
                  className="flex-1 bg-[#120E0C] border border-[#3D2C24] px-3 py-2 text-xs text-white font-mono focus:border-[#D4AF37] focus:outline-none"
                />

                {formData.mediaUrl && (
                  <>
                    <button
                      type="button"
                      onClick={handleClearCurrentImage}
                      title="Remove Image"
                      className="px-3 py-2 bg-red-950/50 hover:bg-red-900 border border-red-800/80 text-red-300 hover:text-white flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                      <span>Remove</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => window.open(formData.mediaUrl, '_blank')}
                      title="Open Image in new tab"
                      className="px-3 py-2 bg-[#221814] border border-[#3D2C24] text-neutral-300 hover:text-white cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Quick Jewelry Image Presets (with DELETE option on each default image) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs uppercase font-semibold text-neutral-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Quick Preset Jewelry Banners</span>
                </label>
                {presets.length < DEFAULT_PRESET_JEWELRY_BANNERS.length && (
                  <button
                    type="button"
                    onClick={handleRestorePresets}
                    className="text-[11px] text-[#D4AF37] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Restore Default Presets</span>
                  </button>
                )}
              </div>

              {presets.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {presets.map((preset) => {
                    const isActive = formData.mediaUrl === preset.url;
                    return (
                      <div
                        key={preset.id}
                        className={`p-2 border text-left flex items-center justify-between gap-2.5 transition-all relative group rounded-xs ${
                          isActive
                            ? 'border-[#D4AF37] bg-[#2E2019]'
                            : 'border-[#2D211B] bg-[#140F0D] hover:border-[#4B372D]'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              mediaUrl: preset.url,
                              mediaType: 'image',
                            }));
                            setUploadedFileName(null);
                            showToast(`Selected "${preset.title}".`, 'info');
                          }}
                          className="flex items-center gap-2.5 flex-1 min-w-0 text-left cursor-pointer"
                        >
                          <img
                            src={preset.url}
                            alt={preset.title}
                            className="w-12 h-10 object-cover border border-neutral-700 shrink-0 bg-neutral-900 rounded-xs"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-medium text-white truncate">
                              {preset.title}
                            </p>
                            <p className="text-[9px] text-[#D4AF37] uppercase tracking-wide">
                              {preset.tag}
                            </p>
                          </div>
                          {isActive && <Check className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />}
                        </button>

                        {/* Delete this default preset button */}
                        <button
                          type="button"
                          onClick={(e) => handleDeletePreset(preset.id, e)}
                          title="Delete this preset image"
                          className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors cursor-pointer shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 bg-[#140F0D] border border-[#2D211B] flex items-center justify-between text-xs text-neutral-400 rounded-xs">
                  <span>All preset images removed.</span>
                  <button
                    type="button"
                    onClick={handleRestorePresets}
                    className="text-[#D4AF37] hover:underline flex items-center gap-1 font-medium cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Restore Default Presets</span>
                  </button>
                </div>
              )}
            </div>

            {/* Storefront Media Library Pickers (with DELETE option on each thumbnail) */}
            {storefrontMedia.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs uppercase font-semibold text-neutral-300">
                    Pick from Storefront Architectural Media
                  </label>
                  <span className="text-[10px] text-neutral-400">
                    Click image to select, click 🗑️ to delete
                  </span>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {storefrontMedia.map((sf) => (
                    <div
                      key={sf.id}
                      className="relative group shrink-0 w-20 h-14 border border-[#2D211B] hover:border-[#D4AF37] overflow-hidden bg-neutral-900 rounded-xs"
                      title={sf.title}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, mediaUrl: sf.url }));
                          showToast(`Picked "${sf.title}" from storefront media.`, 'info');
                        }}
                        className="w-full h-full cursor-pointer block"
                      >
                        <img src={sf.url} alt={sf.title} className="w-full h-full object-cover" />
                      </button>

                      {/* Delete this storefront media item */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Delete "${sf.title}"?`)) {
                            deleteStorefrontMedia(sf.id);
                            if (formData.mediaUrl === sf.url) {
                              setFormData((prev) => ({ ...prev, mediaUrl: '' }));
                            }
                            showToast(`"${sf.title}" deleted.`, 'info');
                          }
                        }}
                        title="Delete this media"
                        className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/80 hover:bg-red-600 text-neutral-300 hover:text-white flex items-center justify-center rounded-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Banner Content & Links */}
          <div className="bg-[#181210] border border-[#2D211B] p-6 space-y-4">
            <h3 className="font-serif text-base font-medium text-white tracking-wide pb-2 border-b border-[#281D17]">
              Banner Typography &amp; Actions
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs uppercase font-semibold text-neutral-300 block mb-1">
                  Badge Label
                </label>
                <input
                  type="text"
                  value={formData.badge || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, badge: e.target.value }))}
                  placeholder="e.g. EXCLUSIVE SALON"
                  className="w-full bg-[#120E0C] border border-[#3D2C24] px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs uppercase font-semibold text-neutral-300 block mb-1">
                  Storefront Placement
                </label>
                <select
                  value={formData.position}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      position: e.target.value as Banner['position'],
                    }))
                  }
                  className="w-full bg-[#120E0C] border border-[#3D2C24] px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                >
                  <option value="middle">Middle (Homepage Bridal / Showcase Section)</option>
                  <option value="hero">Hero Top</option>
                  <option value="bottom">Bottom Callout</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs uppercase font-semibold text-neutral-300 block mb-1">
                Headline / Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. The Broadway Bridal Atelier"
                className="w-full bg-[#120E0C] border border-[#3D2C24] px-3 py-2 text-xs text-white font-serif focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs uppercase font-semibold text-neutral-300 block mb-1">
                Subtitle / Description
              </label>
              <textarea
                rows={2}
                value={formData.subtitle || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, subtitle: e.target.value }))}
                placeholder="Private appointments and bespoke engagement consultations available."
                className="w-full bg-[#120E0C] border border-[#3D2C24] px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs uppercase font-semibold text-neutral-300 block mb-1">
                  Button Text
                </label>
                <input
                  type="text"
                  value={formData.buttonText || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, buttonText: e.target.value }))
                  }
                  placeholder="e.g. EXPLORE BRIDAL"
                  className="w-full bg-[#120E0C] border border-[#3D2C24] px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs uppercase font-semibold text-neutral-300 block mb-1">
                  Button Target Link
                </label>
                <input
                  type="text"
                  value={formData.buttonLink || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, buttonLink: e.target.value }))
                  }
                  placeholder="e.g. /shop?category=cat-bridal or /contact"
                  className="w-full bg-[#120E0C] border border-[#3D2C24] px-3 py-2 text-xs text-white font-mono focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="bannerIsActiveCheck"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, isActive: e.target.checked }))
                  }
                  className="w-4 h-4 accent-[#D4AF37] cursor-pointer"
                />
                <label
                  htmlFor="bannerIsActiveCheck"
                  className="text-xs text-neutral-300 cursor-pointer"
                >
                  Publish this banner on the live storefront
                </label>
              </div>

              <button
                type="button"
                onClick={handleDeleteCurrentBanner}
                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{banners.length > 1 ? 'Delete Banner' : 'Clear Banner Data'}</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => handleSelectBanner(activeBanner)}
              className="px-4 py-2.5 bg-[#181210] hover:bg-[#221814] border border-[#3D2C24] text-neutral-300 hover:text-white text-xs uppercase font-bold tracking-wider cursor-pointer"
            >
              Discard Changes
            </button>

            <button
              type="submit"
              id="admin-save-banner-submit-btn"
              className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#b8952b] text-black text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save &amp; Publish Banner</span>
            </button>
          </div>
        </div>

        {/* Right Column: Live Storefront Banner Preview */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#181210] border border-[#2D211B] p-6 space-y-4 sticky top-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#2A1F19]">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#D4AF37]" />
                <h3 className="font-serif text-base font-medium text-white tracking-wide">
                  Live Storefront Preview
                </h3>
              </div>
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider">
                Real-time Rendering
              </span>
            </div>

            <p className="text-xs text-neutral-400">
              This is exactly how this jewelry banner looks to visitors on your homepage:
            </p>

            {/* Interactive Preview Container */}
            <div className="relative rounded border border-[#3E2D25] overflow-hidden bg-neutral-950 text-white min-h-[360px] flex flex-col justify-center p-6 shadow-2xl">
              {/* Banner Backdrop Image */}
              {formData.mediaUrl ? (
                <img
                  src={formData.mediaUrl}
                  alt={formData.title}
                  className="absolute inset-0 w-full h-full object-cover object-right opacity-100 filter contrast-105"
                />
              ) : (
                <div className="absolute inset-0 bg-[#1A120F] flex flex-col items-center justify-center text-neutral-600 gap-2 p-4 text-center">
                  <ImageIcon className="w-12 h-12 text-neutral-700" />
                  <p className="text-xs text-neutral-500">No image selected</p>
                  <p className="text-[10px] text-neutral-600">Upload an image or choose from presets</p>
                </div>
              )}

              {/* Gradient Scrim matching Homepage */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#100D0B]/90 via-[#100D0B]/60 sm:via-[#100D0B]/35 to-transparent pointer-events-none" />

              {/* Content Overlay */}
              <div className="relative z-10 max-w-sm text-left">
                {formData.badge && (
                  <span className="inline-block px-2.5 py-0.5 bg-[#D4AF37] text-black text-[9px] uppercase font-bold tracking-widest mb-3 shadow-sm">
                    {formData.badge}
                  </span>
                )}
                <h4 className="font-serif text-2xl font-normal text-white mb-2 leading-tight drop-shadow-md">
                  {formData.title || 'Banner Title'}
                </h4>
                <p className="text-neutral-200 text-xs mb-5 font-light leading-relaxed drop-shadow">
                  {formData.subtitle || 'Banner subtitle description'}
                </p>
                <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#D4AF37] text-black text-[10px] font-bold uppercase tracking-wider shadow">
                  <span>{formData.buttonText || 'EXPLORE'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Quick delete button below preview if image is present */}
            {formData.mediaUrl && (
              <button
                type="button"
                onClick={handleClearCurrentImage}
                className="w-full py-2 bg-red-950/40 hover:bg-red-900/60 border border-red-800/60 text-red-300 hover:text-white text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors rounded-xs"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-400" />
                <span>Remove Image</span>
              </button>
            )}

            {/* Quick Status Indicator */}
            <div className="bg-[#120E0C] border border-[#281D17] p-3 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Position:</span>
                <span className="text-white font-mono capitalize">{formData.position}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Target Link:</span>
                <span className="text-[#D4AF37] font-mono text-[11px] truncate max-w-[200px]">
                  {formData.buttonLink}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Status:</span>
                <span
                  className={`font-semibold ${
                    formData.isActive ? 'text-emerald-400' : 'text-neutral-500'
                  }`}
                >
                  {formData.isActive ? 'Active on Storefront' : 'Draft / Hidden'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
