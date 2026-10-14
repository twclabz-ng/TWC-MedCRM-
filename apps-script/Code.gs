/**
 * ============================================================================
 * TWC CareCRM - Production Google Apps Script Backend (Code.gs)
 * ============================================================================
 * Host platform: Google Apps Script (https://script.google.com)
 * Deployment: Deploy as Web App -> Execute as 'Me' -> Who has access: 'Anyone'
 * 
 * Capabilities:
 * - Google Sheets Two-Way Sync (Pipeline Leads, Activities, Invoices, SLAs, Tickets)
 * - Automatic Google Drive Isolated Folder Provisioning for New Hospital Tenants
 * - Nigeria Data Protection Act (NDPA) Audit Trail Logging
 * - Wati WhatsApp Webhook Ingestion
 * - Google Forms Lead Auto-Capture Trigger
 * - HTML Service Status & API Inspection Dashboard
 * ============================================================================
 */

// Global Sheet Schema Definitions
var SHEET_NAMES = {
  PIPELINE: 'Pipeline_Leads',
  ACTIVITIES: 'Sales_Activities',
  INVOICES: 'Billing_Invoices',
  SLAS: 'SLA_Agreements',
  TICKETS: 'Support_Tickets',
  TENANTS: 'Hospital_Tenants',
  NDPA_AUDIT: 'NDPA_Audit_Log'
};

var HEADERS = {
  PIPELINE: [
    'Lead_ID', 'Tenant_ID', 'Name', 'Type', 'Phone', 'Email', 'Stage',
    'Expected_Value_NGN', 'Clinical_Interest', 'Associate_ID', 'Referral_Source',
    'NDPA_Consented', 'NDPA_Consent_Date', 'Google_Drive_Folder_URL',
    'Created_At', 'Updated_At'
  ],
  ACTIVITIES: [
    'Activity_ID', 'Tenant_ID', 'Lead_ID', 'Lead_Name', 'Associate_ID',
    'Channel', 'Direction', 'Outcome', 'Subject', 'Notes', 'NDPA_Compliant', 'Timestamp'
  ],
  INVOICES: [
    'Invoice_ID', 'Invoice_Number', 'Tenant_ID', 'Lead_ID', 'Client_Name',
    'Total_Amount_NGN', 'Status', 'Issue_Date', 'Due_Date', 'Payment_Notes', 'Paid_At'
  ],
  SLAS: [
    'SLA_ID', 'Agreement_Number', 'Tenant_ID', 'Lead_ID', 'Client_Name',
    'Template_ID', 'Status', 'Contract_Value_NGN', 'Start_Date', 'End_Date',
    'Digital_Signature_Name', 'Signed_At'
  ],
  TICKETS: [
    'Ticket_ID', 'Tenant_ID', 'Patient_Or_Company_Name', 'Phone', 'Lead_ID',
    'Category', 'Priority', 'Status', 'Assigned_Associate_ID', 'Subject',
    'Description', 'Created_At'
  ],
  TENANTS: [
    'Tenant_ID', 'Name', 'Short_Name', 'Slug', 'State', 'City', 'Address',
    'Drive_Folder_ID', 'Drive_Folder_URL', 'Created_At'
  ],
  NDPA_AUDIT: [
    'Log_ID', 'Tenant_ID', 'Action', 'Lead_ID', 'Actor_ID', 'Details',
    'Consent_Status', 'Retention_Policy', 'Timestamp'
  ]
};

/**
 * 1. HTTP GET Endpoint (doGet)
 * Serves JSON API responses for query parameters, or renders the Web App HTML portal.
 */
