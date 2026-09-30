import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, Building2 } from 'lucide-react';

export const CaseStudies: React.FC = () => {
  const { setActiveView } = useApp();

  const caseStudies = [
    {
      company: 'Bosch Rexroth Hydraulics GmbH',
      country: 'Germany',
      title: '700 Bar High-Pressure Valve Manifold Redesign',
      problem: 'Existing supplier manifold failed pressure spikes at 620 Bar and exhibited 0.4 cc/min internal leakage during continuous press cycles.',
      solution: 'Weldor R&D redesigned the internal spool geometry using nitrided tool steel (62 HRC) and AL 7075-T6 billet block.',
      result: 'Achieved zero measurable leakage (<0.01 cc/min) at 700 Bar hold test and reduced unit procurement cost by 18%.',
      quantity: '500 Annual Units',
    },
    {
      company: 'Tata Motors Passenger Vehicles',
      country: 'India',
      title: 'High-Speed EV Battery Cell Stamping Cylinder',
      problem: 'Standard ISO cylinders failed seal integrity after 350,000 rapid cycles due to high operating temperature (75°C).',
      solution: 'Custom double acting pneumatic cylinder with Viton high-temp seals and hard-chromated SS304 piston rod.',
      result: 'Exceeded 1,500,000 continuous cycles without downtime on the robot assembly line.',
      quantity: '250 Cylinders Deployed',
    },
  ];

  return (
    <section className="py-16 bg-[#FAF9F6] border-b border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="tech-label">Section 09 — Engineering Case Studies</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
            Proven Industrial Case Studies & OEM Results
          </h2>
          <p className="text-sm text-slate-700 font-medium">
            Real OEM engineering challenges solved through custom component design, high-pressure testing, and rapid prototyping.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {caseStudies.map((cs, i) => (
            <div 
              key={i}
              className="english-card p-8 rounded-2xl space-y-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-orange-700">
                    <Building2 className="w-4 h-4" />
                    <span>{cs.company} ({cs.country})</span>
                  </div>
                  <span className="tech-badge text-emerald-800 bg-emerald-50 border-emerald-300 font-bold">{cs.quantity}</span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 font-heading">
                  {cs.title}
                </h3>

                <div className="space-y-3 text-xs leading-relaxed pt-2">
                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="font-mono font-bold text-slate-500 block mb-1">PROBLEM:</span>
                    <span className="text-slate-800 font-medium">{cs.problem}</span>
                  </div>

                  <div className="p-3.5 rounded-lg bg-orange-50/70 border border-orange-200">
                    <span className="font-mono font-bold text-orange-700 block mb-1">WELDOR SOLUTION:</span>
                    <span className="text-slate-900 font-medium">{cs.solution}</span>
                  </div>

                  <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 font-medium">
                    <span className="font-mono font-bold text-emerald-700 block mb-1">VERIFIED RESULT:</span>
                    <span>✓ {cs.result}</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setActiveView('public-rfq')}
                className="btn-secondary text-xs w-full justify-center shadow-sm"
              >
                Request Similar Case Study Component <ArrowRight className="w-3.5 h-3.5 text-orange-600" />
              </button>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
