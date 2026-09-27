import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Key,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Copy,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { copyTextToClipboard } from '../../utils/clipboard';

export const AdminSecurityTab: React.FC = () => {
  const { adminCredentials, updateAdminCredentials, showToast, loginAdmin, navigateTo } = useApp();

  const [username, setUsername] = useState(adminCredentials?.username || 'admin@lacenterjewelry.com');
  const [displayName, setDisplayName] = useState(adminCredentials?.name || 'Salon Managing Director');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showActivePass, setShowActivePass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Diagnostic Test Login state
  const [testUser, setTestUser] = useState('');
  const [testPass, setTestPass] = useState('');
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Keep state in sync with context
  useEffect(() => {
    if (adminCredentials) {
      setUsername(adminCredentials.username || 'admin@lacenterjewelry.com');
      setDisplayName(adminCredentials.name || 'Salon Managing Director');
    }
  }, [adminCredentials]);

  const calculateStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 6) score += 25;
    if (pass.length >= 10) score += 25;
    if (/[A-Z]/.test(pass)) score += 20;
    if (/[0-9]/.test(pass)) score += 15;
    if (/[^A-Za-z0-9]/.test(pass)) score += 15;
    return Math.min(score, 100);
  };

  const strength = calculateStrength(newPassword);

  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$';
    let result = '';
    for (let i = 0; i < 10; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(result);
    setConfirmPassword(result);
    setShowNewPass(true);
    showToast('Generated strong passcode.', 'info');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!username.trim()) {
      setErrorMsg('Username or email cannot be empty.');
      return;
    }

    if (newPassword.trim()) {
      if (newPassword.trim().length < 4) {
        setErrorMsg('New passcode must contain at least 4 characters.');
        return;
      }

      if (confirmPassword.trim() && newPassword.trim() !== confirmPassword.trim()) {
        setErrorMsg('New passcode and confirmation passcode do not match.');
        return;
      }
    }

    setIsSaving(true);
    try {
      const finalPassword = newPassword.trim()
        ? newPassword.trim()
        : adminCredentials?.password || 'admin123';

      const success = await updateAdminCredentials({
        username: username.trim(),
        name: displayName.trim(),
        password: finalPassword,
      });

      if (success) {
        setNewPassword('');
        setConfirmPassword('');
        setSuccessMsg(
          `Credentials saved! Active login username: "${username.trim()}", passcode: "${finalPassword}". These credentials are now permanently active in local storage & Firestore.`
        );
        showToast('Admin credentials updated and verified.', 'success');
      } else {
        setErrorMsg('Could not update credentials. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update credentials.');
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    const ok = await copyTextToClipboard(text);
    if (ok) {
      showToast(`Copied ${label} to clipboard`, 'info');
    } else {
      showToast(`Could not copy ${label}`, 'error');
    }
  };

  const handleRunTestLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testUser.trim() || !testPass.trim()) {
      setTestResult({
        success: false,
        message: 'Please provide both username and passcode to test.',
      });
      return;
    }

    const ok = loginAdmin(testUser.trim(), testPass.trim());
    if (ok) {
      setTestResult({
        success: true,
        message: `Success! Authenticated successfully as "${testUser.trim()}". Credentials are valid and working.`,
      });
    } else {
      setTestResult({
        success: false,
        message: 'Authentication failed. Username or passcode does not match configured credentials.',
      });
    }
  };

  return (
    <div className="space-y-3 sm:space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="font-serif text-lg sm:text-2xl font-normal text-white flex items-center gap-2">
          <span>Admin Credentials &amp; Security</span>
          <span className="text-[9.5px] sm:text-[10px] bg-[#D4AF37]/20 text-[#D4AF37] px-1.5 py-0.5 uppercase tracking-wider font-mono font-bold">
            Live
          </span>
        </h2>
        <p className="text-[11px] sm:text-xs text-neutral-400 mt-0.5">
          Manage your administrative login username and password. Changes persist in local storage and synchronize to the cloud database.
        </p>
      </div>

      {/* Current Active Credentials Card */}
      <div className="p-3 sm:p-5 bg-gradient-to-r from-[#201815] to-[#181210] border border-[#D4AF37]/30 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
        <div className="space-y-1.5 sm:space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            <span>Currently Active Credentials:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono">
            <div className="flex items-center gap-1.5 bg-[#120E0C] px-2.5 py-1 sm:px-3 sm:py-1.5 border border-[#3E2D25]">
              <span className="text-neutral-400 text-[10.5px] sm:text-[11px]">User:</span>
              <span className="text-white font-bold">{adminCredentials?.username || 'admin@lacenterjewelry.com'}</span>
              <button
                type="button"
                onClick={() => copyToClipboard(adminCredentials?.username || 'admin@lacenterjewelry.com', 'Username')}
                className="text-neutral-500 hover:text-white ml-1 cursor-pointer"
                title="Copy Username"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-1.5 bg-[#120E0C] px-2.5 py-1 sm:px-3 sm:py-1.5 border border-[#3E2D25]">
              <span className="text-neutral-400 text-[10.5px] sm:text-[11px]">Pass:</span>
              <span className="text-[#D4AF37] font-bold">
                {showActivePass ? adminCredentials?.password || 'admin123' : '••••••••'}
              </span>
              <button
                type="button"
                onClick={() => setShowActivePass(!showActivePass)}
                className="text-neutral-500 hover:text-white ml-1 cursor-pointer"
                title={showActivePass ? 'Hide Passcode' : 'Show Passcode'}
              >
                {showActivePass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => copyToClipboard(adminCredentials?.password || 'admin123', 'Passcode')}
                className="text-neutral-500 hover:text-white ml-1 cursor-pointer"
                title="Copy Passcode"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        <span className="text-[10px] sm:text-[11px] px-2 py-0.5 sm:px-2.5 sm:py-1 bg-emerald-950/60 border border-emerald-800 text-emerald-300 font-mono flex items-center gap-1.5 shrink-0 self-start sm:self-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Active &amp; Persistent
        </span>
      </div>

      {errorMsg && (
        <div className="p-2.5 sm:p-3.5 bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-2.5 sm:p-3.5 bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Edit Form */}
      <form onSubmit={handleSubmit} className="bg-[#181210] border border-[#2D211B] p-3 sm:p-6 md:p-8 space-y-3.5 sm:space-y-6 text-xs">
        <div className="border-b border-[#261E1A] pb-2 mb-2 sm:pb-3 sm:mb-4">
          <h3 className="font-serif text-xs sm:text-sm text-white font-medium flex items-center gap-2">
            <User className="w-4 h-4 text-[#D4AF37]" />
            <span>Update Username &amp; Display Profile</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
          <div>
            <label className="uppercase font-semibold text-neutral-300 block mb-1 text-[11px] sm:text-xs">
              New Login Username or Email *
            </label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-2.5 sm:top-3 pointer-events-none" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. admin@lacenterjewelry.com or myusername"
                className="w-full bg-[#120E0C] border border-[#3E2D25] text-white p-2 sm:p-2.5 pl-9 sm:pl-10 text-xs focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <p className="text-[9.5px] sm:text-[10px] text-neutral-500 mt-1">
              Used to sign in to the Salon Executive Portal.
            </p>
          </div>

          <div>
            <label className="uppercase font-semibold text-neutral-300 block mb-1 text-[11px] sm:text-xs">
              Admin Name / Title
            </label>
            <div className="relative">
              <User className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-2.5 sm:top-3 pointer-events-none" />
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Salon Managing Director"
                className="w-full bg-[#120E0C] border border-[#3E2D25] text-white p-2 sm:p-2.5 pl-9 sm:pl-10 text-xs focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <p className="text-[9.5px] sm:text-[10px] text-neutral-500 mt-1">
              Displayed in header and administrative logs.
            </p>
          </div>
        </div>

        <div className="border-b border-[#261E1A] pb-2 pt-2 mb-2 sm:pb-3 sm:pt-4 sm:mb-4 flex items-center justify-between">
          <h3 className="font-serif text-xs sm:text-sm text-white font-medium flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#D4AF37]" />
            <span>Change Passcode</span>
          </h3>

          <button
            type="button"
            onClick={handleGeneratePassword}
            className="text-[10.5px] sm:text-[11px] text-[#D4AF37] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Passcode</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
          <div>
            <label className="uppercase font-semibold text-neutral-300 block mb-1 text-[11px] sm:text-xs">
              New Passcode (Leave empty to keep existing)
            </label>
            <div className="relative">
              <Key className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-2.5 sm:top-3 pointer-events-none" />
              <input
                type={showNewPass ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new passcode..."
                className="w-full bg-[#120E0C] border border-[#3E2D25] text-white p-2 sm:p-2.5 pl-9 sm:pl-10 pr-9 text-xs font-mono focus:outline-none focus:border-[#D4AF37]"
              />
              <button
                type="button"
                onClick={() => setShowNewPass(!showNewPass)}
                className="absolute right-3 top-2.5 sm:top-3 text-neutral-500 hover:text-white cursor-pointer"
              >
                {showNewPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>

            {newPassword && (
              <div className="mt-1.5 space-y-1">
                <div className="h-1.5 w-full bg-[#201815] overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      strength < 40
                        ? 'bg-rose-500 w-1/3'
                        : strength < 70
                        ? 'bg-amber-500 w-2/3'
                        : 'bg-emerald-500 w-full'
                    }`}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                  <span>Passcode strength</span>
                  <span className={strength >= 70 ? 'text-emerald-400' : 'text-neutral-400'}>
                    {strength < 40 ? 'Fair' : strength < 70 ? 'Moderate' : 'Excellent'}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="uppercase font-semibold text-neutral-300 block mb-1 text-[11px] sm:text-xs">
              Confirm New Passcode
            </label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-2.5 sm:top-3 pointer-events-none" />
              <input
                type={showNewPass ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new passcode..."
                className="w-full bg-[#120E0C] border border-[#3E2D25] text-white p-2 sm:p-2.5 pl-9 sm:pl-10 text-xs font-mono focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <p className="text-[9.5px] sm:text-[10px] text-neutral-500 mt-1">
              Must match new passcode above.
            </p>
          </div>
        </div>

        <div className="pt-3 sm:pt-4 border-t border-[#261E1A] flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <p className="text-[10.5px] sm:text-[11px] text-neutral-400">
            Emergency bypass passcode (<code className="text-[#D4AF37]">admin123</code> or <code className="text-[#D4AF37]">lacenter</code>) remains available.
          </p>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto px-5 py-2.5 sm:px-6 sm:py-2.5 bg-[#D4AF37] hover:bg-[#b59226] text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-50 shrink-0 shadow-sm"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Save Credentials</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Interactive Verification Box */}
      <div className="bg-[#181210] border border-[#2D211B] p-3 sm:p-6 space-y-3 sm:space-y-4 text-xs">
        <div className="border-b border-[#261E1A] pb-2 sm:pb-3">
          <h3 className="font-serif text-xs sm:text-sm text-white font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
            <span>Live Login Verification Tester</span>
          </h3>
          <p className="text-[10.5px] sm:text-[11px] text-neutral-400">
            Verify right here that your newly updated credentials authenticate properly.
          </p>
        </div>

        <form onSubmit={handleRunTestLogin} className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
            <div>
              <label className="text-[10px] uppercase font-semibold text-neutral-400 block mb-1">
                Test Username / Email
              </label>
              <input
                type="text"
                value={testUser}
                onChange={(e) => setTestUser(e.target.value)}
                placeholder="Enter username to test"
                className="w-full bg-[#120E0C] border border-[#3E2D25] text-white p-2 sm:p-2.5 text-xs focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-semibold text-neutral-400 block mb-1">
                Test Passcode
              </label>
              <input
                type="password"
                value={testPass}
                onChange={(e) => setTestPass(e.target.value)}
                placeholder="Enter passcode to test"
                className="w-full bg-[#120E0C] border border-[#3E2D25] text-white p-2 sm:p-2.5 text-xs font-mono focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={() => {
                setTestUser(adminCredentials?.username || 'admin@lacenterjewelry.com');
                setTestPass(adminCredentials?.password || 'admin123');
              }}
              className="text-[10.5px] sm:text-[11px] text-[#D4AF37] hover:underline cursor-pointer"
            >
              Fill Current Saved Credentials
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 bg-[#261E1A] hover:bg-[#3E2D25] text-neutral-200 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Verify Authentication</span>
            </button>
          </div>

          {testResult && (
            <div
              className={`p-2.5 sm:p-3.5 border text-xs flex items-center gap-2 ${
                testResult.success
                  ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                  : 'bg-rose-950/60 border-rose-800 text-rose-300'
              }`}
            >
              {testResult.success ? (
                <Check className="w-4 h-4 shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
