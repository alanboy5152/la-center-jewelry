import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getHeroVideoFromCloudOrCache } from '../services/cloudVideoStorage';

export const HeroSection: React.FC = () => {
  const { heroConfig } = useApp();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(heroConfig.autoplay ?? true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [currentVideoSrc, setCurrentVideoSrc] = useState<string>('/videos/hero-jewelry.mp4');

  const defaultPoster = '/videos/hero-poster.jpg';

  const posterImage =
    heroConfig.posterUrl &&
    !heroConfig.posterUrl.includes('photo-1515562141207-7a88fb7ce338')
      ? heroConfig.posterUrl
      : defaultPoster;

  // Resolve video source: Prioritize custom video uploaded to Firestore cloud chunks, then valid URL, then bundled video
  useEffect(() => {
    let isMounted = true;

    async function resolveSource() {
      // 1. First priority: Check Cloud Video Storage (downloads chunks from Firestore or gets local cache)
      try {
        const cloudVideoUrl = await getHeroVideoFromCloudOrCache();
        if (cloudVideoUrl && isMounted) {
          setCurrentVideoSrc(cloudVideoUrl);
          setVideoError(false);
          return;
        }
      } catch (err) {
        console.warn('Could not read cloud hero video:', err);
      }

      // 2. Second priority: If heroConfig has a valid active URL (non-blob, non-commondatastorage)
      if (
        heroConfig.videoUrl &&
        !heroConfig.videoUrl.startsWith('blob:') &&
        !heroConfig.videoUrl.includes('commondatastorage.googleapis.com')
      ) {
        if (isMounted) setCurrentVideoSrc(heroConfig.videoUrl);
      } else {
        if (isMounted) setCurrentVideoSrc('/videos/hero-jewelry.mp4');
      }
      if (isMounted) setVideoError(false);
    }

    resolveSource();

    return () => {
      isMounted = false;
    };
  }, [heroConfig.videoUrl]);

  // Ensure video autoplays immediately when currentVideoSrc changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;

    if (heroConfig.autoplay ?? true) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setIsVideoLoaded(true);
          })
          .catch(() => {
            // Autoplay policy prevented, will resume on user interaction
            setIsPlaying(false);
          });
      }
    }
  }, [currentVideoSrc, heroConfig.autoplay]);

  // One-time interaction fallback to ensure video plays if browser blocked unprompted autoplay
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (videoRef.current && videoRef.current.paused) {
        videoRef.current.muted = true;
        videoRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            setIsVideoLoaded(true);
          })
          .catch(() => {});
      }
    };

    window.addEventListener('touchstart', handleFirstInteraction, { once: true, passive: true });
    window.addEventListener('click', handleFirstInteraction, { once: true, passive: true });
    window.addEventListener('scroll', handleFirstInteraction, { once: true, passive: true });

    return () => {
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('scroll', handleFirstInteraction);
    };
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  if (!heroConfig.isEnabled) return null;

  return (
    <section
      className="relative w-full h-[72vh] min-h-[480px] max-h-[760px] overflow-hidden bg-[#120F0D] flex flex-col items-center justify-center"
      id="hero-storefront-section"
    >
      {/* =========================================================
          BACKGROUND LAYER: PURE VIDEO HERO WITH INSTANT POSTER BACKDROP
          ========================================================= */}
      <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#120F0D]">
        {/* Underlying Poster Image to prevent any black screen while video is initializing */}
        <img
          src={posterImage}
          alt="L.A Center Jewelry Inc Storefront Showcase"
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
          loading="eager"
          decoding="async"
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            if (target.src !== defaultPoster) {
              target.src = defaultPoster;
            }
          }}
        />

        {!videoError && currentVideoSrc ? (
          <video
            ref={videoRef}
            key={currentVideoSrc}
            src={currentVideoSrc}
            autoPlay={heroConfig.autoplay ?? true}
            loop
            muted={isMuted}
            playsInline
            preload="auto"
            poster={posterImage}
            onLoadedData={() => {
              setIsVideoLoaded(true);
              setVideoError(false);
            }}
            onPlaying={() => {
              setIsPlaying(true);
              setIsVideoLoaded(true);
              setVideoError(false);
            }}
            onError={(e) => {
              console.warn('Hero video failed to load, falling back to local hero-jewelry.mp4', e);
              if (currentVideoSrc !== '/videos/hero-jewelry.mp4') {
                setCurrentVideoSrc('/videos/hero-jewelry.mp4');
                setVideoError(false);
              } else {
                setVideoError(true);
              }
            }}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out z-10 ${
              isVideoLoaded ? 'opacity-100' : 'opacity-90'
            } ${
              heroConfig.videoPosition === 'top'
                ? 'object-top'
                : heroConfig.videoPosition === 'bottom'
                ? 'object-bottom'
                : 'object-center'
            }`}
          />
        ) : null}

        {/* Cinematic Overlay: Soft dark cinematic wash so video is clearly visible while text is 100% crisp and readable */}
        <div
          className="absolute inset-0 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, rgba(14, 10, 8, 0.45) 0%, rgba(10, 7, 5, 0.65) 100%)`,
          }}
        />
      </div>

      {/* =========================================================
          HERO TEXT OVERLAY (STOREFRONT WINDOW SIGNAGE)
          1. L.A Center Jewelry Inc (Calligraphy Script, Bold, Yellow/Gold, Single Line across all devices)
          2. Jewelry for a Lifetime (Sans-Serif, Thin / Non-Bold, Warm Golden Yellow)
          ========================================================= */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-2 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center my-auto py-8 select-none pointer-events-none">
        {/* 1. Main store name: "𝓛.𝓐 𝓒𝓮𝓷𝓽𝓮𝓻 𝓙𝓮𝔀𝓮𝓵𝓻𝔂 𝓘𝓷𝓬" strictly in a single line on all screen sizes with generous spacing */}
        <h1
          className="w-full whitespace-nowrap text-[17px] min-[360px]:text-[19px] min-[400px]:text-[22px] sm:text-[38px] md:text-[52px] lg:text-[68px] xl:text-[80px] leading-tight text-[#F3CA52] mb-2 sm:mb-3 select-none font-normal flex items-center justify-center gap-x-1.5 min-[360px]:gap-x-2 sm:gap-x-4 md:gap-x-6"
          style={{
            fontFamily: "'Segoe UI Symbol', 'Apple Symbols', 'STIX Two Math', 'Cambria Math', 'DejaVu Sans', serif, system-ui, sans-serif",
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.95), 0 4px 14px rgba(0, 0, 0, 0.85), 0 0 24px rgba(243, 202, 82, 0.3)',
          }}
        >
          <span>𝓛.𝓐</span>
          <span>𝓒𝓮𝓷𝓽𝓮𝓻</span>
          <span>𝓙𝓮𝔀𝓮𝓵𝓻𝔂</span>
          <span>𝓘𝓷𝓬</span>
        </h1>

        {/* 2. Tagline directly underneath: Non-bold / thin clean sans-serif */}
        <h2
          className="font-sans font-light sm:font-normal text-xs min-[360px]:text-sm sm:text-xl md:text-2xl lg:text-[28px] tracking-[0.08em] sm:tracking-widest text-[#F3CA52]"
          style={{
            fontFamily: "'Montserrat', Arial, Helvetica, sans-serif",
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.95), 0 3px 8px rgba(0, 0, 0, 0.75)',
          }}
        >
          Jewelry for a Lifetime
        </h2>
      </div>

      {/* =========================================================
          BOTTOM CORNER PROMOTIONAL TEXT (FREE PARKING & SPECIAL PRICES)
          ========================================================= */}
      <div className="absolute bottom-3 right-18 sm:bottom-4 sm:right-22 md:right-24 z-20 flex flex-col items-end text-right select-none pointer-events-none">
        <p
          className="font-sans font-normal text-xs sm:text-sm tracking-wide text-[#F3CA52]"
          style={{
            fontFamily: "'Montserrat', Arial, Helvetica, sans-serif",
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.95), 0 3px 8px rgba(0, 0, 0, 0.8)',
          }}
        >
          Free Parking
        </p>
        <p
          className="font-sans font-normal text-[11px] sm:text-xs tracking-wide text-[#F3CA52] mt-0.5"
          style={{
            fontFamily: "'Montserrat', Arial, Helvetica, sans-serif",
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.95), 0 3px 8px rgba(0, 0, 0, 0.8)',
          }}
        >
          <span>Special Prices: </span>
          <span>30-50% Off</span>
        </p>
      </div>

      {/* =========================================================
          VIDEO PLAYBACK CONTROLS (PLAY/PAUSE & MUTE)
          ========================================================= */}
      {!videoError && heroConfig.videoUrl && (
        <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-20 flex items-center gap-1.5 bg-[#16110F]/90 backdrop-blur-md border border-[#3E3029] rounded-full p-1.5 text-xs text-white/90 shadow-xl">
          <button
            type="button"
            onClick={togglePlay}
            className="p-1.5 rounded-full hover:bg-white/10 hover:text-[#D4AF37] transition-colors cursor-pointer"
            title={isPlaying ? 'Pause Video' : 'Play Video'}
            aria-label={isPlaying ? 'Pause Video' : 'Play Video'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            type="button"
            onClick={toggleMute}
            className="p-1.5 rounded-full hover:bg-white/10 hover:text-[#D4AF37] transition-colors cursor-pointer"
            title={isMuted ? 'Unmute Video' : 'Mute Video'}
            aria-label={isMuted ? 'Unmute Video' : 'Mute Video'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      )}
    </section>
  );
};
