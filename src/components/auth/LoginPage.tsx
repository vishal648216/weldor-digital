import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  ShieldAlert
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, setActiveView } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both your work email and password.');
      return;
    }

    setIsLoading(true);
    const result = await login(email.trim(), password.trim());
    setIsLoading(false);

    if (!result.success) {
      setErrorMessage(result.message || 'Invalid credentials. Please check your email and password.');
    } else {
      setActiveView('crm-dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans relative overflow-hidden">
      
      {/* Dynamic Background Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md relative z-10">
        <div className="flex items-center gap-3">
          <div className="bg-white px-2.5 py-1 rounded-lg shadow-sm border border-slate-700/50 inline-flex items-center justify-center">
            <img 
              src="/weldor-logo.png" 
              alt="Weldor by Earth Metal Industries" 
              className="h-7 w-auto object-contain" 
            />
          </div>
          <div className="border-l border-slate-700 pl-3">
            <h1 className="text-xs sm:text-sm font-extrabold tracking-tight text-white flex items-center gap-2">
              <span>EARTH METAL INDUSTRIES</span>
              <span className="text-[9px] font-mono bg-orange-950 text-orange-400 border border-orange-500/40 px-2 py-0.5 rounded font-bold">
                PORTAL
              </span>
            </h1>
            <p className="text-[9.5px] font-mono text-slate-400">
              Staff HRMS & Sales CRM Directorate
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveView('public-home')}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-colors border border-slate-700 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-orange-400" />
          <span>Public Website</span>
        </button>
      </header>

      {/* Main Login Card Stage */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 relative z-10 my-6">
        <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
          
          {/* Card Header */}
          <div className="text-center space-y-2">
            <div className="mb-3 flex justify-center">
              <div className="bg-white px-3 py-1.5 rounded-xl shadow-md border border-slate-700/50 inline-flex items-center justify-center">
                <img 
                  src="/weldor-logo.png" 
                  alt="Weldor" 
                  className="h-9 w-auto object-contain mx-auto" 
                />
              </div>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-white">
              Sign In to Workspace
            </h2>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Weldor by Earth Metal Industries CRM & HRMS Access
            </p>
          </div>

          {/* Error Alert Box */}
          {errorMessage && (
            <div className="p-3.5 bg-rose-950/80 border border-rose-500/50 rounded-2xl text-xs font-mono text-rose-300 flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block font-bold text-slate-300 font-mono text-[11px] uppercase tracking-wider">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="admin@weldorindustries.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono text-xs"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block font-bold text-slate-300 font-mono text-[11px] uppercase tracking-wider">
                  Password
                </label>
                <span className="text-[10px] text-slate-500 font-mono">Case-sensitive</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-sm shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Session...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security & Concurrency Notice */}
          <div className="p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-1 text-[11px] text-slate-400">
            <p className="font-bold text-slate-300 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>Single Active Session Policy</span>
            </p>
            <p className="text-[10.5px]">
              Logging in will generate a secure session token and automatically sign out any active sessions on other browsers or computers.
            </p>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs font-mono text-slate-500 border-t border-slate-900 relative z-10">
        <p>© 2026 Weldor Industries Pvt. Ltd. • ISO 9001:2015 Certified Manufacturing</p>
      </footer>

    </div>
  );
};
