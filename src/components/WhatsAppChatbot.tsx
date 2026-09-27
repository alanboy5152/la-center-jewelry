import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Sparkles,
  RotateCcw,
  CheckCheck,
  ChevronDown,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  whatsappText?: string;
}

export const WhatsAppChatbot: React.FC = () => {
  const { siteSettings } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Clean WhatsApp phone number from site settings (whatsappNumber takes precedence, fallback to phone)
  const rawPhone = siteSettings?.whatsappNumber || siteSettings?.phone || '+1 213-612-0106';
  const cleanPhone = rawPhone.replace(/[^0-9]/g, '') || '12136120106';
  const greetingText = siteSettings?.whatsappGreeting?.trim() || 'Welcome! How can we assist you today? 💎';

  const defaultGreeting: ChatMessage[] = [
    {
      id: 'msg-1',
      sender: 'bot',
      text: greetingText,
      timestamp: 'Now',
    },
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(defaultGreeting);

  // Sync greeting if updated in admin settings
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === 'msg-1') {
        return [{ ...prev[0], text: greetingText }];
      }
      return prev;
    });
  }, [greetingText]);

  // If chatbot is disabled in settings, do not render
  if (siteSettings?.whatsappEnabled === false) {
    return null;
  }

  // Concise Quick Topic Titles (No long descriptions)
  const quickTopics = [
    {
      title: '💎 Custom Rings & Diamonds',
      whatsappText: 'Hello L.A Center Jewelry, I would like to inquire about custom rings & diamonds.',
    },
    {
      title: '📦 Order Tracking',
      whatsappText: 'Hello, I would like to check the status of my jewelry order.',
    },
    {
      title: '🏷️ Pricing & Appraisals',
      whatsappText: 'Hello, I would like to inquire about jewelry pricing and appraisals.',
    },
    {
      title: '📍 Atelier Hours & Visit',
      whatsappText: 'Hello, I would like to schedule a visit to your 720 S Broadway atelier.',
    },
  ];

  // Auto show subtle tooltip on first visit
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen && !hasOpenedOnce) {
        setShowTooltip(true);
      }
    }, 2800);
    return () => clearTimeout(timer);
  }, [isOpen, hasOpenedOnce]);

  // Scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  const handleOpenWidget = () => {
    setIsOpen(true);
    setHasOpenedOnce(true);
    setShowTooltip(false);
  };

  const openWhatsAppDirect = (text: string) => {
    const encoded = encodeURIComponent(text);
    const url = `https://wa.me/${cleanPhone}?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSendUserMessage = (userText: string) => {
    if (!userText.trim()) return;

    const newMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: userText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const botResponse: ChatMessage = {
        id: 'bot-' + Date.now(),
        sender: 'bot',
        text: 'Connect with our live specialist on WhatsApp:',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        whatsappText: userText.trim(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 500);
  };

  const handleTopicClick = (topic: typeof quickTopics[0]) => {
    const newMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: topic.title,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const botResponse: ChatMessage = {
        id: 'bot-' + Date.now(),
        sender: 'bot',
        text: 'Continue on WhatsApp for instant assistance:',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        whatsappText: topic.whatsappText,
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 400);
  };

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-5 sm:right-5 z-40 font-sans print:hidden select-none">
      {/* 1. Mobile-friendly Concise Tooltip */}
      {showTooltip && !isOpen && (
        <div
          onClick={handleOpenWidget}
          className="absolute bottom-15 right-0 mb-1 bg-[#1A1412] border border-[#D4AF37]/50 text-white px-3.5 py-2 shadow-xl rounded-full flex items-center gap-2 cursor-pointer hover:bg-[#251B17] transition-all animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span>
          <span className="text-xs font-semibold text-white whitespace-nowrap">
            Chat on WhatsApp
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="text-neutral-400 hover:text-white p-0.5 ml-1"
            aria-label="Close tooltip"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. Floating Circular WhatsApp Trigger Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={handleOpenWidget}
          className="relative flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-[#1EBE5D] to-[#25D366] text-white shadow-[0_4px_18px_rgba(37,211,102,0.45)] hover:shadow-[0_6px_22px_rgba(37,211,102,0.6)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border border-white/20"
          title="WhatsApp Chat"
          aria-label="Open WhatsApp Chat"
        >
          {!hasOpenedOnce && (
            <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-rose-500 text-white font-bold text-[9px] rounded-full flex items-center justify-center border border-[#121212] animate-bounce">
              1
            </span>
          )}

          <svg
            className="w-6.5 h-6.5 sm:w-7 sm:h-7 fill-current drop-shadow-xs"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
        </button>
      )}

      {/* 3. Mobile-Optimized Clean WhatsApp Chat Window */}
      {isOpen && (
        <div className="w-[calc(100vw-1.5rem)] sm:w-[350px] max-w-[380px] h-[430px] sm:h-[470px] max-h-[76vh] bg-[#140F0D] border border-[#3E2D24] shadow-2xl rounded-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200">
          {/* Header */}
          <div className="bg-[#1C1411] border-b border-[#30221B] px-3.5 py-3 flex items-center justify-between text-white">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                <div className="w-8.5 h-8.5 rounded-full bg-[#241A16] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] font-serif font-bold text-xs">
                  LA
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#25D366] border-2 border-[#1C1411]"></span>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-serif text-sm font-medium text-white truncate">
                    L.A Center Concierge
                  </h3>
                  <Sparkles className="w-3 h-3 text-[#D4AF37] shrink-0" />
                </div>
                <span className="text-[10px] text-emerald-400 font-mono block">
                  Online • WhatsApp
                </span>
              </div>
            </div>

            <div className="flex items-center gap-0.5 shrink-0">
              <button
                type="button"
                onClick={() => setMessages(defaultGreeting)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-md cursor-pointer transition-colors"
                title="Restart"
                aria-label="Restart"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-md cursor-pointer transition-colors"
                title="Close"
                aria-label="Close"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2.5 bg-[#100C0A] text-xs">
            {messages.map((m) => {
              const isBot = m.sender === 'bot';
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}
                >
                  <div
                    className={`max-w-[86%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                      isBot
                        ? 'bg-[#1E1613] border border-[#34241B] text-neutral-200 rounded-tl-xs'
                        : 'bg-[#005C4B] border border-[#0A7B66] text-white rounded-tr-xs'
                    }`}
                  >
                    <p className="text-[11.5px]">{m.text}</p>

                    {/* WhatsApp Action Button */}
                    {m.whatsappText && (
                      <div className="mt-2 pt-1.5 border-t border-white/10">
                        <button
                          type="button"
                          onClick={() => openWhatsAppDirect(m.whatsappText!)}
                          className="w-full py-1.5 px-3 bg-[#25D366] hover:bg-[#1EBE5D] text-black font-bold text-[11px] uppercase tracking-wider rounded-md flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-transform"
                        >
                          <svg className="w-3.5 h-3.5 fill-black shrink-0" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                          </svg>
                          <span>Open WhatsApp</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <span className="text-[9px] text-neutral-500 mt-0.5 flex items-center gap-1 px-1">
                    {m.timestamp}
                    {!isBot && <CheckCheck className="w-3 h-3 text-sky-400" />}
                  </span>
                </div>
              );
            })}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-center gap-1 p-1.5 bg-[#1E1613] border border-[#34241B] w-14 rounded-lg text-neutral-400">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-bounce"></span>
                <span
                  className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-bounce"
                  style={{ animationDelay: '0.15s' }}
                ></span>
                <span
                  className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-bounce"
                  style={{ animationDelay: '0.3s' }}
                ></span>
              </div>
            )}

            {/* Quick Topic Chips (Concise titles only, no long paragraphs) */}
            {messages.length <= 2 && !isTyping && (
              <div className="pt-1.5 space-y-1.5">
                <div className="flex flex-col gap-1.5">
                  {quickTopics.map((q, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleTopicClick(q)}
                      className="text-left py-2 px-2.5 bg-[#18120F] hover:bg-[#241A15] border border-[#30221B] hover:border-[#D4AF37]/50 text-neutral-200 hover:text-white rounded-lg text-[11px] transition-colors cursor-pointer flex items-center justify-between"
                    >
                      <span className="font-medium">{q.title}</span>
                      <span className="text-[#D4AF37] text-xs font-semibold ml-1">→</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input */}
          <div className="p-2.5 bg-[#16100E] border-t border-[#2C1F18]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendUserMessage(inputText);
              }}
              className="flex items-center gap-1.5"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type message..."
                className="flex-1 bg-[#0E0A08] border border-[#30221B] focus:border-[#25D366] text-white text-xs px-3 py-2 rounded-lg focus:outline-none placeholder-neutral-500"
              />

              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2 bg-[#25D366] hover:bg-[#1EBE5D] disabled:opacity-35 text-black font-bold rounded-lg flex items-center justify-center cursor-pointer transition-colors shrink-0 shadow-xs"
                title="Send"
                aria-label="Send"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
