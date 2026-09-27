import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  Mail,
  Lock,
  Phone,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  Gem,
  Eye,
  EyeOff,
} from 'lucide-react';

export const CustomerAuthPage: React.FC = () => {
  const { signUpUser, loginUser, currentUser, navigateTo } = useApp();

  // Mode: 'signup' or 'signin'
  const [authMode, setAuthMode] = useState<'signup' | 'signin'>('signup');

  // Sign up Form state - Clean & Simple: First Name, Last Name, Phone, Email, Password
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Sign In Form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // If already logged in, redirect to profile
  if (currentUser) {
    return (
      <div className="py-20 px-4 sm:px-6 max-w-2xl mx-auto text-center">
        <div className="w-16 h-16 rounded-full bg-[#1F1915] border border-[#D4AF37] flex items-center justify-center mx-auto mb-4 text-[#D4AF37]">
          <User className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-3xl font-normal text-neutral-900 mb-2">
          Welcome to the Atelier, {currentUser.name}
        </h2>
        <p className="text-neutral-600 text-sm mb-6 max-w-md mx-auto">
          You are signed in to your exclusive patron profile ({currentUser.email}).
        </p>
        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={() => navigateTo('customer-account')}
            className="px-6 py-3 bg-[#D4AF37] text-black font-semibold text-xs uppercase tracking-wider hover:bg-[#b8952b] transition-all cursor-pointer"
          >
            View My Profile &amp; Atelier Vault
          </button>
          <button
            type="button"
            onClick={() => navigateTo('shop')}
            className="px-6 py-3 border border-neutral-300 text-neutral-800 text-xs uppercase tracking-wider hover:bg-neutral-100 transition-all cursor-pointer"
          >
            Browse Jewelry
          </button>
        </div>
      </div>
    );
  }

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !email.trim() || !password.trim()) {
      return;
    }

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();

    const success = signUpUser({
      name: fullName,
      email: email.trim(),
      phone: phone.trim() || undefined,
      password: password || undefined,
      preferredMetal: '18k Yellow Gold',
      ringSize: '7.0',
      newsletterSubscribed: true,
    });

    if (success) {
      navigateTo('customer-account');
    }
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) return;

    const success = loginUser(loginEmail.trim(), loginPassword);
    if (success) {
      navigateTo('customer-account');
    }
  };

  return (
    <div className="py-12 sm:py-16 bg-[#FAF9F5] text-neutral-900 min-h-[80vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb & Navigation */}
        <div className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-6 flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="hover:text-black cursor-pointer"
          >
            Home
          </button>
          <span>/</span>
          <span className="text-neutral-900 font-medium">Patron Account</span>
        </div>

        {/* Header Title */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F3ECE2] border border-[#E0D3BE] text-[#997C24] text-[11px] uppercase tracking-widest font-semibold mb-3">
            <Sparkles className="w-3 h-3" />
            <span>Broadway Atelier Client Salon</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-neutral-900 tracking-tight">
            {authMode === 'signup' ? 'Create Your Patron Profile' : 'Sign In to Your Account'}
          </h1>
          <p className="text-sm text-neutral-600 mt-2 font-light">
            {authMode === 'signup'
              ? 'Join our private salon to enjoy personalized jewelry recommendations, saved ring sizes, private viewing invitations, and priority atelier services.'
              : 'Access your saved sizing preferences, custom orders, and fine jewelry wishlist.'}
          </p>

          {/* Toggle Tabs */}
          <div className="mt-6 inline-flex bg-neutral-200/70 p-1 border border-neutral-300">
            <button
              type="button"
              id="tab-btn-signup"
              onClick={() => setAuthMode('signup')}
              className={`px-6 py-2 text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                authMode === 'signup'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-black'
              }`}
            >
              Sign Up / New Profile
            </button>
            <button
              type="button"
              id="tab-btn-signin"
              onClick={() => setAuthMode('signin')}
              className={`px-6 py-2 text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                authMode === 'signin'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-black'
              }`}
            >
              Existing Client Sign In
            </button>
          </div>
        </div>

        {/* Main Form Container */}
        <div className="bg-white border border-neutral-200 shadow-sm p-6 sm:p-10 max-w-2xl mx-auto">
          {authMode === 'signup' ? (
            /* SIGN UP / CREATE PROFILE FORM */
            <form onSubmit={handleSignUp} className="space-y-6">
              <div className="pb-3 border-b border-neutral-100 flex items-center justify-between">
                <h3 className="font-serif text-lg font-medium text-neutral-900 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#D4AF37]" />
                  <span>Personal Information</span>
                </h3>
                <span className="text-[11px] text-neutral-400 font-light">
                  * Required fields
                </span>
              </div>

              {/* First Name & Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-semibold text-neutral-700 tracking-wider mb-1.5">
                    First Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      id="signup-first-name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="e.g. Victoria"
                      className="w-full bg-neutral-50 border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 focus:bg-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                    />
                    <User className="w-4 h-4 text-neutral-400 absolute right-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-semibold text-neutral-700 tracking-wider mb-1.5">
                    Last Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="signup-last-name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="e.g. Sterling"
                      className="w-full bg-neutral-50 border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 focus:bg-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                    />
                    <User className="w-4 h-4 text-neutral-400 absolute right-3 top-3" />
                  </div>
                </div>
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-semibold text-neutral-700 tracking-wider mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      id="signup-phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (213) 555-0199"
                      className="w-full bg-neutral-50 border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 focus:bg-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                    />
                    <Phone className="w-4 h-4 text-neutral-400 absolute right-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-semibold text-neutral-700 tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      id="signup-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. victoria@example.com"
                      className="w-full bg-neutral-50 border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 focus:bg-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                    />
                    <Mail className="w-4 h-4 text-neutral-400 absolute right-3 top-3" />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs uppercase font-semibold text-neutral-700 tracking-wider mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    id="signup-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a secure password"
                    className="w-full bg-neutral-50 border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 focus:bg-white focus:border-[#D4AF37] focus:outline-none transition-colors pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-neutral-400 hover:text-neutral-600 absolute right-3 top-2.5 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                id="submit-signup-btn"
                className="w-full py-3.5 bg-[#18120E] hover:bg-[#2A201B] text-[#E5D7B7] text-xs uppercase font-bold tracking-[0.2em] flex items-center justify-center gap-2 border border-[#3E2D25] hover:border-[#D4AF37] shadow-md transition-all cursor-pointer"
              >
                <span>Create Account &amp; Enter Atelier</span>
                <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
              </button>

              <div className="text-center pt-2">
                <p className="text-xs text-neutral-500">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('signin')}
                    className="text-[#997C24] font-semibold underline cursor-pointer hover:text-black"
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            </form>
          ) : (
            /* SIGN IN FORM */
            <form onSubmit={handleSignIn} className="space-y-6">
              <div className="pb-3 border-b border-neutral-100">
                <h3 className="font-serif text-lg font-medium text-neutral-900 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#D4AF37]" />
                  <span>Patron Credentials</span>
                </h3>
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold text-neutral-700 tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    id="signin-email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    className="w-full bg-neutral-50 border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 focus:bg-white focus:border-[#D4AF37] focus:outline-none"
                  />
                  <Mail className="w-4 h-4 text-neutral-400 absolute right-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold text-neutral-700 tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    id="signin-password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-neutral-50 border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 focus:bg-white focus:border-[#D4AF37] focus:outline-none pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="text-neutral-400 hover:text-neutral-600 absolute right-3 top-2.5 cursor-pointer"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                id="submit-signin-btn"
                className="w-full py-3.5 bg-[#D4AF37] hover:bg-[#b8952b] text-black text-xs uppercase font-bold tracking-[0.2em] flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <span>Sign In to Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Fast Demo Account Helper */}
              <div className="p-3.5 bg-neutral-50 border border-neutral-200 text-xs text-neutral-600 rounded-xs">
                <span className="font-semibold text-neutral-800 block mb-1">
                  Demo Fast Sign-In:
                </span>
                <p className="text-[11px] text-neutral-500 mb-2">
                  You can sign up for a brand new profile, or click below to autofill our demo patron account:
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setLoginEmail('m.sterling@example.com');
                    setLoginPassword('demo123');
                  }}
                  className="px-3 py-1 bg-white border border-neutral-300 hover:border-[#D4AF37] text-neutral-800 text-[11px] font-medium transition-colors cursor-pointer"
                >
                  Autofill: m.sterling@example.com (Password: demo123)
                </button>
              </div>

              <div className="text-center pt-2">
                <p className="text-xs text-neutral-500">
                  New client?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('signup')}
                    className="text-[#997C24] font-semibold underline cursor-pointer hover:text-black"
                  >
                    Create a new profile
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>

        {/* Security & Confidentiality Badge */}
        <div className="mt-8 max-w-md mx-auto text-center flex items-center justify-center gap-2 text-xs text-neutral-500">
          <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
          <span>Encrypted atelier connection &amp; strict client confidentiality.</span>
        </div>
      </div>
    </div>
  );
};
