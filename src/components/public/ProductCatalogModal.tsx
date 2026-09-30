import React, { useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Printer, 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  PhoneCall, 
  Mail, 
  MapPin, 
  Globe, 
  FileText, 
  Cpu, 
  Layers, 
  Box, 
  Share2, 
  FileUp, 
  Award, 
  CheckSquare, 
  Compass,
  ArrowRight
} from 'lucide-react';

export const ProductCatalogModal: React.FC = () => {
  const { 
    catalogModal, 
    closeCatalogModal, 
    products, 
    categories, 
    setSelectedProduct, 
    setActiveView, 
    showNotification 
  } = useApp();

  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!catalogModal || !catalogModal.isOpen) return null;

  const { product, resourceType = 'PRODUCT', title } = catalogModal;

  // Active product or default fallback
  const activeProduct = product || products[0] || {
    id: 'weldor-master-pnc-063',
    sku: 'WLD-PNC-063-0100',
    name: 'ISO 15552 High-Duty Pneumatic Cylinder (Ø63mm x 100mm)',
    category: 'Pneumatics',
    subCategory: 'ISO Cylinders',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1200',
    tagline: 'Heavy-duty ISO 15552 double-acting pneumatic cylinder with magnetic piston and adjustable end-cushioning.',
    description: 'Precision engineered for industrial automation, robotics, and heavy assembly lines. Built with hard-anodized 6061-T6 aluminum and premium NBR/Viton seals.',
    priceUSD: 85,
    priceINR: 6990,
    minOrderQty: 5,
    standardLeadTimeDays: 7,
    bulletPoints: [
      'Compliant with international ISO 15552 & ISO 6431 pneumatic standards',
      'Hard anodized 6061-T6 aluminum barrel with micro-honed interior Ra < 0.2μm',
      'Self-lubricating bronze bearing bush for ultra-low friction and 10M+ cycle lifespan',
      'Dual pneumatic adjustable cushion screws at both front and rear end caps',
      'Optional high-temperature Viton (FKM) seals rated up to 150°C'
    ],
    certifications: ['ISO 9001:2015', 'AS9100D', 'CE Compliant', 'RoHS'],
    specifications: [
      { label: 'Bore Diameter (Ø)', value: '63', unit: 'mm' },
      { label: 'Standard Stroke', value: '100', unit: 'mm' },
      { label: 'Working Pressure Range', value: '1.0 to 10.0', unit: 'Bar (14.5 - 145 PSI)' },
      { label: 'Proof / Burst Pressure', value: '15.0', unit: 'Bar' },
      { label: 'Operating Medium', value: 'Filtered Compressed Air (40μm dry/lubricated)', unit: '' },
      { label: 'Ambient Temperature Range', value: '-20°C to +80°C (Standard NBR)', unit: '' },
      { label: 'Port Thread Size', value: 'G 3/8" BSPP', unit: '' },
      { label: 'Piston Rod Thread', value: 'M16 x 1.5 Male Thread', unit: '' },
      { label: 'Cushioning Type', value: 'Adjustable Pneumatic Air Cushion', unit: '' },
      { label: 'Barrel / Body Material', value: 'Hard Anodized Aluminum Alloy 6061-T6', unit: '' },
      { label: 'Piston Rod Material', value: 'High Carbon Steel CK45 Hard Chrome Plated (20μm)', unit: '' },
      { label: 'Seal Material', value: 'Polyurethane (PU) + NBR Nitrile (Optional Viton)', unit: '' }
    ],
    applications: ['Automotive Welding Fixtures', 'Packaging Machines', 'Sheet Metal Press', 'Robotics Pick & Place'],
    industries: ['Automotive OEM', 'Packaging & FMCG', 'Heavy Machinery', 'Electronics Manufacturing']
  };

  // Determine current document title & code
  let docTitle = activeProduct.name;
  let docSubtitle = `Official Technical Engineering Datasheet & B2B Product Catalog`;
  let docRef = `WLD-TDS-${activeProduct.sku || '2026-GEN'}`;

  if (resourceType === 'MASTER_CATALOG') {
    docTitle = 'WELDOR MASTER B2B INDUSTRIAL COMPONENT CATALOG (2026 EDITION)';
    docSubtitle = 'Comprehensive Product Engineering Guide: Pneumatics • Hydraulics • Welding • CNC Turned Components';
    docRef = 'WLD-CAT-MASTER-2026-V4';
  } else if (resourceType === 'VALVES_3D') {
    docTitle = '700 BAR ULTRA-HIGH PRESSURE HYDRAULIC VALVES & 3D STEP LIBRARY';
    docSubtitle = 'Technical Cavity Schematics, Flow Characteristics, and 3D Solid Model Integration Guide';
    docRef = 'WLD-TDS-HYD-700B-CAD';
  } else if (resourceType === 'CYLINDER_SHEET') {
    docTitle = 'ISO 15552 STANDARD PNEUMATIC CYLINDER DIMENSIONAL & MOUNTING SHEET';
    docSubtitle = 'Engineering Blueprint, Mounting Accessories Matrix & Dimensional Tolerances (Ø32 - Ø125mm)';
    docRef = 'WLD-DIM-ISO15552-2026';
  } else if (resourceType === 'CERT_PACKAGE') {
    docTitle = 'ISO 9001:2015 & AS9100D QUALITY ASSURANCE & CERTIFICATION DOSSIER';
    docSubtitle = 'Quality Management Protocols, NDT Inspection Standards & Material Traceability EN 10204 3.1';
    docRef = 'WLD-QA-ISO-AS9100D-DOC';
  }

  // Handle direct printing
  const handlePrint = () => {
    window.print();
  };

  // Handle Offline Download (HTML/Document formatted)
  const handleDownloadDoc = () => {
    if (!printAreaRef.current) return;
    const content = printAreaRef.current.innerHTML;
    const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>₹{docTitle} - Weldor Earth Metal Industries</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #0f172a; margin: 0; padding: 20px; background: #fff; }
    .catalog-container { max-width: 900px; margin: auto; border: 1px solid #cbd5e1; padding: 30px; border-radius: 8px; }
    table { width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 20px; }
    th, td { border: 1px solid #e2e8f0; padding: 8px 12px; font-size: 12px; text-align: left; }
    th { background: #f8fafc; font-weight: 700; color: #334155; }
    h1, h2, h3, h4 { color: #0f172a; margin-top: 0; }
    .badge { display: inline-block; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; margin-right: 6px; }
    .badge-orange { background: #ffedd5; color: #c2410c; border: 1px solid #fdba74; }
    .badge-green { background: #dcfce7; color: #15803d; border: 1px solid #86efac; }
    .header-bar { border-bottom: 2px solid #ea580c; padding-bottom: 15px; margin-bottom: 20px; }
    @media print { body { padding: 0; } .catalog-container { border: none; padding: 0; } }
  </style>
</head>
<body>
  <div class="catalog-container">₹{content}
  </div>
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${docRef}_Datasheet.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showNotification(`Downloaded official datasheet for ${docTitle}`, 'success');
  };

  // Handle WhatsApp Inquiry
  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Hello Weldor Sales Team, I am inquiring about product catalog / datasheet: ${docTitle} (Doc Ref: ${docRef}). Please share B2B pricing and delivery schedule.`);
    window.open(`https://wa.me/918780098088?text=${text}`, '_blank');
  };

  // Handle Request RFQ
  const handleRFQ = () => {
    closeCatalogModal();
    if (product) {
      setSelectedProduct(product);
    }
    setActiveView('public-rfq');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:static print:overflow-visible">
      
      {/* Modal Container */}
      <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl max-w-5xl w-full max-h-[94vh] flex flex-col shadow-2xl overflow-hidden print:max-h-none print:shadow-none print:border-none print:w-full print:rounded-none">
        
        {/* Top Action & Navigation Strip (Hidden in Print) */}
        <div className="bg-slate-900 text-white px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 print:hidden shrink-0">
          
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white font-black text-sm">
              W
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-orange-400 block leading-none">
                WELDOR TECHNICAL DATASHEET PORTAL
              </span>
              <span className="text-sm font-bold text-slate-100 font-heading leading-tight truncate max-w-xs sm:max-w-md block">
                {docRef}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-mono font-bold border border-slate-700 transition-colors shadow-xs cursor-pointer"
              title="Print to PDF"
            >
              <Printer className="w-3.5 h-3.5 text-orange-400" />
              <span className="hidden sm:inline">Print / Save PDF</span>
            </button>

            <button
              onClick={handleDownloadDoc}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-mono font-bold transition-colors shadow-xs cursor-pointer"
              title="Download Technical Document"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>

            <button
              onClick={handleWhatsApp}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-mono font-bold transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={closeCatalogModal}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white transition-colors cursor-pointer ml-1"
              title="Close Catalog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Scrollable Printable Engineering Catalog Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-50 print:p-0 print:bg-white print:overflow-visible" id="printable-catalog">
          
          <div 
            ref={printAreaRef}
            className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-xl p-6 sm:p-10 shadow-sm print:shadow-none print:border-none print:p-4 text-slate-900 font-sans space-y-6"
          >

            {/* 1. OFFICIAL CORPORATE LETTERHEAD HEADER */}
            <div className="border-b-2 border-orange-600 pb-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                
                {/* Brand & Factory Info */}
                <div className="flex items-start gap-3.5">
                  <img 
                    src="/weldor-logo.png" 
                    alt="WELDOR Industrial Automation" 
                    className="h-12 sm:h-14 object-contain"
                  />
                  <div>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-heading leading-tight">
                      EARTH METAL INDUSTRIES
                    </h1>
                    <span className="text-xs font-mono font-extrabold text-orange-600 uppercase tracking-wider block">
                      Brand: WELDOR • Industrial Automation & Heavy Components Division
                    </span>
                    <p className="text-[11px] text-slate-600 font-medium leading-tight mt-0.5">
                      588, G.I.D.C., Phase 2, Dared, Jamnagar - 361004, Gujarat, INDIA
                    </p>
                  </div>
                </div>

                {/* ISO Badges & Document Registration Meta */}
                <div className="text-left sm:text-right space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-50 border border-emerald-300 text-emerald-800 text-[11px] font-mono font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>ISO 9001:2015 & AS9100D Certified</span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 font-semibold space-y-0.5">
                    <div>DOC REF: <span className="font-bold text-slate-800">{docRef}</span></div>
                    <div>ISSUE DATE: <span className="font-bold text-slate-800">Sept 2026 | Rev 4.2</span></div>
                    <div>STATUS: <span className="text-emerald-700 font-bold">APPROVED FOR OEM SUPPLY</span></div>
                  </div>
                </div>

              </div>

              {/* Document Title Banner */}
              <div className="bg-slate-900 text-white p-3.5 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono text-orange-400 font-bold uppercase tracking-wider block">
                    Technical Specifications & Product Catalog Document
                  </span>
                  <h2 className="text-base sm:text-lg font-extrabold font-heading text-white">
                    {docTitle}
                  </h2>
                  <p className="text-xs text-slate-300 font-medium">
                    {docSubtitle}
                  </p>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-orange-600 text-white text-[10px] font-mono font-black">
                    OFFICIAL RELEASE
                  </span>
                </div>
              </div>

            </div>

            {/* 2. MODE SPECIFIC VIEWS */}

            {/* MODE A: SINGLE PRODUCT CATALOG & DATASHEET */}
            {resourceType === 'PRODUCT' && (
              <div className="space-y-6">
                
                {/* Hero Section: Photo + Overview */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  
                  {/* Photo with Dimensions Graphic */}
                  <div className="md:col-span-5 space-y-2">
                    <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 h-56 sm:h-64 shadow-xs">
                      <img 
                        src={activeProduct.image} 
                        alt={activeProduct.name} 
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 bg-slate-900/90 text-white text-[10px] font-mono font-bold rounded">
                        MODEL: {activeProduct.sku}
                      </span>
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-orange-600 text-white text-[10px] font-mono font-bold rounded">
                        100% FACTORY TESTED
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center">
                      <span className="text-[10px] font-mono text-slate-500 uppercase block font-bold">Standard Commercial Pricing</span>
                      <span className="text-lg font-black font-mono text-slate-900">₹{activeProduct.priceUSD || 85} INR</span>
                      {activeProduct.priceINR && (
                        <span className="text-xs font-mono text-slate-600 ml-2">(₹{activeProduct.priceINR.toLocaleString()} INR)</span>
                      )}
                      <span className="text-[11px] font-mono text-slate-500 block">MOQ: {activeProduct.minOrderQty || 5} Units • Lead Time: {activeProduct.standardLeadTimeDays || 7} Days</span>
                    </div>
                  </div>

                  {/* Highlights & Engineering Features */}
                  <div className="md:col-span-7 space-y-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-800 text-[11px] font-mono font-bold">
                        {activeProduct.category}
                      </span>
                      {activeProduct.subCategory && (
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-mono font-semibold">
                          {activeProduct.subCategory}
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-mono font-bold">
                        CE / RoHS / ISO Compliant
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-slate-900 font-heading">
                      Product Overview & Engineering Scope
                    </h3>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      {activeProduct.tagline || activeProduct.description}
                    </p>

                    {/* Amazon-style 5 Value Bullet Points */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-mono font-bold text-slate-900 uppercase tracking-wide block">
                        Key Engineering Advantages:
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-800 font-medium">
                        {(activeProduct.bulletPoints || []).map((bp, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{bp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                </div>

                {/* Technical Specifications Matrix */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <h3 className="text-sm font-extrabold font-heading text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-orange-600" />
                      <span>Technical Specification Matrix</span>
                    </h3>
                    <span className="text-[11px] font-mono text-slate-500 font-semibold">Tested as per ISO/DIN Standards</span>
                  </div>

                  <div className="rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-100 text-slate-800 font-mono text-[11px] uppercase border-b border-slate-200">
                        <tr>
                          <th className="p-2.5 w-1/2">Technical Parameter</th>
                          <th className="p-2.5 w-1/2">Design Value & Engineering Tolerance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {(activeProduct.specifications || []).map((spec, i) => (
                          <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                            <td className="p-2.5 font-bold text-slate-700">{spec.label}</td>
                            <td className="p-2.5 font-mono text-slate-900 font-bold">
                              {spec.value} {spec.unit ? <span className="text-slate-600 font-normal">({spec.unit})</span> : ''}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 2D Blueprint Schematic & Dimensional Drawing Callout */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <h3 className="text-sm font-extrabold font-heading text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <Compass className="w-4 h-4 text-orange-600" />
                      <span>2D Engineering Blueprint & Dimensional Schematic</span>
                    </h3>
                    <span className="text-[11px] font-mono text-slate-500 font-semibold">All Dimensions in Millimeters (mm)</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 text-slate-100 border border-slate-800 space-y-4">
                    
                    {/* SVG Blueprint Illustration */}
                    <div className="flex justify-center items-center py-2">
                      <svg viewBox="0 0 600 120" className="w-full max-w-xl h-auto text-orange-400 stroke-current fill-none stroke-[1.5]">
                        {/* Main Cylinder Barrel */}
                        <rect x="150" y="30" width="300" height="60" rx="4" className="stroke-slate-300 fill-slate-800/80" />
                        {/* Piston Rod */}
                        <rect x="450" y="50" width="110" height="20" rx="2" className="stroke-orange-400 fill-orange-500/20" />
                        {/* Thread Tip */}
                        <rect x="560" y="54" width="25" height="12" rx="1" className="stroke-amber-300 fill-amber-400/30" />
                        {/* Front Cap */}
                        <rect x="420" y="25" width="30" height="70" rx="2" className="stroke-slate-200 fill-slate-700" />
                        {/* Rear Cap */}
                        <rect x="120" y="25" width="30" height="70" rx="2" className="stroke-slate-200 fill-slate-700" />
                        {/* Rear Pivot */}
                        <circle cx="105" cy="60" r="10" className="stroke-slate-300 fill-slate-800" />
                        {/* Ports */}
                        <rect x="160" y="15" width="20" height="15" className="stroke-orange-400 fill-orange-600/30" />
                        <rect x="400" y="15" width="20" height="15" className="stroke-orange-400 fill-orange-600/30" />
                        
                        {/* Dimension Arrows */}
                        <line x1="120" y1="105" x2="560" y2="105" className="stroke-slate-400 stroke-[1] stroke-dasharray-2" />
                        <text x="320" y="115" className="fill-slate-300 stroke-none text-[11px] font-mono text-center">L (Overall Length = Stroke + 145mm)</text>

                        <line x1="585" y1="30" x2="585" y2="90" className="stroke-slate-400 stroke-[1]" />
                        <text x="590" y="65" className="fill-slate-300 stroke-none text-[10px] font-mono">Ø D</text>
                      </svg>
                    </div>

                    {/* Dimension Table for Standard Sizes */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-[11px] font-mono text-slate-200 text-center border-collapse">
                        <thead>
                          <tr className="border-b border-slate-700 bg-slate-800/80 text-orange-300">
                            <th className="p-1.5">Bore Size (Ø)</th>
                            <th className="p-1.5">Port Size</th>
                            <th className="p-1.5">Rod Thread</th>
                            <th className="p-1.5">Front Cap (mm)</th>
                            <th className="p-1.5">Cushion Length</th>
                            <th className="p-1.5">Max Stroke (mm)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                          <tr className="hover:bg-slate-800/50">
                            <td className="p-1.5 font-bold text-white">Ø32 mm</td>
                            <td className="p-1.5">G 1/8"</td>
                            <td className="p-1.5">M10 x 1.25</td>
                            <td className="p-1.5">45 x 45</td>
                            <td className="p-1.5">17 mm</td>
                            <td className="p-1.5">1000 mm</td>
                          </tr>
                          <tr className="hover:bg-slate-800/50">
                            <td className="p-1.5 font-bold text-white">Ø50 mm</td>
                            <td className="p-1.5">G 1/4"</td>
                            <td className="p-1.5">M16 x 1.5</td>
                            <td className="p-1.5">65 x 65</td>
                            <td className="p-1.5">24 mm</td>
                            <td className="p-1.5">1500 mm</td>
                          </tr>
                          <tr className="bg-orange-950/30 text-orange-200 font-bold">
                            <td className="p-1.5 text-white">Ø63 mm (Standard)</td>
                            <td className="p-1.5">G 3/8"</td>
                            <td className="p-1.5">M16 x 1.5</td>
                            <td className="p-1.5">75 x 75</td>
                            <td className="p-1.5">24 mm</td>
                            <td className="p-1.5">2000 mm</td>
                          </tr>
                          <tr className="hover:bg-slate-800/50">
                            <td className="p-1.5 font-bold text-white">Ø80 mm</td>
                            <td className="p-1.5">G 3/8"</td>
                            <td className="p-1.5">M20 x 1.5</td>
                            <td className="p-1.5">95 x 95</td>
                            <td className="p-1.5">28 mm</td>
                            <td className="p-1.5">2000 mm</td>
                          </tr>
                          <tr className="hover:bg-slate-800/50">
                            <td className="p-1.5 font-bold text-white">Ø100 mm</td>
                            <td className="p-1.5">G 1/2"</td>
                            <td className="p-1.5">M20 x 1.5</td>
                            <td className="p-1.5">115 x 115</td>
                            <td className="p-1.5">30 mm</td>
                            <td className="p-1.5">2000 mm</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                  </div>
                </div>

                {/* Part Number Ordering Code Matrix */}
                <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 space-y-2.5">
                  <h4 className="text-xs font-mono font-extrabold text-orange-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Box className="w-4 h-4 text-orange-700" />
                    <span>How to Order — Part Number Configurator Breakdown</span>
                  </h4>
                  
                  <div className="bg-white p-3 rounded-lg border border-orange-200 flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                    <div className="text-center p-1.5 bg-slate-50 rounded border border-slate-200">
                      <span className="block text-[10px] text-slate-500 font-bold">1. BRAND</span>
                      <span className="font-extrabold text-orange-600">WLD</span>
                    </div>
                    <span className="text-slate-400 font-bold">-</span>
                    <div className="text-center p-1.5 bg-slate-50 rounded border border-slate-200">
                      <span className="block text-[10px] text-slate-500 font-bold">2. SERIES</span>
                      <span className="font-extrabold text-slate-900">PNC (ISO 15552)</span>
                    </div>
                    <span className="text-slate-400 font-bold">-</span>
                    <div className="text-center p-1.5 bg-slate-50 rounded border border-slate-200">
                      <span className="block text-[10px] text-slate-500 font-bold">3. BORE (Ø)</span>
                      <span className="font-extrabold text-slate-900">063 (63mm)</span>
                    </div>
                    <span className="text-slate-400 font-bold">-</span>
                    <div className="text-center p-1.5 bg-slate-50 rounded border border-slate-200">
                      <span className="block text-[10px] text-slate-500 font-bold">4. STROKE</span>
                      <span className="font-extrabold text-slate-900">0100 (100mm)</span>
                    </div>
                    <span className="text-slate-400 font-bold">-</span>
                    <div className="text-center p-1.5 bg-slate-50 rounded border border-slate-200">
                      <span className="block text-[10px] text-slate-500 font-bold">5. MAGNET</span>
                      <span className="font-extrabold text-slate-900">M (Standard)</span>
                    </div>
                    <span className="text-slate-400 font-bold">-</span>
                    <div className="text-center p-1.5 bg-slate-50 rounded border border-slate-200">
                      <span className="block text-[10px] text-slate-500 font-bold">6. SEALS</span>
                      <span className="font-extrabold text-slate-900">V (Viton / NBR)</span>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* MODE B: MASTER B2B INDUSTRIAL COMPONENT CATALOG (2026) */}
            {resourceType === 'MASTER_CATALOG' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-orange-950 text-white p-6 rounded-2xl space-y-3">
                  <span className="tech-badge bg-orange-600 text-white font-mono text-[10px]">
                    2026 GENERAL MASTER CATALOG
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black font-heading">
                    Weldor Precision Engineering & Manufacturing Capabilities
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                    Earth Metal Industries is an ISO 9001:2015 & AS9100D certified precision manufacturer operating out of Jamnagar, Gujarat. We engineer high-pressure pneumatic cylinders, 700-bar hydraulic directional valves, robotic welding torches, and high-precision CNC turned components for Tier-1 OEMs worldwide.
                  </p>
                </div>

                {/* Product Categories Table */}
                <div className="space-y-3">
                  <h4 className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">
                    Manufacturing Divisions & Product Taxonomy
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {categories.map((cat, i) => (
                      <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-orange-600 uppercase">Division 0{i+1}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-slate-200 font-bold">
                            {cat.productCount || 8} SKUs
                          </span>
                        </div>
                        <h5 className="font-extrabold text-slate-900 text-sm font-heading">{cat.name}</h5>
                        <p className="text-xs text-slate-600 line-clamp-2">{cat.description || 'Standard high-reliability components engineered for demanding industrial environments.'}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Master Component List */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">
                    Featured Master Product Index & Technical Ratings
                  </h4>
                  <div className="rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-100 text-slate-800 font-mono text-[11px] uppercase border-b border-slate-200">
                        <tr>
                          <th className="p-2.5">Model / SKU</th>
                          <th className="p-2.5">Product Name</th>
                          <th className="p-2.5">Pressure Rating</th>
                          <th className="p-2.5">Material Grade</th>
                          <th className="p-2.5">B2B Price (₹ INR)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {(Array.isArray(products) ? products : []).slice(0, 8).map((p, idx) => (
                          <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                            <td className="p-2.5 font-mono font-bold text-orange-700">{p.sku}</td>
                            <td className="p-2.5 font-bold text-slate-900">{p.name}</td>
                            <td className="p-2.5 font-mono text-slate-700">{p.specifications.find(s => s.label.toLowerCase().includes('pressure'))?.value || '10 - 700 Bar'}</td>
                            <td className="p-2.5 font-mono text-slate-700">{p.specifications.find(s => s.label.toLowerCase().includes('material'))?.value || 'Alloy 6061-T6 / SS316'}</td>
                            <td className="p-2.5 font-mono font-bold text-slate-900">₹{p.priceUSD || 120} INR</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* MODE C: 700 BAR HYDRAULIC VALVES & 3D STEP LIBRARY */}
            {resourceType === 'VALVES_3D' && (
              <div className="space-y-6">
                <div className="p-5 rounded-xl bg-blue-50 border border-blue-200 space-y-2">
                  <span className="text-[10px] font-mono text-blue-800 font-bold uppercase">Fluid Power Engineering Package</span>
                  <h3 className="text-base font-bold text-blue-950 font-heading">
                    700 Bar Ultra-High Pressure Hydraulic Directional & Cartridge Valves
                  </h3>
                  <p className="text-xs text-blue-900">
                    Includes universal 3D CAD STEP files, cavity drawings for Sun / ISO standard manifold blocks, flow-pressure drop curves (ΔP vs Q), and seal installation guidelines.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-slate-200 space-y-2 bg-slate-50">
                    <h4 className="text-xs font-mono font-bold text-slate-900 uppercase">CAD 3D Model Formats Included:</h4>
                    <ul className="text-xs text-slate-700 space-y-1 font-mono">
                      <li>• .STEP (AP214 / AP242 with Color & PMI)</li>
                      <li>• .IGES (Universal Surface & Solid)</li>
                      <li>• .SLDPRT (SolidWorks 2020-2026 Compatible)</li>
                      <li>• .DWG / .DXF (2D Precision Cavity Blueprints)</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 space-y-2 bg-slate-50">
                    <h4 className="text-xs font-mono font-bold text-slate-900 uppercase">Operating Hydraulic Parameters:</h4>
                    <ul className="text-xs text-slate-700 space-y-1 font-mono">
                      <li>• Maximum Continuous Pressure: 700 Bar (10,000 PSI)</li>
                      <li>• Burst Pressure Rating: 1,050 Bar (15,200 PSI)</li>
                      <li>• Fluid: Mineral Oil ISO VG 32 to VG 68</li>
                      <li>• Fluid Cleanliness: ISO 4406 Class 18/16/13</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* MODE D: ISO 15552 CYLINDER SHEET */}
            {resourceType === 'CYLINDER_SHEET' && (
              <div className="space-y-6">
                <div className="p-5 rounded-xl bg-orange-50 border border-orange-200 space-y-2">
                  <span className="text-[10px] font-mono text-orange-800 font-bold uppercase">Standardized Actuation Engineering</span>
                  <h3 className="text-base font-bold text-orange-950 font-heading">
                    ISO 15552 / ISO 6431 Heavy-Duty Pneumatic Cylinder Range
                  </h3>
                  <p className="text-xs text-orange-900">
                    Standard interchangeable pneumatic cylinders designed for global automation systems. Fully compatible with Festo, SMC, and Parker ISO standard brackets.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 font-mono text-[11px] uppercase">
                      <tr>
                        <th className="p-2.5">Bore (mm)</th>
                        <th className="p-2.5">Thrust Force at 6 Bar (N)</th>
                        <th className="p-2.5">Pull Force at 6 Bar (N)</th>
                        <th className="p-2.5">Port Size</th>
                        <th className="p-2.5">Cushion Stroke (mm)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      <tr><td className="p-2.5 font-bold">Ø 32</td><td className="p-2.5">482 N</td><td className="p-2.5">415 N</td><td className="p-2.5">G 1/8"</td><td className="p-2.5">17 mm</td></tr>
                      <tr><td className="p-2.5 font-bold">Ø 40</td><td className="p-2.5">754 N</td><td className="p-2.5">633 N</td><td className="p-2.5">G 1/4"</td><td className="p-2.5">20 mm</td></tr>
                      <tr><td className="p-2.5 font-bold">Ø 50</td><td className="p-2.5">1,178 N</td><td className="p-2.5">990 N</td><td className="p-2.5">G 1/4"</td><td className="p-2.5">24 mm</td></tr>
                      <tr className="bg-orange-50/60 font-bold"><td className="p-2.5 text-orange-900">Ø 63</td><td className="p-2.5">1,870 N</td><td className="p-2.5">1,682 N</td><td className="p-2.5">G 3/8"</td><td className="p-2.5">24 mm</td></tr>
                      <tr><td className="p-2.5 font-bold">Ø 80</td><td className="p-2.5">3,016 N</td><td className="p-2.5">2,721 N</td><td className="p-2.5">G 3/8"</td><td className="p-2.5">28 mm</td></tr>
                      <tr><td className="p-2.5 font-bold">Ø 100</td><td className="p-2.5">4,712 N</td><td className="p-2.5">4,418 N</td><td className="p-2.5">G 1/2"</td><td className="p-2.5">30 mm</td></tr>
                      <tr><td className="p-2.5 font-bold">Ø 125</td><td className="p-2.5">7,363 N</td><td className="p-2.5">6,881 N</td><td className="p-2.5">G 1/2"</td><td className="p-2.5">32 mm</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* MODE E: OFFICIAL ISO & MSME CERTIFICATION PACKAGE */}
            {resourceType === 'CERT_PACKAGE' && (
              <div className="space-y-6">
                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                  <span className="text-[10px] font-mono text-emerald-800 font-bold uppercase tracking-wider">
                    Quality Assurance & Accreditations
                  </span>
                  <h3 className="text-lg font-extrabold text-emerald-950 font-heading">
                    ISO 9001:2015 & MSME Sustainable ZED Silver Quality Certification
                  </h3>
                  <p className="text-xs text-emerald-900 leading-relaxed">
                    Earth Metal Industries (Plot 588, G.I.D.C. Phase-2, Dared, Jamnagar) maintains strict 100% batch traceability, CMM dimensional inspection, and spectrometry validation.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* ISO 9001:2015 Card */}
                  <div className="p-5 rounded-2xl border-2 border-orange-300 bg-white space-y-4 shadow-sm flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="h-56 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center p-2">
                        <img 
                          src="/certificates/iso_page_1.png" 
                          alt="TÜV SÜD ISO 9001:2015 Certificate" 
                          className="max-h-full object-contain"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded uppercase">
                          TÜV SÜD SOUTH ASIA
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 mt-1">ISO 9001:2015 Certificate</h4>
                        <p className="text-[11px] text-slate-600 mt-1">
                          Scope: Manufacturing & Supply of Ferrous and Non-Ferrous Metal Machined Components.
                        </p>
                      </div>
                    </div>

                    <a
                      href="/certificates/ISO_9001_2015_Certificate.pdf"
                      download="Weldor_ISO_9001_2015_Certificate.pdf"
                      className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download ISO 9001 PDF</span>
                    </a>
                  </div>

                  {/* MSME ZED Silver Card */}
                  <div className="p-5 rounded-2xl border-2 border-slate-200 bg-white space-y-4 shadow-sm flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="h-56 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center p-2">
                        <img 
                          src="/certificates/silver_page_1.png" 
                          alt="Govt of India MSME ZED Silver Certificate" 
                          className="max-h-full object-contain"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded uppercase">
                          GOVT. OF INDIA MSME
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 mt-1">MSME ZED Silver Certificate</h4>
                        <p className="text-[11px] text-slate-600 mt-1">
                          Zero Defect Zero Effect Scheme (Reg: UDYAM-GJ-10-0015947 | Cert: 25032026_466755).
                        </p>
                      </div>
                    </div>

                    <a
                      href="/certificates/Silver_Quality_Certificate.pdf"
                      download="Weldor_MSME_ZED_Silver_Certificate.pdf"
                      className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download MSME ZED PDF</span>
                    </a>
                  </div>

                </div>
              </div>
            )}

            {/* 3. QUALITY ASSURANCE SEAL & FACTORY SIGN-OFF STAMP */}
            <div className="border-t border-slate-200 pt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center gap-3">
                  <Award className="w-8 h-8 text-orange-600 shrink-0" />
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Quality Assurance</span>
                    <span className="text-xs font-bold text-slate-900">100% Factory QC Inspected</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center gap-3">
                  <CheckSquare className="w-8 h-8 text-emerald-600 shrink-0" />
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Material Standards</span>
                    <span className="text-xs font-bold text-slate-900">EN 10204 3.1 Traceable</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center gap-3">
                  <ShieldCheck className="w-8 h-8 text-blue-600 shrink-0" />
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Leakage Rating</span>
                    <span className="text-xs font-bold text-slate-900">Bubble-Tight Class VI</span>
                  </div>
                </div>

              </div>

              {/* Company Footer Info & Contacts */}
              <div className="bg-slate-100 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600 font-mono">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="font-bold text-slate-900">EARTH METAL INDUSTRIES (WELDOR BRAND)</div>
                  <div className="flex flex-wrap items-center gap-3 text-[11px]">
                    <span className="flex items-center gap-1"><PhoneCall className="w-3 h-3 text-orange-600" /> +91-87800 98088</span>
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-orange-600" /> sales@weldorindustries.com</span>
                    <span className="flex items-center gap-1"><Globe className="w-3 h-3 text-orange-600" /> www.weldorindustries.com</span>
                  </div>
                </div>

                <div className="text-center sm:text-right shrink-0">
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Jamnagar Plant QC Sign-off</span>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded inline-block mt-0.5">
                    ✓ QC VERIFIED & CERTIFIED
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Bottom Quick Action Bar (Hidden in Print) */}
        <div className="bg-white border-t border-slate-200 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3 shrink-0 print:hidden">
          <div className="text-xs text-slate-500 font-mono font-medium hidden sm:block">
            Need customized bore sizes, stroke lengths, or OEM private labeling?
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={handleRFQ}
              className="btn-primary text-xs py-2.5 px-5 shadow-sm font-bold flex-1 sm:flex-initial justify-center"
            >
              <FileUp className="w-4 h-4" /> Request Formal Price Quote / CAD
            </button>
            <button
              onClick={closeCatalogModal}
              className="btn-secondary text-xs py-2.5 px-4 font-bold"
            >
              Close
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
