export type AssociateRole = 'sales' | 'marketing' | 'customer_service' | 'clinical_lead';

export interface Associate {
  id: string;
  tenantId?: string;
  name: string;
  role: AssociateRole;
  title: string;
  department: string;
  avatar: string;
  phone: string;
  email: string;
  activeLeadsCount: number;
  closedRevenueNGN: number;
  monthlyTargetNGN: number;
  satisfactionScore: number;
}

export type FunnelType = 'patient' | 'corporate_retainer';

export type PatientStage = 
  | 'inquiry' 
  | 'triage' 
  | 'consultation_booked' 
  | 'diagnostics_lab' 
  | 'treatment_plan' 
  | 'retention_followup';

export type CorporateStage = 
  | 'lead_inbound' 
  | 'discovery_audit' 
  | 'pitch_proposal' 
  | 'mou_review' 
  | 'contract_signed' 
  | 'active_retainer';

export type LeadStage = PatientStage | CorporateStage;

export type ActivityType = 
  | 'phone_call' 
  | 'whatsapp_message' 
  | 'sms_message'
  | 'email_message'
  | 'clinic_tour' 
  | 'corporate_meeting' 
  | 'doctor_detailing' 
  | 'followup';

export type CommunicationChannel = 'phone' | 'sms' | 'whatsapp' | 'email';
export type CommunicationDirection = 'outbound' | 'inbound';

export type ActivityOutcome = 
  | 'Scheduled Consultation' 
  | 'Sent Retainer MOU' 
  | 'Diagnostic Booked' 
  | 'Follow-up Needed' 
  | 'Objection - HMO Delay' 
  | 'Objection - Budget' 
  | 'Closed Won' 
  | 'Unresponsive'
  | 'Communication Delivered';

export interface SalesActivity {
  id: string;
  tenantId?: string;
  leadId: string;
  leadName: string;
  associateId: string;
  associateName: string;
  type: ActivityType;
  outcome: ActivityOutcome;
  durationMinutes: number;
  notes: string;
  timestamp: string;
  nextFollowUpDate?: string;
  channel?: CommunicationChannel;
  direction?: CommunicationDirection;
  recipientPhoneOrEmail?: string;
}

export interface NDPAConsent {
  consented: boolean;
  timestamp: string;
  lawfulBasis: 'Explicit Patient Consent' | 'Vital Interests' | 'Contractual Retainer' | 'Preventive Medicine & Diagnostics';
  purpose: string;
  consentChannel: 'WhatsApp Verification' | 'Google Form Intake' | 'In-Clinic Check-in' | 'Corporate MOU';
  verifiedByAssociate: string;
}

export interface GoogleSuiteSync {
  syncedToSheets: boolean;
  sheetRowIndex?: number;
  googleDriveFolderUrl: string;
  lastSyncedAt: string;
  attachedDocs: {
    name: string;
    type: 'lab_report' | 'retainer_mou' | 'referral_letter' | 'consent_slip' | 'radiology_scan' | 'invoice_pdf' | 'sla_contract';
    driveUrl: string;
  }[];
}

