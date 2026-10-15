import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  KeyRound, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Fingerprint, 
  Building2,
  ArrowRight,
  Download,
  Smartphone
} from 'lucide-react';
import { useCRM } from '../context/CRMContext';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { PWAInstallModal } from './PWAInstallModal';

export const LoginScreen: React.FC = () => {
  const { login } = useCRM();
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  
  const [email, setEmail] = useState('okiti@twchealth.ng');
  const [password, setPassword] = useState('TWC@Admin2025');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = login(email, password);
      setIsLoading(false);
      if (!res.success) {
        setError(res.message || 'Invalid login details. Please check your email and password.');
      }
    }, 350);
  };

  const handleAutofill = () => {
    setEmail('okiti@twchealth.ng');
    setPassword('TWC@Admin2025');
    setError(null);
  };

  const handleBiometricLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      login('okiti@twchealth.ng', 'TWC@Admin2025');
      setIsLoading(false);
    }, 400);
  };

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (!success) {
        setIsInstallModalOpen(true);
      }
    } else {
      setIsInstallModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-[#045D6E] to-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Background Decorative Blur Orbs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-sky-500/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Card Container */}
        <div className="bg-white/95 ios-blur rounded-[28px] border border-white/40 shadow-2xl p-6 sm:p-8 backdrop-blur-xl">
          
          {/* Header Brand */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-[#045D6E] text-white flex flex-col items-center justify-center p-2 shadow-lg shadow-[#045D6E]/30 mb-3 border border-[#034a58] relative">
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full ring-2 ring-white"></div>
              <span className="text-sm font-black tracking-tight leading-none">TWC</span>
              <span className="text-[9px] font-extrabold tracking-widest text-teal-100">HEALTH</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-[#045D6E] text-xs font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>NDPA & HIPAA Compliant Healthcare Portal</span>
            </div>

            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              TWC CareCRM PWA
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Hospital Clinical Sales, Retainers & Patient Care Management
            </p>

            {/* Install PWA Prompt Header Banner */}
            {!isInstalled && (
              <button
                type="button"
                onClick={handleInstallClick}
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-300/80 text-emerald-800 text-xs font-bold transition-all shadow-xs cursor-pointer"
                title="Install TWC CareCRM as a native app on this device"
              >
                <Download className="w-3.5 h-3.5 text-emerald-700 animate-pulse" />
                <span>Install Native App</span>
                <span className="text-[10px] bg-emerald-700 text-white px-1.5 py-0.2 rounded-full font-semibold">
                  Offline Ready
                </span>
              </button>
            )}
          </div>

          {/* Quick Demo Credentials Pill */}
          <div className="mb-5 p-3 rounded-2xl bg-slate-50 border border-slate-200/90 text-xs flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Admin Login Credentials</div>
              <div className="font-mono font-semibold text-slate-800 text-[11px] truncate">
                okiti@twchealth.ng
              </div>
            </div>
            <button
              type="button"
              onClick={handleAutofill}
              className="px-2.5 py-1 rounded-xl bg-teal-100 hover:bg-teal-200 text-[#045D6E] text-[11px] font-bold shrink-0 transition-colors"
            >
              Autofill
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="font-medium">{error}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>Hospital Staff Email</span>
                <span className="text-[10px] text-slate-400 font-normal">Executive / Admin</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="okiti@twchealth.ng"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#045D6E] focus:border-transparent transition-all shadow-2xs"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>Security Password</span>
                <span className="text-[10px] text-teal-700 font-semibold cursor-pointer" onClick={handleAutofill}>
                  Use TWC@Admin2025
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-11 py-3 rounded-2xl border border-slate-200 bg-white text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#045D6E] focus:border-transparent transition-all shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded-md text-[#045D6E] focus:ring-[#045D6E] border-slate-300"
                />
                <span className="font-medium">Stay signed in on this device</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 px-4 rounded-2xl bg-[#045D6E] hover:bg-[#034a58] active:scale-[0.99] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#045D6E]/25 transition-all cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <span>Authenticating Dr. Okiti...</span>
              ) : (
                <>
                  <span>Sign In to CareCRM</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Biometrics Alternative */}
            <button
              type="button"
              onClick={handleBiometricLogin}
              className="w-full py-2.5 px-4 rounded-2xl border border-slate-200/90 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Fingerprint className="w-4 h-4 text-[#045D6E]" />
              <span>Sign in with Biometrics / Touch ID</span>
            </button>
          </form>

          {/* Footer Legal & Security */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              NDPA 2023 Regulated
            </span>
            <button
              type="button"
              onClick={() => setIsInstallModalOpen(true)}
              className="text-[#045D6E] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Smartphone className="w-3 h-3" />
              <span>{isInstalled ? 'Installed PWA' : 'Install PWA'}</span>
            </button>
          </div>
        </div>

        {/* Bottom Hospital Support Info */}
        <p className="text-center text-xs text-teal-100/70 mt-4">
          Need access assistance? Contact Hospital ICT Support at <span className="underline">support@twchealth.ng</span>
        </p>
      </div>

      {/* PWA Install Guide Modal */}
      <PWAInstallModal 
        isOpen={isInstallModalOpen} 
        onClose={() => setIsInstallModalOpen(false)} 
      />
    </div>
  );
};
