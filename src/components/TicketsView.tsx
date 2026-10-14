import React, { useState } from 'react';
import { 
  LifeBuoy, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Filter, 
  Search, 
  Phone, 
  UserCheck,
  Kanban,
  Table as TableIcon,
  ArrowRight,
  ArrowLeft,
  ShieldAlert,
  Flame,
  Check
} from 'lucide-react';
import { useCRM } from '../context/CRMContext';
import { SupportTicket } from '../types/crm';

export const TicketsView: React.FC = () => {
  const { 
    filteredTickets, 
    updateTicketStatus, 
    addTicket, 
    associates, 
    maskPII,
    currentTenant
  } = useCRM();

  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [draggedTicketId, setDraggedTicketId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<SupportTicket['status'] | null>(null);

  // New ticket modal
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState<boolean>(false);
  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState<SupportTicket['category']>('Lab Report Delay');
  const [priority, setPriority] = useState<SupportTicket['priority']>('medium');
  const [description, setDescription] = useState('');

  const ticketStages: { 
    id: SupportTicket['status']; 
    title: string; 
    color: string; 
    bgDrop: string;
    description: string;
  }[] = [
    { 
      id: 'open', 
      title: '1. Triage & Open Queue', 
      color: 'border-amber-400 text-amber-800', 
      bgDrop: 'bg-amber-50/70 border-amber-400 ring-2 ring-amber-400/40',
      description: 'Incoming requests awaiting action'
    },
    { 
      id: 'in_progress', 
      title: '2. Under Investigation & Escalated', 
      color: 'border-blue-500 text-blue-800', 
      bgDrop: 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-500/40',
      description: 'Actively handled with clinic or lab'
    },
    { 
      id: 'resolved', 
      title: '3. Resolved & SLA Closed', 
      color: 'border-emerald-500 text-emerald-800', 
      bgDrop: 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500/40',
      description: 'Completed and patient notified'
    },
  ];

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !description) return;

    addTicket({
      tenantId: currentTenant.id,
      patientOrCompanyName: patientName,
      phone,
      category,
      priority,
      status: 'open',
      assignedAssociateId: associates.find(a => a.role === 'customer_service')?.id || associates[0].id,
      slaHoursLeft: priority === 'urgent' ? 2 : priority === 'high' ? 4 : 8,
      description,
    });

    setPatientName('');
    setDescription('');
    setIsNewTicketModalOpen(false);
  };

  const displayedTickets = filteredTickets.filter(t => {
    const matchesPriority = filterPriority === 'all' || t.priority === filterPriority;
    const matchesSearch = !searchQuery || 
      t.patientOrCompanyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPriority && matchesSearch;
  });

  const getPriorityBadge = (p: SupportTicket['priority']) => {
    switch (p) {
      case 'urgent':
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 animate-pulse"><Flame className="w-3 h-3 text-rose-600" /> Urgent (&lt;2h)</span>;
      case 'high':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">High (&lt;4h)</span>;
      case 'medium':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">Medium</span>;
      default:
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">Low</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-[28px] border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#045D6E] text-white">
              {currentTenant.shortName}
            </span>
            <span className="text-xs font-semibold text-slate-400">SLA Resolution Desk</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">Patient Concierge & Care Resolution Desk</h2>
          <p className="text-xs text-slate-500 max-w-2xl mt-0.5">
            Drag-and-drop ticket resolution pipeline with SLA monitoring for lab turnaround delays, HMO authorizations, and appointment logistics.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {/* View Mode Toggle */}
          <div className="flex items-center p-0.5 bg-slate-200/80 rounded-full">
            <button
              onClick={() => setViewMode('board')}
              className={`p-1.5 px-3 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ios-pressable ${
                viewMode === 'board' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Kanban Board View"
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Pipeline Board</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 px-3 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ios-pressable ${
                viewMode === 'list' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Table List View"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
          </div>

          <button
            onClick={() => setIsNewTicketModalOpen(true)}
            className="px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all ios-pressable shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Open Ticket</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Priority:</span>
          {['all', 'urgent', 'high', 'medium', 'low'].map((p) => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              className={`px-3 py-1 rounded-full text-xs font-semibold capitalize whitespace-nowrap transition-colors ios-pressable ${
                filterPriority === p ? 'bg-slate-900 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="relative min-w-[200px] sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tickets, patient name..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-none focus:ring-1 focus:ring-[#045D6E] focus:bg-white"
          />
        </div>
      </div>

      {/* RESOLUTION PIPELINE KANBAN (DRAG AND DROP) */}
      {viewMode === 'board' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pb-4">
          {ticketStages.map((stage) => {
            const stageTickets = displayedTickets.filter(t => t.status === stage.id);
            const isDragOver = dragOverStage === stage.id;

            return (
              <div
                key={stage.id}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'move';
                  if (dragOverStage !== stage.id) setDragOverStage(stage.id);
                }}
                onDragLeave={(e) => {
                  if (e.currentTarget.contains(e.relatedTarget as Node)) return;
                  if (dragOverStage === stage.id) setDragOverStage(null);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const ticketId = e.dataTransfer.getData('text/plain') || draggedTicketId;
                  if (ticketId) {
                    updateTicketStatus(ticketId, stage.id);
                  }
                  setDraggedTicketId(null);
                  setDragOverStage(null);
                }}
                className={`flex flex-col rounded-2xl p-4 border transition-all ${
                  isDragOver 
                    ? stage.bgDrop 
                    : 'bg-slate-100/80 border-slate-200/80'
                }`}
              >
                {/* Column Header */}
                <div className={`border-t-4 ${stage.color} pt-2 pb-3 px-1 flex items-center justify-between`}>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{stage.title}</h4>
                    <p className="text-[10px] text-slate-500">{stage.description}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-white text-slate-700 shadow-2xs">
                    {stageTickets.length}
                  </span>
                </div>

                {/* Dropzone & Card Stack */}
                <div className="flex-1 space-y-3 overflow-y-auto max-h-[640px] p-0.5">
                  {stageTickets.length === 0 ? (
                    <div className={`h-32 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-xs text-center p-4 transition-colors ${
                      isDragOver ? 'border-[#045D6E] text-[#045D6E] bg-white/80 font-bold' : 'border-slate-300/80 text-slate-400'
                    }`}>
                      <span>Drop tickets here to change stage</span>
                      <span className="text-[10px] text-slate-400 mt-1">Status updates automatically</span>
                    </div>
                  ) : (
                    stageTickets.map((tkt) => (
                      <div
                        key={tkt.id}
                        draggable={true}
                        onDragStart={(e) => {
                          e.dataTransfer.setData('text/plain', tkt.id);
                          e.dataTransfer.effectAllowed = 'move';
                          setDraggedTicketId(tkt.id);
                        }}
                        onDragEnd={() => {
                          setDraggedTicketId(null);
                          setDragOverStage(null);
                        }}
                        className={`p-4 rounded-2xl bg-white border transition-all cursor-grab active:cursor-grabbing select-none group shadow-2xs space-y-3 ${
                          draggedTicketId === tkt.id
                            ? 'opacity-40 border-dashed border-[#045D6E] scale-95 shadow-none'
                            : tkt.priority === 'urgent' && tkt.status !== 'resolved'
                            ? 'border-rose-400 shadow-xs ring-1 ring-rose-200'
                            : 'border-slate-200 hover:border-[#045D6E] hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1">
                          {getPriorityBadge(tkt.priority)}
                          <span className="text-[10px] text-slate-400 font-medium">
                            {tkt.createdAt.substring(11, 16)}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-slate-900 leading-snug group-hover:text-[#045D6E] transition-colors">
                            {tkt.category}
                          </h4>
                          <div className="text-[11px] font-semibold text-slate-600 mt-0.5">
                            Patient: <span className="text-slate-900">{maskPII(tkt.patientOrCompanyName, 'name')}</span>
                          </div>
                          {tkt.phone && (
                            <div className="text-[10px] text-slate-400">
                              {maskPII(tkt.phone, 'phone')}
                            </div>
                          )}
                        </div>

                        <p className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed">
                          {tkt.description}
                        </p>

                        {tkt.resolutionNotes && (
                          <div className="text-[10px] text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                            <strong>Resolution:</strong> {tkt.resolutionNotes}
                          </div>
                        )}

                        {/* Card Footer: SLA timer and stage movement shortcuts */}
                        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5 text-slate-500 font-medium text-[11px]">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>
                              {tkt.status === 'resolved' ? 'Resolved' : `SLA: ${tkt.slaHoursLeft}h left`}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            {stage.id !== 'open' && (
                              <button
                                onClick={() => updateTicketStatus(tkt.id, stage.id === 'resolved' ? 'in_progress' : 'open')}
                                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                                title="Move back"
                              >
                                <ArrowLeft className="w-3 h-3" />
                              </button>
                            )}

                            {stage.id !== 'resolved' && (
                              <button
                                onClick={() => updateTicketStatus(tkt.id, stage.id === 'open' ? 'in_progress' : 'resolved')}
                                className="px-2.5 py-1 rounded-lg bg-[#045D6E] hover:bg-[#034a58] text-white font-bold text-[10px] flex items-center gap-1 transition-colors"
                                title="Advance stage"
                              >
                                <span>{stage.id === 'open' ? 'Start' : 'Resolve'}</span>
                                <ArrowRight className="w-2.5 h-2.5" />
                              </button>
                            )}
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
        /* LIST / TABLE VIEW */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold text-[10px]">
                <tr>
                  <th className="py-3 px-4">Patient / Organization</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">SLA Hours Left</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {displayedTickets.map((tkt) => (
                  <tr key={tkt.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {maskPII(tkt.patientOrCompanyName, 'name')}
                      <div className="text-[10px] text-slate-400 font-normal">{maskPII(tkt.phone, 'phone')}</div>
                    </td>
                    <td className="py-3 px-4 font-medium">{tkt.category}</td>
                    <td className="py-3 px-4">{getPriorityBadge(tkt.priority)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                        tkt.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' :
                        tkt.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {tkt.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-600">
                      {tkt.status === 'resolved' ? 'Closed' : `${tkt.slaHoursLeft}h remaining`}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <select
                        value={tkt.status}
                        onChange={(e) => updateTicketStatus(tkt.id, e.target.value as any)}
                        className="text-xs p-1 rounded-lg border border-slate-200 bg-white"
                      >
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Ticket Modal */}
      {isNewTicketModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <form
            onSubmit={handleCreateTicket}
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#045D6E] bg-teal-50 px-2 py-0.5 rounded-full">
                  {currentTenant.shortName}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">Open Care Service Ticket</h3>
              </div>
              <button type="button" onClick={() => setIsNewTicketModalOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Patient or Corporate Account Name</label>
              <input
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="e.g. Chief Olumide Adeleke"
                className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#045D6E]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+234 803 000 0000"
                className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#045D6E]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white"
                >
                  <option value="Lab Report Delay">Lab Report Delay</option>
                  <option value="Billing & HMO Dispute">Billing & HMO Dispute</option>
                  <option value="Appointment Reschedule">Appointment Reschedule</option>
                  <option value="Home Sample Phlebotomy">Home Sample Phlebotomy</option>
                  <option value="Doctor Consultation Query">Doctor Consultation Query</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">SLA Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white"
                >
                  <option value="urgent">Urgent (&lt; 2h)</option>
                  <option value="high">High (&lt; 4h)</option>
                  <option value="medium">Medium (&lt; 8h)</option>
                  <option value="low">Low (&lt; 24h)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Issue Description</label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Details of complaint or clinical turnaround request..."
                className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#045D6E]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button 
                type="button" 
                onClick={() => setIsNewTicketModalOpen(false)} 
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition-all"
              >
                Dispatch Ticket
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
