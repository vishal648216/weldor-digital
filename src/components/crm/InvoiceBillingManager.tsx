import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileText, 
  Plus, 
  Printer, 
  Download, 
  X, 
  CheckCircle2, 
  Building, 
  CreditCard, 
  Search, 
  Eye, 
  DollarSign,
  ArrowRight,
  ShieldCheck,
  Percent,
  UserCheck,
  Truck,
  FileCheck,
  Sparkles,
  Calculator,
  Calendar
} from 'lucide-react';

export interface TaxInvoice {
  id: string;
  invoiceNumber: string;
  quotationRef?: string;
  poNumber?: string;
  poDate?: string;
  
  // Seller Info (Earth Metal Industries)
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

  // Buyer Info
  buyer: {
    companyName: string;
    contactName: string;
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
  gstRatePct: number; // e.g. 18, 12, 28, 5

  // Agent / Broker Commission
  agent: {
    hasAgent: boolean;
    agentName: string;
    agentPhone: string;
    commissionType: 'PERCENT' | 'FIXED';
    commissionRate: number; // % or fixed USD
    commissionAmountUSD: number;
  };

  // Line items
  items: Array<{
    id: string;
    description: string;
    sku: string;
    hsnCode: string;
    quantity: number;
    unit: string;
    unitPriceUSD: number;
    discountPct: number;
    taxableAmountUSD: number;
    cgstAmountUSD: number;
    sgstAmountUSD: number;
    igstAmountUSD: number;
    totalUSD: number;
  }>;

  // Commercial Terms
  paymentTerms: string;
  deliveryTerms: string;
  dispatchThrough: string;
  destination: string;
  
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
  status: 'Paid' | 'Pending Payment' | 'Dispatched' | 'Draft';
  issueDate: string;
  dueDate: string;
}

const DEFAULT_SELLER = {
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

export const InvoiceBillingManager: React.FC = () => {
  const { showNotification } = useApp();

  const [invoices, setInvoices] = useState<TaxInvoice[]>([]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activePrintInvoice, setActivePrintInvoice] = useState<TaxInvoice | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [formBuyer, setFormBuyer] = useState({
    companyName: '',
    contactName: '',
    billingAddress: '',
    shippingAddress: '',
    gstin: '',
    pan: '',
    state: 'Maharashtra',
    stateCode: '27',
    email: '',
    phone: '',
    poNumber: '',
    poDate: ''
  });

  const [formTaxType, setFormTaxType] = useState<'INTRA_STATE' | 'INTER_STATE' | 'EXPORT_ZERO'>('INTER_STATE');
  const [formGstRatePct, setFormGstRatePct] = useState<number>(18);

  const [formAgent, setFormAgent] = useState({
    hasAgent: false,
    agentName: '',
    agentPhone: '',
    commissionType: 'PERCENT' as 'PERCENT' | 'FIXED',
    commissionRate: 2
  });

  const [formItems, setFormItems] = useState<Array<{
    description: string;
    sku: string;
    hsnCode: string;
    quantity: number;
    unit: string;
    unitPriceUSD: number;
    discountPct: number;
  }>>([
    {
      description: 'ISO 15552 Heavy-Duty Pneumatic Cylinder',
      sku: 'WEL-PNC-63-200',
      hsnCode: '84123100',
      quantity: 20,
      unit: 'PCS',
      unitPriceUSD: 95,
      discountPct: 5
    }
  ]);

  const [formFreightUSD, setFormFreightUSD] = useState(150);
  const [formPackagingUSD, setFormPackagingUSD] = useState(50);
  const [formPaymentTerms, setFormPaymentTerms] = useState('50% Advance, Balance against Proforma Invoice');
  const [formDeliveryTerms, setFormDeliveryTerms] = useState('Ex-Works Jamnagar (7-10 Business Days)');
  const [formDispatchThrough, setFormDispatchThrough] = useState('Road Transport Cargo / Courier');
  const [formDestination, setFormDestination] = useState('Client Plant Location');

  const handleAddItem = () => {
    setFormItems(prev => [
      ...prev,
      {
        description: '700 Bar Solenoid Hydraulic Directional Valve CETOP 3',
        sku: 'WEL-HYV-700B',
        hsnCode: '84812000',
        quantity: 5,
        unit: 'PCS',
        unitPriceUSD: 290,
        discountPct: 0
      }
    ]);
  };

  const handleRemoveItem = (idx: number) => {
    setFormItems(prev => prev.filter((_, i) => i !== idx));
  };

  const calculateFormFinancials = () => {
    let subtotalUSD = 0;
    let totalDiscountUSD = 0;

    const calculatedItems = formItems.map((item, idx) => {
      const rawTotal = item.quantity * item.unitPriceUSD;
      const discountAmt = rawTotal * ((item.discountPct || 0) / 100);
      const taxable = rawTotal - discountAmt;

      subtotalUSD += rawTotal;
      totalDiscountUSD += discountAmt;

      let cgst = 0;
      let sgst = 0;
      let igst = 0;

      if (formTaxType === 'INTRA_STATE') {
        cgst = taxable * ((formGstRatePct / 2) / 100);
        sgst = taxable * ((formGstRatePct / 2) / 100);
      } else if (formTaxType === 'INTER_STATE') {
        igst = taxable * (formGstRatePct / 100);
      }

      return {
        id: `item-${idx + 1}`,
        ...item,
        taxableAmountUSD: taxable,
        cgstAmountUSD: cgst,
        sgstAmountUSD: sgst,
        igstAmountUSD: igst,
        totalUSD: taxable + cgst + sgst + igst
      };
    });

    const taxableTotalUSD = subtotalUSD - totalDiscountUSD;
    let cgstTotalUSD = 0;
    let sgstTotalUSD = 0;
    let igstTotalUSD = 0;

    if (formTaxType === 'INTRA_STATE') {
      cgstTotalUSD = taxableTotalUSD * ((formGstRatePct / 2) / 100);
      sgstTotalUSD = taxableTotalUSD * ((formGstRatePct / 2) / 100);
    } else if (formTaxType === 'INTER_STATE') {
      igstTotalUSD = taxableTotalUSD * (formGstRatePct / 100);
    }

    const totalTaxUSD = cgstTotalUSD + sgstTotalUSD + igstTotalUSD;
    const grandTotalUSD = taxableTotalUSD + totalTaxUSD + Number(formFreightUSD) + Number(formPackagingUSD);
    const grandTotalINR = Math.round(grandTotalUSD * 85);

    let commissionAmountUSD = 0;
    if (formAgent.hasAgent) {
      commissionAmountUSD = formAgent.commissionType === 'PERCENT'
        ? (taxableTotalUSD * (formAgent.commissionRate / 100))
        : formAgent.commissionRate;
    }

    return {
      calculatedItems,
      subtotalUSD,
      totalDiscountUSD,
      taxableTotalUSD,
      cgstTotalUSD,
      sgstTotalUSD,
      igstTotalUSD,
      totalTaxUSD,
      grandTotalUSD,
      grandTotalINR,
      commissionAmountUSD
    };
  };

  const handleCreateInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formBuyer.companyName) {
      showNotification('Buyer Company Name is required!', 'warning');
      return;
    }

    const financials = calculateFormFinancials();

    const newInvoice: TaxInvoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `WEL-INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      quotationRef: `WEL-QT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      poNumber: formBuyer.poNumber || `PO-${Math.floor(1000 + Math.random() * 9000)}`,
      poDate: formBuyer.poDate || new Date().toISOString().slice(0, 10),
      seller: DEFAULT_SELLER,
      buyer: {
        ...formBuyer,
        billingAddress: formBuyer.billingAddress || 'Industrial Park, Client Location',
        shippingAddress: formBuyer.shippingAddress || formBuyer.billingAddress || 'Plant Bay, Delivery Site'
      },
      taxType: formTaxType,
      gstRatePct: formGstRatePct,
      agent: {
        ...formAgent,
        commissionAmountUSD: financials.commissionAmountUSD
      },
      items: financials.calculatedItems,
      paymentTerms: formPaymentTerms,
      deliveryTerms: formDeliveryTerms,
      dispatchThrough: formDispatchThrough,
      destination: formDestination,
      subtotalUSD: financials.subtotalUSD,
      totalDiscountUSD: financials.totalDiscountUSD,
      taxableTotalUSD: financials.taxableTotalUSD,
      cgstTotalUSD: financials.cgstTotalUSD,
      sgstTotalUSD: financials.sgstTotalUSD,
      igstTotalUSD: financials.igstTotalUSD,
      totalTaxUSD: financials.totalTaxUSD,
      freightCostUSD: Number(formFreightUSD) || 0,
      packagingCostUSD: Number(formPackagingUSD) || 0,
      grandTotalUSD: financials.grandTotalUSD,
      grandTotalINR: financials.grandTotalINR,
      status: 'Pending Payment',
      issueDate: new Date().toISOString().slice(0, 10),
      dueDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10)
    };

    setInvoices(prev => [newInvoice, ...prev]);
    setIsCreateModalOpen(false);
    showNotification(`Tax Invoice ${newInvoice.invoiceNumber} generated successfully!`, 'success');
    setActivePrintInvoice(newInvoice);
  };

  const filteredInvoices = invoices.filter(inv => 
    inv.buyer.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (inv.poNumber && inv.poNumber.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const previewFinancials = calculateFormFinancials();

  return (
    <div className="p-6 space-y-6 text-slate-900 font-sans">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-orange-700 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full uppercase flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-orange-600" /> B2B GST Tax Billing & Proforma Engine
            </span>
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              CGST / SGST / IGST & Broker Commission Compliant
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 font-heading mt-2">
            Commercial Tax Invoices, GST Breakdown & Dispatch Hub
          </h1>
          <p className="text-xs text-slate-600 font-medium mt-1 max-w-3xl">
            Generate itemized tax invoices with CGST (9%) + SGST (9%) or IGST (18%), discount rules, sales agent commissions, complete seller & buyer company details, and banking dispatch notes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn-primary text-xs py-2.5 px-4 shadow-orange-500/20 flex items-center gap-2 font-bold cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Generate New GST Tax Invoice</span>
          </button>
        </div>
      </div>

      {/* Invoices Ledger Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Tax Invoices Ledger ({filteredInvoices.length} invoices)
            </h3>
            <p className="text-xs text-slate-500">Official billing and proforma accounts register</p>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by buyer, invoice no, PO..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 w-72 focus:outline-hidden focus:border-orange-500 font-sans"
            />
          </div>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 font-mono text-slate-700">
              <tr>
                <th className="p-3">INVOICE & PO REF</th>
                <th className="p-3">BUYER COMPANY / GSTIN</th>
                <th className="p-3">TAX TYPE & RATE</th>
                <th className="p-3 text-right">TAXABLE VALUE</th>
                <th className="p-3 text-right">GST TAX TOTAL</th>
                <th className="p-3 text-right">GRAND TOTAL</th>
                <th className="p-3 text-center">STATUS</th>
                <th className="p-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map(inv => (
                <tr key={inv.id} className="hover:bg-slate-50">
                  <td className="p-3">
                    <p className="font-mono font-bold text-orange-700 text-sm">{inv.invoiceNumber}</p>
                    <p className="text-slate-500 text-[11px] font-mono">PO: {inv.poNumber || 'N/A'}</p>
                  </td>
                  <td className="p-3">
                    <strong className="text-slate-900 text-sm">{inv.buyer.companyName}</strong>
                    <p className="text-slate-500 text-[11px] font-mono">
                      GSTIN: {inv.buyer.gstin || 'Unregistered'} | State: {inv.buyer.state} ({inv.buyer.stateCode})
                    </p>
                  </td>
                  <td className="p-3 font-mono">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                      {inv.taxType === 'INTRA_STATE' ? `CGST+SGST (${inv.gstRatePct}%)` : `IGST (${inv.gstRatePct}%)`}
                    </span>
                    {inv.agent.hasAgent && (
                      <p className="text-[10px] text-amber-700 font-bold mt-0.5">
                        Broker: {inv.agent.agentName} (${inv.agent.commissionAmountUSD})
                      </p>
                    )}
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-slate-900">₹{inv.taxableTotalUSD.toLocaleString()}
                  </td>
                  <td className="p-3 text-right font-mono text-slate-600">₹{inv.totalTaxUSD.toLocaleString()}
                  </td>
                  <td className="p-3 text-right font-mono font-black text-slate-900 text-sm">₹{inv.grandTotalUSD.toLocaleString()}
                    <span className="block text-[10px] text-slate-500 font-normal">₹{inv.grandTotalINR.toLocaleString()}</span>
                  </td>
                  <td className="p-3 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setActivePrintInvoice(inv)}
                      className="px-3 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-600 text-orange-700 hover:text-white border border-orange-200 font-mono font-bold text-xs transition-colors inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print GST Invoice</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE INVOICE MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 max-w-4xl w-full p-6 sm:p-8 rounded-2xl shadow-2xl space-y-6 relative border border-slate-200 my-8 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-orange-600 bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded uppercase">
                  GST 18% & Commercial Billing Engine
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                  Create Commercial GST Tax Invoice
                </h2>
              </div>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoiceSubmit} className="space-y-6">
              
              {/* 1. SELLER & BUYER COMPANY CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Seller (Earth Metal Industries) */}
                <div className="p-4 rounded-xl border border-orange-200 bg-orange-50/30 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-orange-900 uppercase">SELLER / SUPPLIER:</span>
                    <span className="text-[10px] bg-orange-100 text-orange-900 px-2 py-0.5 rounded font-mono font-bold">Earth Metal Ind.</span>
                  </div>
                  <p className="font-bold text-slate-900 text-sm">{DEFAULT_SELLER.companyName}</p>
                  <p className="text-slate-600">{DEFAULT_SELLER.address}</p>
                  <p className="font-mono text-slate-700">GSTIN: <strong>{DEFAULT_SELLER.gstin}</strong> | State: <strong>Gujarat (24)</strong></p>
                  <p className="font-mono text-slate-700">Bank: <strong>HDFC Jamnagar</strong> (A/C: {DEFAULT_SELLER.accountNo})</p>
                </div>

                {/* Buyer / Customer Info Form */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 text-xs">
                  <span className="font-mono font-bold text-slate-800 uppercase block">BUYER / CONSIGNEE DETAILS:</span>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-mono text-slate-500 font-bold block">Company Name *</label>
                      <input
                        type="text"
                        required
                        value={formBuyer.companyName}
                        onChange={e => setFormBuyer(prev => ({ ...prev, companyName: e.target.value }))}
                        placeholder="e.g. Apex Industrial Automation"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-slate-500 font-bold block">Contact Person</label>
                      <input
                        type="text"
                        value={formBuyer.contactName}
                        onChange={e => setFormBuyer(prev => ({ ...prev, contactName: e.target.value }))}
                        placeholder="e.g. Manoj Sharma"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-mono text-slate-500 font-bold block">Buyer GSTIN</label>
                      <input
                        type="text"
                        value={formBuyer.gstin}
                        onChange={e => setFormBuyer(prev => ({ ...prev, gstin: e.target.value }))}
                        placeholder="27AAACL1234F1Z8"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono uppercase"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-slate-500 font-bold block">Buyer State & Code</label>
                      <input
                        type="text"
                        value={formBuyer.state}
                        onChange={e => setFormBuyer(prev => ({ ...prev, state: e.target.value }))}
                        placeholder="Maharashtra (27)"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-slate-500 font-bold block">Billing & Delivery Address</label>
                    <input
                      type="text"
                      value={formBuyer.billingAddress}
                      onChange={e => setFormBuyer(prev => ({ ...prev, billingAddress: e.target.value }))}
                      placeholder="Plot 44, GIDC Industrial Estate, Pune, Maharashtra"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-mono text-slate-500 font-bold block">Buyer PO Number</label>
                      <input
                        type="text"
                        value={formBuyer.poNumber}
                        onChange={e => setFormBuyer(prev => ({ ...prev, poNumber: e.target.value }))}
                        placeholder="PO-2026-8812"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-slate-500 font-bold block">Buyer Email / Phone</label>
                      <input
                        type="text"
                        value={formBuyer.email}
                        onChange={e => setFormBuyer(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="accounts@buyer.com / +91-9876543210"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* 2. GST TAX TYPE & AGENT COMMISSION CONTROLS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs">
                
                {/* GST Tax Selector */}
                <div className="space-y-2">
                  <label className="font-mono font-bold text-slate-800 uppercase block">GST Tax Structure:</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormTaxType('INTER_STATE')}
                      className={`p-2 rounded-lg border text-center font-mono font-bold cursor-pointer ${
                        formTaxType === 'INTER_STATE' ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      IGST (Inter-State)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormTaxType('INTRA_STATE')}
                      className={`p-2 rounded-lg border text-center font-mono font-bold cursor-pointer ${
                        formTaxType === 'INTRA_STATE' ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      CGST + SGST (Gujarat)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormTaxType('EXPORT_ZERO')}
                      className={`p-2 rounded-lg border text-center font-mono font-bold cursor-pointer ${
                        formTaxType === 'EXPORT_ZERO' ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      0% (Export LUT)
                    </button>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[11px] font-mono text-slate-600 font-bold">Standard GST Rate:</span>
                    {[5, 12, 18, 28].map(rate => (
                      <button
                        key={rate}
                        type="button"
                        onClick={() => setFormGstRatePct(rate)}
                        className={`px-2.5 py-1 rounded text-xs font-mono font-bold cursor-pointer ${
                          formGstRatePct === rate ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-700'
                        }`}
                      >
                        {rate}%
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sales Agent / Broker Commission */}
                <div className="space-y-2 border-l border-slate-200 pl-4">
                  <div className="flex items-center justify-between">
                    <label className="font-mono font-bold text-slate-800 uppercase">Sales Agent / Commission:</label>
                    <input
                      type="checkbox"
                      checked={formAgent.hasAgent}
                      onChange={e => setFormAgent(prev => ({ ...prev, hasAgent: e.target.checked }))}
                      className="rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                    />
                  </div>

                  {formAgent.hasAgent ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Agent / Channel Partner Name"
                        value={formAgent.agentName}
                        onChange={e => setFormAgent(prev => ({ ...prev, agentName: e.target.value }))}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-mono text-slate-500 block">Commission Rate (%)</label>
                          <input
                            type="number"
                            min="0"
                            step="0.5"
                            value={formAgent.commissionRate}
                            onChange={e => setFormAgent(prev => ({ ...prev, commissionRate: Number(e.target.value) || 0 }))}
                            className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-slate-500 block">Est. Payout (₹)</label>
                          <input
                            type="text"
                            readOnly
                            value={`$${previewFinancials.commissionAmountUSD.toFixed(2)}`}
                            className="w-full px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-mono font-bold text-amber-800"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-500 text-[11px]">No sales broker attached to this direct commercial deal.</p>
                  )}
                </div>

              </div>

              {/* 3. ITEMIZED PRODUCTS BILL */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-mono font-bold text-slate-800 uppercase">
                    Itemized Products Bill & HSN Codes ({formItems.length} lines)
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="font-mono font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Product Row
                  </button>
                </div>

                <div className="space-y-2">
                  {formItems.map((item, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center text-xs">
                      <div className="sm:col-span-4">
                        <label className="text-[10px] text-slate-500 font-mono block">Product Description</label>
                        <input
                          type="text"
                          required
                          value={item.description}
                          onChange={e => {
                            const val = e.target.value;
                            setFormItems(prev => {
                              const copy = [...prev];
                              copy[idx] = { ...copy[idx], description: val };
                              return copy;
                            });
                          }}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[10px] text-slate-500 font-mono block">HSN Code</label>
                        <input
                          type="text"
                          value={item.hsnCode}
                          onChange={e => {
                            const val = e.target.value;
                            setFormItems(prev => {
                              const copy = [...prev];
                              copy[idx] = { ...copy[idx], hsnCode: val };
                              return copy;
                            });
                          }}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs font-mono"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[10px] text-slate-500 font-mono block">Qty</label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={item.quantity}
                          onChange={e => {
                            const val = Number(e.target.value) || 1;
                            setFormItems(prev => {
                              const copy = [...prev];
                              copy[idx] = { ...copy[idx], quantity: val };
                              return copy;
                            });
                          }}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs font-mono"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[10px] text-slate-500 font-mono block">Rate (₹)</label>
                        <input
                          type="number"
                          min="0"
                          required
                          value={item.unitPriceUSD}
                          onChange={e => {
                            const val = Number(e.target.value) || 0;
                            setFormItems(prev => {
                              const copy = [...prev];
                              copy[idx] = { ...copy[idx], unitPriceUSD: val };
                              return copy;
                            });
                          }}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs font-mono"
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <label className="text-[10px] text-slate-500 font-mono block">Disc %</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={item.discountPct}
                          onChange={e => {
                            const val = Number(e.target.value) || 0;
                            setFormItems(prev => {
                              const copy = [...prev];
                              copy[idx] = { ...copy[idx], discountPct: val };
                              return copy;
                            });
                          }}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs font-mono"
                        />
                      </div>
                      <div className="sm:col-span-1 flex justify-end pt-3">
                        {formItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="text-rose-500 hover:text-rose-700 p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. FINANCIAL SUMMARY & LOGISTICS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-mono text-slate-600 block">Freight / Shipping (₹)</label>
                      <input
                        type="number"
                        value={formFreightUSD}
                        onChange={e => setFormFreightUSD(Number(e.target.value) || 0)}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-slate-600 block">Packaging & Forwarding (₹)</label>
                      <input
                        type="number"
                        value={formPackagingUSD}
                        onChange={e => setFormPackagingUSD(Number(e.target.value) || 0)}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-slate-600 block">Payment Terms</label>
                    <input
                      type="text"
                      value={formPaymentTerms}
                      onChange={e => setFormPaymentTerms(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                {/* Calculation Summary Card */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span className="font-bold text-slate-900">₹{previewFinancials.subtotalUSD.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-orange-700 font-bold">
                    <span>Discount:</span>
                    <span>-₹{previewFinancials.totalDiscountUSD.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-700 border-t border-slate-200 pt-1">
                    <span>Taxable Amount:</span>
                    <span className="font-bold">₹{previewFinancials.taxableTotalUSD.toLocaleString()}</span>
                  </div>
                  {formTaxType === 'INTRA_STATE' ? (
                    <>
                      <div className="flex justify-between text-slate-600">
                        <span>CGST ({formGstRatePct / 2}%):</span>
                        <span>₹{previewFinancials.cgstTotalUSD.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>SGST ({formGstRatePct / 2}%):</span>
                        <span>₹{previewFinancials.sgstTotalUSD.toFixed(2)}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between text-slate-600">
                      <span>IGST ({formGstRatePct}%):</span>
                      <span>₹{previewFinancials.igstTotalUSD.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span>Freight & Packaging:</span>
                    <span>₹{Number(formFreightUSD) + Number(formPackagingUSD)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-300 font-black text-sm text-orange-700">
                    <span>Grand Total:</span>
                    <span>₹{previewFinancials.grandTotalUSD.toFixed(2)} (₹{previewFinancials.grandTotalINR.toLocaleString()})</span>
                  </div>
                </div>

              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-mono text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-2.5 px-6 shadow-orange-500/20 flex items-center gap-2"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Generate Official Tax Invoice</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* PRINTABLE PDF MODAL */}
      {activePrintInvoice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 max-w-4xl w-full p-8 rounded-2xl shadow-2xl space-y-6 relative border border-slate-200 my-8">
            
            <button 
              onClick={() => setActivePrintInvoice(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 print:hidden"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Document Header */}
            <div className="flex justify-between items-start border-b-2 border-slate-900 pb-5">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <img src="/weldor-logo.png" alt="Weldor Logo" className="h-10 w-auto object-contain" />
                  <div>
                    <h2 className="text-xl font-black text-slate-900 font-heading leading-tight">
                      {activePrintInvoice.seller.companyName}
                    </h2>
                    <p className="text-[10.5px] font-mono text-slate-600">Manufacturers of Precision Hydraulic & Pneumatic Automation</p>
                  </div>
                </div>
                <p className="text-xs text-slate-700 font-mono mt-2">{activePrintInvoice.seller.address}</p>
                <p className="text-xs text-slate-700 font-mono">
                  GSTIN: <strong>{activePrintInvoice.seller.gstin}</strong> | PAN: <strong>{activePrintInvoice.seller.pan}</strong> | State: <strong>{activePrintInvoice.seller.state} ({activePrintInvoice.seller.stateCode})</strong>
                </p>
              </div>

              <div className="text-right space-y-1">
                <span className="inline-block bg-orange-100 text-orange-900 border border-orange-300 px-3 py-1 rounded text-xs font-mono font-bold">
                  TAX INVOICE (GST)
                </span>
                <p className="text-sm font-black font-mono text-slate-900 mt-1">{activePrintInvoice.invoiceNumber}</p>
                <p className="text-xs text-slate-600 font-mono">Date: {activePrintInvoice.issueDate}</p>
                <p className="text-xs text-slate-600 font-mono">PO Ref: {activePrintInvoice.poNumber} ({activePrintInvoice.poDate})</p>
              </div>
            </div>

            {/* Buyer and Consignee Information */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl font-mono border border-slate-200">
              <div className="space-y-1">
                <span className="text-slate-500 block uppercase font-bold text-[10px]">BILLED & SHIPPED TO:</span>
                <p className="font-extrabold text-slate-900 text-sm">{activePrintInvoice.buyer.companyName}</p>
                <p className="text-slate-700">Attn: {activePrintInvoice.buyer.contactName}</p>
                <p className="text-slate-600">{activePrintInvoice.buyer.billingAddress}</p>
                <p className="text-slate-800 font-bold">GSTIN: {activePrintInvoice.buyer.gstin} | State: {activePrintInvoice.buyer.state} ({activePrintInvoice.buyer.stateCode})</p>
              </div>

              <div className="space-y-1 text-right">
                <span className="text-slate-500 block uppercase font-bold text-[10px]">PAYMENT & BANKING DETAILS:</span>
                <p>Bank Name: <strong className="text-slate-900">{activePrintInvoice.seller.bankName}</strong></p>
                <p>A/C Number: <strong className="text-slate-900">{activePrintInvoice.seller.accountNo}</strong></p>
                <p>IFSC Code: <strong className="text-slate-900">{activePrintInvoice.seller.ifscCode}</strong> ({activePrintInvoice.seller.branch})</p>
                <p>Payment Terms: <strong className="text-slate-900">{activePrintInvoice.paymentTerms}</strong></p>
                {activePrintInvoice.agent.hasAgent && (
                  <p className="text-amber-800 font-bold">Channel Partner: {activePrintInvoice.agent.agentName}</p>
                )}
              </div>
            </div>

            {/* Itemized Table */}
            <table className="w-full text-xs text-left border-collapse border border-slate-300">
              <thead className="bg-slate-100 font-mono text-slate-800">
                <tr>
                  <th className="p-2.5 border border-slate-300">#</th>
                  <th className="p-2.5 border border-slate-300">Description of Goods</th>
                  <th className="p-2.5 border border-slate-300 font-mono">HSN</th>
                  <th className="p-2.5 border border-slate-300 text-right font-mono">Qty</th>
                  <th className="p-2.5 border border-slate-300 text-right font-mono">Rate (₹)</th>
                  <th className="p-2.5 border border-slate-300 text-right font-mono">Disc</th>
                  <th className="p-2.5 border border-slate-300 text-right font-mono">Taxable (₹)</th>
                  <th className="p-2.5 border border-slate-300 text-right font-mono">GST (₹)</th>
                  <th className="p-2.5 border border-slate-300 text-right font-mono">Total (₹)</th>
                </tr>
              </thead>
              <tbody>
                {activePrintInvoice.items.map((item, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="p-2 border border-slate-300 text-center font-mono">{i + 1}</td>
                    <td className="p-2 border border-slate-300 font-bold text-slate-900">{item.description} ({item.sku})</td>
                    <td className="p-2 border border-slate-300 font-mono text-slate-600">{item.hsnCode}</td>
                    <td className="p-2 border border-slate-300 text-right font-mono">{item.quantity} {item.unit}</td>
                    <td className="p-2 border border-slate-300 text-right font-mono">₹{item.unitPriceUSD}</td>
                    <td className="p-2 border border-slate-300 text-right font-mono text-orange-700">{item.discountPct}%</td>
                    <td className="p-2 border border-slate-300 text-right font-mono font-bold">₹{item.taxableAmountUSD.toLocaleString()}</td>
                    <td className="p-2 border border-slate-300 text-right font-mono">₹{(item.cgstAmountUSD + item.sgstAmountUSD + item.igstAmountUSD).toFixed(2)}
                    </td>
                    <td className="p-2 border border-slate-300 text-right font-mono font-black text-slate-900">₹{item.totalUSD.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals Breakdown */}
            <div className="flex justify-end">
              <div className="w-80 space-y-1 text-xs font-mono text-right border border-slate-200 p-3 rounded-xl bg-slate-50">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-bold">₹{activePrintInvoice.subtotalUSD.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-orange-700 font-bold">
                  <span>Discount Total:</span>
                  <span>-₹{activePrintInvoice.totalDiscountUSD.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-1 font-bold">
                  <span>Taxable Value:</span>
                  <span>₹{activePrintInvoice.taxableTotalUSD.toLocaleString()}</span>
                </div>
                {activePrintInvoice.taxType === 'INTRA_STATE' ? (
                  <>
                    <div className="flex justify-between text-slate-600">
                      <span>CGST ({activePrintInvoice.gstRatePct / 2}%):</span>
                      <span>₹{activePrintInvoice.cgstTotalUSD.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>SGST ({activePrintInvoice.gstRatePct / 2}%):</span>
                      <span>₹{activePrintInvoice.sgstTotalUSD.toFixed(2)}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between text-slate-600">
                    <span>IGST ({activePrintInvoice.gstRatePct}%):</span>
                    <span>₹{activePrintInvoice.igstTotalUSD.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Freight & Forwarding:</span>
                  <span>₹{activePrintInvoice.freightCostUSD + activePrintInvoice.packagingCostUSD}</span>
                </div>
                <div className="flex justify-between pt-2 border-t-2 border-slate-900 font-black text-base text-orange-700">
                  <span>Grand Total:</span>
                  <span>₹{activePrintInvoice.grandTotalUSD.toFixed(2)}</span>
                </div>
                <p className="text-[10px] text-slate-500 font-normal">Approx. INR: ₹{activePrintInvoice.grandTotalINR.toLocaleString()}</p>
              </div>
            </div>

            {/* Signatures */}
            <div className="pt-6 border-t border-slate-200 flex justify-between items-end print:pt-16">
              <div className="text-xs font-mono text-slate-600 space-y-1">
                <p>Terms: Standard ISO 9001:2015 Warranty Applicable</p>
                <p>Goods once sold subject to Jamnagar Jurisdiction</p>
              </div>

              <div className="text-center font-mono text-xs">
                <p className="border-t border-slate-400 pt-1 w-52 font-bold text-slate-900">For, EARTH METAL INDUSTRIES</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Authorized Signatory / Accounts Division</p>
              </div>
            </div>

            <div className="flex justify-end print:hidden pt-2">
              <button
                onClick={() => window.print()}
                className="btn-primary text-xs py-2 px-5 flex items-center gap-2"
              >
                <Printer className="w-4 h-4" /> Print / Save Tax Invoice PDF
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
