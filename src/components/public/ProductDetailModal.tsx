import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Download, 
  FileUp, 
  ShieldCheck, 
  Play, 
  CheckCircle2, 
  Scale, 
  Clock,
  Box,
  Layers,
  FileText,
  FileCode,
  Video,
  Sparkles,
  DollarSign
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const { 
    selectedProduct, 
    setSelectedProduct, 
    setActiveView, 
    toggleCompare, 
    compareList, 
    showNotification,
    openCatalogModal 
  } = useApp();
  const [activeTab, setActiveTab] = useState<'photos' | 'specs' | 'video' | 'downloads' | 'applications'>('photos');
  const [activeImage, setActiveImage] = useState<string>('');

  if (!selectedProduct) return null;

  const galleryImages = selectedProduct.gallery && selectedProduct.gallery.length > 0 
    ? selectedProduct.gallery 
    : [selectedProduct.image];

  const currentMainImage = activeImage || selectedProduct.image;
  const isCompared = compareList.some(p => p.id === selectedProduct.id);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative text-slate-900 font-sans my-6">
        
        {/* Modal Close Button */}
        <button 
          onClick={() => {
            setSelectedProduct(null);
            setActiveImage('');
          }}
          className="absolute top-5 right-5 z-20 p-2.5 rounded-full bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-10 space-y-8">
          
          {/* Top Product Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Gallery Image & Thumbnails Carousel */}
            <div className="lg:col-span-6 space-y-3">
              <div className="relative h-72 sm:h-80 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-md">
                <img 
                  src={currentMainImage} 
                  alt={selectedProduct.name} 
                  className="w-full h-full object-cover" 
                />
                <span className="absolute top-4 left-4 bg-slate-900/90 text-white px-3 py-1 rounded-md text-xs font-mono font-bold border border-slate-700">
                  {selectedProduct.sku}
                </span>

                {selectedProduct.videoUrl && (
                  <button
                    onClick={() => setActiveTab('video')}
                    className="absolute bottom-4 right-4 bg-purple-600 hover:bg-purple-700 text-white font-mono text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5 transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" /> Watch Video
                  </button>
                )}
              </div>

              {/* Multiple Thumbnails Selector */}
              {galleryImages.length > 1 && (
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                  {galleryImages.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(imgUrl)}
                      className={`w-18 h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                        currentMainImage === imgUrl ? 'border-orange-600 scale-105 shadow-md ring-2 ring-orange-200' : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={imgUrl} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Meta & Highlights */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-bold text-orange-700 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-md">
                  {selectedProduct.category}
                </span>
                {selectedProduct.subCategory && (
                  <span className="text-xs font-mono font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                    {selectedProduct.subCategory}
                  </span>
                )}
                {(selectedProduct.certifications || []).map((cert, i) => (
                  <span key={i} className="text-[11px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" /> {cert}
                  </span>
                ))}
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading leading-tight">
                {selectedProduct.name}
              </h2>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {selectedProduct.tagline || selectedProduct.description}
              </p>

              {/* Price & MOQ Strip */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase block font-bold">B2B Commercial Price</span>
                  <span className="text-2xl font-black text-slate-900 font-mono">₹{(selectedProduct.priceINR || (selectedProduct.priceUSD ? selectedProduct.priceUSD * 83 : 12500)).toLocaleString()} INR</span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block font-bold">MOQ / Lead Time</span>
                  <span className="text-xs font-mono font-bold text-slate-800">{selectedProduct.minOrderQty} Units • {selectedProduct.standardLeadTimeDays} Days</span>
                </div>
              </div>

              {/* Amazon-Style 5 Feature Bullet Points */}
              {selectedProduct.bulletPoints && selectedProduct.bulletPoints.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <h4 className="text-xs font-mono font-extrabold text-slate-900 uppercase tracking-wider">
                    Key Engineering Highlights:
                  </h4>
                  <ul className="space-y-1 text-xs text-slate-700 list-disc pl-4 font-medium">
                    {(Array.isArray(selectedProduct.bulletPoints) ? selectedProduct.bulletPoints : []).slice(0, 5).map((bp, i) => (
                      <li key={i} className="leading-relaxed">{bp}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <button
                  onClick={() => {
                    setSelectedProduct(null);
                    setActiveView('public-rfq');
                  }}
                  className="btn-primary text-xs py-3 px-5 shadow-md flex-1 justify-center font-bold"
                >
                  <FileUp className="w-4 h-4" /> Request Formal Quote / CAD
                </button>

                <button
                  onClick={() => openCatalogModal({ product: selectedProduct, resourceType: 'PRODUCT' })}
                  className="btn-secondary text-xs py-3 px-4 font-bold shadow-xs text-orange-700 hover:text-orange-800 border-orange-300 hover:bg-orange-50"
                  title="Generate Official Technical Datasheet"
                >
                  <Download className="w-4 h-4 text-orange-600" />
                  <span>Technical Datasheet</span>
                </button>

                <button
                  onClick={() => toggleCompare(selectedProduct)}
                  className={`btn-secondary text-xs py-3 px-4 font-bold shadow-xs ${
                    isCompared ? 'bg-orange-50 text-orange-900 border-orange-300' : ''
                  }`}
                >
                  <Scale className="w-4 h-4 text-orange-600" />
                  <span>{isCompared ? 'In Compare' : 'Compare'}</span>
                </button>
              </div>

            </div>

          </div>

          {/* Tab Navigation Section */}
          <div className="border-t border-slate-200 pt-6">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto text-xs font-mono font-bold">
              <button
                onClick={() => setActiveTab('photos')}
                className={`py-2 px-4 rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === 'photos' ? 'bg-orange-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                1. Technical Specifications
              </button>
              {selectedProduct.videoUrl && (
                <button
                  onClick={() => setActiveTab('video')}
                  className={`py-2 px-4 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'video' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>2. Product Demo Video</span>
                </button>
              )}
              <button
                onClick={() => setActiveTab('downloads')}
                className={`py-2 px-4 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'downloads' ? 'bg-orange-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>3. Downloadable Catalog & CAD</span>
              </button>
              <button
                onClick={() => setActiveTab('applications')}
                className={`py-2 px-4 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'applications' ? 'bg-orange-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                4. OEM Industry Applications
              </button>
            </div>

            {/* Tab Contents */}
            <div className="pt-6">
              
              {/* TAB 1: SPECS TABLE */}
              {activeTab === 'photos' && (
                <div className="space-y-4">
                  <h3 className="font-heading font-bold text-base text-slate-900">
                    Comprehensive Technical Specifications
                  </h3>
                  <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                    <table className="w-full text-xs text-left">
                      <tbody className="divide-y divide-slate-100">
                        {(selectedProduct.specifications || []).map((spec, i) => (
                          <tr key={i} className="hover:bg-slate-50">
                            <td className="p-3 font-bold text-slate-700 bg-slate-50/80 w-1/2">{spec.label}</td>
                            <td className="p-3 font-mono text-slate-900 font-bold">{spec.value} {spec.unit || ''}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 2: VIDEO PLAYER */}
              {activeTab === 'video' && selectedProduct.videoUrl && (
                <div className="space-y-4">
                  <h3 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
                    <Video className="w-5 h-5 text-purple-600" />
                    <span>Technical Product Demonstration Video</span>
                  </h3>
                  <div className="rounded-2xl overflow-hidden bg-black max-w-2xl border border-slate-300 shadow-md">
                    <video src={selectedProduct.videoUrl} controls autoPlay className="w-full h-72 object-contain" />
                  </div>
                </div>
              )}

              {/* TAB 3: DOWNLOADS */}
              {activeTab === 'downloads' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Official Catalog & Engineering Datasheet Card */}
                  <div className="p-5 rounded-2xl bg-orange-50/70 border border-orange-200 space-y-3">
                    <div className="flex items-center gap-2 text-orange-950 font-bold font-mono text-sm">
                      <FileText className="w-5 h-5 text-orange-600" />
                      <span>Official Product Catalog & Technical Datasheet</span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium">
                      Complete engineering 2D blueprint, dimensional matrix (Ø32-Ø125mm), part numbering decoder, and ISO/AS9100D test certificates.
                    </p>
                    <button
                      onClick={() => openCatalogModal({ product: selectedProduct, resourceType: 'PRODUCT' })}
                      className="btn-primary text-xs py-2 px-4 w-full justify-center font-bold shadow-xs bg-orange-600 hover:bg-orange-700"
                    >
                      <Download className="w-3.5 h-3.5" /> View / Download Technical Datasheet (PDF)
                    </button>
                  </div>

                  {/* 3D STEP Model Card */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center gap-2 text-amber-800 font-bold font-mono text-sm">
                      <FileCode className="w-5 h-5 text-amber-600" />
                      <span>3D CAD Solid Model & STEP Library</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Universal 3D solid model (.STEP / .IGES) compatible with SolidWorks, Creo, Autodesk Inventor, and CATIA.
                    </p>
                    <button
                      onClick={() => openCatalogModal({ product: selectedProduct, resourceType: 'VALVES_3D', title: `${selectedProduct.name} - 3D CAD STEP Library` })}
                      className="btn-secondary text-xs py-2 px-4 w-full justify-center font-bold shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-600" /> Download 3D STEP & Cavity Blueprints
                    </button>
                  </div>

                  {/* Master B2B Catalog Card */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center gap-2 text-blue-800 font-bold font-mono text-sm">
                      <Layers className="w-5 h-5 text-blue-600" />
                      <span>Weldor Master B2B Component Catalog (2026)</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Comprehensive 4-division catalog covering Pneumatic, Hydraulic, Robotic Welding, and CNC turned precision parts.
                    </p>
                    <button
                      onClick={() => openCatalogModal({ resourceType: 'MASTER_CATALOG' })}
                      className="btn-secondary text-xs py-2 px-4 w-full justify-center font-bold shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5 text-blue-600" /> Open Master Catalog
                    </button>
                  </div>

                  {/* ISO Certification Dossier */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold font-mono text-sm">
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                      <span>ISO 9001:2015 & AS9100D QA Package</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Material test certificate (EN 10204 3.1), CMM inspection reports, and helium leak testing protocols.
                    </p>
                    <button
                      onClick={() => openCatalogModal({ resourceType: 'CERT_PACKAGE' })}
                      className="btn-secondary text-xs py-2 px-4 w-full justify-center font-bold shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-600" /> View QA & Test Dossier
                    </button>
                  </div>

                </div>
              )}

              {/* TAB 4: APPLICATIONS */}
              {activeTab === 'applications' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <h4 className="font-bold text-xs font-mono text-slate-900 uppercase">Target OEM Industries:</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {(selectedProduct.industries || []).map((ind, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs font-bold text-slate-800">
                            {ind}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <h4 className="font-bold text-xs font-mono text-slate-900 uppercase">Machinery Applications:</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {(selectedProduct.applications || []).map((app, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs font-bold text-slate-800">
                            {app}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
