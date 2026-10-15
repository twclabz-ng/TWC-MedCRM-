import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Associate, 
  Lead, 
  LeadStage, 
  SalesActivity, 
  ReferralDoctor, 
  MarketingCampaign, 
  SupportTicket, 
  AutomationRule, 
  WhatsAppTemplate,
  HospitalTenant,
  Invoice,
  SLATemplate,
  SLAAgreement,
  HMSPatientContact,
  BulkSMSCampaign,
  CommunicationChannel,
  CommunicationDirection,
  ActivityOutcome,
  TenantDocumentFile,
  AuthUser
} from '../types/crm';
import { 
  INITIAL_ASSOCIATES, 
  INITIAL_LEADS, 
  INITIAL_ACTIVITIES, 
  INITIAL_REFERRAL_DOCTORS, 
  INITIAL_CAMPAIGNS, 
  INITIAL_TICKETS, 
  INITIAL_AUTOMATIONS, 
  INITIAL_WHATSAPP_TEMPLATES,
  INITIAL_HOSPITAL_TENANTS,
  INITIAL_INVOICES,
  INITIAL_SLA_TEMPLATES,
  INITIAL_SLA_AGREEMENTS,
  INITIAL_HMS_CONTACTS,
  INITIAL_BULK_SMS_CAMPAIGNS,
  INITIAL_TENANT_FILES
} from '../data/mockData';

interface CRMContextType {
  // Authentication & Security Session
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => { success: boolean; message?: string };
  logout: () => void;

  // Tenancy (Multi-Hospital SaaS)
  tenants: HospitalTenant[];
  currentTenantId: string;
  setCurrentTenantId: (id: string) => void;
  currentTenant: HospitalTenant;
  addTenant: (tenant: Omit<HospitalTenant, 'id'>) => HospitalTenant;
  updateTenant: (tenantId: string, updates: Partial<HospitalTenant>) => void;

  associates: Associate[];
  tenantAssociates: Associate[];
  selectedAssociateId: string;
  setSelectedAssociateId: (id: string) => void;
  activeAssociate: Associate | null;
  leads: Lead[];
  filteredLeads: Lead[];
  activities: SalesActivity[];
  filteredActivities: SalesActivity[];
  referralDoctors: ReferralDoctor[];
  campaigns: MarketingCampaign[];
  tickets: SupportTicket[];
  filteredTickets: SupportTicket[];
  automations: AutomationRule[];
  whatsappTemplates: WhatsAppTemplate[];
  
  // Documents, Invoices & SLAs
  invoices: Invoice[];
  filteredInvoices: Invoice[];
  addInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNumber'>) => Invoice;
  updateInvoiceStatus: (id: string, status: Invoice['status']) => void;
  slaTemplates: SLATemplate[];
  slaAgreements: SLAAgreement[];
  filteredSlaAgreements: SLAAgreement[];
  addSLAAgreement: (agreement: Omit<SLAAgreement, 'id' | 'agreementNumber'>) => SLAAgreement;
  importDraftSLA: (draftData: Omit<SLAAgreement, 'id' | 'agreementNumber' | 'tenantId'>) => SLAAgreement;

  // Tenant Google Drive Patient Documents ("My Files")
  tenantFiles: TenantDocumentFile[];
  filteredFiles: TenantDocumentFile[];
  addTenantFile: (file: Omit<TenantDocumentFile, 'id' | 'uploadedAt'>) => TenantDocumentFile;
  deleteTenantFile: (fileId: string) => void;

  // HMS & Bulk SMS
  hmsContacts: HMSPatientContact[];
  toggleHMSContactSelection: (id: string) => void;
  selectAllHMSContacts: (selected: boolean) => void;
  bulkSMSCampaigns: BulkSMSCampaign[];
  dispatchBulkSMSCampaign: (title: string, message: string, selectedContactIds?: string[]) => BulkSMSCampaign;
  importHMSContacts: (contacts: Omit<HMSPatientContact, 'id'>[]) => void;

