import React from 'react';
import { useApp } from '../../context/AppContext';
import { FileUp, ShieldCheck, Clock, CheckCircle2, MessageSquare } from 'lucide-react';

export const UploadDrawingBanner: React.FC = () => {
  const { setActiveView } = useApp();

  return (
    <section className="py-16 bg-[#FAF9F6] border-b border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="rounded-2xl bg-white border-2 border-orange-200 p-8 sm:p-12 relative overflow-hidden shadow-md text-slate-900">
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <span className="tech-label">Section 07 — Custom Manufacturing Engine</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading leading-tight">
                Have a Custom Component Drawing or Modified Specification?
              </h2>
              <p className="text-base text-slate-700 leading-relaxed max-w-2xl font-medium">
                Upload your PDF, STEP, IGES, or DWG files directly. Our engineering R&D team evaluates material feasibility, CNC program lead times, and unit pricing within 2 hours.
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-mono text-slate-800 font-bold">
                <span className="flex items-center gap-2 text-orange-700 bg-orange-50 px-3 py-1.5 rounded-md border border-orange-200">
                  <Clock className="w-4 h-4 text-orange-600" /> Guaranteed 2-Hour SLA Evaluation
                </span>
                <span className="flex items-center gap-2 text-slate-800 bg-slate-100 px-3 py-1.5 rounded-md border border-slate-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> NDA / Confidential Handling
                </span>
                <span className="flex items-center gap-2 text-slate-800 bg-slate-100 px-3 py-1.5 rounded-md border border-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" /> Direct Push to CRM Sales Manager
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
              <button
                onClick={() => setActiveView('public-rfq')}
                className="btn-primary text-sm px-6 py-3.5 justify-center shadow-md"
              >
                <FileUp className="w-4 h-4" /> Launch Drawing RFQ Engine
              </button>

              <button
                onClick={() => {
                  window.open('https://wa.me/918780098088?text=Hello%20Weldor%20Engineering%2C%20I%20want%20to%20send%20a%20drawing%20PDF.', '_blank');
                }}
                className="btn-secondary text-sm px-6 py-3.5 justify-center border-slate-300 text-slate-900 bg-white hover:bg-slate-50 font-bold"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" /> Send via WhatsApp
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
