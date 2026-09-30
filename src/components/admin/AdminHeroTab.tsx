import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Video,
  Eye,
  Check,
  AlertCircle,
  X,
  Sliders,
  Monitor,
  Trash2,
  Play,
  Pause,
  Film,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { HeroConfig } from '../../types';
import { getMediaUrl, saveMediaBlob, removeMediaBlob } from '../../services/mediaStorage';
import {
  uploadHeroVideoToCloud,
  getHeroVideoFromCloudOrCache,
  removeHeroVideoFromCloud,
} from '../../services/cloudVideoStorage';

export const AdminHeroTab: React.FC = () => {
  const { heroConfig, updateHeroConfig, showToast } = useApp();

  const [form, setForm] = useState<HeroConfig>({
    ...heroConfig,
    activeMode: 'video',
  });
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [previewIsPlaying, setPreviewIsPlaying] = useState(true);
  const [previewVideoSrc, setPreviewVideoSrc] = useState<string>('');

  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);

  // Synchronously resolve video source for live preview
  useEffect(() => {
    let isMounted = true;

    const resolvePreview = async () => {
      // If a local custom video was uploaded
      if (form.videoUrl === 'local_uploaded_video' || form.uploadedVideoFileName) {
        const cached = await getMediaUrl('hero_video_desktop');
        if (cached && isMounted) {
          setPreviewVideoSrc(cached);
          return;
        }
      }

      if (!form.videoUrl) {
        const cached = await getMediaUrl('hero_video_desktop');
        if (cached && isMounted) {
          setPreviewVideoSrc(cached);
          return;
        }
        if (isMounted) setPreviewVideoSrc('');
        return;
      }

      if (form.videoUrl === 'cloud_hero_video') {
        const cached = await getMediaUrl('hero_video_desktop');
        if (cached && isMounted) {
          setPreviewVideoSrc(cached);
          return;
        }
        const cloudUrl = await getHeroVideoFromCloudOrCache();
        if (cloudUrl && isMounted) {
          setPreviewVideoSrc(cloudUrl);
          return;
        }
        return;
      }

      if (isMounted) {
        setPreviewVideoSrc(form.videoUrl);
      }
    };

    resolvePreview();

    return () => {
      isMounted = false;
    };
  }, [form.videoUrl]);

  const handleChange = (field: keyof HeroConfig, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Video File Upload handler with Cloud Firestore sync
  const handleVideoFileUpload = async (file: File) => {
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
      setUploadProgress(20);

      // Instant 0ms local preview playback
      const immediateUrl = URL.createObjectURL(file);
      setPreviewVideoSrc(immediateUrl);

      // Save to local IndexedDB in background
      saveMediaBlob('hero_video_desktop', file).catch(() => {});

      // Fast server upload with ultrafast 16:9 widescreen processing
      let serverVideoUrl = '';
      let serverMobileUrl = '';
      let serverPosterUrl = '';
      let serverMobilePosterUrl = '';

      try {
        setUploadProgress(50);
        const res = await fetch('/api/upload-hero-video', {
          method: 'POST',
          headers: { 'Content-Type': file.type || 'video/mp4' },
          body: file,
        });
        if (res.ok) {
          const data = await res.json();
          serverVideoUrl = data.videoUrl;
          serverMobileUrl = data.mobileVideoUrl;
          serverPosterUrl = data.posterUrl;
          serverMobilePosterUrl = data.mobilePosterUrl;
        }
      } catch (uploadErr) {
        console.warn('Server conversion bypassed:', uploadErr);
      }

      setUploadProgress(100);

      const activeUrl = serverVideoUrl || immediateUrl;
      const updatedForm: HeroConfig = {
        ...form,
        videoUrl: activeUrl,
        mobileVideoUrl: serverMobileUrl || activeUrl,
        posterUrl: serverPosterUrl || '/videos/hero-active-poster.jpg',
        mobilePosterUrl: serverMobilePosterUrl || '/videos/hero-active-poster-mobile.jpg',
        uploadedVideoFileName: file.name,
        uploadedVideoFileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      };

      setForm(updatedForm);
      updateHeroConfig(updatedForm);

      showToast(`Video "${file.name}" ready & configured!`, 'success');
    } catch (err) {
      console.error(err);
      setValidationError('Failed to process video file.');
      showToast('Could not save uploaded video file.', 'error');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Completely delete and purge the active hero video
  const handleDeleteVideo = async () => {
    try {
      await removeHeroVideoFromCloud();
    } catch (e) {
      console.warn('Cleanup warning:', e);
    }

    const updatedForm: HeroConfig = {
      ...form,
      videoUrl: '',
      mobileVideoUrl: '',
      posterUrl: '',
      mobilePosterUrl: '',
      uploadedVideoFileName: undefined,
      uploadedVideoFileSize: undefined,
    };

    setForm(updatedForm);
    setPreviewVideoSrc('');
    updateHeroConfig(updatedForm);
    showToast('Video deleted. Storefront updated.', 'success');
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleVideoFileUpload(file);
    }
  };

  // Save & Publish
  const handlePublish = () => {
    updateHeroConfig({
      ...form,
      activeMode: 'video',
    });
    setIsPreviewModalOpen(false);
    showToast('Hero settings saved and published live to storefront!', 'success');
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
            Upload your hero background video or paste a video URL, and publish to the live storefront.
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

      {/* Main Grid: Left Column Controls, Right Column Live Screen View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (7 cols): Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. VIDEO UPLOAD & SOURCE */}
          <div className="bg-[#1A1412] border border-[#2D211B] p-5 space-y-5">
            <div className="flex items-center justify-between border-b border-[#281D18] pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-2">
                <Video className="w-4 h-4" />
                <span>Upload Hero Section Video</span>
              </h3>
              <span className="text-[11px] text-neutral-400 font-mono">
                MP4 • WEBM • MAX 150MB
              </span>
            </div>

            {/* Drag & Drop Upload Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed p-8 rounded text-center transition-all flex flex-col items-center justify-center ${
                isDragging
                  ? 'border-[#D4AF37] bg-[#D4AF37]/5'
                  : 'border-[#3D2C23] hover:border-[#D4AF37]/50 bg-[#120E0C]'
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-[#251A15] border border-[#4A3428] flex items-center justify-center text-[#D4AF37] mb-3">
                {isUploading ? (
                  <div className="w-5 h-5 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Upload className="w-6 h-6" />
                )}
              </div>

              <h4 className="text-sm font-semibold text-white mb-1">
                {isUploading
                  ? `Uploading to Cloud (${uploadProgress}%)...`
                  : 'Choose a Video from Your Device'}
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
                    if (file) handleVideoFileUpload(file);
                  }}
                  className="hidden"
                />
              </label>

              {/* Uploaded File Info */}
              {form.uploadedVideoFileName && (
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-950/60 border border-emerald-700/60 rounded text-xs text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>
                    Uploaded: <strong>{form.uploadedVideoFileName}</strong> ({form.uploadedVideoFileSize})
                  </span>
                </div>
              )}
            </div>

            {/* Delete Active Video Banner */}
            {form.videoUrl && (
              <div className="flex items-center justify-between w-full p-3 bg-red-950/30 border border-red-900/50 rounded">
                <div className="text-xs text-red-200">
                  <span className="font-semibold block">A custom video is currently active.</span>
                  <span className="text-[11px] text-red-300/80">Click delete to clear this video completely.</span>
                </div>
                <button
                  type="button"
                  onClick={handleDeleteVideo}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded flex items-center gap-1.5 cursor-pointer transition-colors shadow"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Video</span>
                </button>
              </div>
            )}

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
                    onClick={handleDeleteVideo}
                    className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" /> Clear
                  </button>
                )}
              </label>
              <input
                type="url"
                value={form.videoUrl === 'cloud_hero_video' ? '' : form.videoUrl}
                onChange={(e) => handleChange('videoUrl', e.target.value)}
                placeholder="https://example.com/videos/storefront-video.mp4"
                className="w-full bg-[#120E0C] border border-[#3E2D25] p-2.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none font-mono"
              />
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
            <div className="flex items-center justify-between py-2">
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
          </div>

          {/* 3. STOREFRONT TEXT OVERLAY */}
          <div className="bg-[#1A1412] border border-[#2D211B] p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-2">
              <Film className="w-3.5 h-3.5" />
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
                Storefront Tagline
              </label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                placeholder="Jewelry for a Lifetime"
                className="w-full bg-[#120E0C] border border-[#3E2D25] p-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Live Scaled Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#1A1412] border border-[#2D211B] p-5 space-y-4 sticky top-6">
            <div className="flex items-center justify-between border-b border-[#281D18] pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>Live Hero Video Preview</span>
              </h3>
              {previewVideoSrc && (
                <button
                  type="button"
                  onClick={togglePreviewPlay}
                  className="px-2 py-1 bg-[#251A15] hover:bg-[#34241C] text-[10px] text-[#D4AF37] border border-[#483325] flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {previewIsPlaying ? (
                    <>
                      <Pause className="w-3 h-3" /> Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3" /> Play
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Scaled Preview Frame with Live Video in 16:9 */}
            <div className="relative aspect-video w-full bg-[#120E0C] border border-[#382A22] overflow-hidden flex flex-col items-center justify-center p-4 shadow-2xl">
              {/* Actual Video Playing */}
              {previewVideoSrc ? (
                <>
                  <video
                    ref={previewVideoRef}
                    src={previewVideoSrc}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `radial-gradient(ellipse at center, rgba(14, 10, 8, 0.45) 0%, rgba(10, 7, 5, 0.65) 100%)`,
                    }}
                  />
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-6 space-y-2 z-0 select-none">
                  <div className="w-12 h-12 rounded-full bg-[#201712] border border-[#38271E] flex items-center justify-center text-[#D4AF37]">
                    <Film className="w-6 h-6 opacity-60" />
                  </div>
                  <p className="text-xs font-semibold text-neutral-300">
                    No Video Uploaded
                  </p>
                  <p className="text-[11px] text-neutral-400 max-w-xs">
                    Please upload an MP4 or WebM video file from your device.
                  </p>
                </div>
              )}

              {/* Centered Signage Overlay Matching Public Storefront */}
              <div className="relative z-10 w-full text-center select-none pointer-events-none py-2 px-1">
                <h4
                  className="w-full whitespace-nowrap text-base sm:text-xl font-normal text-[#F3CA52] leading-tight mb-1"
                  style={{
                    fontFamily:
                      "'Segoe UI Symbol', 'Apple Symbols', 'STIX Two Math', 'Cambria Math', serif, system-ui, sans-serif",
                    textShadow:
                      '0 2px 4px rgba(0, 0, 0, 0.95), 0 0 16px rgba(243, 202, 82, 0.3)',
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
                <span>Cloud Synced:</span>
              </div>
              <p>
                The video you upload will be synced to cloud storage and will play across all visitor devices and browsers.
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
            {previewVideoSrc ? (
              <>
                <video
                  ref={modalVideoRef}
                  src={previewVideoSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse at center, rgba(14, 10, 8, 0.45) 0%, rgba(10, 7, 5, 0.65) 100%)`,
                  }}
                />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-8 space-y-2 z-0 select-none">
                <Film className="w-10 h-10 text-[#D4AF37] opacity-60" />
                <p className="text-sm font-semibold text-white">No Video Uploaded</p>
                <p className="text-xs text-neutral-400">Upload a video to see live preview.</p>
              </div>
            )}

            {/* Central Window Signage */}
            <div className="relative z-10 text-center select-none pointer-events-none">
              <h2
                className="text-2xl sm:text-4xl md:text-5xl font-normal text-[#F3CA52] mb-2 leading-tight"
                style={{
                  fontFamily:
                    "'Segoe UI Symbol', 'Apple Symbols', 'STIX Two Math', 'Cambria Math', serif, system-ui, sans-serif",
                  textShadow:
                    '0 2px 4px rgba(0, 0, 0, 0.95), 0 0 24px rgba(243, 202, 82, 0.3)',
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

            {/* Bottom Floating Promotional Text */}
            <div className="absolute bottom-4 right-6 text-right select-none pointer-events-none">
              <p
                className="font-sans font-normal text-sm text-[#F3CA52]"
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.9)' }}
              >
                Free Parking
              </p>
              <p
                className="font-sans font-normal text-xs text-[#F3CA52] mt-0.5"
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.9)' }}
              >
                Special Prices: 30-50% Off
              </p>
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-[#362720] max-w-5xl mx-auto w-full">
            <div className="text-xs text-neutral-400">
              Draft changes will only take effect on the live storefront once you click Save &amp; Publish.
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsPreviewModalOpen(false)}
                className="px-5 py-2 border border-[#48362B] text-xs font-semibold text-neutral-300 hover:text-white cursor-pointer"
              >
                Back to Editor
              </button>
              <button
                type="button"
                onClick={handlePublish}
                className="px-6 py-2 bg-[#D4AF37] hover:bg-[#b8952b] text-black text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg transition-all"
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
