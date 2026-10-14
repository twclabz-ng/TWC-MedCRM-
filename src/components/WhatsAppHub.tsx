import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  ExternalLink, 
  CheckCheck, 
  Check, 
  Plus, 
  Search, 
  Sparkles, 
  FileText, 
  ShieldCheck, 
  Phone, 
  Clock, 
  UserPlus, 
  Paperclip,
  Share2
} from 'lucide-react';
import { useCRM } from '../context/CRMContext';
import { Lead, WhatsAppTemplate } from '../types/crm';

export const WhatsAppHub: React.FC = () => {
  const { 
    filteredLeads, 
    whatsappTemplates, 
    associates, 
    maskPII, 
    addActivity, 
    addLead 
  } = useCRM();

  const [selectedLeadId, setSelectedLeadId] = useState<string>(filteredLeads[0]?.id || '');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(whatsappTemplates[0]?.id || '');
  const [customText, setCustomText] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddContactModalOpen, setIsAddContactModalOpen] = useState<boolean>(false);
  const [newContactName, setNewContactName] = useState<string>('');
  const [newContactPhone, setNewContactPhone] = useState<string>('');
  const [newContactInterest, setNewContactInterest] = useState<string>('Comprehensive Health Checkup');

  // Simulated live message log per lead
  const [messageLogs, setMessageLogs] = useState<{ [leadId: string]: { id: string; text: string; time: string; sender: 'hospital' | 'patient'; status: 'sent' | 'delivered' | 'read' }[] }>({
    'lead_101': [
      { id: 'm1', text: 'Good day Chief Olumide Adeleke. Dr. Chioma Okonjo has reviewed your referral note from Dr. Emeka Eze.', time: 'Yesterday 10:15', sender: 'hospital', status: 'read' },
      { id: 'm2', text: 'Thank you Doctor. What time should I arrive for the cardiac evaluation?', time: 'Yesterday 10:24', sender: 'patient', status: 'read' },
      { id: 'm3', text: 'Please arrive at 8:30 AM at TWC Victoria Island. Please fast from 10 PM tonight for the lipid profile.', time: 'Yesterday 10:30', sender: 'hospital', status: 'read' }
    ],
    'lead_103': [
      { id: 'm4', text: 'Hello Zainab, your TWC Well-Woman Platinum screening report is prepared.', time: 'Today 08:30', sender: 'hospital', status: 'read' },
      { id: 'm5', text: 'Can you please send the link to my email as well?', time: 'Today 08:42', sender: 'patient', status: 'read' }
    ]
  });

  const selectedLead = filteredLeads.find(l => l.id === selectedLeadId) || filteredLeads[0];
  const selectedTemplate = whatsappTemplates.find(t => t.id === selectedTemplateId) || whatsappTemplates[0];

  const searchFilteredLeads = filteredLeads.filter(l => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    l.phone.includes(searchQuery)
  );

  const getCompiledText = () => {
    if (customText) return customText;
    if (!selectedLead) return '';
    let text = selectedTemplate.text;
    text = text.replace(/{{patient_name}}/g, selectedLead.name);
    text = text.replace(/{{contact_person}}/g, selectedLead.contactPerson || selectedLead.name);
    text = text.replace(/{{specialist_name}}/g, 'Dr. Chioma Okonjo (Specialist)');
    text = text.replace(/{{date_time}}/g, 'Thursday at 9:00 AM');
    text = text.replace(/{{lead_id}}/g, selectedLead.id);
    text = text.replace(/{{doctor_name}}/g, selectedLead.referringDoctorName || 'Doctor');
    text = text.replace(/{{clinical_interest}}/g, selectedLead.clinicalInterest);
    text = text.replace(/{{drive_result_link}}/g, 'https://drive.google.com/file/d/twc-secure-result');
    return text;
  };

  const handleSendMessage = () => {
    if (!selectedLead) return;
    const compiled = getCompiledText();
    const cleanPhone = selectedLead.phone.replace(/[^0-9]/g, '');

    // Add to message log
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessageLogs(prev => ({
      ...prev,
      [selectedLead.id]: [
        ...(prev[selectedLead.id] || []),
        { id: `msg_${Date.now()}`, text: compiled, time: nowTime, sender: 'hospital', status: 'delivered' }
      ]
    }));

    // Log sales activity
    addActivity({
      leadId: selectedLead.id,
      leadName: selectedLead.name,
      associateId: selectedLead.associateId,
      associateName: associates.find(a => a.id === selectedLead.associateId)?.name || 'Care Desk',
      type: 'whatsapp_message',
      outcome: 'Follow-up Needed',
      durationMinutes: 5,
      notes: `Sent Wati WhatsApp message: "${compiled.substring(0, 70)}..."`,
    });

    // Real trigger to launch WhatsApp app or WhatsApp Web
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(compiled)}`, '_blank');
    setCustomText('');
  };

  const handleAddNewContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName || !newContactPhone) return;

    const newLead = addLead({
      type: 'patient',
      name: newContactName,
      phone: newContactPhone,
      email: `${newContactName.toLowerCase().replace(/\s+/g, '.')}@patient.ng`,
      location: 'Lagos, Nigeria',
      associateId: associates[0].id,
      stage: 'inquiry',
      expectedValueNGN: 250000,
      probabilityPercent: 50,
      clinicalInterest: newContactInterest,
      referralSource: 'WhatsApp Inbound',
      tags: ['WhatsApp Direct', 'Wati Lead'],
      ndpaConsent: {
        consented: true,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        lawfulBasis: 'Explicit Patient Consent',
        purpose: 'Direct WhatsApp medical inquiry triage and appointment scheduling.',
        consentChannel: 'WhatsApp Verification',
        verifiedByAssociate: associates[0].name,
      }
    });

    setSelectedLeadId(newLead.id);
    setIsAddContactModalOpen(false);
    setNewContactName('');
    setNewContactPhone('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner: Wati Integration Overview */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 border border-emerald-500/30 text-xs font-semibold text-emerald-200 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Wati WhatsApp Business API for Healthcare
          </div>
          <h2 className="text-xl sm:text-2xl font-bold">Omnichannel Patient WhatsApp Hub</h2>
          <p className="text-xs sm:text-sm text-emerald-100/80 mt-1 max-w-xl">
            Automate appointment prep, deliver encrypted diagnostic reports, and capture NDPA consent with verified WhatsApp message templates.
          </p>
        </div>

        {/* Action Button: Functional "Add WhatsApp" */}
        <button
          onClick={() => setIsAddContactModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-white text-emerald-900 hover:bg-emerald-50 text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95 flex items-center gap-2 shrink-0"
        >
          <UserPlus className="w-4 h-4 text-emerald-600" />
          <span>+ Add WhatsApp Patient / Lead</span>
        </button>
      </div>

      {/* Main Two-Column Wati Chat & Console Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden min-h-[620px]">
        
        {/* Left Column: Contact List (4 Cols) */}
        <div className="lg:col-span-4 border-r border-slate-200 flex flex-col bg-slate-50/50">
          
          <div className="p-3 border-b border-slate-200/80 bg-white">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search patient or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-100/90 border border-slate-200/70 rounded-full text-xs focus:outline-none focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {searchFilteredLeads.map((lead) => {
              const isSelected = lead.id === selectedLead?.id;
              const logs = messageLogs[lead.id];
              const lastMsg = logs ? logs[logs.length - 1]?.text : lead.clinicalInterest;

              return (
                <button
                  key={lead.id}
                  onClick={() => {
                    setSelectedLeadId(lead.id);
                    setCustomText('');
                  }}
                  className={`w-full text-left p-3.5 transition-all flex items-start gap-3 ${
                    isSelected ? 'bg-emerald-50/80 border-l-4 border-emerald-600' : 'hover:bg-slate-100/60'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                    isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {lead.name.substring(0, 2).toUpperCase()}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {maskPII(lead.name, 'name')}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {lead.phone.slice(-4)}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {lastMsg}
                    </p>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] px-1.5 py-0.2 rounded-full font-semibold bg-slate-100 text-slate-600 capitalize">
                        {lead.stage.replace('_', ' ')}
                      </span>
                      <span className="text-[9px] text-emerald-700 font-semibold flex items-center gap-0.5">
                        <CheckCheck className="w-3 h-3 text-emerald-600" />
                        NDPA Opt-in
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-3 border-t border-slate-200 bg-white">
            <button
              onClick={() => setIsAddContactModalOpen(true)}
              className="w-full py-2 rounded-xl border border-dashed border-emerald-400 text-emerald-700 hover:bg-emerald-50 text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New WhatsApp Number</span>
            </button>
          </div>

        </div>

        {/* Right Column: Chat Console, Template Picker & wa.me Launcher (8 Cols) */}
        {selectedLead ? (
          <div className="lg:col-span-8 flex flex-col bg-white">
            
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                  {selectedLead.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span>{maskPII(selectedLead.name, 'name')}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                      Verified
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">
                    {maskPII(selectedLead.phone, 'phone')} • {selectedLead.location}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 flex items-center gap-1.5 shadow-2xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open wa.me</span>
                </a>
              </div>
            </div>

            {/* Conversation Timeline Stream */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3 bg-[#e5ddd5]/20 min-h-[260px] max-h-[340px]">
              <div className="text-center my-2">
                <span className="text-[10px] font-semibold bg-white/80 border border-slate-200 px-3 py-1 rounded-full text-slate-500 shadow-2xs">
                  End-to-End Encrypted & NDPA 2023 Compliant Chat Thread
                </span>
              </div>

              {(messageLogs[selectedLead.id] || []).map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'hospital' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-md p-3.5 rounded-2xl text-xs sm:text-sm shadow-2xs leading-relaxed ${
                    msg.sender === 'hospital'
                      ? 'bg-[#d9fdd3] text-slate-900 rounded-tr-xs'
                      : 'bg-white text-slate-900 rounded-tl-xs border border-slate-200'
                  }`}>
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-slate-500">
                      <span>{msg.time}</span>
                      {msg.sender === 'hospital' && <CheckCheck className="w-3 h-3 text-emerald-600" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Template Selector Bar */}
            <div className="p-3 bg-slate-50 border-t border-slate-200">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center justify-between">
                <span>Select Healthcare Pre-Approved Template:</span>
                <span className="text-emerald-700 font-semibold">Wati Certified</span>
              </div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {whatsappTemplates.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => {
                      setSelectedTemplateId(tmpl.id);
                      setCustomText('');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap font-semibold border transition-all ${
                      selectedTemplateId === tmpl.id
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {tmpl.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Composer & Send Controller */}
            <div className="p-4 border-t border-slate-200 bg-white space-y-3">
              <div className="relative">
                <textarea
                  rows={3}
                  value={getCompiledText()}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Type a message or edit the template variables..."
                  className="w-full p-3 rounded-2xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 font-sans"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-[11px] text-slate-400">
                  Recipient: <strong className="text-slate-700">{selectedLead.phone}</strong>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSendMessage}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message & Launch WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="lg:col-span-8 flex items-center justify-center p-12 text-slate-400 text-sm">
            No contact selected. Choose a patient or add a new WhatsApp number.
          </div>
        )}

      </div>

      {/* Add WhatsApp Contact Modal */}
      {isAddContactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 ios-blur p-0 sm:p-4 overflow-y-auto">
          <form 
            onSubmit={handleAddNewContact}
            className="w-full max-w-md rounded-t-[32px] sm:rounded-[32px] bg-white p-6 shadow-2xl border border-slate-200/80 animate-in slide-in-from-bottom sm:zoom-in-95 duration-250 space-y-4 my-0 sm:my-auto"
          >
            {/* iOS Pull-down Grabber (Mobile) */}
            <div className="w-10 h-1.5 rounded-full bg-slate-300 mx-auto -mt-2 mb-2 sm:hidden" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-[12px] bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">Add WhatsApp Contact</h3>
              </div>
              <button 
                type="button"
                onClick={() => setIsAddContactModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center ios-pressable"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Patient or Company Name</label>
              <input
                type="text"
                required
                value={newContactName}
                onChange={(e) => setNewContactName(e.target.value)}
                placeholder="e.g. Dr. Ngozi Okon / Dangote Sugar Ref."
                className="w-full p-2.5 text-xs rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp Phone Number</label>
              <input
                type="text"
                required
                value={newContactPhone}
                onChange={(e) => setNewContactPhone(e.target.value)}
                placeholder="+234 803 123 4567"
                className="w-full p-2.5 text-xs rounded-xl border border-slate-300"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Format: +234 with Nigerian dial code</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Clinical Interest / Retainer</label>
              <input
                type="text"
                value={newContactInterest}
                onChange={(e) => setNewContactInterest(e.target.value)}
                placeholder="Executive Wellness 360, Cardiac Screening..."
                className="w-full p-2.5 text-xs rounded-xl border border-slate-300"
              />
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>NDPA explicit consent prompt will be recorded with timestamp for lawful clinical processing.</span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddContactModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
              >
                Add & Open Thread
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
