import React, { useState } from 'react';
import { Lock, Mail, Key, Eye, EyeOff, ArrowRight, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AdminLoginPage: React.FC = () => {
  const { loginAdmin, navigateTo, showToast, siteSettings } = useApp();

  // Always empty by default for security
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameOrEmail.trim() || !password.trim()) {
      setErrorMsg('Please enter your username and passcode.');
      return;
    }
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const success = loginAdmin(usernameOrEmail.trim(), password.trim());
      if (success) {
        showToast('Authenticated as Salon Administrator.', 'success');
        navigateTo('admin-dashboard');
      } else {
        setErrorMsg('Invalid administrative credentials. Please try again.');
      }
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center py-10 px-4 sm:px-6 w-full">
      <div className="max-w-md w-full bg-[#1A1A1A] border border-[#2D2D2D] p-8 sm:p-10 shadow-2xl relative">
        {/* Top Gold Accent Bar */}
        <div className="absolute top-0 inset-x-0 h-1 bg-[#D4AF37]" />

        {/* Close Button to return to store */}
        <button
          type="button"
          onClick={() => navigateTo('home')}
          className="absolute right-4 top-4 text-neutral-500 hover:text-white p-1 rounded-xs cursor-pointer transition-colors"
          title="Return to Storefront"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2 mb-8">
          {siteSettings?.logoUrl ? (
            <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <img
                src={siteSettings.logoUrl}
                alt="L.A Center Jewelry Official Monogram"
                className="w-full h-full object-contain filter drop-shadow-[0_2px_10px_rgba(212,175,55,0.4)]"
                referrerPolicy="no-referrer"
              />
            </div>
          ) : (
            <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-[#201815] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
              <Lock className="w-6 h-6" />
            </div>
          )}
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-[#D4AF37] block">
            L.A Center Jewelry Inc
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-normal text-white">
            Salon Executive Portal
          </h1>
          <p className="text-xs text-neutral-400 font-light">
            Secure administrative control for inventory, media, orders &amp; storefront.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs mb-6 rounded-none">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-xs uppercase tracking-wider font-semibold text-neutral-300 block mb-1.5">
              Admin Username / Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="text"
                required
                autoComplete="username"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                placeholder="Enter admin username or email"
                className="w-full bg-[#121212] border border-[#333] text-white p-3 pl-10 text-xs focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider font-semibold text-neutral-300 block mb-1.5">
              Passcode
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter passcode"
                className="w-full bg-[#121212] border border-[#333] text-white p-3 pl-10 pr-10 text-xs font-mono focus:outline-none focus:border-[#D4AF37]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-neutral-500 hover:text-white cursor-pointer"
                title={showPassword ? 'Hide passcode' : 'Show passcode'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-[#D4AF37] hover:bg-[#b59226] text-black text-xs font-bold uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50 mt-2"
          >
            <span>{isLoading ? 'Verifying...' : 'Access Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
