import React, { useState, useEffect } from 'react';
import { ArrowUp, MessageSquare, FileUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ScrollToTop: React.FC = () => {
  const { setActiveView } = useApp();
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      
      setScrollProgress(progress);
      setIsVisible(scrollTop > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-center gap-2.5 animate-in fade-in slide-in-from-bottom duration-300">
      
      {/* Floating WhatsApp Quick Connect */}
      <button
        onClick={() => {
          window.open('https://wa.me/918780098088?text=Hello%20Weldor%20Sales%20Team%2C%20I%20have%20an%20urgent%20industrial%20inquiry.', '_blank');
        }}
        className="w-11 h-11 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 flex items-center justify-center transition-all hover:scale-110 group"
        title="Chat on WhatsApp"
        aria-label="Chat on WhatsApp"
      >
        <MessageSquare className="w-5 h-5 fill-current" />
      </button>

      {/* Floating Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="w-11 h-11 rounded-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 shadow-xl flex items-center justify-center transition-all hover:scale-110 relative group"
        title="Scroll to Top"
        aria-label="Scroll to Top"
      >
        {/* Circular Progress Ring */}
        <svg className="w-11 h-11 absolute inset-0 -rotate-90 pointer-events-none" viewBox="0 0 36 36">
          <path
            className="text-slate-100"
            strokeWidth="2.5"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className="text-orange-600 transition-all duration-150"
            strokeDasharray={`${scrollProgress}, 100`}
            strokeWidth="2.5"
            strokeLinecap="round"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>

        <ArrowUp className="w-4 h-4 text-slate-800 group-hover:text-orange-600 transition-colors relative z-10" />
      </button>

    </div>
  );
};
