import React, { useState } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { Hero } from './components/public/Hero';
import { ProductDiscovery } from './components/public/ProductDiscovery';
import { CategoriesShowcase } from './components/public/CategoriesShowcase';
import { QualitySection } from './components/public/QualitySection';
import { SEOFAQSection } from './components/public/SEOFAQSection';
import { ExhibitionsSection } from './components/public/ExhibitionsSection';
import { PublicProductCatalog } from './components/public/PublicProductCatalog';
import { ProductDetailModal } from './components/public/ProductDetailModal';
import { ProductCatalogModal } from './components/public/ProductCatalogModal';
import { ProductCompareModal } from './components/public/ProductCompareModal';
import { MultiStepRFQWizard } from './components/public/MultiStepRFQWizard';
import { ExhibitionLandingPage } from './components/public/ExhibitionLandingPage';
import { AboutPage } from './components/public/AboutPage';
import { ContactPage } from './components/public/ContactPage';
import { GalleryPage } from './components/public/GalleryPage';

import { CRMHeader } from './components/crm/CRMHeader';
import { CRMSidebar } from './components/crm/CRMSidebar';
import { CRMDashboard } from './components/crm/CRMDashboard';
import { KanbanPipeline } from './components/crm/KanbanPipeline';
import { RFQManager } from './components/crm/RFQManager';
import { SampleTrialManager } from './components/crm/SampleTrialManager';
import { QuotationBuilder } from './components/crm/QuotationBuilder';
import { OrdersManager } from './components/crm/OrdersManager';
import { CMSManager } from './components/crm/CMSManager';
import { ExhibitionManager } from './components/crm/ExhibitionManager';
import { RBACManager } from './components/crm/RBACManager';
import { AuditLogViewer } from './components/crm/AuditLogViewer';
import { ProductCatalogManager } from './components/crm/ProductCatalogManager';
import { CategoryManager } from './components/crm/CategoryManager';
import { GalleryMediaManager } from './components/crm/GalleryMediaManager';
import { EmployeeManager } from './components/crm/EmployeeManager';
import { PayrollManager } from './components/crm/PayrollManager';
import { AttendanceManager } from './components/crm/AttendanceManager';
import { CompanySettingsManager } from './components/crm/CompanySettingsManager';
import { BulkUploadStudio } from './components/crm/BulkUploadStudio';
import { IndiaMartManager } from './components/crm/IndiaMartManager';
import { InvoiceBillingManager } from './components/crm/InvoiceBillingManager';
import { LoginModal } from './components/auth/LoginModal';
import { LoginPage } from './components/auth/LoginPage';
import { Lock, ShieldAlert } from 'lucide-react';

const RestrictedAccess: React.FC<{ module: string }> = ({ module }) => {
  const { currentRole, setActiveView } = useApp();
  return (
    <div className="p-8 max-w-xl mx-auto my-12 text-center bg-white border border-slate-200 rounded-3xl shadow-xl space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
        <Lock className="w-8 h-8" />
      </div>
      <div>
        <h2 className="text-xl font-extrabold text-slate-900">Access Restricted</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          Your active security role <strong className="text-orange-600">{currentRole.name}</strong> does not have permission to view the <strong className="text-slate-800">{module}</strong> module.
        </p>
      </div>
      <button
        onClick={() => setActiveView('crm-dashboard')}
        className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
      >
        Return to Dashboard
      </button>
    </div>
  );
};

