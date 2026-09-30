import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileText, 
  CheckSquare, 
  Download, 
  Printer, 
  X, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle,
  Building,
  Plus,
  Search,
  Eye,
  Percent,
  UserCheck,
  Truck,
  Sparkles,
  Calculator,
  Calendar,
  Send,
  FileCheck
} from 'lucide-react';
import { Quotation } from '../../types';

export interface CommercialQuotationData {
  id: string;
  quotationNumber: string;
  leadId?: string;
  
  // Seller Information (Earth Metal Industries)
  seller: {
    companyName: string;
    address: string;
    gstin: string;
    pan: string;
    state: string;
    stateCode: string;
    email: string;
    phone: string;
    bankName: string;
    accountNo: string;
    ifscCode: string;
    branch: string;
  };

  // Buyer Information
  buyer: {
    companyName: string;
    contactName: string;
    designation?: string;
    billingAddress: string;
    shippingAddress: string;
    gstin: string;
    pan?: string;
    state: string;
    stateCode: string;
    email: string;
    phone: string;
  };

  // Tax Configuration
  taxType: 'INTRA_STATE' | 'INTER_STATE' | 'EXPORT_ZERO';
  gstRatePct: number; // 18, 12, 5, 28

  // Sales Broker / Agent Commission
  agent: {
    hasAgent: boolean;
    agentName: string;
    agentPhone: string;
    commissionType: 'PERCENT' | 'FIXED';
    commissionRate: number;
    commissionAmountUSD: number;
  };

  // Line items
  items: Array<{
    id: string;
    productName: string;
    sku: string;
    hsnCode: string;
    quantity: number;
    unit: string;
    unitPriceUSD: number;
    discountPct: number;
    taxableAmountUSD: number;
    totalUSD: number;
  }>;

  // Commercial Terms
  paymentTerms: string;
  deliveryTerms: string;
  validityDays: number;
  warrantyTerms: string;
  packagingTerms: string;
  inspectionTerms: string;

  // Financial Summary
  subtotalUSD: number;
  totalDiscountUSD: number;
  taxableTotalUSD: number;
  cgstTotalUSD: number;
  sgstTotalUSD: number;
  igstTotalUSD: number;
  totalTaxUSD: number;
  freightCostUSD: number;
  packagingCostUSD: number;
  grandTotalUSD: number;
  grandTotalINR: number;
  
  status: 'Draft' | 'Pending Manager Approval' | 'Approved' | 'Sent to Customer' | 'Accepted' | 'Rejected';
  createdAt: string;
  expiryDate: string;
}

const DEFAULT_SELLER_INFO = {
  companyName: 'EARTH METAL INDUSTRIES',
  address: 'Plot No. 588, G.I.D.C. Phase 2, Dared, Jamnagar – 361004, Gujarat, India',
  gstin: '24AAACE1234P1ZV',
  pan: 'AAACE1234P',
  state: 'Gujarat',
  stateCode: '24',
  email: 'brm@weldorindustries.com',
  phone: '+91-87800 98088',
  bankName: 'HDFC Bank Ltd',
  accountNo: '50200098765432',
  ifscCode: 'HDFC0001234',
  branch: 'Dared Industrial Estate Branch, Jamnagar'
};

const loadQuotes = (): CommercialQuotationData[] => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('weldor_commercial_quotes');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
  }
  return [];
};

const saveQuotes = (data: CommercialQuotationData[]) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('weldor_commercial_quotes', JSON.stringify(data));
    } catch (e) {}
  }
};

