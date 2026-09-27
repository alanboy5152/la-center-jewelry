import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Video,
  Image as ImageIcon,
  Check,
  Eye,
  Upload,
  Trash2,
  Sliders,
  Smartphone,
  Monitor,
  AlertCircle,
  X,
  Play,
  Pause,
  Film,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { HeroConfig } from '../../types';
import { saveMediaBlob, removeMediaBlob } from '../../services/mediaStorage';

// High quality luxury jewelry sample video presets for testing & fallback
const SAMPLE_VIDEOS = [
  {
    name: '💎 Diamond Fire & Symmetry',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    poster: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1920&auto=format&fit=crop',
  },
  {
    name: '💍 Master Goldsmith Atelier',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    poster: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=1920&auto=format&fit=crop',
  },
  {
    name: '✨ Broadway Luxury Showroom',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    poster: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1920&auto=format&fit=crop',
  },
];

export const AdminHeroTab: React.FC = () => {
  const { heroConfig, updateHeroConfig, showToast } = useApp();

  const [form, setForm] = useState<HeroConfig>({
    ...heroConfig,
    activeMode: 'video',
  });
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [previewIsPlaying, setPreviewIsPlaying] = useState(true);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);

  const handleChange = (field: keyof HeroConfig, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Video File Upload handler with persistent IndexedDB storage
  const handleVideoFileUpload = async (
    file: File,
    targetField: 'videoUrl' | 'mobileVideoUrl'
  ) => {
    setValidationError(null);

    const validTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-m4v'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(mp4|webm|mov|m4v)$/i)) {
      setValidationError('Invalid video format. Please upload MP4 or WebM video file.');
      showToast('Invalid format. Please upload an MP4 or WebM video file.', 'error');
      return;
    }

    if (file.size > 150 * 1024 * 1024) {
      setValidationError('Video file exceeds maximum allowed size of 150MB.');
      showToast('Video file exceeds 150MB limit.', 'error');
      return;
    }

    try {
      setIsUploading(true);
      const storageKey = targetField === 'videoUrl' ? 'hero_video_desktop' : 'hero_video_mobile';
      const persistentUrl = await saveMediaBlob(storageKey, file);

      setForm((prev) => ({
        ...prev,
        [targetField]: persistentUrl,
        uploadedVideoFileName: file.name,
        uploadedVideoFileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      }));

      showToast(`Video "${file.name}" uploaded successfully!`, 'success');
    } catch (err) {
      console.error(err);
      setValidationError('Failed to process video file.');
      showToast('Could not save uploaded video file.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  // Poster Image upload handler
  const handleImageFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    targetField: 'posterUrl' | 'mobilePosterUrl'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setValidationError(null);

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setValidationError('Invalid poster format. Please upload JPG, PNG, or WebP.');
      showToast('Invalid image format. Please select JPG, PNG, or WebP.', 'error');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setValidationError('Poster file exceeds maximum allowed size of 20MB.');
      showToast('Poster image exceeds 20MB limit.', 'error');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    handleChange(targetField, objectUrl);
    showToast(`${file.name} loaded as fallback poster.`, 'info');
  };

  const handleRemoveCustomVideo = async () => {
    try {
      await removeMediaBlob('hero_video_desktop');
    } catch (e) {
      console.warn(e);
    }
    setForm((prev) => ({
      ...prev,
      videoUrl: SAMPLE_VIDEOS[0].url,
      uploadedVideoFileName: undefined,
      uploadedVideoFileSize: undefined,
    }));
    showToast('Reset to default sample jewelry video.', 'info');
  };

  const handleApplyPreset = (preset: typeof SAMPLE_VIDEOS[0]) => {
    setForm((prev) => ({
      ...prev,
      videoUrl: preset.url,
      posterUrl: preset.poster,
      uploadedVideoFileName: undefined,
      uploadedVideoFileSize: undefined,
    }));
    showToast(`Preset "${preset.name}" applied.`, 'success');
  };

  // Save & Publish
  const handlePublish = () => {
    updateHeroConfig({
      ...form,
      activeMode: 'video',
    });
    setIsPreviewModalOpen(false);
    showToast('Hero video published live to storefront!', 'success');
  };

  // Cancel edits
  const handleCancelEdits = () => {
    setForm({ ...heroConfig, activeMode: 'video' });
    setIsPreviewModalOpen(false);
    showToast('Draft changes discarded. Active storefront restored.', 'info');
  };

  const togglePreviewPlay = () => {
    if (!previewVideoRef.current) return;
    if (previewIsPlaying) {
      previewVideoRef.current.pause();
      setPreviewIsPlaying(false);
    } else {
      previewVideoRef.current.play().then(() => setPreviewIsPlaying(true)).catch(() => {});
    }
  };

  return (
    <div className="space-y-8 text-neutral-200">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#2C221D]">
        <div>
          <h2 className="font-serif text-2xl font-normal text-white">
            Storefront Hero Section (Video Management)
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Upload your hero background video directly, paste video URLs, set fallback posters, and publish to the live storefront.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsPreviewModalOpen(true)}
            className="px-4 py-2.5 bg-[#251C17] hover:bg-[#33261F] text-[#D4AF37] border border-[#48362B] text-xs font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md transition-all"
          >
            <Eye className="w-4 h-4" />
            <span>Preview Staged Hero</span>
          </button>

          <button
            type="button"
            onClick={handlePublish}
            className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#b8952b] text-black text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md transition-all"
          >
            <Check className="w-4 h-4" />
            <span>SAVE &amp; PUBLISH</span>
          </button>
        </div>
      </div>

      {validationError && (
        <div className="p-3 bg-red-950/50 border border-red-800 text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{validationError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Video Upload & Configuration Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. PRIMARY VIDEO UPLOAD CARD */}
          <div className="bg-[#1A1412] border border-[#2D211B] p-5 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-2">
                <Video className="w-4 h-4 text-[#D4AF37]" />
                <span>Upload Hero Section Video</span>
              </h3>
              <span className="text-[10px] text-neutral-400 uppercase font-mono">
                MP4 / WebM • Max 150MB
              </span>
            </div>

            {/* Drag & Drop Upload Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const file = e.dataTransfer.files?.[0];
                if (file) handleVideoFileUpload(file, 'videoUrl');
              }}
              className={`relative border-2 border-dashed rounded-lg p-6 sm:p-8 flex flex-col items-center justify-center text-center transition-all ${
                isDragging
                  ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                  : 'border-[#3E2D25] hover:border-[#D4AF37]/70 bg-[#140F0D]'
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-[#261C16] border border-[#443226] flex items-center justify-center text-[#D4AF37] mb-3">
                {isUploading ? (
                  <div className="w-6 h-6 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Upload className="w-6 h-6" />
                )}
              </div>

              <h4 className="text-sm font-semibold text-white mb-1">
                {isUploading ? 'Uploading & Processing Video...' : 'Choose a Video from Your Device'}
              </h4>
              <p className="text-xs text-neutral-400 max-w-sm mb-4">
                Drag &amp; drop your MP4 or WebM video file here, or click the button below to browse your files.
              </p>

              <label className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#b8952b] text-black text-xs font-bold uppercase tracking-wider rounded cursor-pointer shadow-lg transition-all flex items-center gap-2">
                <Film className="w-4 h-4" />
                <span>Browse Video File</span>
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  disabled={isUploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleVideoFileUpload(file, 'videoUrl');
                  }}
                  className="hidden"
                />
              </label>

              {/* Uploaded File Badge */}
              {form.uploadedVideoFileName && (
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-950/60 border border-emerald-700/60 rounded text-xs text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>
                    Uploaded: <strong>{form.uploadedVideoFileName}</strong> ({form.uploadedVideoFileSize})
                  </span>
                  <button
                    type="button"
                    onClick={handleRemoveCustomVideo}
                    className="ml-2 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                    title="Remove custom video"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Direct Video URL Input */}
            <div className="space-y-1.5 pt-2 border-t border-[#261C16]">
              <label className="text-xs text-neutral-300 font-semibold flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Monitor className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Or Enter Direct Video URL (MP4 / WebM Link)
                </span>
                {form.videoUrl && (
                  <button
                    type="button"
                    onClick={() => handleChange('videoUrl', '')}
                    className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" /> Clear
                  </button>
                )}
              </label>
              <input
                type="url"
                value={form.videoUrl}
                onChange={(e) => handleChange('videoUrl', e.target.value)}
                placeholder="https://example.com/videos/storefront-video.mp4"
                className="w-full bg-[#120E0C] border border-[#3E2D25] p-2.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none font-mono"
              />
            </div>

            {/* Quick Sample Presets */}
            <div className="space-y-2 pt-2 border-t border-[#261C16]">
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
                Or Select a High-Definition Sample Video:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {SAMPLE_VIDEOS.map((sample) => (
                  <button
                    key={sample.name}
                    type="button"
                    onClick={() => handleApplyPreset(sample)}
                    className={`p-2 border text-left rounded text-xs transition-all cursor-pointer flex flex-col justify-between ${
                      form.videoUrl === sample.url
                        ? 'bg-[#D4AF37]/15 border-[#D4AF37] text-white'
                        : 'bg-[#140F0D] border-[#34241C] text-neutral-300 hover:border-[#D4AF37]/50'
                    }`}
                  >
                    <span className="font-medium text-[11px] text-white truncate block">
                      {sample.name}
                    </span>
                    <span className="text-[10px] text-[#D4AF37] mt-1 flex items-center gap-1">
                      {form.videoUrl === sample.url ? '✓ Active' : 'Click to Use'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Optional Video URL */}
            <div className="space-y-1.5 pt-2 border-t border-[#261C16]">
              <label className="text-xs text-neutral-300 font-semibold flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Optional Mobile Video URL (Vertical 9:16 or 4:5)
                </span>
                {form.mobileVideoUrl && (
                  <button
                    type="button"
                    onClick={() => handleChange('mobileVideoUrl', '')}
                    className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" /> Clear
                  </button>
                )}
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={form.mobileVideoUrl || ''}
                  onChange={(e) => handleChange('mobileVideoUrl', e.target.value)}
                  placeholder="Leave empty to use main video on all devices"
                  className="flex-1 bg-[#120E0C] border border-[#3E2D25] p-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none font-mono"
                />
                <label className="px-3 py-2 bg-[#281D18] hover:bg-[#382922] border border-[#443128] text-xs text-[#D4AF37] font-semibold cursor-pointer flex items-center gap-1.5 shrink-0">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Mobile</span>
                  <input
                    type="file"
                    accept="video/mp4,video/webm"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleVideoFileUpload(file, 'mobileVideoUrl');
                    }}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* 2. VIDEO PLAYBACK SETTINGS */}
          <div className="bg-[#1A1412] border border-[#2D211B] p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5" />
              <span>Playback &amp; Framing Settings</span>
            </h3>

            {/* Enable Hero Section */}
            <div className="flex items-center justify-between py-2 border-b border-[#281D18]">
              <div>
                <span className="text-xs font-medium text-white block">
                  Enable Hero Section
                </span>
                <span className="text-[11px] text-neutral-400">
                  Toggle whether the video hero section is rendered on the public storefront.
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isEnabled}
                  onChange={(e) => handleChange('isEnabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]" />
              </label>
            </div>

            {/* Autoplay Toggle */}
            <div className="flex items-center justify-between py-2 border-b border-[#281D18]">
              <div>
                <span className="text-xs font-medium text-white block">
                  Autoplay Video on Entrance
                </span>
                <span className="text-[11px] text-neutral-400">
                  Starts in muted loop automatically when customers arrive.
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.autoplay ?? true}
                  onChange={(e) => handleChange('autoplay', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]" />
              </label>
            </div>

            {/* Video Alignment */}
            <div className="flex items-center justify-between py-2">
              <div>
                <span className="text-xs font-medium text-white block">
                  Video Object Alignment
                </span>
                <span className="text-[11px] text-neutral-400">
                  Vertical focal point positioning inside the full-screen frame.
                </span>
              </div>
              <select
                value={form.videoPosition || 'center'}
                onChange={(e) => handleChange('videoPosition', e.target.value)}
                className="bg-[#120E0C] border border-[#3E2D25] text-xs text-white p-2 focus:border-[#D4AF37] focus:outline-none"
              >
                <option value="center">Center</option>
                <option value="top">Top (Fascia Focus)</option>
                <option value="bottom">Bottom (Showroom Floor)</option>
              </select>
            </div>

            {/* Fallback Posters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#281D18]">
              <div className="space-y-1.5">
                <label className="text-xs text-neutral-300 font-semibold flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Fallback Poster Image (JPG/WebP)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={form.posterUrl}
                    onChange={(e) => handleChange('posterUrl', e.target.value)}
                    className="w-full bg-[#120E0C] border border-[#3E2D25] p-2 text-xs text-white font-mono"
                  />
                  <label className="px-2.5 py-2 bg-[#281D18] border border-[#443128] text-xs text-[#D4AF37] cursor-pointer shrink-0" title="Upload Poster">
                    <Upload className="w-3.5 h-3.5" />
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) => handleImageFileUpload(e, 'posterUrl')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-neutral-300 font-semibold flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Mobile Poster Image
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={form.mobilePosterUrl || ''}
                    onChange={(e) => handleChange('mobilePosterUrl', e.target.value)}
                    placeholder="Same as desktop if blank"
                    className="w-full bg-[#120E0C] border border-[#3E2D25] p-2 text-xs text-white font-mono"
                  />
                  <label className="px-2.5 py-2 bg-[#281D18] border border-[#443128] text-xs text-[#D4AF37] cursor-pointer shrink-0" title="Upload Mobile Poster">
                    <Upload className="w-3.5 h-3.5" />
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) => handleImageFileUpload(e, 'mobilePosterUrl')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* 3. STOREFRONT TEXT OVERLAY */}
          <div className="bg-[#1A1412] border border-[#2D211B] p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hero Text Signage Overlay</span>
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs text-neutral-300 font-semibold">
                Storefront Headline (Calligraphy Gold Script)
              </label>
              <input
                type="text"
                value={form.headline}
                onChange={(e) => handleChange('headline', e.target.value)}
                placeholder="𝓛.𝓐 𝓒𝓮𝓷𝓽𝓮𝓻 𝓙𝓮𝔀𝓮𝓵𝓻𝔂 𝓘𝓷𝓬"
                className="w-full bg-[#120E0C] border border-[#3E2D25] p-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-neutral-300 font-semibold">
                Tagline (Thin, Non-Bold Sans-Serif)
              </label>
              <input
                type="text"
                value={form.tagline || ''}
                onChange={(e) => handleChange('tagline', e.target.value)}
                placeholder="Jewelry for a Lifetime"
                className="w-full bg-[#120E0C] border border-[#3E2D25] p-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Right Preview Card (5 cols): LIVE VIDEO PREVIEW */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#1A1412] border border-[#2D211B] p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                <span>Live Hero Video Preview</span>
              </span>
              <button
                type="button"
                onClick={togglePreviewPlay}
                className="text-[10px] uppercase font-mono text-[#D4AF37] bg-[#251A15] hover:bg-[#33261F] px-2.5 py-1 border border-[#3D2B22] flex items-center gap-1 cursor-pointer transition-colors"
              >
                {previewIsPlaying ? (
                  <>
                    <Pause className="w-3 h-3" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3" />
                    <span>Play</span>
                  </>
                )}
              </button>
            </div>

            {/* Scaled Preview Frame with Live Video */}
            <div className="relative aspect-16/10 w-full bg-[#120E0C] border border-[#382A22] overflow-hidden flex flex-col items-center justify-center p-4 shadow-2xl">
              {/* Actual Video Playing */}
              {form.videoUrl ? (
                <video
                  ref={previewVideoRef}
                  src={form.videoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster={form.posterUrl}
                  className={`absolute inset-0 w-full h-full object-cover ${
                    form.videoPosition === 'top'
                      ? 'object-top'
                      : form.videoPosition === 'bottom'
                      ? 'object-bottom'
                      : 'object-center'
                  }`}
                />
              ) : (
                <img
                  src={form.posterUrl}
                  alt="Storefront Preview"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}

              {/* Gradient Overlay */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse at center, rgba(14, 10, 8, 0.45) 0%, rgba(10, 7, 5, 0.65) 100%)`,
                }}
              />

              {/* Centered Signage Overlay Matching Public Storefront */}
              <div className="relative z-10 w-full text-center select-none pointer-events-none py-2 px-1">
                <h4
                  className="w-full whitespace-nowrap text-base sm:text-xl font-normal text-[#F3CA52] leading-tight mb-1"
                  style={{
                    fontFamily: "'Segoe UI Symbol', 'Apple Symbols', 'STIX Two Math', 'Cambria Math', serif, system-ui, sans-serif",
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.95), 0 0 16px rgba(243, 202, 82, 0.3)',
                  }}
                >
                  {form.headline}
                </h4>
                <p
                  className="font-sans font-light text-[10px] sm:text-xs tracking-widest text-[#F3CA52]"
                  style={{
                    fontFamily: "'Montserrat', Arial, Helvetica, sans-serif",
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.95)',
                  }}
                >
                  {form.tagline || 'Jewelry for a Lifetime'}
                </p>
              </div>

              {/* Bottom Promotional Indicators */}
              <div className="absolute bottom-2 right-2 text-right pointer-events-none select-none">
                <span className="text-[9px] font-normal text-[#F3CA52] block drop-shadow">
                  Free Parking
                </span>
                <span className="text-[8px] font-normal text-[#F3CA52] block drop-shadow">
                  Special Prices: 30-50% Off
                </span>
              </div>
            </div>

            <div className="p-3 bg-[#120E0C] border border-[#2B1E18] text-[11px] text-[#A89681] space-y-1.5">
              <div className="flex items-center gap-1.5 text-[#D4AF37] font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Ready to Publish:</span>
              </div>
              <p>
                The video you choose or upload here will play full-screen across the homepage hero section as soon as you click <strong>SAVE &amp; PUBLISH</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          FULL ADMIN PREVIEW MODAL
          ========================================================= */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8 animate-fade-in">
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-[#362720]">
            <div className="flex items-center gap-3">
              <Video className="w-5 h-5 text-[#D4AF37]" />
              <div>
                <h3 className="font-serif text-lg text-white">
                  Storefront Hero Video Preview (Draft)
                </h3>
                <p className="text-xs text-neutral-400">
                  Review the video experience exactly as public visitors will see it.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsPreviewModalOpen(false)}
              className="p-2 text-neutral-400 hover:text-white cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Interactive Preview Viewport */}
          <div className="my-auto relative w-full max-w-5xl mx-auto h-[65vh] bg-[#12100F] border border-[#3E2E25] overflow-hidden flex flex-col items-center justify-center p-8 shadow-2xl">
            {form.videoUrl ? (
              <video
                ref={modalVideoRef}
                src={form.videoUrl}
                autoPlay
                loop
                muted
                playsInline
                poster={form.posterUrl}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <img
                src={form.posterUrl}
                alt="Preview"
                className="absolute inset-0 w-full h-full object-cover opacity-80"
              />
            )}

            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at center, rgba(14, 10, 8, 0.45) 0%, rgba(10, 7, 5, 0.65) 100%)`,
              }}
            />

            {/* Central Window Signage */}
            <div className="relative z-10 text-center select-none pointer-events-none">
              <h2
                className="text-2xl sm:text-4xl md:text-5xl font-normal text-[#F3CA52] mb-2 leading-tight"
                style={{
                  fontFamily: "'Segoe UI Symbol', 'Apple Symbols', 'STIX Two Math', 'Cambria Math', serif, system-ui, sans-serif",
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.95), 0 0 24px rgba(243, 202, 82, 0.3)',
                }}
              >
                {form.headline}
              </h2>
              <p
                className="font-sans font-light sm:font-normal text-sm sm:text-xl tracking-widest text-[#F3CA52]"
                style={{
                  fontFamily: "'Montserrat', Arial, Helvetica, sans-serif",
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.95)',
                }}
              >
                {form.tagline || 'Jewelry for a Lifetime'}
              </p>
            </div>

            {/* Bottom indicators */}
            <div className="absolute bottom-4 right-6 text-right pointer-events-none">
              <p className="text-xs text-[#F3CA52] font-normal drop-shadow">Free Parking</p>
              <p className="text-xs text-[#F3CA52] font-normal drop-shadow">Special Prices: 30-50% Off</p>
            </div>
          </div>

          {/* Bottom Confirmation Actions */}
          <div className="pt-4 border-t border-[#362720] flex items-center justify-between">
            <button
              type="button"
              onClick={handleCancelEdits}
              className="px-6 py-3 bg-transparent hover:bg-neutral-800 text-neutral-300 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Discard &amp; Cancel
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsPreviewModalOpen(false)}
                className="px-6 py-3 bg-[#261E1A] hover:bg-[#382C26] text-white text-xs font-semibold uppercase tracking-wider border border-[#443329] transition-colors cursor-pointer"
              >
                Keep Editing
              </button>
              <button
                type="button"
                onClick={handlePublish}
                className="px-8 py-3 bg-[#D4AF37] hover:bg-[#b8952b] text-black text-xs font-bold uppercase tracking-widest shadow-xl flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>SAVE &amp; PUBLISH LIVE</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
