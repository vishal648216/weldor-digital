import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  Award, 
  ArrowRight,
  MessageSquare,
  Lock
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveView } = useApp();

  return (
    <footer className="bg-white border-t border-slate-200 text-slate-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top CTA Banner in Footer */}
        <div className="p-8 sm:p-10 rounded-2xl bg-orange-50/60 border-2 border-orange-200 mb-16 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div>
            <span className="tech-label">B2B Manufacturing Partner</span>
            <h3 className="text-2xl font-bold text-slate-900 font-heading mt-2">
              Have a Custom Engineering Drawing or Component Requirement?
            </h3>
            <p className="text-sm text-slate-700 mt-1 max-w-2xl font-medium">
              Our engineering team evaluates CAD drawings within 2 hours. Get prototype samples, 3D STEP models, and commercial volume pricing.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button 
              onClick={() => setActiveView('public-rfq')}
              className="btn-primary shadow-md"
            >
              Upload CAD Drawing <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => {
                window.open('https://wa.me/918780098088?text=Hello%20Weldor%20Engineering%20Team', '_blank');
              }}
              className="btn-secondary text-slate-900 border-slate-300 bg-white hover:bg-slate-50 font-bold"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" /> WhatsApp Sales
            </button>
          </div>
        </div>

        {/* 5 Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-200">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src="/weldor-logo.png" 
                alt="Weldor by Earth Metal Industries" 
                className="h-8 md:h-9 w-auto object-contain"
              />
              <div className="border-l border-slate-200 pl-3">
                <span className="font-heading font-extrabold text-sm text-slate-900 block leading-tight">
                  EARTH METAL INDUSTRIES
                </span>
                <span className="text-[10px] font-mono text-slate-500 font-semibold uppercase tracking-wider">
                  Brand: WELDOR
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed max-w-sm font-medium">
              Precision B2B industrial component manufacturer specializing in Pneumatic Cylinders, 700 Bar Hydraulic Valves, Heavy Robotic Welding Torches, and High-Precision Brass & CNC Assemblies.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="tech-badge flex items-center gap-1 text-orange-800 bg-orange-50 border-orange-200 font-bold text-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-orange-600" /> ISO 9001:2015 Registered
              </span>
              <span className="tech-badge flex items-center gap-1 text-emerald-800 bg-emerald-50 border-emerald-200 font-bold text-xs">
                <Award className="w-3.5 h-3.5 text-emerald-600" /> MSME ZED Silver Certified
              </span>
            </div>
          </div>

          {/* Product Categories */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-slate-900 text-sm uppercase tracking-wider">Product Divisions</h4>
            <ul className="space-y-2 text-sm font-semibold text-slate-700">
              <li>
                <button onClick={() => setActiveView('public-products')} className="hover:text-orange-600 transition-colors">
                  MIG / CO2 & TIG Torches
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('public-products')} className="hover:text-orange-600 transition-colors">
                  Plasma & Gas Cutting Torches
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('public-products')} className="hover:text-orange-600 transition-colors">
                  300 Bar Gas Regulators
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('public-products')} className="hover:text-orange-600 transition-colors">
                  Welding & Cutting Consumables
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('public-about')} className="hover:text-orange-600 transition-colors">
                  Quality & Certifications
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-slate-900 text-sm uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2 text-sm font-semibold text-slate-700">
              <li>
                <button onClick={() => setActiveView('public-home')} className="hover:text-orange-600 transition-colors">
                  Company Overview
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('public-about')} className="hover:text-orange-600 transition-colors">
                  About Us & Legacy
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('public-contact')} className="hover:text-orange-600 transition-colors">
                  Contact Us & Plant Map
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('public-gallery')} className="hover:text-orange-600 transition-colors">
                  Media & Project Gallery
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('public-rfq')} className="hover:text-orange-600 transition-colors">
                  Multi-Step RFQ Engine
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-slate-900 text-sm uppercase tracking-wider">Plant Headquarters</h4>
            <ul className="space-y-3 text-sm font-semibold text-slate-700">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                <span>588, G.I.D.C., Phase 2, Dared, Jamnagar (361004), Gujarat, India</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-orange-600 shrink-0" />
                <a href="tel:+918780098088" className="hover:text-orange-600 font-mono">+91-87800 98088</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-orange-600 shrink-0" />
                <a href="mailto:brm@weldorindustries.com" className="hover:text-orange-600 font-mono">brm@weldorindustries.com</a>
              </li>
              <li className="pt-1">
                <a 
                  href="https://www.google.com/maps/place/Weldor+by+Earth+Metal+Industries/@22.4145771,70.059849,17z/data=!3m1!4b1!4m6!3m5!1s0x39576b0f8c29599d:0x4b5181f8c3ddc48!8m2!3d22.4145771!4d70.059849!16s%2Fg%2F11fj_75ywj" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-orange-600 hover:text-orange-700 font-bold underline"
                >
                  <MapPin className="w-3.5 h-3.5" /> View on Google Maps
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Legal & CRM Internal Link */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-4 font-semibold">
          <p>© {new Date().getFullYear()} Weldor by Earth Metal Industries. All rights reserved.</p>
          
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-900 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-900 cursor-pointer">Terms of Supply</span>

            {/* Direct Internal Link to CRM / Admin Portal */}
            <button
              onClick={() => setActiveView('crm-dashboard')}
              className="text-orange-700 hover:text-orange-800 flex items-center gap-1 font-mono font-bold hover:underline"
              title="Employee & Sales Portal Access"
            >
              <Lock className="w-3.5 h-3.5 text-orange-600" /> Sales CRM Portal
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
