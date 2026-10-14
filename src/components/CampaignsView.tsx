import React, { useState } from 'react';
import { 
  Megaphone, 
  TrendingUp, 
  MessageSquare, 
  Calendar, 
  Users, 
  Send,
  Plus, 
  Upload, 
  CheckCircle2, 
  Search, 
  Filter, 
  Sparkles, 
  PhoneCall, 
  ExternalLink,
  Layers,
  Database,
  Building2,
  Check,
  RefreshCw,
  DollarSign,
  Radio
} from 'lucide-react';
import { useCRM } from '../context/CRMContext';
import { CommunicationBar } from './CommunicationBar';
import { HMSPatientContact } from '../types/crm';

export const CampaignsView: React.FC = () => {
  const { 
    campaigns, 
    hmsContacts, 
    toggleHMSContactSelection, 
    selectAllHMSContacts, 
    bulkSMSCampaigns, 
    dispatchBulkSMSCampaign, 
    importHMSContacts,
    currentTenant, 
    formatCurrency, 
    maskPII 
  } = useCRM();

  const [activeSubTab, setActiveSubTab] = useState<'campaigns' | 'bulk_sms' | 'hms_import'>('campaigns');
  
  // HMS Filter & Search State
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [importJsonText, setImportJsonText] = useState<string>('');

  // Bulk SMS composer state
  const [smsTitle, setSmsTitle] = useState('October Executive Cardiac & Health Retainer Reminder');
  const [smsSenderId, setSmsSenderId] = useState(currentTenant.nigeriaBulkSms.senderId);
  const [smsMessage, setSmsMessage] = useState(
    `Good day {{name}}. ${currentTenant.shortName} reminder: Schedule your Q4 Executive Cardiac & Metabolic screen. Fasting from 10 PM. Call ${currentTenant.phone} or reply via WhatsApp.`
  );
  const [dispatchFeedback, setDispatchFeedback] = useState<string | null>(null);

  const selectedCount = hmsContacts.filter(c => c.selectedForCampaign).length;

  const filteredContacts = hmsContacts.filter(c => {
    const matchesDept = departmentFilter === 'all' || c.department.toLowerCase() === departmentFilter.toLowerCase();
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.phone.includes(searchQuery) ||
                          c.diagnosis.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  // Calculate SMS pages & cost
  const charCount = smsMessage.length;
  const pagesPerContact = Math.ceil(charCount / 160) || 1;
  const estimatedCost = selectedCount * pagesPerContact * 3.5; // ₦3.50 per SMS page on Nigeria Bulk SMS

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCount === 0) {
      alert('Please select at least 1 HMS patient contact to dispatch this campaign.');
      return;
    }

    const campaign = dispatchBulkSMSCampaign(smsTitle, smsMessage);
    setDispatchFeedback(`Campaign "${campaign.title}" dispatched to ${campaign.recipientCount} patients via Nigeria Bulk SMS Gateway!`);
    setTimeout(() => setDispatchFeedback(null), 4000);
  };

  const handleParseImport = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsed = JSON.parse(importJsonText);
      if (Array.isArray(parsed)) {
        importHMSContacts(parsed);
        setIsImportModalOpen(false);
        setImportJsonText('');
        alert(`Successfully imported ${parsed.length} contacts from HMS into CRM!`);
      } else {
        alert('Invalid JSON format. Please provide an array of patient contact objects.');
      }
    } catch (e) {
      alert('Error parsing JSON text. Please check format.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-[#045D6E] to-slate-900 rounded-[28px] p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-teal-200 text-xs font-semibold mb-2">
            <Megaphone className="w-3.5 h-3.5" />
            <span>Healthcare Outreach & Growth Marketing</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold">Marketing Campaigns & HMS Bulk SMS</h2>
          <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-2xl leading-relaxed">
            Manage multi-channel health outreach, Nigeria Bulk SMS (NBS) broadcasts, and selective patient targeting imported directly from the Hospital Management System (HMS).
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="p-3 rounded-2xl bg-white/10 border border-white/20 text-xs text-white">
            <div className="text-[10px] uppercase font-bold text-teal-200">NBS Sender ID</div>
            <div className="font-mono font-black text-sm">{currentTenant.nigeriaBulkSms.senderId}</div>
            <div className="text-[10px] text-teal-100">Balance: {formatCurrency(currentTenant.nigeriaBulkSms.balanceNGN)}</div>
          </div>
        </div>
      </div>

      {/* Segmented Sub-Tab Switcher */}
      <div className="flex items-center gap-1 p-1 bg-slate-200/80 rounded-2xl max-w-fit shadow-inner">
        <button
          onClick={() => setActiveSubTab('campaigns')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ios-pressable ${
            activeSubTab === 'campaigns' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 text-[#045D6E]" />
          <span>Campaigns Overview & ROI</span>
          <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-slate-200 font-bold">
            {campaigns.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('bulk_sms')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ios-pressable ${
            activeSubTab === 'bulk_sms' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Radio className="w-3.5 h-3.5 text-blue-600" />
          <span>Nigeria Bulk SMS (NBS)</span>
          <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-slate-200 font-bold">
            {bulkSMSCampaigns.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('hms_import')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ios-pressable ${
            activeSubTab === 'hms_import' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Database className="w-3.5 h-3.5 text-emerald-600" />
          <span>HMS Patient Contact Import</span>
          <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-slate-200 font-bold">
            {hmsContacts.length}
          </span>
        </button>
      </div>

      {/* FEEDBACK TOAST */}
      {dispatchFeedback && (
        <div className="p-4 rounded-2xl bg-emerald-500 text-white font-bold text-xs shadow-lg flex items-center gap-2 animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{dispatchFeedback}</span>
        </div>
      )}

      {/* SUB-VIEW 1: CAMPAIGNS OVERVIEW & ROI */}
      {activeSubTab === 'campaigns' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {campaigns.map((camp) => (
              <div
                key={camp.id}
                className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-[#045d6e] hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-50 text-[#045d6e]">
                      {camp.channel}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                      camp.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {camp.status}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">{camp.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{camp.targetAudience}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Campaign Budget:</span>
                    <span className="font-bold text-slate-900">{formatCurrency(camp.budgetNGN)}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Leads Captured:</span>
                    <span className="font-bold text-blue-600">{camp.leadsGenerated} leads</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 pt-1 border-t border-slate-200">
                    <span>Revenue Converted:</span>
                    <span className="font-bold text-emerald-600 text-sm">{formatCurrency(camp.convertedRevenueNGN)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400">
                    {camp.startDate} to {camp.endDate}
                  </span>
                  <button
                    onClick={() => {
                      setSmsTitle(`Broadcast for ${camp.title}`);
                      setActiveSubTab('bulk_sms');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-teal-50 text-[#045D6E] hover:bg-teal-100 text-xs font-bold flex items-center gap-1.5 ios-pressable"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Launch SMS</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: NIGERIA BULK SMS COMPOSER & HISTORY */}
      {activeSubTab === 'bulk_sms' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* SMS Composer Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-[28px] border border-slate-200/90 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#045D6E] flex items-center justify-center font-bold">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Nigeria Bulk SMS Gateway Composer</h3>
                  <p className="text-[11px] text-slate-500">Fast DND bypass via premium local carrier routes</p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {selectedCount} Selected Recipients
              </span>
            </div>

            <form onSubmit={handleDispatch} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Campaign Title (Internal Reference) *</label>
                <input
                  type="text"
                  required
                  value={smsTitle}
                  onChange={(e) => setSmsTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#045D6E]/30"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Sender ID (Max 11 alphanumeric characters) *</label>
                <input
                  type="text"
                  maxLength={11}
                  required
                  value={smsSenderId}
                  onChange={(e) => setSmsSenderId(e.target.value.toUpperCase())}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono tracking-wider uppercase font-bold"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Registered with Nigerian Communications Commission (NCC).
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-700 font-bold">SMS Message Body *</label>
                  <span className="text-[11px] font-mono text-slate-500">
                    {charCount} chars • {pagesPerContact} {pagesPerContact === 1 ? 'page' : 'pages'} / contact
                  </span>
                </div>
                <textarea
                  rows={4}
                  required
                  value={smsMessage}
                  onChange={(e) => setSmsMessage(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs font-mono leading-relaxed focus:ring-2 focus:ring-[#045D6E]/30"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Tip: Use <strong className="text-slate-700">&#123;&#123;name&#125;&#125;</strong> to dynamically insert each recipient's personal name.
                </span>
              </div>

              {/* Cost & Tariff Estimator */}
              <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80 space-y-2 text-xs text-teal-950">
                <div className="flex justify-between items-center font-bold">
                  <span>Selected HMS Patient Target:</span>
                  <span className="text-slate-900">{selectedCount} Patients</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Estimated Total Delivery Cost (₦3.50/SMS):</span>
                  <strong className="text-slate-900">{formatCurrency(estimatedCost)}</strong>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-teal-200/70">
                  <span>Remaining NBS Prepaid Balance:</span>
                  <strong className="text-emerald-700">{formatCurrency(currentTenant.nigeriaBulkSms.balanceNGN)}</strong>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setActiveSubTab('hms_import')}
                  className="text-xs text-[#045D6E] font-bold hover:underline"
                >
                  &larr; Select Patients from HMS
                </button>

                <button
                  type="submit"
                  disabled={selectedCount === 0}
                  className="px-6 py-2.5 rounded-xl bg-[#045D6E] hover:bg-[#034a58] disabled:opacity-40 text-white font-bold flex items-center gap-2 shadow-md ios-pressable"
                >
                  <Send className="w-4 h-4" />
                  <span>Dispatch via Nigeria Bulk SMS</span>
                </button>
              </div>
            </form>
          </div>

          {/* Past Bulk SMS Dispatches */}
          <div className="lg:col-span-5 space-y-4">
            <h4 className="text-xs font-bold text-slate-700">Recent Bulk SMS Dispatches</h4>
            <div className="space-y-3">
              {bulkSMSCampaigns.map((camp) => (
                <div key={camp.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-slate-400">{camp.senderId}</span>
                      <h5 className="text-xs font-bold text-slate-900">{camp.title}</h5>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800">
                      {camp.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-mono line-clamp-2 bg-slate-50 p-2 rounded-xl">
                    "{camp.message}"
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                    <span>{camp.recipientCount} delivered</span>
                    <strong className="text-slate-800">{formatCurrency(camp.costNGN)}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* SUB-VIEW 3: HMS PATIENT CONTACT IMPORT & SELECTIVE OUTREACH */}
      {activeSubTab === 'hms_import' && (
        <div className="space-y-4">
          
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search patient name, diagnosis, phone..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50/70 text-xs focus:bg-white focus:outline-none"
                />
              </div>

              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="p-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
              >
                <option value="all">All Departments</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Specialist Surgery">Specialist Surgery</option>
                <option value="Endocrinology">Endocrinology</option>
                <option value="Women's Health">Women's Health</option>
                <option value="General Diagnostics">General Diagnostics</option>
              </select>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => selectAllHMSContacts(selectedCount < hmsContacts.length)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                {selectedCount === hmsContacts.length ? 'Deselect All' : 'Select All Patients'}
              </button>

              <button
                onClick={() => setIsImportModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-[#045D6E] hover:bg-[#034a58] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm ios-pressable"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>+ Import from HMS</span>
              </button>
            </div>
          </div>

          {/* HMS Patients Table */}
          <div className="bg-white rounded-[24px] border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/80 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={selectedCount === hmsContacts.length && hmsContacts.length > 0}
                        onChange={(e) => selectAllHMSContacts(e.target.checked)}
                        className="rounded-md text-[#045D6E]"
                      />
                    </th>
                    <th className="p-3.5">Patient Details</th>
                    <th className="p-3.5">Diagnosis & Chronic Condition</th>
                    <th className="p-3.5">Department</th>
                    <th className="p-3.5">HMO / Retainer</th>
                    <th className="p-3.5">Direct Communication</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredContacts.map((contact) => (
                    <tr 
                      key={contact.id} 
                      className={`hover:bg-slate-50/80 transition-colors ${
                        contact.selectedForCampaign ? 'bg-teal-50/30' : ''
                      }`}
                    >
                      <td className="p-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={!!contact.selectedForCampaign}
                          onChange={() => toggleHMSContactSelection(contact.id)}
                          className="rounded-md text-[#045D6E]"
                        />
                      </td>

                      <td className="p-3.5">
                        <div className="font-bold text-slate-900">{maskPII(contact.name, 'name')}</div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {maskPII(contact.phone, 'phone')} • {contact.gender}, Age {contact.age}
                        </div>
                      </td>

                      <td className="p-3.5">
                        <div className="font-semibold text-slate-800">{contact.diagnosis}</div>
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {contact.chronicConditions.map((c, i) => (
                            <span key={i} className="text-[9px] px-1.5 py-0.2 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                              {c}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="p-3.5 font-medium text-slate-700">
                        {contact.department}
                      </td>

                      <td className="p-3.5">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {contact.hmoProvider || 'Private Retainer'}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <CommunicationBar contact={contact} compact={true} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bulk Action Bar at Bottom when patients are selected */}
          {selectedCount > 0 && (
            <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-xs">
                  {selectedCount} HMS Patients selected for selective communication
                </span>
              </div>
              <button
                onClick={() => setActiveSubTab('bulk_sms')}
                className="px-5 py-2 rounded-xl bg-[#045D6E] hover:bg-[#034a58] text-white text-xs font-bold flex items-center gap-2 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Compose Bulk SMS for Selected ({selectedCount})</span>
              </button>
            </div>
          )}

        </div>
      )}

      {/* IMPORT CONTACTS FROM HMS MODAL */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 ios-blur p-4">
          <div className="w-full max-w-lg rounded-[28px] bg-white p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-[#045D6E]" />
                <h3 className="text-base font-bold text-slate-900">Import Contacts from HMS API / JSON</h3>
              </div>
              <button onClick={() => setIsImportModalOpen(false)} className="text-slate-400">✕</button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Paste JSON payload exported from your Hospital Management System (HMS), EMR, or Clinic database.
            </p>

            <form onSubmit={handleParseImport} className="space-y-3">
              <textarea
                rows={6}
                required
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                placeholder='[{"name": "Dr. Chinedu Okoro", "phone": "+2348039912233", "department": "Cardiology", "diagnosis": "Hypertension Stage 2", "chronicConditions": ["Hypertension"]}]'
                className="w-full p-3 rounded-xl border border-slate-300 font-mono text-[11px]"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#045D6E] text-white font-bold text-xs"
                >
                  Parse & Import Contacts
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
