import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { CompanySettings } from '../../types';
import { 
  Building2, 
  CreditCard, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Save, 
  CheckCircle2, 
  FileText,
  Sliders,
  DollarSign
} from 'lucide-react';

export const CompanySettingsManager: React.FC = () => {
  const { companySettings, updateCompanySettings, hasPermission } = useApp();

  const [formData, setFormData] = useState<CompanySettings>({ ...companySettings });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompanySettings(formData);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 rounded-2xl text-white shadow-xl border border-slate-700/50">
        <div>
          <div className="flex items-center gap-2.5 text-xs font-mono text-orange-400 font-bold uppercase tracking-wider mb-1">
            <Sliders className="w-4 h-4" />
            <span>ENTERPRISE CONFIGURATION & STATUTORY SETUP</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Company Profile & Banking Settings
          </h1>
          <p className="text-slate-300 text-xs md:text-sm mt-1 max-w-2xl">
            Configure legal entity numbers (GSTIN, CIN, IEC), corporate headquarters, factory plant locations, and primary bank accounts.
          </p>
        </div>

        {hasPermission('settings', 'edit') && (
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs md:text-sm shadow-lg shadow-orange-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* SECTION 1: Legal Entity & Registrations */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Building2 className="w-5 h-5 text-orange-600" />
            <h3 className="font-bold text-base text-slate-900">Legal Entity & Tax Registrations</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Company Display Name</label>
              <input
                type="text"
                value={formData.companyName}
                onChange={e => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Registered Legal Entity Name</label>
              <input
                type="text"
                value={formData.legalEntityName}
                onChange={e => setFormData(prev => ({ ...prev, legalEntityName: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
            <div>
              <label className="block font-bold text-slate-700 mb-1 font-sans">GSTIN Number</label>
              <input
                type="text"
                value={formData.gstinNumber}
                onChange={e => setFormData(prev => ({ ...prev, gstinNumber: e.target.value.toUpperCase() }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 uppercase focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 font-sans">Corporate CIN</label>
              <input
                type="text"
                value={formData.cinNumber}
                onChange={e => setFormData(prev => ({ ...prev, cinNumber: e.target.value.toUpperCase() }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 uppercase focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 font-sans">Company PAN</label>
              <input
                type="text"
                value={formData.panNumber}
                onChange={e => setFormData(prev => ({ ...prev, panNumber: e.target.value.toUpperCase() }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 uppercase focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 font-sans">IEC (Import/Export Code)</label>
              <input
                type="text"
                value={formData.iecCode}
                onChange={e => setFormData(prev => ({ ...prev, iecCode: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: Locations & Official Contact */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <MapPin className="w-5 h-5 text-orange-600" />
            <h3 className="font-bold text-base text-slate-900">Registered Office & Factory Plant Locations</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Registered Corporate Office</label>
              <textarea
                rows={3}
                value={formData.registeredOffice}
                onChange={e => setFormData(prev => ({ ...prev, registeredOffice: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Manufacturing Plant & Assembly Unit</label>
              <textarea
                rows={3}
                value={formData.factoryPlantAddress}
                onChange={e => setFormData(prev => ({ ...prev, factoryPlantAddress: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Official Support Email</label>
              <input
                type="email"
                value={formData.supportEmail}
                onChange={e => setFormData(prev => ({ ...prev, supportEmail: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-mono focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Sales & Inquiry Phone Helpline</label>
              <input
                type="tel"
                value={formData.salesPhone}
                onChange={e => setFormData(prev => ({ ...prev, salesPhone: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-mono focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Fiscal Year Cycle</label>
              <input
                type="text"
                value={formData.fiscalYear}
                onChange={e => setFormData(prev => ({ ...prev, fiscalYear: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: Corporate Banking Information */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <CreditCard className="w-5 h-5 text-orange-600" />
            <h3 className="font-bold text-base text-slate-900">Primary Corporate Bank Account (For Quotations & Invoicing)</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Bank Name</label>
              <input
                type="text"
                value={formData.primaryBank.bankName}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  primaryBank: { ...prev.primaryBank, bankName: e.target.value }
                }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Account Holder Name</label>
              <input
                type="text"
                value={formData.primaryBank.accountName}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  primaryBank: { ...prev.primaryBank, accountName: e.target.value }
                }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Account Number</label>
              <input
                type="text"
                value={formData.primaryBank.accountNumber}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  primaryBank: { ...prev.primaryBank, accountNumber: e.target.value }
                }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-mono font-bold focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">IFSC Code</label>
              <input
                type="text"
                value={formData.primaryBank.ifscCode}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  primaryBank: { ...prev.primaryBank, ifscCode: e.target.value.toUpperCase() }
                }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-mono uppercase focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Bank Branch Address</label>
              <input
                type="text"
                value={formData.primaryBank.branch}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  primaryBank: { ...prev.primaryBank, branch: e.target.value }
                }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs md:text-sm shadow-lg shadow-orange-600/30 flex items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save All Enterprise Settings</span>
          </button>
        </div>

      </form>
    </div>
  );
};
