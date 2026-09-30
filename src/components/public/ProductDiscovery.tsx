import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  ArrowRight, 
  Eye, 
  Scale, 
  Download, 
  Sparkles, 
  Layers, 
  Wind, 
  Droplets, 
  Cpu, 
  Flame, 
  Zap, 
  Box,
  FileCode,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import type { Product } from '../../types';

export const ProductDiscovery: React.FC = () => {
  const { 
    products, 
    categories, 
    setActiveView, 
    setSelectedProduct, 
    toggleCompare, 
    compareList, 
    openCatalogModal 
  } = useApp();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>('All');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');

  const industriesList = ['Automotive', 'Heavy Machinery', 'Aerospace', 'Automation & Robotics', 'Oil & Gas'];

  // Helper to render dynamic icon for category tab
  const getCategoryIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Wind': return <Wind className="w-4 h-4" />;
      case 'Droplets': return <Droplets className="w-4 h-4" />;
      case 'Cpu': return <Cpu className="w-4 h-4" />;
      case 'Zap': return <Zap className="w-4 h-4" />;
      case 'Flame': return <Flame className="w-4 h-4" />;
      default: return <Layers className="w-4 h-4" />;
    }
  };

  // Filter products by search, category tab, and industry
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (!p || (p.status && p.status === 'Archived')) return false;
      
      const q = searchTerm.trim().toLowerCase();
      const matchesSearch = !q || 
        (p.name || '').toLowerCase().includes(q) || 
        (p.sku || '').toLowerCase().includes(q) ||
        (p.tagline || '').toLowerCase().includes(q) ||
        (p.modelNumber && p.modelNumber.toLowerCase().includes(q)) ||
        (Array.isArray(p.seoKeywords) && p.seoKeywords.some(k => (k || '').toLowerCase().includes(q)));

      const matchesCategory = selectedCategoryTab === 'All' || 
        p.category === selectedCategoryTab || 
        p.categoryId === selectedCategoryTab;

      const matchesIndustry = selectedIndustry === 'All' || 
        (Array.isArray(p.industries) && p.industries.includes(selectedIndustry));

      return matchesSearch && matchesCategory && matchesIndustry;
    });
  }, [products, searchTerm, selectedCategoryTab, selectedIndustry]);

  // HOMEPAGE DISPLAY LIMIT: STRICT MAXIMUM 12 PRODUCTS
  const MAX_HOMEPAGE_PRODUCTS = 12;
  const displayedProducts = useMemo(() => {
    // Prioritize products marked featured: true, then remaining
    const sorted = [...filteredProducts].sort((a, b) => {
      if (a.featured === b.featured) return 0;
      return a.featured ? -1 : 1;
    });
    return sorted.slice(0, MAX_HOMEPAGE_PRODUCTS);
  }, [filteredProducts]);

  return (
    <section id="homepage-product-showcase" className="py-20 bg-[#FAF9F6] border-b border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="tech-label">Section 03 — Component Catalog</span>
              <span className="text-[11px] font-mono font-bold text-orange-700 bg-orange-100/70 border border-orange-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-orange-600" /> Max 12 Curated on Home
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
              Find Precision Components for Your Application
            </h2>
            <p className="text-sm text-slate-700 max-w-2xl font-medium">
              Explore our category-wise industrial engineering products. Click any product to inspect 3D CAD STEP models, view technical specifications, or request instant factory quotes.
            </p>
          </div>

          <button 
            onClick={() => setActiveView('public-products')}
            className="btn-secondary text-xs self-start md:self-auto shadow-sm flex items-center gap-2 py-3 px-5 font-bold shrink-0"
          >
            <span>View Full Catalog ({products.length}+ Items)</span>
            <ArrowRight className="w-4 h-4 text-orange-600" />
          </button>
        </div>

        {/* Dynamic Category Tabs */}
        <div className="mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300">
            {/* All Tab */}
            <button
              onClick={() => setSelectedCategoryTab('All')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all shrink-0 cursor-pointer ${
                selectedCategoryTab === 'All'
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20 scale-102'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-xs'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>All Categories</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-extrabold ${
                selectedCategoryTab === 'All' ? 'bg-orange-700 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {products.length}
              </span>
            </button>

            {/* Dynamic Category Tabs from Database/Admin Panel */}
            {categories.map(cat => {
              const count = products.filter(p => p.categoryId === cat.id || p.category === cat.name).length;
              const isSelected = selectedCategoryTab === cat.name || selectedCategoryTab === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryTab(cat.name)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20 scale-102'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-xs'
                  }`}
                >
                  {getCategoryIcon(cat.iconName)}
                  <span>{cat.name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-extrabold ${
                    isSelected ? 'bg-orange-700 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search & Industry Quick Filter Bar */}
        <div className="bg-white p-4 rounded-2xl mb-8 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by component name, SKU (e.g. WEL-HYV-700), or technical spec..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-orange-600 font-medium placeholder-slate-400"
            />
          </div>

          {/* Industry Filter */}
          <div className="w-full md:w-56">
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-orange-600"
            >
              <option value="All">All Applications / Industries</option>
              {industriesList.map(ind => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </div>

          {/* Quick Counter */}
          <div className="text-[11px] font-mono font-bold text-slate-500 whitespace-nowrap px-2">
            Showing <strong className="text-orange-600">{displayedProducts.length}</strong> of {filteredProducts.length}
          </div>
        </div>

        {/* Product Cards Grid (Maximum 12 Products on Home) */}
        {displayedProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto">
              <Box className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No matching products found</h3>
            <p className="text-xs text-slate-600">
              Try adjusting your search query or select another category tab above.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategoryTab('All');
                setSelectedIndustry('All');
              }}
              className="btn-secondary text-xs px-4 py-2"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedProducts.map((product) => {
              const isCompared = compareList.some(p => p.id === product.id);

              return (
                <div 
                  key={product.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between group hover:border-orange-400 hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                >
                  <div>
                    {/* Card Image */}
                    <div className="relative h-56 bg-slate-100 overflow-hidden border-b border-slate-200">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      
                      {/* SKU Badge */}
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur px-2.5 py-1 rounded-md text-[11px] font-mono font-bold text-orange-700 border border-orange-200 shadow-xs">
                        {product.sku}
                      </div>

                      {/* Top Right Badges */}
                      <div className="absolute top-3 right-3 flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        {product.featured && (
                          <span className="px-2 py-0.5 rounded-md bg-orange-600 text-white font-mono text-[10px] font-bold shadow-xs">
                            Featured
                          </span>
                        )}
                        <button
                          onClick={() => toggleCompare(product)}
                          title={isCompared ? "Remove from comparison" : "Add to comparison"}
                          className={`p-2 rounded-lg text-xs font-mono shadow-xs transition-colors ${
                            isCompared 
                              ? 'bg-orange-600 text-white font-bold' 
                              : 'bg-white/95 text-slate-700 hover:bg-white border border-slate-200'
                          }`}
                        >
                          <Scale className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-orange-700 font-bold bg-orange-50 px-2 py-0.5 rounded border border-orange-200 truncate max-w-[200px]">
                          {product.category}
                        </span>
                        {product.inStock && (
                          <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> In Stock
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-slate-900 font-heading group-hover:text-orange-600 transition-colors line-clamp-2">
                        {product.name}
                      </h3>

                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 font-medium">
                        {product.tagline || product.description}
                      </p>

                      {/* Spec Summary Pills */}
                      {product.specifications && product.specifications.length > 0 && (
                        <div className="pt-1 flex flex-wrap gap-1.5 font-mono text-[11px]">
                          {(Array.isArray(product.specifications) ? product.specifications : []).slice(0, 2).map((spec, i) => (
                            <span key={i} className="px-2 py-1 rounded bg-slate-100 text-slate-800 border border-slate-200">
                              {spec.label}: <strong className="text-slate-900 font-bold">{spec.value}</strong>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(product);
                      }}
                      className="text-xs font-bold text-slate-700 hover:text-orange-600 flex items-center gap-1 font-mono py-1.5 px-2 rounded-lg hover:bg-white"
                    >
                      <Eye className="w-4 h-4 text-orange-600" /> Specs & 3D
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openCatalogModal({ product, resourceType: 'PRODUCT' });
                        }}
                        className="p-1.5 px-2.5 rounded-lg border border-slate-200 hover:border-orange-400 text-slate-700 hover:text-orange-600 bg-white transition-colors text-xs font-mono font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                        title="Download Technical Catalog / Datasheet"
                      >
                        <Download className="w-3.5 h-3.5 text-orange-600" />
                        <span className="hidden sm:inline">Catalog</span>
                      </button>

                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProduct(product);
                          setActiveView('public-rfq');
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                      >
                        Quote
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Banner Notice & Full Catalog CTA */}
        <div className="mt-12 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 font-heading">
                Showing top {displayedProducts.length} curated products on Homepage
              </h4>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                All {products.length}+ products with full CAD models and datasheets are permanently saved and accessible in our full catalog.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveView('public-products')}
            className="btn-primary text-xs py-3 px-6 shadow-md flex items-center gap-2 shrink-0 font-bold"
          >
            <span>Explore Full {products.length}+ Product Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
