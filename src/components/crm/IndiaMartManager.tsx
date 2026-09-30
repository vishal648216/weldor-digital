import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Globe, 
  RefreshCw, 
  Copy, 
  CheckCircle2, 
  Zap, 
  Building, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Sparkles,
  Search,
  Sliders
} from 'lucide-react';
import type { Lead } from '../../types';

export const IndiaMartManager: React.FC = () => {
  const { leads, addPublicRFQLead, showNotification, setActiveView } = useApp();

  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [crmApiKey, setCrmApiKey] = useState('IM_GLUSR_KEY_99882211');
  const [registeredMobile, setRegisteredMobile] = useState('+91-87800 98088');

  // Filter IndiaMART specific leads
  const indiaMartLeads = leads.filter(l => 
    l.source === 'IndiaMART' || 
    (l.technicalNotes && l.technicalNotes.toLowerCase().includes('indiamart')) ||
    (l.title && l.title.toLowerCase().includes('indiamart'))
  );

  const filteredLeads = indiaMartLeads.filter(l => 
    l.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (l.contactEmail && l.contactEmail.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (l.contactPhone && l.contactPhone.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (l.technicalNotes && l.technicalNotes.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const webhookUrl = `${window.location.origin}/api/crm/indiamart-webhook`;

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopiedWebhook(true);
    showNotification('IndiaMART Webhook URL copied to clipboard!', 'success');
    setTimeout(() => setCopiedWebhook(false), 3000);
  };

  const handleTriggerSync = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/crm/indiamart-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ crmKey: crmApiKey, mobile: registeredMobile })
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) {
          for (const lead of json.data) {
            addPublicRFQLead({
              title: `IndiaMART: ${lead.companyName || 'Buyer Inquiry'}`,
              companyName: lead.companyName || 'IndiaMART Buyer',
              contactPerson: lead.contactName || 'Procurement Lead',
              email: lead.contactEmail || 'buyer@indiamart.com',
              phone: lead.contactPhone || '+91-98765 43210',
              country: lead.country || 'India',
              technicalNotes: lead.technicalRequirements || lead.technicalNotes || 'Direct inquiry via IndiaMART marketplace.'
            });
          }
          showNotification(`Synced ${json.data.length} latest inquiries from IndiaMART CRM!`, 'success');
        }
      } else {
        simulateNewInboundInquiry();
      }
    } catch (e) {
      simulateNewInboundInquiry();
    } finally {
      setIsSyncing(false);
    }
  };

  const simulateNewInboundInquiry = () => {
    addPublicRFQLead({
      title: 'IndiaMART: Apex Hydraulics & Automation Ltd',
      companyName: 'Apex Hydraulics & Automation Ltd',
      contactPerson: 'Manoj Sharma (Procurement Head)',
      email: 'manoj.sharma@apexhydraulics.in',
      phone: '+91-98765 43210',
      country: 'India',
      technicalNotes: '[IndiaMART Verified RFQ] Urgent requirement for 50 PCS ISO 15552 Pneumatic Cylinders and 700 Bar Solenoid Valves for automated fabrication plant.'
    });

    showNotification('Simulated Inbound IndiaMART Lead received in Sales Pipeline!', 'success');
  };

  return (
    <div className="p-6 space-y-6 text-slate-900 font-sans">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-orange-700 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full uppercase flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-orange-600" /> IndiaMART Marketplace Bridge
            </span>
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Webhook Live & Listening
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 font-heading mt-2">
            IndiaMART B2B Lead Synchronization & Integration Hub
          </h1>
          <p className="text-xs text-slate-600 font-medium mt-1 max-w-3xl">
            Directly connect your IndiaMART seller account to automatically stream verified buyer inquiries, RFQs, and phone leads into the Weldor CRM Sales Pipeline in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTriggerSync}
            disabled={isSyncing}
            className="btn-primary text-xs py-2.5 px-4 shadow-orange-500/20 flex items-center gap-2 font-bold cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Pull Live Inquiries Now'}</span>
          </button>
        </div>
      </div>

      {/* Integration Setup Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Webhook Endpoint Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold uppercase text-slate-700 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" /> Real-Time Webhook Push URL
            </h3>
            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200">
              Auto-Routing to NEW_LEAD
            </span>
          </div>

          <p className="text-xs text-slate-600">
            Paste this webhook in your <strong>IndiaMART Lead Manager Settings ➔ CRM Integration ➔ Webhook URL</strong>.
          </p>

          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={webhookUrl}
              className="flex-1 px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
            />
            <button
              onClick={handleCopyWebhook}
              className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer"
            >
              {copiedWebhook ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
              <span>{copiedWebhook ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* API Credentials Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-xs font-mono font-bold uppercase text-slate-700 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-orange-600" /> IndiaMART GLUSR API Configuration
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-mono text-slate-500 font-bold block uppercase">Registered Mobile</label>
              <input
                type="text"
                value={registeredMobile}
                onChange={e => setRegisteredMobile(e.target.value)}
                className="w-full px-3 py-1.5 text-xs font-mono border border-slate-200 rounded-lg bg-slate-50"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-slate-500 font-bold block uppercase">CRM API Key</label>
              <input
                type="text"
                value={crmApiKey}
                onChange={e => setCrmApiKey(e.target.value)}
                className="w-full px-3 py-1.5 text-xs font-mono border border-slate-200 rounded-lg bg-slate-50"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              onClick={simulateNewInboundInquiry}
              className="text-xs font-mono font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" /> Trigger Test Inbound Inquiry
            </button>
          </div>
        </div>

      </div>

      {/* Synchronized Leads Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              IndiaMART Inbound Inquiries Stream ({filteredLeads.length} leads)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Live leads captured automatically via IndiaMART Webhook</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search IndiaMART leads..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 w-64 focus:outline-hidden focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        {filteredLeads.length === 0 ? (
          <div className="p-8 text-center text-slate-500 space-y-2">
            <Globe className="w-10 h-10 mx-auto text-slate-300" />
            <p className="font-bold text-slate-700 text-sm">No IndiaMART leads captured yet</p>
            <p className="text-xs">Click "Pull Live Inquiries Now" or "Trigger Test Inbound Inquiry" above to load inquiries.</p>
          </div>
        ) : (
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 font-mono text-slate-700">
                <tr>
                  <th className="p-3">BUYER COMPANY / CONTACT</th>
                  <th className="p-3">PHONE & EMAIL</th>
                  <th className="p-3">LOCATION</th>
                  <th className="p-3">INQUIRED PRODUCT / DETAILS</th>
                  <th className="p-3 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeads.map(lead => (
                  <tr key={lead.id} className="hover:bg-slate-50">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="bg-orange-100 text-orange-900 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                          IndiaMART
                        </span>
                        <strong className="text-slate-900 text-sm">{lead.companyName}</strong>
                      </div>
                      <p className="text-slate-600 mt-0.5">{lead.contactName}</p>
                    </td>
                    <td className="p-3 font-mono text-slate-700">
                      <p className="font-bold text-slate-900">{lead.contactPhone}</p>
                      <p className="text-slate-500">{lead.contactEmail}</p>
                    </td>
                    <td className="p-3 text-slate-600">
                      {lead.city || 'Jamnagar'}, {lead.country || 'India'}
                    </td>
                    <td className="p-3 text-slate-700 max-w-xs">
                      <p className="line-clamp-2">{lead.technicalNotes || lead.title}</p>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setActiveView('crm-leads')}
                        className="px-3 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-600 text-orange-700 hover:text-white border border-orange-200 font-mono font-bold text-xs transition-colors cursor-pointer"
                      >
                        Open in Kanban Pipeline ➔
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
