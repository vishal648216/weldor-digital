import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  UserCheck, 
  ChevronDown, 
  AlertTriangle, 
  ArrowLeft,
  Menu,
  LogOut
} from 'lucide-react';
import type { Role } from '../../types';

interface CRMHeaderProps {
  onToggleSidebar?: () => void;
}

export const CRMHeader: React.FC<CRMHeaderProps> = ({ onToggleSidebar }) => {
  const { 
    currentRole, 
    setCurrentRole, 
    roles, 
    currentEmployee, 
    currentUser,
    leads, 
    setActiveView,
    logout
  } = useApp();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  // Count SLA Violations
  const slaViolatedLeads = leads.filter(l => l.isSlaViolated);

  return (
    <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between gap-3 shrink-0 z-30 text-slate-900 shadow-xs h-16">
      
      {/* Left Title & Scope */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        {/* Mobile Hamburger Toggle */}
        <button
          onClick={onToggleSidebar}
          className="p-2 -ml-1 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 md:hidden transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button
          onClick={() => setActiveView('public-home')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-mono text-slate-800 font-bold border border-slate-300 transition-colors shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-orange-600" />
          <span>Public Website</span>
        </button>

        <div className="h-4 w-px bg-slate-200 hidden sm:block shrink-0" />

        <div className="flex items-center gap-2.5 truncate">
          <img 
            src="/weldor-logo.png" 
            alt="Weldor" 
            className="h-6 w-auto object-contain hidden sm:inline-block" 
          />
          <h2 className="text-sm sm:text-base font-bold text-slate-900 font-heading flex items-center gap-2 truncate">
            <span className="truncate">WELDOR ADMIN & SALES CRM</span>
            <span className="text-[10px] font-mono bg-orange-50 text-orange-800 border border-orange-200 px-2 py-0.5 rounded font-bold hidden md:inline-block shrink-0">
              v1.0 RBAC Light
            </span>
          </h2>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        
        {/* SLA Warning Indicator */}
        {slaViolatedLeads.length > 0 && (
          <button 
            onClick={() => setActiveView('crm-leads')}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono font-bold animate-pulse shadow-xs"
            title="Overdue SLA Leads needing action"
          >
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="hidden sm:inline">{slaViolatedLeads.length} SLA Overdue</span>
            <span className="sm:hidden">{slaViolatedLeads.length}</span>
          </button>
        )}

        {/* Strict Assigned RBAC Role Indicator */}
        {currentUser?.roleName === 'Super Admin' || currentUser?.roleId === 'role-super-admin' || currentRole.name === 'Super Admin' ? (
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-xs font-mono border border-orange-200 text-orange-900 font-bold transition-colors shadow-xs cursor-pointer"
              title="Super Admin Role Directorate"
            >
              <UserCheck className="w-4 h-4 text-orange-600 shrink-0" />
              <span className="hidden lg:inline">Role: <strong>{currentRole.name}</strong> ({currentRole.scope})</span>
              <span className="lg:hidden"><strong>{currentRole.name}</strong></span>
              <ChevronDown className="w-3.5 h-3.5 text-orange-700 shrink-0" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 py-2 text-xs font-mono animate-in fade-in zoom-in duration-150">
                <div className="px-3.5 py-2 border-b border-slate-100 flex items-center justify-between font-bold text-slate-700">
                  <span>Super Admin View Switch:</span>
                  <span className="text-[9px] bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded font-bold">Admin Only</span>
                </div>
                {roles.map((r: Role) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      setCurrentRole(r);
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between hover:bg-orange-50 transition-colors cursor-pointer ${
                      currentRole.id === r.id ? 'text-orange-900 font-bold bg-orange-50 border-l-4 border-orange-600' : 'text-slate-700'
                    }`}
                  >
                    <span>{r.name}</span>
                    <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{r.scope}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Locked Strict Badge for all other employees */
          <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-slate-100 text-xs font-mono border border-slate-200 text-slate-800 font-bold shadow-xs">
            <UserCheck className="w-4 h-4 text-slate-500 shrink-0" />
            <span className="hidden lg:inline">Role: <strong>{currentRole.name}</strong> ({currentRole.scope})</span>
            <span className="lg:hidden"><strong>{currentRole.name}</strong></span>
          </div>
        )}

        {/* User Avatar & Logout Control */}
        <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3 border-l border-slate-200">
          <div className="flex items-center gap-2">
            <img src={currentEmployee.avatarUrl} alt={currentEmployee.name} className="w-8 h-8 rounded-full border border-orange-400 object-cover shadow-xs" />
            <div className="hidden xl:block text-left">
              <p className="text-xs font-bold text-slate-900 leading-none">{currentEmployee.name}</p>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5 font-semibold">{currentEmployee.designation}</p>
            </div>
          </div>

          <button
            onClick={() => {
              logout('USER_ACTION');
            }}
            title="Sign out from this device"
            className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-900 border border-rose-200 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-mono font-bold shadow-xs"
          >
            <span className="hidden md:inline">Sign Out</span>
            <LogOut className="w-4 h-4 text-rose-600" />
          </button>
        </div>

      </div>

    </header>
  );
};
