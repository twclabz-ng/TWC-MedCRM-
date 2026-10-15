import React from 'react';
import { 
  Download, 
  X, 
  Smartphone, 
  Laptop, 
  CheckCircle2, 
  Share, 
  MoreVertical, 
  PlusSquare,
  ShieldCheck,
  Zap,
  WifiOff
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md rounded-3xl bg-white shadow-2xl border border-slate-200/80 overflow-hidden text-slate-900"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#045D6E] to-[#034a58] p-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white p-1.5 shadow-md flex items-center justify-center shrink-0">
              <img src="./pwa-192x192.png" alt="TWC CareCRM" className="w-full h-full object-contain rounded-xl" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                  PWA Ready
                </span>
                <span className="text-[10px] text-teal-200">v3.2</span>
              </div>
              <h2 className="text-lg font-bold tracking-tight text-white mt-0.5">Install TWC CareCRM</h2>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Feature Highlights */}
          <div className="grid grid-cols-3 gap-2 py-1">
            <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <Zap className="w-4 h-4 text-amber-500 mx-auto mb-1" />
              <div className="text-[11px] font-bold text-slate-800">Fast Launch</div>
              <div className="text-[9px] text-slate-500">Zero App Store wait</div>
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <WifiOff className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
              <div className="text-[11px] font-bold text-slate-800">Works Offline</div>
              <div className="text-[9px] text-slate-500">Cached patient records</div>
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <ShieldCheck className="w-4 h-4 text-teal-600 mx-auto mb-1" />
              <div className="text-[11px] font-bold text-slate-800">NDPA Secure</div>
              <div className="text-[9px] text-slate-500">Hospital grade</div>
            </div>
          </div>

          {/* Already Installed Status */}
          {isInstalled && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="text-xs">
                <strong>App is already installed!</strong> You can launch it directly from your Home Screen or Applications folder.
              </div>
            </div>
          )}

          {/* Direct Install CTA (if browser triggered beforeinstallprompt) */}
          {!isInstalled && isInstallable && (
            <div className="space-y-2">
              <button
                onClick={handleInstallClick}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#045D6E] hover:bg-[#034a58] active:scale-[0.99] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#045D6E]/25 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Install Native App Now</span>
              </button>
              <p className="text-[11px] text-center text-slate-400">
                Clicking will open the Chrome / device installation confirmation dialog.
              </p>
            </div>
          )}

          {/* Guided Instructions for Chrome Desktop & Android & iOS */}
          {!isInstalled && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                {isIOS ? (
                  <>
                    <Smartphone className="w-4 h-4 text-[#045D6E]" />
                    <span>How to Install on iPhone / iPad (Safari)</span>
                  </>
                ) : isAndroid ? (
                  <>
                    <Smartphone className="w-4 h-4 text-[#045D6E]" />
                    <span>How to Install on Android (Chrome)</span>
                  </>
                ) : (
                  <>
                    <Laptop className="w-4 h-4 text-[#045D6E]" />
                    <span>How to Install on Chrome (Desktop / Laptop)</span>
                  </>
                )}
              </div>

              {isIOS ? (
                <ol className="text-xs text-slate-600 space-y-2.5">
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#045D6E]/10 text-[#045D6E] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                    <span>Tap the <strong className="text-slate-900 inline-flex items-center gap-1"><Share className="w-3.5 h-3.5" /> Share</strong> icon in the bottom Safari toolbar.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#045D6E]/10 text-[#045D6E] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                    <span>Scroll down the menu and tap <strong className="text-slate-900 inline-flex items-center gap-1"><PlusSquare className="w-3.5 h-3.5" /> Add to Home Screen</strong>.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#045D6E]/10 text-[#045D6E] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                    <span>Tap <strong className="text-[#045D6E]">Add</strong> in the top-right corner. The TWC CareCRM icon will appear on your Home Screen!</span>
                  </li>
                </ol>
              ) : isAndroid ? (
                <ol className="text-xs text-slate-600 space-y-2.5">
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#045D6E]/10 text-[#045D6E] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                    <span>Tap the <strong className="text-slate-900 inline-flex items-center gap-1"><MoreVertical className="w-3.5 h-3.5" /> Menu</strong> (three vertical dots) in the top-right corner of Chrome.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#045D6E]/10 text-[#045D6E] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                    <span>Tap <strong className="text-slate-900">Install app</strong> or <strong className="text-slate-900">Add to Home screen</strong>.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#045D6E]/10 text-[#045D6E] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                    <span>Confirm by tapping <strong className="text-[#045D6E]">Install</strong>. The app installs like a native Android APK!</span>
                  </li>
                </ol>
              ) : (
                <ol className="text-xs text-slate-600 space-y-2.5">
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#045D6E]/10 text-[#045D6E] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                    <span>Look at the right side of your Chrome URL address bar for the <strong className="text-[#045D6E] inline-flex items-center gap-1"><Download className="w-3.5 h-3.5" /> Install</strong> icon.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#045D6E]/10 text-[#045D6E] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                    <span>Or click Chrome menu <strong className="text-slate-900">(⋮) &gt; Save and share &gt; Install TWC CareCRM</strong>.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#045D6E]/10 text-[#045D6E] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                    <span>Click <strong className="text-[#045D6E]">Install</strong> in the dialog. It launches in its own dedicated standalone desktop window!</span>
                  </li>
                </ol>
              )}
            </div>
          )}

          {/* Close Action */}
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
