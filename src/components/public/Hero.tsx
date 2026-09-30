import React, { useState, useEffect, useRef } from 'react';
import { useApp, type ViewMode } from '../../context/AppContext';
import { 
  ArrowRight, 
  FileUp, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle2, 
  Sparkles,
  Box,
  Play,
  Pause,
  Layers,
  ShieldCheck,
  Flame,
  Cpu,
  Eye
} from 'lucide-react';
import type { HeroBanner } from '../../types';

const FALLBACK_BANNER: HeroBanner = {
  id: 'banner-default',
  badge: 'ISO 9001:2015 Certified OEM/ODM Manufacturer',
  title: 'Next-Gen Hydraulic, Pneumatic & CNC Precision Engineering',
  highlightText: 'High-Torque Performance & Global Reliability',
  subtitle: 'Industrial Automation & Fluid Power Systems',
  description: 'Weldor Industries manufactures high-precision pneumatic rotary actuators, hydraulic cylinders, welding automation fixtures, and customized CNC machined assemblies.',
  bgImageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1920&q=80',
  transitionEffect: 'zoom',
  overlayTheme: 'dark-glass',
  primaryBtnText: 'Explore Product Catalog',
  primaryBtnAction: 'public-products',
  secondaryBtnText: 'Submit Technical RFQ',
  secondaryBtnAction: 'public-rfq',
  active: true,
  displayOrder: 1,
  autoplayDurationSec: 6,
  features: ['5-Axis High Precision CNC', '100% Hydrostatic Tested', 'Direct Global Export'],
};

