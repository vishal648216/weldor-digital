import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Play, Eye, Maximize2, Download, Video as VideoIcon, Image as ImageIcon, Sparkles } from 'lucide-react';
import { GalleryMedia } from '../../types';

export const GalleryPage: React.FC = () => {
  const { galleryMedia, showNotification } = useApp();
  const [selectedType, setSelectedType] = useState<'All' | 'Photo' | 'Video'>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeMediaItem, setActiveMediaItem] = useState<GalleryMedia | null>(null);

  // Dynamic unique categories from galleryMedia
  const uniqueCategories = ['All', ...Array.from(new Set(galleryMedia.map(m => m.category)))];

  const filteredItems = galleryMedia.filter(item => {
    const matchesType = selectedType === 'All' || item.type === selectedType;
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesType && matchesCat;
  });

  return (
    <div className="py-12 bg-[#FAF9F6] min-h-screen text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5" /> High-Resolution Visual Showcase
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900">
            Factory Infrastructure, CNC Bays & Component Media Gallery
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-medium">
            Explore our state-of-the-art manufacturing floor, high-pressure test rigs, robotic cells, and precision machinery in HD photos and video walkthroughs.
          </p>
        </div>

        {/* Filter Controls: Type Tabs & Category Chips */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          
          {/* Media Format Filter (Photos vs Videos vs All) */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setSelectedType('All')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedType === 'All'
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                All Media ({galleryMedia.length})
              </button>
              <button
                onClick={() => setSelectedType('Photo')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedType === 'Photo'
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" /> Photos ({galleryMedia.filter(m => m.type === 'Photo').length})
              </button>
              <button
                onClick={() => setSelectedType('Video')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedType === 'Video'
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                <VideoIcon className="w-3.5 h-3.5" /> Videos ({galleryMedia.filter(m => m.type === 'Video').length})
              </button>
            </div>

            <span className="text-xs font-mono text-slate-500 font-bold">
              Showing {filteredItems.length} of {galleryMedia.length} Assets
            </span>
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-500 mr-2 uppercase tracking-wider">Facility Group:</span>
            {uniqueCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* Media Grid */}
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 space-y-2">
            <p className="text-sm font-semibold">No media items found in this filter combination.</p>
            <button 
              onClick={() => { setSelectedType('All'); setSelectedCategory('All'); }}
              className="text-xs font-mono text-orange-600 font-bold underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredItems.map(item => (
              <div 
                key={item.id}
                onClick={() => setActiveMediaItem(item)}
                className="english-card rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between hover:border-orange-400"
              >
                <div>
                  <div className="relative h-60 bg-slate-900 overflow-hidden">
                    <img 
                      src={item.thumbnail || item.url} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent opacity-80" />

                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="bg-white/95 backdrop-blur px-2.5 py-1 rounded-md text-[10px] font-mono text-slate-900 font-bold border border-slate-200 shadow-sm">
                        {item.category}
                      </span>
                      {item.type === 'Video' && item.videoDuration && (
                        <span className="bg-slate-900/90 text-white px-2 py-1 rounded-md text-[10px] font-mono font-bold shadow-sm">
                          ⏱ {item.videoDuration}
                        </span>
                      )}
                    </div>

                    {item.type === 'Video' ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-950/30 group-hover:bg-slate-950/40 transition-colors">
                        <div className="w-14 h-14 rounded-full bg-orange-600 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                          <Play className="w-6 h-6 fill-current ml-1" />
                        </div>
                      </div>
                    ) : (
                      <div className="absolute top-3 right-3 p-2 rounded-lg bg-white/90 backdrop-blur text-slate-800 shadow-sm">
                        <Maximize2 className="w-4 h-4 text-orange-600" />
                      </div>
                    )}
                  </div>

                  <div className="p-5 space-y-2">
                    <h3 className="text-base font-bold font-heading text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-2">
                      {item.caption}
                    </p>

                    {item.tags && item.tags.length > 0 && (
                      <div className="pt-2 flex flex-wrap gap-1">
                        {item.tags.map((tag, idx) => (
                          <span key={idx} className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-slate-100 mt-3 flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-slate-500">FORMAT: {item.type}</span>
                  <span className="text-xs font-mono font-bold text-orange-700 group-hover:underline flex items-center gap-1">
                    {item.type === 'Video' ? <Play className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    Open Media Detail
                  </span>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* Lightbox / Video Modal Player */}
      {activeMediaItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-3xl max-w-4xl w-full p-6 sm:p-8 relative shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            
            <button 
              onClick={() => setActiveMediaItem(null)}
              className="absolute top-5 right-5 z-20 p-2.5 rounded-full bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
            >
              ✕
            </button>

            <div className="space-y-1">
              <span className="tech-label">{activeMediaItem.category} • {activeMediaItem.type}</span>
              <h2 className="text-2xl font-extrabold text-slate-900 font-heading">
                {activeMediaItem.title}
              </h2>
            </div>

            {/* Media Content */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 max-h-[60vh] flex items-center justify-center">
              {activeMediaItem.type === 'Video' ? (
                <video src={activeMediaItem.url} controls autoPlay className="w-full h-full max-h-[60vh] object-contain" />
              ) : (
                <img src={activeMediaItem.url} alt={activeMediaItem.title} className="w-full h-full max-h-[60vh] object-contain" />
              )}
            </div>

            <p className="text-sm text-slate-700 leading-relaxed font-medium">
              {activeMediaItem.caption}
            </p>

            {activeMediaItem.tags && activeMediaItem.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {activeMediaItem.tags.map((t, idx) => (
                  <span key={idx} className="text-xs font-mono bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200">
                    🏷 {t}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <button
                onClick={() => showNotification(`Downloading high-res media file: ${activeMediaItem.title}`, 'success')}
                className="btn-secondary text-xs"
              >
                <Download className="w-4 h-4 text-orange-600" /> Download HD Asset
              </button>

              <button
                onClick={() => setActiveMediaItem(null)}
                className="btn-primary text-xs"
              >
                Close Viewer
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
