import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Video,
  Trash2,
  Play,
  Pause,
  Film,
  Check,
  AlertCircle,
  Monitor,
  Eye,
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
    isEnabled: true,
    autoplay: true,
  });

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [previewIsPlaying, setPreviewIsPlaying] = useState(true);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [previewVideoSrc, setPreviewVideoSrc] = useState<string>('');

  const previewVideoRef = useRef<HTMLVideoElement>(null);

  // Synchronously resolve video source for live preview
  useEffect(() => {
    let isMounted = true;

    const resolvePreview = async () => {
      // 1. Check local IndexedDB first for 0ms instant display
      const cached = await getMediaUrl('hero_video_desktop');
      if (cached && isMounted) {
        setPreviewVideoSrc(cached);
        return;
      }

      // 2. If cloud_hero_video, fetch from Firestore cloud chunks
      if (form.videoUrl === 'cloud_hero_video' || form.videoUrl === 'local_uploaded_video') {
        const cloudUrl = await getHeroVideoFromCloudOrCache();
        if (cloudUrl && isMounted) {
          setPreviewVideoSrc(cloudUrl);
          return;
        }
      }

      // 3. If direct URL
      if (form.videoUrl && form.videoUrl !== 'cloud_hero_video' && form.videoUrl !== 'local_uploaded_video') {
        if (isMounted) setPreviewVideoSrc(form.videoUrl);
        return;
      }

      // 4. Default fallback video
      if (isMounted) {
        setPreviewVideoSrc('/videos/hero-active.mp4');
      }
    };

    resolvePreview();

    return () => {
      isMounted = false;
    };
  }, [form.videoUrl]);

  // Video File Upload handler with Cloud sync
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
      setUploadProgress(15);

      // Instant 0ms local preview playback
      const immediateUrl = URL.createObjectURL(file);
      setPreviewVideoSrc(immediateUrl);

      // Upload to Cloud Firestore in parallel chunks so ALL browsers & devices worldwide receive it
      await uploadHeroVideoToCloud(file, (percent) => {
        setUploadProgress(percent);
      });

      // Update form
      const updatedForm: HeroConfig = {
        ...form,
        videoUrl: 'cloud_hero_video',
        mobileVideoUrl: 'cloud_hero_video',
        posterUrl: '/videos/hero-active-poster.jpg',
        mobilePosterUrl: '/videos/hero-active-poster-mobile.jpg',
        uploadedVideoFileName: file.name,
        uploadedVideoFileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        isEnabled: true,
        autoplay: true,
        activeMode: 'video',
      };

      setForm(updatedForm);
      updateHeroConfig(updatedForm);

      showToast(`Video "${file.name}" uploaded successfully! Live on all devices.`, 'success');
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

    try {
      await removeMediaBlob('hero_video_desktop');
    } catch {}

    const updatedForm: HeroConfig = {
      ...form,
      videoUrl: '',
      mobileVideoUrl: '',
      uploadedVideoFileName: '',
      uploadedVideoFileSize: '',
      isEnabled: true,
      autoplay: true,
      activeMode: 'video',
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
      isEnabled: true,
      autoplay: true,
      activeMode: 'video',
    });
    showToast('Hero video published live to storefront!', 'success');
  };

  const togglePreviewPlay = () => {
    if (!previewVideoRef.current) return;
    if (previewIsPlaying) {
      previewVideoRef.current.pause();
      setPreviewIsPlaying(false);
    } else {
      previewVideoRef.current
        .play()
        .then(() => setPreviewIsPlaying(true))
        .catch(() => {});
    }
  };

  return (
    <div className="space-y-6 text-neutral-200">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#2C221D]">
        <div>
          <h2 className="font-serif text-2xl font-normal text-white">
            Hero Video Management
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Upload your hero background video. It will automatically play on all devices and browsers.
          </p>
        </div>

        <button
          type="button"
          onClick={handlePublish}
          className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#b8952b] text-black text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md transition-all rounded"
        >
          <Check className="w-4 h-4" />
          <span>SAVE &amp; PUBLISH</span>
        </button>
      </div>

      {validationError && (
        <div className="p-3 bg-red-950/50 border border-red-800 text-red-200 text-xs flex items-center gap-2 rounded">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Main Clean Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Upload & Delete Controls */}
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-[#1A1412] border border-[#2D211B] p-6 rounded space-y-5">
            <div className="flex items-center justify-between border-b border-[#281D18] pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-2">
                <Video className="w-4 h-4" />
                <span>Upload Video</span>
              </h3>
              <span className="text-[11px] text-neutral-400 font-mono">
                MP4 • WEBM
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
              <div className="w-14 h-14 rounded-full bg-[#251A15] border border-[#4A3428] flex items-center justify-center text-[#D4AF37] mb-3">
                {isUploading ? (
                  <div className="w-6 h-6 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Upload className="w-7 h-7" />
                )}
              </div>

              <h4 className="text-sm font-semibold text-white mb-1">
                {isUploading
                  ? `Uploading to Cloud (${uploadProgress}%)...`
                  : 'Choose a Video from Your Device'}
              </h4>
              <p className="text-xs text-neutral-400 max-w-sm mb-4">
                Drag &amp; drop your MP4 or WebM video file here, or click below to browse.
              </p>

              <label className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#b8952b] text-black text-xs font-bold uppercase tracking-wider rounded cursor-pointer shadow-lg transition-all flex items-center gap-2">
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
                    Active: <strong>{form.uploadedVideoFileName}</strong> ({form.uploadedVideoFileSize})
                  </span>
                </div>
              )}
            </div>

            {/* Delete Active Video Banner */}
            {(form.videoUrl || form.uploadedVideoFileName) && (
              <div className="flex items-center justify-between w-full p-4 bg-red-950/30 border border-red-900/50 rounded">
                <div className="text-xs text-red-200">
                  <span className="font-semibold block">A custom video is active.</span>
                  <span className="text-[11px] text-red-300/80">Click delete to clear this video completely.</span>
                </div>
                <button
                  type="button"
                  onClick={handleDeleteVideo}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded flex items-center gap-1.5 cursor-pointer transition-colors shadow"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Video</span>
                </button>
              </div>
            )}

            {/* Direct Video URL Input (Optional) */}
            <div className="space-y-1.5 pt-3 border-t border-[#261C16]">
              <label className="text-xs text-neutral-300 font-semibold flex items-center gap-1.5">
                <Monitor className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Or Enter Direct Video URL (MP4 / WebM)</span>
              </label>
              <input
                type="url"
                value={form.videoUrl === 'cloud_hero_video' ? '' : form.videoUrl}
                onChange={(e) => {
                  const val = e.target.value;
                  setForm((prev) => ({
                    ...prev,
                    videoUrl: val,
                    mobileVideoUrl: val,
                    uploadedVideoFileName: val ? 'External URL Video' : '',
                  }));
                  setPreviewVideoSrc(val);
                }}
                placeholder="https://example.com/video.mp4"
                className="w-full bg-[#120E0C] border border-[#3E2D25] p-2.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none rounded font-mono"
              />
            </div>
          </div>

          {/* Storefront Headline & Tagline Signage */}
          <div className="bg-[#1A1412] border border-[#2D211B] p-6 rounded space-y-4">
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
                onChange={(e) => setForm((prev) => ({ ...prev, headline: e.target.value }))}
                placeholder="𝓛.𝓐 𝓒𝓮𝓷𝓽𝓮𝓻 𝓙𝓮𝔀𝓮𝓵𝓻𝔂 𝓘𝓷𝓬"
                className="w-full bg-[#120E0C] border border-[#3E2D25] p-2.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none rounded"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-neutral-300 font-semibold">
                Storefront Tagline
              </label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => setForm((prev) => ({ ...prev, tagline: e.target.value }))}
                placeholder="Jewelry for a Lifetime"
                className="w-full bg-[#120E0C] border border-[#3E2D25] p-2.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none rounded"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Live Video Preview */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#1A1412] border border-[#2D211B] p-6 rounded space-y-4 sticky top-6">
            <div className="flex items-center justify-between border-b border-[#281D18] pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>Live Hero Video Preview</span>
              </h3>
              {previewVideoSrc && (
                <button
                  type="button"
                  onClick={togglePreviewPlay}
                  className="px-3 py-1 bg-[#251A15] hover:bg-[#34241C] text-xs text-[#D4AF37] border border-[#483325] rounded flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  {previewIsPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5" /> Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" /> Play
                    </>
                  )}
                </button>
              )}
            </div>

            {/* 16:9 Live Preview Player */}
            <div className="relative aspect-video w-full bg-[#120E0C] border border-[#382A22] rounded overflow-hidden flex flex-col items-center justify-center shadow-2xl">
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
                      background:
                        'radial-gradient(ellipse at center, rgba(14, 10, 8, 0.35) 0%, rgba(10, 7, 5, 0.6) 100%)',
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
                    Please upload an MP4 or WebM video file.
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
                  𝓛.𝓐 𝓒𝓮𝓷𝓽𝓮𝓻 𝓙𝓮𝔀𝓮𝓵𝓻𝔂 𝓘𝓷𝓬
                </h4>
                <p
                  className="font-sans font-light text-[10px] sm:text-xs tracking-widest text-[#F3CA52]"
                  style={{
                    fontFamily: "'Montserrat', Arial, Helvetica, sans-serif",
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.95)',
                  }}
                >
                  Jewelry for a Lifetime
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

            <div className="p-3 bg-[#120E0C] border border-[#2B1E18] rounded text-xs text-[#A89681] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Autoplay is automatically enabled for all mobile and desktop browsers.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
