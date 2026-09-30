import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { 
  Layers, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Box, 
  CheckCircle2, 
  X, 
  Key, 
  Upload, 
  Image as ImageIcon,
  Wind,
  Droplets,
  Zap,
  Flame,
  Cpu,
  Shield,
  Eye,
  Info
} from 'lucide-react';
import type { ProductCategory } from '../../types';

export const CategoryManager: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory, products, showNotification } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
  const [viewingCategory, setViewingCategory] = useState<ProductCategory | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    name: string;
    slug: string;
    description: string;
    iconName: string;
    image: string;
    bannerImage: string;
    subCategories: string[];
    seoKeywords: string[];
    seoMetaTitle: string;
    seoMetaDescription: string;
    featured: boolean;
  }>({
    name: '',
    slug: '',
    description: '',
    iconName: 'Box',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
    bannerImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1600',
    subCategories: ['Standard Series', 'Heavy Duty Custom Series'],
    seoKeywords: ['industrial components', 'precision engineering'],
    seoMetaTitle: '',
    seoMetaDescription: '',
    featured: true
  });

  const [newSubCatInput, setNewSubCatInput] = useState('');
  const [newKeywordInput, setNewKeywordInput] = useState('');

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.seoKeywords && c.seoKeywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      iconName: 'Box',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
      bannerImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1600',
      subCategories: ['Standard Series', 'Custom Engineered Series'],
      seoKeywords: ['industrial components', 'oem manufacturing'],
      seoMetaTitle: '',
      seoMetaDescription: '',
      featured: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: ProductCategory) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      iconName: cat.iconName || 'Box',
      image: cat.image,
      bannerImage: cat.bannerImage || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1600',
      subCategories: cat.subCategories || ['Standard Series', 'Heavy Duty Series'],
      seoKeywords: cat.seoKeywords || ['industrial manufacturing'],
      seoMetaTitle: cat.seoMetaTitle || '',
      seoMetaDescription: cat.seoMetaDescription || '',
      featured: cat.featured
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      showNotification('Category Name is required!', 'warning');
      return;
    }

    const generatedSlug = formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        ...formData,
        slug: generatedSlug,
        productCount: products.filter(p => p.categoryId === editingCategory.id || p.category === editingCategory.name).length
      });
      showNotification(`Category "${formData.name}" updated successfully!`, 'success');
    } else {
      addCategory({
        ...formData,
        slug: generatedSlug,
        productCount: 0
      });
      showNotification(`Category "${formData.name}" created!`, 'success');
    }

    setIsModalOpen(false);
  };

  const handleAddSubCat = () => {
    if (!newSubCatInput.trim()) return;
    if (!formData.subCategories.includes(newSubCatInput.trim())) {
      setFormData(prev => ({ ...prev, subCategories: [...prev.subCategories, newSubCatInput.trim()] }));
    }
    setNewSubCatInput('');
  };

  const handleRemoveSubCat = (sc: string) => {
    setFormData(prev => ({ ...prev, subCategories: prev.subCategories.filter(item => item !== sc) }));
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
    setFormData(prev => ({ ...prev, seoKeywords: prev.seoKeywords.filter(item => item !== kw) }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetField: 'image' | 'bannerImage') => {
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
    showNotification(`Uploaded ${targetField === 'image' ? 'Thumbnail' : 'Banner'} successfully!`, 'success');
  };

  const availableIcons = [
    { name: 'Wind', icon: Wind },
    { name: 'Droplets', icon: Droplets },
    { name: 'Zap', icon: Zap },
    { name: 'Flame', icon: Flame },
    { name: 'Cpu', icon: Cpu },
    { name: 'Shield', icon: Shield },
    { name: 'Box', icon: Box },
    { name: 'Layers', icon: Layers }
  ];

  return (
    <div className="p-6 space-y-6 text-slate-900">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-orange-600 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full uppercase">
              Product Taxonomy Hub
            </span>
            <span className="text-xs font-mono font-bold text-blue-800 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
              Amazon Taxonomy Architecture
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-heading mt-2">
            Categories & Taxonomy Manager
          </h1>
          <p className="text-xs text-slate-600 font-medium mt-1 max-w-3xl">
            Configure product divisions, sub-categories, thumbnail & hero banners, and hidden SEO search terms for optimal product discovery.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="btn-primary text-xs py-3 px-5 shadow-md flex items-center gap-2 shrink-0 font-bold"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search categories or hidden keywords..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:border-orange-500"
          />
        </div>

        <span className="text-xs font-mono text-slate-500 font-bold">
          Total Categories: <strong>{categories.length}</strong>
        </span>
      </div>

      {/* Categories Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map(cat => {
          const catProductCount = products.filter(p => p.categoryId === cat.id || p.category === cat.name).length;

          return (
            <div key={cat.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col group hover:border-orange-300 transition-all">
              
              {/* Category Thumbnail Image Banner */}
              <div className="relative h-40 bg-slate-100 overflow-hidden">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold bg-white/95 text-slate-900 px-2 py-0.5 rounded-full shadow-xs">
                    {catProductCount} Products
                  </span>
                  {cat.featured && (
                    <span className="text-[10px] font-mono font-bold bg-orange-600 text-white px-2 py-0.5 rounded-full shadow-xs">
                      Featured
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="font-heading font-extrabold text-white text-lg leading-tight truncate">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] font-mono text-orange-300 mt-0.5">slug: /{cat.slug}</p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium">
                    {cat.description}
                  </p>

                  {/* Sub-Categories Pills */}
                  {cat.subCategories && cat.subCategories.length > 0 && (
                    <div className="mt-3 space-y-1.5">
                      <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                        Sub-Taxonomies:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {(Array.isArray(cat.subCategories) ? cat.subCategories : []).slice(0, 3).map((sub, sIdx) => (
                          <span key={sIdx} className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 font-semibold">
                            {sub}
                          </span>
                        ))}
                        {cat.subCategories.length > 3 && (
                          <span className="text-[10px] font-mono bg-orange-50 text-orange-700 px-1.5 py-0.5 rounded border border-orange-200 font-bold">
                            +{cat.subCategories.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Hidden SEO Keywords Preview */}
                  {cat.seoKeywords && cat.seoKeywords.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
                      <Key className="w-3 h-3 text-orange-600 shrink-0" />
                      <span className="truncate">{cat.seoKeywords.join(', ')}</span>
                    </div>
                  )}
                </div>

                {/* Actions Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setViewingCategory(cat)}
                    className="text-xs font-mono font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" /> Details
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        updateCategory(cat.id, { featured: !cat.featured });
                        showNotification(`Category "${cat.name}" ${!cat.featured ? 'marked as Featured on Home' : 'removed from Home Showcase'}!`, 'success');
                      }}
                      className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1 transition-all ${
                        cat.featured 
                          ? 'bg-orange-50 text-orange-700 border border-orange-200' 
                          : 'bg-slate-100 text-slate-500 hover:text-orange-600 border border-slate-200'
                      }`}
                      title={cat.featured ? "Click to remove from Homepage showcase" : "Click to feature on Homepage"}
                    >
                      <span>{cat.featured ? '⭐ Home Tab' : 'Hide from Home'}</span>
                    </button>
                    <button
                      onClick={() => handleOpenEditModal(cat)}
                      className="p-1.5 rounded-lg text-orange-600 hover:bg-orange-50 transition-colors"
                      title="Edit Category"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete category "${cat.name}"?`)) {
                          deleteCategory(cat.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>

            </div>
          );
        })}
      </div>

      {/* ADD / EDIT CATEGORY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 max-w-2xl w-full rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto font-sans my-8">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">
                    {editingCategory ? 'Edit Product Category' : 'Create New Category'}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">Amazon Taxonomy & SEO Settings</p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Pneumatic Components"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. pneumatic-components"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
                  Category Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Overview of components manufactured under this division..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:border-orange-500 focus:outline-none"
                />
              </div>

              {/* Sub-Categories List */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="block text-xs font-mono font-bold text-slate-700">
                  Sub-Categories & Sub-Taxonomies ({formData.subCategories.length})
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newSubCatInput}
                    onChange={e => setNewSubCatInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSubCat();
                      }
                    }}
                    placeholder="Add sub-category and press Enter..."
                    className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono focus:border-orange-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddSubCat}
                    className="btn-secondary text-xs py-2 px-3.5 font-bold shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5 text-orange-600" /> Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {formData.subCategories.map((sub, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-slate-300 text-xs font-mono text-slate-800">
                      <span>{sub}</span>
                      <button type="button" onClick={() => handleRemoveSubCat(sub)} className="text-slate-400 hover:text-rose-600">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Thumbnail & Banner Images */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono font-bold text-slate-700">Category Thumbnail</label>
                    <label className="text-[10px] font-mono text-orange-700 font-bold hover:underline cursor-pointer">
                      Upload
                      <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, 'image')} />
                    </label>
                  </div>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono focus:outline-none"
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono font-bold text-slate-700">Hero Banner Image</label>
                    <label className="text-[10px] font-mono text-orange-700 font-bold hover:underline cursor-pointer">
                      Upload
                      <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, 'bannerImage')} />
                    </label>
                  </div>
                  <input
                    type="text"
                    value={formData.bannerImage}
                    onChange={e => setFormData({ ...formData, bannerImage: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono focus:outline-none"
                  />
                </div>
              </div>

              {/* Hidden SEO Keywords */}
              <div className="p-4 rounded-xl bg-orange-50/70 border border-orange-200 space-y-2">
                <div className="flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-orange-700" />
                  <label className="text-xs font-mono font-bold text-orange-950 uppercase">
                    Category Backend SEO Keywords
                  </label>
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
                    placeholder="Add search term keyword..."
                    className="flex-1 px-3 py-2 bg-white border border-orange-200 rounded-lg text-xs font-mono focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddKeyword}
                    className="btn-secondary text-xs py-2 px-3.5 font-bold shadow-xs bg-white"
                  >
                    <Plus className="w-3.5 h-3.5 text-orange-600" /> Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {formData.seoKeywords.map((kw, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white border border-orange-300 text-xs font-mono text-slate-800 font-semibold">
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
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary text-xs py-2.5 px-4 font-bold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn-primary text-xs py-2.5 px-6 font-bold shadow-md"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingCategory ? 'Update Category' : 'Create Category'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* VIEW CATEGORY MODAL */}
      {viewingCategory && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 max-w-xl w-full rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto font-sans my-8">
            
            <button
              onClick={() => setViewingCategory(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <div className="h-44 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                <img src={viewingCategory.image} alt={viewingCategory.name} className="w-full h-full object-cover" />
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-slate-900 font-heading">{viewingCategory.name}</h2>
                <p className="text-xs font-mono text-orange-700">/{viewingCategory.slug}</p>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed font-medium">{viewingCategory.description}</p>

              {viewingCategory.subCategories && viewingCategory.subCategories.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-mono font-bold text-slate-800 uppercase">Sub-Categories:</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {viewingCategory.subCategories.map((s, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-xs font-mono font-bold text-slate-800">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {viewingCategory.seoKeywords && viewingCategory.seoKeywords.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-mono font-bold text-orange-900 uppercase flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-orange-600" /> Backend SEO Keywords:
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {viewingCategory.seoKeywords.map((k, i) => (
                      <span key={i} className="px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-[11px] font-mono font-semibold text-orange-900">
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