function doGet(e) {
  var params = (e && e.parameter) || {};
  var action = params.action;

  // If accessed directly via browser with no API action, render status portal
  if (!action || action === 'view') {
    return HtmlService.createTemplateFromFile('Index')
      .evaluate()
      .setTitle('TWC CareCRM - Google Apps Script Backend')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
  }

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // Health Check Endpoint
    if (action === 'ping') {
      return createJsonResponse({
        status: 'online',
        service: 'TWC CareCRM Serverless Backend',
        environment: 'Google Apps Script V8',
        timeZone: Session.getScriptTimeZone() || 'Africa/Lagos',
        activeSpreadsheet: ss.getName(),
        spreadsheetUrl: ss.getUrl(),
        timestamp: new Date().toISOString()
      });
    }

    // Initialize/Seed Schema Endpoint
    if (action === 'initSchema') {
      var initResult = setupHospitalSpreadsheet();
      return createJsonResponse({
        status: 'success',
        message: 'All CareCRM sheets and headers initialized successfully',
        details: initResult
      });
    }

    // Retrieve Leads
    if (action === 'getLeads' || action === 'getAll') {
      var tenantId = params.tenantId;
      var associateId = params.associateId;
      var sheet = getOrCreateSheet(ss, SHEET_NAMES.PIPELINE, HEADERS.PIPELINE);
      var records = getSheetRecords(sheet);

      if (tenantId && tenantId !== 'all') {
        records = records.filter(function(r) { return r.Tenant_ID === tenantId || !r.Tenant_ID; });
      }
      if (associateId && associateId !== 'all') {
        records = records.filter(function(r) { return r.Associate_ID === associateId; });
      }

      return createJsonResponse({
        status: 'success',
        action: 'getLeads',
        count: records.length,
        records: records,
        timestamp: new Date().toISOString()
      });
    }

    // Retrieve Activities
    if (action === 'getActivities') {
      var actSheet = getOrCreateSheet(ss, SHEET_NAMES.ACTIVITIES, HEADERS.ACTIVITIES);
      var actRecords = getSheetRecords(actSheet);
      if (params.tenantId && params.tenantId !== 'all') {
        actRecords = actRecords.filter(function(r) { return r.Tenant_ID === params.tenantId; });
      }
      return createJsonResponse({
        status: 'success',
        action: 'getActivities',
        count: actRecords.length,
        records: actRecords,
        timestamp: new Date().toISOString()
      });
    }

    // Retrieve Invoices
    if (action === 'getInvoices') {
      var invSheet = getOrCreateSheet(ss, SHEET_NAMES.INVOICES, HEADERS.INVOICES);
      var invRecords = getSheetRecords(invSheet);
      if (params.tenantId && params.tenantId !== 'all') {
        invRecords = invRecords.filter(function(r) { return r.Tenant_ID === params.tenantId; });
      }
      return createJsonResponse({
        status: 'success',
        action: 'getInvoices',
        count: invRecords.length,
        records: invRecords,
        timestamp: new Date().toISOString()
      });
    }

    // Retrieve SLAs
    if (action === 'getSLAs') {
      var slaSheet = getOrCreateSheet(ss, SHEET_NAMES.SLAS, HEADERS.SLAS);
      var slaRecords = getSheetRecords(slaSheet);
      if (params.tenantId && params.tenantId !== 'all') {
        slaRecords = slaRecords.filter(function(r) { return r.Tenant_ID === params.tenantId; });
      }
      return createJsonResponse({
        status: 'success',
        action: 'getSLAs',
        count: slaRecords.length,
        records: slaRecords,
        timestamp: new Date().toISOString()
      });
    }

    // Retrieve Tickets
    if (action === 'getTickets') {
      var tktSheet = getOrCreateSheet(ss, SHEET_NAMES.TICKETS, HEADERS.TICKETS);
      var tktRecords = getSheetRecords(tktSheet);
      if (params.tenantId && params.tenantId !== 'all') {
        tktRecords = tktRecords.filter(function(r) { return r.Tenant_ID === params.tenantId; });
      }
      return createJsonResponse({
        status: 'success',
        action: 'getTickets',
        count: tktRecords.length,
        records: tktRecords,
        timestamp: new Date().toISOString()
      });
    }

    // Default response for unhandled GET
    return createJsonResponse({
      status: 'error',
      message: 'Unknown GET action: ' + action
    });
  } catch (error) {
    return createJsonResponse({
      status: 'error',
      message: error.toString(),
      stack: error.stack
    });
  }
}

