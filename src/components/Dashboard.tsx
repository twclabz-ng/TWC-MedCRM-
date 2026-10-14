import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  PhoneCall, 
  MessageSquare, 
  QrCode, 
  ShieldCheck, 
  FileSpreadsheet, 
  LifeBuoy, 
  ArrowRight, 
  Clock, 
  Building2, 
  UserCheck, 
  Sparkles,
  ChevronRight,
  Send,
  AlertCircle,
  Folder,
  Receipt,
  FileCheck,
  Flame,
  CheckCircle2,
  HardDrive,
  Target,
  Zap,
  Activity,
  Download
} from 'lucide-react';
import { useCRM } from '../context/CRMContext';
import { Lead } from '../types/crm';
import { CommunicationBar } from './CommunicationBar';

export const Dashboard: React.FC = () => {
  const { 
    filteredLeads, 
    leads, 
    activeAssociate, 
    selectedAssociateId, 
    formatCurrency, 
    maskPII, 
    setActiveTab, 
    setSelectedLeadForDetail, 
    filteredActivities, 
    referralDoctors,
    filteredTickets,
    filteredInvoices,
    filteredFiles,
    currentTenant,
    tenantAssociates,
    setIsNewLeadModalOpen,
    setIsNDPAModalOpen
  } = useCRM();

  // State for KPI drill-down modal when user clicks a KPI card
  const [drillDownCard, setDrillDownCard] = useState<{
    title: string;
    description: string;
    items: { label: string; value: string; extra?: string }[];
    actionTab?: string;
  } | null>(null);

  // Calculations strictly scoped to active hospital tenant and selected associate
  const totalPipelineValue = filteredLeads.reduce((acc, l) => acc + (l.expectedValueNGN * (l.probabilityPercent / 100)), 0);
  const patientCount = filteredLeads.filter(l => l.type === 'patient').length;
  const corporateCount = filteredLeads.filter(l => l.type === 'corporate_retainer').length;
  const openTickets = filteredTickets.filter(t => t.status === 'open' || t.status === 'in_progress');
  const urgentTickets = filteredTickets.filter(t => t.priority === 'urgent' && t.status !== 'resolved');
  const totalReferralEarnings = referralDoctors.reduce((acc, d) => acc + d.totalEarnedNGN, 0);

  // Target calculations
  const targetRevenue = activeAssociate ? activeAssociate.monthlyTargetNGN : 65000000;
  const closedRevenue = activeAssociate ? activeAssociate.closedRevenueNGN : 45500000;
  const targetPercent = Math.min(Math.round((closedRevenue / (targetRevenue || 1)) * 100), 100);

  // Funnel breakdown
  const patientStages = [
    { key: 'inquiry', label: '1. Inquiries & Inflow', count: filteredLeads.filter(l => l.stage === 'inquiry').length },
    { key: 'triage', label: '2. Clinical Triage', count: filteredLeads.filter(l => l.stage === 'triage').length },
    { key: 'consultation_booked', label: '3. Consultation Booked', count: filteredLeads.filter(l => l.stage === 'consultation_booked').length },
    { key: 'diagnostics_lab', label: '4. Diagnostics / Lab', count: filteredLeads.filter(l => l.stage === 'diagnostics_lab').length },
    { key: 'treatment_plan', label: '5. Care Plan Formulated', count: filteredLeads.filter(l => l.stage === 'treatment_plan').length },
    { key: 'retention_followup', label: '6. Retention & Loyalty', count: filteredLeads.filter(l => l.stage === 'retention_followup').length },
  ];

  const corporateStages = [
    { key: 'lead_inbound', label: '1. Corporate Lead', count: filteredLeads.filter(l => l.stage === 'lead_inbound').length },
    { key: 'discovery_audit', label: '2. Health Needs Audit', count: filteredLeads.filter(l => l.stage === 'discovery_audit').length },
    { key: 'pitch_proposal', label: '3. Retainer Proposal', count: filteredLeads.filter(l => l.stage === 'pitch_proposal').length },
    { key: 'mou_review', label: '4. Legal MOU Review', count: filteredLeads.filter(l => l.stage === 'mou_review').length },
    { key: 'contract_signed', label: '5. Signed & Active', count: filteredLeads.filter(l => l.stage === 'contract_signed' || l.stage === 'active_retainer').length },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner: Hospital Personalization & Associate Context */}
      <div 
        className="rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden transition-all"
        style={{ 
          background: `linear-gradient(135deg, ${currentTenant.primaryColor || '#045D6E'} 0%, #033640 100%)` 
        }}
      >
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-white/10 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {activeAssociate ? (
              <img 
                src={activeAssociate.avatar} 
                alt={activeAssociate.name} 
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white/50 shadow-md shrink-0" 
              />
            ) : currentTenant.logoUrl ? (
              <img 
                src={currentTenant.logoUrl} 
                alt={currentTenant.name} 
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white/30 shadow-md shrink-0 bg-white/20" 
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center font-black text-white shrink-0">
                <span className="text-lg font-black">{currentTenant.shortName.substring(0, 4).toUpperCase()}</span>
                <span className="text-[8px] tracking-widest text-teal-200">HOSPITAL</span>
              </div>
            )}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-teal-100 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{currentTenant.shortName}</span>
                <span>•</span>
                <span>{activeAssociate ? `${activeAssociate.department}` : 'Smart Dashboard'}</span>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
                {activeAssociate ? `Welcome back, ${activeAssociate.name}` : `${currentTenant.name}`}
              </h2>
              <p className="text-xs sm:text-sm text-teal-100/90 mt-1 max-w-2xl leading-relaxed">
                {activeAssociate 
                  ? `Monthly Target: ${formatCurrency(activeAssociate.monthlyTargetNGN)} • Closed: ${formatCurrency(activeAssociate.closedRevenueNGN)} (${targetPercent}%) • Satisfaction: ${activeAssociate.satisfactionScore}/5.0` 
                  : `${currentTenant.tagline} • ${currentTenant.address}, ${currentTenant.city}. Operating with NDPA 2023 certified patient governance.`
                }
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setActiveTab('my_files')}
              className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold border border-white/20 transition-all flex items-center gap-1.5"
            >
              <Folder className="w-3.5 h-3.5" />
              <span>Tenant Files ({filteredFiles.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('pipeline')}
              className="px-4 py-2 rounded-xl bg-white text-slate-900 hover:bg-teal-50 text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95 flex items-center gap-1.5"
            >
              <span>View Pipeline</span>
              <ArrowRight className="w-4 h-4 text-[#045D6E]" />
            </button>
          </div>
        </div>
      </div>

      {/* SMART HEALTHCARE INTELLIGENCE RADAR (AI / Clinical Insights Bar) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Radar Card 1: Turnaround Velocity & SLA Breaches */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-[#045D6E] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Clinical Turnaround Velocity</span>
            <div className={`p-1.5 rounded-xl ${urgentTickets.length > 0 ? 'bg-rose-50 text-rose-600 animate-pulse' : 'bg-emerald-50 text-emerald-600'}`}>
              {urgentTickets.length > 0 ? <Flame className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              {urgentTickets.length > 0 ? `${urgentTickets.length} At Risk` : '97.2% On Time'}
            </span>
            <span className={`text-xs font-bold ${urgentTickets.length > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
              {urgentTickets.length > 0 ? 'Urgent SLA Radar' : 'Standard <6h'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {urgentTickets.length > 0 
              ? `${urgentTickets[0].patientOrCompanyName}: ${urgentTickets[0].category} nearing deadline.`
              : 'All patient specimen results and consultation reports within ISO-15189 compliance.'}
          </p>
          <button
            onClick={() => setActiveTab('tickets')}
            className="mt-3 text-xs font-bold text-[#045D6E] hover:underline flex items-center gap-1"
          >
            <span>Open Ticket Resolution Desk &rarr;</span>
          </button>
        </div>

        {/* Radar Card 2: Revenue Probability & Target Pacing */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-[#045D6E] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Weighted Pipeline Forecast</span>
            <div className="p-1.5 rounded-xl bg-blue-50 text-blue-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{formatCurrency(totalPipelineValue)}</span>
            <span className="text-xs font-bold text-blue-600">{filteredLeads.length} active deals</span>
          </div>
          <div className="mt-2.5">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 mb-1">
              <span>Monthly Target Pacing</span>
              <span>{targetPercent}% ({formatCurrency(closedRevenue)})</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ 
                  width: `${targetPercent}%`,
                  backgroundColor: currentTenant.primaryColor || '#045D6E'
                }}
              />
            </div>
          </div>
        </div>

        {/* Radar Card 3: Google Drive & Document Governance */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-[#045D6E] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Tenant Document Vault</span>
            <div className="p-1.5 rounded-xl bg-teal-50 text-[#045D6E]">
              <HardDrive className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{filteredFiles.length} Documents</span>
            <span className="text-xs font-bold text-teal-700">Drive Synced</span>
          </div>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2">
            Encrypted storage for patient lab slips, radiology scans, retainer MOUs and signed SLAs.
          </p>
          <div className="mt-3 flex items-center gap-3">
            <button
              onClick={() => setActiveTab('my_files')}
              className="text-xs font-bold text-[#045D6E] hover:underline"
            >
              Browse Files &rarr;
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => setActiveTab('documents')}
              className="text-xs font-bold text-slate-600 hover:text-slate-900"
            >
              Invoices & SLAs
            </button>
          </div>
        </div>

      </div>

      {/* KPI METRIC CARDS (Each card is clickable to provide more information!) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            Key Performance Metrics (Click any card for drill-down)
          </h3>
          <span className="text-xs text-slate-400">
            {selectedAssociateId !== 'all' ? `Filtered by ${activeAssociate?.name}` : 'All Hospital Associates'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Pipeline Value */}
          <div 
            onClick={() => setDrillDownCard({
              title: 'Weighted Pipeline Value Breakdown',
              description: 'Total prospective revenue calculated using stage-weighted probability across all open cases.',
              items: [
                { label: 'Weighted Expected Value', value: formatCurrency(totalPipelineValue) },
                { label: 'Individual Patient Value', value: formatCurrency(filteredLeads.filter(l => l.type === 'patient').reduce((a, b) => a + b.expectedValueNGN, 0)) },
                { label: 'Corporate Retainer Value', value: formatCurrency(filteredLeads.filter(l => l.type === 'corporate_retainer').reduce((a, b) => a + b.expectedValueNGN, 0)) },
                { label: 'Associate Closed This Month', value: activeAssociate ? formatCurrency(activeAssociate.closedRevenueNGN) : '₦101,500,000 (All Teams)' }
              ],
              actionTab: 'pipeline'
            })}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-[#045d6e] hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Weighted Pipeline</span>
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#045d6e] flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-3 group-hover:text-[#045d6e] transition-colors">
              {formatCurrency(totalPipelineValue)}
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
              <span>{filteredLeads.length} active leads</span>
              <span className="text-teal-700 font-semibold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                Details &rarr;
              </span>
            </div>
          </div>

          {/* Card 2: Patient vs Corporate Count */}
          <div 
            onClick={() => setDrillDownCard({
              title: 'Active Patient & Corporate Accounts',
              description: 'Distribution of patient clinic visits vs institutional corporate retainers currently managed.',
              items: [
                { label: 'Private Patients & Outpatients', value: `${patientCount} patients active` },
                { label: 'Corporate & HMO Accounts', value: `${corporateCount} organizations` },
                { label: 'Google Sheets Synced Cases', value: `${filteredLeads.filter(l => l.googleSync.syncedToSheets).length} records` },
                { label: 'NDPA Consented Cases', value: `${filteredLeads.filter(l => l.ndpaConsent.consented).length} verified (100%)` }
              ],
              actionTab: 'pipeline'
            })}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-[#045d6e] hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Funnel Cases</span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-3">
              {filteredLeads.length} <span className="text-sm font-semibold text-slate-400">Total</span>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
              <span>{patientCount} Patients • {corporateCount} Corporate</span>
              <span className="text-blue-600 font-semibold group-hover:translate-x-1 transition-transform">Details &rarr;</span>
            </div>
          </div>

          {/* Card 3: Doctor Referrals */}
          <div 
            onClick={() => setDrillDownCard({
              title: 'External Doctor Referral Network',
              description: 'WeChat mini-app style referral tracking for specialist medical practitioners and diagnostic partners.',
              items: [
                { label: 'Active Referring Doctors', value: `${referralDoctors.length} doctors registered` },
                { label: 'Cumulative Honorarium Disbursed', value: formatCurrency(totalReferralEarnings) },
                { label: 'Pending Payout This Month', value: formatCurrency(referralDoctors.reduce((a, b) => a + b.pendingPayoutNGN, 0)) },
                { label: 'Top Referring Doctor', value: `${referralDoctors[0]?.name} (${referralDoctors[0]?.totalReferralsCount} referrals)` }
              ],
              actionTab: 'referrals'
            })}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Doctor Referrals</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <QrCode className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-3">
              {referralDoctors.reduce((a, b) => a + b.totalReferralsCount, 0)} <span className="text-sm font-semibold text-slate-400">Cases</span>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
              <span className="text-emerald-700 font-medium">{formatCurrency(totalReferralEarnings)} honorarium</span>
              <span className="text-emerald-700 font-semibold group-hover:translate-x-1 transition-transform">Portal &rarr;</span>
            </div>
          </div>

          {/* Card 4: Open Care Tickets & SLAs */}
          <div 
            onClick={() => setDrillDownCard({
              title: 'Customer Service & Patient Care Tickets',
              description: 'Triage queue for turnaround time complaints, appointment rescheduling, and phlebotomy requests.',
              items: [
                { label: 'Open Tickets In Queue', value: `${openTickets.length} pending action` },
                { label: 'Urgent Priority Tickets', value: `${filteredTickets.filter(t => t.priority === 'urgent' && t.status !== 'resolved').length} immediate` },
                { label: 'Average Response Time SLA', value: '< 2.4 Hours (Compliant)' },
                { label: 'Resolved Tickets This Week', value: `${filteredTickets.filter(t => t.status === 'resolved').length} resolved` }
              ],
              actionTab: 'tickets'
            })}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-rose-400 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Care Tickets & SLAs</span>
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <LifeBuoy className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-3">
              {openTickets.length} <span className="text-sm font-semibold text-rose-500">Active</span>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
              <span className="text-rose-600 font-medium">SLA Countdown Active</span>
              <span className="text-rose-600 font-semibold group-hover:translate-x-1 transition-transform">Queue &rarr;</span>
            </div>
          </div>

        </div>
      </div>

      {/* WECHAT-STYLE HEALTHCARE MINI-APP QUICK ACTION CARDS */}
      <div className="bg-slate-100/70 p-5 rounded-3xl border border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
              WeChat Healthcare Mini-Apps & Fast Actions
            </h3>
          </div>
          <span className="text-xs text-slate-500 hidden sm:inline">1-Tap Clinical & Operations Shortcuts</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          
          <button 
            onClick={() => setActiveTab('referrals')}
            className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-[#045d6e] hover:shadow-sm text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#045d6e] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <QrCode className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-slate-900">Doctor Referral Pass</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Share QR & track payout</div>
          </button>

          <button 
            onClick={() => setActiveTab('whatsapp')}
            className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-emerald-500 hover:shadow-sm text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-slate-900">Wati WhatsApp Chat</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Direct patient outreach</div>
          </button>

          <button 
            onClick={() => setIsNewLeadModalOpen(true)}
            className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-blue-500 hover:shadow-sm text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <UserCheck className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-slate-900">Patient Intake Pass</div>
            <div className="text-[11px] text-slate-500 mt-0.5">New registration & consent</div>
          </button>

          <button 
            onClick={() => setActiveTab('google_suite')}
            className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-emerald-600 hover:shadow-sm text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-slate-900">Google Sheets Sync</div>
            <div className="text-[11px] text-slate-500 mt-0.5">2-way spreadsheet live view</div>
          </button>

          <button 
            onClick={() => setIsNDPAModalOpen(true)}
            className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-amber-500 hover:shadow-sm text-left transition-all group col-span-2 sm:col-span-1"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-slate-900">NDPA Audit Center</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Consent slip & DSAR tool</div>
          </button>

        </div>
      </div>

      {/* SALES & PATIENT JOURNEY FUNNELS (ZOHO CRM INSPIRED) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Patient Journey Funnel */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-base font-bold text-slate-900">Patient Clinical Care Journey</h4>
              <p className="text-xs text-slate-500">From initial WhatsApp/Walk-in inquiry to consultation and loyalty</p>
            </div>
            <button
              onClick={() => setActiveTab('pipeline')}
              className="text-xs font-semibold text-[#045d6e] hover:underline"
            >
              Open Kanban
            </button>
          </div>

          <div className="space-y-3">
            {patientStages.map((stage, idx) => (
              <div 
                key={stage.key}
                onClick={() => setActiveTab('pipeline')}
                className="group p-3 rounded-xl hover:bg-slate-50 border border-slate-100 flex items-center justify-between cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-teal-50 text-[#045d6e] text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-[#045d6e] transition-colors">
                    {stage.label}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                    {stage.count} {stage.count === 1 ? 'Patient' : 'Patients'}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#045d6e] group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Corporate Retainer Funnel */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-base font-bold text-slate-900">Corporate Retainer & HMO Funnel</h4>
              <p className="text-xs text-slate-500">Institutional health screenings, offshore certifications, and HMO retainers</p>
            </div>
            <button
              onClick={() => setActiveTab('pipeline')}
              className="text-xs font-semibold text-[#045d6e] hover:underline"
            >
              Open Deals
            </button>
          </div>

          <div className="space-y-3">
            {corporateStages.map((stage, idx) => (
              <div 
                key={stage.key}
                onClick={() => setActiveTab('pipeline')}
                className="group p-3 rounded-xl hover:bg-slate-50 border border-slate-100 flex items-center justify-between cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">
                    {stage.label}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-800">
                    {stage.count} {stage.count === 1 ? 'Account' : 'Accounts'}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* PRIORITY PATIENTS & RECENT SALES ACTIVITIES (CLICKABLE CARDS) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Patients & Deals List (2 Cols) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-base font-bold text-slate-900">Active High-Priority Cases</h4>
              <p className="text-xs text-slate-500">Click any card to open full WhatsApp communicator, clinical details & NDPA slip</p>
            </div>
            <button
              onClick={() => setIsNewLeadModalOpen(true)}
              className="text-xs font-bold text-[#045d6e] hover:underline"
            >
              + Add Lead
            </button>
          </div>

          <div className="space-y-3">
            {filteredLeads.slice(0, 5).map((lead: Lead) => (
              <div
                key={lead.id}
                onClick={() => setSelectedLeadForDetail(lead)}
                className="p-4 rounded-2xl border border-slate-200 hover:border-[#045d6e] hover:shadow-md transition-all cursor-pointer bg-white group flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    lead.type === 'patient' ? 'bg-teal-50 text-[#045d6e]' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {lead.type === 'patient' ? <UserCheck className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h5 className="text-sm font-bold text-slate-900 group-hover:text-[#045d6e] transition-colors truncate">
                        {maskPII(lead.name, 'name')}
                      </h5>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        lead.type === 'patient' ? 'bg-teal-50 text-teal-800' : 'bg-blue-50 text-blue-800'
                      }`}>
                        {lead.type === 'patient' ? 'Patient' : 'Corporate'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {lead.clinicalInterest}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-400">
                      <span>{maskPII(lead.phone, 'phone')}</span>
                      <span>•</span>
                      <span>{lead.location}</span>
                      <span>•</span>
                      <span className="text-emerald-600 font-semibold">NDPA Consented</span>
                    </div>
                  </div>
                </div>

                <div className="text-left sm:text-right shrink-0 flex sm:flex-col items-center sm:items-end justify-between gap-1.5 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                  <div className="text-sm font-bold text-slate-900">
                    {formatCurrency(lead.expectedValueNGN)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 capitalize">
                      {lead.stage.replace('_', ' ')}
                    </span>
                    <CommunicationBar contact={lead} compact={true} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Sales Activities Timeline (1 Col) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-base font-bold text-slate-900">Sales & Concierge Stream</h4>
              <p className="text-xs text-slate-500">Live associate logs & doctor interactions</p>
            </div>
            <button
              onClick={() => setActiveTab('activities')}
              className="text-xs font-semibold text-[#045d6e] hover:underline"
            >
              All Activities
            </button>
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto max-h-[380px] pr-1">
            {filteredActivities.slice(0, 5).map((act) => (
              <div key={act.id} className="relative pl-6 border-l-2 border-slate-200 pb-3 last:pb-0">
                <span className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-[#045d6e] ring-4 ring-white" />
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">{act.associateName}</span>
                  <span className="text-slate-400 text-[10px]">{act.timestamp.substring(11, 16)}</span>
                </div>
                <div className="text-xs font-semibold text-[#045d6e] mt-0.5">
                  {act.type.replace('_', ' ').toUpperCase()} • <span className="text-slate-700">{act.outcome}</span>
                </div>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                  {act.notes}
                </p>
                <div className="text-[10px] text-slate-400 mt-1">
                  Case: {maskPII(act.leadName, 'name')}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setActiveTab('activities')}
            className="w-full mt-4 py-2 text-xs font-bold text-[#045d6e] bg-teal-50 hover:bg-teal-100 rounded-xl transition-colors"
          >
            + Log Call / Visit / Detailing
          </button>
        </div>

      </div>

      {/* KPI Drill Down Modal (When user clicks any dashboard card) */}
      {drillDownCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#045d6e] bg-teal-50 px-2 py-0.5 rounded-full">
                  Detailed Card Analytics
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">{drillDownCard.title}</h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">{drillDownCard.description}</p>
              </div>
              <button 
                onClick={() => setDrillDownCard(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {drillDownCard.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm">
                  <span className="text-slate-600 font-medium">{item.label}</span>
                  <span className="font-bold text-slate-900">{item.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setDrillDownCard(null)}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
              {drillDownCard.actionTab && (
                <button
                  onClick={() => {
                    setActiveTab(drillDownCard.actionTab!);
                    setDrillDownCard(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#045d6e] text-white hover:bg-[#034a58]"
                >
                  Go to {drillDownCard.actionTab.replace('_', ' ').toUpperCase()} &rarr;
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
