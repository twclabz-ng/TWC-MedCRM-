import React from 'react';
import { 
  LayoutDashboard, 
  GitFork, 
  PhoneCall, 
  MessageSquare, 
  UserPlus, 
  Megaphone, 
  LifeBuoy, 
  Zap, 
  FileSpreadsheet, 
  ShieldCheck,
  Receipt,
  Folder
} from 'lucide-react';
import { useCRM } from '../context/CRMContext';

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab, tickets, filteredLeads, invoices, filteredFiles } = useCRM();

  const openTicketsCount = tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length;
  const pendingInvoicesCount = invoices.filter(i => i.status !== 'paid').length;

  const navItems = [
    { id: 'dashboard', label: 'Smart Dashboard', icon: LayoutDashboard },
    { id: 'pipeline', label: 'Pipeline', icon: GitFork, badge: filteredLeads.length },
    { id: 'my_files', label: 'My Files & Drive', icon: Folder, badge: filteredFiles.length, badgeColor: 'bg-teal-600' },
    { id: 'documents', label: 'Team Documents & Invoices', icon: Receipt, badge: pendingInvoicesCount, badgeColor: 'bg-amber-500' },
    { id: 'campaigns', label: 'Marketing Campaigns (Bulk SMS & HMS)', icon: Megaphone },
    { id: 'tickets', label: 'Care Tickets & SLAs', icon: LifeBuoy, badge: openTicketsCount, badgeColor: 'bg-rose-500' },
    { id: 'whatsapp', label: 'WhatsApp (Wati)', icon: MessageSquare, highlight: true },
    { id: 'referrals', label: 'Referrals', icon: UserPlus },
    { id: 'activities', label: 'Sales Activities', icon: PhoneCall },
    { id: 'google_suite', label: 'Google Suite', icon: FileSpreadsheet },
    { id: 'automations', label: 'Automations', icon: Zap },
    { id: 'ndpa', label: 'NDPA Compliance', icon: ShieldCheck },
  ];

  return (
    /* Desktop Panoramic iOS Segmented Control Bar */
    <div className="hidden lg:block bg-[#F2F2F7] border-b border-slate-200/60 py-2.5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-200/70 p-1 rounded-2xl flex items-center space-x-1 overflow-x-auto no-scrollbar shadow-inner">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ios-pressable shrink-0 ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#045D6E]' : item.highlight ? 'text-emerald-600' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`ml-0.5 px-1.5 py-0.2 rounded-full text-[9px] font-bold ${
                    isActive 
                      ? 'bg-[#045D6E] text-white' 
                      : item.badgeColor ? `${item.badgeColor} text-white` : 'bg-slate-300 text-slate-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
