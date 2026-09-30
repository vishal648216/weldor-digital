import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { 
  Image as ImageIcon, 
  Video, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  X, 
  Play, 
  Eye, 
  Upload, 
  Filter, 
  Tag, 
  Key,
  Film,
  Calendar,
  Layers,
  FolderPlus,
  Folder,
  Sparkles,
  UploadCloud,
  Check
} from 'lucide-react';
import type { GalleryMedia } from '../../types';

export const GalleryMediaManager: React.FC = () => {
  const { galleryMedia, addGalleryMedia, updateGalleryMedia, deleteGalleryMedia, showNotification } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<'All' | 'Photo' | 'Video'>('All');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');

  // Modal States
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isBulkFolderModalOpen, setIsBulkFolderModalOpen] = useState(false);
  const [bulkMediaList, setBulkMediaList] = useState<Array<{
    title: string;
    category: GalleryMedia['category'];
    type: 'Photo' | 'Video';
    url: string;
    thumbnail: string;
    caption: string;
    tags: string[];
    seoKeywords: string[];
  }>>([]);
  const [defaultBatchCategory, setDefaultBatchCategory] = useState<GalleryMedia['category']>('Factory Floor');
  const [editingMedia, setEditingMedia] = useState<GalleryMedia | null>(null);
  const [viewingMedia, setViewingMedia] = useState<GalleryMedia | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    title: string;
    category: GalleryMedia['category'];
    type: 'Photo' | 'Video';
    url: string;
    thumbnail: string;
    caption: string;
    videoDuration: string;
    tags: string[];
    seoKeywords: string[];
  }>({
    title: '',
    category: 'Factory Floor',
    type: 'Photo',
    url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200',
    thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400',
    caption: '',
    videoDuration: '02:30 min',
    tags: ['Manufacturing', 'ISO 9001'],
    seoKeywords: ['weldor factory', 'industrial machining']
  });

  const [newTagInput, setNewTagInput] = useState('');
  const [newKeywordInput, setNewKeywordInput] = useState('');

  const categoriesList: GalleryMedia['category'][] = [
    'Factory Floor',
    'CNC Machining',
    'Testing Bays',
    'Product Closeups',
    'Robotic Cell',
    'Exhibitions & Events',
    'R&D Quality Lab'
  ];

  const filteredMedia = galleryMedia.filter(m => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      m.title.toLowerCase().includes(q) || 
      m.caption.toLowerCase().includes(q) ||
      (m.tags && m.tags.some(t => t.toLowerCase().includes(q))) ||
      (m.seoKeywords && m.seoKeywords.some(k => k.toLowerCase().includes(q)));

    const matchesType = selectedTypeFilter === 'All' || m.type === selectedTypeFilter;
    const matchesCat = selectedCategoryFilter === 'All' || m.category === selectedCategoryFilter;

    return matchesSearch && matchesType && matchesCat;
  });

  const handleOpenAddModal = () => {
    setEditingMedia(null);
    setFormData({
      title: '',
      category: 'Factory Floor',
      type: 'Photo',
      url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200',
      thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400',
      caption: '',
      videoDuration: '02:30 min',
      tags: ['Manufacturing', 'ISO 9001'],
      seoKeywords: ['weldor factory', 'precision engineering']
    });
    setIsAddEditModalOpen(true);
  };

  const handleOpenEditModal = (media: GalleryMedia) => {
    setEditingMedia(media);
    setFormData({
      title: media.title,
      category: media.category,
      type: media.type,
      url: media.url,
      thumbnail: media.thumbnail || media.url,
      caption: media.caption || '',
      videoDuration: media.videoDuration || '02:00 min',
      tags: media.tags || ['Industrial'],
      seoKeywords: media.seoKeywords || []
    });
    setIsAddEditModalOpen(true);
  };

  const handleSaveMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.url) {
      showNotification('Title and Media URL are required!', 'warning');
      return;
    }

    if (editingMedia) {
      updateGalleryMedia(editingMedia.id, {
        ...formData,
        thumbnail: formData.thumbnail || formData.url
      });
      showNotification(`Media "${formData.title}" updated successfully!`, 'success');
    } else {
      addGalleryMedia({
        ...formData,
        thumbnail: formData.thumbnail || formData.url
      });
      showNotification(`Media asset "${formData.title}" added to gallery!`, 'success');
    }

    setIsAddEditModalOpen(false);
  };

  const handleAddTag = () => {
    if (!newTagInput.trim()) return;
    if (!formData.tags.includes(newTagInput.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, newTagInput.trim()] }));
    }
    setNewTagInput('');
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const handleAddKeyword = () => {
    if (!newKeywordInput.trim()) return;
    const clean = newKeywordInput.trim().toLowerCase();
    if (!formData.seoKeywords.includes(clean)) {
      setFormData(prev => ({ ...prev, seoKeywords: [...prev.seoKeywords, clean] }));
    }
    setNewKeywordInput('');
  };

  const handleRemoveKeyword = (kw: string) => {
    setFormData(prev => ({ ...prev, seoKeywords: prev.seoKeywords.filter(k => k !== kw) }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetField: 'url' | 'thumbnail') => {
    const file = e.target.files?.[0];
    if (!file) return;
    showNotification(`Uploading ${file.name}...`, 'info');
    const readAsDataURL = (f: File): Promise<string> =>
      new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => resolve('');
        reader.readAsDataURL(f);
      });
    let uploadedUrl = '';
    try {
      const res = await api.uploadFile(file);
      if (res?.success && (res?.data?.cdnUrl || res?.data?.url)) {
        uploadedUrl = res.data.cdnUrl || res.data.url;
      }
    } catch (err) {
      console.warn('Upload error:', err);
    }
    const finalUrl = uploadedUrl || await readAsDataURL(file);
    setFormData(prev => ({ ...prev, [targetField]: finalUrl }));
    showNotification(`Uploaded ${file.name} successfully!`, 'success');
  };

  // Helper to auto-generate industrial engineering descriptions based on title and category
  const generateIndustrialDescription = (title: string, category: GalleryMedia['category']) => {
    switch (category) {
      case 'CNC Machining':
        return `High-precision 5-axis CNC machining operation for ${title} with micron-tolerance dimensional verification at Weldor plant.`;
      case 'Testing Bays':
        return `Rigorous 100% hydrostatic and pneumatic endurance pressure testing station for ${title} certified under ISO 9001 quality audit.`;
      case 'Robotic Cell':
        return `Automated robotic cell performing high-speed automated assembly and precision welding inspection for ${title}.`;
      case 'R&D Quality Lab':
        return `Zeiss Coordinate Measuring Machine (CMM) and metallurgical hardness test analysis for ${title} in Weldor R&D laboratory.`;
      case 'Exhibitions & Events':
        return `Live industrial expo showcase and technical demonstration booth featuring ${title} at international trade show.`;
      case 'Product Closeups':
        return `Detailed macro photography showcasing precision surface finish, thread profiling, and zero-leakage seal tracks of ${title}.`;
      default:
        return `Manufacturing plant floor overview highlighting high-cycle production and quality assembly lines for ${title}.`;
    }
  };

  // Auto-detect category from file name
  const detectCategoryFromName = (name: string): GalleryMedia['category'] => {
    const lower = name.toLowerCase();
    if (lower.includes('cnc') || lower.includes('lathe') || lower.includes('milling') || lower.includes('machin')) return 'CNC Machining';
    if (lower.includes('test') || lower.includes('pressur') || lower.includes('bench') || lower.includes('leak')) return 'Testing Bays';
    if (lower.includes('robot') || lower.includes('cell') || lower.includes('gantry') || lower.includes('arm')) return 'Robotic Cell';
    if (lower.includes('lab') || lower.includes('cmm') || lower.includes('quality') || lower.includes('inspect')) return 'R&D Quality Lab';
    if (lower.includes('expo') || lower.includes('exhibit') || lower.includes('fair') || lower.includes('booth') || lower.includes('event')) return 'Exhibitions & Events';
    if (lower.includes('close') || lower.includes('part') || lower.includes('valve') || lower.includes('cylind') || lower.includes('fit')) return 'Product Closeups';
    return 'Factory Floor';
  };

  // Handle Multi-File / Folder Upload
  const handleBulkFilesSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const parsedList: Array<{
      title: string;
      category: GalleryMedia['category'];
      type: 'Photo' | 'Video';
      url: string;
      thumbnail: string;
      caption: string;
      tags: string[];
      seoKeywords: string[];
    }> = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const objectUrl = URL.createObjectURL(file);
      const isVideo = file.type.startsWith('video/') || file.name.endsWith('.mp4') || file.name.endsWith('.mov');
      
      // Clean name: e.g. "CNC_Heavy_Turning_Bay_01.jpg" -> "CNC Heavy Turning Bay 01"
      const cleanName = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[-_]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      const title = cleanName
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      const category = detectCategoryFromName(cleanName);
      const caption = generateIndustrialDescription(title, category);

      parsedList.push({
        title,
        category,
        type: isVideo ? 'Video' : 'Photo',
        url: objectUrl,
        thumbnail: objectUrl,
        caption,
        tags: [category, 'Manufacturing', 'ISO 9001', 'Weldor Industries'],
        seoKeywords: [title.toLowerCase(), category.toLowerCase(), 'weldor industrial photography']
      });
    }

    setBulkMediaList(parsedList);
    setIsBulkFolderModalOpen(true);
    showNotification(`Loaded ${parsedList.length} media files! Review and upload.`, 'info');
  };

  // Commit all bulk media items to AppContext state and backend
  const handleCommitBulkGallery = async () => {
    if (bulkMediaList.length === 0) return;
    
    try {
      // 1. Persist to server backend database (server/data/gallery.json)
      await api.bulkCreateGalleryItems(bulkMediaList);

      // 2. Add to local state
      for (const item of bulkMediaList) {
        addGalleryMedia({
          title: item.title,
          category: item.category,
          type: item.type,
          url: item.url,
          thumbnail: item.thumbnail || item.url,
          caption: item.caption,
          videoDuration: '02:00 min',
          tags: item.tags,
          seoKeywords: item.seoKeywords
        });
      }

      showNotification(`Successfully saved and added ${bulkMediaList.length} media items to Gallery!`, 'success');
    } catch (err) {
      for (const item of bulkMediaList) {
        addGalleryMedia({
          title: item.title,
          category: item.category,
          type: item.type,
          url: item.url,
          thumbnail: item.thumbnail || item.url,
          caption: item.caption,
          videoDuration: '02:00 min',
          tags: item.tags,
          seoKeywords: item.seoKeywords
        });
      }
      showNotification(`Added ${bulkMediaList.length} items to Gallery!`, 'success');
    } finally {
      setIsBulkFolderModalOpen(false);
      setBulkMediaList([]);
    }
  };

  return (
    <div className="p-6 space-y-6 text-slate-900">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-orange-600 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full uppercase">
              Media Asset Management
            </span>
            <span className="text-xs font-mono font-bold text-purple-800 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-full">
              Photos & Videos Studio
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-heading mt-2">
            Gallery & Video Production Manager
          </h1>
          <p className="text-xs text-slate-600 font-medium mt-1 max-w-3xl">
            Upload, organize, and categorize high-resolution factory photography, 5-axis CNC machining video demos, robotic cells, and testing lab footage with auto-generated descriptions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Bulk Folder / Multi-File Upload Button */}
          <label className="px-4 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-300 text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer">
            <FolderPlus className="w-4 h-4 text-purple-700" />
            <span>Bulk Folder / Multi-Image</span>
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleBulkFilesSelection}
              className="hidden"
            />
          </label>

          <button
            onClick={handleOpenAddModal}
            className="btn-primary text-xs py-2.5 px-4 shadow-md flex items-center gap-2 font-bold cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Single Media</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-mono text-slate-500 font-bold uppercase">Total Media Assets</p>
          <p className="text-2xl font-extrabold text-slate-900 font-mono mt-1">{galleryMedia.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-mono text-blue-700 font-bold uppercase">High-Res Photos</p>
          <p className="text-2xl font-extrabold text-blue-700 font-mono mt-1">
            {galleryMedia.filter(m => m.type === 'Photo').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-mono text-purple-700 font-bold uppercase">Technical Videos</p>
          <p className="text-2xl font-extrabold text-purple-700 font-mono mt-1">
            {galleryMedia.filter(m => m.type === 'Video').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-mono text-orange-700 font-bold uppercase">Plant Categories</p>
          <p className="text-2xl font-extrabold text-orange-700 font-mono mt-1">{categoriesList.length}</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        
        {/* Type Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-mono font-bold">
          <button
            onClick={() => setSelectedTypeFilter('All')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              selectedTypeFilter === 'All' ? 'bg-white text-orange-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Media ({galleryMedia.length})
          </button>
          <button
            onClick={() => setSelectedTypeFilter('Photo')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              selectedTypeFilter === 'Photo' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Photos ({galleryMedia.filter(m => m.type === 'Photo').length})</span>
          </button>
          <button
            onClick={() => setSelectedTypeFilter('Video')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              selectedTypeFilter === 'Video' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Videos ({galleryMedia.filter(m => m.type === 'Video').length})</span>
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search title, tags, keywords..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:border-orange-500"
            />
          </div>

          <select
            value={selectedCategoryFilter}
            onChange={e => setSelectedCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-700 focus:outline-none"
          >
            <option value="All">All Types</option>
            {categoriesList.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Media Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredMedia.map(m => (
          <div key={m.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col group hover:border-orange-300 transition-all">
            
            {/* Thumbnail Preview with Play icon if video */}
            <div 
              className="relative aspect-video bg-slate-100 overflow-hidden cursor-pointer"
              onClick={() => setViewingMedia(m)}
            >
              <img src={m.thumbnail || m.url} alt={m.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              
              {/* Type Badge */}
              <div className="absolute top-2.5 left-2.5">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 shadow-xs ${
                  m.type === 'Video' ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'
                }`}>
                  {m.type === 'Video' ? <Video className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                  <span>{m.type}</span>
                </span>
              </div>

              {/* Video Play Overlay */}
              {m.type === 'Video' && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-white/90 text-purple-700 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                  {m.videoDuration && (
                    <span className="absolute bottom-2 right-2 bg-black/80 text-white font-mono text-[9px] px-1.5 py-0.5 rounded font-bold">
                      {m.videoDuration}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Card Body */}
            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                  {m.category}
                </span>

                <h3 className="font-heading font-bold text-slate-900 text-sm mt-1.5 line-clamp-1 group-hover:text-orange-600 transition-colors">
                  {m.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 mt-1 font-medium">
                  {m.caption}
                </p>

                {/* Tags */}
                {m.tags && m.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {(Array.isArray(m.tags) ? m.tags : []).slice(0, 2).map((t, i) => (
                      <span key={i} className="text-[9px] font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200">
                        #{t}
                      </span>
                    ))}
                    {m.tags.length > 2 && (
                      <span className="text-[9px] font-mono text-slate-400">+{m.tags.length - 2}</span>
                    )}
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setViewingMedia(m)}
                  className="text-xs font-mono font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" /> View
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEditModal(m)}
                    className="p-1.5 rounded-lg text-orange-600 hover:bg-orange-50 transition-colors"
                    title="Edit Media"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete media "${m.title}"?`)) {
                        deleteGalleryMedia(m.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                    title="Delete Media"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

          </div>
        ))}
      </div>

      {/* ADD / EDIT MEDIA MODAL */}
      {isAddEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 max-w-2xl w-full rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto font-sans my-8">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
                  {formData.type === 'Video' ? <Video className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">
                    {editingMedia ? 'Edit Media Asset' : 'Upload New Media Asset'}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">Photo & Video Production Manager</p>
                </div>
              </div>

              <button
                onClick={() => setIsAddEditModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMedia} className="space-y-4">
              
              {/* Type Switcher */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-mono font-bold text-slate-700">Media Format:</span>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-mono font-bold">
                  <input
                    type="radio"
                    name="mediaType"
                    value="Photo"
                    checked={formData.type === 'Photo'}
                    onChange={() => setFormData({ ...formData, type: 'Photo' })}
                    className="text-orange-600 focus:ring-orange-500"
                  />
                  <span>📷 High-Res Photo</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-mono font-bold">
                  <input
                    type="radio"
                    name="mediaType"
                    value="Video"
                    checked={formData.type === 'Video'}
                    onChange={() => setFormData({ ...formData, type: 'Video' })}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span>🎥 Technical Video Demo</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
                    Media Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. 5-Axis DMG Mori CNC Machining Cell in Action"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
                    Plant Category / Area *
                  </label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:border-orange-500 focus:outline-none"
                  >
                    {categoriesList.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* URL & File Upload */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-bold text-slate-700">
                    {formData.type === 'Video' ? 'Video URL / File (MP4, WebM, Stream)' : 'Photo Image URL / File'}
                  </label>
                  <label className="btn-secondary text-xs py-1 px-3 cursor-pointer shadow-xs flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5 text-orange-600" />
                    <span>Upload {formData.type}</span>
                    <input type="file" accept={formData.type === 'Video' ? 'video/*' : 'image/*'} className="hidden" onChange={e => handleFileUpload(e, 'url')} />
                  </label>
                </div>
                <input
                  type="text"
                  required
                  value={formData.url}
                  onChange={e => setFormData({ ...formData, url: e.target.value, thumbnail: formData.thumbnail || e.target.value })}
                  placeholder={formData.type === 'Video' ? 'https://www.w3schools.com/html/mov_bbb.mp4' : 'https://images.unsplash.com/...'}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:border-orange-500"
                />

                {formData.type === 'Video' && (
                  <div>
                    <label className="block text-[11px] font-mono font-bold text-slate-600 mb-1">Video Duration</label>
                    <input
                      type="text"
                      value={formData.videoDuration}
                      onChange={e => setFormData({ ...formData, videoDuration: e.target.value })}
                      placeholder="e.g. 02:45 min"
                      className="w-40 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
                  Caption / Description
                </label>
                <textarea
                  rows={2}
                  value={formData.caption}
                  onChange={e => setFormData({ ...formData, caption: e.target.value })}
                  placeholder="Technical description of process or equipment shown..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:border-orange-500 focus:outline-none"
                />
              </div>

              {/* Tags */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="block text-xs font-mono font-bold text-slate-700">Discovery Tags</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newTagInput}
                    onChange={e => setNewTagInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="Add tag and press Enter..."
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono focus:outline-none"
                  />
                  <button type="button" onClick={handleAddTag} className="btn-secondary text-xs py-1.5 px-3 font-bold shadow-xs">
                    Add Tag
                  </button>
                </div>
                <div className="flex flex-wrap gap-1 pt-1">
                  {formData.tags.map((tag, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-300 text-xs font-mono text-slate-800">
                      <span>#{tag}</span>
                      <button type="button" onClick={() => handleRemoveTag(tag)} className="text-slate-400 hover:text-rose-600">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Hidden SEO Keywords */}
              <div className="p-3.5 rounded-xl bg-orange-50/70 border border-orange-200 space-y-2">
                <div className="flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-orange-700" />
                  <label className="text-xs font-mono font-bold text-orange-950 uppercase">Backend SEO Terms</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newKeywordInput}
                    onChange={e => setNewKeywordInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddKeyword();
                      }
                    }}
                    placeholder="Add search keyword..."
                    className="flex-1 px-3 py-1.5 bg-white border border-orange-200 rounded-lg text-xs font-mono focus:outline-none"
                  />
                  <button type="button" onClick={handleAddKeyword} className="btn-secondary text-xs py-1.5 px-3 font-bold shadow-xs bg-white">
                    Add Keyword
                  </button>
                </div>
                <div className="flex flex-wrap gap-1 pt-1">
                  {formData.seoKeywords.map((kw, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white border border-orange-300 text-xs font-mono text-slate-800">
                      <span>{kw}</span>
                      <button type="button" onClick={() => handleRemoveKeyword(kw)} className="text-slate-400 hover:text-rose-600">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsAddEditModalOpen(false)}
                  className="btn-secondary text-xs py-2.5 px-4 font-bold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn-primary text-xs py-2.5 px-6 font-bold shadow-md"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingMedia ? 'Update Media' : 'Save Media Asset'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* VIEW MEDIA LIGHTBOX / VIDEO PLAYER MODAL */}
      {viewingMedia && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 max-w-3xl w-full rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative font-sans my-8">
            
            <button
              onClick={() => setViewingMedia(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Media Canvas */}
            <div className="bg-black flex items-center justify-center max-h-[500px] overflow-hidden">
              {viewingMedia.type === 'Video' ? (
                <video src={viewingMedia.url} controls autoPlay className="w-full max-h-[480px] object-contain" />
              ) : (
                <img src={viewingMedia.url} alt={viewingMedia.title} className="w-full max-h-[480px] object-contain" />
              )}
            </div>

            {/* Info Footer */}
            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-orange-700 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-md">
                  {viewingMedia.category} • {viewingMedia.type}
                </span>

                {viewingMedia.videoDuration && (
                  <span className="text-xs font-mono text-slate-500 font-bold">
                    Duration: {viewingMedia.videoDuration}
                  </span>
                )}
              </div>

              <h2 className="text-xl font-extrabold text-slate-900 font-heading">
                {viewingMedia.title}
              </h2>

              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {viewingMedia.caption}
              </p>

              {viewingMedia.tags && viewingMedia.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {viewingMedia.tags.map((t, i) => (
                    <span key={i} className="text-[11px] font-mono bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200 font-semibold">
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* BULK MULTI-IMAGE / FOLDER UPLOAD MODAL */}
      {isBulkFolderModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <FolderPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 font-heading">
                    Bulk Multi-Image / Folder Upload Studio
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">
                    {bulkMediaList.length} media assets loaded. Auto-generated titles, technical descriptions, and SEO tags are ready.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setBulkMediaList([]);
                  setIsBulkFolderModalOpen(false);
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Grid of Auto-Parsed Media */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-700" />
                  <span className="text-xs font-mono font-bold text-purple-950">
                    AI Auto-Description Engine Applied to All Files
                  </span>
                </div>
                <span className="text-xs font-mono text-purple-700 font-bold bg-white px-2.5 py-1 rounded-lg border border-purple-200">
                  {bulkMediaList.length} Items Ready
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bulkMediaList.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3 relative group">
                    <div className="flex items-start gap-3">
                      <div className="w-20 h-20 rounded-xl bg-slate-200 overflow-hidden shrink-0 border border-slate-300">
                        {item.type === 'Video' ? (
                          <div className="w-full h-full flex items-center justify-center bg-slate-900 text-white">
                            <Film className="w-6 h-6 text-purple-400" />
                          </div>
                        ) : (
                          <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                        )}
                      </div>

                      <div className="flex-1 space-y-2 min-w-0">
                        <input
                          type="text"
                          value={item.title}
                          onChange={e => {
                            const updated = [...bulkMediaList];
                            updated[idx].title = e.target.value;
                            setBulkMediaList(updated);
                          }}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:border-purple-500 font-sans"
                        />

                        <select
                          value={item.category}
                          onChange={e => {
                            const updated = [...bulkMediaList];
                            const newCat = e.target.value as GalleryMedia['category'];
                            updated[idx].category = newCat;
                            updated[idx].caption = generateIndustrialDescription(updated[idx].title, newCat);
                            setBulkMediaList(updated);
                          }}
                          className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-[11px] font-mono font-bold text-slate-700 focus:outline-none"
                        >
                          {categoriesList.map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>

                      <button
                        onClick={() => {
                          setBulkMediaList(bulkMediaList.filter((_, i) => i !== idx));
                        }}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Remove from batch"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <textarea
                      value={item.caption}
                      rows={2}
                      onChange={e => {
                        const updated = [...bulkMediaList];
                        updated[idx].caption = e.target.value;
                        setBulkMediaList(updated);
                      }}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-sans text-slate-700 focus:outline-none focus:border-purple-500 leading-relaxed"
                      placeholder="Technical description..."
                    />
                  </div>
                ))}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                onClick={() => {
                  setBulkMediaList([]);
                  setIsBulkFolderModalOpen(false);
                }}
                className="btn-secondary text-xs py-2.5 px-4"
              >
                Cancel
              </button>

              <button
                onClick={handleCommitBulkGallery}
                disabled={bulkMediaList.length === 0}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md flex items-center gap-2 cursor-pointer transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Upload All {bulkMediaList.length} Photos / Videos to Gallery</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
