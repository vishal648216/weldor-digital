import React from 'react';
import { ShieldCheck, Award, CheckCircle2, Flame, Cpu, Gauge } from 'lucide-react';

export const TrustStrip: React.FC = () => {
  return (
    <section className="bg-white border-b border-slate-200 py-6 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 items-center justify-between">
          
          <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 border border-slate-200">
            <ShieldCheck className="w-7 h-7 text-orange-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-900 font-mono">ISO 9001:2015</p>
              <p className="text-[11px] text-slate-600 font-medium">Quality Certified</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 border border-slate-200">
            <Award className="w-7 h-7 text-blue-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-900 font-mono">AS9100D</p>
              <p className="text-[11px] text-slate-600 font-medium">Aerospace Standard</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 border border-slate-200">
            <Gauge className="w-7 h-7 text-amber-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-900 font-mono">700 BAR</p>
              <p className="text-[11px] text-slate-600 font-medium">Pressure Lab Tested</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 border border-slate-200">
            <Cpu className="w-7 h-7 text-emerald-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-900 font-mono">±0.005 MM</p>
              <p className="text-[11px] text-slate-600 font-medium">CMM Machining</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 border border-slate-200">
            <Flame className="w-7 h-7 text-rose-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-900 font-mono">UL LISTED</p>
              <p className="text-[11px] text-slate-600 font-medium">Fire Safety Valves</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 border border-slate-200">
            <CheckCircle2 className="w-7 h-7 text-indigo-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-900 font-mono">100% TRACEABLE</p>
              <p className="text-[11px] text-slate-600 font-medium">Heat Code Logs</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
