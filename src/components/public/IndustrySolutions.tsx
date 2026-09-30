import React from 'react';
import { useApp } from '../../context/AppContext';
import { Car, Cog, Flame, Plane, ArrowRight } from 'lucide-react';

export const IndustrySolutions: React.FC = () => {
  const { setActiveView } = useApp();

  const industries = [
    {
      title: 'Automotive & Electric Vehicles',
      desc: 'High-cycle double acting pneumatic cylinders for automated welding fixtures, stamping clamps, and battery pack assembly lines.',
      icon: <Car className="w-6 h-6 text-orange-600" />,
      stats: '1.2M+ Annual Cycles',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600',
    },
    {
      title: 'Heavy Machinery & Forging',
      desc: '700 Bar high-pressure hydraulic proportional directional valves and forged cylinders designed for extreme vibration and impact load.',
      icon: <Cog className="w-6 h-6 text-blue-600" />,
      stats: '700 Bar Rated',
      image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=600',
    },
    {
      title: 'Oil & Gas / Infrastructure',
      desc: 'UL-Listed brass oblique fire hydrant landing valves, deluge nozzles, and marine-grade corrosion resistant manifold joints.',
      icon: <Flame className="w-6 h-6 text-rose-600" />,
      stats: 'UL / FM Approved',
      image: 'https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&q=80&w=600',
    },
    {
      title: 'Aerospace & Defense',
      desc: '5-Axis CNC machined AL 7075 manifolds, ultra-lightweight hydraulic power packs, and custom zero-leakage aerospace fittings.',
      icon: <Plane className="w-6 h-6 text-emerald-600" />,
      stats: 'AS9100D Certified',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600',
    },
  ];

  return (
    <section className="py-16 bg-[#F4F6F9] border-b border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="tech-label">Section 06 — Industrial Applications</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
            Tailored Industry Solutions
          </h2>
          <p className="text-sm text-slate-700 font-medium">
            Weldor components are deployed across mission-critical automated plants, heavy presses, and high-security defense equipment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {industries.map((ind, i) => (
            <div 
              key={i}
              className="english-card rounded-2xl p-6 flex flex-col justify-between group hover:border-orange-400"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    {ind.icon}
                  </div>
                  <span className="text-xs font-mono text-orange-700 font-bold bg-orange-50 px-2.5 py-1 rounded border border-orange-200">
                    {ind.stats}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 font-heading group-hover:text-orange-600 transition-colors">
                  {ind.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {ind.desc}
                </p>
              </div>

              <div className="pt-6 flex items-center justify-between border-t border-slate-100 mt-6">
                <button 
                  onClick={() => setActiveView('public-products')}
                  className="text-xs font-bold text-slate-800 hover:text-orange-600 flex items-center gap-1 font-mono"
                >
                  Explore Industry Products <ArrowRight className="w-3.5 h-3.5 text-orange-600" />
                </button>

                <button 
                  onClick={() => setActiveView('public-rfq')}
                  className="text-xs text-orange-700 hover:underline font-mono font-bold"
                >
                  Request Industry RFQ
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
