import React, { useState, useEffect } from 'react';
import {
  Activity,
  Check,
  ExternalLink,
  Info,
  Play,
  RotateCcw,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Zap,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FacebookPixelConfig } from '../../types';
import {
  trackPixelEvent,
  initFacebookPixel,
  getPixelEventHistory,
  PixelEventRecord,
} from '../../utils/facebookPixel';

export const AdminPixelTab: React.FC = () => {
  const { facebookPixel, updateFacebookPixel, showToast } = useApp();

  const [pixelForm, setPixelForm] = useState<FacebookPixelConfig>({
    enabled: facebookPixel?.enabled ?? false,
    pixelId: facebookPixel?.pixelId || '',
    accessToken: facebookPixel?.accessToken || '',
    testEventCode: facebookPixel?.testEventCode || '',
    trackPageView: facebookPixel?.trackPageView ?? true,
    trackViewContent: facebookPixel?.trackViewContent ?? true,
    trackAddToCart: facebookPixel?.trackAddToCart ?? true,
    trackInitiateCheckout: facebookPixel?.trackInitiateCheckout ?? true,
    trackPurchase: facebookPixel?.trackPurchase ?? true,
  });

  const [eventLogs, setEventLogs] = useState<PixelEventRecord[]>(() => {
    return getPixelEventHistory();
  });

  // Synchronize with context updates (e.g. from Firestore or initial load)
  useEffect(() => {
    if (facebookPixel) {
      setPixelForm({
        enabled: facebookPixel.enabled ?? false,
        pixelId: facebookPixel.pixelId || '',
        accessToken: facebookPixel.accessToken || '',
        testEventCode: facebookPixel.testEventCode || '',
        trackPageView: facebookPixel.trackPageView ?? true,
        trackViewContent: facebookPixel.trackViewContent ?? true,
        trackAddToCart: facebookPixel.trackAddToCart ?? true,
        trackInitiateCheckout: facebookPixel.trackInitiateCheckout ?? true,
        trackPurchase: facebookPixel.trackPurchase ?? true,
      });
    }
  }, [facebookPixel]);

  // Listen to live browser pixel events fired by this tab or customer storefront actions
  useEffect(() => {
    const handlePixelEvent = (e: any) => {
      if (e.detail) {
        setEventLogs((prev) => [e.detail, ...prev.slice(0, 39)]);
      }
    };

    window.addEventListener('lac_pixel_event', handlePixelEvent);
    return () => {
      window.removeEventListener('lac_pixel_event', handlePixelEvent);
    };
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanId = pixelForm.pixelId.replace(/\s+/g, '');

    if (pixelForm.enabled && !cleanId) {
      showToast('Please provide a valid Meta Pixel ID before enabling.', 'error');
      return;
    }

    const payload: FacebookPixelConfig = {
      ...pixelForm,
      pixelId: cleanId,
    };

    updateFacebookPixel(payload);
    setPixelForm(payload);

    if (payload.enabled && cleanId) {
      initFacebookPixel(payload);
    }

    showToast('Facebook Pixel configuration successfully saved.', 'success');
  };

  const handleTestEvent = (eventName: string, sampleData: Record<string, any>) => {
    const activeId = pixelForm.pixelId.trim();
    if (!activeId) {
      showToast('Enter a Meta Pixel ID in the field above to test event dispatch.', 'error');
      return;
    }

    // Force dispatch with current form config so tests work immediately even before saving
    trackPixelEvent(eventName, sampleData, {
      ...pixelForm,
      enabled: true,
      pixelId: activeId,
    });

    showToast(`Dispatched test event "${eventName}" with Meta Pixel ID ${activeId}.`, 'success');
  };

  const clearLogs = () => {
    try {
      sessionStorage.removeItem('lac_pixel_event_history_v1');
    } catch {}
    setEventLogs([]);
    showToast('Event diagnostic stream cleared.', 'info');
  };

  const isConfigured = Boolean(pixelForm.pixelId.trim());
  const isActive = pixelForm.enabled && isConfigured;

  return (
    <div className="space-y-3 sm:space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <h2 className="font-serif text-lg sm:text-2xl font-normal text-white flex items-center gap-2">
          <span>Facebook (Meta) Pixel &amp; Ads Tracking</span>
          <span
            className={`text-[9.5px] sm:text-[10px] px-1.5 py-0.5 uppercase tracking-wider font-mono font-bold ${
              isActive
                ? 'bg-emerald-950/80 border border-emerald-700 text-emerald-300'
                : 'bg-neutral-800 text-neutral-400'
            }`}
          >
            {isActive ? 'Active' : 'Standby'}
          </span>
        </h2>
        <p className="text-[11px] sm:text-xs text-neutral-400 mt-0.5">
          Connect your Meta Pixel ID to run Facebook and Instagram ad campaigns, optimize conversion events, and measure fine jewelry acquisitions.
        </p>
      </div>

      {/* Meta Pixel Status Banner */}
      <div className="p-3 sm:p-5 bg-gradient-to-r from-[#181C26] to-[#12161E] border border-blue-900/40 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 bg-[#0E131C] border border-blue-800/40 rounded-xs p-1 flex items-center justify-center text-blue-400">
            <Activity className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-white">Status:</span>
              <span
                className={`font-mono text-xs font-bold ${
                  isActive ? 'text-emerald-400' : 'text-neutral-400'
                }`}
              >
                {isActive
                  ? `Live (${pixelForm.pixelId})`
                  : isConfigured
                  ? `Configured (${pixelForm.pixelId})`
                  : 'Not Configured'}
              </span>
            </div>
            <p className="text-[10.5px] sm:text-[11px] text-neutral-400">
              {isActive
                ? 'Storefront interactions fire real-time conversion triggers.'
                : 'Pixel tracking is currently in standby.'}
            </p>
          </div>
        </div>

        <a
          href="https://business.facebook.com/events_manager2"
          target="_blank"
          rel="noopener noreferrer"
          className="self-start sm:self-auto px-3 py-1.5 bg-[#1B2332] hover:bg-[#253045] border border-blue-800/60 text-blue-200 text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors"
        >
          <span>Events Manager</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Main Configuration Form */}
      <form onSubmit={handleSave} className="bg-[#181210] border border-[#2D211B] p-3 sm:p-6 md:p-8 space-y-3.5 sm:space-y-6 text-xs">
        <div className="flex items-center justify-between border-b border-[#261E1A] pb-2.5 sm:pb-4">
          <div>
            <h3 className="font-serif text-sm sm:text-base text-white font-medium">Pixel Credentials</h3>
            <p className="text-[10px] sm:text-[11px] text-neutral-400">Basic Meta Pixel setup for web events</p>
          </div>

          {/* Master Enable/Disable Switch */}
          <button
            type="button"
            onClick={() => setPixelForm({ ...pixelForm, enabled: !pixelForm.enabled })}
            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xs border text-xs font-semibold transition-colors cursor-pointer ${
              pixelForm.enabled
                ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300'
                : 'bg-[#201815] border-[#3E2D25] text-neutral-400'
            }`}
          >
            {pixelForm.enabled ? (
              <>
                <ToggleRight className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                <span>Enabled</span>
              </>
            ) : (
              <>
                <ToggleLeft className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-500" />
                <span>Disabled</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
          <div>
            <label className="uppercase font-semibold text-neutral-300 block mb-1 text-[11px] sm:text-xs">
              Facebook (Meta) Pixel ID *
            </label>
            <input
              type="text"
              required={pixelForm.enabled}
              value={pixelForm.pixelId}
              onChange={(e) => setPixelForm({ ...pixelForm, pixelId: e.target.value.replace(/\s+/g, '') })}
              placeholder="e.g. 123456789012345"
              className="w-full bg-[#120E0C] border border-[#3E2D25] text-white p-2 sm:p-2.5 text-xs font-mono focus:outline-none focus:border-[#D4AF37]"
            />
            <p className="text-[9.5px] sm:text-[10px] text-neutral-500 mt-1">
              Obtain your 15-16 digit ID in Meta Events Manager under "Data Sources".
            </p>
          </div>

          <div>
            <label className="uppercase font-semibold text-neutral-300 block mb-1 text-[11px] sm:text-xs">
              Test Event Code (Optional)
            </label>
            <input
              type="text"
              value={pixelForm.testEventCode || ''}
              onChange={(e) => setPixelForm({ ...pixelForm, testEventCode: e.target.value.trim().toUpperCase() })}
              placeholder="e.g. TEST12345"
              className="w-full bg-[#120E0C] border border-[#3E2D25] text-white p-2 sm:p-2.5 text-xs font-mono focus:outline-none focus:border-[#D4AF37]"
            />
            <p className="text-[9.5px] sm:text-[10px] text-neutral-500 mt-1">
              Used in Meta Events Manager "Test Events" tab to monitor real-time payloads.
            </p>
          </div>
        </div>

        <div>
          <label className="uppercase font-semibold text-neutral-300 block mb-1 text-[11px] sm:text-xs">
            Conversions API (CAPI) Access Token (Optional)
          </label>
          <input
            type="password"
            value={pixelForm.accessToken || ''}
            onChange={(e) => setPixelForm({ ...pixelForm, accessToken: e.target.value.trim() })}
            placeholder="EAAB..."
            className="w-full bg-[#120E0C] border border-[#3E2D25] text-white p-2 sm:p-2.5 text-xs font-mono focus:outline-none focus:border-[#D4AF37]"
          />
          <p className="text-[9.5px] sm:text-[10px] text-neutral-500 mt-1">
            Server-side redundant token for enhanced ad measurement compliance.
          </p>
        </div>

        {/* Standard Events Toggles */}
        <div className="border-t border-[#261E1A] pt-3 sm:pt-5 space-y-2 sm:space-y-3">
          <h4 className="font-serif text-xs sm:text-sm text-white font-medium">Standard Conversion Events</h4>
          <p className="text-[10.5px] sm:text-[11px] text-neutral-400">
            Select which customer interactions automatically fire Meta Pixel events for your ad campaigns:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 pt-1">
            <label className="flex items-center gap-2 p-2 sm:p-2.5 bg-[#120E0C] border border-[#261E1A] cursor-pointer hover:border-[#3E2D25]">
              <input
                type="checkbox"
                checked={pixelForm.trackPageView}
                onChange={(e) => setPixelForm({ ...pixelForm, trackPageView: e.target.checked })}
                className="accent-[#D4AF37]"
              />
              <div>
                <span className="font-mono font-semibold text-white block text-xs">PageView</span>
                <span className="text-[9.5px] sm:text-[10px] text-neutral-400">Store navigation and collection browses</span>
              </div>
            </label>

            <label className="flex items-center gap-2 p-2 sm:p-2.5 bg-[#120E0C] border border-[#261E1A] cursor-pointer hover:border-[#3E2D25]">
              <input
                type="checkbox"
                checked={pixelForm.trackViewContent}
                onChange={(e) => setPixelForm({ ...pixelForm, trackViewContent: e.target.checked })}
                className="accent-[#D4AF37]"
              />
              <div>
                <span className="font-mono font-semibold text-white block text-xs">ViewContent</span>
                <span className="text-[9.5px] sm:text-[10px] text-neutral-400">Jewelry product details opened</span>
              </div>
            </label>

            <label className="flex items-center gap-2 p-2 sm:p-2.5 bg-[#120E0C] border border-[#261E1A] cursor-pointer hover:border-[#3E2D25]">
              <input
                type="checkbox"
                checked={pixelForm.trackAddToCart}
                onChange={(e) => setPixelForm({ ...pixelForm, trackAddToCart: e.target.checked })}
                className="accent-[#D4AF37]"
              />
              <div>
                <span className="font-mono font-semibold text-white block text-xs">AddToCart</span>
                <span className="text-[9.5px] sm:text-[10px] text-neutral-400">Client adds piece to shopping bag</span>
              </div>
            </label>

            <label className="flex items-center gap-2 p-2 sm:p-2.5 bg-[#120E0C] border border-[#261E1A] cursor-pointer hover:border-[#3E2D25]">
              <input
                type="checkbox"
                checked={pixelForm.trackInitiateCheckout}
                onChange={(e) => setPixelForm({ ...pixelForm, trackInitiateCheckout: e.target.checked })}
                className="accent-[#D4AF37]"
              />
              <div>
                <span className="font-mono font-semibold text-white block text-xs">InitiateCheckout</span>
                <span className="text-[9.5px] sm:text-[10px] text-neutral-400">Customer navigates to checkout</span>
              </div>
            </label>

            <label className="flex items-center gap-2 p-2 sm:p-2.5 bg-[#120E0C] border border-[#261E1A] cursor-pointer hover:border-[#3E2D25]">
              <input
                type="checkbox"
                checked={pixelForm.trackPurchase}
                onChange={(e) => setPixelForm({ ...pixelForm, trackPurchase: e.target.checked })}
                className="accent-[#D4AF37]"
              />
              <div>
                <span className="font-mono font-semibold text-white block text-xs">Purchase</span>
                <span className="text-[9.5px] sm:text-[10px] text-neutral-400">Completed order with USD revenue</span>
              </div>
            </label>
          </div>
        </div>

        {/* Save button */}
        <div className="pt-3 sm:pt-4 border-t border-[#261E1A] flex justify-end">
          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2.5 sm:px-6 sm:py-2.5 bg-[#D4AF37] hover:bg-[#b59226] text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
          >
            <Check className="w-4 h-4" />
            <span>Save Facebook Pixel Settings</span>
          </button>
        </div>
      </form>

      {/* Live Event Simulator & Diagnostic Inspector */}
      <div className="bg-[#181210] border border-[#2D211B] p-3 sm:p-6 space-y-3 sm:space-y-4 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 border-b border-[#261E1A] pb-2 sm:pb-3">
          <div>
            <h3 className="font-serif text-xs sm:text-sm text-white font-medium flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#D4AF37]" />
              <span>Pixel Diagnostic &amp; Live Test Event Simulator</span>
            </h3>
            <p className="text-[10.5px] sm:text-[11px] text-neutral-400">
              Trigger real events below to verify that Meta Pixel Helper or Meta Events Manager catches them.
            </p>
          </div>

          <button
            type="button"
            onClick={clearLogs}
            className="self-start sm:self-auto text-[10.5px] sm:text-[11px] text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear Log</span>
          </button>
        </div>

        {/* Action triggers */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              handleTestEvent('PageView', {
                page: 'Shop Luxury Fine Jewelry',
                url: window.location.href,
              })
            }
            className="px-2.5 py-1.5 bg-[#201815] hover:bg-[#2C211D] border border-[#3E2D25] text-neutral-200 text-[10.5px] sm:text-[11px] font-mono flex items-center gap-1.5 cursor-pointer"
          >
            <Play className="w-3 h-3 text-[#D4AF37]" />
            <span>Fire PageView</span>
          </button>

          <button
            type="button"
            onClick={() =>
              handleTestEvent('ViewContent', {
                content_name: 'Elysian 2.5ct Diamond Solitaire Ring',
                content_ids: ['prod-diamond-solitaire'],
                content_type: 'product',
                value: 18500,
                currency: 'USD',
              })
            }
            className="px-2.5 py-1.5 bg-[#201815] hover:bg-[#2C211D] border border-[#3E2D25] text-neutral-200 text-[10.5px] sm:text-[11px] font-mono flex items-center gap-1.5 cursor-pointer"
          >
            <Play className="w-3 h-3 text-[#D4AF37]" />
            <span>Fire ViewContent ($18,500)</span>
          </button>

          <button
            type="button"
            onClick={() =>
              handleTestEvent('AddToCart', {
                content_name: 'Broadway 14k Solid Miami Cuban Link Chain',
                content_ids: ['prod-mens-cuban-chain'],
                content_type: 'product',
                value: 9800,
                currency: 'USD',
              })
            }
            className="px-2.5 py-1.5 bg-[#201815] hover:bg-[#2C211D] border border-[#3E2D25] text-neutral-200 text-[10.5px] sm:text-[11px] font-mono flex items-center gap-1.5 cursor-pointer"
          >
            <Play className="w-3 h-3 text-[#D4AF37]" />
            <span>Fire AddToCart ($9,800)</span>
          </button>

          <button
            type="button"
            onClick={() =>
              handleTestEvent('Purchase', {
                value: 24500,
                currency: 'USD',
                order_id: `LAC-TEST-${Date.now().toString().slice(-4)}`,
                num_items: 2,
                content_type: 'product',
              })
            }
            className="px-2.5 py-1.5 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-700 text-emerald-200 text-[10.5px] sm:text-[11px] font-mono flex items-center gap-1.5 cursor-pointer"
          >
            <Play className="w-3 h-3 text-emerald-400" />
            <span>Fire Purchase ($24,500)</span>
          </button>
        </div>

        {/* Event Log Output */}
        <div className="bg-[#120E0C] border border-[#261E1A] p-3 rounded-xs">
          <div className="text-[10px] text-neutral-500 uppercase tracking-wider mb-2 font-mono flex items-center justify-between">
            <span>Recent Event Stream ({eventLogs.length} events logged)</span>
            <span className="text-neutral-500 lowercase">real-time listener</span>
          </div>

          {eventLogs.length === 0 ? (
            <div className="py-6 text-center text-neutral-500 font-mono text-[11px]">
              No events fired in this session yet. Click any button above or browse the storefront.
            </div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto font-mono text-[11px]">
              {eventLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-2.5 bg-[#181412] border border-[#2B201A] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">✓ {log.eventName}</span>
                    <span className="text-neutral-500 text-[10px]">ID: {log.pixelId}</span>
                    {log.isSimulated && (
                      <span className="text-[9px] bg-amber-950/80 border border-amber-800 text-amber-300 px-1.5 py-0.2 rounded-xs">
                        AdBlocker Bypassed
                      </span>
                    )}
                  </div>
                  <div className="text-neutral-400 text-[10px] truncate max-w-md">
                    {JSON.stringify(log.params)}
                  </div>
                  <span className="text-neutral-500 text-[10px] shrink-0">{log.timestamp}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