export const Hero: React.FC = () => {
  const { banners, setActiveView, setSelectedProduct, products } = useApp();
  
  // Active banners (sorted by displayOrder)
  const activeBanners = (banners || []).filter(b => b && b.active).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  const slideList = activeBanners.length > 0 ? activeBanners : (banners && banners.length > 0 ? banners : [FALLBACK_BANNER]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);

  const currentBanner: HeroBanner = slideList[currentIndex] || slideList[0] || FALLBACK_BANNER;
  const durationMs = (currentBanner?.autoplayDurationSec || 6) * 1000;

  // Auto-play timer with smooth progress bar
  useEffect(() => {
    if (!isPlaying || slideList.length <= 1) return;

    const interval = 50; // update progress every 50ms
    const step = (interval / durationMs) * 100;

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [currentIndex, isPlaying, durationMs, slideList.length]);

  const handleNext = () => {
    if (isTransitioning) return;
    setDirection('next');
    setIsTransitioning(true);
    setProgress(0);
    setCurrentIndex(prev => (prev + 1) % slideList.length);
    setTimeout(() => setIsTransitioning(false), 600);
  };

  const handlePrev = () => {
    if (isTransitioning) return;
    setDirection('prev');
    setIsTransitioning(true);
    setProgress(0);
    setCurrentIndex(prev => (prev - 1 + slideList.length) % slideList.length);
    setTimeout(() => setIsTransitioning(false), 600);
  };

  const goToSlide = (idx: number) => {
    if (idx === currentIndex || isTransitioning) return;
    setDirection(idx > currentIndex ? 'next' : 'prev');
    setIsTransitioning(true);
    setProgress(0);
    setCurrentIndex(idx);
    setTimeout(() => setIsTransitioning(false), 600);
  };

  // Helper for CTA actions
  const handleCtaAction = (action: string) => {
    if (action.startsWith('public-') || action.startsWith('crm-')) {
      setActiveView(action as ViewMode);
    } else {
      setActiveView('public-products');
    }
  };

  // Theme styles helper
  const getThemeStyles = (theme: HeroBanner['overlayTheme']) => {
    switch (theme) {
      case 'orange-tech':
        return {
          gradient: 'from-slate-950/90 via-slate-900/80 to-amber-950/70',
          badgeBg: 'bg-orange-600/90 text-white border-orange-400',
          highlightText: 'from-orange-400 via-amber-300 to-yellow-400',
          cardBorder: 'border-orange-500/40',
          accent: 'text-orange-400'
        };
      case 'blueprint-navy':
        return {
          gradient: 'from-slate-950/95 via-blue-950/85 to-slate-900/80',
          badgeBg: 'bg-blue-600/90 text-white border-blue-400',
          highlightText: 'from-cyan-400 via-blue-300 to-indigo-300',
          cardBorder: 'border-cyan-500/40',
          accent: 'text-cyan-400'
        };
      case 'emerald-precision':
        return {
          gradient: 'from-slate-950/95 via-emerald-950/85 to-slate-900/80',
          badgeBg: 'bg-emerald-600/90 text-white border-emerald-400',
          highlightText: 'from-emerald-400 via-teal-300 to-green-300',
          cardBorder: 'border-emerald-500/40',
          accent: 'text-emerald-400'
        };
      case 'clean-light':
        return {
          gradient: 'from-slate-900/85 via-slate-900/70 to-slate-800/60',
          badgeBg: 'bg-white text-slate-900 border-slate-300',
          highlightText: 'from-amber-400 via-orange-300 to-amber-200',
          cardBorder: 'border-slate-400/40',
          accent: 'text-amber-400'
        };
      case 'dark-glass':
      default:
        return {
          gradient: 'from-slate-950/95 via-slate-900/85 to-slate-950/80',
          badgeBg: 'bg-orange-600/90 text-white border-orange-400',
          highlightText: 'from-orange-400 via-amber-400 to-orange-300',
          cardBorder: 'border-orange-500/30',
          accent: 'text-orange-400'
        };
    }
  };

  const themeStyle = getThemeStyles(currentBanner.overlayTheme);

  // Transition animation class helper
  const getTransitionClass = (effect: HeroBanner['transitionEffect']) => {
    switch (effect) {
      case 'flip-x':
        return 'animate-flip-x';
      case 'flip-y':
        return 'animate-flip-y';
      case 'flop-cube':
        return 'animate-flop-cube';
      case 'fade-glow':
        return 'animate-fade-glow';
      case 'parallax-slide':
        return 'animate-parallax-slide';
      case 'glitch-blur':
        return 'animate-glitch-blur';
      case 'kenburns':
        return 'animate-kenburns';
      case 'zoom':
      default:
        return 'animate-zoom-smooth';
    }
  };

  // Find linked product or fallback
  const matchedProduct = products.find(p => p.sku === currentBanner.productSku) || products[0];

  return (
    <section 
      className="relative overflow-hidden bg-slate-950 text-white min-h-[640px] lg:min-h-[720px] flex items-center border-b border-slate-800 select-none group"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      
      {/* Background Image Layer with Dynamic Animation Effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          key={`bg-${currentBanner.id}-${currentIndex}`}
          className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 transform ${getTransitionClass(currentBanner.transitionEffect)}`}
          style={{ 
            backgroundImage: `url(${currentBanner.bgImageUrl})`,
          }}
        />
        
        {/* Multi-layered High-Tech Overlays */}
        <div className={`absolute inset-0 bg-gradient-to-r ${themeStyle.gradient}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />
        <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
      </div>

      {/* Top Auto-Play Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 z-30">
        <div 
          className="h-full bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 transition-all duration-75 ease-linear shadow-sm"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Main Banner Slide Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headings, Badges, Features, Stats & CTAs */}
          <div 
            key={`text-${currentBanner.id}-${currentIndex}`}
            className="lg:col-span-7 space-y-6 transition-all duration-700 transform animate-fade-in-up"
          >
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono font-bold shadow-lg backdrop-blur-md transition-all">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${themeStyle.badgeBg}`}>
                {currentBanner.transitionEffect.toUpperCase()} SLIDE
              </span>
              <span className="text-slate-200 tracking-wider">
                {currentBanner.badge}
              </span>
            </div>

            {/* Main Title & Gradient Highlight */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] font-heading">
              {currentBanner.title} <br />
              {currentBanner.highlightText && (
                <span className={`text-transparent bg-clip-text bg-gradient-to-r ${themeStyle.highlightText}`}>
                  {currentBanner.highlightText}
                </span>
              )}
            </h1>

            {/* Subtitle & Description */}
            <div className="space-y-2 max-w-2xl">
              <p className="text-sm sm:text-base font-semibold text-orange-400 font-mono">
                {currentBanner.subtitle}
              </p>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                {currentBanner.description}
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-3">
              <button 
                onClick={() => handleCtaAction(currentBanner.primaryBtnAction)}
                className="btn-primary text-xs sm:text-sm px-6 py-3.5 shadow-xl shadow-orange-600/30 hover:shadow-orange-600/50 flex items-center gap-2 group"
              >
                <span>{currentBanner.primaryBtnText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button 
                onClick={() => handleCtaAction(currentBanner.secondaryBtnAction)}
                className="px-5 py-3.5 rounded-xl border border-slate-700 hover:border-slate-500 bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-xs sm:text-sm font-bold backdrop-blur transition-all flex items-center gap-2 shadow-sm"
              >
                <FileUp className="w-4 h-4 text-orange-400" />
                <span>{currentBanner.secondaryBtnText}</span>
              </button>
            </div>

            {/* Micro Stats Row */}
            {currentBanner.stats && currentBanner.stats.length > 0 && (
              <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4">
                {currentBanner.stats.map((st, i) => (
                  <div key={i} className="space-y-0.5">
                    <p className="text-xl sm:text-2xl font-extrabold font-mono text-white tracking-tight">
                      {st.value}
                    </p>
                    <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
                      {st.label}
                    </p>
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* Right Column: Floating 3D Component Showcase Card */}
          <div 
            key={`card-${currentBanner.id}-${currentIndex}`}
            className="lg:col-span-5 transform transition-all duration-700 animate-fade-in-right"
          >
            <div className={`relative rounded-3xl bg-slate-900/85 backdrop-blur-xl p-6 border ${themeStyle.cardBorder} shadow-2xl overflow-hidden group/card`}>
              
              {/* Card Header Badge */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-mono font-bold text-slate-300">
                    {currentBanner.productSku || 'WEL-ISO-SPEC'}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-orange-400 bg-orange-950/60 border border-orange-800/60 px-2 py-0.5 rounded font-bold uppercase">
                  3D CAD Ready
                </span>
              </div>

              {/* Product Visual Container */}
              <div className="relative h-64 sm:h-72 my-4 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center group/img">
                <img 
                  src={currentBanner.productImageUrl || matchedProduct?.image || 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80'} 
                  alt={currentBanner.productName || currentBanner.title} 
                  className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                {/* Floating 3D Badge */}
                <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur border border-slate-700 text-white px-2.5 py-1 rounded-md text-[11px] font-mono font-bold flex items-center gap-1.5 shadow-lg">
                  <Box className="w-3.5 h-3.5 text-orange-400" />
                  <span>Interactive 3D Geometry</span>
                </div>
              </div>

              {/* Product Title & Quick Actions */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold font-heading text-white line-clamp-1">
                  {currentBanner.productName || currentBanner.title}
                </h3>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-400 block text-[9.5px] uppercase font-bold">MANUFACTURING</span>
                    <span className="text-slate-200 font-bold">GIDC Metoda (Rajkot)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9.5px] uppercase font-bold">INSPECTION</span>
                    <span className="text-emerald-400 font-bold">100% Zero Defect QC</span>
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between gap-3">
                  <button 
                    onClick={() => {
                      if (matchedProduct) {
                        setSelectedProduct(matchedProduct);
                      } else {
                        setActiveView('public-products');
                      }
                    }}
                    className="text-xs font-mono font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" /> Inspect 3D CAD
                  </button>

                  <button 
                    onClick={() => setActiveView('public-rfq')}
                    className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold font-mono transition-all shadow-md"
                  >
                    Request B2B Quote
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

    </section>
  );
};
