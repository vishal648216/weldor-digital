import React, { useState } from 'react';
import { useApp, type ViewMode } from '../../context/AppContext';
import { 
  ShieldCheck, 
  FileUp, 
  MessageSquare, 
  PhoneCall, 
  Menu, 
  X, 
  Scale,
  Home,
  Package,
  Building2,
  Image as ImageIcon,
  Calendar,
  Mail,
  ChevronRight,
  UserCheck
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    compareList, 
    setIsCompareOpen,
    isAuthenticated,
    currentUser,
    openLoginModal
  } = useApp();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { label: string; view: ViewMode; icon: React.FC<{ className?: string }> }[] = [
    { label: 'Home', view: 'public-home', icon: Home },
    { label: 'Products', view: 'public-products', icon: Package },
    { label: 'About Us', view: 'public-about', icon: Building2 },
    { label: 'Gallery', view: 'public-gallery', icon: ImageIcon },
    { label: 'Exhibitions', view: 'public-exhibitions', icon: Calendar },
    { label: 'Contact', view: 'public-contact', icon: Mail },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/98 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top Engineering Micro-Bar (Desktop Only) */}
      <div className="hidden lg:flex justify-between items-center px-6 py-2 bg-slate-900 text-xs text-slate-200 font-medium">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5 text-orange-400 font-mono font-bold whitespace-nowrap">
            <ShieldCheck className="w-4 h-4 text-orange-400 shrink-0" /> ISO 9001:2015 & AS9100D Certified Manufacturing
          </span>
          <span className="text-slate-600">|</span>
          <span className="font-mono text-slate-300 font-semibold whitespace-nowrap">Pneumatic • Hydraulic • Welding • Precision CNC</span>
        </div>
        
        <div className="flex items-center gap-6 shrink-0">
          <a href="tel:+918780098088" className="flex items-center gap-1.5 hover:text-white transition-colors font-mono font-semibold whitespace-nowrap">
            <PhoneCall className="w-3.5 h-3.5 text-orange-400 shrink-0" /> +91-87800 98088
          </a>
          
          <button 
            onClick={() => {
              window.open('https://wa.me/918780098088?text=Hello%20Weldor%20Sales%20Team%2C%20I%20have%20an%20industrial%20enquiry.', '_blank');
            }}
            className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 font-mono font-bold whitespace-nowrap cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> WhatsApp Sales
          </button>

        </div>
      </div>

      {/* Main Corporate Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group shrink-0"
            onClick={() => {
              setActiveView('public-home');
              setMobileMenuOpen(false);
            }}
          >
            <img 
              src="/weldor-logo.png" 
              alt="Weldor by Earth Metal Industries" 
              className="h-7 sm:h-8 md:h-9 w-auto object-contain transition-transform group-hover:scale-105" 
            />
            <div className="hidden sm:block border-l border-slate-200 pl-3">
              <span className="block font-heading font-extrabold text-xs text-slate-900 leading-tight">
                EARTH METAL INDUSTRIES
              </span>
              <p className="text-[9px] font-mono text-slate-500 font-semibold uppercase tracking-wider">
                Precision B2B Engineering
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links (Concise 1-Word Clean Single Line) */}
          <nav className="hidden lg:flex items-center gap-1 sm:gap-2">
            {navLinks.map(link => (
              <button
                key={link.view}
                onClick={() => setActiveView(link.view)}
                className={`px-3 py-2 rounded-lg text-xs font-mono transition-colors whitespace-nowrap ${
                  activeView === link.view
                    ? 'text-orange-800 bg-orange-50 border border-orange-200 font-bold shadow-xs'
                    : 'text-slate-800 hover:text-slate-900 hover:bg-slate-100 font-bold'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Compare Tray Button */}
            {compareList.length > 0 && (
              <button
                onClick={() => {
                  setIsCompareOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="relative px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg bg-slate-100 border border-slate-300 text-slate-900 text-xs font-mono font-bold flex items-center gap-1.5 hover:border-orange-500 transition-colors shadow-sm whitespace-nowrap shrink-0"
              >
                <Scale className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                <span className="hidden xs:inline">Compare</span>
                <span className="w-4 h-4 rounded-full bg-orange-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                  {compareList.length}
                </span>
              </button>
            )}

            {/* Desktop Primary CTA Button (Only visible on lg desktop screens) */}
            <button
              onClick={() => setActiveView('public-rfq')}
              className="hidden lg:flex btn-primary text-xs px-4 py-2.5 shadow-md items-center gap-2 whitespace-nowrap shrink-0"
            >
              <FileUp className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap font-bold">Request Quote / CAD</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-800 hover:text-slate-950 hover:bg-slate-100 focus:outline-none transition-colors shrink-0 border border-slate-200"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-slate-900" /> : <Menu className="w-6 h-6 text-slate-900" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Overlay & Sliding Panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 z-50 bg-white border-b-2 border-orange-500 shadow-2xl animate-in slide-in-from-top duration-200">
          <div className="max-w-7xl mx-auto px-4 py-5 space-y-4 max-h-[calc(100vh-80px)] overflow-y-auto bg-white">
            
            {/* Nav Header badge */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-mono font-extrabold text-slate-700 uppercase tracking-wider">
                Platform Navigation
              </span>
              <span className="text-[10px] font-mono bg-orange-100 text-orange-900 border border-orange-300 px-2.5 py-0.5 rounded-full font-bold">
                Weldor B2B
              </span>
            </div>

            {/* Navigation Buttons List */}
            <div className="grid grid-cols-1 gap-2">
              {navLinks.map(link => {
                const IconComponent = link.icon;
                const isActive = activeView === link.view;
                return (
                  <button
                    key={link.view}
                    onClick={() => {
                      setActiveView(link.view);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-bold transition-all ${
                      isActive 
                        ? 'bg-orange-600 text-white shadow-md' 
                        : 'text-slate-900 bg-slate-50 hover:bg-orange-50 hover:text-orange-900 border border-slate-200/80'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`p-2 rounded-lg ${isActive ? 'bg-white/20 text-white' : 'bg-white text-orange-600 border border-slate-200'}`}>
                        <IconComponent className="w-4 h-4 shrink-0" />
                      </div>
                      <span className="font-mono text-sm font-bold tracking-tight">{link.label}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  </button>
                );
              })}
            </div>

            {/* Mobile Actions & Direct Contact */}
            <div className="pt-3 border-t border-slate-200 space-y-3">
              <button
                onClick={() => {
                  setActiveView('public-rfq');
                  setMobileMenuOpen(false);
                }}
                className="w-full btn-primary justify-center text-sm py-3.5 shadow-lg whitespace-nowrap flex items-center gap-2"
              >
                <FileUp className="w-4 h-4 shrink-0" />
                <span className="font-bold">Request Quote / Upload CAD</span>
              </button>

              {/* Direct Touch Call / WhatsApp options inside drawer */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href="tel:+918780098088"
                  className="flex items-center justify-center gap-2 py-3 px-3 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl text-xs font-mono font-bold border border-slate-300 transition-colors shadow-xs"
                >
                  <PhoneCall className="w-4 h-4 text-orange-600 shrink-0" />
                  <span>Call Sales</span>
                </a>
                <button
                  onClick={() => {
                    window.open('https://wa.me/918780098088?text=Hello%20Weldor%20Sales%20Team%2C%20I%20have%20an%20industrial%20enquiry.', '_blank');
                  }}
                  className="flex items-center justify-center gap-2 py-3 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-xl text-xs font-mono font-bold border border-emerald-300 transition-colors shadow-xs"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>WhatsApp</span>
                </button>
              </div>

              {/* Staff Portal Link */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (isAuthenticated) {
                    setActiveView('crm-dashboard');
                  } else {
                    setActiveView('auth-login');
                  }
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-mono font-bold border border-slate-700 transition-colors"
              >
                <UserCheck className="w-4 h-4 text-orange-400 shrink-0" />
                <span>{isAuthenticated && currentUser ? `Open CRM (${currentUser.name})` : '🔐 Staff Portal Login'}</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </header>
  );
};

