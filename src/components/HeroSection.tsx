import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import {
  subscribeToCloudHeroVideo,
} from '../services/cloudVideoStorage';

export const HeroSection: React.FC = () => {
  const { heroConfig } = useApp();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoError, setVideoError] = useState(false);

  // Synchronously compute initial video from frame 1 so the <video> tag is NEVER delayed
  const getInitialVideo = useCallback(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    const directStatic = isMobile ? '/videos/hero-active-mobile.mp4' : '/videos/hero-active.mp4';

    let target = isMobile
      ? heroConfig.mobileVideoUrl || heroConfig.videoUrl || directStatic
      : heroConfig.videoUrl || directStatic;

    // Never pass marker strings as video src, use the optimized direct file
    if (
      !target ||
      target === 'cloud_hero_video' ||
      target === 'local_uploaded_video' ||
      target.includes('hero-jewelry')
    ) {
      return directStatic;
    }
    return target;
  }, [heroConfig.videoUrl, heroConfig.mobileVideoUrl]);

  const [currentVideoSrc, setCurrentVideoSrc] = useState<string>(getInitialVideo);
  const isMobileView = typeof window !== 'undefined' && window.innerWidth <= 768;

  const posterSrc = isMobileView
    ? heroConfig.mobilePosterUrl || '/videos/hero-active-poster-mobile.jpg'
    : heroConfig.posterUrl || '/videos/hero-active-poster.jpg';

  // Reliable Autoplay Trigger across mobile Safari, Android Chrome, and Desktop
  const triggerAutoplay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    // Enforce strict muted inline attributes for mobile autoplay policy
    video.defaultMuted = true;
    video.muted = true;
    video.volume = 0;
    video.playsInline = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', 'true');
    video.setAttribute('x5-playsinline', 'true');
    video.setAttribute('x5-video-player-type', 'h5-page');
    video.setAttribute('x5-video-player-fullscreen', 'false');

    if (video.paused) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // In case of aggressive low-power mode, try again in next microtask
          requestAnimationFrame(() => {
            if (videoRef.current && videoRef.current.paused) {
              videoRef.current.muted = true;
              videoRef.current.volume = 0;
              videoRef.current.play().catch(() => {});
            }
          });
        });
      }
    }
  }, []);

  // Callback ref for instant DOM-level initialization before paint
  const handleVideoRef = useCallback((el: HTMLVideoElement | null) => {
    videoRef.current = el;
    if (el) {
      el.defaultMuted = true;
      el.muted = true;
      el.volume = 0;
      el.playsInline = true;
      el.setAttribute('muted', '');
      el.setAttribute('playsinline', '');
      el.setAttribute('webkit-playsinline', 'true');
      el.setAttribute('x5-playsinline', 'true');
      el.setAttribute('x5-video-player-type', 'h5-page');
      el.setAttribute('x5-video-player-fullscreen', 'false');

      const playPromise = el.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Retry immediately
          setTimeout(() => {
            if (el.paused) {
              el.muted = true;
              el.volume = 0;
              el.play().catch(() => {});
            }
          }, 30);
        });
      }
    }
  }, []);

  // IntersectionObserver to guarantee play when hero enters viewport
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.muted = true;
            video.volume = 0;
            video.play().catch(() => {});
          }
        });
      },
      { threshold: 0.05 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [currentVideoSrc]);

  // Purge any legacy browser caches of old default video
  useEffect(() => {
    try {
      if ('caches' in window) {
        caches.keys().then((names) => {
          names.forEach((name) => {
            caches.open(name).then((cache) => {
              cache.delete('/videos/hero-jewelry.mp4');
              cache.delete('/videos/hero-jewelry-mobile.mp4');
              cache.delete('/videos/hero-poster.jpg');
              cache.delete('/videos/hero-poster-mobile.jpg');
            });
          });
        });
      }
    } catch {}
  }, []);

  // Synchronously update video source if heroConfig changes
  useEffect(() => {
    let isMounted = true;

    const resolveVideo = async () => {
      const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
      const directStatic = isMobile ? '/videos/hero-active-mobile.mp4' : '/videos/hero-active.mp4';

      let target = isMobile
        ? heroConfig.mobileVideoUrl || heroConfig.videoUrl || directStatic
        : heroConfig.videoUrl || directStatic;

      if (
        !target ||
        target === 'cloud_hero_video' ||
        target === 'local_uploaded_video' ||
        target.includes('hero-jewelry')
      ) {
        target = directStatic;
      }

      // If pointing to a direct external URL
      if (target.startsWith('http://') || target.startsWith('https://')) {
        if (isMounted && target !== currentVideoSrc) {
          setCurrentVideoSrc(target);
        }
        return;
      }

      // If already playing the static video, keep playing uninterrupted
      if (currentVideoSrc === directStatic) {
        return;
      }

      if (isMounted && target !== currentVideoSrc) {
        setCurrentVideoSrc(target);
      }
    };

    resolveVideo();

    // Subscribe to cloud updates in real-time across all browsers
    const unsubscribe = subscribeToCloudHeroVideo((cloudUrl) => {
      if (!isMounted) return;
      if (cloudUrl && cloudUrl.startsWith('http')) {
        setCurrentVideoSrc(cloudUrl);
        setVideoError(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [heroConfig.videoUrl, heroConfig.mobileVideoUrl, currentVideoSrc]);

  // Autoplay activation lifecycle on mount and on ANY touch/scroll anywhere on the page
  useEffect(() => {
    triggerAutoplay();

    // Staggered retries to guarantee autoplay even on slow cellular networks
    const t1 = setTimeout(triggerAutoplay, 30);
    const t2 = setTimeout(triggerAutoplay, 100);
    const t3 = setTimeout(triggerAutoplay, 250);
    const t4 = setTimeout(triggerAutoplay, 500);
    const t5 = setTimeout(triggerAutoplay, 1000);

    const handleAnyUserActivity = () => {
      const video = videoRef.current;
      if (video && video.paused) {
        video.muted = true;
        video.volume = 0;
        video.play().catch(() => {});
      }
    };

    // Any micro-interaction (scroll, tap anywhere, pointer, touch) starts video instantly
    const globalTriggers = [
      'touchstart',
      'touchmove',
      'touchend',
      'pointerdown',
      'pointerup',
      'mousedown',
      'scroll',
      'wheel',
      'keydown',
      'pageshow',
      'focus',
      'visibilitychange',
    ];

    globalTriggers.forEach((evt) => {
      window.addEventListener(evt, handleAnyUserActivity, { passive: true, capture: true });
    });

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      globalTriggers.forEach((evt) => {
        window.removeEventListener(evt, handleAnyUserActivity, { capture: true });
      });
    };
  }, [triggerAutoplay, currentVideoSrc]);

  if (!heroConfig.isEnabled) return null;

  return (
    <section
      className="relative w-full h-[260px] min-[360px]:h-[290px] min-[400px]:h-[320px] sm:aspect-video md:aspect-auto md:h-[72vh] md:min-h-[480px] md:max-h-[760px] overflow-hidden flex flex-col items-center justify-center select-none"
      id="hero-storefront-section"
      onClick={triggerAutoplay}
    >
      {/* =========================================================
          BACKGROUND LAYER: PURE VIDEO HERO (AUTO-PLAYS INSTANTLY)
          Synchronously mounted, muted, playsinline, loop, autoPlay
          ========================================================= */}
      <div
        className="absolute inset-0 w-full h-full overflow-hidden bg-[#0A0706] bg-cover bg-center"
        style={{ backgroundImage: `url(${posterSrc})` }}
      >
        {currentVideoSrc && !videoError ? (
          <video
            ref={handleVideoRef}
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
              e.currentTarget.volume = 0;
              e.currentTarget.play().catch(() => {});
            }}
            onLoadedData={(e) => {
              e.currentTarget.muted = true;
              e.currentTarget.volume = 0;
              e.currentTarget.play().catch(() => {});
            }}
            onCanPlay={(e) => {
              e.currentTarget.muted = true;
              e.currentTarget.volume = 0;
              e.currentTarget.play().catch(() => {});
            }}
            onCanPlayThrough={(e) => {
              e.currentTarget.muted = true;
              e.currentTarget.volume = 0;
              e.currentTarget.play().catch(() => {});
            }}
            onError={() => {
              if (currentVideoSrc !== '/videos/hero-active.mp4') {
                setCurrentVideoSrc('/videos/hero-active.mp4');
                setVideoError(false);
              } else {
                setVideoError(true);
              }
            }}
            className="absolute inset-0 w-full h-full object-cover object-center z-0 pointer-events-none"
          />
        ) : (
          <div
            className="absolute inset-0 z-0 opacity-40 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at 50% 40%, rgba(212, 175, 55, 0.15) 0%, rgba(10, 7, 6, 0.95) 75%)',
            }}
          />
        )}

        {/* Soft subtle contrast wash */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0.55) 100%)',
          }}
        />
      </div>

      {/* =========================================================
          HERO TEXT OVERLAY (STOREFRONT WINDOW SIGNAGE)
          Larger, Zoomed, Clear & Prominent on Mobile View
          1. L.A Center Jewelry Inc (Calligraphy Script, Bold, Gold)
          2. Jewelry for a Lifetime (Sans-Serif, Thin / Non-Bold, Warm Golden Yellow)
          ========================================================= */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center my-auto py-2 sm:py-4 md:py-8 select-none pointer-events-none">
        {/* 1. Main store name: "𝓛.𝓐 𝓒𝓮𝓷𝓽𝓮𝓻 𝓙𝓮𝔀𝓮𝓵𝓻𝔂 𝓘𝓷𝓬" - Enlarged on Mobile */}
        <h1
          className="w-full whitespace-nowrap text-[22px] min-[360px]:text-[25px] min-[400px]:text-[28px] sm:text-[34px] md:text-[50px] lg:text-[64px] xl:text-[76px] leading-tight text-[#F3CA52] mb-1 sm:mb-2 md:mb-3 select-none font-normal flex items-center justify-center gap-x-1.5 min-[360px]:gap-x-2 sm:gap-x-4 md:gap-x-6 drop-shadow-md"
          style={{
            fontFamily:
              "'Segoe UI Symbol', 'Apple Symbols', 'STIX Two Math', 'Cambria Math', 'DejaVu Sans', serif, system-ui, sans-serif",
            textShadow:
              '0 2px 6px rgba(0, 0, 0, 0.95), 0 4px 16px rgba(0, 0, 0, 0.9), 0 0 28px rgba(243, 202, 82, 0.45)',
          }}
        >
          {heroConfig.headline && !heroConfig.headline.includes('𝓛.𝓐') ? (
            <span>{heroConfig.headline}</span>
          ) : (
            <>
              <span>𝓛.𝓐</span>
              <span>𝓒𝓮𝓷𝓽𝓮𝓻</span>
              <span>𝓙𝓮𝔀𝓮𝓵𝓻𝔂</span>
              <span>𝓘𝓷𝓬</span>
            </>
          )}
        </h1>

        {/* 2. Tagline directly underneath - Zoomed for clarity */}
        <h2
          className="font-sans font-normal text-[11px] min-[360px]:text-[12px] min-[400px]:text-[14px] sm:text-base md:text-2xl lg:text-[28px] tracking-[0.06em] sm:tracking-widest text-[#F3CA52]"
          style={{
            fontFamily: "'Montserrat', Arial, Helvetica, sans-serif",
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.95), 0 3px 10px rgba(0, 0, 0, 0.85)',
          }}
        >
          {heroConfig.tagline || 'Jewelry for a Lifetime'}
        </h2>
      </div>

      {/* =========================================================
          BOTTOM CORNER PROMOTIONAL TEXT (FREE PARKING & SPECIAL PRICES)
          ========================================================= */}
      <div className="absolute bottom-1 right-2 sm:bottom-3 sm:right-4 md:right-8 z-20 flex flex-col items-end text-right select-none pointer-events-none">
        <p
          className="font-sans font-semibold text-[9px] min-[360px]:text-[10px] sm:text-xs md:text-sm tracking-wide text-[#F3CA52]"
          style={{
            fontFamily: "'Montserrat', Arial, Helvetica, sans-serif",
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.95), 0 3px 8px rgba(0, 0, 0, 0.8)',
          }}
        >
          Free Parking
        </p>
        <p
          className="font-sans font-medium text-[8px] min-[360px]:text-[9px] sm:text-[11px] md:text-xs tracking-wide text-[#F3CA52] mt-0.5"
          style={{
            fontFamily: "'Montserrat', Arial, Helvetica, sans-serif",
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.95), 0 3px 8px rgba(0, 0, 0, 0.8)',
          }}
        >
          Special Prices: 30-50% Off
        </p>
      </div>
    </section>
  );
};
