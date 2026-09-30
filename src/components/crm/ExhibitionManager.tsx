import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  QrCode,
  Calendar,
  MapPin,
  Plus,
  ExternalLink,
  ArrowRight,
  Video,
  Image as ImageIcon,
  Users,
  X,
  Edit3,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
  FileText,
  UploadCloud,
  Play,
  Eye,
  Info,
  Layers,
  Search,
  Check,
  Building,
  AlertTriangle,
  Download
} from 'lucide-react';
import type { Exhibition } from '../../types';

export const ExhibitionManager: React.FC = () => {
  const {
    exhibitions,
    addExhibition,
    updateExhibition,
    deleteExhibition,
    setSelectedExpoSlug,
    setActiveView,
    showNotification,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'All' | 'Upcoming' | 'Past Exhibition'>('Upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpoId, setEditingExpoId] = useState<string | null>(null);
  const [modalActiveTab, setModalActiveTab] = useState<'basic' | 'venue' | 'gallery' | 'videos' | 'highlights'>('basic');
  const [previewExpo, setPreviewExpo] = useState<Exhibition | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const initialFormState = {
    title: '',
    subtitle: '',
    location: '',
    fullAddress: '',
    city: '',
    country: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    hallNumber: 'Hall 1',
    boothNumber: 'Booth A-01',
    description: '',
    keyHighlights: ['Live 700 Bar Hydrostatic Valve Burst Test', '5-Axis CNC Precision Manifold Showcase'],
    bannerImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200',
    galleryImages: [
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=800',
    ],
    videoUrls: [
      'https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-lathe-machine-in-a-factory-43187-large.mp4',
    ],
    brochurePdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    showcasedCategoryIds: ['cat-pneumatic', 'cat-hydraulic', 'cat-welding'],
    showcasedProducts: ['ISO 15552 Pneumatic Cylinder', '700 Bar Proportional Valve'],
    qrSlug: '',
    featured: true,
    status: 'Upcoming' as Exhibition['status'],
    autoArchivePassedDate: true,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [newHighlightInput, setNewHighlightInput] = useState('');
  const [newGalleryInput, setNewGalleryInput] = useState('');
  const [newVideoInput, setNewVideoInput] = useState('');
  const [newProductInput, setNewProductInput] = useState('');

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
        label: 'Live Now (Active Booth)',
        badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300 animate-pulse',
      };
    }

    if (isDatePassed && expo.autoArchivePassedDate !== false) {
      return {
        status: 'Past Exhibition',
        isAutoArchived: expo.status === 'Upcoming',
        label: expo.status === 'Upcoming' ? 'Auto-Archived (Date Expired)' : 'Past Exhibition',
        badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
      };
    }

    if (expo.status === 'Past Exhibition') {
      return {
        status: 'Past Exhibition',
        isAutoArchived: false,
        label: 'Past Exhibition',
        badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
      };
    }

    return {
      status: 'Upcoming',
      isAutoArchived: false,
      label: 'Upcoming Trade Fair',
      badgeClass: 'bg-orange-100 text-orange-800 border-orange-300',
    };
  };

  // Filtered exhibitions
  const processedExhibitions = useMemo(() => {
    return exhibitions.map(expo => ({
      ...expo,
      meta: getExpoEffectiveStatus(expo),
    }));
  }, [exhibitions]);

  const filteredExhibitions = useMemo(() => {
    return processedExhibitions.filter(expo => {
      const matchesSearch =
        expo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expo.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expo.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expo.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expo.boothNumber.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (activeTab === 'All') return true;
      if (activeTab === 'Upcoming') return expo.meta.status === 'Upcoming' || expo.meta.status === 'Live';
      if (activeTab === 'Past Exhibition') return expo.meta.status === 'Past Exhibition';
      return true;
    });
  }, [processedExhibitions, activeTab, searchQuery]);

  // Open modal for Create
  const handleOpenCreateModal = () => {
    setEditingExpoId(null);
    setFormData(initialFormState);
    setModalActiveTab('basic');
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEditModal = (expo: Exhibition) => {
    setEditingExpoId(expo.id);
    setFormData({
      title: expo.title,
      subtitle: expo.subtitle || '',
      location: expo.location,
      fullAddress: expo.fullAddress || '',
      city: expo.city,
      country: expo.country,
      startDate: expo.startDate,
      endDate: expo.endDate,
      hallNumber: expo.hallNumber,
      boothNumber: expo.boothNumber,
      description: expo.description,
      keyHighlights: expo.keyHighlights || [],
      bannerImage: expo.bannerImage,
      galleryImages: expo.galleryImages || [],
      videoUrls: expo.videoUrls || [],
      brochurePdfUrl: expo.brochurePdfUrl || '',
      showcasedCategoryIds: expo.showcasedCategoryIds || [],
      showcasedProducts: expo.showcasedProducts || [],
      qrSlug: expo.qrSlug,
      featured: expo.featured,
      status: expo.status,
      autoArchivePassedDate: expo.autoArchivePassedDate ?? true,
    });
    setModalActiveTab('basic');
    setIsModalOpen(true);
  };

  // Submit Handler
  const handleSaveExpoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showNotification('Exhibition Title is required!', 'warning');
      return;
    }

    const qrSlug =
      formData.qrSlug.trim() ||
      formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const expoPayload: Omit<Exhibition, 'id'> = {
      title: formData.title.trim(),
      subtitle: formData.subtitle.trim(),
      location: formData.location.trim() || 'International Convention Center',
      fullAddress: formData.fullAddress.trim(),
      city: formData.city.trim() || 'Mumbai',
      country: formData.country.trim() || 'India',
      startDate: formData.startDate,
      endDate: formData.endDate,
      hallNumber: formData.hallNumber.trim() || 'Hall 1',
      boothNumber: formData.boothNumber.trim() || 'Booth A-01',
      description: formData.description.trim() || 'Weldor Industries live machining and high-pressure fluid technology booth.',
      keyHighlights: formData.keyHighlights.filter(h => h.trim() !== ''),
      bannerImage: formData.bannerImage.trim() || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200',
      galleryImages: formData.galleryImages.filter(img => img.trim() !== ''),
      videoUrls: formData.videoUrls.filter(v => v.trim() !== ''),
      brochurePdfUrl: formData.brochurePdfUrl.trim(),
      showcasedCategoryIds: formData.showcasedCategoryIds,
      showcasedProducts: formData.showcasedProducts.filter(p => p.trim() !== ''),
      qrSlug,
      leadsCapturedCount: editingExpoId ? (exhibitions.find(e => e.id === editingExpoId)?.leadsCapturedCount || 0) : 0,
      featured: formData.featured,
      status: formData.status,
      autoArchivePassedDate: formData.autoArchivePassedDate,
    };

    if (editingExpoId) {
      updateExhibition(editingExpoId, expoPayload);
    } else {
      addExhibition(expoPayload);
    }

    setIsModalOpen(false);
  };

  // Add Item to arrays
  const handleAddHighlight = () => {
    if (!newHighlightInput.trim()) return;
    setFormData(prev => ({
      ...prev,
      keyHighlights: [...prev.keyHighlights, newHighlightInput.trim()],
    }));
    setNewHighlightInput('');
  };

  const handleRemoveHighlight = (index: number) => {
    setFormData(prev => ({
      ...prev,
      keyHighlights: prev.keyHighlights.filter((_, i) => i !== index),
    }));
  };

  const handleAddGalleryImage = (urlToAdd?: string) => {
    const url = urlToAdd || newGalleryInput.trim();
    if (!url) return;
    setFormData(prev => ({
      ...prev,
      galleryImages: [...prev.galleryImages, url],
    }));
    setNewGalleryInput('');
  };

  const handleRemoveGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index),
    }));
  };

  const handleAddVideo = () => {
    if (!newVideoInput.trim()) return;
    setFormData(prev => ({
      ...prev,
      videoUrls: [...prev.videoUrls, newVideoInput.trim()],
    }));
    setNewVideoInput('');
  };

  const handleRemoveVideo = (index: number) => {
    setFormData(prev => ({
      ...prev,
      videoUrls: prev.videoUrls.filter((_, i) => i !== index),
    }));
  };

  const handleAddProduct = () => {
    if (!newProductInput.trim()) return;
    setFormData(prev => ({
      ...prev,
      showcasedProducts: [...(prev.showcasedProducts || []), newProductInput.trim()],
    }));
    setNewProductInput('');
  };

  const handleRemoveProduct = (index: number) => {
    setFormData(prev => ({
      ...prev,
      showcasedProducts: (prev.showcasedProducts || []).filter((_, i) => i !== index),
    }));
  };

  // Preset Sample Images for Quick Fill
  const samplePresets = [
    { label: 'Exhibition Hall', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200' },
    { label: 'Hannover Expo', url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1200' },
    { label: 'Machining Booth', url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800' },
    { label: 'Hydraulic Rig', url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=800' },
    { label: 'Industrial Robotics', url: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800' },
    { label: 'Delegate Summit', url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=800' },
  ];

  return (
    <div className="p-6 space-y-6 text-slate-900">
      
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-5 bg-white p-6 rounded-2xl shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-orange-600 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full uppercase">
              Trade Fair & Expo Studio CMS
            </span>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Auto-Transition Engine Active
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-heading mt-2">
            Exhibitions, Trade Expos & QR Lead Engine
          </h1>
          <p className="text-xs text-slate-600 font-medium mt-1 max-w-3xl">
            Configure exhibition dates, venue locations, multiple photo galleries, video demonstrations, and downloadable brochures.
            Expos automatically shift to previous archive status when their end date expires.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveView('public-exhibitions')}
            className="btn-secondary text-xs py-2.5 px-4 flex items-center gap-2 border-slate-300 hover:border-orange-500 bg-white"
          >
            <Eye className="w-4 h-4 text-orange-600" />
            <span>View Public Expos</span>
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="btn-primary text-xs py-2.5 px-5 shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Exhibition Event
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        
        {/* Tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('All')}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === 'All'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Events ({exhibitions.length})
          </button>
          <button
            onClick={() => setActiveTab('Upcoming')}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === 'Upcoming'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Upcoming & Live Expos ({processedExhibitions.filter(e => e.meta.status !== 'Past Exhibition').length})
          </button>
          <button
            onClick={() => setActiveTab('Past Exhibition')}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === 'Past Exhibition'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Previous Expos & Archive ({processedExhibitions.filter(e => e.meta.status === 'Past Exhibition').length})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search expo, booth, city, country..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 outline-none focus:border-orange-500 focus:bg-white"
          />
        </div>

      </div>

      {/* Exhibitions Grid */}
      <div className="space-y-6">
        {filteredExhibitions.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No Exhibitions Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              No exhibition events match your current filter or search criteria. Click "Add Exhibition Event" to register a new trade show.
            </p>
            <button
              onClick={handleOpenCreateModal}
              className="btn-primary text-xs mx-auto mt-2"
            >
              <Plus className="w-4 h-4" /> Create Exhibition Event
            </button>
          </div>
        ) : (
          filteredExhibitions.map(expo => (
            <div
              key={expo.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-xs overflow-hidden transition-all duration-200"
            >
              {/* Card Header & Media Banner */}
              <div className="p-6 space-y-4">
                
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div className="flex items-start gap-4">
                    <div className="relative group shrink-0">
                      <img
                        src={expo.bannerImage}
                        alt={expo.title}
                        className="w-28 h-24 rounded-xl object-cover border border-slate-200 bg-slate-100 shadow-xs"
                      />
                      <span className="absolute bottom-1 right-1 bg-slate-900/80 backdrop-blur-xs text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                        {(expo.galleryImages?.length || 0) + 1} Photos
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-orange-700 bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded uppercase">
                          {expo.hallNumber} • {expo.boothNumber}
                        </span>
                        
                        <span className={`text-[10px] font-mono font-bold border px-2.5 py-0.5 rounded-full ${expo.meta.badgeClass}`}>
                          {expo.meta.label}
                        </span>

                        {expo.autoArchivePassedDate !== false && (
                          <span className="text-[10px] font-mono font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            Auto-Archive: ON
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 font-heading">
                        {expo.title}
                      </h3>

                      {expo.subtitle && (
                        <p className="text-xs text-slate-600 font-medium italic">
                          {expo.subtitle}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 font-mono mt-1">
                        <span className="flex items-center gap-1 font-bold text-orange-700">
                          <Calendar className="w-3.5 h-3.5 text-orange-600" /> {expo.startDate} to {expo.endDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" /> {expo.location}, {expo.city}, {expo.country}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Lead Badge */}
                  <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between w-full lg:w-auto gap-3 shrink-0">
                    <div className="text-right">
                      <span className="text-xs font-mono font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-2xs">
                        <Users className="w-4 h-4 text-emerald-600" /> {expo.leadsCapturedCount} Visitor Leads
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPreviewExpo(expo)}
                        className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
                        title="Quick Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleOpenEditModal(expo)}
                        className="p-2 rounded-lg text-blue-600 hover:text-blue-800 hover:bg-blue-50 border border-blue-200 transition-colors"
                        title="Edit Exhibition"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setDeleteConfirmId(expo.id)}
                        className="p-2 rounded-lg text-rose-600 hover:text-rose-800 hover:bg-rose-50 border border-rose-200 transition-colors"
                        title="Delete Exhibition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Description & Detailed Address */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
                  <div className="lg:col-span-2 space-y-2">
                    <p className="text-slate-700 leading-relaxed font-medium">
                      {expo.description}
                    </p>

                    {expo.fullAddress && (
                      <p className="text-slate-500 font-mono text-[11px] flex items-start gap-1.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                        <Building className="w-3.5 h-3.5 text-orange-600 shrink-0 mt-0.5" />
                        <span><strong>Detailed Ground Address:</strong> {expo.fullAddress}</span>
                      </p>
                    )}

                    {/* Key Highlights */}
                    {expo.keyHighlights && expo.keyHighlights.length > 0 && (
                      <div className="pt-2">
                        <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block mb-1">
                          Key Live Demonstrations & Highlights:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {expo.keyHighlights.map((hl, idx) => (
                            <span
                              key={idx}
                              className="text-[11px] bg-slate-100 text-slate-700 font-medium px-2.5 py-1 rounded-md border border-slate-200 flex items-center gap-1"
                            >
                              <Check className="w-3 h-3 text-orange-600" /> {hl}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Multi-Media Gallery & Videos Summary Box */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3 font-mono">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Configured Media</span>
                      <span className="text-[10px] font-bold text-orange-700">
                        {(expo.galleryImages?.length || 0)} Photos • {(expo.videoUrls?.length || 0)} Videos
                      </span>
                    </div>

                    {/* Image Thumbnails Preview */}
                    {expo.galleryImages && expo.galleryImages.length > 0 && (
                      <div className="grid grid-cols-4 gap-1.5">
                        {(Array.isArray(expo.galleryImages) ? expo.galleryImages : []).slice(0, 4).map((img, i) => (
                          <img
                            key={i}
                            src={img}
                            alt="Gallery preview"
                            className="w-full h-12 rounded object-cover border border-slate-200"
                          />
                        ))}
                      </div>
                    )}

                    {/* Video Previews */}
                    {expo.videoUrls && expo.videoUrls.length > 0 && (
                      <div className="text-[11px] text-slate-700 space-y-1">
                        {expo.videoUrls.map((vUrl, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-rose-700 bg-rose-50 px-2 py-1 rounded border border-rose-200 truncate">
                            <Video className="w-3 h-3 shrink-0" />
                            <span className="truncate text-[10px]">Video #{i + 1}: {vUrl}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Brochure link */}
                    {expo.brochurePdfUrl && (
                      <a
                        href={expo.brochurePdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-[11px] text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-200 hover:bg-blue-100 transition-colors"
                      >
                        <FileText className="w-3 h-3 text-blue-600" />
                        <span className="font-bold truncate">Download Event Brochure PDF</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
                  <div className="text-xs font-mono">
                    <span className="text-slate-500 font-bold mr-1">EXPO SLUG & QR LINK:</span>
                    <span className="text-orange-700 font-bold bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                      weldorindustries.com/expo/{expo.qrSlug}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => {
                        setSelectedExpoSlug(expo.qrSlug);
                        setActiveView('public-expo-landing');
                      }}
                      className="btn-secondary text-xs text-slate-800 border-slate-300 hover:border-orange-500 bg-white shadow-2xs flex items-center gap-1.5 py-2 px-3"
                    >
                      <QrCode className="w-3.5 h-3.5 text-orange-600" />
                      <span className="font-bold">Test QR Landing Page</span>
                    </button>

                    <button
                      onClick={() => showNotification(`Generated high-resolution Vector QR Poster PDF for Booth ${expo.boothNumber}`, 'success')}
                      className="btn-primary text-xs py-2 px-3.5 shadow-sm flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download QR Poster</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-slate-900">Delete Exhibition Event?</h3>
              <p className="text-xs text-slate-600">
                Are you sure you want to delete this exhibition? This action will remove its public page and QR landing links.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteExhibition(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="btn-danger text-xs px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold shadow-md"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Comprehensive Exhibition Studio Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 text-slate-900">
            
            {/* Modal Top Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-5 h-5 text-orange-400" />
                <div>
                  <h3 className="font-bold text-base font-heading">
                    {editingExpoId ? 'Edit Exhibition Event & Media' : 'Add New Exhibition Event'}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Configure titles, addresses, multi-photo gallery, videos, and automated archive rules.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 px-6 py-2.5 bg-slate-50 shrink-0 overflow-x-auto text-xs font-mono font-bold">
              <button
                type="button"
                onClick={() => setModalActiveTab('basic')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  modalActiveTab === 'basic'
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                1. Basic Info & Dates
              </button>
              <button
                type="button"
                onClick={() => setModalActiveTab('venue')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  modalActiveTab === 'venue'
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                2. Venue & Full Address
              </button>
              <button
                type="button"
                onClick={() => setModalActiveTab('gallery')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  modalActiveTab === 'gallery'
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                3. Thumbnail & Photos ({formData.galleryImages.length})
              </button>
              <button
                type="button"
                onClick={() => setModalActiveTab('videos')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  modalActiveTab === 'videos'
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                4. Videos & Brochure ({formData.videoUrls.length})
              </button>
              <button
                type="button"
                onClick={() => setModalActiveTab('highlights')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  modalActiveTab === 'highlights'
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                5. Highlights & Demos ({formData.keyHighlights.length})
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSaveExpoSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs font-mono">
              
              {/* TAB 1: BASIC INFO & DATES */}
              {modalActiveTab === 'basic' && (
                <div className="space-y-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Exhibition Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. IMTEX 2026 — International Machine Tool & Automation Exhibition"
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:border-orange-500 outline-none bg-slate-50 text-xs font-medium text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Subtitle / Marketing Tagline</label>
                    <input
                      type="text"
                      placeholder="e.g. South Asia’s Largest Precision Tooling, CNC & Hydraulic Automation Exposition"
                      value={formData.subtitle}
                      onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-orange-500 outline-none bg-slate-50 text-xs font-medium text-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Start Date *</label>
                      <input
                        type="date"
                        required
                        value={formData.startDate}
                        onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-orange-500 outline-none bg-slate-50 text-xs font-medium text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">End Date *</label>
                      <input
                        type="date"
                        required
                        value={formData.endDate}
                        onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-orange-500 outline-none bg-slate-50 text-xs font-medium text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Auto-Archive Engine Toggle */}
                  <div className="p-4 bg-orange-50/80 border border-orange-200 rounded-xl space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.autoArchivePassedDate}
                        onChange={e => setFormData({ ...formData, autoArchivePassedDate: e.target.checked })}
                        className="w-4 h-4 text-orange-600 rounded border-slate-300 focus:ring-orange-500"
                      />
                      <span className="font-bold text-slate-900 text-xs">
                        Enable Automatic Past Expo Transition (Recommended)
                      </span>
                    </label>
                    <p className="text-[11px] text-slate-600 leading-normal pl-6">
                      When enabled, once today's date passes the End Date ({formData.endDate}), the platform automatically moves this exhibition from "Upcoming" into "Previous Expos & Archive" with zero manual intervention required.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Manual Status Override</label>
                      <select
                        value={formData.status}
                        onChange={e => setFormData({ ...formData, status: e.target.value as Exhibition['status'] })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-orange-500 outline-none bg-slate-50 text-xs font-semibold text-slate-900"
                      >
                        <option value="Upcoming">Upcoming Trade Fair</option>
                        <option value="Past Exhibition">Past Exhibition (Archive)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">QR Slug / URL Identifier</label>
                      <input
                        type="text"
                        placeholder="e.g. imtex-2026-booth-b14"
                        value={formData.qrSlug}
                        onChange={e => setFormData({ ...formData, qrSlug: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-orange-500 outline-none bg-slate-50 text-xs font-medium text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Exhibition Synopsis / Description *</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Detailed write-up of Weldor's booth presence, products showcased, machine trials..."
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:border-orange-500 outline-none bg-slate-50 text-xs font-medium text-slate-900"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: VENUE & ADDRESS */}
              {modalActiveTab === 'venue' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Venue / Exhibition Centre Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. BIEC Exhibition Centre / Bombay Exhibition Center"
                        value={formData.location}
                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-orange-500 outline-none bg-slate-50 text-xs font-medium text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Hall & Booth / Stall Number *</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="e.g. Hall 3A"
                          value={formData.hallNumber}
                          onChange={e => setFormData({ ...formData, hallNumber: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-orange-500 outline-none bg-slate-50 text-xs font-medium text-slate-900"
                        />
                        <input
                          type="text"
                          placeholder="e.g. Booth B-14"
                          value={formData.boothNumber}
                          onChange={e => setFormData({ ...formData, boothNumber: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-orange-500 outline-none bg-slate-50 text-xs font-medium text-slate-900"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">City *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Bengaluru / Hannover / Chicago"
                        value={formData.city}
                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-orange-500 outline-none bg-slate-50 text-xs font-medium text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Country *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. India / Germany / USA"
                        value={formData.country}
                        onChange={e => setFormData({ ...formData, country: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-orange-500 outline-none bg-slate-50 text-xs font-medium text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Full Physical Ground Address</label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Hall 3A, BIEC Exhibition Centre, 10th Mile, Tumkur Road, Madavara Post, Bengaluru, Karnataka 562123, India"
                      value={formData.fullAddress}
                      onChange={e => setFormData({ ...formData, fullAddress: e.target.value })}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:border-orange-500 outline-none bg-slate-50 text-xs font-medium text-slate-900"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: THUMBNAIL & PHOTO GALLERY */}
              {modalActiveTab === 'gallery' && (
                <div className="space-y-5">
                  {/* Main Banner / Thumbnail */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                    <label className="block font-bold text-slate-900 text-xs">
                      Primary Event Thumbnail / Poster Image URL *
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        required
                        value={formData.bannerImage}
                        onChange={e => setFormData({ ...formData, bannerImage: e.target.value })}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:border-orange-500 outline-none bg-white text-xs font-mono"
                      />
                      <img
                        src={formData.bannerImage}
                        alt="Preview"
                        className="w-16 h-12 rounded object-cover border border-slate-300 bg-slate-200 shrink-0"
                      />
                    </div>
                  </div>

                  {/* Preset Selector */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Quick Preset Posters:</span>
                    <div className="flex flex-wrap gap-2">
                      {samplePresets.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setFormData({ ...formData, bannerImage: preset.url })}
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-orange-50 hover:text-orange-700 border border-slate-200 text-[10px] font-mono transition-colors"
                        >
                          + {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Multiple Gallery Photos */}
                  <div className="border-t border-slate-200 pt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs">Multiple High-Res Photos Gallery</h4>
                        <p className="text-[11px] text-slate-500">
                          Add multiple booth setup photos, live crowd demos, and machinery close-ups.
                        </p>
                      </div>
                      <span className="text-xs font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                        {formData.galleryImages.length} Photos Added
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Paste image URL (e.g. https://images.unsplash.com/...)"
                        value={newGalleryInput}
                        onChange={e => setNewGalleryInput(e.target.value)}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:border-orange-500 outline-none bg-slate-50 text-xs font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddGalleryImage()}
                        className="btn-primary text-xs py-2 px-4 shrink-0 flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Photo
                      </button>
                    </div>

                    {/* Quick Add Presets to Gallery */}
                    <div className="flex flex-wrap gap-1.5">
                      {samplePresets.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleAddGalleryImage(preset.url)}
                          className="text-[10px] bg-slate-50 hover:bg-slate-200 border border-slate-200 px-2 py-0.5 rounded text-slate-700"
                        >
                          Add {preset.label} to Gallery
                        </button>
                      ))}
                    </div>

                    {/* Gallery Preview Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                      {formData.galleryImages.map((imgUrl, index) => (
                        <div key={index} className="relative group rounded-xl overflow-hidden border border-slate-200 shadow-2xs">
                          <img
                            src={imgUrl}
                            alt={`Gallery item ${index + 1}`}
                            className="w-full h-24 object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryImage(index)}
                            className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-full opacity-80 hover:opacity-100 shadow-xs"
                            title="Remove Photo"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <span className="absolute bottom-1 left-1 bg-slate-900/80 text-white text-[9px] px-1 rounded">
                            #{index + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: MULTI-VIDEOS & BROCHURE */}
              {modalActiveTab === 'videos' && (
                <div className="space-y-5">
                  {/* Multiple Videos Section */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs">Multiple Live Demonstration & Product Videos</h4>
                        <p className="text-[11px] text-slate-500">
                          Add MP4 / WebM / YouTube demo links for booth presentations and live machine runs.
                        </p>
                      </div>
                      <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        {formData.videoUrls.length} Videos Added
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Paste video MP4 URL (e.g. https://assets.mixkit.co/...)"
                        value={newVideoInput}
                        onChange={e => setNewVideoInput(e.target.value)}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:border-orange-500 outline-none bg-slate-50 text-xs font-mono"
                      />
                      <button
                        type="button"
                        onClick={handleAddVideo}
                        className="btn-primary text-xs py-2 px-4 shrink-0 flex items-center gap-1 bg-rose-600 hover:bg-rose-700"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Video
                      </button>
                    </div>

                    {/* Videos List Preview */}
                    <div className="space-y-2 pt-2">
                      {formData.videoUrls.map((vUrl, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                              <Video className="w-4 h-4" />
                            </div>
                            <div className="truncate">
                              <span className="font-bold text-slate-900 block text-xs">Video #{index + 1}</span>
                              <span className="text-[10px] text-slate-500 truncate block">{vUrl}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <a
                              href={vUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1 rounded bg-white text-slate-700 hover:bg-slate-100 border border-slate-300 text-[10px] font-bold flex items-center gap-1"
                            >
                              <Play className="w-3 h-3 text-rose-600" /> Play
                            </a>
                            <button
                              type="button"
                              onClick={() => handleRemoveVideo(index)}
                              className="p-1 rounded text-rose-600 hover:bg-rose-100"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Brochure Catalog PDF */}
                  <div className="border-t border-slate-200 pt-4 space-y-2">
                    <label className="block font-bold text-slate-900 text-xs">
                      Event Catalog / Printable PDF Brochure URL
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="https://.../event-brochure.pdf"
                        value={formData.brochurePdfUrl}
                        onChange={e => setFormData({ ...formData, brochurePdfUrl: e.target.value })}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:border-orange-500 outline-none bg-slate-50 text-xs font-mono"
                      />
                      {formData.brochurePdfUrl && (
                        <a
                          href={formData.brochurePdfUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-secondary text-xs py-2 px-3 flex items-center gap-1"
                        >
                          <FileText className="w-3.5 h-3.5 text-blue-600" /> Test PDF
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: HIGHLIGHTS & SHOWCASED DEMOS */}
              {modalActiveTab === 'highlights' && (
                <div className="space-y-5">
                  {/* Highlights Builder */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs">Booth Machine Demonstrations & Highlights</h4>
                        <p className="text-[11px] text-slate-500">
                          Bullet points shown on visitor booth landing page and marketing posters.
                        </p>
                      </div>
                      <span className="text-xs font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                        {formData.keyHighlights.length} Highlights
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="e.g. Live 700 Bar Hydrostatic Burst Rig Trial at 11:00 AM"
                        value={newHighlightInput}
                        onChange={e => setNewHighlightInput(e.target.value)}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:border-orange-500 outline-none bg-slate-50 text-xs font-medium text-slate-900"
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddHighlight();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleAddHighlight}
                        className="btn-primary text-xs py-2 px-4 shrink-0 flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add
                      </button>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      {formData.keyHighlights.map((hl, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs font-medium text-slate-800"
                        >
                          <span className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-orange-600 shrink-0" />
                            {hl}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveHighlight(idx)}
                            className="text-slate-400 hover:text-rose-600 p-1"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Showcased Products */}
                  <div className="border-t border-slate-200 pt-4 space-y-3">
                    <h4 className="font-bold text-slate-900 text-xs">Featured Product Lines Showcased at Booth</h4>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="e.g. ISO 15552 Heavy-Duty Pneumatic Cylinder"
                        value={newProductInput}
                        onChange={e => setNewProductInput(e.target.value)}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:border-orange-500 outline-none bg-slate-50 text-xs font-medium text-slate-900"
                      />
                      <button
                        type="button"
                        onClick={handleAddProduct}
                        className="btn-secondary text-xs py-2 px-4 shrink-0"
                      >
                        + Add Product
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {(formData.showcasedProducts || []).map((prod, idx) => (
                        <span
                          key={idx}
                          className="bg-orange-50 text-orange-800 border border-orange-200 text-xs px-2.5 py-1 rounded-md flex items-center gap-1.5 font-bold"
                        >
                          {prod}
                          <button
                            type="button"
                            onClick={() => handleRemoveProduct(idx)}
                            className="hover:text-rose-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer Controls */}
              <div className="pt-5 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-2">
                  {modalActiveTab !== 'basic' && (
                    <button
                      type="button"
                      onClick={() => {
                        if (modalActiveTab === 'venue') setModalActiveTab('basic');
                        if (modalActiveTab === 'gallery') setModalActiveTab('venue');
                        if (modalActiveTab === 'videos') setModalActiveTab('gallery');
                        if (modalActiveTab === 'highlights') setModalActiveTab('videos');
                      }}
                      className="px-3.5 py-2 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 font-bold text-xs"
                    >
                      ← Back
                    </button>
                  )}

                  {modalActiveTab !== 'highlights' && (
                    <button
                      type="button"
                      onClick={() => {
                        if (modalActiveTab === 'basic') setModalActiveTab('venue');
                        if (modalActiveTab === 'venue') setModalActiveTab('gallery');
                        if (modalActiveTab === 'gallery') setModalActiveTab('videos');
                        if (modalActiveTab === 'videos') setModalActiveTab('highlights');
                      }}
                      className="px-3.5 py-2 rounded-xl text-slate-800 bg-orange-50 hover:bg-orange-100 border border-orange-200 font-bold text-xs"
                    >
                      Next Step →
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-700 hover:bg-slate-100 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary px-6 py-2.5 shadow-md flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{editingExpoId ? 'Save & Update Exhibition' : 'Publish Exhibition Event'}</span>
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Quick Preview Modal */}
      {previewExpo && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-200 text-slate-900">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-orange-400" />
                <h3 className="font-bold text-base font-heading">Public Preview: {previewExpo.title}</h3>
              </div>
              <button
                onClick={() => setPreviewExpo(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto font-sans">
              <div className="relative rounded-2xl overflow-hidden h-64 bg-slate-900">
                <img src={previewExpo.bannerImage} alt={previewExpo.title} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-md text-xs font-mono font-bold text-orange-700">
                  {previewExpo.hallNumber} • {previewExpo.boothNumber}
                </div>
              </div>

              <div>
                <span className="text-xs font-mono font-bold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded border border-orange-200">
                  {previewExpo.status}
                </span>
                <h2 className="text-2xl font-bold font-heading text-slate-900 mt-2">{previewExpo.title}</h2>
                {previewExpo.subtitle && <p className="text-xs text-slate-500 italic mt-0.5">{previewExpo.subtitle}</p>}
                
                <p className="text-xs font-mono text-slate-600 mt-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-orange-600" /> {previewExpo.startDate} to {previewExpo.endDate}
                  <MapPin className="w-4 h-4 text-slate-400 ml-2" /> {previewExpo.location}, {previewExpo.city}, {previewExpo.country}
                </p>

                {previewExpo.fullAddress && (
                  <p className="text-xs text-slate-500 font-mono mt-1 bg-slate-50 p-2 rounded">
                    📍 {previewExpo.fullAddress}
                  </p>
                )}
              </div>

              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {previewExpo.description}
              </p>

              {/* Gallery Photos Preview */}
              {previewExpo.galleryImages && previewExpo.galleryImages.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-bold text-slate-700 uppercase">Photo Gallery ({previewExpo.galleryImages.length})</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {previewExpo.galleryImages.map((img, i) => (
                      <img key={i} src={img} alt="Gallery" className="w-full h-24 rounded-lg object-cover border border-slate-200" />
                    ))}
                  </div>
                </div>
              )}

              {/* Video List */}
              {previewExpo.videoUrls && previewExpo.videoUrls.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-bold text-slate-700 uppercase">Demonstration Videos ({previewExpo.videoUrls.length})</h4>
                  <div className="space-y-1.5">
                    {previewExpo.videoUrls.map((v, i) => (
                      <div key={i} className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg flex items-center justify-between text-xs font-mono text-rose-800">
                        <span className="truncate">Demo Video #{i + 1}: {v}</span>
                        <a href={v} target="_blank" rel="noreferrer" className="btn-primary text-[10px] py-1 px-2.5 bg-rose-600 shrink-0">Play</a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
              <button
                onClick={() => setPreviewExpo(null)}
                className="btn-primary text-xs px-5 py-2"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
