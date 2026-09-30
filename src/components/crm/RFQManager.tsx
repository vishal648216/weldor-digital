import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileText, 
  FileUp, 
  CheckCircle2, 
  Download, 
  ArrowRight, 
  Layers, 
  Eye, 
  Plus, 
  Package, 
  FlaskConical, 
  CheckSquare, 
  Clock, 
  AlertCircle,
  X,
  UserCheck,
  Search,
  Filter,
  ExternalLink
} from 'lucide-react';
import type { RFQRequirement } from '../../types';
import { FileUploadZone, type UploadedFileMeta } from '../common/FileUploadZone';

export const RFQManager: React.FC = () => {
  const { 
    rfqs, 
    products, 
    createQuotationFromLead, 
    addPublicRFQLead,
    setActiveView, 
    showNotification,
    employees
  } = useApp();

  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRfqForCad, setSelectedRfqForCad] = useState<RFQRequirement | null>(null);
  const [isAddRfqModalOpen, setIsAddRfqModalOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFileMeta | null>(null);

  // New RFQ form state
  const [newRfqData, setNewRfqData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    country: 'India',
    categoryName: 'Pneumatic Automation',
    requirementType: 'Custom OEM Drawing' as const,
    targetQuantity: 200,
    targetUnit: 'PCS' as const,
    materialPreference: 'SS304 / Viton Seals',
    pressureRating: '16 Bar Operating',
    drawingFileName: '',
    technicalNotes: 'High-speed automated packaging line requirement.'
  });

  const filteredRfqs = rfqs.filter(r => {
    const matchesStatus = filterStatus === 'All' || r.status === filterStatus;
    const matchesSearch = !searchQuery || 
      r.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleCreateNewRfq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRfqData.companyName.trim() || !newRfqData.email.trim()) {
      showNotification('Please enter company name and contact email.', 'warning');
      return;
    }

    const attachedFileName = uploadedFile?.name || newRfqData.drawingFileName || 'Customer_Blueprint.pdf';
    const attachedFileUrl = uploadedFile?.url || '';

    const leadNumber = addPublicRFQLead({
      title: `Inbound RFQ (${newRfqData.categoryName}): ${newRfqData.companyName}`,
      companyName: newRfqData.companyName,
      contactPerson: newRfqData.contactPerson,
      email: newRfqData.email,
      phone: newRfqData.phone || '+91 98250 11223',
      country: newRfqData.country,
      categoryName: newRfqData.categoryName,
      targetQuantity: newRfqData.targetQuantity,
      preferredResponse: 'Email',
      technicalNotes: `${newRfqData.technicalNotes} | Attached Blueprint: ${attachedFileName}`,
      cadFileUrl: attachedFileUrl,
    });

    showNotification(`New Inbound RFQ (${leadNumber}) logged with attached file ${attachedFileName}!`, 'success');
    setIsAddRfqModalOpen(false);
    setUploadedFile(null);
    setNewRfqData({
      companyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      country: 'India',
      categoryName: 'Pneumatic Automation',
      requirementType: 'Custom OEM Drawing',
      targetQuantity: 200,
      targetUnit: 'PCS',
      materialPreference: 'SS304 / Viton Seals',
      pressureRating: '16 Bar Operating',
      drawingFileName: '',
      technicalNotes: 'High-speed automated packaging line requirement.'
    });
  };

  const handleConvertToQuote = (rfq: RFQRequirement) => {
    const matchedProduct = products.find(p => p.category === rfq.categoryName) || products[0];
    const unitPrice = matchedProduct?.priceUSD || 250;
    
    createQuotationFromLead(rfq.leadId, [
      {
        id: `item-${Date.now()}`,
        productId: matchedProduct?.id || `prod-spec-${Date.now()}`,
        productName: matchedProduct ? `${matchedProduct.name} (${rfq.materialPreference})` : `${rfq.categoryName} (${rfq.materialPreference})`,
        sku: matchedProduct?.sku || 'WEL-SPEC-01',
        quantity: rfq.targetQuantity,
        unitPriceUSD: unitPrice,
        discountPercentage: 5,
        taxPercentage: 18,
        totalPriceUSD: rfq.targetQuantity * unitPrice * 0.95,
      }
    ], 1500, 30);

    showNotification(`Commercial Quotation generated for RFQ from ${rfq.companyName}!`, 'success');
    setActiveView('crm-quotations');
  };

  return (
    <div className="p-6 space-y-6 text-slate-900 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5 bg-white p-6 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-orange-600 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full uppercase">
              Engineering Workspace & Inbound Pipeline
            </span>
            <span className="text-xs font-mono text-slate-500 font-semibold">
              {rfqs.length} Active Inquiries
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-heading mt-2">
            Inbound RFQs & 3D CAD Drawing Evaluations
          </h1>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Review customer 3D CAD blueprints, verify CNC machinability, check pressure tolerances, and convert directly to Quotations or Samples.
          </p>
        </div>

        <button
          onClick={() => setIsAddRfqModalOpen(true)}
          className="btn-primary text-xs py-2.5 px-4 shadow-md flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Log Inbound RFQ / CAD</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input 
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by Company, Contact Name, Product Division..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-orange-600"
          />
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 overflow-x-auto">
          {['All', 'Under Review', 'Converted to Quote', 'Feasibility Approved'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all shrink-0 ${
                filterStatus === st 
                  ? 'bg-orange-600 text-white shadow-xs' 
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

      </div>

      {/* RFQ List Cards */}
      <div className="space-y-4">
        {filteredRfqs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 space-y-2">
            <p className="text-sm font-semibold">No RFQs matched your filter criteria.</p>
            <button onClick={() => { setFilterStatus('All'); setSearchQuery(''); }} className="text-xs font-mono text-orange-600 font-bold underline">
              Reset Filters
            </button>
          </div>
        ) : (
          filteredRfqs.map(rfq => (
            <div key={rfq.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:border-orange-300 transition-colors">
              
              {/* Card Top Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold bg-orange-50 text-orange-800 border border-orange-200 px-2.5 py-0.5 rounded-md">
                    {rfq.requirementType}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-heading">
                      {rfq.companyName}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono font-medium">
                      Contact: {rfq.contactPerson} • {rfq.email} • {rfq.country}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${
                    rfq.status === 'Converted to Quote' 
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                      : 'bg-amber-50 text-amber-800 border-amber-300'
                  }`}>
                    ● {rfq.status}
                  </span>
                </div>
              </div>

              {/* Engineering Specs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500 block font-bold text-[10px] uppercase">PRODUCT DIVISION</span>
                  <span className="text-slate-900 font-bold">{rfq.categoryName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block font-bold text-[10px] uppercase">TARGET PRODUCTION VOLUME</span>
                  <span className="text-orange-700 font-extrabold">{rfq.targetQuantity} {rfq.targetUnit}</span>
                </div>
                <div>
                  <span className="text-slate-500 block font-bold text-[10px] uppercase">MATERIAL SPECIFICATION</span>
                  <span className="text-slate-900 font-bold">{rfq.materialPreference}</span>
                </div>
                <div>
                  <span className="text-slate-500 block font-bold text-[10px] uppercase">PRESSURE / DUTY RATING</span>
                  <span className="text-blue-700 font-bold">{rfq.pressureRating || 'Standard ISO'}</span>
                </div>
              </div>

              {/* Attached CAD Blueprint Preview Bar */}
              {rfq.drawingFileName && (
                <div className="p-3.5 rounded-xl bg-orange-50/60 border border-orange-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                  <div className="flex items-center gap-2 text-orange-900 font-medium">
                    <FileUp className="w-4 h-4 text-orange-600 shrink-0" />
                    <span>Customer Blueprint File: <strong className="font-bold">{rfq.drawingFileName}</strong> (.STEP CAD 3D)</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button 
                      onClick={() => setSelectedRfqForCad(rfq)}
                      className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-orange-700 border border-orange-300 font-bold text-xs flex items-center gap-1 shadow-xs transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" /> Inspect 3D Geometry
                    </button>

                    <button 
                      onClick={() => showNotification(`Downloading CAD Model: ${rfq.drawingFileName}`, 'info')}
                      className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold text-xs flex items-center gap-1 shadow-xs transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-600" /> Download .STEP
                    </button>
                  </div>
                </div>
              )}

              {/* Connected Process Flow Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
                <span className="text-xs text-slate-500 font-mono">
                  Inquiry Received: {new Date(rfq.createdAt).toLocaleDateString()}
                </span>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      showNotification(`Sample Request created for ${rfq.companyName}!`, 'success');
                      setActiveView('crm-samples');
                    }}
                    className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 font-bold"
                  >
                    <Package className="w-3.5 h-3.5 text-orange-600" />
                    <span>Dispatch Prototype Sample</span>
                  </button>

                  <button
                    onClick={() => {
                      showNotification(`Technical Trial created for ${rfq.companyName}!`, 'success');
                      setActiveView('crm-trials');
                    }}
                    className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 font-bold"
                  >
                    <FlaskConical className="w-3.5 h-3.5 text-blue-600" />
                    <span>Initiate Lab Trial</span>
                  </button>

                  <button
                    onClick={() => handleConvertToQuote(rfq)}
                    className="btn-primary text-xs py-2 px-4 shadow-sm flex items-center gap-1.5 font-bold"
                  >
                    <CheckSquare className="w-3.5 h-3.5" />
                    <span>Convert to Commercial Quotation</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

      {/* =========================================================================
          MODAL: 3D CAD BLUEPRINT INSPECTOR
         ========================================================================= */}
      {selectedRfqForCad && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-orange-600 uppercase">Technical Blueprint & Drawing Review</span>
                <h3 className="text-xl font-extrabold text-slate-900 font-heading">
                  {selectedRfqForCad.drawingFileName || 'Customer Blueprint.pdf'}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {selectedRfqForCad.cadFileUrl && (
                  <a
                    href={selectedRfqForCad.cadFileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 font-bold"
                  >
                    <Download className="w-3.5 h-3.5 text-orange-600" />
                    <span>Download / Open File</span>
                  </a>
                )}
                <button onClick={() => setSelectedRfqForCad(null)} className="p-2 rounded-full hover:bg-slate-100 text-slate-500">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Simulated 3D Interactive Canvas Box */}
            <div className="h-64 sm:h-80 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden text-center p-6 space-y-3 text-white">
              <div className="w-16 h-16 rounded-2xl bg-orange-600/20 border border-orange-500/40 flex items-center justify-center text-orange-400 shadow-xl animate-pulse">
                <Layers className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <p className="font-mono text-sm font-bold text-slate-200">Interactive 3D Solid Geometry Rendering</p>
                <p className="text-xs text-slate-400 font-mono">Format: STEP / IGES • Triangles: 48,200 • Accuracy: ±0.005mm</p>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-700 px-2.5 py-1 rounded">
                  ✓ Machinability Verified
                </span>
                <span className="text-[10px] font-mono bg-blue-950 text-blue-400 border border-blue-700 px-2.5 py-1 rounded">
                  ✓ 5-Axis CNC Tool Path Ready
                </span>
              </div>
            </div>

            {/* Review Parameters */}
            <div className="grid grid-cols-3 gap-3 text-xs font-mono bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-500 block font-bold text-[10px]">RAW MATERIAL</span>
                <span className="text-slate-900 font-bold">{selectedRfqForCad.materialPreference}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-bold text-[10px]">ESTIMATED CYCLE TIME</span>
                <span className="text-orange-700 font-bold">14.5 Mins / Component</span>
              </div>
              <div>
                <span className="text-slate-500 block font-bold text-[10px]">ESTIMATED TOOLING COST</span>
                <span className="text-emerald-700 font-bold">$0 (Standard CNC Tooling)</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-200">
              <button 
                onClick={() => {
                  showNotification(`Approved Engineering Feasibility for ${selectedRfqForCad.companyName}`, 'success');
                  setSelectedRfqForCad(null);
                }}
                className="btn-secondary text-xs py-2 px-4"
              >
                Approve Feasibility & Close
              </button>

              <button 
                onClick={() => {
                  const r = selectedRfqForCad;
                  setSelectedRfqForCad(null);
                  handleConvertToQuote(r);
                }}
                className="btn-primary text-xs py-2 px-5"
              >
                Proceed to Generate Quotation →
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ADD NEW INBOUND RFQ
         ========================================================================= */}
      {isAddRfqModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-slate-900 font-heading text-lg">Log Inbound RFQ / Drawing</h3>
              <button onClick={() => setIsAddRfqModalOpen(false)} className="text-slate-500 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewRfq} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 font-mono">Company Name *</label>
                  <input 
                    type="text"
                    required
                    value={newRfqData.companyName}
                    onChange={e => setNewRfqData({ ...newRfqData, companyName: e.target.value })}
                    placeholder="e.g. Larsen & Toubro Heavy Engg"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 font-mono">Contact Person *</label>
                  <input 
                    type="text"
                    required
                    value={newRfqData.contactPerson}
                    onChange={e => setNewRfqData({ ...newRfqData, contactPerson: e.target.value })}
                    placeholder="e.g. Ramesh Kulkarni"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 font-mono">Email *</label>
                  <input 
                    type="email"
                    required
                    value={newRfqData.email}
                    onChange={e => setNewRfqData({ ...newRfqData, email: e.target.value })}
                    placeholder="contact@company.com"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 font-mono">Target Volume (Qty)</label>
                  <input 
                    type="number"
                    value={newRfqData.targetQuantity}
                    onChange={e => setNewRfqData({ ...newRfqData, targetQuantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 font-mono">Product Division</label>
                <select
                  value={newRfqData.categoryName}
                  onChange={e => setNewRfqData({ ...newRfqData, categoryName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold"
                >
                  <option value="Pneumatic Automation">Pneumatic Automation (ISO Cylinders)</option>
                  <option value="High Pressure Hydraulics">High Pressure Hydraulics (700 Bar Valves)</option>
                  <option value="Welding & Robotics">Welding & Robotics (MIG Torches)</option>
                  <option value="Precision Engineering">Precision Engineering (5-Axis CNC)</option>
                  <option value="Fire Safety Solutions">Fire Safety Solutions (UL Listed)</option>
                </select>
              </div>

              <div className="space-y-1">
                <FileUploadZone
                  label="Technical Blueprint / Drawing Document (.PDF / .STEP / .CAD)"
                  value={uploadedFile}
                  onChange={setUploadedFile}
                  helperText="Upload PDF specification sheet, STEP 3D CAD drawing, or ZIP archive (Max 50MB)"
                />
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <button type="button" onClick={() => setIsAddRfqModalOpen(false)} className="btn-secondary text-xs py-2 px-4">
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs py-2 px-5">
                  Save Inbound RFQ
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
