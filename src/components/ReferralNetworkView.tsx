import React, { useState } from 'react';
import { 
  UserPlus, 
  QrCode, 
  TrendingUp, 
  Building2, 
  Share2, 
  Phone, 
  MessageSquare, 
  CheckCircle2, 
  Copy, 
  Clock, 
  ExternalLink,
  Plus,
  Landmark
} from 'lucide-react';
import { useCRM } from '../context/CRMContext';
import { ReferralDoctor } from '../types/crm';

export const ReferralNetworkView: React.FC = () => {
  const { referralDoctors, formatCurrency, filteredLeads, setSelectedLeadForDetail } = useCRM();

  const [selectedDoctor, setSelectedDoctor] = useState<ReferralDoctor | null>(referralDoctors[0] || null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isAddDoctorModalOpen, setIsAddDoctorModalOpen] = useState<boolean>(false);

  const totalHonorariumPaid = referralDoctors.reduce((acc, d) => acc + d.totalEarnedNGN, 0);
  const totalPendingPayout = referralDoctors.reduce((acc, d) => acc + d.pendingPayoutNGN, 0);
  const totalCasesReferred = referralDoctors.reduce((acc, d) => acc + d.totalReferralsCount, 0);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(`https://twclabs.ng/referral?ref=${code}`);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Patients referred by selected doctor
  const doctorReferredLeads = selectedDoctor 
    ? filteredLeads.filter(l => l.referringDoctorId === selectedDoctor.id) 
    : [];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner: WeChat Mini-App Referral Network Portal */}
      <div className="bg-gradient-to-r from-[#034a58] to-[#045d6e] rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-teal-100 text-xs font-semibold mb-2">
            <QrCode className="w-3.5 h-3.5 text-teal-300" />
            WeChat Mini-App Inspired Clinical Referral Portal
          </div>
          <h2 className="text-xl sm:text-2xl font-bold">External Doctor & Hospital Referral Network</h2>
          <p className="text-xs sm:text-sm text-teal-100/80 mt-1 max-w-2xl">
            Partnering with top consultant cardiologists, gynecologists, and surgeons across Lagos, Abuja, and Port Harcourt with real-time diagnostic reporting and automated honorarium disbursement.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsAddDoctorModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-white text-[#045d6e] hover:bg-teal-50 text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95 flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Enroll Specialist Doctor</span>
          </button>
        </div>
      </div>

      {/* High-level Network Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Cumulative Referred Patients</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">{totalCasesReferred} Cases</div>
          <div className="text-xs text-emerald-600 font-semibold mt-1">
            Across {referralDoctors.length} accredited partner physicians
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Honorarium Disbursed</div>
          <div className="text-2xl font-extrabold text-emerald-700 mt-2">{formatCurrency(totalHonorariumPaid)}</div>
          <div className="text-xs text-slate-500 mt-1">Direct NIP Nigerian bank settlement</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pending Honorarium Payout</div>
          <div className="text-2xl font-extrabold text-amber-700 mt-2">{formatCurrency(totalPendingPayout)}</div>
          <div className="text-xs text-slate-500 mt-1">Scheduled for end-of-month clinical payout</div>
        </div>

      </div>

      {/* Main Two-Column View: Doctor List (Left) & WeChat Digital Pass / Details (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Doctor Cards (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Accredited Specialist Partners ({referralDoctors.length})
          </h3>

          {referralDoctors.map((doc) => {
            const isSelected = doc.id === selectedDoctor?.id;
            return (
              <div
                key={doc.id}
                onClick={() => setSelectedDoctor(doc)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white ${
                  isSelected 
                    ? 'border-[#045d6e] shadow-md ring-2 ring-[#045d6e]/20' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{doc.name}</h4>
                    <p className="text-xs text-[#045d6e] font-semibold">{doc.title} • {doc.specialty}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{doc.hospitalOrClinic}</p>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold shrink-0">
                    {doc.referralCode}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-3 mt-3 border-t border-slate-100 text-slate-600">
                  <span>Referred: <strong>{doc.totalReferralsCount}</strong></span>
                  <span>Converted: <strong>{doc.convertedCount}</strong></span>
                  <span className="text-emerald-700 font-bold">Earned: {formatCurrency(doc.totalEarnedNGN)}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: WeChat-Style Doctor QR Pass & Referred Cases Tracker (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {selectedDoctor ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
              
              {/* WeChat Mini-App Digital Pass Container */}
              <div className="bg-gradient-to-br from-[#045d6e] to-[#033b47] rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  
                  <div className="space-y-2 text-center sm:text-left">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 text-teal-100">
                      TWC Official Referral Pass
                    </span>
                    <h4 className="text-lg sm:text-xl font-bold">{selectedDoctor.name}</h4>
                    <p className="text-xs text-teal-100">{selectedDoctor.specialty} • {selectedDoctor.hospitalOrClinic}</p>
                    
                    <div className="flex items-center gap-2 pt-2 justify-center sm:justify-start">
                      <span className="text-xs bg-white/10 px-3 py-1 rounded-xl font-mono text-teal-200">
                        {selectedDoctor.referralCode}
                      </span>
                      <button
                        onClick={() => handleCopyCode(selectedDoctor.referralCode)}
                        className="p-1.5 rounded-xl bg-white text-[#045d6e] hover:bg-teal-50 text-xs font-bold flex items-center gap-1"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copiedCode === selectedDoctor.referralCode ? 'Copied Link!' : 'Copy Link'}</span>
                      </button>
                    </div>
                  </div>

                  {/* QR Code Simulation Graphic */}
                  <div className="w-28 h-28 bg-white p-2 rounded-2xl flex flex-col items-center justify-center shrink-0 shadow-md">
                    <div className="w-24 h-24 border-2 border-slate-900 rounded-lg p-1.5 flex flex-col justify-between">
                      <div className="flex justify-between">
                        <div className="w-5 h-5 bg-slate-900 rounded-xs flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-2xs"></div>
                        </div>
                        <div className="w-5 h-5 bg-slate-900 rounded-xs flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-2xs"></div>
                        </div>
                      </div>
                      <div className="flex justify-center items-center">
                        <div className="w-4 h-4 bg-[#045d6e] rounded-2xs text-[6px] text-white font-bold flex items-center justify-center">
                          TWC
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <div className="w-5 h-5 bg-slate-900 rounded-xs flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-2xs"></div>
                        </div>
                        <div className="w-2 h-2 bg-slate-900 rounded-2xs"></div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Direct Actions with Doctor (WhatsApp / Call) */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-xs text-slate-600">
                  Doctor Direct: <strong>{selectedDoctor.phone}</strong>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/${selectedDoctor.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Dear ${selectedDoctor.name}, greetings from TWC Clinical Liaison desk.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp Doctor</span>
                  </a>
                </div>
              </div>

              {/* Bank Account Payout Details */}
              <div className="p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase">
                  <Landmark className="w-4 h-4 text-[#045d6e]" />
                  <span>Verified Nigerian Bank Account for Honorarium Settlement</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600 pt-1">
                  <div>Bank: <strong className="text-slate-900">{selectedDoctor.bankAccount.bankName}</strong></div>
                  <div>Account No: <strong className="text-slate-900 font-mono">{selectedDoctor.bankAccount.accountNumber}</strong></div>
                  <div>Beneficiary: <strong className="text-slate-900">{selectedDoctor.bankAccount.accountName}</strong></div>
                </div>
              </div>

              {/* Patients Referred by this Doctor Tracker */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Referred Patient Cases Tracking ({doctorReferredLeads.length})
                </h4>

                {doctorReferredLeads.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-2xl">
                    No active patients in the current filtered view for this doctor.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {doctorReferredLeads.map((lead) => (
                      <div
                        key={lead.id}
                        onClick={() => setSelectedLeadForDetail(lead)}
                        className="p-3.5 rounded-xl border border-slate-200 hover:border-[#045d6e] transition-all cursor-pointer flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-slate-900">{lead.name}</div>
                          <div className="text-[11px] text-slate-500">{lead.clinicalInterest}</div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-emerald-600">
                            {formatCurrency(lead.referralHonorariumNGN || 50000)}
                          </span>
                          <div className="text-[10px] text-slate-400 capitalize">
                            Status: {lead.referralStatus}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="p-12 text-center text-slate-400">
              Select a doctor from the list to view their digital pass and referrals.
            </div>
          )}
        </div>

      </div>

      {/* Enroll Specialist Modal */}
      {isAddDoctorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Enroll Specialist Doctor</h3>
              <button onClick={() => setIsAddDoctorModalOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Doctor Name & Credentials</label>
              <input type="text" placeholder="Dr. Babatunde Fashola, MBBS, FWACS" className="w-full p-2.5 text-xs rounded-xl border border-slate-300" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Medical Specialty</label>
              <input type="text" placeholder="Consultant Cardiothoracic Surgeon" className="w-full p-2.5 text-xs rounded-xl border border-slate-300" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Hospital / Clinic Affiliation</label>
              <input type="text" placeholder="Reddington Hospital, Victoria Island" className="w-full p-2.5 text-xs rounded-xl border border-slate-300" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp Phone Number</label>
              <input type="text" placeholder="+234 803 999 8877" className="w-full p-2.5 text-xs rounded-xl border border-slate-300" />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setIsAddDoctorModalOpen(false)} className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600">Cancel</button>
              <button 
                onClick={() => {
                  alert('Specialist enrolled and QR referral code generated successfully!');
                  setIsAddDoctorModalOpen(false);
                }} 
                className="px-5 py-2 rounded-xl bg-[#045d6e] text-white font-bold text-xs"
              >
                Enroll & Generate QR Pass
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
