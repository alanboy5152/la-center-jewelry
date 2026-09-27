import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HeroSection: React.FC = () => {
  const { heroConfig } = useApp();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(heroConfig.autoplay ?? true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);

  // Sync video play state if autoplay or videoUrl changes
  useEffect(() => {
    setVideoError(false);
    if (videoRef.current) {
      if (heroConfig.autoplay ?? true) {
        videoRef.current.play().catch(() => {
          // Autoplay was prevented by browser policy, keep muted
          setIsPlaying(false);
        });
      }
    }
  }, [heroConfig.videoUrl, heroConfig.autoplay]);

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
          BACKGROUND LAYER: PURE VIDEO HERO
          ========================================================= */}
      <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#120F0D]">
        {!videoError && heroConfig.videoUrl ? (
          <video
            ref={videoRef}
            autoPlay={heroConfig.autoplay ?? true}
            loop
            muted={isMuted}
            playsInline
            onError={() => setVideoError(true)}
            className={`w-full h-full object-cover transition-transform duration-1000 ease-out ${
              heroConfig.videoPosition === 'top'
                ? 'object-top'
                : heroConfig.videoPosition === 'bottom'
                ? 'object-bottom'
                : 'object-center'
            }`}
          >
            {heroConfig.mobileVideoUrl && (
              <source
                src={heroConfig.mobileVideoUrl}
                media="(max-width: 640px)"
                type="video/mp4"
              />
            )}
            <source src={heroConfig.videoUrl} type="video/mp4" />
          </video>
        ) : heroConfig.posterUrl && !heroConfig.posterUrl.includes('photo-1515562141207-7a88fb7ce338') ? (
          <img
            src={heroConfig.posterUrl}
            alt="L.A Center Jewelry Inc Storefront 720 S Broadway Los Angeles"
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <div className="w-full h-full bg-[#120F0D]" />
        )}

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
