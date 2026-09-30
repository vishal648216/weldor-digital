import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  X, 
  Sparkles, 
  UserCheck, 
  AlertCircle,
  Building2,
  ArrowRight,
  KeyRound
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login, employees, isLoginModalOpen, closeLoginModal } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen && !isLoginModalOpen) return null;

  const handleClose = () => {
    setErrorMessage(null);
    if (onClose) onClose();
    else closeLoginModal();
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both work email and password.');
      return;
    }

    setIsLoading(true);
    const result = await login(email.trim(), password.trim());
    setIsLoading(false);

    if (!result.success) {
      setErrorMessage(result.message || 'Invalid credentials.');
    } else {
      handleClose();
    }
  };

  const selectDemoAccount = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMessage(null);
  };

  // Demo accounts list
  const demoAccounts = [
    {
      name: 'Vikram Mehta',
      role: 'Super Admin',
      email: 'vikram.mehta@weldorindustries.com',
      password: 'Weldor@2026',
      badge: 'bg-purple-100 text-purple-800 border-purple-200',
    },
    {
      name: 'Rajesh Sharma',
      role: 'Head of Production',
      email: 'rajesh.sharma@weldorindustries.com',
      password: 'Rajesh@123',
      badge: 'bg-amber-100 text-amber-800 border-amber-200',
    },
    {
      name: 'Priya Patel',
      role: 'Sales Head',
      email: 'priya.patel@weldorindustries.com',
      password: 'Priya@123',
      badge: 'bg-blue-100 text-blue-800 border-blue-200',
    },
    {
      name: 'Amit Verma',
      role: 'QC & Metallurgy Lead',
      email: 'amit.verma@weldorindustries.com',
      password: 'Amit@123',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Banner */}
        <div className="bg-linear-to-r from-slate-900 via-slate-800 to-orange-950 p-6 text-white relative">
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-orange-600/30 border border-orange-500/50 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <span className="text-[11px] font-mono tracking-widest text-orange-400 font-bold uppercase">
                Enterprise Authentication
              </span>
              <h2 className="text-xl font-extrabold font-heading text-white">
                Weldor Staff & CRM Portal
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-300 font-sans mt-1">
            Single Active Session: Logging in here will automatically sign out any other active device sessions.
          </p>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5">

          {/* Error Alert */}
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs font-mono text-rose-800 flex items-center gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Quick Demo Switcher */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500 font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-orange-500" /> Quick Demo Accounts:
              </span>
              <span className="text-[11px] text-slate-400">Click to autofill</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map(acc => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => selectDemoAccount(acc.email, acc.password)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer hover:border-orange-400 hover:shadow-xs ${
                    email === acc.email ? 'bg-orange-50/70 border-orange-400 ring-2 ring-orange-200' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900 truncate">{acc.name}</span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-md border font-semibold ${acc.badge}`}>
                      {acc.role.split(' ')[0]}
                    </span>
                  </div>
                  <p className="text-[10.5px] font-mono text-slate-500 truncate">{acc.email}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
                Corporate Work Email *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="e.g. vikram.mehta@weldorindustries.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-100 focus:outline-hidden font-sans"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-mono font-bold text-slate-700">
                  Password *
                </label>
                <span className="text-[11px] font-mono text-orange-600">Encrypted Session</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:border-orange-500 focus:ring-2 focus:ring-orange-100 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-mono text-sm font-bold shadow-md shadow-orange-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Authenticating & Verifying Single Session...</span>
              ) : (
                <>
                  <span>Sign In & Open Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500 flex items-start gap-2">
            <KeyRound className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <p>
              <strong>Security Protocol:</strong> Weldor Industries enforces single concurrent active sessions. If another administrator or employee signs in with this account on another computer or browser, this window will be securely signed out.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