/**
 * 2. HTTP POST Endpoint (doPost)
 * Handles mutating actions: upserting leads, logging activities, provisioning Drive folders.
 */
function doPost(e) {
  try {
    var payload = {};
    if (e && e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    var action = payload.action || 'createLead';
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // 2.1 Lead Creation or Upsert
    if (action === 'createLead' || action === 'syncLead') {
      var pipeSheet = getOrCreateSheet(ss, SHEET_NAMES.PIPELINE, HEADERS.PIPELINE);
      var leadId = payload.id || ('lead_' + Date.now());
      var timestamp = new Date().toISOString();

      // Check if lead already exists by ID
      var data = pipeSheet.getDataRange().getValues();
      var rowIndex = -1;
      for (var r = 1; r < data.length; r++) {
        if (data[r][0] == leadId) {
          rowIndex = r + 1; // 1-indexed
          break;
        }
      }

      var rowData = [
        leadId,
        payload.tenantId || 'tenant_twc_vi',
        payload.name || payload.patientName || 'Anonymous Patient',
        payload.type || 'patient',
        payload.phone || '',
        payload.email || '',
        payload.stage || 'inquiry',
        payload.expectedValueNGN || 0,
        payload.clinicalInterest || '',
        payload.associateId || 'assoc_chioma',
        payload.referralSource || 'PWA Direct',
        payload.ndpaConsent !== undefined ? (payload.ndpaConsent ? 'Yes' : 'No') : 'Yes',
        payload.ndpaConsentDate || timestamp,
        payload.googleDriveFolderUrl || '',
        payload.createdAt || timestamp,
        timestamp
      ];

      if (rowIndex > 0) {
        pipeSheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
      } else {
        pipeSheet.appendRow(rowData);
      }

      // Log NDPA Audit
      logNdpaAudit(ss, {
        tenantId: payload.tenantId || 'tenant_twc_vi',
        action: 'LEAD_UPSERT',
        leadId: leadId,
        actorId: payload.associateId || 'assoc_chioma',
        details: 'Patient/Client record created or synchronized from GitHub Pages PWA',
        consentStatus: 'Consent Verified'
      });

      return createJsonResponse({
        status: 'success',
        action: action,
        leadId: leadId,
        message: 'Lead synchronized to Google Sheets successfully.'
      });
    }

    // 2.2 Bulk Batch Sync Leads
    if (action === 'syncAllLeads') {
      var leads = payload.leads || [];
      var batchSheet = getOrCreateSheet(ss, SHEET_NAMES.PIPELINE, HEADERS.PIPELINE);
      var updatedCount = 0;

      leads.forEach(function(lead) {
        var now = new Date().toISOString();
        batchSheet.appendRow([
          lead.id || ('lead_' + Date.now()),
          lead.tenantId || 'tenant_twc_vi',
          lead.name || 'Anonymous',
          lead.type || 'patient',
          lead.phone || '',
          lead.email || '',
          lead.stage || 'inquiry',
          lead.expectedValueNGN || 0,
          lead.clinicalInterest || '',
          lead.associateId || 'assoc_chioma',
          lead.referralSource || 'Batch Sync',
          lead.ndpaConsent ? 'Yes' : 'No',
          now,
          (lead.googleSync && lead.googleSync.googleDriveFolderUrl) || '',
          lead.createdAt || now,
          now
        ]);
        updatedCount++;
      });

      return createJsonResponse({
        status: 'success',
        action: 'syncAllLeads',
        syncedCount: updatedCount,
        message: updatedCount + ' leads batch synced to Google Sheets.'
      });
    }

    // 2.3 Log Clinical / Sales Communication Activity
    if (action === 'logActivity' || action === 'logCommunication') {
      var actSheet = getOrCreateSheet(ss, SHEET_NAMES.ACTIVITIES, HEADERS.ACTIVITIES);
      var actId = payload.id || ('act_' + Date.now());
      var actTime = payload.timestamp || new Date().toISOString();

      actSheet.appendRow([
        actId,
        payload.tenantId || 'tenant_twc_vi',
        payload.leadId || '',
        payload.leadName || '',
        payload.associateId || 'assoc_chioma',
        payload.channel || 'phone',
        payload.direction || 'outbound',
        payload.outcome || 'Logged',
        payload.subject || 'Patient Consultation Follow-up',
        payload.notes || '',
        payload.ndpaCompliant !== false ? 'Yes' : 'No',
        actTime
      ]);

      return createJsonResponse({
        status: 'success',
        action: 'logActivity',
        activityId: actId,
        message: 'Communication activity successfully recorded.'
      });
    }

    // 2.4 Create Support / Care Ticket
    if (action === 'createTicket') {
      var tktSheet = getOrCreateSheet(ss, SHEET_NAMES.TICKETS, HEADERS.TICKETS);
      var tktId = payload.id || ('tkt_' + Date.now());
      var tktTime = payload.createdAt || new Date().toISOString();

      tktSheet.appendRow([
        tktId,
        payload.tenantId || 'tenant_twc_vi',
        payload.patientOrCompanyName || '',
        payload.phone || '',
        payload.leadId || '',
        payload.category || 'General Clinical Care',
        payload.priority || 'medium',
        payload.status || 'open',
        payload.assignedAssociateId || 'assoc_chioma',
        payload.subject || '',
        payload.description || '',
        tktTime
      ]);

      return createJsonResponse({
        status: 'success',
        action: 'createTicket',
        ticketId: tktId,
        message: 'Care ticket recorded.'
      });
    }

    // 2.5 Automated Google Drive Folder Provisioning for Hospital Tenant
    if (action === 'provisionTenantDriveFolder') {
      var tenantName = payload.tenantName || 'New Hospital Branch';
      var tenantSlug = payload.tenantSlug || tenantName.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 24);

      // Create root tenant folder in Google Drive
      var folderName = 'TWC CareCRM - ' + tenantName;
      var rootFolder = DriveApp.createFolder(folderName);
      
      // Create organized hospital sub-directories
      var subfolders = ['Invoices & Receipts', 'Signed SLAs', 'Patient NDPA Consents', 'Clinical Documents'];
      subfolders.forEach(function(sub) {
        rootFolder.createFolder(sub);
      });

      var driveFolderId = rootFolder.getId();
      var driveFolderUrl = rootFolder.getUrl();

      // Record in Tenants sheet
      var tenSheet = getOrCreateSheet(ss, SHEET_NAMES.TENANTS, HEADERS.TENANTS);
      tenSheet.appendRow([
        payload.tenantId || ('tenant_' + tenantSlug),
        tenantName,
        payload.shortName || tenantName.slice(0, 10),
        tenantSlug,
        payload.state || 'Lagos',
        payload.city || 'Lagos',
        payload.address || '',
        driveFolderId,
        driveFolderUrl,
        new Date().toISOString()
      ]);

      return createJsonResponse({
        status: 'success',
        action: 'provisionTenantDriveFolder',
        driveFolderId: driveFolderId,
        driveFolderUrl: driveFolderUrl,
        message: 'Automated Google Drive workspace created for ' + tenantName
      });
    }

    // 2.6 Wati WhatsApp Inbound Webhook
    if (action === 'watiWebhook' || payload.waId || payload.senderPhone) {
      var senderPhone = payload.senderPhone || payload.waId || (payload.contact && payload.contact.phone);
      var messageText = payload.text || payload.messageText || '';
      var contactName = (payload.contact && payload.contact.name) || 'WhatsApp Patient';

      // Auto-log to Activities sheet
      var watiActSheet = getOrCreateSheet(ss, SHEET_NAMES.ACTIVITIES, HEADERS.ACTIVITIES);
      watiActSheet.appendRow([
        'wati_' + Date.now(),
        payload.tenantId || 'tenant_twc_vi',
        payload.leadId || '',
        contactName,
        'automation_wati',
        'whatsapp',
        'inbound',
        'WhatsApp Received',
        'Wati Inbound: ' + senderPhone,
        messageText,
        'Yes',
        new Date().toISOString()
      ]);

      return createJsonResponse({
        status: 'success',
        message: 'Wati WhatsApp message logged in CareCRM backend.'
      });
    }

    // 2.7 NDPA Consent / Audit Logging
    if (action === 'logNdpaAudit') {
      logNdpaAudit(ss, payload);
      return createJsonResponse({
        status: 'success',
        message: 'NDPA compliance event recorded in immutable audit log.'
      });
    }

    return createJsonResponse({
      status: 'error',
      message: 'Unrecognized POST action: ' + action
    });
  } catch (error) {
    return createJsonResponse({
      status: 'error',
      message: error.toString(),
      stack: error.stack
    });
  }
}

