import React, { useRef, useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getHeroVideoFromCloudOrCache } from '../services/cloudVideoStorage';

export const HeroSection: React.FC = () => {
  const { heroConfig } = useApp();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);

  // Synchronously determine initial video based on screen width
  const getInitialVideo = () => {
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      return '/videos/hero-jewelry-mobile.mp4';
    }
    return '/videos/hero-jewelry.mp4';
  };

  const [currentVideoSrc, setCurrentVideoSrc] = useState<string>(getInitialVideo);

  // Ensure autoplay kicks off immediately on mount and on first interaction
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.defaultMuted = true;
    video.muted = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('x5-playsinline', '');

    const tryPlay = () => {
      if (video) {
        video.muted = true;
        const p = video.play();
        if (p !== undefined) {
          p.catch(() => {});
        }
      }
    };

    tryPlay();

    // Attach immediate user-interaction listeners across entire window
    const touchTriggers = ['touchstart', 'touchend', 'pointerdown', 'click', 'scroll', 'visibilitychange'];
    const handleGesture = () => {
      if (video && video.paused) {
        tryPlay();
      }
    };

    touchTriggers.forEach((evt) => {
      window.addEventListener(evt, handleGesture, { passive: true, capture: true });
    });

    return () => {
      touchTriggers.forEach((evt) => {
        window.removeEventListener(evt, handleGesture, { capture: true });
      });
    };
  }, []);

  // Check Cloud Video Storage in background if an admin uploaded a custom cloud video
  useEffect(() => {
    let isMounted = true;

    async function checkCloudVideo() {
      try {
        const cloudVideoUrl = await getHeroVideoFromCloudOrCache();
        if (cloudVideoUrl && isMounted && cloudVideoUrl !== currentVideoSrc) {
          setCurrentVideoSrc(cloudVideoUrl);
          if (videoRef.current) {
            videoRef.current.src = cloudVideoUrl;
            videoRef.current.muted = true;
            videoRef.current.play().catch(() => {});
          }
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
        if (isMounted) {
          setCurrentVideoSrc(heroConfig.videoUrl);
          if (videoRef.current) {
            videoRef.current.src = heroConfig.videoUrl;
            videoRef.current.muted = true;
            videoRef.current.play().catch(() => {});
          }
        }
      }
    }

    checkCloudVideo();

    return () => {
      isMounted = false;
    };
  }, [heroConfig.videoUrl]);

  if (!heroConfig.isEnabled) return null;

  return (
    <section
      className="relative w-full h-[72vh] min-h-[480px] max-h-[760px] overflow-hidden flex flex-col items-center justify-center cursor-pointer"
      id="hero-storefront-section"
      onClick={() => {
        if (videoRef.current && videoRef.current.paused) {
          videoRef.current.muted = true;
          videoRef.current.play().catch(() => {});
        }
      }}
    >
      {/* =========================================================
          BACKGROUND LAYER: PURE VIDEO HERO (ZERO IMAGE FLASH)
          ========================================================= */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {!videoError && (
          <video
            ref={(el) => {
              videoRef.current = el;
              if (el) {
                el.defaultMuted = true;
                el.muted = true;
                el.setAttribute('muted', '');
                el.setAttribute('playsinline', '');
                el.setAttribute('webkit-playsinline', '');
                el.setAttribute('x5-playsinline', '');
                el.play().catch(() => {});
              }
            }}
            src={currentVideoSrc}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            disableRemotePlayback
            onLoadedMetadata={(e) => {
              e.currentTarget.muted = true;
              e.currentTarget.play().catch(() => {});
            }}
            onCanPlay={(e) => {
              e.currentTarget.muted = true;
              e.currentTarget.play().catch(() => {});
            }}
            onCanPlayThrough={(e) => {
              e.currentTarget.muted = true;
              e.currentTarget.play().catch(() => {});
            }}
            onError={() => {
              if (currentVideoSrc !== '/videos/hero-jewelry.mp4') {
                setCurrentVideoSrc('/videos/hero-jewelry.mp4');
                setVideoError(false);
              } else {
                setVideoError(true);
              }
            }}
            className={`absolute inset-0 w-full h-full object-cover z-0 ${
              heroConfig.videoPosition === 'top'
                ? 'object-top'
                : heroConfig.videoPosition === 'bottom'
                ? 'object-bottom'
                : 'object-center'
            }`}
          />
        )}

        {/* Soft subtle contrast wash so video shines through with absolute clarity */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, 0.5) 100%)',
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