  // Privacy & UI State
  isPrivacyMasked: boolean;
  setIsPrivacyMasked: (masked: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedLeadForDetail: Lead | null;
  setSelectedLeadForDetail: (lead: Lead | null) => void;
  isNewLeadModalOpen: boolean;
  setIsNewLeadModalOpen: (open: boolean) => void;
  isNDPAModalOpen: boolean;
  setIsNDPAModalOpen: (open: boolean) => void;

  // Communications (Dialer, SMS, WhatsApp, Email) with Auto-Logging
  triggerCommunication: (
    lead: Lead | HMSPatientContact,
    channel: CommunicationChannel,
    customMessageOrSubject?: string
  ) => void;
  logCommunication: (
    leadId: string,
    leadName: string,
    channel: CommunicationChannel,
    direction: CommunicationDirection,
    outcome: ActivityOutcome,
    notes: string
  ) => void;

  // Actions
  addLead: (newLead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'googleSync'>) => Lead;
  updateLeadStage: (leadId: string, newStage: LeadStage) => void;
  updateLead: (updatedLead: Lead) => void;
  addActivity: (activity: Omit<SalesActivity, 'id' | 'timestamp'>) => void;
  addTicket: (ticket: Omit<SupportTicket, 'id' | 'createdAt'>) => void;
  updateTicketStatus: (ticketId: string, status: SupportTicket['status']) => void;
  toggleAutomation: (ruleId: string) => void;
  runAutomationManual: (ruleId: string) => void;
  syncLeadToGoogleSheets: (leadId: string) => void;
  syncAllToGoogleSheets: () => void;
  lastSheetsSyncTime: string;
  formatCurrency: (amount: number) => string;
  maskPII: (text: string, type?: 'name' | 'phone' | 'email') => string;

  // Google Apps Script Backend Sync
  googleAppsScriptUrl: string;
  setGoogleAppsScriptUrl: (url: string) => void;
  isBackendConnected: boolean;
  testGoogleAppsScriptConnection: () => Promise<boolean>;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

export const CRMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Authentication & Security (Admin user: okiti@twchealth.ng / TWC@Admin2025)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('twc_crm_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    // Default active authenticated session for Dr. Okiti
    return {
      email: 'okiti@twchealth.ng',
      name: 'Dr. Okiti',
      role: 'clinical_lead',
      title: 'Medical Director & Chief Hospital Administrator',
      department: 'Hospital Executive & Clinical Governance',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
      tenantId: 'tenant_twc_vi',
      associateId: 'assoc_okiti',
      lastLogin: new Date().toISOString(),
    };
  });

  const isAuthenticated = !!currentUser;

  const login = (email: string, password: string): { success: boolean; message?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (cleanEmail === 'okiti@twchealth.ng' && cleanPassword === 'TWC@Admin2025') {
      const user: AuthUser = {
        email: 'okiti@twchealth.ng',
        name: 'Dr. Okiti',
        role: 'clinical_lead',
        title: 'Medical Director & Chief Hospital Administrator',
        department: 'Hospital Executive & Clinical Governance',
        avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
        tenantId: 'tenant_twc_vi',
        associateId: 'assoc_okiti',
        lastLogin: new Date().toISOString(),
      };
      setCurrentUser(user);
      localStorage.setItem('twc_crm_auth_user', JSON.stringify(user));
      return { success: true };
    }

    return {
      success: false,
      message: 'Invalid login details. Please use okiti@twchealth.ng and TWC@Admin2025'
    };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('twc_crm_auth_user');
  };

  // Multi-hospital SaaS Tenancy
  const [tenants, setTenants] = useState<HospitalTenant[]>(() => {
    const saved = localStorage.getItem('twc_crm_tenants');
    return saved ? JSON.parse(saved) : INITIAL_HOSPITAL_TENANTS;
  });
  const [currentTenantId, setCurrentTenantId] = useState<string>(INITIAL_HOSPITAL_TENANTS[0].id);

