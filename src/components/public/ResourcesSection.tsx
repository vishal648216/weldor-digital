import React from 'react';
import { useApp } from '../../context/AppContext';
import { Download, FileText } from 'lucide-react';

export const ResourcesSection: React.FC = () => {
  const { openCatalogModal } = useApp();

  const resources: Array<{
    title: string;
    size: string;
    type: string;
    downloadUrl?: string;
    previewImg?: string;
    resourceType: 'MASTER_CATALOG' | 'VALVES_3D' | 'CYLINDER_SHEET' | 'CERT_PACKAGE';
    description: string;
  }> = [
    { 
      title: 'Weldor Official Welding & Cutting Product Catalog (2026)', 
      size: '2.1 MB', 
      type: 'Official PDF Catalog',
      downloadUrl: '/catalog/Weldor_Welding_Product_Catalog.pdf',
      previewImg: '/catalog_pages/page_1.png',
      resourceType: 'MASTER_CATALOG',
      description: 'Complete product catalog featuring MIG/TIG torches, Plasma & Gas cutting torches, 300 Bar gas regulators and CNC consumables.'
    },
    { 
      title: 'ISO 9001:2015 Quality Management Certificate (TÜV SÜD)', 
      size: '1.2 MB', 
      type: 'TÜV SÜD Certified PDF',
      downloadUrl: '/certificates/ISO_9001_2015_Certificate.pdf',
      previewImg: '/certificates/iso_page_1.png',
      resourceType: 'CERT_PACKAGE',
      description: 'Certified by TÜV SÜD South Asia for Manufacturing & Supply of Ferrous & Non-Ferrous Metal Machined Components.'
    },
    { 
      title: 'MSME Sustainable (ZED) Silver Quality Certificate', 
      size: '1.4 MB', 
      type: 'Govt. of India ZED PDF',
      downloadUrl: '/certificates/Silver_Quality_Certificate.pdf',
      previewImg: '/certificates/silver_page_1.png',
      resourceType: 'CERT_PACKAGE',
      description: 'Ministry of MSME Govt. of India ZED Silver rating awarded to Earth Metal Industries (UDYAM-GJ-10-0015947).'
    },
    { 
      title: 'EN 10204 3.1 Spectrometry & CMM Inspection Dossier', 
      size: '3.5 MB', 
      type: 'QA & Test Dossier',
      downloadUrl: '/certificates/ISO_9001_2015_Certificate.pdf',
      previewImg: '/catalog_pages/page_10.png',
      resourceType: 'CERT_PACKAGE',
      description: 'Chemical spectrometry, hydrostatic pressure test reports, and 3D CMM dimensional inspection protocols.'
    },
  ];

  return (
    <section className="py-16 bg-[#F4F6F9] border-b border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="tech-label">Engineering Resources & Compliance</span>
            <h2 className="text-3xl font-extrabold text-slate-900 font-heading mt-2">
              Official Catalogs & Quality Certificates
            </h2>
            <p className="text-sm text-slate-700 mt-1 max-w-xl font-medium">
              View and download authentic Weldor product catalogs, TÜV SÜD ISO 9001:2015 certifications, and Govt. of India MSME ZED Silver compliance documents.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {resources.map((res, i) => (
            <div 
              key={i}
              className="english-card p-5 rounded-2xl space-y-4 flex flex-col justify-between hover:border-orange-400 hover:shadow-lg transition-all bg-white"
            >
              <div className="space-y-3">
                {res.previewImg && (
                  <div className="h-36 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative group cursor-pointer"
                       onClick={() => openCatalogModal({ resourceType: res.resourceType, title: res.title })}>
                    <img 
                      src={res.previewImg} 
                      alt={res.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="px-3 py-1.5 rounded-lg bg-orange-600 text-white font-mono text-xs font-bold shadow">
                        Click to Preview
                      </span>
                    </div>
                  </div>
                )}

                <div className="w-9 h-9 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600">
                  <FileText className="w-4 h-4" />
                </div>

                <h4 className="text-sm font-bold text-slate-900 font-heading leading-snug line-clamp-2">
                  {res.title}
                </h4>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {res.description}
                </p>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-600 font-semibold pt-1 border-t border-slate-100">
                  <span>FORMAT: {res.type}</span>
                  <span>SIZE: {res.size}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => openCatalogModal({ resourceType: res.resourceType, title: res.title })}
                  className="btn-secondary text-xs justify-center border-slate-300 font-bold py-2"
                >
                  Preview
                </button>
                {res.downloadUrl ? (
                  <a
                    href={res.downloadUrl}
                    download
                    className="btn-primary text-xs justify-center bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" /> PDF
                  </a>
                ) : (
                  <button
                    onClick={() => openCatalogModal({ resourceType: res.resourceType, title: res.title })}
                    className="btn-primary text-xs justify-center bg-orange-600 text-white font-bold py-2 flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" /> Get
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