const MainContent: React.FC = () => {
  const { activeView, notification, isAuthenticated, hasPermission } = useApp();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const isPublic = activeView.startsWith('public-');

  return (
    <>
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl border flex items-center gap-3 font-mono text-xs animate-bounce ${
          notification.type === 'success' ? 'bg-emerald-600 text-white border-emerald-700' :
          notification.type === 'warning' ? 'bg-amber-500 text-white border-amber-600' :
          'bg-slate-900 text-sky-300 border-slate-700'
        }`}>
          <span>{notification.message}</span>
        </div>
      )}

      {/* DEDICATED FULL LOGIN PAGE */}
      {activeView === 'auth-login' ? (
        <LoginPage />
      ) : isPublic ? (
        /* PUBLIC WEBSITE VIEW: Standard page scrolling with Header & Footer */
        <div className="min-h-screen bg-[#FAF9F6] text-slate-900 flex flex-col font-sans transition-colors duration-300">
          <Navbar />
          
          <main className="flex-1">
            {activeView === 'public-home' && (
              <>
                <Hero />
                <ProductDiscovery />
                <CategoriesShowcase />
                <QualitySection />
                <SEOFAQSection />
                <ExhibitionsSection />
              </>
            )}

            {activeView === 'public-products' && (
              <>
                <PublicProductCatalog />
                <SEOFAQSection />
              </>
            )}
            {activeView === 'public-rfq' && <MultiStepRFQWizard />}
            {activeView === 'public-exhibitions' && <ExhibitionsSection />}
            {activeView === 'public-expo-landing' && <ExhibitionLandingPage />}
            {activeView === 'public-about' && <AboutPage />}
            {activeView === 'public-contact' && <ContactPage />}
            {activeView === 'public-gallery' && <GalleryPage />}
          </main>

          <Footer />

          {/* Floating Smooth Scroll to Top & WhatsApp Quick Connect */}
          <ScrollToTop />
        </div>
      ) : !isAuthenticated ? (
        /* UNPROTECTED ROUTE REDIRECT -> Show Enterprise Login Page */
        <LoginPage />
      ) : (
        /* CRM ADMIN & SALES PORTAL: Fixed-height app shell with independent Sidebar and Main scrolling */
        <div className="h-screen w-screen overflow-hidden bg-[#FAF9F6] text-slate-900 flex flex-col font-sans">
          
          {/* Fixed Header */}
          <CRMHeader onToggleSidebar={() => setMobileSidebarOpen(prev => !prev)} />
          
          {/* Main CRM Area: Sidebar + Content */}
          <div className="flex-1 flex overflow-hidden min-h-0 relative">
            
            {/* Docked Sidebar (Desktop) + Drawer (Mobile) */}
            <CRMSidebar 
              mobileOpen={mobileSidebarOpen} 
              onCloseMobile={() => setMobileSidebarOpen(false)} 
            />
            
            {/* Independently Scrollable CRM Main Stage */}
            <main className="flex-1 h-full overflow-y-auto overflow-x-hidden bg-[#FAF9F6] text-slate-900 focus:outline-none">
              <div className="max-w-7xl mx-auto w-full">
                {activeView === 'crm-dashboard' && (hasPermission('dashboard', 'view') ? <CRMDashboard /> : <RestrictedAccess module="Executive Dashboard" />)}
                {activeView === 'crm-leads' && (hasPermission('leads', 'view') ? <KanbanPipeline /> : <RestrictedAccess module="Leads & Sales Kanban" />)}
                {activeView === 'crm-indiamart' && (hasPermission('leads', 'view') ? <IndiaMartManager /> : <RestrictedAccess module="IndiaMART Integration Hub" />)}
                {activeView === 'crm-bulk-studio' && (hasPermission('products', 'view') ? <BulkUploadStudio /> : <RestrictedAccess module="Bulk Upload Studio" />)}
                {activeView === 'crm-products' && (hasPermission('products', 'view') ? <ProductCatalogManager /> : <RestrictedAccess module="Product Catalog" />)}
                {activeView === 'crm-categories' && (hasPermission('products', 'view') ? <CategoryManager /> : <RestrictedAccess module="Categories Taxonomy" />)}
                {activeView === 'crm-gallery' && (hasPermission('cms', 'view') ? <GalleryMediaManager /> : <RestrictedAccess module="Gallery Media CMS" />)}
                {activeView === 'crm-rfqs' && (hasPermission('rfqs', 'view') ? <RFQManager /> : <RestrictedAccess module="RFQs & CAD Inquiries" />)}
                {activeView === 'crm-samples' && (hasPermission('samples', 'view') ? <SampleTrialManager /> : <RestrictedAccess module="Sample Requests" />)}
                {activeView === 'crm-trials' && (hasPermission('trials', 'view') ? <SampleTrialManager /> : <RestrictedAccess module="Technical Lab Trials" />)}
                {activeView === 'crm-quotations' && (hasPermission('quotations', 'view') ? <QuotationBuilder /> : <RestrictedAccess module="Quotation Engine" />)}
                {activeView === 'crm-invoices' && (hasPermission('orders', 'view') ? <InvoiceBillingManager /> : <RestrictedAccess module="Tax Invoices & Billing" />)}
                {activeView === 'crm-orders' && (hasPermission('orders', 'view') ? <OrdersManager /> : <RestrictedAccess module="Orders & Dispatch" />)}
                {activeView === 'crm-employees' && (hasPermission('employees', 'view') ? <EmployeeManager /> : <RestrictedAccess module="Employee Directory" />)}
                {activeView === 'crm-payroll' && (hasPermission('payroll', 'view') ? <PayrollManager /> : <RestrictedAccess module="Salary Roll & Payslips" />)}
                {activeView === 'crm-attendance' && (hasPermission('attendance', 'view') ? <AttendanceManager /> : <RestrictedAccess module="Attendance & Leaves" />)}
                {activeView === 'crm-exhibitions' && (hasPermission('exhibitions', 'view') ? <ExhibitionManager /> : <RestrictedAccess module="Exhibitions & Expos" />)}
                {activeView === 'crm-cms' && (hasPermission('cms', 'view') ? <CMSManager /> : <RestrictedAccess module="Website CMS & Banners" />)}
                {activeView === 'crm-rbac' && (hasPermission('rbac', 'view') ? <RBACManager /> : <RestrictedAccess module="RBAC Security Matrix" />)}
                {activeView === 'crm-audit' && (hasPermission('audit', 'view') ? <AuditLogViewer /> : <RestrictedAccess module="Security Audit Logs" />)}
                {activeView === 'crm-settings' && (hasPermission('settings', 'view') ? <CompanySettingsManager /> : <RestrictedAccess module="Company Settings" />)}
              </div>
            </main>
          </div>
        </div>
      )}

      {/* Global Modals */}
      <ProductDetailModal />
      <ProductCatalogModal />
      <ProductCompareModal />
      <LoginModal isOpen={false} />
    </>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <ErrorBoundary>
          <MainContent />
        </ErrorBoundary>
      </AppProvider>
    </ErrorBoundary>
  );
}
