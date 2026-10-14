import React, { useState } from 'react';
import { 
  PhoneCall, 
  MessageSquare, 
  MessageCircle, 
  Mail, 
  PhoneIncoming, 
  CheckCircle2, 
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useCRM } from '../context/CRMContext';
import { Lead, HMSPatientContact, CommunicationChannel, ActivityOutcome } from '../types/crm';

interface CommunicationBarProps {
  contact: Lead | HMSPatientContact;
  compact?: boolean;
  onLogged?: () => void;
}

export const CommunicationBar: React.FC<CommunicationBarProps> = ({ 
  contact, 
  compact = false, 
  onLogged 
}) => {
  const { triggerCommunication, logCommunication } = useCRM();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showInboundModal, setShowInboundModal] = useState<boolean>(false);
  const [inboundChannel, setInboundChannel] = useState<CommunicationChannel>('phone');
  const [inboundNotes, setInboundNotes] = useState<string>('');
  const [inboundOutcome, setInboundOutcome] = useState<ActivityOutcome>('Follow-up Needed');

  const handleOutbound = (channel: CommunicationChannel, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    triggerCommunication(contact, channel);
    const label = channel === 'phone' ? 'Dialing Phone...' : channel === 'sms' ? 'Opening SMS...' : channel === 'whatsapp' ? 'Opening WhatsApp...' : 'Opening Mail...';
    setFeedback(`${label} (Logged to Timeline)`);
    setTimeout(() => setFeedback(null), 3000);
    if (onLogged) onLogged();
  };

  const handleLogInbound = (e: React.FormEvent) => {
    e.preventDefault();
    logCommunication(
      contact.id,
      contact.name,
      inboundChannel,
      'inbound',
      inboundOutcome,
      inboundNotes || `Inbound ${inboundChannel} received from patient/client regarding care query.`
    );
    setShowInboundModal(false);
    setInboundNotes('');
    setFeedback(`Inbound ${inboundChannel.toUpperCase()} successfully logged!`);
    setTimeout(() => setFeedback(null), 3000);
    if (onLogged) onLogged();
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
        {/* Native Dialer */}
        <button
          onClick={(e) => handleOutbound('phone', e)}
          className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 flex items-center justify-center ios-pressable transition-all shadow-2xs"
          title={`Call ${contact.name} via built-in phone dialer (Auto-logs)`}
        >
          <PhoneCall className="w-3.5 h-3.5" />
        </button>

        {/* Native SMS */}
        <button
          onClick={(e) => handleOutbound('sms', e)}
          className="w-7 h-7 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center justify-center ios-pressable transition-all shadow-2xs"
          title={`Send SMS to ${contact.name} via phone messaging (Auto-logs)`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
        </button>

        {/* WhatsApp */}
        <button
          onClick={(e) => handleOutbound('whatsapp', e)}
          className="w-7 h-7 rounded-full bg-teal-50 text-teal-800 hover:bg-teal-100 flex items-center justify-center ios-pressable transition-all shadow-2xs"
          title={`Message ${contact.name} on WhatsApp (Auto-logs)`}
        >
          <MessageCircle className="w-3.5 h-3.5" />
        </button>

        {/* Email */}
        {contact.email && (
          <button
            onClick={(e) => handleOutbound('email', e)}
            className="w-7 h-7 rounded-full bg-purple-50 text-purple-700 hover:bg-purple-100 flex items-center justify-center ios-pressable transition-all shadow-2xs"
            title={`Email ${contact.name} via native mail client (Auto-logs)`}
          >
            <Mail className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
      {feedback && (
        <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold flex items-center gap-1.5 animate-in fade-in">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        {/* Built-in Dialer Button */}
        <button
          onClick={(e) => handleOutbound('phone', e)}
          className="flex-1 min-w-[70px] py-2 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm ios-pressable transition-all"
          title="Opens your device's built-in phone app and dials immediately"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Call</span>
        </button>

        {/* Native SMS Button */}
        <button
          onClick={(e) => handleOutbound('sms', e)}
          className="flex-1 min-w-[70px] py-2 px-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm ios-pressable transition-all"
          title="Opens your device's native SMS Messages app with pre-filled prompt"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>SMS</span>
        </button>

        {/* WhatsApp Button */}
        <button
          onClick={(e) => handleOutbound('whatsapp', e)}
          className="flex-1 min-w-[80px] py-2 px-2.5 rounded-xl bg-[#045D6E] hover:bg-[#034a58] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm ios-pressable transition-all"
          title="Launches WhatsApp intent with patient pre-fill"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>WhatsApp</span>
        </button>

        {/* Native Email Button */}
        <button
          onClick={(e) => handleOutbound('email', e)}
          className="flex-1 min-w-[70px] py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm ios-pressable transition-all"
          title="Opens your native Email client"
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Email</span>
        </button>

        {/* Log Inbound Interaction */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowInboundModal(true);
          }}
          className="py-2 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1 border border-slate-200 ios-pressable transition-all"
          title="Record an incoming phone call, SMS or WhatsApp received from this patient"
        >
          <PhoneIncoming className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden sm:inline">Inbound</span>
        </button>
      </div>

      {/* Inbound Interaction Logger Modal */}
      {showInboundModal && (
        <div 
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 ios-blur p-0 sm:p-4 overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <form
            onSubmit={handleLogInbound}
            className="w-full max-w-md rounded-t-[32px] sm:rounded-[28px] bg-white p-6 shadow-2xl border border-slate-200 space-y-4 my-0 sm:my-auto animate-in slide-in-from-bottom sm:zoom-in-95 duration-200 text-xs"
          >
            <div className="w-10 h-1.5 rounded-full bg-slate-300 mx-auto -mt-2 mb-2 sm:hidden" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                  <PhoneIncoming className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Record Inbound Communication</h4>
                  <p className="text-[11px] text-slate-500">From: {contact.name} ({contact.phone})</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setShowInboundModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Inbound Channel</label>
                <select
                  value={inboundChannel}
                  onChange={(e) => setInboundChannel(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="phone">Incoming Phone Call</option>
                  <option value="whatsapp">Incoming WhatsApp</option>
                  <option value="sms">Incoming SMS</option>
                  <option value="email">Incoming Email</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Call / Message Outcome</label>
                <select
                  value={inboundOutcome}
                  onChange={(e) => setInboundOutcome(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="Scheduled Consultation">Scheduled Consultation</option>
                  <option value="Diagnostic Booked">Diagnostic Booked</option>
                  <option value="Follow-up Needed">Follow-up Needed</option>
                  <option value="Objection - HMO Delay">Objection - HMO Delay</option>
                  <option value="Sent Retainer MOU">Sent Retainer MOU</option>
                  <option value="Closed Won">Closed Won</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Patient Discussion Notes</label>
              <textarea
                rows={3}
                required
                value={inboundNotes}
                onChange={(e) => setInboundNotes(e.target.value)}
                placeholder="What did the patient or corporate client request during this interaction?"
                className="w-full p-2.5 rounded-xl border border-slate-300"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowInboundModal(false)}
                className="px-4 py-2 rounded-xl text-slate-600 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#045D6E] text-white font-bold"
              >
                Save to CRM Timeline
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
