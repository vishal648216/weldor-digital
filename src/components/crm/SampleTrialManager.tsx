import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Package, 
  FlaskConical, 
  CheckCircle2, 
  AlertTriangle, 
  Truck, 
  Clock, 
  ArrowRight, 
  FileText, 
  Plus, 
  Trash2, 
  X, 
  ShieldCheck, 
  Building2, 
  User, 
  Calendar,
  Gauge,
  Activity,
  Layers
} from 'lucide-react';
import { TechnicalTrial, SampleRequest } from '../../types';

export const SampleTrialManager: React.FC = () => {
  const { 
    samples, 
    createSampleRequest,
    updateSampleStage, 
    deleteSampleRequest,
    trials, 
    createTechnicalTrial,
    updateTrialStatus, 
    deleteTechnicalTrial,
    activeView, 
    setActiveView, 
    showNotification, 
    createQuotationFromLead, 
    products,
    leads,
    currentEmployee
  } = useApp();

  const isTrialsView = activeView === 'crm-trials';
  const [filterMode, setFilterMode] = useState<'active' | 'completed' | 'all'>('active');

  // Modals state
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false);
  const [failureModalTrial, setFailureModalTrial] = useState<TechnicalTrial | null>(null);
  const [failureReasonInput, setFailureReasonInput] = useState('');

  // New Sample Form State
  const [sampleForm, setSampleForm] = useState({
    companyName: '',
    productName: '',
    quantityRequested: 2,
    courierTrackingNo: '',
    courierPartner: 'DHL Express',
  });

  // New Trial Form State
  const [trialForm, setTrialForm] = useState({
    companyName: '',
    productName: '',
    pressureTestBar: 525,
    leakageTestResult: '0.000 sccs (Zero Bubble Helium Mass Spec)',
    corrosionHours: 500,
    cycleCount: 250000,
    evaluatorEngineer: currentEmployee?.name || 'Amit Verma (QC & Metallurgy Lead)',
    completionDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
  });

  // Active vs Completed Slices
  const activeSamples = samples.filter(s => s.stage !== 'Delivered');
  const completedSamples = samples.filter(s => s.stage === 'Delivered');
  const filteredSamples = samples.filter(s => {
    if (filterMode === 'active') return s.stage !== 'Delivered';
    if (filterMode === 'completed') return s.stage === 'Delivered';
    return true;
  });

  const activeTrials = trials.filter(t => t.status !== 'Approved' && t.status !== 'Failed');
  const completedTrials = trials.filter(t => t.status === 'Approved' || t.status === 'Failed');
  const filteredTrials = trials.filter(t => {
    if (filterMode === 'active') return t.status !== 'Approved' && t.status !== 'Failed';
    if (filterMode === 'completed') return t.status === 'Approved' || t.status === 'Failed';
    return true;
  });

  const handleCreateSample = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sampleForm.companyName.trim() || !sampleForm.productName.trim()) {
      showNotification('Please enter Company Name and Product Name.', 'warning');
      return;
    }

    await createSampleRequest({
      companyName: sampleForm.companyName,
      productName: sampleForm.productName,
      quantityRequested: Number(sampleForm.quantityRequested) || 1,
      courierTrackingNo: sampleForm.courierTrackingNo ? `${sampleForm.courierPartner.toUpperCase()}-${sampleForm.courierTrackingNo}` : 'Pending Dispatch Allocation',
      stage: sampleForm.courierTrackingNo ? 'Dispatched' : 'Requested',
    });

    setIsSampleModalOpen(false);
    setSampleForm({ companyName: '', productName: '', quantityRequested: 2, courierTrackingNo: '', courierPartner: 'DHL Express' });
  };

  const handleCreateTrial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trialForm.companyName.trim() || !trialForm.productName.trim()) {
      showNotification('Please enter Company Name and Product Name.', 'warning');
      return;
    }

    await createTechnicalTrial({
      companyName: trialForm.companyName,
      productName: trialForm.productName,
      testParameters: {
        pressureTestBar: Number(trialForm.pressureTestBar) || 525,
        leakageTestResult: trialForm.leakageTestResult || '0.000 sccs (Zero Bubble Helium Mass Spec)',
        corrosionHours: Number(trialForm.corrosionHours) || 500,
        cycleCount: Number(trialForm.cycleCount) || 250000,
      },
      evaluatorEngineer: trialForm.evaluatorEngineer,
      completionDate: trialForm.completionDate,
      status: 'Execution In Progress',
    });

    setIsTrialModalOpen(false);
    setTrialForm({
      companyName: '',
      productName: '',
      pressureTestBar: 525,
      leakageTestResult: '0.000 sccs (Zero Bubble Helium Mass Spec)',
      corrosionHours: 500,
      cycleCount: 250000,
      evaluatorEngineer: currentEmployee?.name || 'Amit Verma (QC & Metallurgy Lead)',
      completionDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    });
  };

  const handleRecordFailureSubmit = () => {
    if (!failureModalTrial) return;
    const reason = failureReasonInput.trim() || 'Hydrostatic burst threshold exceeded tolerance window';
    updateTrialStatus(failureModalTrial.id, 'Failed', reason);
    setFailureModalTrial(null);
    setFailureReasonInput('');
  };

  return (
    <div className="p-6 space-y-6 text-slate-900">
      
      {/* Top Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-5 bg-white p-6 rounded-2xl shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-orange-600 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full uppercase">
              {isTrialsView ? 'Laboratory QA & Endurance Testing' : 'Engineering Prototype Dispatches'}
            </span>
            <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full">
              Live API Sync
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-heading mt-2">
            {isTrialsView ? 'Technical Lab Trials & Validation Workspace' : 'Sample Request Cycle & Dispatch Tracking'}
          </h1>
          <p className="text-xs text-slate-600 font-medium mt-1">
            {isTrialsView 
              ? 'Record hydrostatic pressure bursts, zero-bubble helium leak tests, and metallurgical QA certifications.'
              : 'Track prototype sample batch dispatches, courier airway bills, and client laboratory evaluations.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Main Module Switcher */}
          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1 text-xs font-mono">
            <button
              onClick={() => setActiveView('crm-samples')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                !isTrialsView ? 'bg-white text-orange-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              Samples ({samples.length})
            </button>
            <button
              onClick={() => setActiveView('crm-trials')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                isTrialsView ? 'bg-white text-orange-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5" />
              Technical Trials ({trials.length})
            </button>
          </div>

          {/* Action Trigger */}
          {!isTrialsView ? (
            <button
              onClick={() => setIsSampleModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-mono text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Dispatch New Sample
            </button>
          ) : (
            <button
              onClick={() => setIsTrialModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Schedule Lab Trial
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div className="flex items-center justify-between gap-4 bg-slate-50 border border-slate-200 p-2 rounded-xl text-xs font-mono">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFilterMode('active')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              filterMode === 'active' ? 'bg-white text-slate-900 shadow-xs border border-slate-200' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Active Only ({!isTrialsView ? activeSamples.length : activeTrials.length})
          </button>
          <button
            onClick={() => setFilterMode('completed')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              filterMode === 'completed' ? 'bg-white text-slate-900 shadow-xs border border-slate-200' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Completed Archives ({!isTrialsView ? completedSamples.length : completedTrials.length})
          </button>
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              filterMode === 'all' ? 'bg-white text-slate-900 shadow-xs border border-slate-200' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            All Records ({!isTrialsView ? samples.length : trials.length})
          </button>
        </div>

        <span className="text-[11px] text-slate-500 hidden sm:inline">
          Showing {!isTrialsView ? filteredSamples.length : filteredTrials.length} of {!isTrialsView ? samples.length : trials.length} items
        </span>
      </div>

      {/* SAMPLES VIEW */}
      {!isTrialsView && (
        <div className="space-y-4">
          {filteredSamples.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-500 space-y-3">
              <Package className="w-12 h-12 mx-auto text-slate-300" />
              <p className="font-bold text-slate-800 text-base">
                No {filterMode === 'completed' ? 'completed / archived' : 'active'} sample prototype dispatches found
              </p>
              {filterMode === 'active' && completedSamples.length > 0 && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs max-w-md mx-auto">
                  {completedSamples.length} prototype sample is archived under Delivered Archives.
                  <button
                    onClick={() => setFilterMode('completed')}
                    className="block mt-2 mx-auto font-bold underline hover:text-amber-700 cursor-pointer"
                  >
                    View Delivered Archives ({completedSamples.length}) →
                  </button>
                </div>
              )}
              <div className="pt-2">
                <button
                  onClick={() => setIsSampleModalOpen(true)}
                  className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Create & Dispatch First Sample
                </button>
              </div>
            </div>
          ) : (
            filteredSamples.map(samp => (
              <div key={samp.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 hover:border-orange-200 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="tech-label">{samp.sampleNumber}</span>
                      <span className="text-[11px] text-slate-400 font-mono">ID: {samp.id}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 font-heading mt-1">{samp.companyName}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md border ${
                      samp.stage === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      samp.stage === 'Dispatched' ? 'bg-sky-50 text-sky-700 border-sky-200' :
                      'bg-orange-50 text-orange-700 border-orange-200'
                    }`}>
                      Stage: {samp.stage}
                    </span>
                    <button
                      onClick={() => deleteSampleRequest(samp.id)}
                      title="Delete sample"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-slate-500 block font-semibold">PRODUCT SAMPLE</span>
                    <span className="text-slate-900 font-bold">{samp.productName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-semibold">QUANTITY</span>
                    <span className="text-orange-700 font-bold">{samp.quantityRequested} PCS</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-semibold">COURIER TRACKING</span>
                    <span className="text-sky-700 font-bold">{samp.courierTrackingNo || 'Pending Dispatch'}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  <span className="text-xs text-slate-500 font-mono">Created: {new Date(samp.createdAt).toLocaleDateString()}</span>
                  <div className="flex flex-wrap items-center gap-2">
                    {samp.stage !== 'Dispatched' && samp.stage !== 'Delivered' && (
                      <button
                        onClick={() => updateSampleStage(samp.id, 'Dispatched')}
                        className="btn-primary text-xs py-2 px-3.5"
                      >
                        <Truck className="w-3.5 h-3.5" /> Mark Dispatched with Courier
                      </button>
                    )}
                    {samp.stage === 'Dispatched' && (
                      <button
                        onClick={() => updateSampleStage(samp.id, 'Delivered')}
                        className="btn-secondary text-xs text-emerald-700 border-emerald-300 hover:bg-emerald-50 py-2 px-3.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Confirm Customer Delivered
                      </button>
                    )}
                    {samp.stage === 'Delivered' && (
                      <button
                        onClick={async () => {
                          await createTechnicalTrial({
                            companyName: samp.companyName,
                            productName: `${samp.productName} (Sample Prototype)`,
                            leadId: samp.leadId,
                            status: 'Execution In Progress',
                          });
                          setActiveView('crm-trials');
                          showNotification(`Converted sample ${samp.sampleNumber} to Technical Lab Trial!`, 'success');
                        }}
                        className="btn-primary text-xs py-2 px-3.5 bg-blue-600 hover:bg-blue-500"
                      >
                        <FlaskConical className="w-3.5 h-3.5" /> Convert & Start Technical Lab Trial →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TECHNICAL LAB TRIALS VIEW */}
      {isTrialsView && (
        <div className="space-y-4">
          {filteredTrials.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-500 space-y-3">
              <FlaskConical className="w-12 h-12 mx-auto text-slate-300" />
              <p className="font-bold text-slate-800 text-base">
                No {filterMode === 'completed' ? 'completed / archived' : 'active'} laboratory technical trials found
              </p>
              {filterMode === 'active' && completedTrials.length > 0 && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-xs max-w-md mx-auto">
                  {completedTrials.length} technical endurance trial is archived under Completed Archives (Passed/Certified).
                  <button
                    onClick={() => setFilterMode('completed')}
                    className="block mt-2 mx-auto font-bold underline hover:text-blue-700 cursor-pointer"
                  >
                    View Completed Archives ({completedTrials.length}) →
                  </button>
                </div>
              )}
              <div className="pt-2">
                <button
                  onClick={() => setIsTrialModalOpen(true)}
                  className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500"
                >
                  <Plus className="w-4 h-4" /> Schedule New Technical Trial
                </button>
              </div>
            </div>
          ) : (
            filteredTrials.map(trial => (
              <div key={trial.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 hover:border-blue-200 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="tech-label">{trial.trialNumber}</span>
                      <span className="text-[11px] text-slate-400 font-mono">ID: {trial.id}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 font-heading mt-1">{trial.companyName}</h3>
                    <p className="text-xs text-slate-600 font-medium">{trial.productName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md border ${
                      trial.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      trial.status === 'Failed' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                      'bg-sky-50 text-sky-700 border-sky-200'
                    }`}>
                      Status: {trial.status}
                    </span>
                    <button
                      onClick={() => deleteTechnicalTrial(trial.id)}
                      title="Delete trial"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-mono bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-slate-500 block font-semibold">PRESSURE HOLD</span>
                    <span className="text-slate-900 font-bold">{trial.testParameters?.pressureTestBar || 525} Bar</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-semibold">LEAKAGE RESULT</span>
                    <span className="text-emerald-700 font-bold">{trial.testParameters?.leakageTestResult || 'Zero Bubble'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-semibold">CORROSION / CYCLE</span>
                    <span className="text-orange-700 font-bold">{trial.testParameters?.corrosionHours || 500} Hrs / {(trial.testParameters?.cycleCount || 250000).toLocaleString()} C</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-semibold">EVALUATOR</span>
                    <span className="text-slate-800 font-bold">{trial.evaluatorEngineer || 'Lead QA Specialist'}</span>
                  </div>
                </div>

                {trial.failureReason && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-mono text-rose-800 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span><strong>Failure Audit Reason:</strong> {trial.failureReason}</span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  <span className="text-xs text-slate-500 font-mono">
                    Target Completion: {trial.completionDate || 'Within 7 Business Days'}
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    {trial.status !== 'Approved' && (
                      <button
                        onClick={() => updateTrialStatus(trial.id, 'Approved')}
                        className="btn-primary text-xs py-2 px-3.5 bg-emerald-600 hover:bg-emerald-500"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approve Trial Pass (Zero Leak)
                      </button>
                    )}
                    {trial.status !== 'Failed' && (
                      <button
                        onClick={() => {
                          setFailureModalTrial(trial);
                          setFailureReasonInput('');
                        }}
                        className="btn-secondary text-xs text-rose-700 hover:bg-rose-50 border-rose-200 py-2 px-3.5"
                      >
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Record Failure
                      </button>
                    )}
                    {trial.status === 'Approved' && (
                      <button
                        onClick={() => {
                          const matchedProd = products[0];
                          createQuotationFromLead(trial.leadId || `lead-${Date.now()}`, [
                            {
                              id: `item-${Date.now()}`,
                              productId: matchedProd?.id || `prod-trial-${Date.now()}`,
                              productName: `${trial.productName} (Lab Certified)`,
                              sku: matchedProd?.sku || 'WEL-HYD-350',
                              quantity: 50,
                              unitPriceUSD: matchedProd?.priceUSD || 420,
                              discountPercentage: 5,
                              taxPercentage: 18,
                              totalPriceUSD: 50 * (matchedProd?.priceUSD || 420) * 0.95,
                            }
                          ], 1500, 30);
                          setActiveView('crm-quotations');
                          showNotification(`Commercial Quotation generated for validated trial ${trial.trialNumber}!`, 'success');
                        }}
                        className="btn-primary text-xs py-2 px-3.5 bg-orange-600 hover:bg-orange-500"
                      >
                        <FileText className="w-3.5 h-3.5" /> Generate Production Quote →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* MODAL: DISPATCH NEW SAMPLE */}
      {isSampleModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-orange-600" />
                <h3 className="font-heading font-bold text-slate-900 text-lg">Dispatch Prototype Sample</h3>
              </div>
              <button 
                onClick={() => setIsSampleModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSample} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 mb-1">Company / Client Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Larsen & Toubro Heavy Engineering"
                  value={sampleForm.companyName}
                  onChange={e => setSampleForm({ ...sampleForm, companyName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-orange-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 mb-1">Product Sample Prototype *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ISO 15552 Cylinder Prototype (Ø80x200mm)"
                  value={sampleForm.productName}
                  onChange={e => setSampleForm({ ...sampleForm, productName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-orange-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-700 mb-1">Quantity (PCS)</label>
                  <input
                    type="number"
                    min="1"
                    value={sampleForm.quantityRequested}
                    onChange={e => setSampleForm({ ...sampleForm, quantityRequested: parseInt(e.target.value) || 1 })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:border-orange-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-700 mb-1">Courier Partner</label>
                  <select
                    value={sampleForm.courierPartner}
                    onChange={e => setSampleForm({ ...sampleForm, courierPartner: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:border-orange-500 focus:outline-hidden"
                  >
                    <option value="DHL Express">DHL Express</option>
                    <option value="Blue Dart">Blue Dart</option>
                    <option value="FedEx Industrial">FedEx Industrial</option>
                    <option value="DTDC Air Cargo">DTDC Air Cargo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 mb-1">Airway Bill / Tracking Number</label>
                <input
                  type="text"
                  placeholder="e.g. 88219034"
                  value={sampleForm.courierTrackingNo}
                  onChange={e => setSampleForm({ ...sampleForm, courierTrackingNo: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:border-orange-500 focus:outline-hidden"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">Leave blank if pending warehouse allocation</span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSampleModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-mono text-xs font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-2 px-5 cursor-pointer"
                >
                  Save & Dispatch Sample
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SCHEDULE NEW TECHNICAL LAB TRIAL */}
      {isTrialModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-blue-600" />
                <h3 className="font-heading font-bold text-slate-900 text-lg">Schedule Technical QA Trial</h3>
              </div>
              <button 
                onClick={() => setIsTrialModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTrial} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 mb-1">Company / Account Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Thermax Global Power Division"
                  value={trialForm.companyName}
                  onChange={e => setTrialForm({ ...trialForm, companyName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 mb-1">Machine Component / Valve Under Test *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Custom 350-Bar Hydraulic Cylinder Damper Actuator"
                  value={trialForm.productName}
                  onChange={e => setTrialForm({ ...trialForm, productName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-700 mb-1">Test Pressure (Bar)</label>
                  <input
                    type="number"
                    value={trialForm.pressureTestBar}
                    onChange={e => setTrialForm({ ...trialForm, pressureTestBar: parseInt(e.target.value) || 350 })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-700 mb-1">Corrosion Hours (Salt Spray)</label>
                  <input
                    type="number"
                    value={trialForm.corrosionHours}
                    onChange={e => setTrialForm({ ...trialForm, corrosionHours: parseInt(e.target.value) || 500 })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 mb-1">Leakage Benchmark Result</label>
                <input
                  type="text"
                  value={trialForm.leakageTestResult}
                  onChange={e => setTrialForm({ ...trialForm, leakageTestResult: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-700 mb-1">Lead QC Specialist</label>
                  <input
                    type="text"
                    value={trialForm.evaluatorEngineer}
                    onChange={e => setTrialForm({ ...trialForm, evaluatorEngineer: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-700 mb-1">Target Completion Date</label>
                  <input
                    type="date"
                    value={trialForm.completionDate}
                    onChange={e => setTrialForm({ ...trialForm, completionDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsTrialModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-mono text-xs font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-2 px-5 bg-blue-600 hover:bg-blue-500 cursor-pointer"
                >
                  Schedule Trial in Lab
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RECORD FAILURE REASON */}
      {failureModalTrial && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="p-5 border-b border-slate-100 bg-rose-50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-800">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <h3 className="font-heading font-bold text-base">Record Technical Trial Failure</h3>
              </div>
              <button 
                onClick={() => setFailureModalTrial(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-600">
                Specify the engineering reason for marking <strong>{failureModalTrial.trialNumber}</strong> as Failed.
              </p>
              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 mb-1">Failure Root Cause *</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Hydrostatic pressure drop observed at 480 bar due to seal extrusion."
                  value={failureReasonInput}
                  onChange={e => setFailureReasonInput(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-mono focus:border-rose-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  onClick={() => setFailureModalTrial(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRecordFailureSubmit}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-mono text-xs font-bold cursor-pointer"
                >
                  Confirm Failure Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