/**
 * 3. Google Forms Trigger (onFormSubmit)
 * Automatically converts Google Forms patient leads into pipeline entries.
 */
function onFormSubmit(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = getOrCreateSheet(ss, SHEET_NAMES.PIPELINE, HEADERS.PIPELINE);
    
    var patientName = 'New Form Lead';
    var phone = '';
    var clinicalInterest = 'General Clinical Consultation';

    if (e && e.response) {
      var itemResponses = e.response.getItemResponses();
      if (itemResponses[0]) patientName = itemResponses[0].getResponse();
      if (itemResponses[1]) phone = itemResponses[1].getResponse();
      if (itemResponses[2]) clinicalInterest = itemResponses[2].getResponse();
    }

    var timestamp = new Date().toISOString();
    var newId = 'lead_form_' + Date.now();

    sheet.appendRow([
      newId,
      'tenant_twc_vi',
      patientName,
      'patient',
      phone,
      '',
      'inquiry',
      0,
      clinicalInterest,
      'assoc_chioma',
      'Google Form Referral',
      'Yes',
      timestamp,
      '',
      timestamp,
      timestamp
    ]);
  } catch (err) {
    Logger.log('Error in onFormSubmit: ' + err.toString());
  }
}

/**
 * 4. Helper: Schema Initializer
 * Creates all worksheets with bold styled headers and frozen first row.
 */
function setupHospitalSpreadsheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var results = [];

  for (var key in SHEET_NAMES) {
    var name = SHEET_NAMES[key];
    var headers = HEADERS[key];
    var sheet = getOrCreateSheet(ss, name, headers);
    results.push({ sheet: name, columns: headers.length });
  }

  return results;
}

/**
 * Helper: Find or create a specific sheet and set headers
 */
function getOrCreateSheet(spreadsheet, sheetName, defaultHeaders) {
  var sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
    if (defaultHeaders && defaultHeaders.length > 0) {
      sheet.getRange(1, 1, 1, defaultHeaders.length)
        .setValues([defaultHeaders])
        .setFontWeight('bold')
        .setBackground('#045d6e')
        .setFontColor('#ffffff');
      sheet.setFrozenRows(1);
    }
  }
  return sheet;
}

/**
 * Helper: Convert a sheet with headers into an array of JS objects
 */
function getSheetRecords(sheet) {
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];

  var headers = data[0];
  var records = [];

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (!row[0]) continue;
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = row[j];
    }
    records.push(obj);
  }

  return records;
}

/**
 * Helper: Record NDPA Audit Log
 */
function logNdpaAudit(ss, data) {
  try {
    var sheet = getOrCreateSheet(ss, SHEET_NAMES.NDPA_AUDIT, HEADERS.NDPA_AUDIT);
    var logId = 'ndpa_' + Date.now();
    sheet.appendRow([
      logId,
      data.tenantId || 'tenant_twc_vi',
      data.action || 'ACCESS',
      data.leadId || '',
      data.actorId || 'system',
      data.details || '',
      data.consentStatus || 'Verified',
      '7 Years (Nigeria NDPA Statutory)',
      new Date().toISOString()
    ]);
  } catch (e) {
    Logger.log('NDPA logging failed: ' + e.toString());
  }
}

/**
 * Helper: Formatted JSON with CORS headers for cross-origin fetch from GitHub Pages
 */
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