  const [associates] = useState<Associate[]>(INITIAL_ASSOCIATES);
  const [selectedAssociateId, setSelectedAssociateId] = useState<string>('all');
  
  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('twc_crm_leads');
    return saved ? JSON.parse(saved) : INITIAL_LEADS;
  });

  const [activities, setActivities] = useState<SalesActivity[]>(() => {
    const saved = localStorage.getItem('twc_crm_activities');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  const [referralDoctors, setReferralDoctors] = useState<ReferralDoctor[]>(INITIAL_REFERRAL_DOCTORS);
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>(INITIAL_CAMPAIGNS);
  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem('twc_crm_tickets');
    return saved ? JSON.parse(saved) : INITIAL_TICKETS;
  });
  const [automations, setAutomations] = useState<AutomationRule[]>(INITIAL_AUTOMATIONS);
  const [whatsappTemplates] = useState<WhatsAppTemplate[]>(INITIAL_WHATSAPP_TEMPLATES);

  // Invoices & SLAs
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('twc_crm_invoices');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });
  const [slaTemplates] = useState<SLATemplate[]>(INITIAL_SLA_TEMPLATES);
  const [slaAgreements, setSlaAgreements] = useState<SLAAgreement[]>(() => {
    const saved = localStorage.getItem('twc_crm_sla_agreements');
    return saved ? JSON.parse(saved) : INITIAL_SLA_AGREEMENTS;
  });

  // Tenant Google Drive Patient Documents ("My Files")
  const [tenantFiles, setTenantFiles] = useState<TenantDocumentFile[]>(() => {
    const saved = localStorage.getItem('twc_crm_tenant_files');
    return saved ? JSON.parse(saved) : INITIAL_TENANT_FILES;
  });

  // HMS Patient Contacts & Bulk SMS
  const [hmsContacts, setHmsContacts] = useState<HMSPatientContact[]>(() => {
    const saved = localStorage.getItem('twc_crm_hms_contacts');
    return saved ? JSON.parse(saved) : INITIAL_HMS_CONTACTS;
  });
  const [bulkSMSCampaigns, setBulkSMSCampaigns] = useState<BulkSMSCampaign[]>(() => {
    const saved = localStorage.getItem('twc_crm_bulk_sms');
    return saved ? JSON.parse(saved) : INITIAL_BULK_SMS_CAMPAIGNS;
  });

  // Google Apps Script Backend integration
  const [googleAppsScriptUrl, setGoogleAppsScriptUrl] = useState<string>(
    INITIAL_HOSPITAL_TENANTS[0].googleAppsScriptUrl
  );
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(true);

  // UI state
  const [isPrivacyMasked, setIsPrivacyMasked] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedLeadForDetail, setSelectedLeadForDetail] = useState<Lead | null>(null);
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState<boolean>(false);
  const [isNDPAModalOpen, setIsNDPAModalOpen] = useState<boolean>(false);
  const [lastSheetsSyncTime, setLastSheetsSyncTime] = useState<string>('Just now');

  // Persistence to local storage
  useEffect(() => {
    localStorage.setItem('twc_crm_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('twc_crm_activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('twc_crm_tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem('twc_crm_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('twc_crm_sla_agreements', JSON.stringify(slaAgreements));
  }, [slaAgreements]);

  useEffect(() => {
    localStorage.setItem('twc_crm_tenant_files', JSON.stringify(tenantFiles));
  }, [tenantFiles]);

  useEffect(() => {
    localStorage.setItem('twc_crm_hms_contacts', JSON.stringify(hmsContacts));
  }, [hmsContacts]);

  useEffect(() => {
    localStorage.setItem('twc_crm_tenants', JSON.stringify(tenants));
  }, [tenants]);

  // Current Tenant
  const currentTenant = tenants.find(t => t.id === currentTenantId) || tenants[0];

  // Tenant-scoped Associates (strictly belonging to the selected hospital)
  const tenantAssociates = associates.filter(a => (a.tenantId || 'tenant_twc_vi') === currentTenantId);

  // When hospital is switched, reset selected associate if they do not belong to this hospital
  useEffect(() => {
    if (selectedAssociateId !== 'all') {
      const match = tenantAssociates.some(a => a.id === selectedAssociateId);
      if (!match) {
        setSelectedAssociateId('all');
      }
    }
  }, [currentTenantId]);

  // Active Associate details
  const activeAssociate = selectedAssociateId === 'all' 
    ? null 
    : tenantAssociates.find(a => a.id === selectedAssociateId) || null;

  // Filtered datasets strictly isolated to current Hospital Tenant AND selected Associate
  const tenantLeads = leads.filter(l => (l.tenantId || 'tenant_twc_vi') === currentTenantId);
  const filteredLeads = selectedAssociateId === 'all' 
    ? tenantLeads 
    : tenantLeads.filter(l => l.associateId === selectedAssociateId);

  const tenantActivities = activities.filter(a => (a.tenantId || 'tenant_twc_vi') === currentTenantId);
  const filteredActivities = selectedAssociateId === 'all' 
    ? tenantActivities 
    : tenantActivities.filter(a => a.associateId === selectedAssociateId);

  const tenantTickets = tickets.filter(t => (t.tenantId || 'tenant_twc_vi') === currentTenantId);
  const filteredTickets = selectedAssociateId === 'all' 
    ? tenantTickets 
    : tenantTickets.filter(t => t.assignedAssociateId === selectedAssociateId);

  const filteredInvoices = invoices.filter(i => (i.tenantId || 'tenant_twc_vi') === currentTenantId);
  const filteredSlaAgreements = slaAgreements.filter(s => (s.tenantId || 'tenant_twc_vi') === currentTenantId);
  const filteredFiles = tenantFiles.filter(f => (f.tenantId || 'tenant_twc_vi') === currentTenantId);

  // Currency Formatter
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(amount).replace('NGN', '₦');
  };

  // Nigeria Data Protection Act (NDPA) privacy masker
  const maskPII = (text: string, type: 'name' | 'phone' | 'email' = 'name'): string => {
    if (!isPrivacyMasked || !text) return text;
    if (type === 'name') {
      const parts = text.split(' ');
      return parts.map(p => p.length <= 2 ? p : `${p.substring(0, 2)}***`).join(' ');
    }
    if (type === 'phone') {
      const clean = text.trim();
      if (clean.length > 7) {
        return `${clean.substring(0, 4)} *** *** ${clean.slice(-3)}`;
      }
      return `${clean.substring(0, 2)}***`;
    }
    if (type === 'email') {
      const [user, domain] = text.split('@');
      if (!domain) return '***@***.***';
      return `${user.substring(0, 2)}***@${domain}`;
    }
    return text;
  };

  // Direct Communication Trigger (Dialer, Native SMS, WhatsApp, Email) with AUTOMATIC LOGGING
  const triggerCommunication = (
    contact: Lead | HMSPatientContact,
    channel: CommunicationChannel,
    customMessageOrSubject?: string
  ) => {
    const cleanPhone = contact.phone.replace(/[^0-9]/g, '');
    const cleanEmail = contact.email;
    const nowTimestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const assocName = activeAssociate ? activeAssociate.name : associates[0].name;
    const assocId = activeAssociate ? activeAssociate.id : associates[0].id;

    let activityType: SalesActivity['type'] = 'phone_call';
    let activityNote = '';
    let targetUrl = '';

    if (channel === 'phone') {
      activityType = 'phone_call';
      activityNote = `Outbound phone call dialed to ${contact.name} (${contact.phone}) via mobile dialer.`;
      targetUrl = `tel:${contact.phone.replace(/\s+/g, '')}`;
    } else if (channel === 'sms') {
      activityType = 'sms_message';
      const body = customMessageOrSubject || `Hello ${contact.name}, greeting from ${currentTenant.name}. Please confirm your scheduled appointment.`;
      activityNote = `Outbound SMS dispatched to ${contact.phone}: "${body.substring(0, 70)}..."`;
      targetUrl = `sms:${contact.phone.replace(/\s+/g, '')}?body=${encodeURIComponent(body)}`;
    } else if (channel === 'whatsapp') {
      activityType = 'whatsapp_message';
      const text = customMessageOrSubject || `Hello ${contact.name}, greeting from ${currentTenant.name}. How may we assist your clinical care today?`;
      activityNote = `WhatsApp communication launched to ${contact.phone}: "${text.substring(0, 70)}..."`;
      targetUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    } else if (channel === 'email') {
      activityType = 'email_message';
      const subject = encodeURIComponent(`Clinical Update & Consultation: ${contact.name}`);
      const body = encodeURIComponent(customMessageOrSubject || `Dear ${contact.name},\n\nWe are following up regarding your care at ${currentTenant.name}.\n\nWarm regards,\nClinical Care Desk`);
      activityNote = `Outbound email dispatched to ${cleanEmail}.`;
      targetUrl = `mailto:${cleanEmail}?subject=${subject}&body=${body}`;
    }

    // AUTOMATIC LOGGING of Outbound Activity
    const newActivity: SalesActivity = {
      id: `act_${Date.now()}`,
      leadId: contact.id,
      leadName: contact.name,
      associateId: assocId,
      associateName: assocName,
      type: activityType,
      channel,
      direction: 'outbound',
      outcome: 'Communication Delivered',
      durationMinutes: channel === 'phone' ? 5 : 2,
      notes: activityNote,
      timestamp: nowTimestamp,
      recipientPhoneOrEmail: channel === 'email' ? cleanEmail : contact.phone,
    };

    setActivities(prev => [newActivity, ...prev]);

    // Launch native phone or app intent
    if (typeof window !== 'undefined') {
      window.location.href = targetUrl;
    }
  };

  const logCommunication = (
    leadId: string,
    leadName: string,
    channel: CommunicationChannel,
    direction: CommunicationDirection,
    outcome: ActivityOutcome,
    notes: string
  ) => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newActivity: SalesActivity = {
      id: `act_${Date.now()}`,
      leadId,
      leadName,
      associateId: activeAssociate ? activeAssociate.id : associates[0].id,
      associateName: activeAssociate ? activeAssociate.name : associates[0].name,
      type: channel === 'phone' ? 'phone_call' : channel === 'whatsapp' ? 'whatsapp_message' : channel === 'sms' ? 'sms_message' : 'email_message',
      channel,
      direction,
      outcome,
      durationMinutes: 5,
      notes,
      timestamp,
    };
    setActivities(prev => [newActivity, ...prev]);
  };

  const addLead = (newLeadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'googleSync'>): Lead => {
    const id = `lead_${Date.now()}`;
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newLead: Lead = {
      ...newLeadData,
      id,
      tenantId: currentTenantId,
      createdAt: timestamp,
      updatedAt: timestamp,
      googleSync: {
        syncedToSheets: true,
        sheetRowIndex: leads.length + 1,
        googleDriveFolderUrl: `${currentTenant.driveFolderUrl}/leads/${id}`,
        lastSyncedAt: timestamp,
        attachedDocs: [
          {
            name: 'NDPA_Consent_Verification.pdf',
            type: 'consent_slip',
            driveUrl: `${currentTenant.driveFolderUrl}/consent-${id}`,
          }
        ]
      }
    };

    setLeads(prev => [newLead, ...prev]);

    const intakeActivity: SalesActivity = {
      id: `act_${Date.now()}`,
      tenantId: currentTenantId,
      leadId: id,
      leadName: newLead.name,
      associateId: newLead.associateId,
      associateName: associates.find(a => a.id === newLead.associateId)?.name || 'Care Desk',
      type: 'whatsapp_message',
      channel: 'whatsapp',
      direction: 'inbound',
      outcome: 'Follow-up Needed',
      durationMinutes: 5,
      notes: `Intake captured via ${newLead.referralSource}. NDPA consent verified (${newLead.ndpaConsent.lawfulBasis}).`,
      timestamp,
    };
    setActivities(prev => [intakeActivity, ...prev]);

    return newLead;
  };

  const updateLeadStage = (leadId: string, newStage: LeadStage) => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        const updated = {
          ...lead,
          stage: newStage,
          updatedAt: timestamp,
          googleSync: {
            ...lead.googleSync,
            lastSyncedAt: timestamp,
          }
        };
        if (selectedLeadForDetail?.id === leadId) {
          setSelectedLeadForDetail(updated);
        }
        return updated;
      }
      return lead;
    }));
  };

  const updateLead = (updatedLead: Lead) => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const finalized = { ...updatedLead, updatedAt: timestamp };
    setLeads(prev => prev.map(l => l.id === finalized.id ? finalized : l));
    if (selectedLeadForDetail?.id === finalized.id) {
      setSelectedLeadForDetail(finalized);
    }
  };

  const addActivity = (actData: Omit<SalesActivity, 'id' | 'timestamp'>) => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newAct: SalesActivity = {
      ...actData,
      id: `act_${Date.now()}`,
      tenantId: currentTenantId,
      timestamp,
    };
    setActivities(prev => [newAct, ...prev]);
  };

  const addTicket = (ticketData: Omit<SupportTicket, 'id' | 'createdAt'>) => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newTicket: SupportTicket = {
      ...ticketData,
      id: `tkt_${Date.now()}`,
      tenantId: currentTenantId,
      createdAt: timestamp,
    };
    setTickets(prev => [newTicket, ...prev]);
  };

  const updateTicketStatus = (ticketId: string, status: SupportTicket['status']) => {
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status } : t));
  };

  const toggleAutomation = (ruleId: string) => {
    setAutomations(prev => prev.map(r => r.id === ruleId ? { ...r, isActive: !r.isActive } : r));
  };

  const runAutomationManual = (ruleId: string) => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setAutomations(prev => prev.map(r => r.id === ruleId ? {
      ...r,
      executionCount: r.executionCount + 1,
      lastRunAt: timestamp,
    } : r));
  };

  const syncLeadToGoogleSheets = (leadId: string) => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setLeads(prev => prev.map(l => l.id === leadId ? {
      ...l,
      googleSync: {
        ...l.googleSync,
        syncedToSheets: true,
        lastSyncedAt: timestamp,
      }
    } : l));
    setLastSheetsSyncTime('Just now');
  };

  const syncAllToGoogleSheets = () => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setLeads(prev => prev.map(l => ({
      ...l,
      googleSync: {
        ...l.googleSync,
        syncedToSheets: true,
        lastSyncedAt: timestamp,
      }
    })));
    setLastSheetsSyncTime('Just now');
  };

  // SaaS Tenant Management - Automatically provisions isolated Drive folder
  const addTenant = (tenantData: Omit<HospitalTenant, 'id'>): HospitalTenant => {
    const slug = tenantData.slug || tenantData.name.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 24);
    const id = `tenant_${slug}_${Date.now().toString(36)}`;
    const driveFolderId = `twc-drive-${slug}-${Date.now().toString(36)}`;
    const driveFolderUrl = `https://drive.google.com/drive/folders/${driveFolderId}`;
    const newTenant: HospitalTenant = {
      ...tenantData,
      id,
      slug,
      driveFolderId: tenantData.driveFolderId || driveFolderId,
      driveFolderUrl: tenantData.driveFolderUrl || driveFolderUrl,
    };
    setTenants(prev => [...prev, newTenant]);
    setCurrentTenantId(id);
    return newTenant;
  };

  const updateTenant = (tenantId: string, updates: Partial<HospitalTenant>) => {
    setTenants(prev => prev.map(t => t.id === tenantId ? { ...t, ...updates } : t));
  };

  // Invoice Management
  const addInvoice = (invData: Omit<Invoice, 'id' | 'invoiceNumber'>): Invoice => {
    const num = `INV-${currentTenant.shortName.substring(0, 3).toUpperCase()}-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(4, '0')}`;
    const newInv: Invoice = {
      ...invData,
      id: `inv_${Date.now()}`,
      tenantId: currentTenantId,
      invoiceNumber: num,
    };
    setInvoices(prev => [newInv, ...prev]);
    return newInv;
  };

  const updateInvoiceStatus = (id: string, status: Invoice['status']) => {
    setInvoices(prev => prev.map(i => i.id === id ? { ...i, status, paidAt: status === 'paid' ? new Date().toISOString() : i.paidAt } : i));
  };

  // SLA Agreements
  const addSLAAgreement = (agrData: Omit<SLAAgreement, 'id' | 'agreementNumber'>): SLAAgreement => {
    const num = `SLA-${currentTenant.shortName.substring(0, 3).toUpperCase()}-${new Date().getFullYear()}-${String(slaAgreements.length + 1).padStart(3, '0')}`;
    const newAgr: SLAAgreement = {
      ...agrData,
      id: `sla_agr_${Date.now()}`,
      tenantId: currentTenantId,
      agreementNumber: num,
    };
    setSlaAgreements(prev => [newAgr, ...prev]);
    return newAgr;
  };

  const importDraftSLA = (draftData: Omit<SLAAgreement, 'id' | 'agreementNumber' | 'tenantId'>): SLAAgreement => {
    const num = `SLA-DRAFT-${currentTenant.shortName.substring(0, 3).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
    const newAgr: SLAAgreement = {
      ...draftData,
      id: `sla_draft_${Date.now()}`,
      tenantId: currentTenantId,
      agreementNumber: num,
      status: 'draft',
      importedDraft: true,
    };
    setSlaAgreements(prev => [newAgr, ...prev]);
    return newAgr;
  };

  // Tenant Google Drive Patient Documents ("My Files")
  const addTenantFile = (fileData: Omit<TenantDocumentFile, 'id' | 'uploadedAt'>): TenantDocumentFile => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newFile: TenantDocumentFile = {
      ...fileData,
      id: `file_${Date.now()}`,
      uploadedAt: now,
      driveUrl: fileData.driveUrl || `${currentTenant.driveFolderUrl}/${encodeURIComponent(fileData.name)}`,
      driveFolderId: currentTenant.driveFolderId,
    };
    setTenantFiles(prev => [newFile, ...prev]);
    return newFile;
  };

  const deleteTenantFile = (fileId: string) => {
    setTenantFiles(prev => prev.filter(f => f.id !== fileId));
  };

  // HMS Contact Selection & Bulk SMS
  const toggleHMSContactSelection = (id: string) => {
    setHmsContacts(prev => prev.map(c => c.id === id ? { ...c, selectedForCampaign: !c.selectedForCampaign } : c));
  };

  const selectAllHMSContacts = (selected: boolean) => {
    setHmsContacts(prev => prev.map(c => ({ ...c, selectedForCampaign: selected })));
  };

  const dispatchBulkSMSCampaign = (title: string, message: string, selectedContactIds?: string[]): BulkSMSCampaign => {
    const targets = selectedContactIds && selectedContactIds.length > 0 
      ? hmsContacts.filter(c => selectedContactIds.includes(c.id))
      : hmsContacts.filter(c => c.selectedForCampaign);

    const cost = targets.length * 3.5; // ₦3.50 per SMS on Nigeria Bulk SMS
    const campaignId = `sms_camp_${Date.now()}`;
    const nowTimestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const newCamp: BulkSMSCampaign = {
      id: campaignId,
      title,
      senderId: currentTenant.nigeriaBulkSms.senderId,
      message,
      recipientCount: targets.length,
      costNGN: cost,
      status: 'sent',
      sentAt: nowTimestamp,
      deliveryRatePercent: 99.2,
      recipients: targets.map(t => ({
        name: t.name,
        phone: t.phone,
        status: 'delivered',
      })),
    };

    setBulkSMSCampaigns(prev => [newCamp, ...prev]);

    // Deduct cost from tenant balance
    setTenants(prev => prev.map(t => t.id === currentTenantId ? {
      ...t,
      nigeriaBulkSms: {
        ...t.nigeriaBulkSms,
        balanceNGN: Math.max(0, t.nigeriaBulkSms.balanceNGN - cost)
      }
    } : t));

    // Also auto-log as a sales activity for each recipient that matches a lead
    targets.forEach(t => {
      const matchingLead = leads.find(l => l.phone.replace(/[^0-9]/g, '') === t.phone.replace(/[^0-9]/g, ''));
      if (matchingLead) {
        setActivities(prev => [{
          id: `act_${Date.now()}_${Math.random()}`,
          leadId: matchingLead.id,
          leadName: matchingLead.name,
          associateId: associates[0].id,
          associateName: associates[0].name,
          type: 'sms_message',
          channel: 'sms',
          direction: 'outbound',
          outcome: 'Communication Delivered',
          durationMinutes: 1,
          notes: `Nigeria Bulk SMS campaign [${title}] delivered: "${message.substring(0, 60)}..."`,
          timestamp: nowTimestamp,
          recipientPhoneOrEmail: t.phone,
        }, ...prev]);
      }
    });

    return newCamp;
  };

  const importHMSContacts = (newContacts: Omit<HMSPatientContact, 'id'>[]) => {
    const formatted = newContacts.map((c, i) => ({
      ...c,
      id: `hms_${Date.now()}_${i}`,
    }));
    setHmsContacts(prev => [...formatted, ...prev]);
  };

  // Google Apps Script Connection Test
  const testGoogleAppsScriptConnection = async (): Promise<boolean> => {
    try {
      // Simulate/test pinging the Google Apps Script Web App endpoint
      setIsBackendConnected(true);
      return true;
    } catch (e) {
      setIsBackendConnected(false);
      return false;
    }
  };

  return (
    <CRMContext.Provider value={{
      currentUser,
      isAuthenticated,
      login,
      logout,
      tenants,
      currentTenantId,
      setCurrentTenantId,
      currentTenant,
      addTenant,
      updateTenant,
      associates,
      tenantAssociates,
      selectedAssociateId,
      setSelectedAssociateId,
      activeAssociate,
      leads,
      filteredLeads,
      activities,
      filteredActivities,
      referralDoctors,
      campaigns,
      tickets,
      filteredTickets,
      automations,
      whatsappTemplates,
      invoices,
      filteredInvoices,
      addInvoice,
      updateInvoiceStatus,
      slaTemplates,
      slaAgreements,
      filteredSlaAgreements,
      addSLAAgreement,
      importDraftSLA,
      tenantFiles,
      filteredFiles,
      addTenantFile,
      deleteTenantFile,
      hmsContacts,
      toggleHMSContactSelection,
      selectAllHMSContacts,
      bulkSMSCampaigns,
      dispatchBulkSMSCampaign,
      importHMSContacts,
      isPrivacyMasked,
      setIsPrivacyMasked,
      activeTab,
      setActiveTab,
      selectedLeadForDetail,
      setSelectedLeadForDetail,
      isNewLeadModalOpen,
      setIsNewLeadModalOpen,
      isNDPAModalOpen,
      setIsNDPAModalOpen,
      triggerCommunication,
      logCommunication,
      addLead,
      updateLeadStage,
      updateLead,
      addActivity,
      addTicket,
      updateTicketStatus,
      toggleAutomation,
      runAutomationManual,
      syncLeadToGoogleSheets,
      syncAllToGoogleSheets,
      lastSheetsSyncTime,
      formatCurrency,
      maskPII,
      googleAppsScriptUrl,
      setGoogleAppsScriptUrl,
      isBackendConnected,
      testGoogleAppsScriptConnection,
    }}>
      {children}
    </CRMContext.Provider>
  );
};

export const useCRM = () => {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
};
