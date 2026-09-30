import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  QrCode,
  Calendar,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Download,
  FileText,
  Building,
  Image as ImageIcon,
  Video,
  Play,
  Check,
  Phone,
  Mail,
  Sparkles,
  Share2
} from 'lucide-react';

export const ExhibitionLandingPage: React.FC = () => {
  const { exhibitions, selectedExpoSlug, addPublicRFQLead, setActiveView, showNotification } = useApp();

  const activeExpo = exhibitions.find(e => e.qrSlug === selectedExpoSlug) || exhibitions[0];

  const [companyName, setCompanyName] = useState('L&T Heavy Engineering');
  const [contactName, setContactName] = useState('Ramesh Kulkarni');
  const [email, setEmail] = useState('r.kulkarni@lntecc.com');
  const [phone, setPhone] = useState('+91 98900 12345');
  const [selectedProduct, setSelectedProduct] = useState(activeExpo?.showcasedProducts?.[0] || 'ISO 15552 Pneumatic Cylinder');
  const [notes, setNotes] = useState(`Enquiry submitted via QR code scan at Booth ${activeExpo.boothNumber}, ${activeExpo.hallNumber}.`);
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [activeMediaTab, setActiveMediaTab] = useState<'photos' | 'videos'>('photos');
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  const handleExpoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const leadNumber = addPublicRFQLead({
      title: `Exhibition Lead (${activeExpo.title}) - ${companyName}`,
      companyName,
      contactPerson: contactName,
      email,
      phone,
      country: activeExpo.country,
      categoryName: 'Exhibition Product Suite',
      targetQuantity: 50,
      preferredResponse: 'WhatsApp',
      technicalNotes: `${notes} - Requested Product: ${selectedProduct}`,
    });
    setSubmitted(leadNumber);
  };

  const allPhotos = [activeExpo.bannerImage, ...(activeExpo.galleryImages || [])];

  return (
    <div className="py-12 bg-[#FAF9F6] min-h-screen text-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Breadcrumb / Top Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveView('public-exhibitions')}
            className="text-xs font-mono font-bold text-slate-600 hover:text-orange-600 flex items-center gap-1.5"
          >
            ← Back to All Exhibitions
          </button>

          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                showNotification('Booth QR Landing link copied to clipboard!', 'info');
              }
            }}
            className="text-xs font-mono font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-300 shadow-2xs"
          >
            <Share2 className="w-3.5 h-3.5 text-orange-600" /> Share Booth Page
          </button>
        </div>

        {/* Banner Card */}
        <div className="english-card p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-xl space-y-6">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
            <div className="space-y-1">
              <span className="tech-label flex items-center gap-1 text-orange-700">
                <QrCode className="w-3.5 h-3.5" /> LIVE BOOTH QR EXPERIENCE & CATALOG
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
                {activeExpo.title}
              </h1>
              {activeExpo.subtitle && (
                <p className="text-xs text-slate-600 font-medium italic">
                  {activeExpo.subtitle}
                </p>
              )}
            </div>

            <div className="px-3.5 py-1.5 rounded-xl bg-orange-50 text-orange-800 font-mono text-xs font-bold border border-orange-200 shrink-0 shadow-2xs">
              {activeExpo.hallNumber} • {activeExpo.boothNumber}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-mono font-bold text-slate-700">
            <span className="flex items-center gap-1.5 text-orange-700">
              <Calendar className="w-4 h-4 text-orange-600" /> {activeExpo.startDate} to {activeExpo.endDate}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-slate-500" /> {activeExpo.location}, {activeExpo.city}, {activeExpo.country}
            </span>
            <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full border border-slate-200">
              {activeExpo.status}
            </span>
          </div>

          {activeExpo.fullAddress && (
            <p className="text-xs font-mono text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-start gap-2">
              <Building className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
              <span><strong>Official Venue Ground Address:</strong> {activeExpo.fullAddress}</span>
            </p>
          )}

          <p className="text-sm text-slate-700 leading-relaxed font-medium">
            {activeExpo.description}
          </p>

          {/* Key Highlights */}
          {activeExpo.keyHighlights && activeExpo.keyHighlights.length > 0 && (
            <div className="p-4 rounded-xl bg-orange-50/60 border border-orange-200 space-y-2">
              <span className="text-xs font-mono font-bold text-slate-900 uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-orange-600" /> Live Machinery Demos at Our Booth:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                {activeExpo.keyHighlights.map((hl, i) => (
                  <div key={i} className="flex items-start gap-1.5 font-medium">
                    <Check className="w-3.5 h-3.5 text-orange-600 shrink-0 mt-0.5" />
                    <span>{hl}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Media Gallery Section */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveMediaTab('photos')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 ${
                    activeMediaTab === 'photos'
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" /> Booth Gallery ({allPhotos.length})
                </button>

                {activeExpo.videoUrls && activeExpo.videoUrls.length > 0 && (
                  <button
                    onClick={() => setActiveMediaTab('videos')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 ${
                      activeMediaTab === 'videos'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-200'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" /> Demo Videos ({activeExpo.videoUrls.length})
                  </button>
                )}
              </div>

              {activeExpo.brochurePdfUrl && (
                <a
                  href={activeExpo.brochurePdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 border-slate-300 hover:border-orange-500 bg-white"
                >
                  <Download className="w-3.5 h-3.5 text-orange-600" />
                  <span className="font-bold">Download Event Brochure</span>
                </a>
              )}
            </div>

            {/* Photos Viewer */}
            {activeMediaTab === 'photos' && (
              <div className="space-y-3">
                <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden border border-slate-300 bg-slate-900 shadow-md">
                  <img
                    src={allPhotos[activePhotoIdx] || allPhotos[0]}
                    alt="Booth Showcase"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-xs font-mono px-3 py-1 rounded">
                    Photo {activePhotoIdx + 1} of {allPhotos.length}
                  </span>
                </div>

                {/* Thumbnails */}
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {allPhotos.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePhotoIdx(idx)}
                      className={`relative rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                        activePhotoIdx === idx ? 'border-orange-600 ring-2 ring-orange-400' : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Thumb" className="w-20 h-14 object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Videos Viewer */}
            {activeMediaTab === 'videos' && activeExpo.videoUrls && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeExpo.videoUrls.map((vUrl, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs space-y-2">
                    <div className="relative rounded-lg overflow-hidden h-44 bg-slate-900 flex items-center justify-center">
                      <video
                        src={vUrl}
                        controls
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-slate-800">Demo Video #{idx + 1}</span>
                      <a
                        href={vUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1"
                      >
                        <Play className="w-3 h-3" /> Fullscreen
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Booth Quick Enquiry & Lead Capture Form */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
          <div className="space-y-1 border-b border-slate-200 pb-4">
            <h3 className="text-xl font-bold text-slate-900 font-heading">
              Quick Booth Enquiry & VIP Meeting Request
            </h3>
            <p className="text-xs text-slate-600 font-medium">
              Submitting this form automatically tags your lead in the Weldor CRM with source <strong>Expo: {activeExpo.title}</strong> and triggers an instant WhatsApp brochure.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="text-xl font-bold text-slate-900">Booth Lead Registered!</h4>
              <p className="text-xs text-slate-700 font-medium max-w-md mx-auto">
                Lead ID: <strong className="text-orange-700 font-mono font-bold">{submitted}</strong>. Our sales engineer on duty at Booth {activeExpo.boothNumber} has been notified and will attend to you shortly.
              </p>
              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  onClick={() => setActiveView('crm-leads')}
                  className="btn-primary text-xs justify-center shadow-md"
                >
                  View Lead inside Sales CRM Pipeline
                </button>
                <button
                  onClick={() => setSubmitted(null)}
                  className="btn-secondary text-xs px-4 py-2"
                >
                  Submit Another Enquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleExpoSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-slate-600 font-bold uppercase tracking-wider block mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium focus:border-orange-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-600 font-bold uppercase tracking-wider block mb-1">Contact Person *</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium focus:border-orange-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-600 font-bold uppercase tracking-wider block mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium focus:border-orange-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-600 font-bold uppercase tracking-wider block mb-1">Mobile / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium focus:border-orange-500 outline-none"
                  />
                </div>
              </div>

              {activeExpo.showcasedProducts && activeExpo.showcasedProducts.length > 0 && (
                <div>
                  <label className="text-xs font-mono text-slate-600 font-bold uppercase tracking-wider block mb-1">Interested Product Line</label>
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium focus:border-orange-500 outline-none"
                  >
                    {activeExpo.showcasedProducts.map((p, i) => (
                      <option key={i} value={p}>{p}</option>
                    ))}
                    <option value="Custom CAD Manufacturing RFQ">Custom CAD Manufacturing RFQ</option>
                  </select>
                </div>
              )}

              <div>
                <label className="text-xs font-mono text-slate-600 font-bold uppercase tracking-wider block mb-1">Product Requirement / Notes</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-3 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium focus:border-orange-500 outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end">
                <button
                  type="submit"
                  className="btn-primary text-xs py-3 px-6 shadow-md flex items-center gap-2"
                >
                  <span>Submit Booth Inquiry & Connect with Engineer</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
