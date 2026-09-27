import React, { useRef, useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getHeroVideoFromCloudOrCache } from '../services/cloudVideoStorage';

export const HeroSection: React.FC = () => {
  const { heroConfig } = useApp();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);

  // Synchronously compute the right initial video so mobile and desktop play immediately on first frame
  const getInitialVideo = () => {
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      return '/videos/hero-jewelry-mobile.mp4';
    }
    return '/videos/hero-jewelry.mp4';
  };

  const [currentVideoSrc, setCurrentVideoSrc] = useState<string>(getInitialVideo);

  // Handle screen resize between mobile and desktop if using default bundled video
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768;
      const expected = isMobile ? '/videos/hero-jewelry-mobile.mp4' : '/videos/hero-jewelry.mp4';
      if (
        (currentVideoSrc === '/videos/hero-jewelry.mp4' || currentVideoSrc === '/videos/hero-jewelry-mobile.mp4') &&
        currentVideoSrc !== expected
      ) {
        setCurrentVideoSrc(expected);
      }
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, [currentVideoSrc]);

  // Check Cloud Video Storage in background if an admin uploaded a custom cloud video
  useEffect(() => {
    let isMounted = true;

    async function checkCloudVideo() {
      try {
        const cloudVideoUrl = await getHeroVideoFromCloudOrCache();
        if (cloudVideoUrl && isMounted && cloudVideoUrl !== currentVideoSrc) {
          setCurrentVideoSrc(cloudVideoUrl);
          setVideoError(false);
          return;
        }
      } catch (err) {
        console.warn('Could not read cloud hero video:', err);
      }

      if (
        heroConfig.videoUrl &&
        !heroConfig.videoUrl.startsWith('blob:') &&
        !heroConfig.videoUrl.includes('commondatastorage.googleapis.com') &&
        heroConfig.videoUrl !== currentVideoSrc
      ) {
        if (isMounted) setCurrentVideoSrc(heroConfig.videoUrl);
      }
    }

    checkCloudVideo();

    return () => {
      isMounted = false;
    };
  }, [heroConfig.videoUrl]);

  // Video autoplay configuration and gesture trigger
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.defaultMuted = true;
    video.muted = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');

    const tryPlay = () => {
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    };

    tryPlay();

    const onUserInteraction = () => {
      if (video.paused) {
        tryPlay();
      }
    };

    window.addEventListener('touchstart', onUserInteraction, { passive: true, once: true });
    window.addEventListener('touchend', onUserInteraction, { passive: true, once: true });
    window.addEventListener('click', onUserInteraction, { passive: true, once: true });
    window.addEventListener('scroll', onUserInteraction, { passive: true, once: true });

    return () => {
      window.removeEventListener('touchstart', onUserInteraction);
      window.removeEventListener('touchend', onUserInteraction);
      window.removeEventListener('click', onUserInteraction);
      window.removeEventListener('scroll', onUserInteraction);
    };
  }, [currentVideoSrc]);

  if (!heroConfig.isEnabled) return null;

  return (
    <section
      className="relative w-full h-[72vh] min-h-[480px] max-h-[760px] overflow-hidden bg-[#120F0D] flex flex-col items-center justify-center"
      id="hero-storefront-section"
    >
      {/* =========================================================
          BACKGROUND LAYER: PURE VIDEO HERO (ZERO IMAGE FLASH)
          ========================================================= */}
      <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#120F0D]">
        {!videoError && currentVideoSrc ? (
          <video
            ref={(el) => {
              videoRef.current = el;
              if (el) {
                el.defaultMuted = true;
                el.muted = true;
                el.setAttribute('muted', '');
                el.setAttribute('playsinline', '');
                el.setAttribute('webkit-playsinline', '');
                el.play().catch(() => {});
              }
            }}
            key={currentVideoSrc}
            src={currentVideoSrc}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            onCanPlay={() => {
              if (videoRef.current && videoRef.current.paused) {
                videoRef.current.play().catch(() => {});
              }
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
            className={`absolute inset-0 w-full h-full object-cover z-10 ${
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
          className="absolute inset-0 transition-opacity duration-300 pointer-events-none z-10"
          style={{
            background: `radial-gradient(ellipse at center, rgba(14, 10, 8, 0.42) 0%, rgba(10, 7, 5, 0.62) 100%)`,
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
          Cleanly positioned at bottom-right with ample margins
          ========================================================= */}
      <div className="absolute bottom-3 right-4 sm:bottom-4 sm:right-6 md:right-8 z-20 flex flex-col items-end text-right select-none pointer-events-none">
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
    </section>
  );
};
