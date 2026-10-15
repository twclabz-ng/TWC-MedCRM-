/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CRMProvider, useCRM } from './context/CRMContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { IOSTabBar } from './components/IOSTabBar';
import { Dashboard } from './components/Dashboard';
import { PipelineKanban } from './components/PipelineKanban';
import { SalesActivitiesView } from './components/SalesActivitiesView';
import { WhatsAppHub } from './components/WhatsAppHub';
import { ReferralNetworkView } from './components/ReferralNetworkView';
import { CampaignsView } from './components/CampaignsView';
import { TicketsView } from './components/TicketsView';
import { AutomationStudio } from './components/AutomationStudio';
import { GoogleSuiteHub } from './components/GoogleSuiteHub';
import { TeamDocumentsView } from './components/TeamDocumentsView';
import { MyFilesView } from './components/MyFilesView';
import { LeadDetailModal } from './components/LeadDetailModal';
import { NewLeadModal } from './components/NewLeadModal';
import { NDPAComplianceModal } from './components/NDPAComplianceModal';
import { LoginScreen } from './components/LoginScreen';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { WifiOff, ShieldCheck } from 'lucide-react';

const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-4 left-4 z-50 flex items-center gap-2 rounded-2xl bg-[#FF9500] px-4 py-2.5 text-xs font-bold text-white shadow-xl animate-bounce">
      <WifiOff className="w-4 h-4" />
      <span>Offline Mode — Cached local data active.</span>
    </div>
  );
};

const CRMMainContent: React.FC = () => {
  const { activeTab, setIsNDPAModalOpen, isAuthenticated } = useCRM();

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-[#F2F2F7] flex flex-col font-sans text-slate-900 pb-[max(80px,env(safe-area-inset-bottom))] lg:pb-8 w-full overflow-x-hidden">
      
      {/* iOS Translucent Header */}
      <Header />

      {/* Desktop Panoramic iOS Segmented Sub-Navbar */}
      <Navigation />

      {/* Main Content Area with iOS Inset Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'pipeline' && <PipelineKanban />}
        {activeTab === 'activities' && <SalesActivitiesView />}
        {activeTab === 'whatsapp' && <WhatsAppHub />}
        {activeTab === 'referrals' && <ReferralNetworkView />}
        {activeTab === 'my_files' && <MyFilesView />}
        {(activeTab === 'documents' || activeTab === 'templates') && <TeamDocumentsView />}
        {(activeTab === 'campaigns' || activeTab === 'bulksms_hms') && <CampaignsView />}
        {activeTab === 'tickets' && <TicketsView />}
        {activeTab === 'automations' && <AutomationStudio />}
        {activeTab === 'google_suite' && <GoogleSuiteHub />}
        {activeTab === 'ndpa' && (
          <div className="space-y-4">
            <div className="bg-white p-6 sm:p-8 rounded-[28px] border border-slate-200/80 shadow-xs">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                NDPA 2023 Compliance
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-3 tracking-tight">
                Nigeria Data Protection Act (NDPA 2023) Governance
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                Centralized registry for patient lawful consent verification, clinical purpose limitation audits, and Data Subject Access Requests (DSAR).
              </p>
              <button
                onClick={() => setIsNDPAModalOpen(true)}
                className="mt-5 px-5 py-2.5 rounded-full bg-[#045D6E] text-white font-bold text-xs hover:bg-[#034a58] shadow-md shadow-[#045D6E]/20 ios-pressable"
              >
                Launch NDPA Compliance Center & DSAR Tool
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Desktop Footer (Hidden on mobile to preserve iOS app experience) */}
      <footer className="hidden lg:block mt-auto border-t border-slate-200/70 bg-white/70 ios-blur py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-[5px] bg-[#045D6E] text-white flex items-center justify-center font-black text-[9px]">
              TWC
            </div>
            <span className="font-semibold text-slate-700">TWC CareCRM & Diagnostic Labs</span>
            <span>•</span>
            <span className="text-[#045D6E] font-medium">iOS PWA Ready</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              NDPA 2023 Certified
            </span>
            <span>•</span>
            <span>Google Suite 2-Way Synced</span>
            <span>•</span>
            <span>Wati WhatsApp Verified</span>
          </div>
        </div>
      </footer>

      {/* iOS Mobile Bottom Tab Bar */}
      <IOSTabBar />

      {/* Global Modals (With iOS bottom-sheet responsive drawers) */}
      <LeadDetailModal />
      <NewLeadModal />
      <NDPAComplianceModal />
      <OfflineIndicator />

    </div>
  );
};

export default function App() {
  return (
    <CRMProvider>
      <CRMMainContent />
    </CRMProvider>
  );
}
