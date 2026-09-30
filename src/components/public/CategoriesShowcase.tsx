import React from 'react';
import { useApp } from '../../context/AppContext';
import { Wind, Droplets, Zap, Flame, Cpu, ArrowUpRight, Layers } from 'lucide-react';

export const CategoriesShowcase: React.FC = () => {
  const { categories, products, setActiveView } = useApp();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wind': return <Wind className="w-6 h-6 text-orange-600" />;
      case 'Droplets': return <Droplets className="w-6 h-6 text-blue-600" />;
      case 'Zap': return <Zap className="w-6 h-6 text-amber-600" />;
      case 'Flame': return <Flame className="w-6 h-6 text-rose-600" />;
      case 'Cpu': return <Cpu className="w-6 h-6 text-emerald-600" />;
      default: return <Layers className="w-6 h-6 text-orange-600" />;
    }
  };

  return (
    <section className="py-16 bg-[#F4F6F9] border-b border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="tech-label">Section 04 — Product Divisions</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
            Core Industrial Manufacturing Categories
          </h2>
          <p className="text-sm text-slate-700 font-medium">
            From high-cycle pneumatic automation cylinders to 700 Bar hydraulic power pack valves, explore our verified product categories.
          </p>
        </div>

        {categories.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center max-w-md mx-auto text-slate-500 shadow-2xs">
            <Layers className="w-10 h-10 text-orange-600 mx-auto mb-2 opacity-80" />
            <p className="font-bold text-slate-800 text-sm">Industrial Product Divisions</p>
            <p className="text-xs text-slate-500 mt-1">Product categories are ready to be added via Admin Category Manager or Excel Bulk Ingest.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat) => {
              const count = products.filter(p => p.categoryId === cat.id || p.category === cat.name).length;
              
              return (
                <div 
                  key={cat.id}
                  onClick={() => {
                    setActiveView('public-products');
                  }}
                  className="english-card p-6 rounded-2xl relative overflow-hidden cursor-pointer group hover:border-orange-400 bg-white"
                >
                  {/* Category Background Image Overlay */}
                  <div className="absolute inset-0 z-0 opacity-10 group-hover:opacity-20 transition-opacity">
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                        {getIcon(cat.iconName)}
                      </div>
                      
                      <span className="text-xs font-mono text-orange-700 font-bold bg-orange-50 px-2.5 py-1 rounded border border-orange-200">
                        {count > 0 ? count : (cat.productCount || 0)} SKUs
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-slate-900 font-heading group-hover:text-orange-600 transition-colors flex items-center justify-between">
                        <span>{cat.name}</span>
                        <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity text-orange-600" />
                      </h3>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
                        {cat.description}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center gap-2 text-xs font-mono text-slate-600 font-medium">
                      <span className="w-2 h-2 rounded-full bg-orange-600" />
                      <span>ISO 9001 Tested</span>
                      <span className="w-2 h-2 rounded-full bg-slate-400" />
                      <span>CAD Downloads</span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
