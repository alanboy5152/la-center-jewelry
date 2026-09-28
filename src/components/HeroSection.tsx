import React, { useRef, useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getMediaUrl } from '../services/mediaStorage';
import {
  getHeroVideoFromCloudOrCache,
  subscribeToCloudHeroVideo,
} from '../services/cloudVideoStorage';

export const HeroSection: React.FC = () => {
  const { heroConfig } = useApp();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);
  const [currentVideoSrc, setCurrentVideoSrc] = useState<string>('');

  // Synchronously determine initial video or resolve from cloud
  useEffect(() => {
    let isMounted = true;

    const resolveVideo = async () => {
      const target = heroConfig.videoUrl || '';

      // Case 1: Video explicitly cleared / empty
      if (!target) {
        if (isMounted) setCurrentVideoSrc('');
        return;
      }

      // Case 2: Cloud-hosted video in Firestore
      if (target === 'cloud_hero_video') {
        // Check local IndexedDB cache first for instant playback
        const cachedBlob = await getMediaUrl('hero_video_desktop');
        if (cachedBlob && isMounted) {
          setCurrentVideoSrc(cachedBlob);
          return;
        }

        // Fetch from Firestore cloud chunks
        const cloudUrl = await getHeroVideoFromCloudOrCache();
        if (cloudUrl && isMounted) {
          setCurrentVideoSrc(cloudUrl);
        }
        return;
      }

      // Case 3: Direct URL (HTTP / HTTPS / local Blob URL)
      if (isMounted) {
        setCurrentVideoSrc(target);
      }
    };

    resolveVideo();

    // Subscribe to real-time cloud video updates across all browsers & tabs
    const unsubscribe = subscribeToCloudHeroVideo((cloudUrl) => {
      if (!isMounted) return;
      if (heroConfig.videoUrl === 'cloud_hero_video') {
        setCurrentVideoSrc(cloudUrl || '');
        setVideoError(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [heroConfig.videoUrl]);

  // Handle video element play / pause when source changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (currentVideoSrc) {
      video.src = currentVideoSrc;
      video.defaultMuted = true;
      video.muted = true;
      video.setAttribute('muted', '');
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');
      video.setAttribute('x5-playsinline', '');
      video.load();

      const tryPlay = () => {
        const v = videoRef.current;
        if (v && v.src) {
          v.defaultMuted = true;
          v.muted = true;
          v.play().catch(() => {});
        }
      };

      tryPlay();
      const t1 = setTimeout(tryPlay, 150);
      const t2 = setTimeout(tryPlay, 500);
      const t3 = setTimeout(tryPlay, 1200);

      const touchTriggers = [
        'touchstart',
        'touchend',
        'pointerdown',
        'mousedown',
        'click',
        'scroll',
        'wheel',
        'keydown',
      ];

      const handleGesture = () => {
        if (videoRef.current && videoRef.current.paused) {
          tryPlay();
        }
      };

      touchTriggers.forEach((evt) => {
        window.addEventListener(evt, handleGesture, { passive: true, capture: true });
      });

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        touchTriggers.forEach((evt) => {
          window.removeEventListener(evt, handleGesture, { capture: true });
        });
      };
    } else {
      video.pause();
      video.removeAttribute('src');
      video.load();
    }
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
          BACKGROUND LAYER: PURE VIDEO HERO (ZERO DEFAULT IMAGES/VIDEOS)
          If no video uploaded, displays deep obsidian jewel atmosphere
          ========================================================= */}
      <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#0A0706]">
        {currentVideoSrc && !videoError ? (
          <video
            ref={videoRef}
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
            onError={() => {
              setVideoError(true);
            }}
            className="absolute inset-0 w-full h-full object-cover object-center z-0"
          >
            <source src={currentVideoSrc} type="video/mp4" />
          </video>
        ) : (
          /* Subtle ambient luxury backdrop when waiting for admin upload */
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
              'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.5) 100%)',
          }}
        />
      </div>

      {/* =========================================================
          HERO TEXT OVERLAY (STOREFRONT WINDOW SIGNAGE)
          1. L.A Center Jewelry Inc (Calligraphy Script, Bold, Gold, Single Line)
          2. Jewelry for a Lifetime (Sans-Serif, Thin / Non-Bold, Warm Golden Yellow)
          ========================================================= */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-2 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center my-auto py-1 sm:py-4 md:py-8 select-none pointer-events-none">
        {/* 1. Main store name: "𝓛.𝓐 𝓒𝓮𝓷𝓽𝓮𝓻 𝓙𝓮𝔀𝓮𝓵𝓻𝔂 𝓘𝓷𝓬" */}
        <h1
          className="w-full whitespace-nowrap text-[13px] min-[360px]:text-[15px] min-[400px]:text-[17px] sm:text-[28px] md:text-[50px] lg:text-[64px] xl:text-[76px] leading-tight text-[#F3CA52] mb-0.5 sm:mb-2 md:mb-3 select-none font-normal flex items-center justify-center gap-x-1 min-[360px]:gap-x-1.5 sm:gap-x-4 md:gap-x-6"
          style={{
            fontFamily:
              "'Segoe UI Symbol', 'Apple Symbols', 'STIX Two Math', 'Cambria Math', 'DejaVu Sans', serif, system-ui, sans-serif",
            textShadow:
              '0 2px 4px rgba(0, 0, 0, 0.95), 0 4px 14px rgba(0, 0, 0, 0.85), 0 0 24px rgba(243, 202, 82, 0.3)',
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
