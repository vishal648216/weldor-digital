import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShoppingBag, 
  RefreshCw, 
  CheckCircle2, 
  Truck, 
  Clock, 
  ArrowRight,
  FileText,
  Download,
  Printer,
  ShieldCheck,
  Package,
  X,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import type { Order } from '../../types';

export const OrdersManager: React.FC = () => {
  const { orders, updateOrderStage, deleteOrder, showNotification, currentEmployee } = useApp();

  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);
  const [selectedOrderForDispatch, setSelectedOrderForDispatch] = useState<Order | null>(null);

  const [dispatchForm, setDispatchForm] = useState({
    courierPartner: 'DHL Express Industrial Freight',
    courierTrackingNo: 'WEL-DHL-9982410',
    dispatchDate: new Date().toISOString().split('T')[0],
  });

  const orderStages: Order['stage'][] = [
    'Confirmed',
    'In Production',
    'QC Inspection',
    'Ready for Dispatch',
    'Dispatched',
    'Delivered'
  ];

  const handleDispatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForDispatch) return;

    updateOrderStage(selectedOrderForDispatch.id, 'Dispatched', {
      courierPartner: dispatchForm.courierPartner,
      courierTrackingNo: dispatchForm.courierTrackingNo,
      dispatchDate: dispatchForm.dispatchDate,
    });

    setSelectedOrderForDispatch(null);
    showNotification(`Dispatch manifest & tracking recorded for ${selectedOrderForDispatch.orderNumber}`, 'success');
  };

  const [filterMode, setFilterMode] = useState<'active' | 'completed' | 'all'>('active');

  const filteredOrders = orders.filter(ord => {
    if (filterMode === 'active') return ord.stage !== 'Delivered' && (ord.stage as string) !== 'Cancelled';
    if (filterMode === 'completed') return ord.stage === 'Delivered';
    return true;
  });

  const activeOrdersCount = orders.filter(o => o.stage !== 'Delivered' && (o.stage as string) !== 'Cancelled').length;
  const completedOrdersCount = orders.filter(o => o.stage === 'Delivered').length;

  return (
    <div className="p-6 space-y-6 text-slate-900">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 bg-white p-6 rounded-2xl shadow-sm">
        <div>
          <span className="text-xs font-mono font-bold text-orange-600 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full uppercase">
            Full Order & Dispatch Lifecycle
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 font-heading mt-2">
            Order Fulfillment & B2B Dispatch Tracking
          </h1>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Complete inquiry-to-dispatch process: Production status, ISO quality sign-off, courier tracking, and Tax Invoice PDF generation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Active vs Delivered Archives Filter */}
          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1 text-xs font-mono">
            <button
              onClick={() => setFilterMode('active')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                filterMode === 'active' ? 'bg-white text-orange-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Active Production ({activeOrdersCount})
            </button>
            <button
              onClick={() => setFilterMode('completed')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                filterMode === 'completed' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Delivered Archives ({completedOrdersCount})
            </button>
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                filterMode === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({orders.length})
            </button>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {filteredOrders.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-500">
            <ShoppingBag className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p className="font-bold text-slate-800 text-base">
              No {filterMode === 'completed' ? 'delivered / completed' : 'active ongoing'} orders found
            </p>
            <p className="text-xs mt-1">
              {filterMode === 'active' 
                ? 'All confirmed orders have been successfully delivered to customers.' 
                : 'Delivered orders will appear in this archive once customer receipt is confirmed.'}
            </p>
          </div>
        ) : (
          filteredOrders.map(ord => {
          const currentStageIndex = orderStages.indexOf(ord.stage);

          return (
            <div key={ord.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              
              {/* Order Top Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-orange-700 bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded">
                      {ord.orderNumber}
                    </span>
                    {ord.isRepeatOrder && (
                      <span className="text-[10px] font-mono bg-sky-50 text-sky-800 border border-sky-200 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                        <RefreshCw className="w-3 h-3 text-sky-600" /> REPEAT ORDER
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 font-heading mt-1">
                    {ord.companyName} <span className="text-slate-500 font-normal text-sm">({ord.contactName})</span>
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                    Stage: {ord.stage}
                  </span>

                  <button
                    onClick={() => setSelectedOrderForInvoice(ord)}
                    className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 text-slate-800 border-slate-300 bg-white hover:bg-slate-50 shadow-xs"
                  >
                    <FileText className="w-4 h-4 text-orange-600" />
                    <span className="font-bold">View Tax Invoice PDF</span>
                  </button>
                </div>
              </div>

              {/* 7-Step Order Lifecycle Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-700">
                  <span>Inquiry & RFQ</span>
                  <span>Quotation</span>
                  <span>Production</span>
                  <span>QC Inspection</span>
                  <span>Dispatched</span>
                  <span>Delivered</span>
                </div>

                <div className="grid grid-cols-6 gap-2">
                  {orderStages.map((stg, idx) => {
                    const isDone = idx <= currentStageIndex;
                    const isCurrent = idx === currentStageIndex;
                    return (
                      <button 
                        key={stg} 
                        onClick={() => updateOrderStage(ord.id, stg)}
                        title={`Click to set stage to ${stg}`}
                        className="space-y-1 text-left group cursor-pointer"
                      >
                        <div className={`h-2 rounded-full transition-all ${
                          isDone 
                            ? 'bg-orange-600 shadow-xs' 
                            : 'bg-slate-200 group-hover:bg-orange-300'
                        }`} />
                        <p className={`text-[10px] font-mono text-center truncate ${
                          isCurrent ? 'font-bold text-orange-700' : isDone ? 'text-slate-700' : 'text-slate-400 group-hover:text-slate-700'
                        }`}>
                          {stg}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Items & Specs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500 block text-[10px] font-bold">TOTAL ORDER VALUE</span>
                  <span className="text-slate-900 font-extrabold text-base">
                    ₹{(ord.totalValueUSD || (ord as any).totalAmountUSD || 0).toLocaleString()} INR
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] font-bold">EXPECTED DELIVERY DATE</span>
                  <span className="text-amber-800 font-bold text-sm">{ord.expectedDeliveryDate || 'TBD'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] font-bold">COURIER & DISPATCH MANIFEST</span>
                  <span className="text-slate-900 font-bold text-xs">
                    {(ord as any).courierPartner || 'Pending Carrier Assignment'}
                  </span>
                  {(ord as any).courierTrackingNo && (
                    <p className="text-[10px] text-emerald-700 font-bold mt-0.5">
                      Track: {(ord as any).courierTrackingNo}
                    </p>
                  )}
                </div>
              </div>

              {/* Order Actions */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-2 text-slate-500 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Order Placed: {new Date(ord.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {ord.stage !== 'Dispatched' && ord.stage !== 'Delivered' && (
                    <button
                      onClick={() => {
                        setSelectedOrderForDispatch(ord);
                        setDispatchForm({
                          courierPartner: 'DHL Express Industrial Freight',
                          courierTrackingNo: `WEL-TRK-${Math.floor(100000 + Math.random() * 900000)}`,
                          dispatchDate: new Date().toISOString().split('T')[0],
                        });
                      }}
                      className="btn-primary text-xs py-2 px-3.5 shadow-md flex items-center gap-2"
                    >
                      <Truck className="w-4 h-4" /> Record Dispatch & Tracking
                    </button>
                  )}

                  {ord.stage !== 'Delivered' && (
                    <button
                      onClick={() => updateOrderStage(ord.id, 'Delivered')}
                      className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-800 hover:text-white border border-emerald-200 font-mono font-bold transition-colors flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Mark Delivered</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to cancel and remove order ${ord.orderNumber}?`)) {
                        deleteOrder(ord.id);
                      }
                    }}
                    className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200 font-mono font-bold transition-colors"
                  >
                    Cancel / Delete Order
                  </button>
                </div>
              </div>

            </div>
          );
        }))}
      </div>

      {/* Record Dispatch Modal */}
      {selectedOrderForDispatch && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-orange-400" />
                <h3 className="font-bold text-base font-heading">Record Dispatch & Courier</h3>
              </div>
              <button 
                onClick={() => setSelectedOrderForDispatch(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDispatchSubmit} className="p-6 space-y-4 text-xs font-mono">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Order Reference</label>
                <input 
                  type="text" 
                  disabled
                  value={`${selectedOrderForDispatch.orderNumber} — ${selectedOrderForDispatch.companyName}`}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-100 text-slate-700 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Courier / Freight Partner *</label>
                <input 
                  type="text" 
                  required
                  value={dispatchForm.courierPartner}
                  onChange={e => setDispatchForm({ ...dispatchForm, courierPartner: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-orange-500 outline-none bg-slate-50"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Airway Bill / Tracking Number *</label>
                <input 
                  type="text" 
                  required
                  value={dispatchForm.courierTrackingNo}
                  onChange={e => setDispatchForm({ ...dispatchForm, courierTrackingNo: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-orange-500 outline-none bg-slate-50"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Dispatch Date</label>
                <input 
                  type="date" 
                  value={dispatchForm.dispatchDate}
                  onChange={e => setDispatchForm({ ...dispatchForm, dispatchDate: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-orange-500 outline-none bg-slate-50"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setSelectedOrderForDispatch(null)}
                  className="px-4 py-2 rounded-xl text-slate-700 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn-primary px-6 py-2.5 shadow-md flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" /> Confirm Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tax Invoice & Dispatch Manifest PDF Viewer Modal */}
      {selectedOrderForInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-300 shadow-2xl w-full max-w-3xl overflow-hidden max-h-[95vh] flex flex-col animate-in zoom-in-95 duration-200">
            
            {/* Modal Top Controls */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-400" />
                <h3 className="font-bold text-base font-heading">
                  Official B2B Tax Invoice & Dispatch Manifest
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-mono text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Printer className="w-4 h-4" /> Print / Save PDF
                </button>

                <button 
                  onClick={() => setSelectedOrderForInvoice(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Print Document Body */}
            <div className="p-8 space-y-6 overflow-y-auto bg-white text-slate-900 font-sans">
              
              {/* Document Header */}
              <div className="flex items-start justify-between border-b-2 border-slate-900 pb-6">
                <div>
                  <div className="flex items-center gap-3">
                    <img 
                      src="/weldor-logo.png" 
                      alt="Weldor Logo" 
                      className="h-9 w-auto object-contain" 
                    />
                    <div>
                      <span className="font-extrabold text-lg tracking-tight text-slate-900 font-heading block">EARTH METAL INDUSTRIES</span>
                      <span className="text-[10px] font-mono text-orange-600 font-bold uppercase">Brand: WELDOR</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600 font-mono mt-1 font-medium">588, G.I.D.C., Phase 2, Dared, Jamnagar (361004), Gujarat, India</p>
                  <p className="text-[11px] text-slate-600 font-mono font-medium">GSTIN: 24AABCE1234F1Z5 • brm@weldorindustries.com • +91-87800 98088</p>
                </div>

                <div className="text-right">
                  <span className="text-xl font-extrabold font-heading text-orange-700 block">TAX INVOICE</span>
                  <p className="text-xs font-mono font-bold text-slate-900 mt-1">Invoice No: WEL-INV-2026-9912</p>
                  <p className="text-xs font-mono text-slate-600">Date: {new Date().toLocaleDateString()}</p>
                  <p className="text-xs font-mono text-slate-600">Order Ref: {selectedOrderForInvoice.orderNumber}</p>
                </div>
              </div>

              {/* Bill To & Ship To */}
              <div className="grid grid-cols-2 gap-8 text-xs font-mono bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500 font-bold uppercase block mb-1">Billed To (Customer):</span>
                  <p className="font-bold text-slate-900 text-sm">{selectedOrderForInvoice.companyName}</p>
                  <p className="text-slate-700">Attn: {selectedOrderForInvoice.contactName}</p>
                  <p className="text-slate-600">Industrial OEM Division</p>
                </div>
                <div>
                  <span className="text-slate-500 font-bold uppercase block mb-1">Shipping & Dispatch Manifest:</span>
                  <p className="font-bold text-slate-900">Carrier: {(selectedOrderForInvoice as any).courierPartner || 'DHL Industrial Freight'}</p>
                  <p className="text-slate-700">Airway Bill: {(selectedOrderForInvoice as any).courierTrackingNo || 'WEL-TRK-771928'}</p>
                  <p className="text-slate-600">Dispatch Date: {(selectedOrderForInvoice as any).dispatchDate || '2026-09-13'}</p>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-left text-xs border border-slate-200">
                <thead className="bg-slate-100 font-mono text-slate-900 uppercase">
                  <tr>
                    <th className="p-3 border-b border-slate-200">Item & Description</th>
                    <th className="p-3 border-b border-slate-200">HSN Code</th>
                    <th className="p-3 border-b border-slate-200 text-right">Qty</th>
                    <th className="p-3 border-b border-slate-200 text-right">Unit Price (₹)</th>
                    <th className="p-3 border-b border-slate-200 text-right">Total (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono text-slate-800">
                  {(selectedOrderForInvoice.items || (selectedOrderForInvoice as any).lineItems || []).map((item: any, idx: number) => (
                    <tr key={idx}>
                      <td className="p-3">
                        <p className="font-bold text-slate-900">{item.productName}</p>
                        <p className="text-[10px] text-slate-500">SKU: {item.sku}</p>
                      </td>
                      <td className="p-3 text-slate-600">8412.21.00</td>
                      <td className="p-3 text-right font-bold">{item.quantity} PCS</td>
                      <td className="p-3 text-right">₹{(item.unitPriceUSD || item.unitPrice || 0).toLocaleString()}</td>
                      <td className="p-3 text-right font-bold text-slate-900">₹{(item.totalPriceUSD || (item.quantity * (item.unitPriceUSD || item.unitPrice || 0)) || 0).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Calculation Summary */}
              <div className="flex justify-end pt-2">
                <div className="w-72 space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span className="font-bold">₹{(selectedOrderForInvoice.totalValueUSD || (selectedOrderForInvoice as any).totalAmountUSD || 0).toLocaleString()} INR</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Estimated Tax / Export Duty:</span>
                    <span className="font-bold">$0.00 (Zero Rated Export)</span>
                  </div>
                  <div className="flex justify-between text-slate-900 text-sm font-extrabold border-t-2 border-slate-900 pt-2">
                    <span>Grand Total:</span>
                    <span className="text-orange-700">₹{(selectedOrderForInvoice.totalValueUSD || (selectedOrderForInvoice as any).totalAmountUSD || 0).toLocaleString()} INR</span>
                  </div>
                </div>
              </div>

              {/* Signatures & Seal Stamp */}
              <div className="pt-8 border-t border-slate-200 flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-slate-500 font-bold block">100% Quality Assurance Stamp:</span>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>ISO 9001:2015 & Pressure Passed</span>
                  </div>
                </div>

                <div className="text-center">
                  <div className="w-40 border-b border-slate-400 mb-1" />
                  <span className="text-slate-600 font-bold">Authorized Signatory</span>
                  <p className="text-[10px] text-slate-400">Weldor Accounts & Dispatch</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
