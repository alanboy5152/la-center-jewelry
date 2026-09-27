import { FacebookPixelConfig } from '../types';

declare global {
  interface Window {
    fbq?: any;
    _fbq?: any;
  }
}

export interface PixelEventRecord {
  id: string;
  eventName: string;
  pixelId: string;
  params: Record<string, any>;
  timestamp: string;
  isSimulated?: boolean;
}

const EVENT_HISTORY_STORAGE_KEY = 'lac_pixel_event_history_v1';
let isPixelInitialized = false;
let currentPixelId = '';

/**
 * Retrieve recent pixel event history from memory / storage
 */
export function getPixelEventHistory(): PixelEventRecord[] {
  try {
    const raw = sessionStorage.getItem(EVENT_HISTORY_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function savePixelEventRecord(record: PixelEventRecord): void {
  try {
    const list = getPixelEventHistory();
    const updated = [record, ...list.slice(0, 49)];
    sessionStorage.setItem(EVENT_HISTORY_STORAGE_KEY, JSON.stringify(updated));
  } catch {}
}

/**
 * Initializes or re-initializes the official Meta (Facebook) Pixel script tag
 */
export function initFacebookPixel(config?: FacebookPixelConfig): void {
  if (!config || !config.enabled || !config.pixelId || !config.pixelId.trim()) {
    return;
  }

  const cleanPixelId = config.pixelId.trim();

  // If already initialized with this exact pixel ID, avoid duplicate init
  if (isPixelInitialized && currentPixelId === cleanPixelId) {
    return;
  }

  try {
    /* eslint-disable */
    if (!window.fbq) {
      const n: any = (window.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      });
      if (!window._fbq) window._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = '2.0';
      n.queue = [];
      const t = document.createElement('script');
      t.async = true;
      t.src = 'https://connect.facebook.net/en_US/fbevents.js';
      const s = document.getElementsByTagName('script')[0];
      if (s && s.parentNode) {
        s.parentNode.insertBefore(t, s);
      } else {
        document.head.appendChild(t);
      }
    }
    /* eslint-enable */

    // Initialize with Meta Pixel ID
    window.fbq('init', cleanPixelId);
    isPixelInitialized = true;
    currentPixelId = cleanPixelId;

    // Track initial PageView
    if (config.trackPageView !== false) {
      window.fbq('track', 'PageView');
    }

    const initRecord: PixelEventRecord = {
      id: `init-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      eventName: 'Pixel_Initialized',
      pixelId: cleanPixelId,
      params: { testEventCode: config.testEventCode || null },
      timestamp: new Date().toLocaleTimeString(),
      isSimulated: false,
    };
    savePixelEventRecord(initRecord);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('lac_pixel_event', {
          detail: initRecord,
        })
      );
    }

    console.info(`[Facebook Pixel] Initialized ID: ${cleanPixelId}`);
  } catch (err) {
    console.warn('[Facebook Pixel] Error initializing script tag (ad blocker or network):', err);
  }
}

/**
 * Tracks a custom or standard Meta Pixel event safely
 */
export function trackPixelEvent(
  eventName: string,
  params: Record<string, any> = {},
  config?: FacebookPixelConfig
): void {
  const activePixel = config?.pixelId ? config : null;
  const targetId = activePixel?.pixelId?.trim() || currentPixelId || 'SIMULATED';

  // Check if pixel should be initialized or re-initialized with new ID
  if (activePixel && activePixel.enabled && activePixel.pixelId) {
    if (!isPixelInitialized || currentPixelId !== activePixel.pixelId.trim()) {
      initFacebookPixel(activePixel);
    }
  }

  const enrichedParams = {
    ...params,
    ...(config?.testEventCode ? { test_event_code: config.testEventCode } : {}),
  };

  const hasFbq = typeof window !== 'undefined' && typeof window.fbq === 'function';

  const record: PixelEventRecord = {
    id: `ev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    eventName,
    pixelId: targetId,
    params: enrichedParams,
    timestamp: new Date().toLocaleTimeString(),
    isSimulated: !hasFbq,
  };

  savePixelEventRecord(record);

  // 1. Dispatch custom window event for live Admin Diagnostic Tester
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('lac_pixel_event', {
        detail: record,
      })
    );
  }

  // 2. Fire real Meta Pixel call if script is active
  if (hasFbq) {
    try {
      window.fbq('track', eventName, enrichedParams);
      console.log(`[Facebook Pixel Event] "${eventName}" sent:`, enrichedParams);
    } catch (err) {
      console.warn(`[Facebook Pixel] Failed to track "${eventName}":`, err);
    }
  } else {
    console.debug(`[Facebook Pixel Standby / AdBlocker] Event "${eventName}" recorded:`, enrichedParams);
  }
}
