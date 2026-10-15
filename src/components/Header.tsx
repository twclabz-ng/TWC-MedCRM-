import React, { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Plus, 
  Download, 
  FileSpreadsheet, 
  CheckCircle2, 
  ChevronDown,
  Building2,
  Sparkles,
  RefreshCw,
  Landmark,
  Palette,
  HardDrive,
  LogOut,
  Lock,
  Shield
} from 'lucide-react';
import { useCRM } from '../context/CRMContext';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { HospitalPersonalizationModal } from './HospitalPersonalizationModal';
import { PWAInstallModal } from './PWAInstallModal';

export const Header: React.FC = () => {
  const { 
    tenants,
    currentTenantId,
    setCurrentTenantId,
    currentTenant,
    addTenant,
    associates,
    tenantAssociates, 
    selectedAssociateId, 
    setSelectedAssociateId, 
    activeAssociate,
    isPrivacyMasked, 
    setIsPrivacyMasked, 
    setIsNewLeadModalOpen, 
    setIsNDPAModalOpen,
    syncAllToGoogleSheets,
    currentUser,
    logout
  } = useCRM();

  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [isInstallGuideOpen, setIsInstallGuideOpen] = useState(false);
  const [isAssociateDropdownOpen, setIsAssociateDropdownOpen] = useState(false);
  const [isTenantDropdownOpen, setIsTenantDropdownOpen] = useState(false);
  const [isAddTenantModalOpen, setIsAddTenantModalOpen] = useState(false);
  const [isPersonalizeModalOpen, setIsPersonalizeModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState(false);

  // New Hospital Tenant Form State
  const [newTenantName, setNewTenantName] = useState('');
  const [newTenantShortName, setNewTenantShortName] = useState('');
  const [newTenantAddress, setNewTenantAddress] = useState('');
  const [newTenantCity, setNewTenantCity] = useState('Lagos');
  const [newTenantPhone, setNewTenantPhone] = useState('+234 1 ');
  const [newTenantEmail, setNewTenantEmail] = useState('');

  const handleSyncClick = () => {
    syncAllToGoogleSheets();
    setSyncFeedback(true);
    setTimeout(() => setSyncFeedback(false), 2000);
  };

  const handleCreateTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTenantName) return;

    addTenant({
      name: newTenantName,
      shortName: newTenantShortName || newTenantName.split(' ')[0],
      slug: newTenantName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      tagline: 'Healthcare & Diagnostic Specialty Center',
      address: newTenantAddress,
      city: newTenantCity,
      state: 'Lagos State',
      phone: newTenantPhone,
      email: newTenantEmail || `contact@${newTenantShortName.toLowerCase()}.ng`,
      website: 'https://twclabs.ng',
      cacNumber: `RC-${Math.floor(1000000 + Math.random() * 9000000)}`,
      tinNumber: '21098471-0001',
      primaryColor: '#045D6E',
      bankDetails: {
        bankName: 'Zenith Bank PLC',
        accountNumber: '1014892019',
        accountName: `${newTenantName} Ltd`,
      },
      googleAppsScriptUrl: 'https://script.google.com/macros/s/AKfycbyNewTenant/exec',
      nigeriaBulkSms: {
        senderId: (newTenantShortName || 'HOSPITAL').substring(0, 11).toUpperCase(),
        apiKey: 'nbs_live_sec_key',
        balanceNGN: 25000,
      },
    });

    setIsAddTenantModalOpen(false);
    setNewTenantName('');
    setNewTenantShortName('');
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 ios-blur border-b border-slate-200/80 shadow-2xs pt-[max(4px,env(safe-area-inset-top))] transition-all w-full max-w-full">
      <div className="w-full max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-1.5 sm:gap-3 min-w-0">
          
          {/* Left: Brand Icon + SaaS Multi-Hospital Switcher */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 flex-1 sm:flex-initial">
            {/* TWC LABS Brand Squircle Icon */}
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-[10px] sm:rounded-[12px] bg-[#045D6E] text-white flex flex-col justify-center p-1 sm:p-1.5 shadow-sm border border-[#034a58] shrink-0 ios-pressable">
              {/* Healthcare Cross */}
              <div className="absolute top-0.5 right-1 sm:top-1 sm:right-1.5 w-1.5 h-1.5 bg-white relative">
                <span className="absolute -top-0.5 left-0.5 w-0.5 h-1.5 bg-white rounded-xs"></span>
                <span className="absolute top-0.5 -left-0.5 w-1.5 h-0.5 bg-white rounded-xs"></span>
              </div>
              <div className="border border-white/70 p-0.5 rounded-[2px] sm:rounded-[3px] flex flex-col justify-center items-start pl-0.5">
                <span className="text-[8px] sm:text-[9px] font-black leading-none tracking-tight">TWC</span>
                <span className="text-[5.5px] sm:text-[6.5px] font-extrabold leading-none tracking-wider text-teal-100">LABS</span>
              </div>
            </div>

            {/* SaaS Hospital Tenant Switcher Dropdown */}
            <div className="relative min-w-0 max-w-[130px] xs:max-w-[170px] sm:max-w-[220px] md:max-w-xs">
              <button
                onClick={() => setIsTenantDropdownOpen(!isTenantDropdownOpen)}
                className="flex items-center gap-1 text-left rounded-lg p-0.5 sm:p-1 hover:bg-slate-100/70 transition-colors ios-pressable group w-full min-w-0"
                title="Switch Hospital SaaS Tenant"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <span className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight leading-tight truncate">
                      {currentTenant.shortName}
                    </span>
                    <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-slate-700 shrink-0" />
                  </div>
                  <div className="text-[10px] text-teal-800 font-semibold hidden sm:flex items-center gap-1">
                    <span>Hospital SaaS</span>
                    <span>•</span>
                    <span className="text-emerald-700">Online</span>
                  </div>
                </div>
              </button>

              {/* Tenant Dropdown Menu */}
              {isTenantDropdownOpen && (
                <div 
                  className="absolute left-0 mt-2 w-72 sm:w-80 max-w-[calc(100vw-20px)] rounded-[22px] bg-white/95 ios-blur border border-slate-200/80 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95"
                  onMouseLeave={() => setIsTenantDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Hospital SaaS Tenants</p>
                      <p className="text-xs text-slate-500">Switch current hospital environment</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-teal-50 text-[#045D6E]">
                      {tenants.length} Active
                    </span>
                  </div>

                  <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 py-1">
                    {tenants.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          setCurrentTenantId(t.id);
                          setIsTenantDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 flex items-center justify-between text-xs transition-colors ${
                          t.id === currentTenantId ? 'bg-teal-50 text-[#045D6E] font-bold' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <div className="font-semibold text-slate-900 truncate">{t.name}</div>
                          <div className="text-[10px] text-slate-500 truncate">{t.address}, {t.city}</div>
                        </div>
                        {t.id === currentTenantId && <CheckCircle2 className="w-4 h-4 text-[#045D6E] shrink-0" />}
                      </button>
                    ))}
                  </div>

                  <div className="p-2 border-t border-slate-100 bg-slate-50/50 space-y-1.5">
                    <button
                      onClick={() => {
                        setIsTenantDropdownOpen(false);
                        setIsPersonalizeModalOpen(true);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-teal-50 hover:bg-teal-100 text-[#045D6E] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ios-pressable"
                    >
                      <Palette className="w-3.5 h-3.5" />
                      <span>Personalize {currentTenant.shortName} Branding</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsTenantDropdownOpen(false);
                        setIsAddTenantModalOpen(true);
                      }}
                      className="w-full py-1.5 rounded-xl border border-dashed border-[#045D6E] text-[#045D6E] hover:bg-teal-50 text-xs font-bold flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Provision New Hospital Tenant</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Responsive Header Actions (Fits all screens without overflowing) */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            
            {/* Associate Personalization Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsAssociateDropdownOpen(!isAssociateDropdownOpen)}
                className={`flex items-center gap-1 px-2 py-1.5 sm:px-2.5 sm:py-1.5 rounded-full text-xs font-semibold border transition-all ios-pressable ${
                  selectedAssociateId !== 'all' 
                    ? 'bg-teal-50 border-[#045D6E] text-[#045D6E]' 
                    : 'bg-slate-100/90 border-slate-200/80 text-slate-700 hover:bg-slate-200/80'
                }`}
                title="Personalize dashboard view by associate"
              >
                <Users className="w-3.5 h-3.5 text-[#045D6E] shrink-0" />
                <span className="hidden sm:inline max-w-[100px] truncate">
                  {activeAssociate ? activeAssociate.name.split(' ')[0] : 'All'}
                </span>
                {selectedAssociateId !== 'all' && (
                  <span className="sm:hidden w-1.5 h-1.5 rounded-full bg-[#045D6E]" />
                )}
                <ChevronDown className="w-3 h-3 text-slate-400 shrink-0 hidden sm:inline" />
              </button>

              {/* Associate Dropdown Menu */}
              {isAssociateDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-72 sm:w-80 max-w-[calc(100vw-20px)] rounded-[22px] bg-white/95 ios-blur border border-slate-200/80 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95"
                  onMouseLeave={() => setIsAssociateDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Personalize Dashboard</p>
                    <p className="text-xs text-slate-500">Filter pipeline, tasks & tickets by associate</p>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedAssociateId('all');
                      setIsAssociateDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 flex items-center justify-between text-xs transition-colors ${
                      selectedAssociateId === 'all' ? 'bg-teal-50 text-[#045D6E] font-bold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-semibold text-slate-900">Hospital-Wide (All Associates)</div>
                    {selectedAssociateId === 'all' && <CheckCircle2 className="w-4 h-4 text-[#045D6E]" />}
                  </button>

                  <div className="my-1 border-t border-slate-100"></div>

                  {tenantAssociates.map((assoc) => (
                    <button
                      key={assoc.id}
                      onClick={() => {
                        setSelectedAssociateId(assoc.id);
                        setIsAssociateDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 flex items-center justify-between text-xs transition-colors ${
                        selectedAssociateId === assoc.id ? 'bg-teal-50 text-[#045D6E] font-bold' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img 
                          src={assoc.avatar} 
                          alt={assoc.name} 
                          className="w-6 h-6 rounded-full object-cover border border-slate-200 shrink-0" 
                        />
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-900 truncate">{assoc.name}</div>
                          <div className="text-[10px] text-slate-500 truncate">{assoc.title}</div>
                        </div>
                      </div>
                      <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 shrink-0 ml-1">
                        {assoc.activeLeadsCount} cases
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Google Sheets Sync Button (Desktop) */}
            <button
              onClick={handleSyncClick}
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold border transition-all ios-pressable ${
                syncFeedback 
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                  : 'bg-slate-100/80 border-slate-200 text-slate-600 hover:bg-slate-200/80'
              }`}
              title="2-Way Sync with Google Sheets"
            >
              <FileSpreadsheet className={`w-3.5 h-3.5 ${syncFeedback ? 'text-emerald-600 animate-spin' : 'text-emerald-600'}`} />
              <span>{syncFeedback ? 'Synced!' : 'Sheets'}</span>
            </button>

            {/* NDPA PII Privacy Masking Toggle */}
            <button
              onClick={() => setIsPrivacyMasked(!isPrivacyMasked)}
              className={`flex items-center gap-1 px-2 py-1.5 sm:px-2.5 sm:py-1.5 rounded-full border transition-all ios-pressable ${
                isPrivacyMasked 
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                  : 'bg-slate-100/90 border-slate-200/80 text-slate-600 hover:bg-slate-200'
              }`}
              title={isPrivacyMasked ? 'NDPA Masking ACTIVE: PII Hidden' : 'Click to mask patient PII for desk privacy'}
            >
              {isPrivacyMasked ? (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="text-[11px] font-bold hidden sm:inline">Masked</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-[11px] font-medium hidden sm:inline">Privacy</span>
                </>
              )}
            </button>

            {/* PWA Install Button */}
            {!isInstalled && (
              <button
                onClick={async () => {
                  if (isInstallable) {
                    const ok = await install();
                    if (!ok) setIsInstallGuideOpen(true);
                  } else {
                    setIsInstallGuideOpen(true);
                  }
                }}
                className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold bg-[#045D6E] text-white hover:bg-[#034a58] shadow-sm shadow-[#045D6E]/20 ios-pressable shrink-0 cursor-pointer"
                title="Install TWC CareCRM as a native application"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Install</span>
              </button>
            )}

            {/* New Lead Primary CTA */}
            <button
              onClick={() => setIsNewLeadModalOpen(true)}
              className="flex items-center justify-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold bg-[#045D6E] text-white hover:bg-[#034a58] shadow-sm shadow-[#045D6E]/20 ios-pressable shrink-0"
              title="Add new patient intake or corporate lead"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">+ Case</span>
            </button>

            {/* Authenticated Admin Account (Dr. Okiti - okiti@twchealth.ng) */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-1.5 p-1 sm:px-2 sm:py-1 rounded-full bg-slate-100 hover:bg-slate-200/80 border border-slate-200/90 transition-all ios-pressable group"
                title="Account: Dr. Okiti (okiti@twchealth.ng)"
              >
                <img
                  src={currentUser?.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80'}
                  alt={currentUser?.name || 'Dr. Okiti'}
                  className="w-6 h-6 rounded-full object-cover border border-[#045D6E]/40 shrink-0"
                />
                <span className="hidden lg:inline text-xs font-bold text-slate-800 max-w-[90px] truncate">
                  {currentUser?.name || 'Dr. Okiti'}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-slate-600 shrink-0" />
              </button>

              {/* Account Dropdown */}
              {isUserMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-72 sm:w-80 rounded-[22px] bg-white/95 ios-blur border border-slate-200/80 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95"
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                >
                  <div className="flex items-center gap-3 p-2 bg-slate-50/80 rounded-2xl border border-slate-100 mb-2">
                    <img 
                      src={currentUser?.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80'}
                      alt={currentUser?.name || 'Dr. Okiti'}
                      className="w-10 h-10 rounded-full object-cover border-2 border-[#045D6E]"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-slate-900 text-xs truncate">{currentUser?.name || 'Dr. Okiti'}</div>
                      <div className="font-mono text-[11px] text-[#045D6E] font-semibold truncate">{currentUser?.email || 'okiti@twchealth.ng'}</div>
                      <div className="text-[10px] text-slate-500 truncate">{currentUser?.title || 'Medical Director & Chief Administrator'}</div>
                    </div>
                  </div>

                  <div className="space-y-1 py-1 text-xs text-slate-600">
                    <div className="px-3 py-1.5 flex items-center justify-between bg-slate-50 rounded-xl">
                      <span className="text-[11px] text-slate-500">Hospital Role</span>
                      <span className="font-bold text-slate-800 text-[11px]">Medical Director (Super Admin)</span>
                    </div>
                    <div className="px-3 py-1.5 flex items-center justify-between bg-slate-50 rounded-xl">
                      <span className="text-[11px] text-slate-500">Security Clearance</span>
                      <span className="font-bold text-emerald-700 text-[11px] flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> NDPA Full Access
                      </span>
                    </div>
                    <div className="px-3 py-1.5 flex items-center justify-between bg-slate-50 rounded-xl">
                      <span className="text-[11px] text-slate-500">Current Hospital</span>
                      <span className="font-semibold text-slate-800 text-[11px] truncate max-w-[130px]">{currentTenant.name}</span>
                    </div>
                  </div>

                  <div className="pt-2 mt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Lock Screen & Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* PROVISION NEW HOSPITAL TENANT MODAL */}
      {isAddTenantModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 ios-blur p-0 sm:p-4 overflow-y-auto">
          <form
            onSubmit={handleCreateTenant}
            className="w-full max-w-lg rounded-t-[32px] sm:rounded-[32px] bg-white p-6 shadow-2xl border border-slate-200 space-y-4 my-0 sm:my-auto text-xs"
          >
            <div className="w-10 h-1.5 rounded-full bg-slate-300 mx-auto -mt-2 mb-2 sm:hidden" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#045D6E] flex items-center justify-center font-bold">
                  <Building2 className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Provision New Hospital SaaS Tenant</h3>
              </div>
              <button type="button" onClick={() => setIsAddTenantModalOpen(false)} className="text-slate-400">✕</button>
            </div>

            <p className="text-slate-500 text-[11px] leading-relaxed">
              Provision an isolated CRM environment with dedicated Google Sheets, Drive folders, and Nigeria Bulk SMS integration for a new hospital or branch clinic.
            </p>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Full Hospital / Clinic Name</label>
              <input
                type="text"
                required
                value={newTenantName}
                onChange={(e) => setNewTenantName(e.target.value)}
                placeholder="e.g. Lagoon Specialist Hospital Victoria Island"
                className="w-full p-2.5 rounded-xl border border-slate-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Short Brand Name</label>
                <input
                  type="text"
                  required
                  value={newTenantShortName}
                  onChange={(e) => setNewTenantShortName(e.target.value)}
                  placeholder="e.g. Lagoon VI"
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">City / Region</label>
                <input
                  type="text"
                  value={newTenantCity}
                  onChange={(e) => setNewTenantCity(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Physical Address</label>
              <input
                type="text"
                value={newTenantAddress}
                onChange={(e) => setNewTenantAddress(e.target.value)}
                placeholder="Street address, district..."
                className="w-full p-2.5 rounded-xl border border-slate-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Hospital Contact Phone</label>
                <input
                  type="text"
                  value={newTenantPhone}
                  onChange={(e) => setNewTenantPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Official Clinical Email</label>
                <input
                  type="email"
                  value={newTenantEmail}
                  onChange={(e) => setNewTenantEmail(e.target.value)}
                  placeholder="liaison@hospital.ng"
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button type="button" onClick={() => setIsAddTenantModalOpen(false)} className="px-4 py-2 rounded-xl text-slate-600 font-semibold">Cancel</button>
              <button type="submit" className="px-5 py-2 rounded-xl bg-[#045D6E] text-white font-bold">Provision Hospital Tenant</button>
            </div>
          </form>
        </div>
      )}

      {/* Universal PWA Installation Guide Modal */}
      <PWAInstallModal
        isOpen={isInstallGuideOpen}
        onClose={() => setIsInstallGuideOpen(false)}
      />

      {/* Hospital SaaS Branding & Personalization Modal */}
      {isPersonalizeModalOpen && (
        <HospitalPersonalizationModal
          isOpen={isPersonalizeModalOpen}
          onClose={() => setIsPersonalizeModalOpen(false)}
        />
      )}
    </header>
  );
};