export const QuotationBuilder: React.FC = () => {
  const { 
    quotations, 
    approveQuotation, 
    rejectQuotation, 
    deleteQuotation, 
    convertQuotationToOrder, 
    setActiveView, 
    showNotification, 
    currentRole 
  } = useApp();
  
  const [quotesList, setQuotesList] = useState<CommercialQuotationData[]>(() => loadQuotes());
  const [activePDFQuotation, setActivePDFQuotation] = useState<CommercialQuotationData | null>(null);
  const [filterMode, setFilterMode] = useState<'active' | 'approved' | 'sent' | 'rejected' | 'all'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateQuoteModalOpen, setIsCreateQuoteModalOpen] = useState(false);

  // Form State for creating B2B Quotation
  const [buyerForm, setBuyerForm] = useState({
    companyName: '',
    contactName: '',
    designation: 'Procurement Head',
    billingAddress: '',
    shippingAddress: '',
    gstin: '',
    pan: '',
    state: 'Maharashtra',
    stateCode: '27',
    email: '',
    phone: '',
  });

  const [taxConfig, setTaxConfig] = useState<{
    taxType: 'INTRA_STATE' | 'INTER_STATE' | 'EXPORT_ZERO';
    gstRatePct: number;
  }>({
    taxType: 'INTER_STATE',
    gstRatePct: 18,
  });

  const [agentForm, setAgentForm] = useState<{
    hasAgent: boolean;
    agentName: string;
    agentPhone: string;
    commissionType: 'PERCENT' | 'FIXED';
    commissionRate: number;
  }>({
    hasAgent: false,
    agentName: '',
    agentPhone: '',
    commissionType: 'PERCENT',
    commissionRate: 2,
  });

  const [commercialTermsForm, setCommercialTermsForm] = useState({
    paymentTerms: '50% Advance with PO, 50% against PI before dispatch',
    deliveryTerms: 'Ex-Works Jamnagar Factory (7-10 Business Days)',
    validityDays: 30,
    warrantyTerms: '18 Months replacement warranty against manufacturing defects',
    packagingTerms: 'Seaworthy Fumigated Wooden Case with VCI Corrosion Bag',
    inspectionTerms: '100% Hydrostatic Test & EN 10204 3.1 Mill Certificate included',
    freightCostUSD: 120,
    packagingCostUSD: 60,
  });

  const [lineItems, setLineItems] = useState([
    {
      productName: 'ISO 15552 Heavy-Duty Pneumatic Actuator Cylinder (Ø63mm x 200mm)',
      sku: 'WEL-PNC-63-200',
      hsnCode: '84123100',
      quantity: 20,
      unit: 'PCS',
      unitPriceUSD: 85,
      discountPct: 5,
    },
    {
      productName: '700 Bar Solenoid Directional Hydraulic Control Valve CETOP 3',
      sku: 'WEL-HYV-700B',
      hsnCode: '84812000',
      quantity: 5,
      unit: 'PCS',
      unitPriceUSD: 280,
      discountPct: 0,
    }
  ]);

  // Live Math Calculations
  const calculatedItems = lineItems.map((item, idx) => {
    const rawTotal = (item.quantity || 0) * (item.unitPriceUSD || 0);
    const discountAmt = rawTotal * ((item.discountPct || 0) / 100);
    const taxableAmt = rawTotal - discountAmt;
    return {
      ...item,
      id: `q-item-${idx + 1}`,
      rawTotal,
      discountAmt,
      taxableAmountUSD: taxableAmt,
      totalUSD: taxableAmt,
    };
  });

  const subtotalUSD = calculatedItems.reduce((acc, it) => acc + it.rawTotal, 0);
  const totalDiscountUSD = calculatedItems.reduce((acc, it) => acc + it.discountAmt, 0);
  const taxableTotalUSD = calculatedItems.reduce((acc, it) => acc + it.taxableAmountUSD, 0);

  let cgstRate = 0;
  let sgstRate = 0;
  let igstRate = 0;

  if (taxConfig.taxType === 'INTRA_STATE') {
    cgstRate = taxConfig.gstRatePct / 2;
    sgstRate = taxConfig.gstRatePct / 2;
  } else if (taxConfig.taxType === 'INTER_STATE') {
    igstRate = taxConfig.gstRatePct;
  }

  const cgstTotalUSD = taxableTotalUSD * (cgstRate / 100);
  const sgstTotalUSD = taxableTotalUSD * (sgstRate / 100);
  const igstTotalUSD = taxableTotalUSD * (igstRate / 100);
  const totalTaxUSD = cgstTotalUSD + sgstTotalUSD + igstTotalUSD;

  const grandTotalUSD = taxableTotalUSD + totalTaxUSD + (Number(commercialTermsForm.freightCostUSD) || 0) + (Number(commercialTermsForm.packagingCostUSD) || 0);
  const grandTotalINR = Math.round(grandTotalUSD * 87.0);

  let calculatedAgentCommissionUSD = 0;
  if (agentForm.hasAgent) {
    if (agentForm.commissionType === 'PERCENT') {
      calculatedAgentCommissionUSD = taxableTotalUSD * ((agentForm.commissionRate || 0) / 100);
    } else {
      calculatedAgentCommissionUSD = Number(agentForm.commissionRate) || 0;
    }
  }

  const handleAddItemRow = () => {
    setLineItems(prev => [
      ...prev,
      {
        productName: 'Custom 5-Axis CNC Precision Manifold Block AL7075',
        sku: 'WEL-CNC-MF-NEW',
        hsnCode: '84819090',
        quantity: 5,
        unit: 'PCS',
        unitPriceUSD: 195,
        discountPct: 0,
      }
    ]);
  };

  const handleRemoveItemRow = (idx: number) => {
    if (lineItems.length <= 1) {
      showNotification('At least one product line item is required in the quotation!', 'warning');
      return;
    }
    setLineItems(prev => prev.filter((_, i) => i !== idx));
  };

  const handleCreateQuotation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerForm.companyName.trim()) {
      showNotification('Buyer Company Name is mandatory!', 'warning');
      return;
    }

    const newQuoteNumber = `WEL-QT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const today = new Date().toISOString();
    const expiry = new Date(Date.now() + (commercialTermsForm.validityDays || 30) * 86400000).toISOString().split('T')[0];

    const newQuote: CommercialQuotationData = {
      id: `quote-${Date.now()}`,
      quotationNumber: newQuoteNumber,
      seller: DEFAULT_SELLER_INFO,
      buyer: {
        companyName: buyerForm.companyName,
        contactName: buyerForm.contactName || 'Procurement Incharge',
        designation: buyerForm.designation,
        billingAddress: buyerForm.billingAddress || 'Industrial Area, India',
        shippingAddress: buyerForm.shippingAddress || buyerForm.billingAddress || 'Factory Gate, India',
        gstin: buyerForm.gstin || '27AAACE1234P1ZV',
        pan: buyerForm.pan,
        state: buyerForm.state,
        stateCode: buyerForm.stateCode,
        email: buyerForm.email || 'procurement@client.com',
        phone: buyerForm.phone || '+91 98000 00000'
      },
      taxType: taxConfig.taxType,
      gstRatePct: taxConfig.gstRatePct,
      agent: {
        hasAgent: agentForm.hasAgent,
        agentName: agentForm.agentName,
        agentPhone: agentForm.agentPhone,
        commissionType: agentForm.commissionType,
        commissionRate: agentForm.commissionRate,
        commissionAmountUSD: calculatedAgentCommissionUSD
      },
      items: calculatedItems.map(item => ({
        id: item.id,
        productName: item.productName,
        sku: item.sku,
        hsnCode: item.hsnCode,
        quantity: item.quantity,
        unit: item.unit,
        unitPriceUSD: item.unitPriceUSD,
        discountPct: item.discountPct,
        taxableAmountUSD: item.taxableAmountUSD,
        totalUSD: item.totalUSD
      })),
      paymentTerms: commercialTermsForm.paymentTerms,
      deliveryTerms: commercialTermsForm.deliveryTerms,
      validityDays: commercialTermsForm.validityDays,
      warrantyTerms: commercialTermsForm.warrantyTerms,
      packagingTerms: commercialTermsForm.packagingTerms,
      inspectionTerms: commercialTermsForm.inspectionTerms,
      subtotalUSD,
      totalDiscountUSD,
      taxableTotalUSD,
      cgstTotalUSD,
      sgstTotalUSD,
      igstTotalUSD,
      totalTaxUSD,
      freightCostUSD: Number(commercialTermsForm.freightCostUSD) || 0,
      packagingCostUSD: Number(commercialTermsForm.packagingCostUSD) || 0,
      grandTotalUSD,
      grandTotalINR,
      status: 'Approved',
      createdAt: today,
      expiryDate: expiry
    };

    setQuotesList(prev => {
      const next = [newQuote, ...prev];
      saveQuotes(next);
      return next;
    });
    setIsCreateQuoteModalOpen(false);
    setActivePDFQuotation(newQuote);
    showNotification(`Formal Quotation ${newQuoteNumber} generated successfully!`, 'success');
  };

  const filteredQuotes = quotesList.filter(q => {
    const matchesSearch = 
      q.quotationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.buyer.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.buyer.contactName && q.buyer.contactName.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (filterMode === 'active') return q.status !== 'Rejected';
    if (filterMode === 'approved') return q.status === 'Approved';
    if (filterMode === 'sent') return q.status === 'Sent to Customer';
    if (filterMode === 'rejected') return q.status === 'Rejected';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700 shadow-xl text-white">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
              B2B COMMERCIAL QUOTATION ENGINE
            </span>
            <span className="text-slate-400 text-xs font-mono">
              Earth Metal Industries • Jamnagar
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight font-heading">
            Commercial Quotations & Proforma Costings
          </h1>
          <p className="text-slate-300 text-xs max-w-2xl font-sans">
            Generate detailed B2B proposals with Seller & Buyer company credentials, itemized HSN codes, multi-tier GST (CGST/SGST/IGST), line discounts, and broker commission payouts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateQuoteModalOpen(true)}
            className="btn-primary text-xs py-2.5 px-4 shadow-orange-500/25 flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Formal Quotation</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-mono text-slate-500 block uppercase font-bold">Total Active Quotes</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-slate-900 font-mono">{quotesList.length}</span>
            <span className="text-xs font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold">100% Verified</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-mono text-slate-500 block uppercase font-bold">Total Quoted Value</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-orange-600 font-mono">₹{quotesList.reduce((sum, q) => sum + (q.grandTotalUSD || 0), 0).toLocaleString()}
            </span>
            <span className="text-[11px] font-mono text-slate-400">USD</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-mono text-slate-500 block uppercase font-bold">Total GST Tax Quoted</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-slate-800 font-mono">₹{quotesList.reduce((sum, q) => sum + (q.totalTaxUSD || 0), 0).toLocaleString()}
            </span>
            <span className="text-[11px] font-mono text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded">CGST+SGST/IGST</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-mono text-slate-500 block uppercase font-bold">Broker Commission Quoted</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-purple-700 font-mono">₹{quotesList.reduce((sum, q) => sum + (q.agent?.commissionAmountUSD || 0), 0).toFixed(2)}
            </span>
            <span className="text-[10px] font-mono text-purple-600 bg-purple-50 px-2 py-0.5 rounded font-bold">Agent Payout</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by quote #, client company, contact..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-orange-500 font-sans"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {(['active', 'approved', 'sent', 'rejected', 'all'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setFilterMode(mode)}
              className={`px-3 py-1.5 text-xs rounded-xl font-mono font-bold capitalize transition-all cursor-pointer ${
                filterMode === mode 
                  ? 'bg-slate-900 text-white shadow-xs' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Quotations List */}
      <div className="space-y-4">
        {filteredQuotes.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400 space-y-3">
            <FileText className="w-12 h-12 mx-auto text-slate-300 stroke-[1.5]" />
            <p className="font-bold text-slate-600">No commercial quotations found</p>
            <p className="text-xs">Click "Generate Formal Quotation" above to draft a detailed B2B quote with GST breakdown.</p>
          </div>
        ) : (
          filteredQuotes.map(quote => (
            <div 
              key={quote.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all p-5 space-y-4"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600 border border-orange-200 mt-0.5">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-black text-sm text-slate-900">{quote.quotationNumber}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        quote.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                        quote.status === 'Sent to Customer' ? 'bg-blue-100 text-blue-800' :
                        quote.status === 'Accepted' ? 'bg-emerald-500 text-white' :
                        quote.status === 'Rejected' ? 'bg-rose-100 text-rose-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {quote.status}
                      </span>
                      <span className="text-[10.5px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {quote.taxType === 'INTRA_STATE' ? `Intra-State (CGST ${quote.gstRatePct/2}% + SGST ${quote.gstRatePct/2}%)` :
                         quote.taxType === 'INTER_STATE' ? `Inter-State (IGST ${quote.gstRatePct}%)` : 'Export Zero-Rated LUT'}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-800 mt-1 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      {quote.buyer.companyName}
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      Attn: {quote.buyer.contactName} • GSTIN: <strong className="text-slate-700">{quote.buyer.gstin}</strong> • State: {quote.buyer.state} ({quote.buyer.stateCode})
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4">
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold">Grand Total (Incl. GST)</span>
                    <span className="text-lg font-mono font-black text-orange-600">₹{(quote.grandTotalUSD || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10.5px] font-mono text-slate-500 block">
                      ≈ ₹{(quote.grandTotalINR || Math.round((quote.grandTotalUSD || 0) * 87)).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActivePDFQuotation(quote)}
                      className="px-3.5 py-2 rounded-xl bg-orange-50 hover:bg-orange-600 text-orange-700 hover:text-white border border-orange-200 font-mono font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View & Print PDF</span>
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete quotation ${quote.quotationNumber}?`)) {
                          setQuotesList(prev => {
                            const next = prev.filter(q => q.id !== quote.id);
                            saveQuotes(next);
                            return next;
                          });
                          showNotification(`Quotation deleted`, 'info');
                        }
                      }}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      title="Delete Quotation"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Items Summary & Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase block font-bold">Itemized Products</span>
                  <p className="font-bold text-slate-800 mt-0.5">{quote.items.length} Product Line Items</p>
                  <p className="text-slate-600 text-[11px] truncate">
                    {quote.items.map(it => `${it.productName} (${it.quantity} ${it.unit})`).join(', ')}
                  </p>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] uppercase block font-bold">Tax & Freight Calculation</span>
                  <p className="text-slate-700 mt-0.5">
                    Taxable: <strong className="text-slate-900">₹{(quote.taxableTotalUSD || 0).toLocaleString()}</strong> | Tax: <strong className="text-emerald-700">₹{(quote.totalTaxUSD || 0).toLocaleString()}</strong>
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Freight: ${(quote.freightCostUSD || 0)} | Packaging: ${(quote.packagingCostUSD || 0)}
                  </p>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] uppercase block font-bold">Agent Commission / Sales Terms</span>
                  {quote.agent?.hasAgent ? (
                    <p className="text-purple-700 font-bold mt-0.5">
                      {quote.agent.agentName} ({quote.agent.commissionRate}% = ${quote.agent.commissionAmountUSD.toFixed(2)})
                    </p>
                  ) : (
                    <p className="text-slate-500 mt-0.5">Direct Factory Sale (No Agent)</p>
                  )}
                  <p className="text-[11px] text-slate-500">Validity: {quote.validityDays} Days • Ex-Works Jamnagar</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Printable Formal B2B Quotation PDF Modal */}
      {activePDFQuotation && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 max-w-4xl w-full p-6 sm:p-10 rounded-2xl shadow-2xl space-y-6 relative border border-slate-200 font-sans my-8 print:m-0 print:p-0 print:border-none print:shadow-none">
            
            {/* Modal Controls (Hidden in Print) */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 print:hidden">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-orange-100 text-orange-900 font-mono text-xs font-bold uppercase">
                  Official B2B Commercial Quotation
                </span>
                <span className="text-xs font-mono text-slate-500">{activePDFQuotation.quotationNumber}</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="btn-primary text-xs py-2 px-4 shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" /> Print / Save as PDF
                </button>
                <button 
                  onClick={() => setActivePDFQuotation(null)}
                  className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Letterhead */}
            <div className="flex justify-between items-start border-b-2 border-slate-800 pb-5">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-600 text-white font-black flex items-center justify-center text-xl tracking-tighter">
                    EMI
                  </div>
                  <div>
                    <h2 className="text-2xl font-black tracking-tight text-slate-900 font-heading">
                      {activePDFQuotation.seller.companyName}
                    </h2>
                    <p className="text-[10px] font-mono text-slate-500 uppercase font-bold tracking-wider">
                      Precision Hydraulic, Pneumatic & CNC Components OEM Manufacturer
                    </p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 font-mono mt-1">{activePDFQuotation.seller.address}</p>
                <div className="flex flex-wrap gap-x-4 text-xs text-slate-600 font-mono">
                  <span>GSTIN: <strong className="text-slate-900">{activePDFQuotation.seller.gstin}</strong></span>
                  <span>PAN: <strong className="text-slate-900">{activePDFQuotation.seller.pan}</strong></span>
                  <span>State: <strong className="text-slate-900">{activePDFQuotation.seller.state} (Code: {activePDFQuotation.seller.stateCode})</strong></span>
                </div>
                <p className="text-xs text-slate-600 font-mono">Email: {activePDFQuotation.seller.email} | Mobile: {activePDFQuotation.seller.phone}</p>
              </div>

              <div className="text-right space-y-1">
                <span className="inline-block bg-orange-600 text-white font-mono font-bold px-3 py-1 rounded text-xs tracking-wider uppercase">
                  COMMERCIAL QUOTATION
                </span>
                <p className="text-sm font-black font-mono text-slate-900 mt-1">{activePDFQuotation.quotationNumber}</p>
                <p className="text-xs text-slate-600 font-mono">Date: {new Date(activePDFQuotation.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                <p className="text-xs text-slate-600 font-mono">Valid Until: {activePDFQuotation.expiryDate}</p>
              </div>
            </div>

            {/* Buyer and Shipping Credentials */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase block tracking-wider">QUOTATION ISSUED TO (BUYER):</span>
                <p className="font-bold text-slate-900 text-sm">{activePDFQuotation.buyer.companyName}</p>
                <p className="text-slate-700">Attn: <strong>{activePDFQuotation.buyer.contactName}</strong> ({activePDFQuotation.buyer.designation || 'Procurement Incharge'})</p>
                <p className="text-slate-700">Billing Address: {activePDFQuotation.buyer.billingAddress}</p>
                <p className="text-slate-700">GSTIN: <strong className="text-slate-900">{activePDFQuotation.buyer.gstin}</strong> | PAN: {activePDFQuotation.buyer.pan || 'N/A'}</p>
                <p className="text-slate-700">State: <strong className="text-slate-900">{activePDFQuotation.buyer.state} (State Code: {activePDFQuotation.buyer.stateCode})</strong></p>
                <p className="text-slate-700">Email: {activePDFQuotation.buyer.email} | Phone: {activePDFQuotation.buyer.phone}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase block tracking-wider">DELIVERY & COMMERCIAL TERMS:</span>
                <p className="text-slate-700">Ship To: {activePDFQuotation.buyer.shippingAddress}</p>
                <p className="text-slate-700">Payment Terms: <strong className="text-slate-900">{activePDFQuotation.paymentTerms}</strong></p>
                <p className="text-slate-700">Delivery Lead Time: <strong className="text-slate-900">{activePDFQuotation.deliveryTerms}</strong></p>
                <p className="text-slate-700">Quote Validity: <strong className="text-slate-900">{activePDFQuotation.validityDays} Days</strong></p>
                <p className="text-slate-700">Warranty: <strong className="text-slate-900">{activePDFQuotation.warrantyTerms}</strong></p>
                {activePDFQuotation.agent?.hasAgent && (
                  <p className="text-purple-700 font-bold pt-1 border-t border-slate-200">
                    Channel Partner / Broker: {activePDFQuotation.agent.agentName}
                  </p>
                )}
              </div>
            </div>

            {/* Itemized Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse border border-slate-300 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-slate-800 text-white font-mono text-[11px]">
                    <th className="p-2.5 border border-slate-400 text-center w-8">#</th>
                    <th className="p-2.5 border border-slate-400">Description of Goods</th>
                    <th className="p-2.5 border border-slate-400 text-center">HSN Code</th>
                    <th className="p-2.5 border border-slate-400 text-center">Qty</th>
                    <th className="p-2.5 border border-slate-400 text-right">Unit Rate (₹)</th>
                    <th className="p-2.5 border border-slate-400 text-center">Disc %</th>
                    <th className="p-2.5 border border-slate-400 text-right">Taxable Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono">
                  {activePDFQuotation.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-2.5 border border-slate-300 text-center text-slate-500 font-bold">{idx + 1}</td>
                      <td className="p-2.5 border border-slate-300">
                        <p className="font-bold text-slate-900 font-sans">{item.productName}</p>
                        <p className="text-[10px] text-slate-500 font-mono">SKU: {item.sku}</p>
                      </td>
                      <td className="p-2.5 border border-slate-300 text-center text-slate-700 font-bold">{item.hsnCode}</td>
                      <td className="p-2.5 border border-slate-300 text-center text-slate-800 font-bold">{item.quantity} {item.unit}</td>
                      <td className="p-2.5 border border-slate-300 text-right text-slate-800">₹{item.unitPriceUSD.toFixed(2)}</td>
                      <td className="p-2.5 border border-slate-300 text-center text-slate-600">{item.discountPct > 0 ? `${item.discountPct}%` : '-'}</td>
                      <td className="p-2.5 border border-slate-300 text-right font-bold text-slate-900">₹{item.taxableAmountUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Summary & Bank Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              {/* Bank Wire Details for Advance Payment */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 text-xs font-mono space-y-1.5">
                <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                  BANK WIRE & PAYMENT DETAILS FOR ADVANCE:
                </span>
                <p className="text-slate-800">Beneficiary: <strong className="text-slate-900">{activePDFQuotation.seller.companyName}</strong></p>
                <p className="text-slate-800">Bank Name: <strong>{activePDFQuotation.seller.bankName}</strong></p>
                <p className="text-slate-800">Account No: <strong className="text-slate-900">{activePDFQuotation.seller.accountNo}</strong></p>
                <p className="text-slate-800">IFSC / RTGS Code: <strong className="text-slate-900">{activePDFQuotation.seller.ifscCode}</strong></p>
                <p className="text-slate-800">Branch: {activePDFQuotation.seller.branch}</p>
                <div className="pt-2 border-t border-slate-200 text-[10.5px] text-slate-600">
                  <p>• Material Testing: {activePDFQuotation.inspectionTerms}</p>
                  <p>• Packaging: {activePDFQuotation.packagingTerms}</p>
                </div>
              </div>

              {/* Totals Table */}
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-600">Gross Item Subtotal:</span>
                  <span className="text-slate-900 font-bold">₹{activePDFQuotation.subtotalUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                {activePDFQuotation.totalDiscountUSD > 0 && (
                  <div className="flex justify-between py-1 border-b border-slate-200 text-rose-600">
                    <span>Total Discount Savings:</span>
                    <span>- ${activePDFQuotation.totalDiscountUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                )}
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-700 font-bold">Taxable Amount:</span>
                  <span className="text-slate-900 font-bold">₹{activePDFQuotation.taxableTotalUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>

                {/* GST Split */}
                {activePDFQuotation.taxType === 'INTRA_STATE' && (
                  <>
                    <div className="flex justify-between py-1 border-b border-slate-200 text-slate-700">
                      <span>CGST ({activePDFQuotation.gstRatePct / 2}%):</span>
                      <span>₹{activePDFQuotation.cgstTotalUSD.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200 text-slate-700">
                      <span>SGST ({activePDFQuotation.gstRatePct / 2}%):</span>
                      <span>₹{activePDFQuotation.sgstTotalUSD.toFixed(2)}</span>
                    </div>
                  </>
                )}

                {activePDFQuotation.taxType === 'INTER_STATE' && (
                  <div className="flex justify-between py-1 border-b border-slate-200 text-slate-700">
                    <span>IGST ({activePDFQuotation.gstRatePct}%):</span>
                    <span>₹{activePDFQuotation.igstTotalUSD.toFixed(2)}</span>
                  </div>
                )}

                {activePDFQuotation.taxType === 'EXPORT_ZERO' && (
                  <div className="flex justify-between py-1 border-b border-slate-200 text-emerald-700 font-bold">
                    <span>Zero-Rated Export (LUT Scheme):</span>
                    <span>$0.00</span>
                  </div>
                )}

                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-600">Freight & Logistics:</span>
                  <span className="text-slate-900">₹{activePDFQuotation.freightCostUSD.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-600">Export Packaging:</span>
                  <span className="text-slate-900">₹{activePDFQuotation.packagingCostUSD.toFixed(2)}</span>
                </div>

                <div className="flex justify-between py-2 border-t-2 border-slate-900 text-sm font-black text-orange-700">
                  <span>Grand Total (USD):</span>
                  <span>₹{activePDFQuotation.grandTotalUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Approx Value in INR:</span>
                  <span>₹{activePDFQuotation.grandTotalINR.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Terms & Signatures */}
            <div className="pt-6 border-t border-slate-300 flex justify-between items-end text-xs font-mono text-slate-600">
              <div className="max-w-md text-[11px] text-slate-500 space-y-0.5">
                <p className="font-bold text-slate-700">Standard Commercial Conditions:</p>
                <p>1. Prices are valid for {activePDFQuotation.validityDays} days from the quotation date.</p>
                <p>2. Subject to Jamnagar, Gujarat jurisdiction only.</p>
                <p>3. Raw material price escalation clause applies if PO is delayed beyond validity period.</p>
              </div>

              <div className="text-center space-y-1">
                <div className="w-48 border-b border-slate-400 pb-8 text-slate-300 font-sans italic text-xs">
                  (Digital Stamp & Signature)
                </div>
                <p className="font-bold text-slate-900 text-xs">For, EARTH METAL INDUSTRIES</p>
                <p className="text-[10.5px] text-slate-500">Authorized B2B Signatory</p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Generate Custom Quotation Modal */}
      {isCreateQuoteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 max-w-4xl w-full p-6 sm:p-8 rounded-2xl shadow-2xl space-y-6 relative border border-slate-200 my-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full uppercase border border-orange-200">
                  B2B COMMERCIAL BILLING ENGINE
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-1 font-heading">
                  Create Formal B2B Quotation
                </h2>
                <p className="text-xs text-slate-500 font-sans">
                  Issue an official commercial proposal with Earth Metal Industries seller data, buyer credentials, GST tax type, and broker commission.
                </p>
              </div>
              <button 
                onClick={() => setIsCreateQuoteModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateQuotation} className="space-y-6">
              {/* Buyer / Client Information */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-orange-600" /> Buyer & Consignee Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block font-mono font-bold text-slate-700 mb-1">Buyer / Company Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apex Industrial Automation LLC"
                      value={buyerForm.companyName}
                      onChange={e => setBuyerForm(prev => ({ ...prev, companyName: e.target.value }))}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-orange-500 font-sans"
                    />
                  </div>
                  <div>
                    <label className="block font-mono font-bold text-slate-700 mb-1">Contact Person Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Rajesh Sharma"
                      value={buyerForm.contactName}
                      onChange={e => setBuyerForm(prev => ({ ...prev, contactName: e.target.value }))}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-orange-500 font-sans"
                    />
                  </div>
                  <div>
                    <label className="block font-mono font-bold text-slate-700 mb-1">Designation</label>
                    <input
                      type="text"
                      placeholder="e.g. Head of Procurement"
                      value={buyerForm.designation}
                      onChange={e => setBuyerForm(prev => ({ ...prev, designation: e.target.value }))}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-orange-500 font-sans"
                    />
                  </div>
                  <div>
                    <label className="block font-mono font-bold text-slate-700 mb-1">Official Email Address</label>
                    <input
                      type="email"
                      placeholder="procurement@apex-auto.com"
                      value={buyerForm.email}
                      onChange={e => setBuyerForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-orange-500 font-sans"
                    />
                  </div>
                  <div>
                    <label className="block font-mono font-bold text-slate-700 mb-1">Direct Phone / WhatsApp</label>
                    <input
                      type="text"
                      placeholder="+91 98765 43210"
                      value={buyerForm.phone}
                      onChange={e => setBuyerForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-orange-500 font-sans"
                    />
                  </div>
                  <div>
                    <label className="block font-mono font-bold text-slate-700 mb-1">Buyer GSTIN (15 Digits)</label>
                    <input
                      type="text"
                      placeholder="27AAACE1234P1ZV"
                      value={buyerForm.gstin}
                      onChange={e => setBuyerForm(prev => ({ ...prev, gstin: e.target.value }))}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-orange-500 font-mono uppercase"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-mono font-bold text-slate-700 mb-1">Billing & Registered Address</label>
                    <input
                      type="text"
                      placeholder="Plot No. 42, MIDC Industrial Area, Pune, Maharashtra"
                      value={buyerForm.billingAddress}
                      onChange={e => setBuyerForm(prev => ({ ...prev, billingAddress: e.target.value }))}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-orange-500 font-sans"
                    />
                  </div>
                  <div>
                    <label className="block font-mono font-bold text-slate-700 mb-1">State & State Code</label>
                    <input
                      type="text"
                      placeholder="Maharashtra (27)"
                      value={buyerForm.state}
                      onChange={e => setBuyerForm(prev => ({ ...prev, state: e.target.value }))}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-orange-500 font-sans"
                    />
                  </div>
                </div>
              </div>

              {/* GST Tax Type & Agent Commission Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* GST Tax Config */}
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
                  <span className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Calculator className="w-4 h-4 text-blue-600" /> GST Tax Configuration
                  </span>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setTaxConfig(prev => ({ ...prev, taxType: 'INTRA_STATE' }))}
                      className={`p-2 rounded-xl text-center border text-xs font-mono font-bold transition-all cursor-pointer ${
                        taxConfig.taxType === 'INTRA_STATE' 
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs' 
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div>Intra-State</div>
                      <div className="text-[10px] opacity-80">CGST + SGST</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTaxConfig(prev => ({ ...prev, taxType: 'INTER_STATE' }))}
                      className={`p-2 rounded-xl text-center border text-xs font-mono font-bold transition-all cursor-pointer ${
                        taxConfig.taxType === 'INTER_STATE' 
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs' 
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div>Inter-State</div>
                      <div className="text-[10px] opacity-80">IGST (18%)</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTaxConfig(prev => ({ ...prev, taxType: 'EXPORT_ZERO' }))}
                      className={`p-2 rounded-xl text-center border text-xs font-mono font-bold transition-all cursor-pointer ${
                        taxConfig.taxType === 'EXPORT_ZERO' 
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs' 
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div>Export LUT</div>
                      <div className="text-[10px] opacity-80">0% Zero-Rated</div>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-600 font-bold">GST Tax Rate:</span>
                    {[5, 12, 18, 28].map(rate => (
                      <button
                        key={rate}
                        type="button"
                        onClick={() => setTaxConfig(prev => ({ ...prev, gstRatePct: rate }))}
                        className={`px-2.5 py-1 text-xs rounded-lg font-mono font-bold border transition-colors cursor-pointer ${
                          taxConfig.gstRatePct === rate 
                            ? 'bg-slate-900 text-white border-slate-900' 
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {rate}%
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sales Broker / Agent Commission */}
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-purple-600" /> Sales Agent / Broker Commission
                    </span>
                    <label className="flex items-center gap-1.5 text-xs font-mono cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agentForm.hasAgent}
                        onChange={e => setAgentForm(prev => ({ ...prev, hasAgent: e.target.checked }))}
                        className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="font-bold text-slate-700">Has Agent</span>
                    </label>
                  </div>

                  {agentForm.hasAgent ? (
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      <div>
                        <label className="block text-[10.5px] text-slate-600 mb-0.5">Agent / Broker Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Apex Industrial Reps"
                          value={agentForm.agentName}
                          onChange={e => setAgentForm(prev => ({ ...prev, agentName: e.target.value }))}
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-sans"
                        />
                      </div>
                      <div>
                        <label className="block text-[10.5px] text-slate-600 mb-0.5">Commission Rate (% or ₹)</label>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="0"
                            step="0.5"
                            value={agentForm.commissionRate}
                            onChange={e => setAgentForm(prev => ({ ...prev, commissionRate: Number(e.target.value) || 0 }))}
                            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-mono"
                          />
                          <span className="text-xs text-slate-500 font-bold">%</span>
                        </div>
                      </div>
                      <div className="col-span-2 text-[11px] text-purple-700 font-bold bg-purple-50 p-2 rounded-lg border border-purple-200">
                        Calculated Agent Payout: ₹{calculatedAgentCommissionUSD.toFixed(2)} INR
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 font-mono italic">
                      Direct factory quotation without third-party sales broker.
                    </p>
                  )}
                </div>
              </div>

              {/* Line Items Table Builder */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono font-bold text-slate-800 uppercase tracking-wider">
                    Itemized Product Bill ({lineItems.length} items)
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="text-xs font-mono font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Row
                  </button>
                </div>

                <div className="space-y-2.5">
                  {lineItems.map((item, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center text-xs">
                      <div className="sm:col-span-4">
                        <label className="text-[10px] font-mono text-slate-500 block">Product / Part Name</label>
                        <input
                          type="text"
                          required
                          value={item.productName}
                          onChange={e => {
                            const val = e.target.value;
                            setLineItems(prev => {
                              const updated = [...prev];
                              updated[idx] = { ...updated[idx], productName: val };
                              return updated;
                            });
                          }}
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[10px] font-mono text-slate-500 block">SKU Code</label>
                        <input
                          type="text"
                          value={item.sku}
                          onChange={e => {
                            const val = e.target.value;
                            setLineItems(prev => {
                              const updated = [...prev];
                              updated[idx] = { ...updated[idx], sku: val };
                              return updated;
                            });
                          }}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs font-mono"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[10px] font-mono text-slate-500 block">HSN Code</label>
                        <input
                          type="text"
                          value={item.hsnCode}
                          onChange={e => {
                            const val = e.target.value;
                            setLineItems(prev => {
                              const updated = [...prev];
                              updated[idx] = { ...updated[idx], hsnCode: val };
                              return updated;
                            });
                          }}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs font-mono font-bold"
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <label className="text-[10px] font-mono text-slate-500 block">Qty</label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={item.quantity}
                          onChange={e => {
                            const val = Number(e.target.value) || 1;
                            setLineItems(prev => {
                              const updated = [...prev];
                              updated[idx] = { ...updated[idx], quantity: val };
                              return updated;
                            });
                          }}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs font-mono text-center"
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <label className="text-[10px] font-mono text-slate-500 block">Rate (₹)</label>
                        <input
                          type="number"
                          min="0"
                          required
                          value={item.unitPriceUSD}
                          onChange={e => {
                            const val = Number(e.target.value) || 0;
                            setLineItems(prev => {
                              const updated = [...prev];
                              updated[idx] = { ...updated[idx], unitPriceUSD: val };
                              return updated;
                            });
                          }}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs font-mono"
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <label className="text-[10px] font-mono text-slate-500 block">Disc %</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={item.discountPct}
                          onChange={e => {
                            const val = Number(e.target.value) || 0;
                            setLineItems(prev => {
                              const updated = [...prev];
                              updated[idx] = { ...updated[idx], discountPct: val };
                              return updated;
                            });
                          }}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs font-mono text-center"
                        />
                      </div>
                      <div className="sm:col-span-1 flex justify-end pt-3">
                        {lineItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItemRow(idx)}
                            className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                            title="Remove row"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Commercial Terms */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block font-mono font-bold text-slate-700 mb-1">Freight / Shipping (₹)</label>
                  <input
                    type="number"
                    value={commercialTermsForm.freightCostUSD}
                    onChange={e => setCommercialTermsForm(prev => ({ ...prev, freightCostUSD: Number(e.target.value) || 0 }))}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-mono font-bold text-slate-700 mb-1">Packaging Cost (₹)</label>
                  <input
                    type="number"
                    value={commercialTermsForm.packagingCostUSD}
                    onChange={e => setCommercialTermsForm(prev => ({ ...prev, packagingCostUSD: Number(e.target.value) || 0 }))}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-mono font-bold text-slate-700 mb-1">Quote Validity (Days)</label>
                  <input
                    type="number"
                    value={commercialTermsForm.validityDays}
                    onChange={e => setCommercialTermsForm(prev => ({ ...prev, validityDays: Number(e.target.value) || 30 }))}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-mono font-bold text-slate-700 mb-1">Delivery Lead Time</label>
                  <input
                    type="text"
                    value={commercialTermsForm.deliveryTerms}
                    onChange={e => setCommercialTermsForm(prev => ({ ...prev, deliveryTerms: e.target.value }))}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 font-sans"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-mono font-bold text-slate-700 mb-1">Payment Terms</label>
                  <input
                    type="text"
                    value={commercialTermsForm.paymentTerms}
                    onChange={e => setCommercialTermsForm(prev => ({ ...prev, paymentTerms: e.target.value }))}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 font-sans"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-mono font-bold text-slate-700 mb-1">Warranty & Certification Terms</label>
                  <input
                    type="text"
                    value={commercialTermsForm.warrantyTerms}
                    onChange={e => setCommercialTermsForm(prev => ({ ...prev, warrantyTerms: e.target.value }))}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 font-sans"
                  />
                </div>
              </div>

              {/* Real-Time Cost Summary Preview */}
              <div className="bg-slate-900 text-white p-4 rounded-xl font-mono text-xs flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-slate-400 text-[10px] uppercase">Taxable Subtotal:</span>
                  <p className="text-base font-bold">₹{taxableTotalUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-slate-400 text-[10px] uppercase">Total GST ({taxConfig.gstRatePct}%):</span>
                  <p className="text-base font-bold text-blue-400">₹{totalTaxUSD.toFixed(2)}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-slate-400 text-[10px] uppercase">Grand Total (USD):</span>
                  <p className="text-lg font-black text-orange-400">₹{grandTotalUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-slate-400 text-[10px] uppercase">Approx INR:</span>
                  <p className="text-base font-bold text-emerald-400">₹{grandTotalINR.toLocaleString()}</p>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCreateQuoteModalOpen(false)}
                  className="px-4 py-2 text-xs font-mono font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-2 px-6 shadow-orange-500/20 cursor-pointer"
                >
                  Generate Official Quotation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
