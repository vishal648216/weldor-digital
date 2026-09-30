import React from 'react';
import { useApp } from '../../context/AppContext';
import { LogOut, Laptop, ShieldAlert, KeyRound, ArrowRight } from 'lucide-react';

export const ConcurrentLogoutAlert: React.FC = () => {
  const { isConcurrentLogoutAlertOpen, closeConcurrentLogoutAlert, openLoginModal } = useApp();

  if (!isConcurrentLogoutAlertOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-rose-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="bg-rose-600 p-6 text-white text-center">
          <div className="w-14 h-14 rounded-2xl bg-white/20 border border-white/30 mx-auto flex items-center justify-center mb-3">
            <ShieldAlert className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-extrabold font-heading text-white">
            Session Terminated
          </h2>
          <p className="text-xs text-rose-100 mt-1 font-mono">
            Logged In From Another Device / Browser
          </p>
        </div>

        <div className="p-6 space-y-4 text-center">
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-900 space-y-2 text-left">
            <div className="flex items-center gap-2 font-bold font-mono text-rose-800">
              <Laptop className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Concurrent Login Detected:</span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              A new active session for this account was just opened in another browser window or system. Under company security policy, only <strong>1 active session per user</strong> is allowed.
            </p>
          </div>

          <p className="text-xs text-slate-500 font-sans">
            To continue working from this device, please log back in. Doing so will re-claim the active session.
          </p>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                closeConcurrentLogoutAlert();
                openLoginModal();
              }}
              className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-mono text-xs font-bold shadow-md shadow-orange-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <span>Log Back In on This Device</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={closeConcurrentLogoutAlert}
              className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-mono text-xs font-bold cursor-pointer transition-all"
            >
              Close & View Public Site
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
