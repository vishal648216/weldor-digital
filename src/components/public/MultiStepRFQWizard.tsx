import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileUp, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Building, 
  UploadCloud,
  Sparkles
} from 'lucide-react';
import { FileUploadZone, type UploadedFileMeta } from '../common/FileUploadZone';

export const MultiStepRFQWizard: React.FC = () => {
  const { categories, addPublicRFQLead, setActiveView } = useApp();

  const [step, setStep] = useState(1);
  const [submittedLeadId, setSubmittedLeadId] = useState<string | null>(null);

  // Form State
  const [requirementType, setRequirementType] = useState<'Standard Product' | 'Custom Engineering' | 'Drawing Revision' | 'Bulk Tender'>('Custom Engineering');
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.name || 'Pneumatic Components');
  const [quantity, setQuantity] = useState<number>(500);
  const [material, setMaterial] = useState<string>('Aerospace Grade AL 7075-T6');
  const [surfaceFinish, setSurfaceFinish] = useState<string>('Hard Anodized Black (Ra 0.4)');
  const [pressureRating, setPressureRating] = useState<string>('700 Bar Rated');
  
  // Real Uploaded CAD / PDF File
  const [drawingFile, setDrawingFile] = useState<UploadedFileMeta | null>(null);

  // Contact Details
  const [companyName, setCompanyName] = useState('Siemens Industrial Systems');
  const [contactPerson, setContactPerson] = useState('Alexander Vance');
  const [email, setEmail] = useState('a.vance@siemens.com');
  const [phone, setPhone] = useState('+44 20 7946 0912');
  const [country, setCountry] = useState('United Kingdom');
  const [preferredResponse, setPreferredResponse] = useState<'Email' | 'Phone' | 'WhatsApp'>('Email');
  const [technicalNotes, setTechnicalNotes] = useState('Requires 100% CMM dimensional inspection report and 1000-hour salt spray certification.');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const leadNumber = addPublicRFQLead({
      title: `${requirementType}: ${companyName} Component Order`,
      companyName,
      contactPerson,
      email,
      phone,
      country,
      categoryName: selectedCategory,
      targetQuantity: quantity,
      materialPreference: material,
      surfaceFinish,
      pressureRating,
      drawingFileName: drawingFile ? drawingFile.name : undefined,
      cadFileUrl: drawingFile ? drawingFile.url : undefined,
      preferredResponse,
      technicalNotes,
    });
    setSubmittedLeadId(leadNumber);
  };

  if (submittedLeadId) {
    return (
      <div className="py-20 bg-[#FAF9F6] min-h-screen flex items-center justify-center p-4">
        <div className="english-card p-8 sm:p-12 rounded-2xl max-w-2xl w-full text-center space-y-6 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-300">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="tech-label">B2B RFQ Lead Engine Generated</span>
            <h2 className="text-3xl font-extrabold text-slate-900 font-heading">
              RFQ Submitted Successfully!
            </h2>
            <p className="text-sm text-slate-700 font-medium">
              Your unique enquiry reference lead ID is:
            </p>
            <div className="py-3 bg-slate-50 rounded-lg border border-slate-300 font-mono text-xl font-bold text-orange-700">
              {submittedLeadId}
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Our Sales Manager has received your CAD drawing with a <strong>2-hour SLA deadline</strong>. You will receive an official quotation and engineering feedback via <strong>{email}</strong>.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setActiveView('crm-leads')}
              className="btn-primary text-xs shadow-md"
            >
              Track Lead in CRM Sales Dashboard <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setSubmittedLeadId(null);
                setStep(1);
              }}
              className="btn-secondary text-xs"
            >
              Submit Another RFQ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-[#FAF9F6] min-h-screen text-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Wizard Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 border border-orange-300 text-orange-800 text-xs font-mono font-bold">
            <Sparkles className="w-4 h-4 text-orange-600" /> B2B MULTI-STEP RFQ ENGINE
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-heading">
            Request B2B Quote / Upload CAD Drawing
          </h1>
          <p className="text-sm text-slate-700 max-w-xl mx-auto font-medium">
            Specify technical parameters, target volume, and upload CAD files for instant routing into the Weldor CRM Sales Pipeline.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between text-xs font-mono font-bold">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-orange-700 font-bold' : 'text-slate-500'}`}>
            <span className="w-6 h-6 rounded-full bg-slate-100 border border-current flex items-center justify-center text-[11px]">1</span>
            <span className="hidden sm:inline">Requirement</span>
          </div>
          <div className="w-8 h-0.5 bg-slate-200" />
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-orange-700 font-bold' : 'text-slate-500'}`}>
            <span className="w-6 h-6 rounded-full bg-slate-100 border border-current flex items-center justify-center text-[11px]">2</span>
            <span className="hidden sm:inline">Specs & CAD</span>
          </div>
          <div className="w-8 h-0.5 bg-slate-200" />
          <div className={`flex items-center gap-2 ${step >= 3 ? 'text-orange-700 font-bold' : 'text-slate-500'}`}>
            <span className="w-6 h-6 rounded-full bg-slate-100 border border-current flex items-center justify-center text-[11px]">3</span>
            <span className="hidden sm:inline">Company Info</span>
          </div>
        </div>

        {/* Wizard Form Card */}
        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 space-y-8 shadow-xl">
          
          {/* STEP 1: Requirement & Volume */}
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2 border-b border-slate-200 pb-3">
                <FileUp className="w-5 h-5 text-orange-600" /> Step 1: Select Requirement Type & Division
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: 'Custom Engineering / CAD Drawing', desc: 'Manufacture to customer blueprint drawing', type: 'Custom Engineering' },
                  { title: 'Standard Catalogue Product', desc: 'Order standard SKU component lines', type: 'Standard Product' },
                  { title: 'Drawing Revision / Engineering Mod', desc: 'Modify standard component parameters', type: 'Drawing Revision' },
                  { title: 'Bulk Tender / Annual Supply Contract', desc: 'High-volume annual OEM pricing', type: 'Bulk Tender' },
                ].map((req, i) => (
                  <div
                    key={i}
                    onClick={() => setRequirementType(req.type as any)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      requirementType === req.type
                        ? 'bg-orange-50 border-orange-500 text-slate-900 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <p className="font-bold text-sm font-heading">{req.title}</p>
                    <p className="text-xs text-slate-600 mt-1 font-medium">{req.desc}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div>
                  <label className="text-xs font-mono text-slate-500 font-bold uppercase tracking-wider block mb-2">Product Division</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-orange-600 font-semibold"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-500 font-bold uppercase tracking-wider block mb-2">Target Expected Quantity (PCS)</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-orange-600 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="btn-primary text-xs px-6 py-3 shadow-md"
                >
                  Next: Technical Specs & Drawing <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Specs & CAD Upload */}
          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2 border-b border-slate-200 pb-3">
                <UploadCloud className="w-5 h-5 text-orange-600" /> Step 2: Technical Specifications & CAD Upload
              </h3>

              <FileUploadZone
                label="Engineering Blueprint Document / 3D CAD Drawing"
                value={drawingFile}
                onChange={setDrawingFile}
                helperText="Attach 2D PDF technical drawing, 3D STEP / DWG / DXF models, or ZIP archive (Max 50MB)"
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-mono text-slate-500 font-bold uppercase tracking-wider block mb-1">Material Spec</label>
                  <input
                    type="text"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-500 font-bold uppercase tracking-wider block mb-1">Surface Finish</label>
                  <input
                    type="text"
                    value={surfaceFinish}
                    onChange={(e) => setSurfaceFinish(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-500 font-bold uppercase tracking-wider block mb-1">Pressure Rating</label>
                  <input
                    type="text"
                    value={pressureRating}
                    onChange={(e) => setPressureRating(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-500 font-bold uppercase tracking-wider block mb-1">Technical Instructions / Testing Criteria</label>
                <textarea
                  rows={3}
                  value={technicalNotes}
                  onChange={(e) => setTechnicalNotes(e.target.value)}
                  className="w-full p-3 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-orange-600 font-sans font-medium"
                />
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn-secondary text-xs"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>

                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="btn-primary text-xs px-6 py-3 shadow-md"
                >
                  Next: Company & Contact <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Company & Contact Details */}
          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2 border-b border-slate-200 pb-3">
                <Building className="w-5 h-5 text-orange-600" /> Step 3: Company Details & Direct Push to CRM
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-mono text-slate-500 font-bold uppercase tracking-wider block mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-sm text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-500 font-bold uppercase tracking-wider block mb-1">Contact Person Name *</label>
                  <input
                    type="text"
                    required
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-sm text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-500 font-bold uppercase tracking-wider block mb-1">Corporate Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-sm text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-500 font-bold uppercase tracking-wider block mb-1">Phone Number (with Country Code) *</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-sm text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-500 font-bold uppercase tracking-wider block mb-1">Country *</label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-sm text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-500 font-bold uppercase tracking-wider block mb-1">Preferred Response Method</label>
                  <select
                    value={preferredResponse}
                    onChange={(e) => setPreferredResponse(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-sm text-slate-900 font-semibold"
                  >
                    <option value="Email">Email Official Quotation PDF</option>
                    <option value="Phone">Direct Sales Phone Call</option>
                    <option value="WhatsApp">WhatsApp Technical Response</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="btn-secondary text-xs"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>

                <button
                  type="submit"
                  className="btn-primary text-sm px-8 py-3.5 shadow-md"
                >
                  Submit RFQ & Generate Lead ID <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </form>

      </div>
    </div>
  );
};
