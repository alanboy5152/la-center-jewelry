import React, { useRef, useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getMediaUrl } from '../services/mediaStorage';

export const HeroSection: React.FC = () => {
  const { heroConfig } = useApp();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);

  // Synchronously determine initial video based on heroConfig or screen width
  const getInitialVideo = () => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    if (isMobile) {
      return heroConfig.mobileVideoUrl || heroConfig.videoUrl || '';
    }
    return heroConfig.videoUrl || '';
  };

  const getInitialPoster = () => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    if (isMobile) {
      return heroConfig.mobilePosterUrl || '';
    }
    return heroConfig.posterUrl || '';
  };

  const [currentVideoSrc, setCurrentVideoSrc] = useState<string>(getInitialVideo);
  const [currentPoster, setCurrentPoster] = useState<string>(getInitialPoster);

  // Check for uploaded video from IndexedDB or heroConfig changes
  useEffect(() => {
    let isMounted = true;
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

    const configTarget = isMobile
      ? heroConfig.mobileVideoUrl || heroConfig.videoUrl || ''
      : heroConfig.videoUrl || '';

    if (configTarget !== currentVideoSrc) {
      setCurrentVideoSrc(configTarget);
      setVideoError(false);
      if (videoRef.current) {
        if (configTarget) {
          videoRef.current.src = configTarget;
          videoRef.current.load();
          videoRef.current.play().catch(() => {});
        } else {
          videoRef.current.pause();
          videoRef.current.removeAttribute('src');
          videoRef.current.load();
        }
      }
      return;
    }

    // Only check IndexedDB if heroConfig has a video or if user didn't clear it
    if (!configTarget && heroConfig.videoUrl === '') {
      return;
    }

    getMediaUrl('hero_video_desktop')
      .then((blobUrl) => {
        if (blobUrl && isMounted && blobUrl !== currentVideoSrc && heroConfig.videoUrl !== '') {
          setCurrentVideoSrc(blobUrl);
          if (videoRef.current) {
            videoRef.current.src = blobUrl;
            videoRef.current.load();
            videoRef.current.play().catch(() => {});
          }
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [heroConfig.videoUrl, heroConfig.mobileVideoUrl]);

  // Ensure autoplay kicks off immediately on mount and on first user gesture across ALL browsers
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !currentVideoSrc) return;

    // Strict muted inline attributes for Chromium, Safari iOS, Edge, and Firefox
    video.defaultMuted = true;
    video.muted = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('x5-playsinline', '');

    const tryPlay = () => {
      const v = videoRef.current;
      if (v && v.src) {
        v.defaultMuted = true;
        v.muted = true;
        const p = v.play();
        if (p !== undefined) {
          p.catch(() => {
            // Autoplay blocked by browser policy until interaction
          });
        }
      }
    };

    tryPlay();

    // Multi-stage retry timers to beat aggressive browser power-saving throttles
    const timer1 = setTimeout(tryPlay, 100);
    const timer2 = setTimeout(tryPlay, 400);
    const timer3 = setTimeout(tryPlay, 1000);
    const timer4 = setTimeout(tryPlay, 2000);

    // Attach immediate user-interaction listeners across entire window
    const touchTriggers = [
      'touchstart',
      'touchend',
      'pointerdown',
      'mousedown',
      'click',
      'scroll',
      'wheel',
      'keydown',
      'mousemove',
      'visibilitychange',
    ];

    const handleGesture = () => {
      const v = videoRef.current;
      if (v && v.paused && v.src) {
        tryPlay();
      }
    };

    touchTriggers.forEach((evt) => {
      window.addEventListener(evt, handleGesture, { passive: true, capture: true });
    });

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      touchTriggers.forEach((evt) => {
        window.removeEventListener(evt, handleGesture, { capture: true });
      });
    };
  }, [currentVideoSrc]);

  if (!heroConfig.isEnabled) return null;

  return (
    <section
      className="relative w-full aspect-video sm:aspect-video md:aspect-auto md:h-[72vh] md:min-h-[480px] md:max-h-[760px] overflow-hidden flex flex-col items-center justify-center cursor-pointer select-none"
      id="hero-storefront-section"
      onClick={() => {
        if (videoRef.current && videoRef.current.paused) {
          videoRef.current.muted = true;
          videoRef.current.play().catch(() => {});
        }
      }}
    >
      {/* =========================================================
          BACKGROUND LAYER: PURE VIDEO HERO (ZERO DEFAULT IMAGES)
          ========================================================= */}
      <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#0A0706]">
        {currentVideoSrc && !videoError ? (
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
            poster={currentPoster || undefined}
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
            onLoadedData={(e) => {
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
              setVideoError(true);
            }}
            className="absolute inset-0 w-full h-full object-cover object-center z-0"
          >
            <source src={currentVideoSrc} type="video/mp4" />
          </video>
        ) : null}

        {/* Soft subtle contrast wash */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.45) 100%)',
          }}
        />
      </div>

      {/* =========================================================
          HERO TEXT OVERLAY (STOREFRONT WINDOW SIGNAGE)
          1. L.A Center Jewelry Inc (Calligraphy Script, Bold, Yellow/Gold, Single Line across all devices)
          2. Jewelry for a Lifetime (Sans-Serif, Thin / Non-Bold, Warm Golden Yellow)
          ========================================================= */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-2 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center my-auto py-1 sm:py-4 md:py-8 select-none pointer-events-none">
        {/* 1. Main store name: "𝓛.𝓐 𝓒𝓮𝓷𝓽𝓮𝓻 𝓙𝓮𝔀𝓮𝓵𝓻𝔂 𝓘𝓷𝓬" */}
        <h1
          className="w-full whitespace-nowrap text-[13px] min-[360px]:text-[15px] min-[400px]:text-[17px] sm:text-[28px] md:text-[50px] lg:text-[64px] xl:text-[76px] leading-tight text-[#F3CA52] mb-0.5 sm:mb-2 md:mb-3 select-none font-normal flex items-center justify-center gap-x-1 min-[360px]:gap-x-1.5 sm:gap-x-4 md:gap-x-6"
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

        {/* 2. Tagline directly underneath */}
        <h2
          className="font-sans font-light sm:font-normal text-[9px] min-[360px]:text-[10px] sm:text-base md:text-2xl lg:text-[28px] tracking-[0.08em] sm:tracking-widest text-[#F3CA52]"
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
      <div className="absolute bottom-1 right-2 sm:bottom-3 sm:right-4 md:right-8 z-20 flex flex-col items-end text-right select-none pointer-events-none">
        <p
          className="font-sans font-normal text-[8px] min-[360px]:text-[9px] sm:text-xs md:text-sm tracking-wide text-[#F3CA52]"
          style={{
            fontFamily: "'Montserrat', Arial, Helvetica, sans-serif",
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.95), 0 3px 8px rgba(0, 0, 0, 0.8)',
          }}
        >
          Free Parking
        </p>
        <p
          className="font-sans font-normal text-[7px] min-[360px]:text-[8px] sm:text-[11px] md:text-xs tracking-wide text-[#F3CA52] mt-0.5"
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
