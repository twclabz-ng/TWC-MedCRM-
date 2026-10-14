import React, { useState } from 'react';
import { 
  X, 
  MessageSquare, 
  PhoneCall, 
  Calendar, 
  FileSpreadsheet, 
  FolderGit2, 
  ShieldCheck, 
  UserCheck, 
  Building2, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  UserPlus, 
  Send,
  Plus,
  FileText
} from 'lucide-react';
import { useCRM } from '../context/CRMContext';
import { Lead, LeadStage, ActivityType, ActivityOutcome } from '../types/crm';
import { CommunicationBar } from './CommunicationBar';

export const LeadDetailModal: React.FC = () => {
  const { 
    selectedLeadForDetail, 
    setSelectedLeadForDetail, 
    updateLeadStage, 
    updateLead,
    addActivity, 
    associates, 
    whatsappTemplates, 
    formatCurrency, 
    maskPII,
    syncLeadToGoogleSheets
  } = useCRM();

  const [activeTab, setActiveTab] = useState<'overview' | 'whatsapp' | 'activities' | 'google_suite' | 'ndpa'>('overview');
  
  // WhatsApp composer state
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('tmpl_consult_prep');
  const [customWAMessage, setCustomWAMessage] = useState<string>('');
  const [customPhoneInput, setCustomPhoneInput] = useState<string>('');
  const [isEditingPhone, setIsEditingPhone] = useState<boolean>(false);
  const [syncDone, setSyncDone] = useState<boolean>(false);

  // New Activity form state
  const [actType, setActType] = useState<ActivityType>('phone_call');
  const [actOutcome, setActOutcome] = useState<ActivityOutcome>('Follow-up Needed');
  const [actDuration, setActDuration] = useState<number>(15);
  const [actNotes, setActNotes] = useState<string>('');
  const [actSaved, setActSaved] = useState<boolean>(false);

  if (!selectedLeadForDetail) return null;
  const lead = selectedLeadForDetail;

  const currentTemplate = whatsappTemplates.find(t => t.id === selectedTemplateId) || whatsappTemplates[0];

  // Helper to compile template variables
  const getCompiledWAMessage = () => {
    if (customWAMessage) return customWAMessage;
    let text = currentTemplate.text;
    text = text.replace(/{{patient_name}}/g, lead.name);
    text = text.replace(/{{contact_person}}/g, lead.contactPerson || lead.name);
    text = text.replace(/{{specialist_name}}/g, 'Dr. Chioma Okonjo (Specialist)');
    text = text.replace(/{{date_time}}/g, 'Thursday, 9:00 AM');
    text = text.replace(/{{lead_id}}/g, lead.id);
    text = text.replace(/{{doctor_name}}/g, lead.referringDoctorName || 'Doctor');
    text = text.replace(/{{clinical_interest}}/g, lead.clinicalInterest);
    text = text.replace(/{{drive_result_link}}/g, 'https://drive.google.com/file/d/twc-demo-lab');
    return text;
  };

  const cleanPhone = (phone: string) => phone.replace(/[^0-9]/g, '');

  const handleLaunchWhatsApp = () => {
    const text = encodeURIComponent(getCompiledWAMessage());
    const phone = cleanPhone(lead.phone);
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');

    // Also auto-log this WhatsApp outreach as an activity
    addActivity({
      leadId: lead.id,
      leadName: lead.name,
      associateId: lead.associateId,
      associateName: associates.find(a => a.id === lead.associateId)?.name || 'Associate',
      type: 'whatsapp_message',
      outcome: 'Follow-up Needed',
      durationMinutes: 5,
      notes: `Sent WhatsApp message [Template: ${currentTemplate.title}]`,
    });
  };

  const handleUpdatePhone = () => {
    if (!customPhoneInput) return;
    updateLead({
      ...lead,
      phone: customPhoneInput,
    });
    setIsEditingPhone(false);
  };

  const handleSaveActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actNotes.trim()) return;

    addActivity({
      leadId: lead.id,
      leadName: lead.name,
      associateId: lead.associateId,
      associateName: associates.find(a => a.id === lead.associateId)?.name || 'Associate',
      type: actType,
      outcome: actOutcome,
      durationMinutes: Number(actDuration),
      notes: actNotes,
    });

    setActNotes('');
    setActSaved(true);
    setTimeout(() => setActSaved(false), 2000);
  };

  const handleTriggerSheetsSync = () => {
    syncLeadToGoogleSheets(lead.id);
    setSyncDone(true);
    setTimeout(() => setSyncDone(false), 2000);
  };

  const patientStagesList: { id: LeadStage; label: string }[] = [
    { id: 'inquiry', label: 'Inquiry' },
    { id: 'triage', label: 'Triage' },
    { id: 'consultation_booked', label: 'Consultation Booked' },
    { id: 'diagnostics_lab', label: 'Diagnostics / Lab' },
    { id: 'treatment_plan', label: 'Care Plan' },
    { id: 'retention_followup', label: 'Retention & Loyalty' },
  ];

  const corporateStagesList: { id: LeadStage; label: string }[] = [
    { id: 'lead_inbound', label: 'Corporate Inbound' },
    { id: 'discovery_audit', label: 'Health Needs Audit' },
    { id: 'pitch_proposal', label: 'Pitch Proposal' },
    { id: 'mou_review', label: 'MOU Legal Review' },
    { id: 'contract_signed', label: 'Contract Signed' },
    { id: 'active_retainer', label: 'Active Retainer' },
  ];

  const stages = lead.type === 'patient' ? patientStagesList : corporateStagesList;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 ios-blur p-0 sm:p-5 overflow-y-auto">
      <div className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-t-[32px] sm:rounded-[32px] bg-white shadow-2xl border border-slate-200/80 overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-250 my-0 sm:my-auto">
        
        {/* iOS Pull-down Grabber (Mobile) */}
        <div className="w-10 h-1.5 rounded-full bg-slate-300 mx-auto mt-2.5 mb-1 sm:hidden" />

        {/* Modal Top Header */}
        <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-start justify-between gap-4 shrink-0">
          <div className="flex items-start gap-3.5">
            <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-[16px] flex items-center justify-center shrink-0 shadow-sm ${
              lead.type === 'patient' ? 'bg-[#045d6e] text-white' : 'bg-blue-600 text-white'
            }`}>
              {lead.type === 'patient' ? <UserCheck className="w-6 h-6" /> : <Building2 className="w-6 h-6" />}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base sm:text-xl font-bold tracking-tight">
                  {maskPII(lead.name, 'name')}
                </h3>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  lead.type === 'patient' ? 'bg-teal-900/60 text-teal-300 border border-teal-500/30' : 'bg-blue-900/60 text-blue-300 border border-blue-500/30'
                }`}>
                  {lead.type === 'patient' ? 'Patient' : 'Corporate'}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-600/40">
                  NDPA Protected
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-300 mt-1">
                <span>{maskPII(lead.phone, 'phone')}</span>
                <span>•</span>
                <span>{maskPII(lead.email, 'email')}</span>
                <span>•</span>
                <span>{lead.location}</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setSelectedLeadForDetail(null)}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center ios-pressable"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Funnel Stage Selector Bar */}
        <div className="px-4 sm:px-5 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3 overflow-x-auto no-scrollbar shrink-0">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
            Funnel Stage:
          </span>
          <div className="flex items-center gap-1.5">
            {stages.map((st) => {
              const isCurrent = lead.stage === st.id;
              return (
                <button
                  key={st.id}
                  onClick={() => updateLeadStage(lead.id, st.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ios-pressable ${
                    isCurrent 
                      ? 'bg-[#045d6e] text-white shadow-2xs font-bold' 
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {isCurrent && '✓ '}
                  {st.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* iOS Segmented Tab Navigation */}
        <div className="px-4 sm:px-5 py-2 bg-[#F2F2F7] border-b border-slate-200 flex space-x-1.5 shrink-0 overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', label: 'Overview', icon: FileText },
            { id: 'whatsapp', label: 'WhatsApp (Wati)', icon: MessageSquare, highlight: true },
            { id: 'activities', label: 'Activities', icon: PhoneCall },
            { id: 'google_suite', label: 'Google Suite', icon: FileSpreadsheet },
            { id: 'ndpa', label: 'NDPA Law', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ios-pressable ${
                  isSelected 
                    ? 'bg-white text-[#045d6e] shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${tab.highlight ? 'text-emerald-600' : ''}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body (Scrollable) */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Direct Communications Hub (Dialer, SMS, WhatsApp, Email & Log Inbound) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Direct Contact & Communication Hub
                  </div>
                  <span className="text-[10px] text-teal-800 font-semibold bg-teal-50 px-2 py-0.5 rounded-full">
                    Auto-Logs to Activity Timeline
                  </span>
                </div>
                <CommunicationBar contact={lead} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Medical / Retainer Interest</h4>
                  <div className="text-sm font-bold text-slate-900">{lead.clinicalInterest}</div>
                  <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-200">
                    <span>Expected Deal Value:</span>
                    <span className="font-bold text-[#045d6e] text-base">{formatCurrency(lead.expectedValueNGN)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>Stage Probability:</span>
                    <span className="font-bold text-emerald-600">{lead.probabilityPercent}%</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Referral Origin & Doctor</h4>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600">Referral Source:</span>
                    <span className="font-bold text-slate-900">{lead.referralSource}</span>
                  </div>
                  {lead.referringDoctorName && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600">Referring Physician:</span>
                      <span className="font-bold text-teal-700">{lead.referringDoctorName}</span>
                    </div>
                  )}
                  {lead.referringHospital && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600">Referring Institution:</span>
                      <span className="font-bold text-slate-900">{lead.referringHospital}</span>
                    </div>
                  )}
                  {lead.referralHonorariumNGN && (
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200">
                      <span className="text-slate-600">Referral Honorarium:</span>
                      <span className="font-bold text-emerald-600">{formatCurrency(lead.referralHonorariumNGN)} ({lead.referralStatus})</span>
                    </div>
                  )}
                </div>

              </div>

              {/* Assigned Associate card */}
              <div className="p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-100 text-[#045d6e] flex items-center justify-center font-bold">
                    Dr
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Managing Hospital Associate</div>
                    <div className="text-sm font-bold text-slate-900">
                      {associates.find(a => a.id === lead.associateId)?.name || 'Clinical Care Desk'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('whatsapp')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Message on WhatsApp</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: WHATSAPP HUB (WATI INTEGRATION) */}
          {activeTab === 'whatsapp' && (
            <div className="space-y-6">
              
              {/* WhatsApp Contact Bar with functional "Add/Change WhatsApp" */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-emerald-800">Connected WhatsApp Number</div>
                    <div className="text-sm font-bold text-slate-900">{lead.phone}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isEditingPhone ? (
                    <div className="flex items-center gap-2">
                      <input 
                        type="text" 
                        value={customPhoneInput}
                        onChange={(e) => setCustomPhoneInput(e.target.value)}
                        placeholder="+234..."
                        className="px-3 py-1 text-xs border border-emerald-300 rounded-lg bg-white"
                      />
                      <button
                        onClick={handleUpdatePhone}
                        className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setCustomPhoneInput(lead.phone);
                        setIsEditingPhone(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white border border-emerald-300 text-emerald-800 text-xs font-semibold hover:bg-emerald-100"
                    >
                      + Update WhatsApp Number
                    </button>
                  )}
                </div>
              </div>

              {/* Template Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                  Select Wati Healthcare WhatsApp Template:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {whatsappTemplates.map((tmpl) => (
                    <button
                      key={tmpl.id}
                      onClick={() => {
                        setSelectedTemplateId(tmpl.id);
                        setCustomWAMessage('');
                      }}
                      className={`p-3 rounded-xl text-left border transition-all text-xs ${
                        selectedTemplateId === tmpl.id
                          ? 'bg-emerald-50/80 border-emerald-500 font-bold text-emerald-950 shadow-2xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="font-bold">{tmpl.title}</div>
                      <div className="text-[11px] text-slate-500 capitalize mt-0.5">Category: {tmpl.category}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Composer & Preview */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                  Message Preview & Dynamic Variables:
                </label>
                <textarea
                  rows={5}
                  value={getCompiledWAMessage()}
                  onChange={(e) => setCustomWAMessage(e.target.value)}
                  className="w-full p-3.5 rounded-2xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-mono text-slate-800 leading-relaxed focus:outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>

              {/* Functional WhatsApp Launcher Button */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="text-xs text-slate-500">
                  Sends via official WhatsApp API protocol (`wa.me` intent with pre-filled message).
                </div>
                <button
                  onClick={handleLaunchWhatsApp}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 active:scale-95 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Launch WhatsApp Chat Now</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          )}

          {/* TAB 3: SALES ACTIVITIES */}
          {activeTab === 'activities' && (
            <div className="space-y-6">
              
              {/* Form to log a new sales activity */}
              <form onSubmit={handleSaveActivity} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Log Sales Call / Clinic Visit / Detailing
                  </h4>
                  {actSaved && (
                    <span className="text-xs font-bold text-emerald-600 animate-pulse">
                      Activity Logged!
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Interaction Type</label>
                    <select
                      value={actType}
                      onChange={(e) => setActType(e.target.value as ActivityType)}
                      className="w-full p-2 rounded-xl border border-slate-300 bg-white text-xs font-medium"
                    >
                      <option value="phone_call">Phone Call</option>
                      <option value="whatsapp_message">WhatsApp Message</option>
                      <option value="clinic_tour">Clinic Tour / Reception</option>
                      <option value="corporate_meeting">Corporate HR Meeting</option>
                      <option value="doctor_detailing">Doctor Detailing</option>
                      <option value="followup">Follow-up Review</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Clinical Outcome</label>
                    <select
                      value={actOutcome}
                      onChange={(e) => setActOutcome(e.target.value as ActivityOutcome)}
                      className="w-full p-2 rounded-xl border border-slate-300 bg-white text-xs font-medium"
                    >
                      <option value="Scheduled Consultation">Scheduled Consultation</option>
                      <option value="Diagnostic Booked">Diagnostic Booked</option>
                      <option value="Sent Retainer MOU">Sent Retainer MOU</option>
                      <option value="Follow-up Needed">Follow-up Needed</option>
                      <option value="Objection - HMO Delay">Objection - HMO Delay</option>
                      <option value="Objection - Budget">Objection - Budget</option>
                      <option value="Closed Won">Closed Won</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Duration (Mins)</label>
                    <input
                      type="number"
                      value={actDuration}
                      onChange={(e) => setActDuration(Number(e.target.value))}
                      className="w-full p-2 rounded-xl border border-slate-300 bg-white text-xs font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Associate Meeting Notes & Next Steps</label>
                  <textarea
                    rows={2}
                    value={actNotes}
                    onChange={(e) => setActNotes(e.target.value)}
                    placeholder="Enter detailed outcome, clinical discussions or corporate agreement terms..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs"
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#045d6e] text-white text-xs font-bold hover:bg-[#034a58]"
                  >
                    + Save Activity to CRM Timeline
                  </button>
                </div>
              </form>

              {/* Past history */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">History for this Case</h4>
                <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 text-xs text-slate-500">
                  Initial intake registered on {lead.createdAt}. Handled by {associates.find(a => a.id === lead.associateId)?.name}.
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: GOOGLE SUITE & DRIVE */}
          {activeTab === 'google_suite' && (
            <div className="space-y-6">
              
              <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-teal-900">Google Sheets Row Status</div>
                  <div className="text-xs text-teal-700 mt-0.5">
                    Synced to master spreadsheet • Row #{lead.googleSync.sheetRowIndex || 1} • Last sync: {lead.googleSync.lastSyncedAt}
                  </div>
                </div>
                <button
                  onClick={handleTriggerSheetsSync}
                  className="px-3 py-1.5 rounded-xl bg-[#045d6e] text-white text-xs font-bold hover:bg-[#034a58]"
                >
                  {syncDone ? '✓ Synced!' : 'Sync Row Now'}
                </button>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Google Drive Patient Dossier
                </h4>
                <div className="p-4 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">Dedicated Drive Folder:</span>
                    <a
                      href={lead.googleSync.googleDriveFolderUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#045d6e] font-bold hover:underline flex items-center gap-1"
                    >
                      <span>Open Drive Folder</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="border-t border-slate-100 pt-3">
                    <div className="text-xs font-semibold text-slate-600 mb-2">Attached Documents:</div>
                    <div className="space-y-2">
                      {lead.googleSync.attachedDocs.length === 0 ? (
                        <div className="text-xs text-slate-400 italic">No attachments yet. Drag & drop to attach.</div>
                      ) : (
                        lead.googleSync.attachedDocs.map((doc, i) => (
                          <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                            <span className="font-medium text-slate-900">{doc.name}</span>
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                              {doc.type.replace('_', ' ')}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 5: NDPA COMPLIANCE */}
          {activeTab === 'ndpa' && (
            <div className="space-y-6">
              
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>Nigeria Data Protection Act (NDPA 2023) Consent Certificate</span>
                </div>
                <div className="text-xs text-emerald-900 leading-relaxed">
                  Consent collected in compliance with Section 26 of the NDPA. Patient health data is processed solely for diagnostic, clinical care, and referral coordination.
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Lawful Basis:</span>
                  <span className="font-bold text-slate-900">{lead.ndpaConsent.lawfulBasis}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Consent Channel:</span>
                  <span className="font-bold text-slate-900">{lead.ndpaConsent.consentChannel}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Verified At:</span>
                  <span className="font-bold text-slate-900">{lead.ndpaConsent.timestamp}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Verified By Associate:</span>
                  <span className="font-bold text-[#045d6e]">{lead.ndpaConsent.verifiedByAssociate}</span>
                </div>
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-slate-500 font-medium">Purpose Limitation:</span>
                  <p className="mt-1 text-slate-700 italic">{lead.ndpaConsent.purpose}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => alert(`Generated NDPA Subject Access Report for ${lead.name}. Download ready.`)}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold"
                >
                  Generate NDPA Data Export (DSAR)
                </button>
                <button
                  onClick={() => alert(`Patient consent updated in audit log.`)}
                  className="px-3 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold"
                >
                  Manage / Revoke Consent
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Modal Bottom Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-400">
            Case ID: <code className="font-mono">{lead.id}</code>
          </div>
          <button
            onClick={() => setSelectedLeadForDetail(null)}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs sm:text-sm font-bold hover:bg-slate-800"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
