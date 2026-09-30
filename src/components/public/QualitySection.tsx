import React from 'react';
import { ShieldCheck, Award, Microscope } from 'lucide-react';

export const QualitySection: React.FC = () => {
  return (
    <section className="py-16 bg-[#F4F6F9] border-b border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <span className="tech-label">Section 08 — Quality & Compliance</span>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
              Zero-Defect Standard & Verified Quality Control
            </h2>

            <p className="text-sm text-slate-700 leading-relaxed font-medium">
              Every component manufactured at Weldor undergoes a multi-gate quality verification process. Raw material heats are verified via spectrometer analysis, CNC dimensions are checked via Zeiss CMM probes, and fluid valves are hydrostatically tested at 1.5x rating.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="p-2.5 rounded-lg bg-orange-50 border border-orange-200 text-orange-600 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 font-heading">ISO 9001:2015 & AS9100D Certified</h4>
                  <p className="text-xs text-slate-600 font-medium">Audited quality management system with full raw material heat code traceability.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 shrink-0">
                  <Microscope className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 font-heading">In-House Metallurgical & Corrosion Lab</h4>
                  <p className="text-xs text-slate-600 font-medium">1000-Hour ASTM B117 salt spray testing and hardness verification (up to 65 HRC).</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 font-heading">100% End-of-Line Pressure Hold Test</h4>
                  <p className="text-xs text-slate-600 font-medium">Zero nitrogen bubble leakage guaranteed before packaging and dispatch.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-3 sm:gap-4">
            <div className="english-card p-4 sm:p-6 text-center space-y-1 sm:space-y-2 overflow-hidden">
              <p className="text-2xl sm:text-3xl font-extrabold font-mono text-orange-700">100%</p>
              <p className="text-[11px] sm:text-xs font-mono text-slate-900 font-bold">Hydrostatic Tested</p>
              <p className="text-[10px] sm:text-[11px] text-slate-600 font-medium">Every valve & cylinder</p>
            </div>

            <div className="english-card p-4 sm:p-6 text-center space-y-1 sm:space-y-2 overflow-hidden">
              <p className="text-xl sm:text-3xl font-extrabold font-mono text-slate-900 whitespace-nowrap">±0.005mm</p>
              <p className="text-[11px] sm:text-xs font-mono text-slate-900 font-bold">CMM Machine Limit</p>
              <p className="text-[10px] sm:text-[11px] text-slate-600 font-medium">Zeiss 3D Probe Checked</p>
            </div>

            <div className="english-card p-4 sm:p-6 text-center space-y-1 sm:space-y-2 overflow-hidden">
              <p className="text-2xl sm:text-3xl font-extrabold font-mono text-blue-700">1000 Hrs</p>
              <p className="text-[11px] sm:text-xs font-mono text-slate-900 font-bold">Salt Spray Resistance</p>
              <p className="text-[10px] sm:text-[11px] text-slate-600 font-medium">Hard Anodized Coating</p>
            </div>

            <div className="english-card p-4 sm:p-6 text-center space-y-1 sm:space-y-2 overflow-hidden">
              <p className="text-xl sm:text-3xl font-extrabold font-mono text-emerald-700 whitespace-nowrap">0.05 cc/m</p>
              <p className="text-[11px] sm:text-xs font-mono text-slate-900 font-bold">Max Spool Leakage</p>
              <p className="text-[10px] sm:text-[11px] text-slate-600 font-medium">700 Bar Rated Valves</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
