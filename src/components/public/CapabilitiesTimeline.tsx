import React, { useState } from 'react';
import { Cpu, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CapabilitiesTimeline: React.FC = () => {
  const { setActiveView } = useApp();
  const [activeTab, setActiveTab] = useState<number>(0);

  const capabilities = [
    {
      title: '5-Axis CNC Machining & Turning',
      spec: '±0.005mm Precision Tolerance',
      description: 'State-of-the-art Japanese DMG Mori & Mazak 5-axis CNC machining centers capable of single-setup manifold machining, complex hydraulic contours, and aerospace grade components.',
      highlights: ['AL 7075-T6 & SS316L', 'Ra 0.4 µm Surface Finish', '100% CMM Inspected'],
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
    },
    {
      title: '700 Bar Hydrostatic & Leakage Testing',
      spec: '100% Nitrogen Bubble Tested',
      description: 'Dedicated high-pressure test bays equipped with digital pressure transducers and automated bubble leak detectors. Every hydraulic valve and high-pressure manifold undergoes 1.5x working pressure hold tests.',
      highlights: ['Zero Leakage Certification', 'Digital Chart Recording', 'Nitrogen & Helium Leak Detector'],
      image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=800',
    },
    {
      title: '1000-Hour Salt Spray & Coating Lab',
      spec: 'ASTM B117 Compliance',
      description: 'In-house surface treatment line providing hard anodizing, electroless nickel plating, and black oxide coating tested to resist 1000 hours of continuous salt spray corrosion.',
      highlights: ['Hard Anodize Type III', 'Electroless Nickel Plating', 'Corrosion Test Reports'],
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
    },
    {
      title: 'Rapid Prototype & Sample Cell',
      spec: '5-Day Sample Dispatch',
      description: 'Accelerated engineering development cell dedicated to low-volume prototype samples, custom drawing modifications, and first-article inspection (FAI) reports.',
      highlights: ['AS9102 FAI Documentation', '3D Printed SLA Mockups', '5-Day Lead Time'],
      image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=800',
    },
  ];

  return (
    <section className="py-16 bg-[#FAF9F6] border-b border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="tech-label mb-2">Section 05 — Technical Infrastructure</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading mt-2">
              Verified Manufacturing & Testing Capabilities
            </h2>
            <p className="text-sm text-slate-700 mt-1 max-w-xl font-medium">
              Precision machining, hydrostatic pressure bays, salt spray endurance labs, and certified quality controls under one roof.
            </p>
          </div>

          <button 
            onClick={() => setActiveView('public-rfq')}
            className="btn-primary text-sm shrink-0 shadow-md"
          >
            Submit Drawing for Feasibility <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {capabilities.map((cap, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`p-4 rounded-xl text-left border transition-all ${
                activeTab === i
                  ? 'bg-orange-50 border-orange-500 text-slate-900 shadow-md'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="text-[11px] font-mono text-orange-700 font-bold block mb-1">0{i + 1}. CAPABILITY</span>
              <span className="font-heading font-bold text-sm block leading-snug">{cap.title}</span>
            </button>
          ))}
        </div>

        {/* Active Capability Display Card */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-lg grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-orange-50 text-orange-800 border border-orange-200 text-xs font-mono font-bold">
              <Cpu className="w-4 h-4 text-orange-600" /> {capabilities[activeTab].spec}
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
              {capabilities[activeTab].title}
            </h3>

            <p className="text-sm text-slate-700 leading-relaxed font-medium">
              {capabilities[activeTab].description}
            </p>

            <div className="space-y-2 pt-2">
              <p className="text-xs font-mono text-slate-500 uppercase tracking-wider font-bold">Quality Assurance Highlights:</p>
              <div className="flex flex-wrap gap-2">
                {capabilities[activeTab].highlights.map((h, idx) => (
                  <span key={idx} className="tech-badge text-slate-900 bg-slate-100 border-slate-300">
                    ✓ {h}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 flex items-center gap-4">
              <button 
                onClick={() => setActiveView('public-rfq')}
                className="btn-primary text-xs px-5 py-3 shadow-md"
              >
                Talk to Engineering Lead
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative h-72 sm:h-80 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-md">
              <img 
                src={capabilities[activeTab].image} 
                alt={capabilities[activeTab].title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 p-3 bg-white/95 backdrop-blur rounded-lg border border-slate-200 text-xs font-mono font-bold text-slate-900 shadow-sm">
                Facility Status: Active 24/7 Production Batch
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
