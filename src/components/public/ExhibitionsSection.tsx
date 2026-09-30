import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  MapPin,
  QrCode,
  ArrowRight,
  Building2,
  CheckCircle2,
  X,
  Sparkles,
  Clock,
  ShieldCheck,
  Image as ImageIcon,
  Video,
  FileText,
  Play,
  Check,
  Download,
  Phone,
  Mail,
  User,
  Building
} from 'lucide-react';
import { Exhibition } from '../../types';

export const ExhibitionsSection: React.FC = () => {
  const { exhibitions, setActiveView, setSelectedExpoSlug, addPublicRFQLead } = useApp();
  const [filter, setFilter] = useState<'All' | 'Upcoming' | 'Past'>('All');
  const [selectedExpoModal, setSelectedExpoModal] = useState<Exhibition | null>(null);
  const [activeMediaTab, setActiveMediaTab] = useState<'photos' | 'videos'>('photos');
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);

  // VIP Booth Meeting Form State inside Modal
  const [companyName, setCompanyName] = useState('Tata Motors');
  const [contactName, setContactName] = useState('Rajesh Sharma');
  const [email, setEmail] = useState('rajesh.sharma@tatamotors.com');
  const [phone, setPhone] = useState('+91 98230 44556');
  const [meetingDate, setMeetingDate] = useState('Day 2 (11:00 AM Slot)');
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  // Helper function to calculate dynamic / effective status based on end date
  const getExpoEffectiveStatus = (expo: Exhibition): {
    status: 'Upcoming' | 'Live' | 'Past Exhibition';
    isAutoArchived: boolean;
    label: string;
    badgeClass: string;
  } => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(expo.startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(expo.endDate);
    end.setHours(23, 59, 59, 999);

    const isDatePassed = today > end;
    const isLiveToday = today >= start && today <= end;

    if (isLiveToday) {
      return {
        status: 'Live',
        isAutoArchived: false,
        label: 'Live Now (Booth Active)',
        badgeClass: 'bg-emerald-600 text-white animate-pulse',
      };
    }

    if (isDatePassed && expo.autoArchivePassedDate !== false) {
      return {
        status: 'Past Exhibition',
        isAutoArchived: expo.status === 'Upcoming',
        label: 'Past Exhibition',
        badgeClass: 'bg-slate-700 text-slate-200',
      };
    }

    if (expo.status === 'Past Exhibition') {
      return {
        status: 'Past Exhibition',
        isAutoArchived: false,
        label: 'Past Exhibition',
        badgeClass: 'bg-slate-700 text-slate-200',
      };
    }

    return {
      status: 'Upcoming',
      isAutoArchived: false,
      label: 'Upcoming Trade Fair',
      badgeClass: 'bg-orange-600 text-white',
    };
  };

  const processedExhibitions = useMemo(() => {
    return (exhibitions || []).filter(Boolean).map(expo => ({
      ...expo,
      meta: getExpoEffectiveStatus(expo),
    }));
  }, [exhibitions]);

  const filteredExhibitions = useMemo(() => {
    return processedExhibitions.filter(e => {
      if (!e || !e.meta) return false;
      if (filter === 'All') return true;
      if (filter === 'Upcoming') return e.meta.status === 'Upcoming' || e.meta.status === 'Live';
      if (filter === 'Past') return e.meta.status === 'Past Exhibition';
      return true;
    });
  }, [processedExhibitions, filter]);

  const handleVIPBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExpoModal) return;
    const leadNumber = addPublicRFQLead({
      title: `VIP Booth Slot (${selectedExpoModal.title}): ${companyName}`,
      companyName,
      contactPerson: contactName,
      email,
      phone,
      country: selectedExpoModal.country,
      categoryName: 'Exhibition VIP Meeting',
      targetQuantity: 100,
      preferredResponse: 'WhatsApp',
      technicalNotes: `VIP Meeting Slot requested for ${meetingDate} at ${selectedExpoModal.hallNumber}, ${selectedExpoModal.boothNumber}. Physical venue: ${selectedExpoModal.location}, ${selectedExpoModal.city}.`,
    });
    setBookingSuccess(leadNumber);
  };

  const handleOpenModal = (expo: Exhibition) => {
    setSelectedExpoModal(expo);
    setActivePhotoIdx(0);
    setActiveMediaTab('photos');
    setBookingSuccess(null);
  };

  return (
    <div className="py-12 bg-[#FAF9F6] min-h-screen text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-6">
          <div>
            <span className="tech-label">Global Trade Fairs & Technical Conventions</span>
            <h1 className="text-4xl font-extrabold font-heading text-slate-900 mt-2">
              International Exhibitions & Trade Shows
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl font-medium">
              Explore upcoming international trade expos, view booth photos and live video demonstrations,
              download event brochures, and reserve 1-on-1 technical consultation slots with our engineering directors.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center bg-white border border-slate-300 rounded-xl p-1.5 font-mono text-xs shadow-xs self-start md:self-auto shrink-0">
            <button
              onClick={() => setFilter('All')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'All' ? 'bg-slate-900 text-white font-bold shadow-xs' : 'text-slate-700 hover:text-slate-900 font-semibold'
              }`}
            >
              All Events ({exhibitions.length})
            </button>
            <button
              onClick={() => setFilter('Upcoming')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'Upcoming' ? 'bg-orange-600 text-white font-bold shadow-xs' : 'text-slate-700 hover:text-slate-900 font-semibold'
              }`}
            >
              Upcoming ({processedExhibitions.filter(e => e.meta.status !== 'Past Exhibition').length})
            </button>
            <button
              onClick={() => setFilter('Past')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'Past' ? 'bg-orange-600 text-white font-bold shadow-xs' : 'text-slate-700 hover:text-slate-900 font-semibold'
              }`}
            >
              Past Exhibitions ({processedExhibitions.filter(e => e.meta.status === 'Past Exhibition').length})
            </button>
          </div>
        </div>

        {/* Exhibitions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredExhibitions.map((expo) => (
            <div 
              key={expo.id}
              onClick={() => handleOpenModal(expo)}
              className="english-card rounded-2xl overflow-hidden cursor-pointer group flex flex-col justify-between hover:border-orange-400 hover:shadow-xl transition-all duration-300"
            >
              <div>
                {/* Poster Header */}
                <div className="relative h-64 bg-slate-900 overflow-hidden">
                  <img 
                    src={expo.bannerImage} 
                    alt={expo.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  <div className="absolute top-3 left-3 bg-white/95 text-orange-700 backdrop-blur px-3 py-1 rounded-md text-xs font-mono font-bold border border-orange-200 shadow-sm">
                    {expo.hallNumber} • {expo.boothNumber}
                  </div>

                  <div className={`absolute top-3 right-3 backdrop-blur px-3 py-1 rounded-md text-xs font-mono font-bold shadow-sm ${expo.meta.badgeClass}`}>
                    {expo.meta.label}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white font-mono text-xs">
                    <span className="flex items-center gap-1.5 bg-black/60 backdrop-blur px-2.5 py-1 rounded">
                      <ImageIcon className="w-3.5 h-3.5 text-orange-400" />
                      {(expo.galleryImages?.length || 0) + 1} Photos
                    </span>
                    {expo.videoUrls && expo.videoUrls.length > 0 && (
                      <span className="flex items-center gap-1.5 bg-rose-950/80 backdrop-blur px-2.5 py-1 rounded text-rose-200 border border-rose-800">
                        <Video className="w-3.5 h-3.5 text-rose-400" />
                        {expo.videoUrls.length} Live Demos
                      </span>
                    )}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-4 text-xs font-mono text-slate-600 font-semibold">
                    <span className="flex items-center gap-1.5 text-orange-700 font-bold">
                      <Calendar className="w-4 h-4 text-orange-600" /> {expo.startDate} to {expo.endDate}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-slate-500" /> {expo.location}, {expo.city}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold font-heading text-slate-900 group-hover:text-orange-600 transition-colors">
                      {expo.title}
                    </h3>
                    {expo.subtitle && (
                      <p className="text-xs text-slate-500 italic mt-0.5 font-medium">
                        {expo.subtitle}
                      </p>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-2">
                    {expo.description}
                  </p>

                  {/* Highlights preview */}
                  {expo.keyHighlights && expo.keyHighlights.length > 0 && (
                    <div className="space-y-1 pt-1 border-t border-slate-100">
                      {(Array.isArray(expo.keyHighlights) ? expo.keyHighlights : []).slice(0, 2).map((hl, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-700 font-medium">
                          <Check className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                          <span className="truncate">{hl}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-6 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedExpoSlug(expo.qrSlug);
                    setActiveView('public-expo-landing');
                  }}
                  className="text-xs font-bold text-orange-700 hover:text-orange-800 flex items-center gap-1.5 font-mono"
                >
                  <QrCode className="w-4 h-4 text-orange-600" /> Scan Booth QR Link
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenModal(expo);
                  }}
                  className="btn-primary text-xs px-4 py-2 shadow-sm flex items-center gap-1.5"
                >
                  <span>Booth Details & Media</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Exhibition Full Detail Modal (Multi-Photo, Videos, Address & VIP Slot) */}
      {selectedExpoModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-300 rounded-3xl max-w-5xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-slate-900 max-h-[92vh] overflow-y-auto">
            
            <button 
              onClick={() => {
                setSelectedExpoModal(null);
                setBookingSuccess(null);
              }}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-3 border-b border-slate-200 pb-4 pr-10">
              <div className="flex flex-wrap items-center gap-2">
                <span className="tech-label">EXHIBITION BOOTH SPECIFICATIONS</span>
                <span className="tech-badge bg-orange-50 border-orange-200 text-orange-800 font-bold">
                  {selectedExpoModal.hallNumber} • {selectedExpoModal.boothNumber}
                </span>
                <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full border border-slate-200">
                  {selectedExpoModal.status}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
                {selectedExpoModal.title}
              </h2>

              {selectedExpoModal.subtitle && (
                <p className="text-sm text-slate-600 font-medium italic">
                  {selectedExpoModal.subtitle}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-700 font-semibold">
                <span className="flex items-center gap-1.5 text-orange-700 font-bold">
                  <Calendar className="w-4 h-4 text-orange-600" /> {selectedExpoModal.startDate} to {selectedExpoModal.endDate}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-500" /> {selectedExpoModal.location}, {selectedExpoModal.city}, {selectedExpoModal.country}
                </span>
              </div>

              {selectedExpoModal.fullAddress && (
                <p className="text-xs text-slate-600 font-mono bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-start gap-2">
                  <Building className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                  <span><strong>Full Venue Address:</strong> {selectedExpoModal.fullAddress}</span>
                </p>
              )}
            </div>

            {/* Media Gallery Section */}
            <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
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
                    <ImageIcon className="w-3.5 h-3.5" /> Photo Gallery ({(selectedExpoModal.galleryImages?.length || 0) + 1})
                  </button>

                  {selectedExpoModal.videoUrls && selectedExpoModal.videoUrls.length > 0 && (
                    <button
                      onClick={() => setActiveMediaTab('videos')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 ${
                        activeMediaTab === 'videos'
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-200'
                      }`}
                    >
                      <Video className="w-3.5 h-3.5" /> Live Demonstration Videos ({selectedExpoModal.videoUrls.length})
                    </button>
                  )}
                </div>

                {selectedExpoModal.brochurePdfUrl && (
                  <a
                    href={selectedExpoModal.brochurePdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1 font-mono"
                  >
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>Download Brochure (PDF)</span>
                  </a>
                )}
              </div>

              {/* Photos Gallery Viewer */}
              {activeMediaTab === 'photos' && (
                <div className="space-y-3">
                  {(() => {
                    const allPhotos = [selectedExpoModal.bannerImage, ...(selectedExpoModal.galleryImages || [])];
                    const currentImg = allPhotos[activePhotoIdx] || allPhotos[0];
                    return (
                      <>
                        <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden border border-slate-300 bg-slate-900 shadow-md">
                          <img
                            src={currentImg}
                            alt="Selected View"
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-xs font-mono px-3 py-1 rounded">
                            Photo {activePhotoIdx + 1} of {allPhotos.length}
                          </span>
                        </div>

                        {/* Thumbnail Strip */}
                        <div className="flex gap-2 overflow-x-auto pb-1">
                          {allPhotos.map((photo, idx) => (
                            <button
                              key={idx}
                              onClick={() => setActivePhotoIdx(idx)}
                              className={`relative rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                                activePhotoIdx === idx ? 'border-orange-600 ring-2 ring-orange-400' : 'border-slate-200 opacity-70 hover:opacity-100'
                              }`}
                            >
                              <img src={photo} alt="Thumb" className="w-20 h-14 object-cover" />
                            </button>
                          ))}
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}

              {/* Videos Section */}
              {activeMediaTab === 'videos' && selectedExpoModal.videoUrls && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedExpoModal.videoUrls.map((videoUrl, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs space-y-2">
                      <div className="relative rounded-lg overflow-hidden h-44 bg-slate-900 flex items-center justify-center">
                        <video
                          src={videoUrl}
                          controls
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="font-bold text-slate-800">Demo Video #{idx + 1}</span>
                        <a
                          href={videoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1"
                        >
                          <Play className="w-3 h-3" /> Open in New Tab
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Event Description & Live Schedule + VIP Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-4">
                <h4 className="font-heading font-bold text-slate-900 text-base">Trade Show Focus & Machinery Demos</h4>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {selectedExpoModal.description}
                </p>

                {/* Key Highlights */}
                {selectedExpoModal.keyHighlights && selectedExpoModal.keyHighlights.length > 0 && (
                  <div className="p-4 rounded-xl bg-orange-50/50 border border-orange-200 space-y-2 text-xs">
                    <p className="font-mono font-bold text-slate-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-orange-600" /> Featured Booth Demonstrations:
                    </p>
                    <ul className="space-y-1.5 text-slate-700 font-medium">
                      {selectedExpoModal.keyHighlights.map((hl, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-orange-600 shrink-0 mt-0.5" />
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Showcased Product Lines */}
                {selectedExpoModal.showcasedProducts && selectedExpoModal.showcasedProducts.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-xs font-mono font-bold text-slate-600 uppercase">Product Lines on Display:</h5>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedExpoModal.showcasedProducts.map((prod, i) => (
                        <span key={i} className="bg-slate-100 text-slate-800 text-xs px-2.5 py-1 rounded-md border border-slate-200 font-medium">
                          {prod}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* VIP Meeting Booking Form */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h4 className="font-heading font-bold text-slate-900 text-base">Book 1-on-1 Executive Meeting</h4>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                    Reserve a private discussion slot at Booth {selectedExpoModal.boothNumber} with Weldor engineering leadership.
                  </p>
                </div>
                
                {bookingSuccess ? (
                  <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-300 text-center space-y-2.5">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                    <p className="text-sm font-bold text-slate-900">VIP Meeting Slot Confirmed!</p>
                    <p className="text-xs text-slate-700 font-medium">
                      Ref Lead ID: <strong className="font-mono text-orange-700">{bookingSuccess}</strong>
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Our regional trade coordinator will send calendar invitations and booth access badges via WhatsApp / Email.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleVIPBooking} className="space-y-3 text-xs">
                    <div>
                      <label className="font-mono font-bold text-slate-700 block mb-1">Company Name *</label>
                      <input 
                        type="text" 
                        required 
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 font-medium text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="font-mono font-bold text-slate-700 block mb-1">Contact Person *</label>
                      <input 
                        type="text" 
                        required 
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 font-medium text-slate-900"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="font-mono font-bold text-slate-700 block mb-1">Email *</label>
                        <input 
                          type="email" 
                          required 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 font-medium text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="font-mono font-bold text-slate-700 block mb-1">Mobile / WhatsApp *</label>
                        <input 
                          type="text" 
                          required 
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 font-medium text-slate-900"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="font-mono font-bold text-slate-700 block mb-1">Preferred Time Slot</label>
                      <select 
                        value={meetingDate}
                        onChange={(e) => setMeetingDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 font-semibold text-slate-900"
                      >
                        <option value="Day 1 (11:00 AM Slot)">Day 1 (11:00 AM Slot)</option>
                        <option value="Day 2 (11:00 AM Slot)">Day 2 (11:00 AM Slot)</option>
                        <option value="Day 2 (03:00 PM Slot)">Day 2 (03:00 PM Slot)</option>
                        <option value="Day 3 (12:00 PM Slot)">Day 3 (12:00 PM Slot)</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full btn-primary text-xs justify-center py-2.5 shadow-md mt-2"
                    >
                      Reserve Executive Meeting Slot
                    </button>
                  </form>
                )}

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
