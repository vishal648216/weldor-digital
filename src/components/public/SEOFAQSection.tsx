import React, { useState } from 'react';
import { HelpCircle, ChevronDown, CheckCircle2, ShieldCheck, FileText, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SEOFAQSection: React.FC = () => {
  const { setActiveView } = useApp();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'What engineering drawing formats do you support for custom component evaluation?',
      answer: 'Our CAD/CAM engineering team accepts 3D STEP, IGES, SolidWorks (.sldprt), Creo, Parasolid (.x_t), as well as 2D PDF, DXF, and DWG blueprints. All uploads are analyzed within 2 hours under strict non-disclosure agreement (NDA) protocols.',
      tag: 'CAD & Design'
    },
    {
      question: 'What are the pressure ratings and testing benchmarks for Weldor hydraulic & pneumatic valves?',
      answer: 'Our high-pressure hydraulic manifold blocks and valves are rated up to 700 Bar (10,150 PSI) with burst safety factor testing exceeding 4:1. Pneumatic ISO standard cylinders undergo 100% automated pressure hold, seal friction, and 1.5x test cycling before dispatch.',
      tag: 'Pressure & Testing'
    },
    {
      question: 'What quality certifications and material inspection reports accompany dispatches?',
      answer: 'Every shipment is delivered with EN 10204 3.1 Material Test Certificates (MTC), ultrasonic flaw detection reports, coordinate measuring machine (CMM) dimensional reports, salt-spray corrosion test logs, and ISO 9001:2015 traceability certificates.',
      tag: 'Quality & Compliance'
    },
    {
      question: 'What are your minimum order quantities (MOQ) and production lead times for volume contracts?',
      answer: 'We offer zero-MOQ prototyping for engineering validation and pilot trials. Standard production batch quantities start at 50 to 500 units depending on geometry, with typical delivery windows of 7 to 15 business days for scheduled supply agreements.',
      tag: 'Production & MOQ'
    },
    {
      question: 'Do you provide OEM private labeling, custom laser marking, and international export logistics?',
      answer: 'Yes. We provide complete OEM private labeling with customer logo engraving, batch date-coding, custom barcoded packaging, and DAP/FOB/CIF international shipping with sea-worthy fumigated wooden pallets and customs documentation.',
      tag: 'OEM & Export'
    }
  ];

  return (
    <section className="py-20 bg-white border-y border-slate-200" aria-label="Frequently Asked Technical and B2B Questions">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-xs font-mono font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-orange-600" />
            <span>Industrial Technical Knowledge & FAQs</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading tracking-tight">
            Frequently Asked Engineering & Procurement Questions
          </h2>
          
          <p className="text-slate-600 text-sm font-medium">
            Everything you need to know about our precision manufacturing tolerances, ISO test protocols, drawing uploads, and international B2B supply agreements.
          </p>
        </div>

        {/* FAQs Accordion Grid */}
        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index}
                className={`rounded-2xl border transition-all duration-200 ${
                  isOpen 
                    ? 'bg-orange-50/40 border-orange-300 shadow-sm' 
                    : 'bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-white'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 shrink-0">
                      {faq.tag}
                    </span>
                    <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900 leading-snug">
                      {faq.question}
                    </h3>
                  </div>

                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                    isOpen ? 'bg-orange-600 text-white rotate-180 shadow-xs' : 'bg-white border border-slate-200 text-slate-500'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 pt-0 animate-in fade-in duration-200">
                    <div className="border-t border-orange-200/60 pt-4">
                      <p className="text-slate-700 text-sm leading-relaxed font-medium">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Support Prompt */}
        <div className="mt-12 text-center bg-slate-50 border border-slate-200 rounded-2xl p-6 max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="text-left">
            <h4 className="font-bold text-slate-900 text-sm">Have a custom technical inquiry or drawing?</h4>
            <p className="text-xs text-slate-600">Our engineering leads are ready to review your project specifications.</p>
          </div>
          <button
            onClick={() => setActiveView('public-rfq')}
            className="btn-primary text-xs py-2.5 px-4 shadow-xs shrink-0"
          >
            Submit RFQ / Drawing <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
};
