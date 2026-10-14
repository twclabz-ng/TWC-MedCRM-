import React, { useState } from 'react';
import { 
  X, 
  UserCheck, 
  Building2, 
  ShieldCheck, 
  Plus, 
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { useCRM } from '../context/CRMContext';
import { FunnelType } from '../types/crm';

export const NewLeadModal: React.FC = () => {
  const { 
    isNewLeadModalOpen, 
    setIsNewLeadModalOpen, 
    addLead, 
    associates, 
    referralDoctors, 
    setSelectedLeadForDetail 
  } = useCRM();

  const [leadType, setLeadType] = useState<FunnelType>('patient');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+234 ');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('Victoria Island, Lagos');
  const [associateId, setAssociateId] = useState(associates[0]?.id || '');
  const [expectedValue, setExpectedValue] = useState(450000);
  const [clinicalInterest, setClinicalInterest] = useState('Executive Health Checkup 360');
  const [referralSource, setReferralSource] = useState<any>('Doctor Referral');
  const [referringDoctorId, setReferringDoctorId] = useState(referralDoctors[0]?.id || '');
  const [ndpaConsented, setNdpaConsented] = useState(true);

  if (!isNewLeadModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const referringDoc = referralDoctors.find(d => d.id === referringDoctorId);

    const created = addLead({
      type: leadType,
      name,
      phone,
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@patient.ng`,
      location,
      associateId,
      stage: leadType === 'patient' ? 'inquiry' : 'lead_inbound',
      expectedValueNGN: Number(expectedValue),
      probabilityPercent: 50,
      clinicalInterest,
      referralSource,
      referringDoctorId: referralSource === 'Doctor Referral' ? referringDoctorId : undefined,
      referringDoctorName: referralSource === 'Doctor Referral' ? referringDoc?.name : undefined,
      referringHospital: referralSource === 'Doctor Referral' ? referringDoc?.hospitalOrClinic : undefined,
      referralHonorariumNGN: referralSource === 'Doctor Referral' ? 50000 : undefined,
      referralStatus: referralSource === 'Doctor Referral' ? 'verified' : undefined,
      tags: [leadType === 'patient' ? 'Patient' : 'Corporate', referralSource],
      ndpaConsent: {
        consented: ndpaConsented,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        lawfulBasis: leadType === 'patient' ? 'Explicit Patient Consent' : 'Contractual Retainer',
        purpose: 'Comprehensive medical assessment, diagnostic laboratory testing, and care formulation.',
        consentChannel: 'In-Clinic Check-in',
        verifiedByAssociate: associates.find(a => a.id === associateId)?.name || 'Associate',
      }
    });

    setIsNewLeadModalOpen(false);
    setSelectedLeadForDetail(created);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 ios-blur p-0 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-xl rounded-t-[32px] sm:rounded-[32px] bg-white shadow-2xl border border-slate-200/80 overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-250 my-0 sm:my-auto max-h-[92vh] flex flex-col">
        
        {/* iOS Pull-down Grabber (Mobile) */}
        <div className="w-10 h-1.5 rounded-full bg-slate-300 mx-auto mt-2.5 mb-1 sm:hidden" />

        {/* Header */}
        <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[14px] bg-[#045d6e] flex items-center justify-center font-bold text-white shadow-sm">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold tracking-tight">New Patient or Corporate Case</h3>
              <p className="text-xs text-slate-300">Intake into TWC Funnel & Google Sheets</p>
            </div>
          </div>
          <button 
            onClick={() => setIsNewLeadModalOpen(false)} 
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center ios-pressable"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          
          {/* Account Type Toggle */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Intake Account Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setLeadType('patient')}
                className={`p-3 rounded-2xl border font-bold flex items-center justify-center gap-2 transition-all ${
                  leadType === 'patient' 
                    ? 'bg-teal-50 border-[#045d6e] text-[#045d6e] shadow-2xs' 
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Individual Patient</span>
              </button>

              <button
                type="button"
                onClick={() => setLeadType('corporate_retainer')}
                className={`p-3 rounded-2xl border font-bold flex items-center justify-center gap-2 transition-all ${
                  leadType === 'corporate_retainer' 
                    ? 'bg-blue-50 border-blue-600 text-blue-600 shadow-2xs' 
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Corporate Retainer / HMO</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {leadType === 'patient' ? 'Full Patient Name' : 'Company or Organization Name'}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={leadType === 'patient' ? 'e.g. Dr. Ngozi Adeleke' : 'e.g. Dangote Group / TotalEnergies'}
              className="w-full p-2.5 rounded-xl border border-slate-300"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp Phone Number</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+234 803 123 4567"
                className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="patient@example.com"
                className="w-full p-2.5 rounded-xl border border-slate-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Location / Clinic Region</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
              >
                <option value="Victoria Island, Lagos">Victoria Island, Lagos (Main)</option>
                <option value="Ikoyi, Lagos">Ikoyi, Lagos</option>
                <option value="Lekki Phase 1, Lagos">Lekki Phase 1, Lagos</option>
                <option value="Ikeja GRA, Lagos">Ikeja GRA, Lagos (Diagnostic Hub)</option>
                <option value="Maitama, Abuja">Maitama, Abuja</option>
                <option value="Port Harcourt Central">Port Harcourt Central</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Associate</label>
              <select
                value={associateId}
                onChange={(e) => setAssociateId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
              >
                {associates.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.title})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Clinical Package / Retainer Scope</label>
            <input
              type="text"
              required
              value={clinicalInterest}
              onChange={(e) => setClinicalInterest(e.target.value)}
              placeholder="e.g. Comprehensive Heart & Metabolic Panel / Staff Offshore Fitness"
              className="w-full p-2.5 rounded-xl border border-slate-300"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Expected Value (₦ NGN)</label>
              <input
                type="number"
                value={expectedValue}
                onChange={(e) => setExpectedValue(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Referral Origin</label>
              <select
                value={referralSource}
                onChange={(e) => setReferralSource(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
              >
                <option value="Doctor Referral">Doctor Referral</option>
                <option value="WhatsApp Inbound">WhatsApp Inbound</option>
                <option value="Google Form Intake">Google Form Intake</option>
                <option value="Partner Clinic">Partner Clinic</option>
                <option value="Corporate Outreach">Corporate Outreach</option>
                <option value="Direct Walk-in">Direct Walk-in</option>
              </select>
            </div>
          </div>

          {referralSource === 'Doctor Referral' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Referring Specialist Physician</label>
              <select
                value={referringDoctorId}
                onChange={(e) => setReferringDoctorId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
              >
                {referralDoctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name} - {doc.specialty} ({doc.hospitalOrClinic})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* NDPA Consent Checkbox */}
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
            <input
              type="checkbox"
              id="ndpaCheck"
              checked={ndpaConsented}
              onChange={(e) => setNdpaConsented(e.target.checked)}
              className="mt-1 h-4 w-4 rounded-xs border-emerald-300 text-emerald-600 focus:ring-emerald-500"
            />
            <label htmlFor="ndpaCheck" className="text-emerald-900 leading-relaxed cursor-pointer">
              <strong>NDPA 2023 Consent Certified:</strong> Explicit patient consent captured for medical data handling and diagnostic investigation under the Nigeria Data Protection Act.
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsNewLeadModalOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-600 font-semibold hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#045d6e] hover:bg-[#034a58] text-white font-bold shadow-md shadow-[#045d6e]/20"
            >
              Create Case & Open Dossier
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
