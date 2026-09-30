import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  FileText, 
  AlertTriangle, 
  Clock, 
  ArrowUpRight, 
  Plus, 
  ShoppingBag,
  Box,
  Layers,
  Image as ImageIcon,
  QrCode,
  Zap,
  Phone,
  MessageSquare,
  CheckCircle2,
  Send,
  Calendar,
  CreditCard,
  UserPlus,
  Flame,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Sliders
} from 'lucide-react';

export const CRMDashboard: React.FC = () => {
  const { 
    leads, 
    rfqs, 
    quotations, 
    orders, 
    employees, 
    payrolls,
    banners,
    setActiveView,
    updateLeadStage,
    showNotification
  } = useApp();

  const [activeLeadAction, setActiveLeadAction] = useState<string | null>(null);

  const totalWonValueUSD = orders.reduce((sum, o) => sum + (o.totalValueUSD || (o as any).totalAmountUSD || 0), 0);
  const pendingQuotesCount = quotations.filter(q => q.status === 'Pending Manager Approval' || q.status === 'Sent to Customer').length;
  const newLeads = leads.filter(l => l.stage === 'NEW_LEAD');
  const urgentLeads = leads.filter(l => l.priority === 'Urgent' || l.priority === 'High');

  // Payroll 5-Day Alert Calculation
  const daysUntilSalaryPayout = 5; // Configurable automated cycle
  const currentMonthPayrollCount = payrolls.filter(p => p.payrollMonth === 'September 2026').length;
  const pendingPayrollDisbursals = payrolls.filter(p => p.payrollMonth === 'September 2026' && p.status !== 'Paid').length;

  const handleInstantWhatsApp = (lead: any) => {
    updateLeadStage(lead.id, 'CONTACTED');
    showNotification(`⚡ WhatsApp commercial catalog & intro sent to ${lead.contactName} (${lead.contactPhone})!`, 'success');
  };

  const handleInstantCallLog = (lead: any) => {
    updateLeadStage(lead.id, 'REQUIREMENT_UNDERSTOOD');
    showNotification(`📞 Call logged with ${lead.contactName}. Moved to Requirement Understood!`, 'success');
  };

  return (
    <div className="p-6 space-y-6 text-slate-900 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 rounded-2xl text-white shadow-xl border border-slate-700/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-orange-400 uppercase tracking-wider mb-1">
            <Zap className="w-4 h-4" />
            <span>EXECUTIVE COMMAND CENTER & AUTOMATION ENGINE</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight font-heading">
            Weldor Enterprise Digital Hub
          </h1>
          <p className="text-slate-300 text-xs md:text-sm mt-1 max-w-2xl">
            Real-time multi-channel pipeline from instant lead ingestion & CAD blueprint reviews to automated payroll cycles and 6-stage dispatch.
          </p>
        </div>

        {/* Quick Process Launchers */}
        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={() => setActiveView('crm-leads')}
            className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold font-mono flex items-center gap-1.5 shadow-md shadow-orange-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Sales Kanban</span>
          </button>

          <button 
            onClick={() => setActiveView('crm-payroll')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
            <span>Salary Roll</span>
          </button>

          <button 
            onClick={() => setActiveView('crm-cms')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-orange-400" />
            <span>Hero Studio</span>
          </button>
        </div>
      </div>

      {/* AUTOMATION ALERT BANNERS: Instant Lead Action & 5-Day Payroll Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* ALERT 1: Instant Lead Response Action Trigger */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-white border-2 border-orange-300/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-orange-800 font-bold text-xs font-mono uppercase tracking-wider">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-600 animate-ping" />
              <span>⚡ LIVE INBOUND ACTION CENTER ({newLeads.length} Urgent Inquiries)</span>
            </div>
            <span className="text-[10.5px] font-mono bg-orange-100 text-orange-800 px-2 py-0.5 rounded font-bold border border-orange-200">
              SLA: &lt; 15 Mins
            </span>
          </div>

          <p className="text-xs text-slate-600">
            High-priority prospective buyer inquiries arrived via website drawing upload & RFQ forms. Trigger instant engagement:
          </p>

          <div className="space-y-2">
            {newLeads.slice(0, 2).map(lead => (
              <div key={lead.id} className="p-3 bg-white rounded-xl border border-orange-200/80 shadow-2xs flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">{lead.companyName}</span>
                    <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 rounded font-semibold">
                      ₹{lead.estimatedValueUSD.toLocaleString()} INR
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">{lead.contactName} • {lead.contactPhone}</p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleInstantWhatsApp(lead)}
                    className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200 transition-all cursor-pointer"
                    title="Send Instant WhatsApp Catalog"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleInstantCallLog(lead)}
                    className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white border border-blue-200 transition-all cursor-pointer"
                    title="Log Phone Call"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveView('crm-quotations')}
                    className="px-2.5 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-[11px] font-bold transition-all cursor-pointer"
                  >
                    Quote →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ALERT 2: Payroll 5-Day Cycle Automation Alert */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-white border-2 border-emerald-300/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs font-mono uppercase tracking-wider">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>⏰ AUTOMATED PAYROLL CYCLE (5 DAYS REMAINING)</span>
            </div>
            <span className="text-[10.5px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold border border-emerald-200">
              Month-End Disbursal
            </span>
          </div>

          <p className="text-xs text-slate-600">
            <strong>September 2026</strong> salary cycle is approaching. All employee biometric attendance, overtime, and tax deductions are synchronized.
          </p>

          <div className="p-3 bg-white rounded-xl border border-emerald-200/80 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-900">{employees.length} Staff Members Enrolled</p>
              <p className="text-[11px] text-emerald-700 font-mono mt-0.5 font-bold">
                {pendingPayrollDisbursals > 0 ? `${pendingPayrollDisbursals} Payslips Ready for Bank Approval` : 'All Payslips Disbursed & Reconciled'}
              </p>
            </div>

            <button
              onClick={() => setActiveView('crm-payroll')}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Review Salary Roll →</span>
            </button>
          </div>
        </div>

      </div>

      {/* Top KPI Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">Confirmed Revenue</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold font-mono text-slate-900">₹{totalWonValueUSD.toLocaleString()} INR</p>
          <p className="text-[11px] text-emerald-700 font-mono font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +18.4% vs last quarter
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">Active B2B Inquiries</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold font-mono text-slate-900">{leads.length} Leads</p>
          <p className="text-[11px] text-amber-700 font-mono font-bold">
            {newLeads.length} Inquiries Need Action
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">Commercial Quotes</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold font-mono text-slate-900">{quotations.length} Proposals</p>
          <p className="text-[11px] text-blue-700 font-mono font-bold">
            {pendingQuotesCount} Awaiting Decision
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">Production & Dispatches</span>
            <div className="p-2 rounded-lg bg-orange-50 text-orange-600 border border-orange-200">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold font-mono text-slate-900">{orders.length} Shipments</p>
          <p className="text-[11px] text-orange-700 font-mono font-bold">
            6-Stage Tracking Active
          </p>
        </div>

      </div>

      {/* CUSTOMER INTELLIGENCE & REPEAT VS NEW LEAD BREAKDOWN */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-orange-600 uppercase tracking-wider mb-1">
              <Users className="w-4 h-4" />
              <span>CUSTOMER INTELLIGENCE & ACCOUNT RETENTION ANALYTICS</span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Lead Conversion & Repeat vs. New Buyer Breakdown
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Itemized analysis of repeat procurement SKUs vs. new custom engineering prototypes, order frequency, and account lifetime values.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-200 text-xs font-mono font-bold">
              64.2% Repeat Order Rate
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono font-bold">
              High LTV Retention
            </span>
          </div>
        </div>

        {/* Customer Breakdown Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <p className="text-[11px] font-mono font-bold text-slate-400 uppercase">Total Inbound Leads</p>
            <h4 className="text-2xl font-extrabold text-slate-900 font-mono">{leads.length} Accounts</h4>
            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>RFQ / Web Forms: {rfqs.length}</span>
              <span className="text-orange-600 font-bold">100% Tracked</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1">
            <p className="text-[11px] font-mono font-bold text-emerald-600 uppercase">Total Converted Sales</p>
            <h4 className="text-2xl font-extrabold text-emerald-800 font-mono">₹{(totalWonValueUSD || 0).toLocaleString()} INR</h4>
            <div className="flex items-center justify-between text-xs text-emerald-700 pt-1 font-mono">
              <span>₹{((totalWonValueUSD || 0) * 84).toLocaleString()} INR</span>
              <span className="font-bold">{orders.length} Confirmed POs</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-1">
            <p className="text-[11px] font-mono font-bold text-blue-600 uppercase">Repeat Customer Accounts</p>
            <h4 className="text-2xl font-extrabold text-blue-900 font-mono">68% Repeat</h4>
            <div className="flex items-center justify-between text-xs text-blue-700 pt-1 font-mono">
              <span>Avg 3.4 Orders / Yr</span>
              <span className="font-bold">Blanket PO Contracts</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-1">
            <p className="text-[11px] font-mono font-bold text-amber-600 uppercase">New Prospective Buyers</p>
            <h4 className="text-2xl font-extrabold text-amber-900 font-mono">32% First-Time</h4>
            <div className="flex items-center justify-between text-xs text-amber-700 pt-1 font-mono">
              <span>{newLeads.length} Urgent Inquiries</span>
              <span className="font-bold">CAD Sample Trials</span>
            </div>
          </div>

        </div>

        {/* Detailed Itemized Repeat vs New Procurement Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 font-bold">
              <Layers className="w-4 h-4 text-orange-400" />
              <span>ITEMIZED REPEAT SKUs VS. NEW CUSTOM PROTOTYPES</span>
            </div>
            <span className="text-slate-400">Showing High-Velocity Product Cycles</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200 font-mono">
                <tr>
                  <th className="py-3 px-4">Product SKU / Component Name</th>
                  <th className="py-3 px-4">Client Enterprise & Segment</th>
                  <th className="py-3 px-4">Procurement Classification</th>
                  <th className="py-3 px-4 text-center">Reorder Frequency</th>
                  <th className="py-3 px-4 text-right">Cumulative Volume</th>
                  <th className="py-3 px-4 text-right">Account Value (USD)</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                
                {/* Repeat Item 1 */}
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900">ISO 15552 Standard Double-Acting Cylinder</p>
                    <span className="text-[10px] font-mono text-slate-400">SKU: WLD-CYL-ISO15552-80X200</span>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-slate-800">Larsen & Toubro Ltd.</p>
                    <span className="text-[10px] text-slate-500 font-mono">Heavy Engineering & Automation</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold font-mono bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1 w-max">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      REPEAT PROCUREMENT SKU
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-mono font-bold text-emerald-700">6 Orders / Year</span>
                    <p className="text-[10px] text-slate-400 font-mono">Quarterly Blanket PO</p>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-800">
                    450 Units
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-extrabold text-slate-900">
                    $38,250 USD
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => setActiveView('crm-orders')}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-orange-50 hover:text-orange-600 font-bold text-[11px] transition-colors cursor-pointer"
                    >
                      View PO →
                    </button>
                  </td>
                </tr>

                {/* Repeat Item 2 */}
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900">5/2 Way High-Frequency Solenoid Valve</p>
                    <span className="text-[10px] font-mono text-slate-400">SKU: WLD-VLV-52-G14-24VDC</span>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-slate-800">Tata Motors Commercial Vehicles</p>
                    <span className="text-[10px] text-slate-500 font-mono">Automotive Assembly Lines</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold font-mono bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1 w-max">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      REPEAT PROCUREMENT SKU
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-mono font-bold text-emerald-700">4 Orders / Year</span>
                    <p className="text-[10px] text-slate-400 font-mono">Bi-Monthly Restock</p>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-800">
                    1,200 Units
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-extrabold text-slate-900">
                    $26,400 USD
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => setActiveView('crm-orders')}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-orange-50 hover:text-orange-600 font-bold text-[11px] transition-colors cursor-pointer"
                    >
                      View PO →
                    </button>
                  </td>
                </tr>

                {/* New Custom Item 1 */}
                <tr className="hover:bg-slate-50 transition-colors bg-amber-50/20">
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900">Custom 350-Bar Hydraulic Cylinder with Position Sensor</p>
                    <span className="text-[10px] font-mono text-amber-700 font-semibold">CUSTOM PROTOTYPE: WLD-ENG-HYD-350BAR-CUSTOM</span>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-slate-800">Thermax Global Power Division</p>
                    <span className="text-[10px] text-slate-500 font-mono">Thermal Power & Boilers</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold font-mono bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1 w-max">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                      NEW CUSTOM PROTOTYPE
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-mono font-bold text-amber-700">1st Trial Order</span>
                    <p className="text-[10px] text-slate-400 font-mono">CAD Approved • In Lab Testing</p>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-800">
                    12 Prototype Units
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-extrabold text-slate-900">
                    $18,600 USD
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => setActiveView('crm-trials')}
                      className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 hover:bg-amber-200 font-bold text-[11px] transition-colors cursor-pointer"
                    >
                      Lab Trial →
                    </button>
                  </td>
                </tr>

                {/* Repeat Item 3 */}
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900">Push-in Brass Pneumatic Fittings & Couplers (Pack of 50)</p>
                    <span className="text-[10px] font-mono text-slate-400">SKU: WLD-FIT-PC08-02-BR</span>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-slate-800">Bharat Heavy Electricals Ltd. (BHEL)</p>
                    <span className="text-[10px] text-slate-500 font-mono">Turbine Instrumentation</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold font-mono bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1 w-max">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      REPEAT PROCUREMENT SKU
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-mono font-bold text-emerald-700">8 Orders / Year</span>
                    <p className="text-[10px] text-slate-400 font-mono">Monthly Maintenance Run</p>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-800">
                    5,000 Pcs
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-extrabold text-slate-900">
                    $14,200 USD
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => setActiveView('crm-orders')}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-orange-50 hover:text-orange-600 font-bold text-[11px] transition-colors cursor-pointer"
                    >
                      View PO →
                    </button>
                  </td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Connected Process Flow Map */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Connected Enterprise B2B Pipeline</h3>
            <p className="text-xs text-slate-500">Every module is fully linked end-to-end with automated status changes and audit logs.</p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            100% Process Integrated
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 pt-2">
          
          <button
            onClick={() => setActiveView('crm-leads')}
            className="p-3.5 rounded-xl bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-300 text-left transition-all group cursor-pointer"
          >
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Stage 1</span>
            <h4 className="font-bold text-xs text-slate-900 group-hover:text-orange-600 mt-1">Leads Ingestion</h4>
            <p className="text-[10.5px] text-slate-500 mt-1">{leads.length} Active Leads</p>
          </button>

          <button
            onClick={() => setActiveView('crm-rfqs')}
            className="p-3.5 rounded-xl bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-300 text-left transition-all group cursor-pointer"
          >
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Stage 2</span>
            <h4 className="font-bold text-xs text-slate-900 group-hover:text-orange-600 mt-1">CAD Drawings</h4>
            <p className="text-[10.5px] text-slate-500 mt-1">{rfqs.length} Blueprints</p>
          </button>

          <button
            onClick={() => setActiveView('crm-quotations')}
            className="p-3.5 rounded-xl bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-300 text-left transition-all group cursor-pointer"
          >
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Stage 3</span>
            <h4 className="font-bold text-xs text-slate-900 group-hover:text-orange-600 mt-1">Quote Engine</h4>
            <p className="text-[10.5px] text-slate-500 mt-1">{quotations.length} Quotations</p>
          </button>

          <button
            onClick={() => setActiveView('crm-samples')}
            className="p-3.5 rounded-xl bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-300 text-left transition-all group cursor-pointer"
          >
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Stage 4</span>
            <h4 className="font-bold text-xs text-slate-900 group-hover:text-orange-600 mt-1">Sample & Trials</h4>
            <p className="text-[10.5px] text-slate-500 mt-1">Lab Testing</p>
          </button>

          <button
            onClick={() => setActiveView('crm-orders')}
            className="p-3.5 rounded-xl bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-300 text-left transition-all group cursor-pointer"
          >
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Stage 5</span>
            <h4 className="font-bold text-xs text-slate-900 group-hover:text-orange-600 mt-1">Order Dispatch</h4>
            <p className="text-[10.5px] text-slate-500 mt-1">{orders.length} In Production</p>
          </button>

          <button
            onClick={() => setActiveView('crm-payroll')}
            className="p-3.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-left transition-all group cursor-pointer"
          >
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Stage 6</span>
            <h4 className="font-bold text-xs text-slate-900 group-hover:text-emerald-700 mt-1">Payroll Roll</h4>
            <p className="text-[10.5px] text-slate-500 mt-1">{employees.length} Staff CTC</p>
          </button>

        </div>
      </div>

    </div>
  );
};