export interface Lead {
  id: string;
  tenantId?: string;
  type: FunnelType;
  name: string;
  companyName?: string;
  contactPerson?: string;
  phone: string;
  email: string;
  gender?: 'Male' | 'Female' | 'Other';
  age?: number;
  location: string;
  associateId: string;
  stage: LeadStage;
  expectedValueNGN: number;
  probabilityPercent: number;
  clinicalInterest: string;
  referralSource: 
    | 'Doctor Referral' 
    | 'Partner Clinic' 
    | 'WhatsApp Inbound' 
    | 'Google Form Intake' 
    | 'Corporate Outreach' 
    | 'Marketing Campaign'
    | 'Direct Walk-in';
  referringDoctorId?: string;
  referringDoctorName?: string;
  referringHospital?: string;
  referralHonorariumNGN?: number;
  referralStatus?: 'pending' | 'verified' | 'paid';
  ndpaConsent: NDPAConsent;
  googleSync: GoogleSuiteSync;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ReferralDoctor {
  id: string;
  name: string;
  title: string;
  specialty: string;
  hospitalOrClinic: string;
  phone: string;
  whatsapp: string;
  email: string;
  referralCode: string;
  qrCodeToken: string;
  totalReferralsCount: number;
  convertedCount: number;
  totalEarnedNGN: number;
  pendingPayoutNGN: number;
  bankAccount: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
}

export interface MarketingCampaign {
  id: string;
  tenantId?: string;
  title: string;
  targetAudience: string;
  channel: 'WhatsApp Broadcast' | 'Corporate Email' | 'Health Outreach' | 'Doctor Seminar' | 'Digital Ads' | 'Nigeria Bulk SMS';
  budgetNGN: number;
  leadsGenerated: number;
  convertedRevenueNGN: number;
  status: 'active' | 'scheduled' | 'completed';
  startDate: string;
  endDate: string;
  watiBroadcastTemplateId?: string;
  bulkSmsCampaignId?: string;
}

export interface SupportTicket {
  id: string;
  tenantId?: string;
  patientOrCompanyName: string;
  phone: string;
  leadId?: string;
  category: 
    | 'Lab Report Delay' 
    | 'Billing & HMO Dispute' 
    | 'Appointment Reschedule' 
    | 'Doctor Consultation Query' 
    | 'Home Sample Phlebotomy'
    | 'Turnaround Time SLA Complaint';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  status: 'open' | 'in_progress' | 'resolved' | 'escalated';
  assignedAssociateId: string;
  slaHoursLeft: number;
  createdAt: string;
  description: string;
  resolutionNotes?: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  triggerEvent: 
    | 'on_stage_change' 
    | 'on_google_form_intake' 
    | 'on_referral_created' 
    | 'on_ticket_opened';
  conditionDesc: string;
  actionType: 
    | 'send_whatsapp_template' 
    | 'assign_associate' 
    | 'sync_google_sheet' 
    | 'create_google_drive_folder' 
    | 'alert_sales_rep';
  actionSummary: string;
  isActive: boolean;
  lastRunAt?: string;
  executionCount: number;
}

export interface WhatsAppTemplate {
  id: string;
  title: string;
  category: 'appointment' | 'prep' | 'marketing' | 'proposal' | 'referral' | 'discharge';
  language: 'en_NG';
  text: string;
  variables: string[];
}

// MULTI-HOSPITAL SAAS TENANCY
export interface HospitalTenant {
  id: string;
  name: string;
  shortName: string;
  slug: string;
  tagline: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  website: string;
  cacNumber: string;
  tinNumber: string;
  primaryColor: string;
  logoUrl?: string;
  driveFolderUrl?: string;
  driveFolderId?: string;
  invoiceFooterNote?: string;
  defaultSlaTerms?: string;
  authorizedSignatoryName?: string;
  authorizedSignatoryTitle?: string;
  bankDetails: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
  googleAppsScriptUrl: string;
  nigeriaBulkSms: {
    senderId: string;
    apiKey: string;
    balanceNGN: number;
  };
}

// INVOICE & FINANCIALS
export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPriceNGN: number;
  amountNGN: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  tenantId: string;
  leadId?: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  clientAddress?: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotalNGN: number;
  vatPercent: number;
  vatAmountNGN: number;
  discountPercent: number;
  discountAmountNGN: number;
  totalNGN: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  paymentNotes?: string;
  paidAt?: string;
}

// SERVICE LEVEL AGREEMENT (SLA) & CONTRACT TEMPLATES
export interface SLATemplate {
  id: string;
  title: string;
  type: 'corporate_retainer' | 'referral_doctor' | 'diagnostic_outsourcing';
  description: string;
  defaultTurnaroundHours: number;
  retainerTerms: string;
  creditDays: number;
  terminationClause: string;
  contentTemplate: string;
}

export interface SLAAgreement {
  id: string;
  agreementNumber: string;
  tenantId: string;
  templateId: string;
  clientOrDoctorName: string;
  contactPerson: string;
  phone: string;
  email: string;
  effectiveDate: string;
  expiryDate: string;
  retainerFeeNGN: number;
  slaTurnaroundHours: number;
  status: 'draft' | 'pending_signature' | 'active' | 'expired';
  digitalSignatureName?: string;
  signedAt?: string;
  importedDraft?: boolean;
  draftFileName?: string;
  customTermsText?: string;
}

// TENANT GOOGLE DRIVE PATIENT DOCUMENTS ("MY FILES")
export interface TenantDocumentFile {
  id: string;
  tenantId: string;
  name: string;
  patientLeadId?: string;
  patientName?: string;
  category: 'lab_report' | 'retainer_mou' | 'referral_letter' | 'consent_slip' | 'invoice_pdf' | 'sla_contract' | 'radiology_scan' | 'general';
  sizeBytes: number;
  uploadedAt: string;
  uploadedByAssociateName: string;
  fileType: string;
  driveUrl: string;
  driveFolderId?: string;
  downloadUrl?: string;
  notes?: string;
}

// HMS (HOSPITAL MANAGEMENT SYSTEM) CONTACT IMPORT & BULK SMS
export interface HMSPatientContact {
  id: string;
  hmsPatientId: string;
  name: string;
  phone: string;
  email: string;
  age: number;
  gender: 'Male' | 'Female';
  bloodGroup: string;
  lastVisitDate: string;
  department: string;
  diagnosis: string;
  chronicConditions: string[];
  hmoProvider?: string;
  selectedForCampaign?: boolean;
}

export interface BulkSMSCampaign {
  id: string;
  title: string;
  senderId: string;
  message: string;
  recipientCount: number;
  costNGN: number;
  status: 'draft' | 'queued' | 'sent' | 'failed';
  sentAt?: string;
  deliveryRatePercent: number;
  recipients: {
    name: string;
    phone: string;
    status: 'delivered' | 'failed' | 'pending';
  }[];
}
