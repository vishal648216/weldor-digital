import React from 'react';
import { useApp, type ViewMode } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  Kanban, 
  FileText, 
  Package, 
  FlaskConical, 
  CheckSquare, 
  ShoppingBag, 
  QrCode, 
  FolderKanban, 
  ShieldCheck, 
  Activity,
  Box,
  Layers,
  Image as ImageIcon,
  X,
  ExternalLink,
  Users,
  CreditCard,
  Clock,
  Sliders,
  Sparkles
} from 'lucide-react';
import type { CRMModule } from '../../types';

interface CRMSidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const CRMSidebar: React.FC<CRMSidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const { activeView, setActiveView, hasPermission, currentRole } = useApp();

  const menuSections: {
    title: string;
    items: { label: string; view: ViewMode; module: CRMModule; icon: React.ReactNode; badge?: string }[];
  }[] = [
    {
      title: 'OPERATIONS & SALES',
      items: [
        { label: 'Executive Dashboard', view: 'crm-dashboard', module: 'dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
        { label: 'Leads & Sales Kanban', view: 'crm-leads', module: 'leads', icon: <Kanban className="w-4 h-4" /> },
        { label: 'IndiaMART Connect & Sync', view: 'crm-indiamart', module: 'leads', icon: <Sparkles className="w-4 h-4 text-orange-500" />, badge: 'Auto Webhook' },
        { label: 'RFQs & CAD Inquiries', view: 'crm-rfqs', module: 'rfqs', icon: <FileText className="w-4 h-4" /> },
        { label: 'Commercial Quotations', view: 'crm-quotations', module: 'quotations', icon: <CheckSquare className="w-4 h-4" /> },
        { label: 'Tax Invoices & Billing', view: 'crm-invoices', module: 'orders', icon: <CreditCard className="w-4 h-4" />, badge: 'GST 18%' },
        { label: 'Orders & B2B Dispatch', view: 'crm-orders', module: 'orders', icon: <ShoppingBag className="w-4 h-4" /> },
      ]
    },
    {
      title: 'BULK OPERATIONS & CDN',
      items: [
        { label: 'Bulk Studio & Cloudinary CDN', view: 'crm-bulk-studio', module: 'products', icon: <Box className="w-4 h-4 text-orange-500" />, badge: 'Excel / Folder' },
      ]
    },
    {
      title: 'HRMS & SALARY PAYROLL',
      items: [
        { label: 'Employee Directory & Register', view: 'crm-employees', module: 'employees', icon: <Users className="w-4 h-4" /> },
        { label: 'Salary Roll & Payslips', view: 'crm-payroll', module: 'payroll', icon: <CreditCard className="w-4 h-4" />, badge: 'CTC Engine' },
        { label: 'Attendance & Leave Logs', view: 'crm-attendance', module: 'attendance', icon: <Clock className="w-4 h-4" /> },
      ]
    },
    {
      title: 'TECHNICAL & VALIDATION',
      items: [
        { label: 'Sample Request Cycle', view: 'crm-samples', module: 'samples', icon: <Package className="w-4 h-4" /> },
        { label: 'Technical Lab Trials', view: 'crm-trials', module: 'trials', icon: <FlaskConical className="w-4 h-4" /> },
      ]
    },
    {
      title: 'CATALOG & WEBSITE CMS',
      items: [
        { label: 'Product Catalog & CAD', view: 'crm-products', module: 'products', icon: <Box className="w-4 h-4" /> },
        { label: 'Categories & Taxonomies', view: 'crm-categories', module: 'products', icon: <Layers className="w-4 h-4" /> },
        { label: 'Gallery & Videos CMS', view: 'crm-gallery', module: 'cms', icon: <ImageIcon className="w-4 h-4" /> },
        { label: 'Website CMS & Banners', view: 'crm-cms', module: 'cms', icon: <FolderKanban className="w-4 h-4" /> },
        { label: 'Exhibitions & Expos', view: 'crm-exhibitions', module: 'exhibitions', icon: <QrCode className="w-4 h-4" /> },
      ]
    },
    {
      title: 'SECURITY & SYSTEM',
      items: [
        { label: 'Employee RBAC Matrix', view: 'crm-rbac', module: 'rbac', icon: <ShieldCheck className="w-4 h-4" /> },
        { label: 'Security Audit Logs', view: 'crm-audit', module: 'audit', icon: <Activity className="w-4 h-4" /> },
        { label: 'Company Settings & Banking', view: 'crm-settings', module: 'settings', icon: <Sliders className="w-4 h-4" /> },
      ]
    }
  ];

  const handleNavClick = (view: ViewMode) => {
    setActiveView(view);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full overflow-hidden bg-white text-slate-800">
      
      {/* Sidebar Header for Mobile Drawer */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between md:hidden">
        <div className="flex items-center gap-2">
          <img 
            src="/weldor-logo.png" 
            alt="Weldor" 
            className="h-6 w-auto object-contain" 
          />
          <div>
            <h3 className="font-bold text-xs text-slate-900 leading-tight">CRM Navigation</h3>
            <p className="text-[9.5px] text-slate-500 font-mono">Earth Metal Industries</p>
          </div>
        </div>
        <button
          onClick={onCloseMobile}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Sidebar Active Role Scope Header */}
      <div className="p-4 pb-2 shrink-0">
        <div className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50/50 border border-orange-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-[9.5px] font-mono font-extrabold text-orange-900 uppercase tracking-wider">ACTIVE PERMISSIONS</p>
            <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-orange-200 text-orange-700 font-bold shadow-xs">
              {currentRole.scope}
            </span>
          </div>
          <p className="text-xs font-bold text-slate-900 font-mono mt-1 truncate">
            {currentRole.name}
          </p>
        </div>
      </div>

      {/* Nav Menu Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-5 scrollbar-thin">
        {menuSections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1">
            <p className="px-3 text-[10px] font-mono font-bold text-slate-600 uppercase tracking-wider">
              {section.title}
            </p>
            <div className="space-y-0.5">
              {section.items.map(item => {
                const isAllowed = hasPermission(item.module, 'view');
                const isActive = activeView === item.view;

                return (
                  <button
                    key={item.view}
                    disabled={!isAllowed}
                    onClick={() => handleNavClick(item.view)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between group ${
                      isActive
                        ? 'bg-orange-600 text-white font-bold shadow-sm shadow-orange-600/30'
                        : isAllowed
                          ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium'
                          : 'text-slate-500 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className={`shrink-0 transition-colors ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-orange-600'}`}>
                        {item.icon}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </div>

                    {!isAllowed && (
                      <span className="text-[9px] font-mono text-rose-500 uppercase font-bold shrink-0 ml-1">Lock</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Website Jump Footer */}
      <div className="p-3 border-t border-slate-200 shrink-0 bg-slate-50/70">
        <button
          onClick={() => handleNavClick('public-home')}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 shadow-xs transition-colors"
        >
          <span>Open Public Site</span>
          <ExternalLink className="w-3.5 h-3.5 text-orange-600" />
        </button>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Fixed Docked Sidebar */}
      <aside className="w-64 h-full bg-white border-r border-slate-200 shrink-0 hidden md:flex flex-col z-20">
        {sidebarContent}
      </aside>

      {/* Mobile / Tablet Off-Canvas Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity" 
            onClick={onCloseMobile} 
          />
          {/* Drawer Panel */}
          <div className="relative w-72 max-w-[80vw] bg-white h-full shadow-2xl z-50 flex flex-col">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
