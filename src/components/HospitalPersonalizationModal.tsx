import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Palette, 
  Image as ImageIcon, 
  Landmark, 
  FileText, 
  CheckCircle2, 
  X, 
  Upload, 
  ShieldCheck, 
  Clock, 
  Sparkles,
  ExternalLink,
  HardDrive
} from 'lucide-react';
import { useCRM } from '../context/CRMContext';
import { HospitalTenant } from '../types/crm';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const HospitalPersonalizationModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { currentTenant, updateTenant } = useCRM();

  const [activeTab, setActiveTab] = useState<'brand' | 'bank' | 'sla'>('brand');

  // Form State initialized from current tenant with safe defaults
  const [name, setName] = useState(currentTenant?.name || '');
  const [shortName, setShortName] = useState(currentTenant?.shortName || '');
  const [tagline, setTagline] = useState(currentTenant?.tagline || '');
  const [primaryColor, setPrimaryColor] = useState(currentTenant?.primaryColor || '#045D6E');
  const [logoUrl, setLogoUrl] = useState(currentTenant?.logoUrl || '');
  const [address, setAddress] = useState(currentTenant?.address || '');
  const [city, setCity] = useState(currentTenant?.city || '');
  const [phone, setPhone] = useState(currentTenant?.phone || '');
  const [email, setEmail] = useState(currentTenant?.email || '');
  const [cacNumber, setCacNumber] = useState(currentTenant?.cacNumber || '');
  const [tinNumber, setTinNumber] = useState(currentTenant?.tinNumber || '');

  // Bank & Invoice branding
  const [bankName, setBankName] = useState(currentTenant?.bankDetails?.bankName || '');
  const [accountNumber, setAccountNumber] = useState(currentTenant?.bankDetails?.accountNumber || '');
  const [accountName, setAccountName] = useState(currentTenant?.bankDetails?.accountName || '');
  const [invoiceFooterNote, setInvoiceFooterNote] = useState(
    currentTenant?.invoiceFooterNote || 'Payment strictly within 30 days. All investigations certified under ISO-15189 standards.'
  );

  // SLA & Clinical Branding
  const [defaultSlaTerms, setDefaultSlaTerms] = useState(
    currentTenant?.defaultSlaTerms || 'Guaranteed 8-hour diagnostic turnaround time with online consultant validation.'
  );
  const [authorizedSignatoryName, setAuthorizedSignatoryName] = useState(
    currentTenant?.authorizedSignatoryName || 'Dr. Chioma Okonjo, FWACP'
  );
  const [authorizedSignatoryTitle, setAuthorizedSignatoryTitle] = useState(
    currentTenant?.authorizedSignatoryTitle || 'Clinical Lead & Head of Diagnostic Services'
  );

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Synchronize when currentTenant or isOpen changes
  useEffect(() => {
    if (currentTenant && isOpen) {
      setName(currentTenant.name || '');
      setShortName(currentTenant.shortName || '');
      setTagline(currentTenant.tagline || '');
      setPrimaryColor(currentTenant.primaryColor || '#045D6E');
      setLogoUrl(currentTenant.logoUrl || '');
      setAddress(currentTenant.address || '');
      setCity(currentTenant.city || '');
      setPhone(currentTenant.phone || '');
      setEmail(currentTenant.email || '');
      setCacNumber(currentTenant.cacNumber || '');
      setTinNumber(currentTenant.tinNumber || '');
      setBankName(currentTenant.bankDetails?.bankName || '');
      setAccountNumber(currentTenant.bankDetails?.accountNumber || '');
      setAccountName(currentTenant.bankDetails?.accountName || '');
      setInvoiceFooterNote(currentTenant.invoiceFooterNote || '');
      setDefaultSlaTerms(currentTenant.defaultSlaTerms || '');
      setAuthorizedSignatoryName(currentTenant.authorizedSignatoryName || '');
      setAuthorizedSignatoryTitle(currentTenant.authorizedSignatoryTitle || '');
      setSavedSuccess(false);
    }
  }, [currentTenant, isOpen]);

  if (!isOpen) return null;

  const colorPresets = [
    { label: 'TWC Teal', hex: '#045D6E' },
    { label: 'Cedar Navy', hex: '#0A4755' },
    { label: 'Clinical Emerald', hex: '#057A55' },
    { label: 'Royal Healthcare', hex: '#1D4ED8' },
    { label: 'Deep Slate', hex: '#1E293B' },
  ];

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLogoUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateTenant(currentTenant.id, {
      name,
      shortName,
      tagline,
      primaryColor,
      logoUrl,
      address,
      city,
      phone,
      email,
      cacNumber,
      tinNumber,
      invoiceFooterNote,
      defaultSlaTerms,
      authorizedSignatoryName,
      authorizedSignatoryTitle,
      bankDetails: {
        bankName,
        accountNumber,
        accountName,
      },
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 ios-blur p-0 sm:p-4 animate-in fade-in">
      <div className="w-full max-w-2xl rounded-t-[32px] sm:rounded-[32px] bg-white shadow-2xl border border-slate-100 max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div 
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold shadow-sm"
              style={{ backgroundColor: primaryColor }}
            >
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  Hospital Branding & SaaS Personalization
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-[#045D6E] border border-teal-200">
                  {currentTenant.shortName}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Personalize official logos, invoice bank accounts, and SLA signatures for this hospital.
              </p>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Sub-Header */}
        <div className="px-6 pt-3 border-b border-slate-100 flex items-center gap-2 bg-white">
          <button
            onClick={() => setActiveTab('brand')}
            className={`pb-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'brand' 
                ? 'border-[#045D6E] text-[#045D6E]' 
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            1. Brand Identity & Logo
          </button>
          <button
            onClick={() => setActiveTab('bank')}
            className={`pb-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'bank' 
                ? 'border-[#045D6E] text-[#045D6E]' 
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            2. Invoicing & Bank Details
          </button>
          <button
            onClick={() => setActiveTab('sla')}
            className={`pb-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'sla' 
                ? 'border-[#045D6E] text-[#045D6E]' 
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            3. SLA & Signatory Terms
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          
          {savedSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-bold flex items-center gap-2 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Branding saved! Invoices & SLAs are updated with {shortName} identity.</span>
            </div>
          )}

          {/* TAB 1: BRAND IDENTITY & LOGO */}
          {activeTab === 'brand' && (
            <div className="space-y-4">
              
              {/* Logo Upload & Preview */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-slate-300 bg-white overflow-hidden flex items-center justify-center shrink-0 shadow-xs">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <Building2 className="w-8 h-8 text-slate-300" />
                  )}
                </div>

                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <div className="font-bold text-slate-800 text-xs">Hospital Brand Logo & Crest</div>
                  <p className="text-[11px] text-slate-500">
                    Appears on generated invoices, diagnostic reports, and service level agreements.
                  </p>
                  <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                    <label className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer font-bold flex items-center gap-1.5 ios-pressable">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Image File</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                    </label>
                    {logoUrl && (
                      <button
                        type="button"
                        onClick={() => setLogoUrl('')}
                        className="px-2.5 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 font-semibold"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Color Scheme Picker */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Primary Brand Color</label>
                <div className="flex flex-wrap items-center gap-2">
                  {colorPresets.map(c => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => setPrimaryColor(c.hex)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                        primaryColor === c.hex ? 'ring-2 ring-slate-900 border-transparent shadow-xs' : 'border-slate-200'
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ backgroundColor: c.hex }} />
                      <span>{c.label}</span>
                    </button>
                  ))}
                  <div className="flex items-center gap-1.5 pl-2">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300"
                    />
                    <span className="font-mono text-slate-500 text-[11px]">{primaryColor}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Full Legal Hospital Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Short Brand Name (Header & Invoices) *</label>
                  <input
                    type="text"
                    required
                    value={shortName}
                    onChange={(e) => setShortName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Hospital Tagline & Specialty</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Tertiary Specialist Surgical, Orthopaedic & Diagnostic Care"
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-bold mb-1">Physical Clinical Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">City / Region</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Clinical Liaison Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Official Liaison Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">CAC Registration Number</label>
                  <input
                    type="text"
                    value={cacNumber}
                    onChange={(e) => setCacNumber(e.target.value)}
                    placeholder="RC-1492084"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Tax Identification Number (TIN)</label>
                  <input
                    type="text"
                    value={tinNumber}
                    onChange={(e) => setTinNumber(e.target.value)}
                    placeholder="21098471-0001"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-slate-600">
                <div className="flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-[#045D6E]" />
                  <span>Dedicated Google Drive Folder:</span>
                  <strong className="font-mono text-slate-800">{currentTenant.driveFolderId}</strong>
                </div>
                <a
                  href={currentTenant.driveFolderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#045D6E] font-bold flex items-center gap-1 hover:underline"
                >
                  <span>Open Folder</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

            </div>
          )}

          {/* TAB 2: INVOICING & BANK DETAILS */}
          {activeTab === 'bank' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200/80 text-teal-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-[#045D6E]">
                  <Landmark className="w-4 h-4" />
                  <span>Official Invoicing Bank Settlement Account</span>
                </div>
                <p className="text-[11px] text-teal-800 leading-relaxed">
                  These bank details appear in the payment instructions footer on all generated proforma and tax invoices.
                </p>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Official Bank Name *</label>
                <input
                  type="text"
                  required
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="e.g. Zenith Bank PLC / GTBank"
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">10-Digit NIBSS Account Number *</label>
                  <input
                    type="text"
                    required
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="1014892019"
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Verified Corporate Account Name *</label>
                  <input
                    type="text"
                    required
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    placeholder="e.g. TWC Healthcare & Diagnostic Laboratories Ltd"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Default Invoice Terms & Footer Note</label>
                <textarea
                  rows={3}
                  value={invoiceFooterNote}
                  onChange={(e) => setInvoiceFooterNote(e.target.value)}
                  placeholder="Payment strictly within 30 days of invoice date. Thank you for entrusting our clinical diagnostic services."
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>
            </div>
          )}

          {/* TAB 3: SLA & SIGNATORY TERMS */}
          {activeTab === 'sla' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200/80 text-indigo-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-indigo-800">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Clinical SLA Commitments & Authorized Executive Signatory</span>
                </div>
                <p className="text-[11px] text-indigo-700 leading-relaxed">
                  Default parameters automatically populated onto Service Level Agreements and Retainer MOUs.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Authorized Executive Signatory *</label>
                  <input
                    type="text"
                    required
                    value={authorizedSignatoryName}
                    onChange={(e) => setAuthorizedSignatoryName(e.target.value)}
                    placeholder="e.g. Dr. Chioma Okonjo, FWACP"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Executive Title / Designation *</label>
                  <input
                    type="text"
                    required
                    value={authorizedSignatoryTitle}
                    onChange={(e) => setAuthorizedSignatoryTitle(e.target.value)}
                    placeholder="e.g. Medical Director & Clinical Lead"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Default Retainer / Diagnostic SLA Clause</label>
                <textarea
                  rows={4}
                  value={defaultSlaTerms}
                  onChange={(e) => setDefaultSlaTerms(e.target.value)}
                  placeholder="Guaranteed 8-hour diagnostic turnaround time with online consultant validation."
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs leading-relaxed"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white border border-slate-200 text-[#045D6E] font-serif italic text-sm">
                  ✓ {authorizedSignatoryName}
                </div>
                <div className="text-[11px]">
                  <p className="font-bold text-slate-800">Digital Execution Stamp Preview</p>
                  <p className="text-slate-500">Appears on executed corporate retainers and doctor referral agreements.</p>
                </div>
              </div>
            </div>
          )}

          {/* Footer Save Button */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 font-bold"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-white font-bold shadow-md transition-all ios-pressable flex items-center gap-2"
              style={{ backgroundColor: primaryColor }}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Apply & Save Hospital Branding</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
