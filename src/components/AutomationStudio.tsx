import React, { useState } from 'react';
import { 
  Zap, 
  Play, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  FileSpreadsheet, 
  FolderPlus, 
  UserPlus, 
  ShieldCheck, 
  ToggleLeft, 
  ToggleRight 
} from 'lucide-react';
import { useCRM } from '../context/CRMContext';
import { AutomationRule } from '../types/crm';

export const AutomationStudio: React.FC = () => {
  const { automations, toggleAutomation, runAutomationManual } = useCRM();
  const [simulationLog, setSimulationLog] = useState<string | null>(null);

  const handleTestRun = (rule: AutomationRule) => {
    runAutomationManual(rule.id);
    setSimulationLog(`Simulation executed successfully for rule "${rule.name}". Action triggered: [${rule.actionSummary}]`);
    setTimeout(() => setSimulationLog(null), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-[#045d6e] rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-teal-200 text-xs font-semibold mb-2">
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            Zoho CRM & Wati Workflow Automation Engine
          </div>
          <h2 className="text-xl sm:text-2xl font-bold">Clinical & Sales Workflow Automations</h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Automate repetitive healthcare tasks: auto-sending WhatsApp fasting prep, triggering Google Sheets row sync, generating Drive folders, and routing doctor referrals.
          </p>
        </div>

        <button
          onClick={() => alert('New automation rule builder wizard opened.')}
          className="px-4 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-xs sm:text-sm font-bold shadow-md shrink-0"
        >
          + Create Custom Workflow
        </button>
      </div>

      {/* Simulation Feedback Alert */}
      {simulationLog && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{simulationLog}</span>
        </div>
      )}

      {/* Automation Rules Grid */}
      <div className="space-y-4">
        {automations.map((rule) => (
          <div
            key={rule.id}
            className={`p-5 rounded-2xl bg-white border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
              rule.isActive ? 'border-slate-200 shadow-xs' : 'border-slate-100 bg-slate-50/50 opacity-70'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold shrink-0 ${
                rule.actionType === 'send_whatsapp_template' ? 'bg-emerald-50 text-emerald-600' :
                rule.actionType === 'sync_google_sheet' ? 'bg-teal-50 text-[#045d6e]' :
                rule.actionType === 'create_google_drive_folder' ? 'bg-blue-50 text-blue-600' :
                'bg-amber-50 text-amber-600'
              }`}>
                {rule.actionType === 'send_whatsapp_template' && <MessageSquare className="w-5 h-5" />}
                {rule.actionType === 'sync_google_sheet' && <FileSpreadsheet className="w-5 h-5" />}
                {rule.actionType === 'create_google_drive_folder' && <FolderPlus className="w-5 h-5" />}
                {rule.actionType === 'assign_associate' && <UserPlus className="w-5 h-5" />}
                {rule.actionType === 'alert_sales_rep' && <Zap className="w-5 h-5" />}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900">{rule.name}</h4>
                  <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                    rule.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {rule.isActive ? 'Active' : 'Disabled'}
                  </span>
                </div>

                <div className="text-xs text-slate-500 mt-1">
                  <strong>Trigger:</strong> {rule.conditionDesc}
                </div>
                <div className="text-xs text-[#045d6e] font-semibold mt-0.5">
                  <strong>Action:</strong> {rule.actionSummary}
                </div>

                <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-400">
                  <span>Executed <strong>{rule.executionCount}</strong> times</span>
                  <span>•</span>
                  <span>Last run: {rule.lastRunAt || 'Never'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-center shrink-0">
              <button
                onClick={() => handleTestRun(rule)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
                title="Test trigger this automation rule right now"
              >
                <Play className="w-3.5 h-3.5 text-slate-600" />
                <span>Test Run</span>
              </button>

              <button
                onClick={() => toggleAutomation(rule.id)}
                className={`p-2 rounded-xl text-xs font-bold transition-colors ${
                  rule.isActive ? 'text-emerald-600 hover:bg-emerald-50' : 'text-slate-400 hover:bg-slate-100'
                }`}
                title={rule.isActive ? 'Deactivate rule' : 'Activate rule'}
              >
                {rule.isActive ? (
                  <ToggleRight className="w-7 h-7 text-emerald-600" />
                ) : (
                  <ToggleLeft className="w-7 h-7 text-slate-400" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
