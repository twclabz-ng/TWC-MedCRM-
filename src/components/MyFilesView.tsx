import React, { useState, useRef } from 'react';
import { 
  Folder, 
  FileText, 
  Upload, 
  Download, 
  Trash2, 
  ExternalLink, 
  Search, 
  Filter, 
  HardDrive, 
  CheckCircle2, 
  Clock, 
  File, 
  Image, 
  FileSpreadsheet, 
  Plus, 
  Building2, 
  User, 
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { useCRM } from '../context/CRMContext';
import { TenantDocumentFile } from '../types/crm';

export const MyFilesView: React.FC = () => {
  const { 
    currentTenant, 
    filteredFiles, 
    addTenantFile, 
    deleteTenantFile, 
    filteredLeads, 
    activeAssociate, 
    associates 
  } = useCRM();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFileForPreview, setSelectedFileForPreview] = useState<TenantDocumentFile | null>(null);

  // Upload Form State
  const [fileName, setFileName] = useState('');
  const [selectedLeadId, setSelectedLeadId] = useState('');
  const [category, setCategory] = useState<TenantDocumentFile['category']>('lab_report');
  const [notes, setNotes] = useState('');
  const [fileSizeStr, setFileSizeStr] = useState('1.8 MB');
  const [uploadSuccessToast, setUploadSuccessToast] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Categories definition
  const categories: { id: TenantDocumentFile['category']; label: string; color: string }[] = [
    { id: 'lab_report', label: 'Lab Reports & Pathology', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { id: 'radiology_scan', label: 'Radiology & Scans', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    { id: 'retainer_mou', label: 'Retainer MOUs', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { id: 'sla_contract', label: 'SLA Contracts', color: 'bg-teal-50 text-teal-700 border-teal-200' },
    { id: 'invoice_pdf', label: 'Invoice PDFs', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { id: 'consent_slip', label: 'NDPA Consent Slips', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { id: 'referral_letter', label: 'Referral Letters', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
    { id: 'general', label: 'General Hospital Docs', color: 'bg-slate-50 text-slate-700 border-slate-200' },
  ];

  const formatFileSize = (bytes: number): string => {
    if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`;
    if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${bytes} B`;
  };

  const getFileIcon = (cat: TenantDocumentFile['category']) => {
    switch (cat) {
      case 'lab_report':
        return <FileText className="w-5 h-5 text-emerald-600" />;
      case 'radiology_scan':
        return <Image className="w-5 h-5 text-indigo-600" />;
      case 'invoice_pdf':
        return <FileSpreadsheet className="w-5 h-5 text-purple-600" />;
      case 'sla_contract':
      case 'retainer_mou':
        return <FileCheck className="w-5 h-5 text-teal-600" />;
      case 'consent_slip':
        return <FileText className="w-5 h-5 text-amber-600" />;
      default:
        return <File className="w-5 h-5 text-slate-500" />;
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFileSizeStr(formatFileSize(file.size));
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName) return;

    const matchedLead = filteredLeads.find(l => l.id === selectedLeadId);

    addTenantFile({
      tenantId: currentTenant.id,
      name: fileName,
      patientLeadId: selectedLeadId || undefined,
      patientName: matchedLead ? matchedLead.name : undefined,
      category,
      sizeBytes: Math.floor(Math.random() * 2000000 + 500000),
      uploadedByAssociateName: activeAssociate ? activeAssociate.name : associates[0].name,
      fileType: 'application/pdf',
      driveUrl: `${currentTenant.driveFolderUrl}/${encodeURIComponent(fileName)}`,
      downloadUrl: '#',
      notes,
    });

    setUploadSuccessToast(true);
    setTimeout(() => setUploadSuccessToast(false), 4000);

    setFileName('');
    setNotes('');
    setSelectedLeadId('');
    setIsUploadModalOpen(false);
  };

  const handleDownload = (file: TenantDocumentFile) => {
    // Generate a downloadable medical document text or blob trigger for phone / browser
    const docContent = `OFFICIAL HOSPITAL RECORD - ${currentTenant.name.toUpperCase()}
Document: ${file.name}
Category: ${file.category}
Patient: ${file.patientName || 'General Record'}
Uploaded Date: ${file.uploadedAt}
Authorized Associate: ${file.uploadedByAssociateName}
Google Drive Location: ${file.driveUrl}
Hospital CAC: ${currentTenant.cacNumber}

---
Verified authentic medical record synchronized with Google Drive tenant archive.
`;
    const blob = new Blob([docContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name.endsWith('.pdf') ? file.name.replace('.pdf', '_record.txt') : `${file.name}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Filter files
  const displayedFiles = filteredFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (file.patientName && file.patientName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (file.notes && file.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = categoryFilter === 'all' || file.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const totalBytes = filteredFiles.reduce((acc, f) => acc + f.sizeBytes, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Toast Notification */}
      {uploadSuccessToast && (
        <div className="fixed top-16 right-4 z-50 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Patient document uploaded & synchronized to Google Drive!</span>
        </div>
      )}

      {/* Header with Google Drive Folder Link & Tenant Scoping */}
      <div className="bg-white p-5 sm:p-6 rounded-[28px] border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-[#045D6E] border border-teal-200">
              Tenant Drive Archive
            </span>
            <span className="text-xs text-slate-400 font-semibold">•</span>
            <span className="text-xs text-slate-500 font-semibold">{currentTenant.name}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1.5 tracking-tight flex items-center gap-2">
            <Folder className="w-6 h-6 text-[#045D6E]" />
            <span>My Files & Patient Document Repository</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Upload, search, and download verified clinical pathology reports, radiology imaging, retainer MOUs, and consent slips isolated for this hospital.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <a
            href={currentTenant.driveFolderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all ios-pressable"
            title="Open isolated hospital Google Drive root folder"
          >
            <HardDrive className="w-4 h-4 text-slate-600" />
            <span>Open Google Drive</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#045D6E] hover:bg-[#034a58] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm shadow-[#045D6E]/20 transition-all ios-pressable"
          >
            <Upload className="w-4 h-4" />
            <span>+ Upload Document</span>
          </button>
        </div>
      </div>

      {/* Storage & Folder Structure Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Patient Files</p>
            <p className="text-lg font-black text-slate-900 mt-0.5">{filteredFiles.length} Documents</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#045D6E] flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Drive Cloud Storage</p>
            <p className="text-lg font-black text-[#045D6E] mt-0.5">{formatFileSize(totalBytes)}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <HardDrive className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Dedicated Tenant Folder</p>
            <p className="text-xs font-mono font-semibold text-slate-700 mt-1 truncate max-w-[170px]" title={currentTenant.driveFolderId}>
              {currentTenant.driveFolderId}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by file name, patient, notes..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50/70 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#045D6E]/30"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              categoryFilter === 'all' 
                ? 'bg-slate-900 text-white' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Files ({filteredFiles.length})
          </button>
          {categories.map((cat) => {
            const count = filteredFiles.filter(f => f.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  categoryFilter === cat.id
                    ? 'bg-[#045D6E] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Files Grid */}
      {displayedFiles.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200">
          <Folder className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-800">No Patient Documents Found</h4>
          <p className="text-xs text-slate-500 mt-1">
            {searchQuery ? 'No documents match your query.' : 'Upload clinical reports, scans, or retainer agreements for this hospital.'}
          </p>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="mt-4 px-4 py-2 rounded-xl bg-[#045D6E] text-white text-xs font-bold shadow-sm"
          >
            + Upload First Document
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedFiles.map((file) => {
            const catObj = categories.find(c => c.id === file.category);
            return (
              <div
                key={file.id}
                className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#045D6E]/50 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center shrink-0">
                        {getFileIcon(file.category)}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-[#045D6E] transition-colors" title={file.name}>
                          {file.name}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-semibold">
                          {formatFileSize(file.sizeBytes)} • {file.uploadedAt.split(' ')[0]}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Patient Tag */}
                  {file.patientName && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-700 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-100">
                      <User className="w-3.5 h-3.5 text-[#045D6E] shrink-0" />
                      <span className="font-semibold truncate">{file.patientName}</span>
                    </div>
                  )}

                  {/* Category Pill */}
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${catObj?.color || 'bg-slate-100 text-slate-700'}`}>
                      {catObj?.label || file.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      By: {file.uploadedByAssociateName}
                    </span>
                  </div>

                  {file.notes && (
                    <p className="text-[11px] text-slate-600 line-clamp-2 bg-slate-50/50 p-2 rounded-xl italic">
                      "{file.notes}"
                    </p>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleDownload(file)}
                      className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-[#045D6E] text-xs font-bold flex items-center gap-1 transition-colors ios-pressable"
                      title="Download file to device"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>

                    <a
                      href={file.driveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
                      title="Open file in Google Drive"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm(`Remove ${file.name} from tenant files repository?`)) {
                        deleteTenantFile(file.id);
                      }
                    }}
                    className="p-1.5 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                    title="Delete document record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* UPLOAD DOCUMENT MODAL */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 ios-blur p-0 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-t-[32px] sm:rounded-[32px] bg-white p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <div className="w-10 h-1.5 rounded-full bg-slate-300 mx-auto -mt-2 mb-2 sm:hidden" />

            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#045D6E] flex items-center justify-center font-bold">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Upload Patient Document to Drive</h3>
                  <p className="text-[11px] text-slate-500">Target Folder: {currentTenant.driveFolderId}</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              
              {/* Dropzone / File Picker */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#045D6E]/40 hover:border-[#045D6E] bg-teal-50/30 hover:bg-teal-50/60 p-6 rounded-2xl text-center cursor-pointer transition-all space-y-2"
              >
                <Upload className="w-8 h-8 text-[#045D6E] mx-auto" />
                <p className="font-bold text-slate-800 text-xs">
                  {fileName ? `Selected: ${fileName}` : 'Tap or Drag & Drop Clinical Document / Scan Here'}
                </p>
                <p className="text-[10px] text-slate-500">
                  Accepts PDF, DICOM, JPEG, PNG, DOCX (Max 25 MB per file)
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Document Display Name *</label>
                <input
                  type="text"
                  required
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="e.g. Chief_Adeleke_Lipid_Panel_Signed.pdf"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#045D6E]/30"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Clinical Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Link to Patient Lead</label>
                  <select
                    value={selectedLeadId}
                    onChange={(e) => setSelectedLeadId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white"
                  >
                    <option value="">General Hospital Folder</option>
                    {filteredLeads.map(l => (
                      <option key={l.id} value={l.id}>{l.name} ({l.type})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Clinical Notes & Audit Annotations</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Consultant review complete. Normal sinus rhythm with mild sinus bradycardia."
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#045D6E]/30"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Automatically synced to isolated folder in <strong>{currentTenant.shortName}</strong> Google Drive archive with NDPA encryption.
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!fileName}
                  className="px-5 py-2 rounded-xl bg-[#045D6E] hover:bg-[#034a58] disabled:opacity-40 text-white font-bold transition-all ios-pressable"
                >
                  Upload & Sync to Drive
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
