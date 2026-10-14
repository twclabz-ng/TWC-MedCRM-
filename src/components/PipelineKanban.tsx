import React, { useState } from 'react';
import { 
  GitFork, 
  Table as TableIcon, 
  Kanban, 
  UserCheck, 
  Building2, 
  Plus, 
  ArrowRight, 
  ArrowLeft, 
  MessageSquare, 
  Clock, 
  ShieldCheck, 
  TrendingUp,
  Filter
} from 'lucide-react';
import { useCRM } from '../context/CRMContext';
import { Lead, FunnelType, LeadStage } from '../types/crm';
import { CommunicationBar } from './CommunicationBar';

export const PipelineKanban: React.FC = () => {
  const { 
    filteredLeads, 
    updateLeadStage, 
    formatCurrency, 
    maskPII, 
    setSelectedLeadForDetail, 
    setIsNewLeadModalOpen,
    activeAssociate,
    selectedAssociateId
  } = useCRM();

  const [activeFunnelType, setActiveFunnelType] = useState<FunnelType>('patient');
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [dragOverStageId, setDragOverStageId] = useState<string | null>(null);

  // Stages configuration
  const patientStages: { id: LeadStage; title: string; color: string }[] = [
    { id: 'inquiry', title: '1. Inquiries & Intake', color: 'border-amber-400' },
    { id: 'triage', title: '2. Clinical Triage', color: 'border-blue-400' },
    { id: 'consultation_booked', title: '3. Consultation Booked', color: 'border-indigo-500' },
    { id: 'diagnostics_lab', title: '4. Diagnostics / Lab', color: 'border-purple-500' },
    { id: 'treatment_plan', title: '5. Care Plan', color: 'border-teal-500' },
    { id: 'retention_followup', title: '6. Retention & Loyalty', color: 'border-emerald-500' },
  ];

  const corporateStages: { id: LeadStage; title: string; color: string }[] = [
    { id: 'lead_inbound', title: '1. Inbound Leads', color: 'border-amber-400' },
    { id: 'discovery_audit', title: '2. Corporate Health Audit', color: 'border-blue-400' },
    { id: 'pitch_proposal', title: '3. Pitch Proposal', color: 'border-indigo-500' },
    { id: 'mou_review', title: '4. Legal MOU Review', color: 'border-purple-500' },
    { id: 'contract_signed', title: '5. Contract Signed', color: 'border-teal-500' },
    { id: 'active_retainer', title: '6. Active Retainer', color: 'border-emerald-500' },
  ];

  const currentStages = activeFunnelType === 'patient' ? patientStages : corporateStages;
  const currentLeads = filteredLeads.filter(l => l.type === activeFunnelType);

  const getStageTotalValue = (stageId: LeadStage) => {
    return currentLeads
      .filter(l => l.stage === stageId)
      .reduce((sum, l) => sum + l.expectedValueNGN, 0);
  };

  const handleMoveStage = (e: React.MouseEvent, lead: Lead, direction: 'next' | 'prev') => {
    e.stopPropagation();
    const stageIds = currentStages.map(s => s.id);
    const currentIndex = stageIds.indexOf(lead.stage);
    if (direction === 'next' && currentIndex < stageIds.length - 1) {
      updateLeadStage(lead.id, stageIds[currentIndex + 1]);
    } else if (direction === 'prev' && currentIndex > 0) {
      updateLeadStage(lead.id, stageIds[currentIndex - 1]);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
        
        {/* Funnel Type Selector: Patient vs Corporate (iOS Segmented Control) */}
        <div className="bg-slate-200/80 p-1 rounded-full flex items-center shadow-inner">
          <button
            onClick={() => setActiveFunnelType('patient')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all ios-pressable ${
              activeFunnelType === 'patient'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-[#045d6e]" />
            <span>Patients</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${
              activeFunnelType === 'patient' ? 'bg-[#045d6e] text-white' : 'bg-slate-300 text-slate-700'
            }`}>
              {filteredLeads.filter(l => l.type === 'patient').length}
            </span>
          </button>

          <button
            onClick={() => setActiveFunnelType('corporate_retainer')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all ios-pressable ${
              activeFunnelType === 'corporate_retainer'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Corporate</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${
              activeFunnelType === 'corporate_retainer' ? 'bg-blue-600 text-white' : 'bg-slate-300 text-slate-700'
            }`}>
              {filteredLeads.filter(l => l.type === 'corporate_retainer').length}
            </span>
          </button>
        </div>

        {/* View Mode & Add Action */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-0.5 bg-slate-200/80 rounded-full">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 px-3 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ios-pressable ${
                viewMode === 'kanban' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Kanban Board View"
            >
              <Kanban className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Board</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 px-3 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ios-pressable ${
                viewMode === 'table' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Spreadsheet Table View"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>

          <button
            onClick={() => setIsNewLeadModalOpen(true)}
            className="px-4 py-1.5 rounded-full bg-[#045d6e] text-white hover:bg-[#034a58] text-xs font-bold flex items-center gap-1.5 shadow-sm ios-pressable shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Case</span>
          </button>
        </div>

      </div>

      {/* KANBAN BOARD VIEW */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
          {currentStages.map((stage) => {
            const stageLeads = currentLeads.filter(l => l.stage === stage.id);
            const stageVal = getStageTotalValue(stage.id);

            return (
              <div 
                key={stage.id} 
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'move';
                  if (dragOverStageId !== stage.id) setDragOverStageId(stage.id);
                }}
                onDragLeave={(e) => {
                  if (e.currentTarget.contains(e.relatedTarget as Node)) return;
                  if (dragOverStageId === stage.id) setDragOverStageId(null);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const leadId = e.dataTransfer.getData('text/plain') || draggedLeadId;
                  if (leadId) {
                    updateLeadStage(leadId, stage.id);
                  }
                  setDraggedLeadId(null);
                  setDragOverStageId(null);
                }}
                className={`flex flex-col rounded-2xl p-3 border transition-all min-w-[240px] max-w-full ${
                  dragOverStageId === stage.id 
                    ? 'bg-teal-50/90 border-[#045D6E] ring-2 ring-[#045D6E]/50 shadow-md scale-[1.01]' 
                    : 'bg-slate-100/90 border-slate-200/80'
                }`}
              >
                
                {/* Column Header */}
                <div className={`border-t-4 ${stage.color} pt-2 pb-2.5 px-1`}>
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800 truncate" title={stage.title}>
                      {stage.title}
                    </h4>
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-white text-slate-700 shadow-2xs">
                      {stageLeads.length}
                    </span>
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500 mt-0.5">
                    {formatCurrency(stageVal)}
                  </div>
                </div>

                {/* Cards Container */}
                <div className="flex-1 space-y-3 overflow-y-auto max-h-[600px] p-0.5">
                  {stageLeads.length === 0 ? (
                    <div className={`h-28 border-2 border-dashed rounded-xl flex items-center justify-center text-xs transition-colors ${
                      dragOverStageId === stage.id ? 'border-[#045D6E] text-[#045D6E] bg-teal-50/40 font-bold' : 'border-slate-200 text-slate-400'
                    }`}>
                      {dragOverStageId === stage.id ? 'Drop deal here' : 'Drop cases here'}
                    </div>
                  ) : (
                    stageLeads.map((lead) => (
                      <div
                        key={lead.id}
                        draggable={true}
                        onDragStart={(e) => {
                          e.dataTransfer.setData('text/plain', lead.id);
                          e.dataTransfer.effectAllowed = 'move';
                          setDraggedLeadId(lead.id);
                        }}
                        onDragEnd={() => {
                          setDraggedLeadId(null);
                          setDragOverStageId(null);
                        }}
                        onClick={() => setSelectedLeadForDetail(lead)}
                        className={`p-3.5 rounded-xl bg-white border hover:border-[#045d6e] hover:shadow-md transition-all cursor-grab active:cursor-grabbing group shadow-2xs space-y-2 relative select-none ${
                          draggedLeadId === lead.id 
                            ? 'opacity-40 border-dashed border-[#045d6e] scale-95 shadow-none' 
                            : 'border-slate-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1">
                          <h5 className="text-xs font-bold text-slate-900 group-hover:text-[#045d6e] transition-colors leading-tight">
                            {maskPII(lead.name, 'name')}
                          </h5>
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-xs shrink-0">
                            {lead.probabilityPercent}%
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                          {lead.clinicalInterest}
                        </p>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                          <span className="font-bold text-slate-900">
                            {formatCurrency(lead.expectedValueNGN)}
                          </span>
                          <span className="text-slate-400 text-[10px] truncate max-w-[80px]">
                            {lead.location}
                          </span>
                        </div>

                        {/* One-Click Dialer, SMS, WhatsApp & Email Bar + Stage Movers */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                          <CommunicationBar contact={lead} compact={true} />

                          <div className="flex items-center gap-0.5 shrink-0">
                            <button
                              onClick={(e) => handleMoveStage(e, lead, 'prev')}
                              disabled={currentStages[0].id === stage.id}
                              className="p-1 rounded-md text-slate-400 hover:text-slate-800 disabled:opacity-20 hover:bg-slate-100"
                              title="Move to previous stage"
                            >
                              <ArrowLeft className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => handleMoveStage(e, lead, 'next')}
                              disabled={currentStages[currentStages.length - 1].id === stage.id}
                              className="p-1 rounded-md text-slate-400 hover:text-slate-800 disabled:opacity-20 hover:bg-slate-100"
                              title="Move to next stage"
                            >
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
                  <th className="py-3 px-4">Patient / Organization</th>
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4">Medical Program</th>
                  <th className="py-3 px-4">Expected Value</th>
                  <th className="py-3 px-4">Referral Source</th>
                  <th className="py-3 px-4">Direct Communication</th>
                  <th className="py-3 px-4">NDPA Consent</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {currentLeads.map((lead) => (
                  <tr 
                    key={lead.id} 
                    onClick={() => setSelectedLeadForDetail(lead)}
                    className="hover:bg-teal-50/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div>{maskPII(lead.name, 'name')}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{maskPII(lead.phone, 'phone')}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full font-semibold capitalize bg-slate-100 text-slate-700">
                        {lead.stage.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700 max-w-xs truncate">
                      {lead.clinicalInterest}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {formatCurrency(lead.expectedValueNGN)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {lead.referralSource}
                    </td>
                    <td className="py-3.5 px-4">
                      <CommunicationBar contact={lead} compact={true} />
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Verified</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-[#045d6e]">
                      View &rarr;
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
