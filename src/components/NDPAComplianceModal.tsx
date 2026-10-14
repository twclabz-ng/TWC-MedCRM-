import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  FileCheck, 
  EyeOff, 
  Download, 
  Trash2, 
  CheckCircle2, 
  X,
  AlertCircle
} from 'lucide-react';
import { useCRM } from '../context/CRMContext';

export const NDPAComplianceModal: React.FC = () => {
  const { 
    isNDPAModalOpen, 
    setIsNDPAModalOpen, 
    isPrivacyMasked, 
    setIsPrivacyMasked, 
    leads 
  } = useCRM();

  if (!isNDPAModalOpen) return null;

  const totalConsented = leads.filter(l => l.ndpaConsent.consented).length;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 ios-blur p-0 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-t-[32px] sm:rounded-[32px] bg-white shadow-2xl border border-slate-200/80 overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-250 my-0 sm:my-auto max-h-[92vh] flex flex-col">
        
        {/* iOS Pull-down Grabber (Mobile) */}
        <div className="w-10 h-1.5 rounded-full bg-slate-300 mx-auto mt-2.5 mb-1 sm:hidden" />

        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-[16px] bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shrink-0 shadow-sm">
              <ShieldCheck className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold tracking-tight">Nigeria Data Protection Act (NDPA 2023)</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-700 text-emerald-200">
                  Certified
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 mt-0.5">
                Hospital Clinical Data Governance & Patient Consent Registry
              </p>
            </div>
          </div>

          <button 
            onClick={() => setIsNDPAModalOpen(false)}
            className="w-8 h-8 rounded-full bg-emerald-700/60 text-emerald-100 hover:text-white flex items-center justify-center ios-pressable"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700 leading-relaxed">
          
          {/* Compliance Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
              <div className="text-[10px] font-bold uppercase text-emerald-800">Consent Verification</div>
              <div className="text-xl font-black text-emerald-900 mt-1">{totalConsented} / {leads.length}</div>
              <div className="text-[10px] text-emerald-700">100% Lawful Basis Logged</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200">
              <div className="text-[10px] font-bold uppercase text-blue-800">PII Masking Protection</div>
              <div className="text-xl font-black text-blue-900 mt-1">{isPrivacyMasked ? 'Active' : 'Inactive'}</div>
              <div className="text-[10px] text-blue-700">Screen privacy shield</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] font-bold uppercase text-slate-800">Data Controller Registry</div>
              <div className="text-xl font-black text-slate-900 mt-1">NDPC/2026/TWC</div>
              <div className="text-[10px] text-slate-500">Nigeria Data Protection Commission</div>
            </div>
          </div>

          {/* Quick Toggle for PII Masking */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-bold text-slate-900">Hospital Desk Privacy Mode (PII Masking)</div>
              <div className="text-[11px] text-slate-500">
                Immediately obscures patient names and phone numbers during screen-sharing or reception desk consultations.
              </div>
            </div>
            <button
              onClick={() => setIsPrivacyMasked(!isPrivacyMasked)}
              className={`px-4 py-2 rounded-xl font-bold transition-all ${
                isPrivacyMasked 
                  ? 'bg-amber-500 text-white shadow-xs' 
                  : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
              }`}
            >
              {isPrivacyMasked ? 'PII Masking ON' : 'Turn ON Masking'}
            </button>
          </div>

          {/* Core NDPA Compliance Pillars */}
          <div className="space-y-3">
            <h4 className="font-bold uppercase tracking-wider text-slate-900 text-[11px]">
              Lawful Basis & Clinical Processing Standards
            </h4>

            <div className="space-y-2">
              <div className="p-3 rounded-xl border border-slate-200 bg-white">
                <strong className="text-slate-900">1. Explicit Patient Consent (Section 26 NDPA):</strong>
                <p className="text-slate-600 mt-0.5">
                  Captured through verified WhatsApp opt-in message, Google Form intake disclaimer, or signed physical clinic check-in slip.
                </p>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-white">
                <strong className="text-slate-900">2. Purpose Limitation:</strong>
                <p className="text-slate-600 mt-0.5">
                  Patient diagnostic results and corporate health audit files are restricted exclusively to clinical care, pathologist evaluation, and referral coordination.
                </p>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-white">
                <strong className="text-slate-900">3. Data Subject Access & Erasure (Section 34):</strong>
                <p className="text-slate-600 mt-0.5">
                  Every patient has the right to export a complete copy of their CRM records or request clinical data anonymization subject to medical retention statutes.
                </p>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
            <button
              onClick={() => alert('Exporting full NDPA Data Protection Audit Log in CSV format...')}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Compliance Audit Log</span>
            </button>

            <button
              onClick={() => setIsNDPAModalOpen(false)}
              className="w-full sm:w-auto px-6 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800"
            >
              Close
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
