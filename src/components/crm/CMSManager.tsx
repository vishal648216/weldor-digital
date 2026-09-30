import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FolderKanban, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Edit, 
  Sparkles, 
  ArrowUp, 
  ArrowDown, 
  Tv, 
  X,
  UploadCloud
} from 'lucide-react';
import type { HeroBanner, BannerTransitionEffect, BannerOverlayTheme } from '../../types';

export const CMSManager: React.FC = () => {
  const { 
    banners, 
    addBanner, 
    updateBanner, 
    deleteBanner, 
    reorderBanners, 
    toggleBannerStatus, 
    showNotification 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'banners' | 'media-library'>('banners');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<HeroBanner | null>(null);

  // Form State
  const [formData, setFormData] = useState<Omit<HeroBanner, 'id'>>({
    badge: 'DIGITAL B2B SALES & MANUFACTURING PLATFORM',
    title: 'Precision Hydraulic Valves.',
    highlightText: 'Engineered for High-Pressure Performance.',
    subtitle: 'ISO 9001:2015 & AS9100D Certified Manufacturing',
    description: 'Ultra-precision fluid control manifolds and heavy-duty cylinders built for extreme industrial operating conditions.',
    bgImageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1920',
    productImageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
    productSku: 'WEL-PNC-15552-HD',
    productName: 'ISO 15552 Heavy-Duty Pneumatic Cylinder',
    transitionEffect: 'zoom',
    overlayTheme: 'dark-glass',
    primaryBtnText: 'Explore Product Catalog',
    primaryBtnAction: 'public-products',
    secondaryBtnText: 'Upload CAD Drawing',
    secondaryBtnAction: 'public-rfq',
    stats: [
      { label: 'Engineering Legacy', value: '40+ Years' },
      { label: 'Peak Pressure', value: '700 Bar' },
      { label: 'Global Exports', value: '25+ Countries' },
    ],
    features: ['100% Pressure Tested', '±0.005mm CNC Precision', '2-Hour CAD Response'],
    active: true,
    displayOrder: banners.length + 1,
    autoplayDurationSec: 6,
  });

  // Media Library State
  const [mediaItems, setMediaItems] = useState([
    { id: 'm-1', name: 'DMG_Mori_5Axis_Spindle_Macro.jpg', type: 'IMAGE', size: '3.8 MB', tag: 'Factory Floor', url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200', inUseBy: 4 },
    { id: 'm-2', name: '700Bar_Hydraulic_Valve_3D_Model.step', type: 'CAD 3D', size: '18.4 MB', tag: 'CAD STEP', url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=1200', inUseBy: 2 },
    { id: 'm-3', name: 'ISO_9001_AS9100D_Certificates_2026.pdf', type: 'DOCUMENT', size: '5.1 MB', tag: 'Certificates', url: '#', inUseBy: 8 },
    { id: 'm-4', name: 'Robotic_Welding_MIG_Torch_Heavy.jpg', type: 'IMAGE', size: '2.9 MB', tag: 'Robotic Cell', url: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=1200', inUseBy: 3 },
    { id: 'm-5', name: 'Zeiss_3D_CMM_Inspection_Report.pdf', type: 'DOCUMENT', size: '4.2 MB', tag: 'QC Reports', url: '#', inUseBy: 1 },
    { id: 'm-6', name: '5Axis_Manifold_Milling_Demo_HD.mp4', type: 'VIDEO', size: '42.6 MB', tag: 'Video Demos', url: 'https://www.w3schools.com/html/mov_bbb.mp4', inUseBy: 2 },
  ]);

  const [selectedMediaType, setSelectedMediaType] = useState<string>('All');
  const [isMediaUploadModalOpen, setIsMediaUploadModalOpen] = useState(false);
  const [newMediaName, setNewMediaName] = useState('');
  const [newMediaType, setNewMediaType] = useState<'IMAGE' | 'CAD 3D' | 'DOCUMENT' | 'VIDEO'>('IMAGE');
  const [newMediaTag, setNewMediaTag] = useState('Factory Floor');

  const openAddModal = () => {
    setEditingBanner(null);
    setFormData({
      badge: 'DIGITAL B2B SALES & MANUFACTURING PLATFORM',
      title: 'Precision Components.',
      highlightText: 'Engineered for Industrial Performance.',
      subtitle: 'ISO 9001:2015 & AS9100D Certified Manufacturing',
      description: 'Weldor Industries manufactures heavy-duty ISO pneumatic cylinders, 700 Bar hydraulic valves, and custom 5-axis CNC components.',
      bgImageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1920',
      productImageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
      productSku: 'WEL-PNC-15552-HD',
      productName: 'ISO 15552 Heavy-Duty Pneumatic Cylinder',
      transitionEffect: 'zoom',
      overlayTheme: 'dark-glass',
      primaryBtnText: 'Explore Product Catalog',
      primaryBtnAction: 'public-products',
      secondaryBtnText: 'Upload CAD Drawing',
      secondaryBtnAction: 'public-rfq',
      stats: [
        { label: 'Engineering Legacy', value: '40+ Years' },
        { label: 'Peak Pressure', value: '700 Bar' },
        { label: 'Global Exports', value: '25+ Countries' },
      ],
      features: ['100% Pressure Tested', '±0.005mm CNC Precision', '2-Hour CAD Response'],
      active: true,
      displayOrder: banners.length + 1,
      autoplayDurationSec: 6,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (banner: HeroBanner) => {
    setEditingBanner(banner);
    setFormData({
      badge: banner.badge,
      title: banner.title,
      highlightText: banner.highlightText || '',
      subtitle: banner.subtitle,
      description: banner.description,
      bgImageUrl: banner.bgImageUrl,
      productImageUrl: banner.productImageUrl || '',
      productSku: banner.productSku || '',
      productName: banner.productName || '',
      transitionEffect: banner.transitionEffect,
      overlayTheme: banner.overlayTheme,
      primaryBtnText: banner.primaryBtnText,
      primaryBtnAction: banner.primaryBtnAction,
      secondaryBtnText: banner.secondaryBtnText,
      secondaryBtnAction: banner.secondaryBtnAction,
      stats: banner.stats || [
        { label: 'Engineering Legacy', value: '40+ Years' },
        { label: 'Peak Pressure', value: '700 Bar' },
        { label: 'Global Exports', value: '25+ Countries' },
      ],
      features: banner.features || ['100% Pressure Tested', '±0.005mm CNC Precision', '2-Hour CAD Response'],
      active: banner.active,
      displayOrder: banner.displayOrder,
      autoplayDurationSec: banner.autoplayDurationSec || 6,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.bgImageUrl.trim()) {
      showNotification('Please provide a banner title and background image URL.', 'warning');
      return;
    }

    if (editingBanner) {
      updateBanner(editingBanner.id, formData);
    } else {
      addBanner(formData);
    }
    setIsModalOpen(false);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newOrder = [...banners];
    const temp = newOrder[index - 1];
    newOrder[index - 1] = newOrder[index];
    newOrder[index] = temp;
    reorderBanners(newOrder.map(b => b.id));
  };

  const handleMoveDown = (index: number) => {
    if (index === banners.length - 1) return;
    const newOrder = [...banners];
    const temp = newOrder[index + 1];
    newOrder[index + 1] = newOrder[index];
    newOrder[index] = temp;
    reorderBanners(newOrder.map(b => b.id));
  };

  const handleMediaUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMediaName.trim()) {
      showNotification('Please enter asset name.', 'warning');
      return;
    }
    const newAsset = {
      id: `m-${Date.now()}`,
      name: newMediaName,
      type: newMediaType,
      size: `${(Math.random() * 8 + 1).toFixed(1)} MB`,
      tag: newMediaTag,
      url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200',
      inUseBy: 0,
    };
    setMediaItems(prev => [newAsset, ...prev]);
    setIsMediaUploadModalOpen(false);
    setNewMediaName('');
    showNotification(`Asset "${newAsset.name}" uploaded to Central Media Store!`, 'success');
  };

  const handleSafeDeleteMedia = (item: typeof mediaItems[0]) => {
    if (item.inUseBy > 0) {
      showNotification(
        `Safety Delete Blocked: Asset "${item.name}" is currently active in ${item.inUseBy} catalog pages/hero banners. Replace references before deleting.`,
        'warning'
      );
      return;
    }
    setMediaItems(prev => prev.filter(m => m.id !== item.id));
    showNotification(`Asset "${item.name}" deleted.`, 'info');
  };

  const filteredMedia = mediaItems.filter(m => {
    if (selectedMediaType === 'All') return true;
    return m.type === selectedMediaType;
  });

  return (
    <div className="p-6 space-y-8 text-slate-900 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-orange-600 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full uppercase">
              Website CMS & Animation Control Studio
            </span>
            <span className="text-xs font-mono text-slate-500 font-semibold">
              {banners.length} Slides Configured
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-heading mt-2">
            Hero Banner Slider Studio & Central Media CMS
          </h1>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Create, edit, re-order, and customize animated Hero Banner slides with transitions (Zoom, 3D Flip, Flop Cube, Parallax, Ken Burns) and themes.
          </p>
        </div>

        {/* Tab Switcher & New Slide CTA */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveTab('banners')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'banners' ? 'bg-orange-600 text-white shadow-sm' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Hero Banner Slider ({banners.length})
            </button>
            <button
              onClick={() => setActiveTab('media-library')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'media-library' ? 'bg-orange-600 text-white shadow-sm' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Media Assets Store ({mediaItems.length})
            </button>
          </div>

          {activeTab === 'banners' ? (
            <button
              onClick={openAddModal}
              className="btn-primary text-xs py-2 px-4 shadow-md flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>+ New Hero Banner Slide</span>
            </button>
          ) : (
            <button
              onClick={() => setIsMediaUploadModalOpen(true)}
              className="btn-primary text-xs py-2 px-4 shadow-md flex items-center gap-1.5"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Media Asset</span>
            </button>
          )}
        </div>
      </div>

      {/* =========================================================================
          TAB 1: HERO BANNER SLIDER STUDIO
         ========================================================================= */}
      {activeTab === 'banners' && (
        <div className="space-y-6">
          
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 font-heading uppercase tracking-wider flex items-center gap-2">
              <Tv className="w-4 h-4 text-orange-600" /> Active Homepage Slide Deck & Sequence
            </h2>
            <span className="text-xs font-mono text-slate-500 font-medium">
              💡 Use Move Up/Down arrows to reorder slide sequence in real-time.
            </span>
          </div>

          {/* Banner Slide Cards */}
          <div className="space-y-4">
            {banners.map((banner, index) => (
              <div 
                key={banner.id}
                className={`bg-white rounded-2xl border p-5 transition-all shadow-sm hover:shadow-md flex flex-col lg:flex-row items-center gap-6 ${
                  banner.active ? 'border-slate-200' : 'border-slate-200 opacity-65 bg-slate-50'
                }`}
              >
                
                {/* Order Indicator & Move Buttons */}
                <div className="flex lg:flex-col items-center justify-center gap-1 bg-slate-100 p-2 rounded-xl border border-slate-200 shrink-0">
                  <button
                    disabled={index === 0}
                    onClick={() => handleMoveUp(index)}
                    title="Move Slide Up"
                    className="p-1 rounded text-slate-600 hover:text-orange-600 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-mono font-extrabold text-slate-900 px-1">
                    #{index + 1}
                  </span>
                  <button
                    disabled={index === banners.length - 1}
                    onClick={() => handleMoveDown(index)}
                    title="Move Slide Down"
                    className="p-1 rounded text-slate-600 hover:text-orange-600 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>

                {/* Banner Thumbnail with Transition Effect Pill */}
                <div className="relative w-full lg:w-56 h-32 rounded-xl overflow-hidden bg-slate-950 border border-slate-200 shrink-0 group">
                  <img 
                    src={banner.bgImageUrl} 
                    alt={banner.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-slate-950/40" />

                  {/* Transition effect pill */}
                  <span className="absolute top-2 left-2 bg-orange-600 text-white font-mono text-[10px] font-extrabold px-2 py-0.5 rounded shadow-sm uppercase">
                    ✨ {banner.transitionEffect}
                  </span>

                  {/* Theme pill */}
                  <span className="absolute bottom-2 left-2 bg-slate-900/90 backdrop-blur text-slate-200 font-mono text-[9px] font-bold px-2 py-0.5 rounded border border-slate-700">
                    🎨 {banner.overlayTheme}
                  </span>

                  {/* Product floating thumb */}
                  {banner.productImageUrl && (
                    <img 
                      src={banner.productImageUrl} 
                      alt="Product" 
                      className="absolute bottom-2 right-2 w-10 h-10 object-cover rounded-lg border border-white/50 shadow-md bg-white" 
                    />
                  )}
                </div>

                {/* Main Content Details */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase border ${
                      banner.active ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-300'
                    }`}>
                      {banner.active ? '● Active in Slider' : '○ Disabled'}
                    </span>
                    <span className="text-[10px] font-mono text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded font-semibold">
                      ⏱ {banner.autoplayDurationSec || 6}s Duration
                    </span>
                    {banner.productSku && (
                      <span className="text-[10px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        📦 {banner.productSku}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 font-heading truncate">
                    {banner.title} {banner.highlightText && <span className="text-orange-600">{banner.highlightText}</span>}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-1 font-medium">
                    {banner.subtitle}
                  </p>

                  <p className="text-xs text-slate-500 line-clamp-1">
                    {banner.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[11px] font-mono font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded">
                      Primary CTA: <strong>{banner.primaryBtnText}</strong> → <span className="text-orange-600">{banner.primaryBtnAction}</span>
                    </span>
                    <span className="text-[11px] font-mono font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded">
                      Secondary CTA: <strong>{banner.secondaryBtnText}</strong>
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 w-full lg:w-auto justify-end">
                  
                  {/* Status Toggle */}
                  <button
                    onClick={() => toggleBannerStatus(banner.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-colors border ${
                      banner.active 
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                        : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {banner.active ? 'Active' : 'Enable'}
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => openEditModal(banner)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-orange-50 text-slate-700 hover:text-orange-600 border border-slate-200 transition-colors"
                    title="Edit Slide"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => {
                      if (banners.length <= 1) {
                        showNotification('You must keep at least 1 hero banner slide.', 'warning');
                        return;
                      }
                      if (confirm(`Delete banner slide "${banner.title}"?`)) {
                        deleteBanner(banner.id);
                      }
                    }}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 transition-colors"
                    title="Delete Slide"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* =========================================================================
          TAB 2: CENTRAL MEDIA ASSETS STORE
         ========================================================================= */}
      {activeTab === 'media-library' && (
        <div className="space-y-6">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h3 className="font-bold text-slate-900 font-heading text-base uppercase tracking-wider flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-orange-600" /> Central Media Library with Safety Reference Deletion Checks
                </h3>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  High-resolution CAD STEP models, product closeups, brochures, and video assets indexed for instant reuse.
                </p>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
                {['All', 'IMAGE', 'CAD 3D', 'DOCUMENT', 'VIDEO'].map(t => (
                  <button
                    key={t}
                    onClick={() => setSelectedMediaType(t)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                      selectedMediaType === t ? 'bg-orange-600 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredMedia.map(item => (
                <div key={item.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs font-mono flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-orange-700 bg-orange-100/70 border border-orange-200 px-2 py-0.5 rounded text-[10px]">
                        {item.type}
                      </span>
                      <span className="text-slate-500 text-[11px]">{item.size}</span>
                    </div>

                    <p className="font-bold text-slate-900 truncate text-xs pt-1">{item.name}</p>
                    <p className="text-[10px] text-slate-500 font-medium">Tag: {item.tag}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      item.inUseBy > 0 ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-slate-200 text-slate-600'
                    }`}>
                      In use by {item.inUseBy} pages
                    </span>

                    <button
                      onClick={() => handleSafeDeleteMedia(item)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                      title="Safe Delete Check"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* =========================================================================
          MODAL: ADD / EDIT HERO BANNER SLIDE
         ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div>
                <span className="text-[10px] font-mono font-bold text-orange-700 uppercase bg-orange-100 px-2.5 py-0.5 rounded border border-orange-200">
                  {editingBanner ? 'Edit Banner Slide' : '+ New Hero Banner Slide'}
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 font-heading mt-1">
                  {editingBanner ? `Edit: ${editingBanner.title}` : 'Create High-Impact Hero Slide'}
                </h2>
              </div>

              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              
              {/* Top Banner Tag & Heading */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 font-mono uppercase tracking-wider block">
                    Top Pill Badge Text *
                  </label>
                  <input 
                    type="text"
                    required
                    value={formData.badge}
                    onChange={e => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="e.g. DIGITAL B2B SALES & MANUFACTURING PLATFORM"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-orange-600 focus:outline-none bg-slate-50 text-slate-900 font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 font-mono uppercase tracking-wider block">
                    Autoplay Duration (Seconds)
                  </label>
                  <select
                    value={formData.autoplayDurationSec}
                    onChange={e => setFormData({ ...formData, autoplayDurationSec: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-orange-600 focus:outline-none bg-slate-50 text-slate-900 font-bold"
                  >
                    <option value={4}>4 Seconds (Fast)</option>
                    <option value={6}>6 Seconds (Recommended)</option>
                    <option value={8}>8 Seconds (Relaxed)</option>
                    <option value={10}>10 Seconds (Detailed)</option>
                  </select>
                </div>
              </div>

              {/* Title & Gradient Highlight */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 font-mono uppercase tracking-wider block">
                    Main Title (Primary White Line) *
                  </label>
                  <input 
                    type="text"
                    required
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Precision Components."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-orange-600 focus:outline-none bg-slate-50 text-slate-900 font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 font-mono uppercase tracking-wider block">
                    Highlight Text (Gradient Color Line)
                  </label>
                  <input 
                    type="text"
                    value={formData.highlightText}
                    onChange={e => setFormData({ ...formData, highlightText: e.target.value })}
                    placeholder="e.g. Engineered for Industrial Performance."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-orange-600 focus:outline-none bg-slate-50 text-slate-900 font-semibold"
                  />
                </div>
              </div>

              {/* Subtitle & Description */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 font-mono uppercase tracking-wider block">
                    Subtitle / Punchline
                  </label>
                  <input 
                    type="text"
                    value={formData.subtitle}
                    onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="e.g. ISO 9001:2015 & AS9100D Certified Manufacturing"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-orange-600 focus:outline-none bg-slate-50 text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 font-mono uppercase tracking-wider block">
                    Detailed Engineering Summary
                  </label>
                  <input 
                    type="text"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description for OEM buyers..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-orange-600 focus:outline-none bg-slate-50 text-slate-900"
                  />
                </div>
              </div>

              {/* Transition Effect & Overlay Theme Customizer */}
              <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200 space-y-4">
                <h4 className="font-bold font-mono text-orange-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-orange-600" /> Animation Transition Effect & Color Atmosphere
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-800 font-mono block">
                      Slide Transition Effect:
                    </label>
                    <select
                      value={formData.transitionEffect}
                      onChange={e => setFormData({ ...formData, transitionEffect: e.target.value as BannerTransitionEffect })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold focus:border-orange-600 focus:outline-none"
                    >
                      <option value="zoom">🔍 Zoom Smooth (Dynamic Scale In/Out)</option>
                      <option value="kenburns">📽️ Ken Burns Cinema Pan & Drift</option>
                      <option value="flip-x">🔄 Flip Horizontal 3D Card</option>
                      <option value="flip-y">🔃 Flip Vertical 3D Card</option>
                      <option value="flop-cube">🎲 Flop 3D Cube Rotate</option>
                      <option value="fade-glow">✨ Fade Glow Radiant Aura</option>
                      <option value="parallax-slide">🌊 Parallax Depth Slide</option>
                      <option value="glitch-blur">⚡ Cyber Tech Glitch & Blur</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-800 font-mono block">
                      Overlay Gradient Theme:
                    </label>
                    <select
                      value={formData.overlayTheme}
                      onChange={e => setFormData({ ...formData, overlayTheme: e.target.value as BannerOverlayTheme })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold focus:border-orange-600 focus:outline-none"
                    >
                      <option value="dark-glass">🌑 Dark Frosted Glass (High Contrast)</option>
                      <option value="orange-tech">🟠 Technical Industrial Orange Glow</option>
                      <option value="blueprint-navy">🔵 Blueprint Navy & Technical Grid</option>
                      <option value="emerald-precision">🟢 Defense & Aerospace Emerald</option>
                      <option value="clean-light">⚪ Clean Titanium Minimalist</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Background & 3D Product Image URLs / File Upload */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-700 font-mono uppercase tracking-wider block">
                      Background HD Image *
                    </label>
                    <label className="text-[10.5px] font-mono font-bold text-orange-600 hover:text-orange-700 bg-orange-50 px-2 py-0.5 rounded cursor-pointer border border-orange-200">
                      📁 Upload File
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = () => {
                              if (typeof reader.result === 'string') {
                                setFormData(prev => ({ ...prev, bgImageUrl: reader.result as string }));
                                showNotification(`Background image loaded from device!`, 'success');
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                  <input 
                    type="text"
                    required
                    value={formData.bgImageUrl}
                    onChange={e => setFormData({ ...formData, bgImageUrl: e.target.value })}
                    placeholder="Paste URL or upload image file above..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-orange-600 focus:outline-hidden bg-slate-50 text-slate-900 font-mono text-xs"
                  />
                  {formData.bgImageUrl && (
                    <div className="relative group">
                      <img src={formData.bgImageUrl} alt="BG Preview" className="h-28 w-full object-cover rounded-xl border border-slate-200 shadow-2xs" />
                      <span className="absolute bottom-1 right-2 bg-black/70 text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                        Live Preview
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-700 font-mono uppercase tracking-wider block">
                      3D Floating Product Image
                    </label>
                    <label className="text-[10.5px] font-mono font-bold text-orange-600 hover:text-orange-700 bg-orange-50 px-2 py-0.5 rounded cursor-pointer border border-orange-200">
                      📁 Upload PNG
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = () => {
                              if (typeof reader.result === 'string') {
                                setFormData(prev => ({ ...prev, productImageUrl: reader.result as string }));
                                showNotification(`Product graphic loaded from device!`, 'success');
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                  <input 
                    type="text"
                    value={formData.productImageUrl}
                    onChange={e => setFormData({ ...formData, productImageUrl: e.target.value })}
                    placeholder="Paste PNG/URL or upload image file above..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-orange-600 focus:outline-hidden bg-slate-50 text-slate-900 font-mono text-xs"
                  />

                  {formData.productImageUrl && (
                    <div className="relative group">
                      <img src={formData.productImageUrl} alt="Product Preview" className="h-20 w-auto object-contain bg-slate-100 rounded-xl p-1 border border-slate-200" />
                    </div>
                  )}

                  <div className="pt-1 flex items-center gap-2">
                    <input 
                      type="text"
                      value={formData.productSku}
                      onChange={e => setFormData({ ...formData, productSku: e.target.value })}
                      placeholder="SKU (e.g. WEL-PNC-15552)"
                      className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 bg-slate-50 font-mono text-xs"
                    />
                    <input 
                      type="text"
                      value={formData.productName}
                      onChange={e => setFormData({ ...formData, productName: e.target.value })}
                      placeholder="Product Display Name"
                      className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 bg-slate-50 text-xs font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* CTAs Configuration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="space-y-2">
                  <span className="font-bold font-mono text-slate-900 uppercase">Primary Button CTA</span>
                  <input 
                    type="text"
                    value={formData.primaryBtnText}
                    onChange={e => setFormData({ ...formData, primaryBtnText: e.target.value })}
                    placeholder="Button Text (e.g. Explore Catalog)"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-semibold"
                  />
                  <select
                    value={formData.primaryBtnAction}
                    onChange={e => setFormData({ ...formData, primaryBtnAction: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-mono text-xs font-bold"
                  >
                    <option value="public-products">Navigate to: Product Catalog</option>
                    <option value="public-rfq">Navigate to: Multi-Step RFQ Wizard</option>
                    <option value="public-about">Navigate to: Capabilities & About</option>
                    <option value="public-gallery">Navigate to: Media Gallery</option>
                    <option value="public-contact">Navigate to: Contact Page</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <span className="font-bold font-mono text-slate-900 uppercase">Secondary Button CTA</span>
                  <input 
                    type="text"
                    value={formData.secondaryBtnText}
                    onChange={e => setFormData({ ...formData, secondaryBtnText: e.target.value })}
                    placeholder="Button Text (e.g. Upload CAD)"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-semibold"
                  />
                  <select
                    value={formData.secondaryBtnAction}
                    onChange={e => setFormData({ ...formData, secondaryBtnAction: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-mono text-xs font-bold"
                  >
                    <option value="public-rfq">Navigate to: Multi-Step RFQ Wizard</option>
                    <option value="public-products">Navigate to: Product Catalog</option>
                    <option value="public-contact">Navigate to: Contact & Engineering Inquiry</option>
                    <option value="public-gallery">Navigate to: Media Gallery</option>
                  </select>
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3 pt-2">
                <input 
                  type="checkbox"
                  id="bannerActiveCheck"
                  checked={formData.active}
                  onChange={e => setFormData({ ...formData, active: e.target.checked })}
                  className="rounded border-slate-300 text-orange-600 focus:ring-0 cursor-pointer w-4 h-4"
                />
                <label htmlFor="bannerActiveCheck" className="text-xs text-slate-900 font-bold cursor-pointer select-none">
                  Publish Slide into Active Public Homepage Hero Slider
                </label>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary text-xs py-2 px-4"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn-primary text-xs py-2 px-6 shadow-md"
                >
                  {editingBanner ? 'Save & Update Slide' : 'Create & Publish Banner'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: UPLOAD CENTRAL MEDIA ASSET
         ========================================================================= */}
      {isMediaUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-slate-900 font-heading text-lg">Upload Media Asset</h3>
              <button onClick={() => setIsMediaUploadModalOpen(false)} className="text-slate-500 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleMediaUpload} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 font-mono">Asset Title / File Name *</label>
                <input 
                  type="text"
                  required
                  value={newMediaName}
                  onChange={e => setNewMediaName(e.target.value)}
                  placeholder="e.g. 700Bar_Valve_Manifold_Block_3D.step"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-slate-50 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 font-mono">Asset Type</label>
                  <select
                    value={newMediaType}
                    onChange={e => setNewMediaType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono font-bold"
                  >
                    <option value="IMAGE">IMAGE (PNG/JPG)</option>
                    <option value="CAD 3D">CAD 3D (.STEP/.IGES)</option>
                    <option value="DOCUMENT">DOCUMENT (PDF/Doc)</option>
                    <option value="VIDEO">VIDEO (MP4/WebM)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 font-mono">Category Tag</label>
                  <select
                    value={newMediaTag}
                    onChange={e => setNewMediaTag(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono font-bold"
                  >
                    <option value="Factory Floor">Factory Floor</option>
                    <option value="CNC Machining">CNC Machining</option>
                    <option value="Testing Bays">Testing Bays</option>
                    <option value="CAD Drawings">CAD Drawings</option>
                    <option value="Certificates">Certificates</option>
                  </select>
                </div>
              </div>

              <div className="p-4 rounded-xl border-2 border-dashed border-slate-300 text-center space-y-2 bg-slate-50">
                <UploadCloud className="w-8 h-8 text-orange-600 mx-auto" />
                <p className="font-semibold text-slate-800">Drag & Drop files here or browse</p>
                <p className="text-[10px] text-slate-500 font-mono">Supports STEP, IGES, PDF, MP4, JPG up to 100MB</p>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <button type="button" onClick={() => setIsMediaUploadModalOpen(false)} className="btn-secondary text-xs py-2 px-4">
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs py-2 px-5">
                  Save to Media Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
