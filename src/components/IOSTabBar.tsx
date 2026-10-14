import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  GitFork, 
  MessageSquare, 
  QrCode, 
  MoreHorizontal, 
  PhoneCall, 
  LifeBuoy, 
  Megaphone, 
  FileSpreadsheet, 
  Zap, 
  ShieldCheck, 
  X,
  ChevronRight,
  Receipt,
  Folder
} from 'lucide-react';
import { useCRM } from '../context/CRMContext';

export const IOSTabBar: React.FC = () => {
  const { activeTab, setActiveTab, tickets, filteredLeads, invoices, filteredFiles, setIsNDPAModalOpen } = useCRM();
  const [isMoreSheetOpen, setIsMoreSheetOpen] = useState(false);

  const openTicketsCount = tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length;
  const pendingInvoicesCount = invoices.filter(i => i.status !== 'paid').length;

  const primaryTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pipeline', label: 'Pipeline', icon: GitFork, badge: filteredLeads.length },
    { id: 'my_files', label: 'My Files', icon: Folder, badge: filteredFiles.length },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare, highlight: true },
  ];

  const moreItems = [
    { id: 'documents', label: 'Team Documents & Invoices', icon: Receipt, badge: pendingInvoicesCount, badgeColor: 'bg-amber-500', desc: 'Invoices, hospital SLAs & team templates' },
    { id: 'campaigns', label: 'Marketing Campaigns & Bulk SMS', icon: Megaphone, desc: 'Health drives, Nigeria Bulk SMS & HMS contacts' },
    { id: 'tickets', label: 'Care Tickets & SLAs', icon: LifeBuoy, badge: openTicketsCount, badgeColor: 'bg-rose-500', desc: 'Customer service & triage desk' },
    { id: 'referrals', label: 'Referral Network', icon: QrCode, desc: 'Referring doctor portal & QR codes' },
    { id: 'activities', label: 'Sales & Clinic Activities', icon: PhoneCall, desc: 'Log doctor calls, visits & detailing' },
    { id: 'google_suite', label: 'Google Suite & Apps Script', icon: FileSpreadsheet, desc: 'Sheets sync, Drive files & Webhooks' },
    { id: 'automations', label: 'Automation Studio', icon: Zap, desc: 'Wati & Zoho workflow triggers' },
    { id: 'ndpa', label: 'NDPA 2023 Compliance', icon: ShieldCheck, desc: 'Data protection charter & DSAR' },
  ];

  const isMoreActive = moreItems.some(item => item.id === activeTab);

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    setIsMoreSheetOpen(false);
  };

  return (
    <>
      {/* iOS Floating / Fixed Bottom Tab Bar */}
      <nav 
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/85 ios-blur border-t border-slate-200/80 pb-[max(8px,env(safe-area-inset-bottom))] pt-1.5 px-3 shadow-lg"
        aria-label="iOS Navigation"
      >
        <div className="flex items-center justify-around max-w-md mx-auto">
          {primaryTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleSelectTab(tab.id)}
                className={`flex flex-col items-center justify-center py-1 px-3 relative ios-pressable ${
                  isActive ? 'text-[#045D6E]' : 'text-[#8E8E93] hover:text-slate-700'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'}`} />
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="absolute -top-1 -right-2 px-1 min-w-[15px] h-[15px] rounded-full bg-[#FF3B30] text-white text-[9px] font-bold flex items-center justify-center">
                      {tab.badge}
                    </span>
                  )}
                  {tab.highlight && !isActive && (
                    <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  )}
                </div>
                <span className={`text-[10px] mt-1 tracking-tight ${isActive ? 'font-bold' : 'font-medium'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}

          {/* More Tab Button */}
          <button
            onClick={() => setIsMoreSheetOpen(true)}
            className={`flex flex-col items-center justify-center py-1 px-3 relative ios-pressable ${
              isMoreActive ? 'text-[#045D6E]' : 'text-[#8E8E93] hover:text-slate-700'
            }`}
          >
            <div className="relative">
              <MoreHorizontal className={`w-5 h-5 transition-transform ${isMoreActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'}`} />
              {openTicketsCount > 0 && (
                <span className="absolute -top-1 -right-2 px-1 min-w-[15px] h-[15px] rounded-full bg-[#FF3B30] text-white text-[9px] font-bold flex items-center justify-center">
                  {openTicketsCount}
                </span>
              )}
            </div>
            <span className={`text-[10px] mt-1 tracking-tight ${isMoreActive ? 'font-bold' : 'font-medium'}`}>
              More
            </span>
          </button>
        </div>
      </nav>

      {/* iOS Action Sheet / Bottom Sheet for "More" Menu */}
      {isMoreSheetOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
          {/* Backdrop with iOS blur */}
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setIsMoreSheetOpen(false)}
          />

          {/* Bottom Sheet Card */}
          <div className="relative w-full bg-[#F2F2F7] rounded-t-[28px] shadow-2xl z-50 max-h-[85vh] flex flex-col pb-[max(16px,env(safe-area-inset-bottom))] animate-in slide-in-from-bottom duration-250">
            
            {/* Grabber pill */}
            <div className="w-10 h-1.5 rounded-full bg-slate-300 mx-auto mt-3 mb-2" />

            {/* Sheet Header */}
            <div className="px-5 py-2 flex items-center justify-between border-b border-slate-200/80">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">Hospital Services & Tools</h3>
                <p className="text-[11px] text-slate-500">Sales activities, tickets, automations & NDPA compliance</p>
              </div>
              <button 
                onClick={() => setIsMoreSheetOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200/80 text-slate-600 flex items-center justify-center text-xs font-bold ios-pressable"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Inset Grouped List */}
            <div className="p-4 overflow-y-auto space-y-2">
              <div className="bg-white rounded-2xl shadow-2xs border border-slate-200/70 divide-y divide-slate-100 overflow-hidden">
                {moreItems.map((item) => {
                  const Icon = item.icon;
                  const isCurrent = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectTab(item.id)}
                      className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 active:bg-slate-100 transition-colors ios-pressable"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          isCurrent ? 'bg-[#045D6E] text-white' : 'bg-slate-100 text-slate-700'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className={`text-xs sm:text-sm tracking-tight ${isCurrent ? 'font-bold text-[#045D6E]' : 'font-semibold text-slate-900'}`}>
                            {item.label}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            {item.desc}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        {item.badge !== undefined && item.badge > 0 && (
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-white ${item.badgeColor || 'bg-[#045D6E]'}`}>
                            {item.badge}
                          </span>
                        )}
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
