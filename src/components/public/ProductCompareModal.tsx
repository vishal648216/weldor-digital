import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Scale } from 'lucide-react';

export const ProductCompareModal: React.FC = () => {
  const { compareList, isCompareOpen, setIsCompareOpen, toggleCompare, setActiveView } = useApp();

  if (!isCompareOpen || compareList.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-300 rounded-2xl max-w-5xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-slate-900">
        
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-orange-600" />
            <h2 className="text-xl font-bold text-slate-900 font-heading">
              Product Technical Comparison Tray ({compareList.length} Items)
            </h2>
          </div>

          <button 
            onClick={() => setIsCompareOpen(false)}
            className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Side by side comparison table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse border border-slate-200">
            <thead>
              <tr className="bg-slate-50 font-mono">
                <th className="p-3 border border-slate-200 text-slate-700 font-bold w-40">TECHNICAL ATTR</th>
                {compareList.map(p => (
                  <th key={p.id} className="p-3 border border-slate-200 text-slate-900 font-bold min-w-[200px]">
                    <div className="space-y-2">
                      <img src={p.image} alt={p.name} className="w-full h-24 object-cover rounded-lg bg-slate-100 border border-slate-200" />
                      <p className="text-orange-700 text-xs font-mono">{p.sku}</p>
                      <p className="text-sm font-heading">{p.name}</p>
                      <button
                        onClick={() => toggleCompare(p)}
                        className="text-[11px] text-rose-600 hover:underline font-mono font-bold"
                      >
                        Remove Component
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="p-3 font-mono text-slate-700 font-bold bg-slate-50">Category</td>
                {compareList.map(p => (
                  <td key={p.id} className="p-3 border border-slate-200 font-medium">{p.category}</td>
                ))}
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-3 font-mono text-slate-700 font-bold bg-slate-50">Min Order Qty</td>
                {compareList.map(p => (
                  <td key={p.id} className="p-3 border border-slate-200 font-mono font-bold text-slate-900">{p.minOrderQty} PCS</td>
                ))}
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-3 font-mono text-slate-700 font-bold bg-slate-50">Lead Time</td>
                {compareList.map(p => (
                  <td key={p.id} className="p-3 border border-slate-200 font-mono font-bold text-orange-700">{p.standardLeadTimeDays} Days</td>
                ))}
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-3 font-mono text-slate-700 font-bold bg-slate-50">Certifications</td>
                {compareList.map(p => (
                  <td key={p.id} className="p-3 border border-slate-200 font-medium">{(p.certifications || []).join(', ')}</td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-mono text-slate-700 font-bold bg-slate-50">Commercial RFQ</td>
                {compareList.map(p => (
                  <td key={p.id} className="p-3 border border-slate-200">
                    <button
                      onClick={() => {
                        setIsCompareOpen(false);
                        setActiveView('public-rfq');
                      }}
                      className="btn-primary text-xs w-full justify-center shadow-sm"
                    >
                      Request Quote
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};
