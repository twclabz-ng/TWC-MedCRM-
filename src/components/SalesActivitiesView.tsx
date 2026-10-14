import React, { useState } from 'react';
import { 
  PhoneCall, 
  MessageSquare, 
  Building2, 
  UserCheck, 
  Calendar, 
  Clock, 
  Plus, 
  Filter, 
  Search, 
  CheckCircle2, 
  Users 
} from 'lucide-react';
import { useCRM } from '../context/CRMContext';
import { ActivityType, ActivityOutcome, SalesActivity } from '../types/crm';

export const SalesActivitiesView: React.FC = () => {
  const { 
    filteredActivities, 
    addActivity, 
    associates, 
    leads, 
    maskPII, 
    selectedAssociateId, 
    activeAssociate 
  } = useCRM();

  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState(leads[0]?.id || '');
  const [actType, setActType] = useState<ActivityType>('phone_call');
  const [actDirection, setActDirection] = useState<'outbound' | 'inbound'>('outbound');
  const [actOutcome, setActOutcome] = useState<ActivityOutcome>('Follow-up Needed');
  const [actDuration, setActDuration] = useState(15);
  const [actNotes, setActNotes] = useState('');
  const [followUpDate, setFollowUpDate] = useState('2026-10-18');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSaveActivity = (e: React.FormEvent) => {
    e.preventDefault();
    const targetLead = leads.find(l => l.id === selectedLeadId) || leads[0];
    const targetAssoc = activeAssociate || associates[0];

    addActivity({
      leadId: targetLead.id,
      leadName: targetLead.name,
      associateId: targetAssoc.id,
      associateName: targetAssoc.name,
      type: actType,
      direction: actDirection,
      channel: actType === 'phone_call' ? 'phone' : actType === 'whatsapp_message' ? 'whatsapp' : undefined,
      outcome: actOutcome,
      durationMinutes: Number(actDuration),
      notes: `[${actDirection.toUpperCase()}] ${actNotes}`,
      nextFollowUpDate: followUpDate,
    });

    setActNotes('');
    setIsLogModalOpen(false);
  };

  const displayedActivities = filteredActivities.filter(act => {
    const matchesType = filterType === 'all' || act.type === filterType;
    const matchesSearch = act.leadName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          act.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          act.associateName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Hospital Sales & Detailing Activities</h2>
          <p className="text-xs text-slate-500">
            Log patient phone inquiries, corporate retainership pitches, and specialist doctor detailing sessions.
          </p>
        </div>

        <button
          onClick={() => setIsLogModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-[#045d6e] hover:bg-[#034a58] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Log Activity</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search notes, associates, or cases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar">
          <span className="text-xs font-semibold text-slate-500 shrink-0">Type:</span>
          {['all', 'phone_call', 'whatsapp_message', 'clinic_tour', 'corporate_meeting', 'doctor_detailing'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                filterType === t 
                  ? 'bg-slate-900 text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t === 'all' ? 'All Types' : t.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Activities Timeline / Cards List */}
      <div className="space-y-3">
        {displayedActivities.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
            No activities matching the current filter or associate view.
          </div>
        ) : (
          displayedActivities.map((act) => (
            <div
              key={act.id}
              className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#045d6e] hover:shadow-sm transition-all space-y-2.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#045d6e] flex items-center justify-center font-bold shrink-0">
                    {act.type === 'phone_call' && <PhoneCall className="w-4 h-4" />}
                    {act.type === 'whatsapp_message' && <MessageSquare className="w-4 h-4" />}
                    {act.type === 'corporate_meeting' && <Building2 className="w-4 h-4" />}
                    {act.type === 'doctor_detailing' && <UserCheck className="w-4 h-4" />}
                    {act.type === 'clinic_tour' && <Users className="w-4 h-4" />}
                    {act.type === 'followup' && <Clock className="w-4 h-4" />}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <span className="text-xs font-bold text-slate-900">
                        {act.type.replace('_', ' ').toUpperCase()}
                      </span>
                      {act.direction && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          act.direction === 'inbound' 
                            ? 'bg-blue-50 text-blue-800 border border-blue-200' 
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        }`}>
                          {act.direction === 'inbound' ? '↓ Inbound' : '↑ Outbound'}
                        </span>
                      )}
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {act.outcome}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {act.durationMinutes} mins
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Case: <strong className="text-slate-900">{maskPII(act.leadName, 'name')}</strong> • Associate: <span className="text-[#045d6e] font-semibold">{act.associateName}</span>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-400 font-mono">
                  {act.timestamp}
                </div>
              </div>

              <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                {act.notes}
              </p>

              {act.nextFollowUpDate && (
                <div className="flex items-center gap-2 text-[11px] text-teal-800 font-semibold">
                  <Calendar className="w-3.5 h-3.5 text-teal-600" />
                  <span>Scheduled Follow-Up: {act.nextFollowUpDate}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Log Activity Modal */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <form
            onSubmit={handleSaveActivity}
            className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Log Healthcare Sales Activity</h3>
              <button 
                type="button" 
                onClick={() => setIsLogModalOpen(false)} 
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Select Patient or Corporate Account</label>
              <select
                value={selectedLeadId}
                onChange={(e) => setSelectedLeadId(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white"
              >
                {leads.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name} ({l.type === 'patient' ? 'Patient' : 'Corporate'}) - {l.clinicalInterest}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Communication Direction</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActDirection('outbound')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                    actDirection === 'outbound'
                      ? 'bg-[#045D6E] text-white border-[#045D6E] shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  ↑ Outbound (Initiated by Hospital)
                </button>
                <button
                  type="button"
                  onClick={() => setActDirection('inbound')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                    actDirection === 'inbound'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  ↓ Inbound (Patient / Doctor Contacted Us)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Interaction Channel / Type</label>
                <select
                  value={actType}
                  onChange={(e) => setActType(e.target.value as ActivityType)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white"
                >
                  <option value="phone_call">Phone Call (Dialer)</option>
                  <option value="whatsapp_message">WhatsApp Message</option>
                  <option value="clinic_tour">Clinic Tour / Reception Intake</option>
                  <option value="corporate_meeting">Corporate HR Pitch</option>
                  <option value="doctor_detailing">Specialist Doctor Detailing</option>
                  <option value="followup">Post-Lab Follow-up Review</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Outcome</label>
                <select
                  value={actOutcome}
                  onChange={(e) => setActOutcome(e.target.value as ActivityOutcome)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white"
                >
                  <option value="Scheduled Consultation">Scheduled Consultation</option>
                  <option value="Diagnostic Booked">Diagnostic Booked</option>
                  <option value="Sent Retainer MOU">Sent Retainer MOU</option>
                  <option value="Follow-up Needed">Follow-up Needed</option>
                  <option value="Objection - HMO Delay">Objection - HMO Delay</option>
                  <option value="Objection - Budget">Objection - Budget</option>
                  <option value="Closed Won">Closed Won</option>
                  <option value="Unresponsive">Unresponsive</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Duration (Minutes)</label>
                <input
                  type="number"
                  value={actDuration}
                  onChange={(e) => setActDuration(Number(e.target.value))}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Next Follow-Up Date</label>
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Notes & Discussion Details</label>
              <textarea
                rows={3}
                required
                value={actNotes}
                onChange={(e) => setActNotes(e.target.value)}
                placeholder="Key clinical requirements, corporate retainer budget discussion, or doctor feedback..."
                className="w-full p-2.5 text-xs rounded-xl border border-slate-300"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsLogModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#045d6e] hover:bg-[#034a58] text-white font-bold text-xs"
              >
                Save Activity
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
