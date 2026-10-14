import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Receipt, 
  ShieldCheck, 
  Plus, 
  Download, 
  Send, 
  CheckCircle2, 
  Clock, 
  Building2, 
  Printer, 
  Trash2, 
  ExternalLink,
  MessageSquare,
  Landmark,
  Share2,
  Upload,
  Copy,
  Check,
  Palette,
  FileCheck,
  Eye,
  FileCode
} from 'lucide-react';
import { useCRM } from '../context/CRMContext';
import { Invoice, InvoiceItem, SLAAgreement, SLATemplate } from '../types/crm';
import { HospitalPersonalizationModal } from './HospitalPersonalizationModal';

export const TeamDocumentsView: React.FC = () => {
  const { 
    invoices,
    filteredInvoices, 
    addInvoice, 
    updateInvoiceStatus, 
    slaTemplates, 
    slaAgreements,
    filteredSlaAgreements, 
    addSLAAgreement,
    importDraftSLA,
    currentTenant,
    filteredLeads,
    formatCurrency,
    triggerCommunication,
    whatsappTemplates
  } = useCRM();

  const [activeTab, setActiveTab] = useState<'invoices' | 'slas' | 'templates'>('invoices');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(filteredInvoices[0] || null);
  const [selectedSla, setSelectedSla] = useState<SLAAgreement | null>(filteredSlaAgreements[0] || null);
  const [isSLAPreviewModalOpen, setIsSLAPreviewModalOpen] = useState(false);
  const [previewingSla, setPreviewingSla] = useState<SLAAgreement | null>(filteredSlaAgreements[0] || null);
  const [isNewInvoiceModalOpen, setIsNewInvoiceModalOpen] = useState(false);
  const [isNewSLAModalOpen, setIsNewSLAModalOpen] = useState(false);
  const [isImportDraftSLAModalOpen, setIsImportDraftSLAModalOpen] = useState(false);
  const [isPersonalizeModalOpen, setIsPersonalizeModalOpen] = useState(false);
  const [copiedTemplateId, setCopiedTemplateId] = useState<string | null>(null);

  const handleOpenSlaPreview = (sla: SLAAgreement) => {
    setPreviewingSla(sla);
    setIsSLAPreviewModalOpen(true);
  };

  const handlePrintSlaDocument = (sla: SLAAgreement) => {
    setPreviewingSla(sla);
    setIsSLAPreviewModalOpen(true);
    setTimeout(() => {
      window.print();
    }, 250);
  };

  // New Invoice Form State
  const [targetLeadId, setTargetLeadId] = useState(filteredLeads[0]?.id || '');
  const [invClientName, setInvClientName] = useState(filteredLeads[0]?.name || '');
  const [invClientPhone, setInvClientPhone] = useState(filteredLeads[0]?.phone || '');
  const [invClientEmail, setInvClientEmail] = useState(filteredLeads[0]?.email || '');
  const [invDueDate, setInvDueDate] = useState('2026-11-15');
  const [invDiscount, setInvDiscount] = useState(0);
  const [invItems, setInvItems] = useState<Omit<InvoiceItem, 'id' | 'amountNGN'>[]>([
    { description: 'Executive Comprehensive Heart & Metabolic Panel', quantity: 1, unitPriceNGN: 680000 },
  ]);

  // New SLA Form State
  const [selectedTemplateId, setSelectedTemplateId] = useState(slaTemplates[0]?.id || '');
  const [slaClientName, setSlaClientName] = useState('Dangote Industries Executive Health Scheme');
  const [slaContactPerson, setSlaContactPerson] = useState('Dr. Aliyu Dangote (Medical Director)');
  const [slaPhone, setSlaPhone] = useState('+234 803 111 2233');
  const [slaEmail, setSlaEmail] = useState('medical@dangote-group.ng');
  const [slaRetainerFee, setSlaRetainerFee] = useState(12000000);
  const [slaTurnaround, setSlaTurnaround] = useState(8);

  // Import / Upload Draft SLA State
  const [draftTitle, setDraftTitle] = useState('');
  const [draftFileName, setDraftFileName] = useState('');
  const [draftClientName, setDraftClientName] = useState('');
  const [draftContactPerson, setDraftContactPerson] = useState('');
  const [draftPhone, setDraftPhone] = useState('+234 80');
  const [draftEmail, setDraftEmail] = useState('');
  const [draftRetainerFee, setDraftRetainerFee] = useState(8500000);
  const [draftTurnaround, setDraftTurnaround] = useState(6);
  const [draftTermsText, setDraftTermsText] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Calculations for invoice creation
  const calculatedSubtotal = invItems.reduce((acc, it) => acc + (it.quantity * it.unitPriceNGN), 0);
  const calculatedDiscount = (calculatedSubtotal * invDiscount) / 100;
  const taxableAmount = calculatedSubtotal - calculatedDiscount;
  const calculatedVAT = taxableAmount * 0.075; // 7.5% Nigerian VAT
  const calculatedGrandTotal = taxableAmount + calculatedVAT;

  const handleLeadSelect = (id: string) => {
    setTargetLeadId(id);
    const found = filteredLeads.find(l => l.id === id);
    if (found) {
      setInvClientName(found.name);
      setInvClientPhone(found.phone);
      setInvClientEmail(found.email);
    }
  };

  const handleAddItem = () => {
    setInvItems(prev => [...prev, { description: 'New Clinical Investigation / Service', quantity: 1, unitPriceNGN: 150000 }]);
  };

  const handleRemoveItem = (index: number) => {
    setInvItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    setInvItems(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedItems: InvoiceItem[] = invItems.map((it, i) => ({
      id: `it_${Date.now()}_${i}`,
      description: it.description,
      quantity: Number(it.quantity),
      unitPriceNGN: Number(it.unitPriceNGN),
      amountNGN: Number(it.quantity) * Number(it.unitPriceNGN),
    }));

    const newInv = addInvoice({
      tenantId: currentTenant.id,
      leadId: targetLeadId || undefined,
      clientName: invClientName,
      clientPhone: invClientPhone,
      clientEmail: invClientEmail,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: invDueDate,
      items: formattedItems,
      subtotalNGN: calculatedSubtotal,
      discountPercent: invDiscount,
      discountAmountNGN: calculatedDiscount,
      vatPercent: 7.5,
      vatAmountNGN: calculatedVAT,
      totalNGN: calculatedGrandTotal,
      status: 'draft',
      paymentNotes: currentTenant.invoiceFooterNote || '30-day corporate settlement terms.',
    });

    setSelectedInvoice(newInv);
    setIsNewInvoiceModalOpen(false);
  };

  const handleCreateSLA = (e: React.FormEvent) => {
    e.preventDefault();
    const newSla = addSLAAgreement({
      tenantId: currentTenant.id,
      templateId: selectedTemplateId,
      clientOrDoctorName: slaClientName,
      contactPerson: slaContactPerson,
      phone: slaPhone,
      email: slaEmail,
      effectiveDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      retainerFeeNGN: Number(slaRetainerFee),
      slaTurnaroundHours: Number(slaTurnaround),
      status: 'pending_signature',
      digitalSignatureName: currentTenant.authorizedSignatoryName,
    });

    setSelectedSla(newSla);
    setIsNewSLAModalOpen(false);
  };

  // Import / Upload Draft SLA handler
  const handleDraftFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDraftFileName(file.name);
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setDraftClientName(cleanName);
      setDraftTitle(`Draft SLA Agreement - ${cleanName}`);

      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          setDraftTermsText(text.substring(0, 1500));
        }
      };
      if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.json')) {
        reader.readAsText(file);
      } else {
        setDraftTermsText(`DRAFT TERMS IMPORTED FROM ${file.name}:
- Clinical Scope: Executive pathology, cardiac imaging, and urgent laboratory accessioning.
- Standard Turnaround Commitment: Guaranteed expedited turnaround under 6 hours.
- Retainer Tariff Terms: Fixed tariff schedule for 12 months in accordance with hospital rates.`);
      }
    }
  };

  const handleImportDraftSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftClientName) return;

    const newDraft = importDraftSLA({
      templateId: 'sla_corp_retainer',
      clientOrDoctorName: draftClientName,
      contactPerson: draftContactPerson || 'Executive Representative',
      phone: draftPhone,
      email: draftEmail,
      effectiveDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      retainerFeeNGN: Number(draftRetainerFee),
      slaTurnaroundHours: Number(draftTurnaround),
      status: 'draft',
      importedDraft: true,
      draftFileName: draftFileName || 'Draft_SLA_Uploaded.docx',
      customTermsText: draftTermsText,
    });

    setSelectedSla(newDraft);
    setIsImportDraftSLAModalOpen(false);
    setDraftFileName('');
    setDraftTermsText('');
  };

  const handleCopyTemplate = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTemplateId(id);
    setTimeout(() => setCopiedTemplateId(null), 2000);
  };

  // Native phone print system trigger
  const handleNativePrint = () => {
    window.print();
  };

  const activeInvoice = selectedInvoice || filteredInvoices[0] || null;
  const activeSla = selectedSla || filteredSlaAgreements[0] || null;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* View Header with Hospital Personalization Trigger */}
      <div className="bg-white p-5 sm:p-6 rounded-[28px] border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span 
              className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white shadow-2xs"
              style={{ backgroundColor: currentTenant.primaryColor || '#045D6E' }}
            >
              {currentTenant.shortName}
            </span>
            <span className="text-xs text-slate-400 font-semibold">•</span>
            <span className="text-xs text-slate-500 font-semibold">Multi-Tenant Financial & Legal Hub</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1.5 tracking-tight flex items-center gap-2">
            <Receipt className="w-6 h-6 text-[#045D6E]" />
            <span>Team Documents & Invoices</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Automatic invoice generator, approved Service Level Agreements with draft upload & print, and standardized clinical team templates customized with <strong>{currentTenant.name}</strong> branding.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setIsPersonalizeModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all ios-pressable"
            title="Personalize hospital logo, colors, bank account & terms"
          >
            <Palette className="w-4 h-4 text-[#045D6E]" />
            <span>Personalize Branding</span>
          </button>

          {activeTab === 'invoices' && (
            <button
              onClick={() => setIsNewInvoiceModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#045D6E] hover:bg-[#034a58] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm shadow-[#045D6E]/20 ios-pressable"
            >
              <Plus className="w-4 h-4" />
              <span>+ Generate Invoice</span>
            </button>
          )}

          {activeTab === 'slas' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsImportDraftSLAModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-[#045D6E] text-xs font-bold flex items-center gap-1.5 border border-teal-200/80 ios-pressable"
              >
                <Upload className="w-4 h-4" />
                <span>Import Draft SLA</span>
              </button>
              <button
                onClick={() => setIsNewSLAModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#045D6E] hover:bg-[#034a58] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm shadow-[#045D6E]/20 ios-pressable"
              >
                <Plus className="w-4 h-4" />
                <span>+ New Agreement</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Segmented Module Switcher */}
      <div className="flex items-center gap-1 p-1 bg-slate-200/80 rounded-2xl max-w-fit shadow-inner">
        <button
          onClick={() => setActiveTab('invoices')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ios-pressable ${
            activeTab === 'invoices' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Receipt className="w-3.5 h-3.5 text-[#045D6E]" />
          <span>Invoices & Billing</span>
          <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-slate-200 font-bold">
            {filteredInvoices.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('slas')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ios-pressable ${
            activeTab === 'slas' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Service Level Agreements (SLAs)</span>
          <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-slate-200 font-bold">
            {filteredSlaAgreements.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('templates')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ios-pressable ${
            activeTab === 'templates' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-blue-600" />
          <span>Team Templates</span>
          <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-slate-200 font-bold">
            {whatsappTemplates.length}
          </span>
        </button>
      </div>

      {/* TAB 1: INVOICES & BILLING */}
      {activeTab === 'invoices' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Invoices List Sidebar */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1">
              <span>Tenant Invoices ({filteredInvoices.length})</span>
              <span className="text-slate-400 font-normal">Active Hospital</span>
            </div>

            <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
              {filteredInvoices.map((inv) => (
                <div
                  key={inv.id}
                  onClick={() => setSelectedInvoice(inv)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    activeInvoice?.id === inv.id
                      ? 'bg-white border-[#045D6E] shadow-md ring-1 ring-[#045D6E]'
                      : 'bg-white/80 border-slate-200 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-slate-500">
                        {inv.invoiceNumber}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 mt-0.5 truncate max-w-[180px]">
                        {inv.clientName}
                      </h4>
                    </div>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      inv.status === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                      inv.status === 'sent' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {inv.status}
                    </span>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-black text-slate-900">
                      {formatCurrency(inv.totalNGN)}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Due: {inv.dueDate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Invoice Document Preview & Actions */}
          <div className="lg:col-span-8">
            {activeInvoice ? (
              <div className="bg-white rounded-[28px] border border-slate-200/90 shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
                
                {/* Invoice Actions Bar (Hidden on native print) */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 no-print">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400">STATUS:</span>
                    <span className={`text-xs font-bold uppercase px-2.5 py-0.5 rounded-full ${
                      activeInvoice.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {activeInvoice.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {activeInvoice.status !== 'paid' && (
                      <button
                        onClick={() => updateInvoiceStatus(activeInvoice.id, 'paid')}
                        className="px-3 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 ios-pressable"
                      >
                        ✓ Mark Paid
                      </button>
                    )}
                    <button
                      onClick={handleNativePrint}
                      className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-all ios-pressable"
                      title="Print using phone or browser built-in print dialog"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Document</span>
                    </button>
                    <a
                      href={`https://wa.me/${activeInvoice.clientPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Dear ${activeInvoice.clientName}, your medical invoice ${activeInvoice.invoiceNumber} for ${formatCurrency(activeInvoice.totalNGN)} from ${currentTenant.name} is ready for review.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-full bg-[#045D6E] text-white hover:bg-[#034a58] text-xs font-bold flex items-center gap-1.5 ios-pressable"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send WhatsApp</span>
                    </a>
                  </div>
                </div>

                {/* Printable Official Tax Invoice Container */}
                <div className="print-document-target space-y-6 text-xs text-slate-700">
                  
                  {/* Hospital Header with Personalized Logo & Color */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b-2 border-slate-100">
                    <div className="flex items-center gap-3">
                      {currentTenant.logoUrl ? (
                        <img 
                          src={currentTenant.logoUrl} 
                          alt={currentTenant.name} 
                          className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-2xs"
                        />
                      ) : (
                        <div 
                          className="w-12 h-12 rounded-2xl text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0"
                          style={{ backgroundColor: currentTenant.primaryColor || '#045D6E' }}
                        >
                          {currentTenant.shortName.substring(0, 3).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div 
                          className="text-lg font-black tracking-tight"
                          style={{ color: currentTenant.primaryColor || '#045D6E' }}
                        >
                          {currentTenant.name}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                          {currentTenant.address}, {currentTenant.city}, {currentTenant.state}<br />
                          Phone: {currentTenant.phone} • Email: {currentTenant.email}<br />
                          CAC Reg: {currentTenant.cacNumber} • TIN: {currentTenant.tinNumber}
                        </div>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="text-xl font-black text-slate-900 tracking-tight">TAX INVOICE</div>
                      <div className="font-mono text-slate-700 font-bold mt-0.5">{activeInvoice.invoiceNumber}</div>
                      <div className="text-[11px] text-slate-400 mt-1">Issue Date: {activeInvoice.issueDate}</div>
                      <div className="text-[11px] text-slate-400">Payment Due: {activeInvoice.dueDate}</div>
                    </div>
                  </div>

                  {/* Billed To */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Billed To (Patient / Client):</div>
                    <div className="font-bold text-slate-900 text-sm">{activeInvoice.clientName}</div>
                    <div className="text-slate-600">{activeInvoice.clientPhone} • {activeInvoice.clientEmail}</div>
                    {activeInvoice.clientAddress && <div className="text-slate-500">{activeInvoice.clientAddress}</div>}
                  </div>

                  {/* Itemized Table */}
                  <div className="border border-slate-200 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-600 text-[10px] font-bold uppercase">
                        <tr>
                          <th className="p-3">Clinical Investigation / Service</th>
                          <th className="p-3 text-center">Qty</th>
                          <th className="p-3 text-right">Unit Price</th>
                          <th className="p-3 text-right">Amount (₦)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {activeInvoice.items.map((it, idx) => (
                          <tr key={idx}>
                            <td className="p-3 font-semibold text-slate-900">{it.description}</td>
                            <td className="p-3 text-center text-slate-600">{it.quantity}</td>
                            <td className="p-3 text-right text-slate-600">{formatCurrency(it.unitPriceNGN)}</td>
                            <td className="p-3 text-right font-bold text-slate-900">{formatCurrency(it.amountNGN)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Financial Totals & Bank Details */}
                  <div className="flex flex-col sm:flex-row justify-between gap-4 pt-2">
                    <div className="p-3.5 rounded-2xl bg-teal-50/60 border border-teal-200/70 text-teal-900 space-y-1 text-xs">
                      <div className="font-bold flex items-center gap-1.5 text-[#045D6E]">
                        <Landmark className="w-3.5 h-3.5" />
                        <span>Official Bank Settlement Details:</span>
                      </div>
                      <div>Bank: <strong>{currentTenant.bankDetails.bankName}</strong></div>
                      <div>Account Number: <strong className="font-mono">{currentTenant.bankDetails.accountNumber}</strong></div>
                      <div>Account Name: <strong>{currentTenant.bankDetails.accountName}</strong></div>
                    </div>

                    <div className="space-y-1.5 sm:w-64 text-right">
                      <div className="flex justify-between text-slate-600">
                        <span>Subtotal:</span>
                        <span className="font-semibold">{formatCurrency(activeInvoice.subtotalNGN)}</span>
                      </div>
                      {activeInvoice.discountAmountNGN > 0 && (
                        <div className="flex justify-between text-emerald-600">
                          <span>Discount ({activeInvoice.discountPercent}%):</span>
                          <span>- {formatCurrency(activeInvoice.discountAmountNGN)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-slate-600">
                        <span>VAT (7.5% Nigerian Tax):</span>
                        <span>{formatCurrency(activeInvoice.vatAmountNGN)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-slate-900 text-sm pt-2 border-t border-slate-200">
                        <span>Total Payable:</span>
                        <span 
                          className="font-black text-base"
                          style={{ color: currentTenant.primaryColor || '#045D6E' }}
                        >
                          {formatCurrency(activeInvoice.totalNGN)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Terms */}
                  <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 leading-relaxed">
                    <p><strong>Payment Terms:</strong> {currentTenant.invoiceFooterNote || 'Payment strictly due in accordance with clinical retainer schedule.'}</p>
                    <p className="mt-1">Generated electronically via {currentTenant.name} Multi-Tenant Hospital SaaS.</p>
                  </div>

                </div>

              </div>
            ) : (
              <div className="p-12 text-center text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200">
                Select an invoice or generate a new invoice.
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 2: SERVICE LEVEL AGREEMENTS (SLAs) */}
      {activeTab === 'slas' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSlaAgreements.map((sla) => (
              <div
                key={sla.id}
                className="p-6 rounded-[28px] bg-white border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full">
                        {sla.agreementNumber}
                      </span>
                      {sla.importedDraft && (
                        <span className="ml-1 text-[9px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded-full">
                          Draft Imported
                        </span>
                      )}
                      <h3 className="text-base font-bold text-slate-900 mt-1">{sla.clientOrDoctorName}</h3>
                      <p className="text-xs text-slate-500">Contact: {sla.contactPerson} ({sla.phone})</p>
                    </div>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      sla.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {sla.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Committed Diagnostic TAT:</span>
                      <strong className="text-slate-900">&lt; {sla.slaTurnaroundHours} Hours</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Retainership Fee / Honorarium:</span>
                      <strong className="text-[#045D6E]">{formatCurrency(sla.retainerFeeNGN)}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Effective Period:</span>
                      <span className="font-medium text-slate-700">{sla.effectiveDate} &rarr; {sla.expiryDate}</span>
                    </div>
                    {sla.digitalSignatureName && (
                      <div className="pt-2 border-t border-slate-200 flex justify-between text-emerald-800">
                        <span>Digitally Executed:</span>
                        <strong>✓ {sla.digitalSignatureName}</strong>
                      </div>
                    )}
                  </div>

                  {sla.customTermsText && (
                    <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/70 text-[11px] text-slate-600 line-clamp-3">
                      {sla.customTermsText}
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-2">
                  <button
                    onClick={() => handleOpenSlaPreview(sla)}
                    className="px-3 py-1.5 rounded-full bg-teal-50 hover:bg-teal-100 text-[#045D6E] text-xs font-bold flex items-center gap-1.5 ios-pressable"
                    title="Read official agreement document"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View SLA</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handlePrintSlaDocument(sla)}
                      className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 ios-pressable"
                      title="Print SLA using phone or browser built-in print dialog"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print SLA</span>
                    </button>

                    <a
                      href={`https://wa.me/${sla.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Dear ${sla.contactPerson}, regarding our clinical Service Level Agreement (${sla.agreementNumber}) with ${currentTenant.name}.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-full bg-[#045D6E] text-white hover:bg-[#034a58] flex items-center justify-center ios-pressable"
                      title="Send WhatsApp"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: APPROVED TEAM TEMPLATES (Merged from TeamTemplates.tsx) */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-slate-900 via-[#045D6E] to-[#033b47] rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-teal-200 text-xs font-semibold mb-2">
                <FileText className="w-3.5 h-3.5" />
                <span>Standardized Hospital Templates</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold">Clinical & Commercial Approved Templates</h2>
              <p className="text-xs sm:text-sm text-teal-100/80 mt-1 max-w-2xl">
                Pre-approved high-conversion templates personalized for <strong>{currentTenant.name}</strong> for WhatsApp dispatch, doctor detailing, and NDPA intake.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {whatsappTemplates.map((tmpl) => (
              <div
                key={tmpl.id}
                className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#045d6e] transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800">
                      {tmpl.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono font-medium">
                      {tmpl.language}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">{tmpl.title}</h3>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700 font-mono leading-relaxed whitespace-pre-wrap">
                    {tmpl.text}
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {tmpl.variables.map((v) => (
                      <span key={v} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-teal-50 text-[#045d6e] font-bold">
                        &#123;&#123;{v}&#125;&#125;
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <button
                    onClick={() => handleCopyTemplate(tmpl.id, tmpl.text)}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors ios-pressable"
                  >
                    {copiedTemplateId === tmpl.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedTemplateId === tmpl.id ? 'Copied Template!' : 'Copy Text'}</span>
                  </button>

                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(tmpl.text)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-[#045d6e] text-white hover:bg-[#034a58] text-xs font-bold flex items-center gap-1.5 shadow-xs ios-pressable"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Open in WhatsApp</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* IMPORT / UPLOAD DRAFT SERVICE LEVEL AGREEMENT MODAL */}
      {isImportDraftSLAModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 ios-blur p-0 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-t-[32px] sm:rounded-[32px] bg-white p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <div className="w-10 h-1.5 rounded-full bg-slate-300 mx-auto -mt-2 mb-2 sm:hidden" />

            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#045D6E] flex items-center justify-center font-bold">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Import / Upload Draft SLA</h3>
                  <p className="text-[11px] text-slate-500">Corporate Retainer or Diagnostic MOU Draft</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setIsImportDraftSLAModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleImportDraftSubmit} className="space-y-4 text-xs">
              
              {/* File Dropzone */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#045D6E]/40 hover:border-[#045D6E] bg-teal-50/30 hover:bg-teal-50/60 p-5 rounded-2xl text-center cursor-pointer transition-all space-y-1.5"
              >
                <Upload className="w-7 h-7 text-[#045D6E] mx-auto" />
                <p className="font-bold text-slate-800 text-xs">
                  {draftFileName ? `Selected: ${draftFileName}` : 'Select or Drop Draft SLA File (.docx, .pdf, .txt)'}
                </p>
                <p className="text-[10px] text-slate-500">
                  Pre-fills agreement clauses, client information & tariffs automatically.
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".docx,.pdf,.txt,.json"
                  className="hidden"
                  onChange={handleDraftFileSelect}
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Client Company / Referring Doctor *</label>
                <input
                  type="text"
                  required
                  value={draftClientName}
                  onChange={(e) => setDraftClientName(e.target.value)}
                  placeholder="e.g. Dangote Group Executive Health Retainer"
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Authorized Contact Person</label>
                  <input
                    type="text"
                    value={draftContactPerson}
                    onChange={(e) => setDraftContactPerson(e.target.value)}
                    placeholder="e.g. Dr. Aliyu Dangote"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={draftPhone}
                    onChange={(e) => setDraftPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Committed Turnaround Time (Hours)</label>
                  <input
                    type="number"
                    value={draftTurnaround}
                    onChange={(e) => setDraftTurnaround(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Annual / Retainer Fee (₦)</label>
                  <input
                    type="number"
                    value={draftRetainerFee}
                    onChange={(e) => setDraftRetainerFee(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Draft Terms & Scope of Work</label>
                <textarea
                  rows={3}
                  value={draftTermsText}
                  onChange={(e) => setDraftTermsText(e.target.value)}
                  placeholder="Paste or edit draft agreement clauses..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsImportDraftSLAModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!draftClientName}
                  className="px-5 py-2 rounded-xl bg-[#045D6E] text-white font-bold disabled:opacity-40"
                >
                  Save as Draft SLA
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* GENERATE NEW SLA MODAL */}
      {isNewSLAModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 ios-blur p-0 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-t-[32px] sm:rounded-[32px] bg-white p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <div className="w-10 h-1.5 rounded-full bg-slate-300 mx-auto -mt-2 mb-2 sm:hidden" />

            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#045D6E] flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Execute New Service Level Agreement</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setIsNewSLAModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSLA} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Approved SLA Master Template</label>
                <select
                  value={selectedTemplateId}
                  onChange={(e) => setSelectedTemplateId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  {slaTemplates.map((t) => (
                    <option key={t.id} value={t.id}>{t.title} ({t.type})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Client Entity / Partner Institution *</label>
                <input
                  type="text"
                  required
                  value={slaClientName}
                  onChange={(e) => setSlaClientName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Contact Person</label>
                  <input
                    type="text"
                    required
                    value={slaContactPerson}
                    onChange={(e) => setSlaContactPerson(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Phone</label>
                  <input
                    type="text"
                    required
                    value={slaPhone}
                    onChange={(e) => setSlaPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Turnaround Time SLA (Hours)</label>
                  <input
                    type="number"
                    value={slaTurnaround}
                    onChange={(e) => setSlaTurnaround(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Annual Retainer Fee (₦)</label>
                  <input
                    type="number"
                    value={slaRetainerFee}
                    onChange={(e) => setSlaRetainerFee(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewSLAModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#045D6E] text-white font-bold"
                >
                  Issue SLA Contract
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GENERATE NEW INVOICE MODAL */}
      {isNewInvoiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 ios-blur p-0 sm:p-4 overflow-y-auto">
          <form
            onSubmit={handleCreateInvoice}
            className="w-full max-w-2xl rounded-t-[32px] sm:rounded-[32px] bg-white p-6 shadow-2xl border border-slate-200 space-y-4 my-0 sm:my-auto max-h-[92vh] overflow-y-auto text-xs"
          >
            <div className="w-10 h-1.5 rounded-full bg-slate-300 mx-auto -mt-2 mb-2 sm:hidden" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#045D6E] flex items-center justify-center font-bold">
                  <Receipt className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Generate Hospital Tax Invoice</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setIsNewInvoiceModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Select Target Patient / Corporate Account */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Populate from Active Case / Lead</label>
              <select
                value={targetLeadId}
                onChange={(e) => handleLeadSelect(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
              >
                {filteredLeads.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name} ({l.type === 'patient' ? 'Patient' : 'Corporate'}) - {l.clinicalInterest}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Billed Entity Name *</label>
                <input
                  type="text"
                  required
                  value={invClientName}
                  onChange={(e) => setInvClientName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Client Phone</label>
                <input
                  type="text"
                  value={invClientPhone}
                  onChange={(e) => setInvClientPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Payment Due Date</label>
                <input
                  type="date"
                  value={invDueDate}
                  onChange={(e) => setInvDueDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                />
              </div>
            </div>

            {/* Line Items */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Itemized Clinical Services</span>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="px-2.5 py-1 rounded-lg bg-teal-50 text-[#045D6E] font-bold text-[11px] hover:bg-teal-100"
                >
                  + Add Item
                </button>
              </div>

              <div className="space-y-2">
                {invItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                      placeholder="Investigation Description"
                      className="flex-1 p-2 rounded-lg border border-slate-300 bg-white"
                    />
                    <input
                      type="number"
                      value={item.quantity}
                      min={1}
                      onChange={(e) => handleItemChange(idx, 'quantity', Number(e.target.value))}
                      className="w-16 p-2 rounded-lg border border-slate-300 bg-white text-center"
                    />
                    <input
                      type="number"
                      value={item.unitPriceNGN}
                      onChange={(e) => handleItemChange(idx, 'unitPriceNGN', Number(e.target.value))}
                      className="w-28 p-2 rounded-lg border border-slate-300 bg-white text-right"
                    />
                    {invItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-200">
              <div className="text-slate-600">
                <div>Subtotal: <strong>{formatCurrency(calculatedSubtotal)}</strong></div>
                <div>VAT (7.5%): <strong>{formatCurrency(calculatedVAT)}</strong></div>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase text-slate-400 font-bold">Total Payable</div>
                <div className="text-base font-black text-[#045D6E]">{formatCurrency(calculatedGrandTotal)}</div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsNewInvoiceModalOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-600 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#045D6E] text-white font-bold"
              >
                Create Invoice
              </button>
            </div>
          </form>
        </div>
      )}

      {/* OFFICIAL SERVICE LEVEL AGREEMENT DOCUMENT PREVIEW & NATIVE PRINT MODAL */}
      {isSLAPreviewModalOpen && previewingSla && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-3xl rounded-[28px] bg-white shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in zoom-in-95">
            
            {/* Modal Actions Header (Hidden on native print) */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3 no-print shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#045D6E] bg-teal-50 px-2 py-0.5 rounded-full">
                  Official Legal SLA
                </span>
                <span className="text-xs font-mono font-bold text-slate-700">{previewingSla.agreementNumber}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleNativePrint}
                  className="px-3.5 py-1.5 rounded-full bg-[#045D6E] text-white hover:bg-[#034a58] text-xs font-bold flex items-center gap-1.5 shadow-sm ios-pressable"
                  title="Print using phone or browser built-in print dialog"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Document</span>
                </button>

                <a
                  href={`https://wa.me/${previewingSla.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Here is the official executed Service Level Agreement (${previewingSla.agreementNumber}) with ${currentTenant.name}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 ios-pressable"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send WhatsApp</span>
                </a>

                <button
                  onClick={() => setIsSLAPreviewModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 text-sm font-bold"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Printable Official SLA Document Container */}
            <div className="p-6 sm:p-10 overflow-y-auto flex-1 space-y-6 text-xs text-slate-800 print-document-target">
              
              {/* Hospital Official Branding Header */}
              <div 
                className="h-2 rounded-full w-full mb-4" 
                style={{ backgroundColor: currentTenant.primaryColor || '#045D6E' }} 
              />

              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b-2 border-slate-100">
                <div className="flex items-center gap-3.5">
                  {currentTenant.logoUrl ? (
                    <img 
                      src={currentTenant.logoUrl} 
                      alt={currentTenant.name} 
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-2xs shrink-0" 
                    />
                  ) : (
                    <div 
                      className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center text-white font-black shrink-0 shadow-xs"
                      style={{ backgroundColor: currentTenant.primaryColor || '#045D6E' }}
                    >
                      <span className="text-base">{currentTenant.shortName.substring(0, 3).toUpperCase()}</span>
                      <span className="text-[7px] tracking-wider text-teal-100">HOSPITAL</span>
                    </div>
                  )}
                  <div>
                    <h1 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                      {currentTenant.name}
                    </h1>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">{currentTenant.tagline}</p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {currentTenant.address}, {currentTenant.city}, {currentTenant.state} • Phone: {currentTenant.phone} • Email: {currentTenant.email}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[9px] text-slate-400 font-mono">
                      <span>RC: {currentTenant.cacNumber}</span>
                      <span>•</span>
                      <span>TIN: {currentTenant.tinNumber}</span>
                      <span>•</span>
                      <span>Web: {currentTenant.website}</span>
                    </div>
                  </div>
                </div>

                <div className="sm:text-right shrink-0 bg-slate-50 p-3 rounded-2xl border border-slate-100 sm:w-56">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">AGREEMENT REF</span>
                  <div className="font-mono font-bold text-slate-900 text-sm mt-0.5">{previewingSla.agreementNumber}</div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    Effective: <strong>{previewingSla.effectiveDate}</strong>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Expiry: <strong>{previewingSla.expiryDate}</strong>
                  </div>
                  <div className="mt-1.5 inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-emerald-100 text-emerald-800">
                    {previewingSla.status.replace('_', ' ')}
                  </div>
                </div>
              </div>

              {/* Title & Agreement Head */}
              <div className="text-center py-2">
                <h2 className="text-base font-extrabold uppercase tracking-wide text-slate-900">
                  MASTER MEDICAL SERVICE LEVEL AGREEMENT (SLA) & CLINICAL TARIFF CONTRACT
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Executed pursuant to Nigerian Healthcare Diagnostic Regulations & National Health Insurance Guidelines
                </p>
              </div>

              {/* Section 1: Parties */}
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2">
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-[#045D6E]">
                  1. Contracting Parties
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <span className="font-semibold text-slate-500 block">THE HEALTHCARE SERVICE PROVIDER:</span>
                    <strong className="text-slate-900 text-xs block">{currentTenant.name}</strong>
                    <span className="text-slate-600 block">{currentTenant.address}, {currentTenant.city}</span>
                    <span className="text-slate-600 block">Lead Representative: {currentTenant.authorizedSignatoryName || 'Medical Director'}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-500 block">THE CLIENT / REFERRED INSTITUTION:</span>
                    <strong className="text-slate-900 text-xs block">{previewingSla.clientOrDoctorName}</strong>
                    <span className="text-slate-600 block">Contact Representative: {previewingSla.contactPerson}</span>
                    <span className="text-slate-600 block">Phone: {previewingSla.phone} • Email: {previewingSla.email}</span>
                  </div>
                </div>
              </div>

              {/* Section 2: Clinical Scope & TAT Commitment Table */}
              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-[#045D6E]">
                  2. Clinical Diagnostic Scope & Turnaround Time (TAT) Guarantees
                </h3>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {currentTenant.name} commits to delivering clinical pathology, imaging, and specialist assessments in accordance with ISO-15189 international laboratory standards under the following SLA turnaround schedule:
                </p>
                <div className="rounded-xl border border-slate-200 overflow-hidden">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-slate-100 font-bold text-slate-700">
                      <tr>
                        <th className="py-2 px-3">Investigation Category</th>
                        <th className="py-2 px-3">Agreed Turnaround SLA</th>
                        <th className="py-2 px-3">Escalation Threshold</th>
                        <th className="py-2 px-3">Results Channel</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                      <tr>
                        <td className="py-2 px-3 font-semibold text-slate-800">Routine Haematology & Clinical Chemistry</td>
                        <td className="py-2 px-3 font-bold text-[#045D6E]">&lt; 4 Hours</td>
                        <td className="py-2 px-3">Immediate Notification</td>
                        <td className="py-2 px-3">Portal + WhatsApp PDF</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-semibold text-slate-800">Specialist Profiles & Ultrasound Imaging</td>
                        <td className="py-2 px-3 font-bold text-[#045D6E]">&lt; {previewingSla.slaTurnaroundHours} Hours</td>
                        <td className="py-2 px-3">6 Hours</td>
                        <td className="py-2 px-3">Consultant Validated</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-semibold text-slate-800">Critical / Panic Panic Specimen Findings</td>
                        <td className="py-2 px-3 font-bold text-rose-600">&lt; 15 Minutes</td>
                        <td className="py-2 px-3">Direct Doctor Call</td>
                        <td className="py-2 px-3">Urgent Telephone Patch</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 3: Financial Retainership & Settlement */}
              <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-200/70 space-y-1.5 text-[11px]">
                <h3 className="font-bold text-teal-900 text-xs uppercase tracking-wider">
                  3. Financial Retainership & Settlement Protocol
                </h3>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                  <div>
                    <span className="text-slate-600">Quarterly Retainer Commitment Fee: </span>
                    <strong className="text-slate-900 text-sm font-black">{formatCurrency(previewingSla.retainerFeeNGN)}</strong>
                  </div>
                  <div className="text-slate-600">
                    Settlement Terms: <strong>Strictly Net-30 Days</strong> to {currentTenant.bankDetails.bankName} (Acct: {currentTenant.bankDetails.accountNumber})
                  </div>
                </div>
              </div>

              {/* Section 4: Imported Draft Custom Terms (if present) */}
              {previewingSla.customTermsText && (
                <div className="space-y-1.5 p-4 rounded-2xl bg-amber-50/40 border border-amber-200/70">
                  <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs uppercase">
                    <FileCheck className="w-4 h-4 text-amber-700" />
                    <span>4. Custom / Uploaded Draft Scope Clauses ({previewingSla.draftFileName || 'Draft Import'})</span>
                  </div>
                  <p className="text-[11px] text-slate-700 whitespace-pre-wrap leading-relaxed font-mono bg-white/70 p-3 rounded-xl border border-amber-100">
                    {previewingSla.customTermsText}
                  </p>
                </div>
              )}

              {/* Section 5: Data Protection & NDPA 2023 */}
              <div className="text-[11px] text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                <p>
                  <strong>5. Nigeria Data Protection Act (NDPA 2023) Compliance:</strong> Both parties confirm lawful processing, clinical purpose limitation, and strict pseudonymization of all patient records, biological specimens, and medical health documents transmitted hereunder.
                </p>
              </div>

              {/* Official Signatures & Seal */}
              <div className="pt-6 border-t-2 border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    SIGNED ON BEHALF OF {currentTenant.shortName.toUpperCase()}:
                  </span>
                  <div className="h-10 flex items-end border-b border-slate-300 pb-1">
                    <span className="font-serif italic font-bold text-slate-900 text-sm">
                      {currentTenant.authorizedSignatoryName || 'Dr. Chioma Okonjo, FWACP'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-700 font-semibold">
                    {currentTenant.authorizedSignatoryName || 'Dr. Chioma Okonjo, FWACP'}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {currentTenant.authorizedSignatoryTitle || 'Clinical Lead & Head of Diagnostics'}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    SIGNED ON BEHALF OF {previewingSla.clientOrDoctorName.toUpperCase()}:
                  </span>
                  <div className="h-10 flex items-end border-b border-slate-300 pb-1">
                    <span className="font-serif italic font-bold text-slate-900 text-sm">
                      {previewingSla.digitalSignatureName || previewingSla.contactPerson}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-700 font-semibold">
                    {previewingSla.digitalSignatureName || previewingSla.contactPerson}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Authorized Signatory & Institutional Representative
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Hospital SaaS Branding & Personalization Modal */}
      {isPersonalizeModalOpen && (
        <HospitalPersonalizationModal
          isOpen={isPersonalizeModalOpen}
          onClose={() => setIsPersonalizeModalOpen(false)}
        />
      )}

    </div>
  );
};
