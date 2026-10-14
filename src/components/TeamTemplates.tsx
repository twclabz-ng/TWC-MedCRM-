import React, { useState } from 'react';
import { 
  FileText, 
  Copy, 
  Check, 
  MessageSquare, 
  ExternalLink, 
  Send,
  Plus
} from 'lucide-react';
import { useCRM } from '../context/CRMContext';

export const TeamTemplates: React.FC = () => {
  const { whatsappTemplates } = useCRM();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#045d6e] to-[#033b47] rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-teal-200 text-xs font-semibold mb-2">
            <FileText className="w-3.5 h-3.5" />
            Standardized Hospital Communication
          </div>
          <h2 className="text-xl sm:text-2xl font-bold">Clinical & Commercial Team Templates</h2>
          <p className="text-xs sm:text-sm text-teal-100/80 mt-1 max-w-2xl">
            Pre-approved high-conversion templates for WhatsApp, email, doctor referrals, and discharge care with dynamic patient tags.
          </p>
        </div>

        <button 
          onClick={() => alert('New template wizard opened.')}
          className="px-4 py-2.5 rounded-xl bg-white text-[#045d6e] hover:bg-teal-50 text-xs sm:text-sm font-bold shadow-md shrink-0 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add New Template</span>
        </button>
      </div>

      {/* Templates List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {whatsappTemplates.map((tmpl) => (
          <div
            key={tmpl.id}
            className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#045d6e] transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800">
                  {tmpl.category}
                </span>
                <span className="text-[10px] text-slate-400 font-mono font-medium">
                  {tmpl.language}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 leading-snug">{tmpl.title}</h3>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700 font-mono leading-relaxed whitespace-pre-wrap">
                {tmpl.text}
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {tmpl.variables.map((v) => (
                  <span key={v} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-teal-50 text-[#045d6e] font-bold">
                    &#123;&#123;{v}&#125;&#125;
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                onClick={() => handleCopy(tmpl.id, tmpl.text)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                {copiedId === tmpl.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === tmpl.id ? 'Copied Template!' : 'Copy Text'}</span>
              </button>

              <button
                onClick={() => alert(`Template "${tmpl.title}" selected for dispatch.`)}
                className="px-4 py-2 rounded-xl bg-[#045d6e] text-white hover:bg-[#034a58] text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Use in WhatsApp</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
