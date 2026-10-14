import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Users, 
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
  RefreshCw
} from 'lucide-react';
import { useCRM } from '../context/CRMContext';
import { CommunicationBar } from './CommunicationBar';
import { HMSPatientContact } from '../types/crm';

export const BulkSMSAndHMSView: React.FC = () => {
  const { 
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

  const [activeSubTab, setActiveSubTab] = useState<'hms_contacts' | 'bulk_sms_composer' | 'campaign_history'>('hms_contacts');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [importJsonText, setImportJsonText] = useState<string>('');

  // Bulk SMS composer state
  const [smsTitle, setSmsTitle] = useState('October Cardiac & Health Retainer Reminder');
  const [smsSenderId, setSmsSenderId] = useState(currentTenant.nigeriaBulkSms.senderId);
  const [smsMessage, setSmsMessage] = useState(
    `Good day {{name}}. TWC Labs reminder: Schedule your Q4 Executive Cardiac & Metabolic screen. Fasting from 10 PM. Call ${currentTenant.phone} or reply via WhatsApp.`
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
    setActiveSubTab('campaign_history');
  };

  const handleParseImport = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsed = JSON.parse(importJsonText);
      if (Array.isArray(parsed)) {
        importHMSContacts(parsed);
        setIsImportModalOpen(false);
        setImportJsonText('');
        alert(`Successfully imported ${parsed.length} contacts from HMS into TWC CRM!`);
      } else {
        alert('Invalid JSON format. Please provide an array of patient contact objects.');
      }
    } catch (e) {
      alert('Error parsing JSON text. Please check format.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner: Nigeria Bulk SMS & HMS Integration */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-[#045D6E] rounded-[28px] p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-teal-200 text-xs font-semibold mb-2">
            <Database className="w-3.5 h-3.5 text-blue-300" />
            HMS Contact Importer & Nigeria Bulk SMS Gateway
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">HMS Selective Outreach & Bulk SMS</h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Import clinical rosters from Hospital Management Systems (Helium Health, Meditech, Instanta), filter cohorts by diagnosis, and execute targeted campaigns with DND-compliant Nigerian SMS.
          </p>
        </div>

        {/* Balance & Quick Actions */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-2xl text-right">
            <div className="text-[10px] uppercase tracking-wider text-teal-200 font-bold">Nigeria Bulk SMS Balance</div>
            <div className="text-base sm:text-lg font-black text-white">{formatCurrency(currentTenant.nigeriaBulkSms.balanceNGN)}</div>
            <div className="text-[10px] text-emerald-300 font-semibold">Sender ID: {currentTenant.nigeriaBulkSms.senderId}</div>
          </div>

          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-4 py-2.5 rounded-full bg-white text-slate-900 hover:bg-slate-100 text-xs sm:text-sm font-bold shadow-md ios-pressable flex items-center gap-2"
          >
            <Upload className="w-4 h-4 text-blue-600" />
            <span>+ Import from HMS</span>
          </button>
        </div>
      </div>

      {dispatchFeedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{dispatchFeedback}</span>
        </div>
      )}

      {/* Sub-Tab Navigation */}
      <div className="flex items-center gap-2 bg-slate-200/80 p-1 rounded-full max-w-md">
        <button
          onClick={() => setActiveSubTab('hms_contacts')}
          className={`flex-1 py-1.5 px-3 rounded-full text-xs font-bold transition-all ios-pressable flex items-center justify-center gap-1.5 ${
            activeSubTab === 'hms_contacts' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-blue-600" />
          <span>HMS Contacts ({hmsContacts.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('bulk_sms_composer')}
          className={`flex-1 py-1.5 px-3 rounded-full text-xs font-bold transition-all ios-pressable flex items-center justify-center gap-1.5 ${
            activeSubTab === 'bulk_sms_composer' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Send className="w-3.5 h-3.5 text-[#045D6E]" />
          <span>Dispatch ({selectedCount})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('campaign_history')}
          className={`flex-1 py-1.5 px-3 rounded-full text-xs font-bold transition-all ios-pressable flex items-center justify-center gap-1.5 ${
            activeSubTab === 'campaign_history' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-purple-600" />
          <span>Sent Logs ({bulkSMSCampaigns.length})</span>
        </button>
      </div>

      {/* TAB 1: HMS CONTACTS & SELECTIVE CAMPAIGN TARGETING */}
      {activeSubTab === 'hms_contacts' && (
        <div className="space-y-4">
          
          {/* Controls: Search, Filter, Select All */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search name, phone, or condition..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-full bg-slate-100 border border-slate-200 focus:outline-none focus:bg-white"
                />
              </div>

              {/* Department Filter */}
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="p-1.5 px-3 text-xs rounded-full border border-slate-300 bg-white font-semibold text-slate-700"
              >
                <option value="all">All Departments</option>
                <option value="cardiology">Cardiology</option>
                <option value="executive wellness">Executive Wellness</option>
                <option value="endocrinology">Endocrinology</option>
                <option value="obstetrics & gynaecology">Obstetrics & Gynae</option>
                <option value="general diagnostics">General Diagnostics</option>
              </select>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <span className="text-xs font-bold text-slate-700">
                {selectedCount} of {hmsContacts.length} Selected
              </span>

              <button
                onClick={() => selectAllHMSContacts(true)}
                className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold ios-pressable"
              >
                Select All
              </button>
              <button
                onClick={() => selectAllHMSContacts(false)}
                className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold ios-pressable"
              >
                Clear
              </button>
              
              {selectedCount > 0 && (
                <button
                  onClick={() => setActiveSubTab('bulk_sms_composer')}
                  className="px-4 py-1 rounded-full bg-[#045D6E] text-white text-xs font-bold hover:bg-[#034a58] ios-pressable flex items-center gap-1 shadow-xs"
                >
                  <Send className="w-3 h-3" />
                  <span>Send Campaign &rarr;</span>
                </button>
              )}
            </div>
          </div>

          {/* HMS Patients Inset Grouped Table */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 text-[10px] font-bold uppercase">
                  <tr>
                    <th className="p-3.5 text-center w-10">Select</th>
                    <th className="p-3.5">Patient Details</th>
                    <th className="p-3.5">HMS MRN ID</th>
                    <th className="p-3.5">Department</th>
                    <th className="p-3.5">Clinical Condition</th>
                    <th className="p-3.5">HMO Tier</th>
                    <th className="p-3.5 text-right">Direct Dialer & Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredContacts.map((contact) => (
                    <tr 
                      key={contact.id} 
                      className={`hover:bg-teal-50/40 transition-colors ${
                        contact.selectedForCampaign ? 'bg-blue-50/30' : ''
                      }`}
                    >
                      <td className="p-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={!!contact.selectedForCampaign}
                          onChange={() => toggleHMSContactSelection(contact.id)}
                          className="h-4 w-4 rounded border-slate-300 text-[#045D6E] focus:ring-[#045D6E] cursor-pointer"
                        />
                      </td>

                      <td className="p-3.5 font-bold text-slate-900">
                        <div>{maskPII(contact.name, 'name')}</div>
                        <div className="text-[11px] text-slate-400 font-mono font-normal">
                          {maskPII(contact.phone, 'phone')} • {contact.age}y/o ({contact.gender})
                        </div>
                      </td>

                      <td className="p-3.5 font-mono text-[11px] text-slate-500 font-semibold">
                        {contact.hmsPatientId}
                      </td>

                      <td className="p-3.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                          {contact.department}
                        </span>
                      </td>

                      <td className="p-3.5 font-medium text-slate-700 max-w-xs truncate">
                        {contact.diagnosis}
                      </td>

                      <td className="p-3.5 text-[11px] font-semibold text-slate-600">
                        {contact.hmoProvider || 'Private Retainer'}
                      </td>

                      <td className="p-3.5 text-right">
                        {/* Compact Built-in Dialer, SMS, WhatsApp & Email Bar */}
                        <div className="flex justify-end">
                          <CommunicationBar contact={contact} compact={true} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: BULK SMS COMPOSER & RECIPIENT TARGETING */}
      {activeSubTab === 'bulk_sms_composer' && (
        <div className="bg-white p-6 sm:p-8 rounded-[28px] border border-slate-200/80 shadow-xs max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Nigeria Bulk SMS Campaign Composer</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Targeting <strong className="text-blue-600">{selectedCount} Selected Patients</strong> from HMS roster
              </p>
            </div>
            <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200">
              Sender ID: {smsSenderId}
            </span>
          </div>

          <form onSubmit={handleDispatch} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Campaign Campaign Identifier</label>
              <input
                type="text"
                required
                value={smsTitle}
                onChange={(e) => setSmsTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-slate-700 font-semibold">SMS Message Body (DND Bypass Enabled)</label>
                <span className="text-[11px] font-mono text-slate-500">
                  {charCount} chars • {pagesPerContact} page(s) per recipient
                </span>
              </div>
              <textarea
                rows={4}
                required
                value={smsMessage}
                onChange={(e) => setSmsMessage(e.target.value)}
                className="w-full p-3 rounded-2xl border border-slate-300 font-mono text-xs leading-relaxed focus:outline-none focus:border-[#045D6E]"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Available tags: <code className="text-[#045D6E] font-bold">&#123;&#123;name&#125;&#125;</code> (auto-replaces with patient's name).
              </span>
            </div>

            {/* Cost & Dispatch Summary Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Selected HMS Recipients:</span>
                <strong className="text-slate-900">{selectedCount} Patients</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Nigeria Bulk SMS Rate:</span>
                <span>₦3.50 per SMS page</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Total Calculated Campaign Cost:</span>
                <strong className="text-emerald-700 text-sm">{formatCurrency(estimatedCost)}</strong>
              </div>
              <div className="flex justify-between text-slate-600 pt-1 border-t border-slate-200">
                <span>Remaining Account Balance:</span>
                <span className="font-semibold">{formatCurrency(currentTenant.nigeriaBulkSms.balanceNGN - estimatedCost)}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveSubTab('hms_contacts')}
                className="px-4 py-2 rounded-xl text-slate-600 font-semibold"
              >
                Modify Selected Patients
              </button>
              <button
                type="submit"
                disabled={selectedCount === 0}
                className="px-6 py-2.5 rounded-full bg-[#045D6E] hover:bg-[#034a58] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md ios-pressable disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>Dispatch Campaign to {selectedCount} Recipients Now</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: CAMPAIGN HISTORY & DELIVERY LOGS */}
      {activeSubTab === 'campaign_history' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bulkSMSCampaigns.map((camp) => (
              <div key={camp.id} className="p-6 rounded-[28px] bg-white border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                      {camp.senderId}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">{camp.title}</h4>
                    <p className="text-[11px] text-slate-500">Dispatched: {camp.sentAt || 'Queued'}</p>
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    camp.status === 'sent' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {camp.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed font-mono">
                  {camp.message}
                </p>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                  <span className="text-slate-500">{camp.recipientCount} Recipients • {formatCurrency(camp.costNGN)}</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {camp.deliveryRatePercent}% Delivered
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: IMPORT HMS CONTACTS VIA JSON / CSV */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 ios-blur p-0 sm:p-4 overflow-y-auto">
          <form
            onSubmit={handleParseImport}
            className="w-full max-w-lg rounded-t-[32px] sm:rounded-[32px] bg-white p-6 shadow-2xl border border-slate-200 space-y-4 my-0 sm:my-auto text-xs"
          >
            <div className="w-10 h-1.5 rounded-full bg-slate-300 mx-auto -mt-2 mb-2 sm:hidden" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Upload className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Import Contacts from HMS System</h3>
              </div>
              <button type="button" onClick={() => setIsImportModalOpen(false)} className="text-slate-400">✕</button>
            </div>

            <p className="text-slate-600 leading-relaxed">
              Paste patient export JSON from your Hospital Management System (Helium Health, Meditech, Instanta or custom EHR) below:
            </p>

            <textarea
              rows={8}
              required
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder={`[
  {
    "hmsPatientId": "HMS-P-2026-9901",
    "name": "Dr. Chinedu Eze",
    "phone": "+234 803 123 9988",
    "email": "chinedu@hospital.ng",
    "age": 45,
    "gender": "Male",
    "bloodGroup": "O+",
    "department": "Cardiology",
    "diagnosis": "Cardiovascular Check",
    "chronicConditions": ["Hypertension"],
    "hmoProvider": "Hygeia HMO",
    "lastVisitDate": "2026-10-10"
  }
]`}
              className="w-full p-3 rounded-2xl border border-slate-300 font-mono text-[11px] leading-relaxed focus:outline-none focus:border-[#045D6E]"
            />

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setImportJsonText(JSON.stringify([
                  {
                    hmsPatientId: `HMS-P-${Date.now().toString().slice(-4)}`,
                    name: 'Senator Ikechukwu Obasanjo',
                    phone: '+234 803 992 8844',
                    email: 'senator.ikechukwu@nat-assembly.ng',
                    age: 59,
                    gender: 'Male',
                    bloodGroup: 'B+',
                    department: 'Executive Wellness',
                    diagnosis: 'Comprehensive Executive Health Panel 360',
                    chronicConditions: ['Borderline Glucose'],
                    hmoProvider: 'AXA Mansard VIP',
                    lastVisitDate: '2026-10-12',
                    selectedForCampaign: true
                  }
                ], null, 2))}
                className="text-[#045D6E] font-bold text-[11px] hover:underline"
              >
                + Insert Sample HMS Record
              </button>

              <div className="flex gap-2">
                <button type="button" onClick={() => setIsImportModalOpen(false)} className="px-4 py-2 rounded-xl text-slate-600 font-semibold">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold">Import Records</button>
              </div>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
