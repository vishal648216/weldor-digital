import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  UserCheck, 
  Plus, 
  CheckCircle2, 
  Lock, 
  Users, 
  Key, 
  Trash2, 
  Edit3, 
  Save, 
  Sparkles, 
  AlertTriangle,
  X,
  Check,
  Layers,
  FileCheck,
  Eye,
  Sliders,
  Search,
  LogIn,
  ChevronRight,
  Shield,
  Briefcase,
  Building,
  CheckSquare
} from 'lucide-react';
import { Role, RoleScope, PermissionAction, CRMModule, Employee } from '../../types';

interface ModuleConfig {
  id: CRMModule;
  label: string;
  description: string;
}

const ALL_CRM_MODULES: ModuleConfig[] = [
  { id: 'dashboard', label: 'Executive Dashboard', description: 'Access KPI metrics, revenue charts, and operational summaries.' },
  { id: 'leads', label: 'Leads & Sales Kanban', description: 'Manage sales pipeline, client stages, and lead assignments.' },
  { id: 'rfqs', label: 'RFQs & CAD Inquiries', description: 'Process customer requests for quote and CAD drawing specs.' },
  { id: 'quotations', label: 'Quotation Engine', description: 'Create, review, approve, and send official commercial quotes.' },
  { id: 'orders', label: 'Orders & B2B Dispatch', description: 'Track production orders, invoices, and logistics courier tracking.' },
  { id: 'employees', label: 'Employee Directory & HRMS', description: 'Manage staff profiles, KYC documents, CTC salary structures, and letters.' },
  { id: 'payroll', label: 'Salary Roll & Payslips', description: 'Calculate monthly payroll, attendance deductions, and bank disbursals.' },
  { id: 'attendance', label: 'Attendance & Leave Logs', description: 'Record daily shifts, overtime hours, and approve leave requests.' },
  { id: 'samples', label: 'Sample Request Cycle', description: 'Process sample requests, lab validations, and test coupons.' },
  { id: 'trials', label: 'Technical Lab Trials', description: 'Conduct metallurgy trials, hardness checks, and test reports.' },
  { id: 'products', label: 'Product Catalog & CAD', description: 'Manage technical product specifications, models, and categories.' },
  { id: 'cms', label: 'Website CMS & Banners', description: 'Update homepage hero banners, image gallery, and marketing content.' },
  { id: 'exhibitions', label: 'Exhibitions & Expos', description: 'Publish upcoming trade fairs, booth numbers, and QR visitor forms.' },
  { id: 'settings', label: 'Company Settings & Banking', description: 'Edit corporate legal details, bank accounts, and SLA thresholds.' },
  { id: 'rbac', label: 'Security & RBAC Matrix', description: 'Configure custom roles, access scopes, and module permissions.' },
  { id: 'audit', label: 'Security Audit Logs', description: 'Review chronological user activity and session security logs.' },
];

const ALL_ACTIONS: { id: PermissionAction; label: string }[] = [
  { id: 'view', label: 'View' },
  { id: 'create', label: 'Create' },
  { id: 'edit', label: 'Edit' },
  { id: 'delete', label: 'Delete' },
  { id: 'approve', label: 'Approve' },
  { id: 'export', label: 'Export' },
  { id: 'publish', label: 'Publish' },
  { id: 'assign', label: 'Assign' },
];

export const RBACManager: React.FC = () => {
  const { 
    roles, 
    addRole, 
    updateRole, 
    deleteRole, 
    employees, 
    updateEmployee, 
    showNotification,
    currentRole,
    setCurrentRole,
    setCurrentEmployee,
    currentEmployee
  } = useApp();

  const [activeTab, setActiveTab] = useState<'staff' | 'matrix'>('staff');
  const [selectedRoleId, setSelectedRoleId] = useState<string>(roles[0]?.id || 'role-super-admin');
  const [searchEmployeeQuery, setSearchEmployeeQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [expandedEmployeeId, setExpandedEmployeeId] = useState<string | null>(null);

  // Custom Role Modal state
  const [isCreateRoleModalOpen, setIsCreateRoleModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');
  const [newRoleScope, setNewRoleScope] = useState<RoleScope>('Assigned');
  const [roleTemplate, setRoleTemplate] = useState<'custom' | 'sales' | 'ops' | 'readonly'>('custom');

  // Assign staff to role modal state
  const [isAssignStaffModalOpen, setIsAssignStaffModalOpen] = useState(false);
  const [targetRoleIdForAssign, setTargetRoleIdForAssign] = useState<string | null>(null);
  const [selectedStaffIdsToAssign, setSelectedStaffIdsToAssign] = useState<string[]>([]);

  // Edit Role Info Modal state
  const [isEditRoleModalOpen, setIsEditRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const selectedRole = roles.find(r => r.id === selectedRoleId) || roles[0];

  const handleTogglePermission = (module: CRMModule, action: PermissionAction) => {
    if (selectedRole.name === 'Super Admin') {
      showNotification('Super Admin role has full permanent system access.', 'info');
      return;
    }

    const currentPermissions = selectedRole.permissions || [];
    const ruleIndex = currentPermissions.findIndex(p => p.module === module);

    let updatedPermissions = [...currentPermissions];

    if (ruleIndex >= 0) {
      const existingActions = updatedPermissions[ruleIndex].actions;
      if (existingActions.includes(action)) {
        updatedPermissions[ruleIndex] = {
          ...updatedPermissions[ruleIndex],
          actions: existingActions.filter(a => a !== action)
        };
      } else {
        updatedPermissions[ruleIndex] = {
          ...updatedPermissions[ruleIndex],
          actions: [...existingActions, action]
        };
      }
    } else {
      updatedPermissions.push({ module, actions: [action] });
    }

    updateRole(selectedRole.id, { permissions: updatedPermissions });
  };

  const handleToggleAllForModule = (module: CRMModule) => {
    if (selectedRole.name === 'Super Admin') return;

    const currentPermissions = selectedRole.permissions || [];
    const rule = currentPermissions.find(p => p.module === module);
    const hasAll = rule && rule.actions.length === ALL_ACTIONS.length;

    let updatedPermissions = currentPermissions.filter(p => p.module !== module);

    if (!hasAll) {
      updatedPermissions.push({
        module,
        actions: ALL_ACTIONS.map(a => a.id)
      });
    }

    updateRole(selectedRole.id, { permissions: updatedPermissions });
  };

  const handleStaffRoleChange = (emp: Employee, newRoleId: string) => {
    const targetRole = roles.find(r => r.id === newRoleId);
    if (!targetRole) return;

    updateEmployee(emp.id, {
      roleId: targetRole.id,
      roleName: targetRole.name as any,
      scope: targetRole.scope as any
    });

    // If current logged-in employee was edited, update active session role too
    if (currentEmployee && currentEmployee.id === emp.id) {
      setCurrentRole(targetRole);
    }

    showNotification(`Assigned role "${targetRole.name}" (${targetRole.scope}) to ${emp.name}`, 'success');
  };

  const handleSimulateLogin = (emp: Employee) => {
    const empRole = roles.find(r => r.id === emp.roleId || r.name === emp.roleName) || roles[0];
    setCurrentEmployee(emp);
    setCurrentRole(empRole);
    showNotification(`Active user switched to: ${emp.name} (${empRole.name} - ${empRole.scope} Scope)`, 'info');
  };

  const handleOpenAssignStaffModal = (roleId: string) => {
    setTargetRoleIdForAssign(roleId);
    const alreadyInRole = employees.filter(e => e.roleId === roleId).map(e => e.id);
    setSelectedStaffIdsToAssign(alreadyInRole);
    setIsAssignStaffModalOpen(true);
  };

  const handleSaveBulkStaffAssignment = () => {
    if (!targetRoleIdForAssign) return;
    const targetRole = roles.find(r => r.id === targetRoleIdForAssign);
    if (!targetRole) return;

    employees.forEach(emp => {
      const shouldHaveRole = selectedStaffIdsToAssign.includes(emp.id);
      if (shouldHaveRole && emp.roleId !== targetRole.id) {
        updateEmployee(emp.id, {
          roleId: targetRole.id,
          roleName: targetRole.name as any,
          scope: targetRole.scope as any
        });
      }
    });

    setIsAssignStaffModalOpen(false);
    showNotification(`Role "${targetRole.name}" assigned to selected employees!`, 'success');
  };

  const handleCreateRoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;

    let defaultPermissions: { module: CRMModule; actions: PermissionAction[] }[] = [];

    if (roleTemplate === 'sales') {
      defaultPermissions = [
        { module: 'dashboard', actions: ['view'] },
        { module: 'leads', actions: ['view', 'create', 'edit', 'assign'] },
        { module: 'rfqs', actions: ['view', 'create', 'edit'] },
        { module: 'quotations', actions: ['view', 'create', 'edit'] },
        { module: 'orders', actions: ['view'] },
        { module: 'products', actions: ['view'] },
        { module: 'samples', actions: ['view', 'create'] },
      ];
    } else if (roleTemplate === 'ops') {
      defaultPermissions = [
        { module: 'dashboard', actions: ['view'] },
        { module: 'orders', actions: ['view', 'edit', 'approve'] },
        { module: 'samples', actions: ['view', 'create', 'edit', 'approve'] },
        { module: 'trials', actions: ['view', 'create', 'edit', 'approve'] },
        { module: 'products', actions: ['view', 'create', 'edit'] },
      ];
    } else if (roleTemplate === 'readonly') {
      defaultPermissions = ALL_CRM_MODULES.map(m => ({
        module: m.id,
        actions: ['view' as PermissionAction]
      }));
    } else {
      defaultPermissions = [
        { module: 'dashboard', actions: ['view'] },
        { module: 'leads', actions: ['view', 'create'] },
      ];
    }

    await addRole({
      name: newRoleName,
      description: newRoleDescription,
      scope: newRoleScope,
      isSystem: false,
      permissions: defaultPermissions
    });

    setNewRoleName('');
    setNewRoleDescription('');
    setNewRoleScope('Assigned');
    setIsCreateRoleModalOpen(false);
    showNotification(`Custom Role "${newRoleName}" created successfully!`, 'success');
  };

  // Filtered Employees list
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = 
      emp.name.toLowerCase().includes(searchEmployeeQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchEmployeeQuery.toLowerCase()) ||
      (emp.designation && emp.designation.toLowerCase().includes(searchEmployeeQuery.toLowerCase())) ||
      (emp.employeeCode && emp.employeeCode.toLowerCase().includes(searchEmployeeQuery.toLowerCase()));

    const matchesDept = departmentFilter === 'All' || emp.department === departmentFilter;

    return matchesSearch && matchesDept;
  });

  const departments = ['All', ...Array.from(new Set(employees.map(e => e.department).filter(Boolean)))];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700 shadow-xl text-white">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
              ENTERPRISE RBAC & ACCESS CONTROL
            </span>
            <span className="text-slate-400 text-xs font-mono">
              Active User: <strong className="text-white">{currentEmployee?.name || 'Super Admin'}</strong> ({currentRole?.name} • {currentRole?.scope} Scope)
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight font-heading">
            Employee Role Assignment & RBAC Matrix
          </h1>
          <p className="text-slate-300 text-xs max-w-2xl font-sans">
            Select employees from the staff list to assign specific operational roles. Changes immediately restrict or grant access to CRM modules, analytics, and actions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex p-1 bg-slate-800 border border-slate-700 rounded-xl">
            <button
              onClick={() => setActiveTab('staff')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'staff'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Staff Assignment ({employees.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('matrix')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'matrix'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Role Matrix ({roles.length})</span>
            </button>
          </div>

          <button
            onClick={() => setIsCreateRoleModalOpen(true)}
            className="btn-primary text-xs py-2 px-3.5 shadow-orange-500/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Custom Role</span>
          </button>
        </div>
      </div>

      {/* TAB 1: STAFF ROLE ASSIGNMENT & DIRECTORY */}
      {activeTab === 'staff' ? (
        <div className="space-y-4">
          {/* Filter & Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search staff by name, email, designation..."
                value={searchEmployeeQuery}
                onChange={e => setSearchEmployeeQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-orange-500 font-sans"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs font-mono text-slate-500 font-bold whitespace-nowrap">Department:</span>
              {departments.map(dept => (
                <button
                  key={dept}
                  onClick={() => setDepartmentFilter(dept)}
                  className={`px-3 py-1.5 text-xs rounded-xl font-mono font-bold transition-all whitespace-nowrap cursor-pointer ${
                    departmentFilter === dept
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          {/* Employee Directory Cards with Direct Role Assignment */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEmployees.map(emp => {
              const empRole = roles.find(r => r.id === emp.roleId || r.name === emp.roleName) || roles[0];
              const isCurrentSessionUser = currentEmployee?.id === emp.id;
              const isExpanded = expandedEmployeeId === emp.id;

              return (
                <div 
                  key={emp.id}
                  className={`bg-white rounded-2xl border shadow-2xs transition-all p-5 space-y-4 ${
                    isCurrentSessionUser 
                      ? 'border-orange-400 ring-2 ring-orange-400/20' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Card Header: Avatar & Info */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {emp.avatarUrl ? (
                        <img 
                          src={emp.avatarUrl} 
                          alt={emp.name} 
                          className="w-11 h-11 rounded-xl object-cover border border-slate-200 shadow-2xs" 
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-white font-black flex items-center justify-center text-sm shadow-xs">
                          {emp.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-slate-900 text-sm font-heading">{emp.name}</h3>
                          {isCurrentSessionUser && (
                            <span className="bg-orange-100 text-orange-800 text-[9px] font-mono font-black px-1.5 py-0.5 rounded">
                              YOU
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 font-sans font-medium">{emp.designation}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{emp.department}</p>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                      {emp.employeeCode || emp.employeeId}
                    </span>
                  </div>

                  {/* Role Assignment Selector */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-mono font-bold text-slate-700 uppercase flex items-center gap-1">
                        <Key className="w-3 h-3 text-orange-600" /> Assigned Security Role:
                      </label>
                      <span className="text-[9.5px] font-mono text-slate-500 font-bold bg-white px-1.5 py-0.5 rounded border border-slate-200">
                        {empRole.scope} Scope
                      </span>
                    </div>

                    <select
                      value={empRole.id}
                      onChange={e => handleStaffRoleChange(emp, e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden cursor-pointer shadow-2xs font-mono"
                    >
                      {roles.map(r => (
                        <option key={r.id} value={r.id}>
                          {r.name} ({r.scope} Visibility)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quick Permissions Breakdown Preview */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-500">Accessible Modules:</span>
                      <button
                        onClick={() => setExpandedEmployeeId(isExpanded ? null : emp.id)}
                        className="text-orange-600 hover:text-orange-700 font-bold flex items-center gap-0.5 cursor-pointer"
                      >
                        <span>{isExpanded ? 'Hide Details' : 'View Permissions'}</span>
                        <ChevronRight className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      </button>
                    </div>

                    {/* Collapsible Detailed Permissions Table */}
                    {isExpanded && (
                      <div className="mt-2 bg-slate-900 text-slate-200 p-3 rounded-xl text-[10.5px] font-mono space-y-2 max-h-48 overflow-y-auto border border-slate-800">
                        <div className="font-bold text-orange-400 border-b border-slate-700 pb-1 flex justify-between">
                          <span>MODULE</span>
                          <span>PERMISSIONS</span>
                        </div>
                        {ALL_CRM_MODULES.map(mod => {
                          const rule = empRole.permissions?.find(p => p.module === mod.id);
                          const actions = empRole.name === 'Super Admin' 
                            ? ALL_ACTIONS.map(a => a.id) 
                            : (rule ? rule.actions : []);
                          
                          if (actions.length === 0) return null;

                          return (
                            <div key={mod.id} className="flex items-center justify-between py-0.5 border-b border-slate-800/60">
                              <span className="text-slate-300 truncate max-w-[120px]">{mod.label}</span>
                              <div className="flex gap-1 flex-wrap justify-end">
                                {actions.map(act => (
                                  <span key={act} className="bg-slate-800 text-emerald-400 px-1 py-0.2 rounded text-[9px]">
                                    {act}
                                  </span>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Card Actions: Switch Active User Session */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleSimulateLogin(emp)}
                      className={`w-full py-2 px-3 rounded-xl font-mono font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        isCurrentSessionUser
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 hover:bg-orange-600 text-slate-700 hover:text-white border border-slate-200'
                      }`}
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>{isCurrentSessionUser ? 'Active Session' : 'Simulate Login As User'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* TAB 2: ROLE PERMISSION MATRIX & CUSTOM ROLES */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Role Selector Cards */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between pb-1">
              <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                System & Custom Roles ({roles.length}):
              </span>
            </div>

            <div className="space-y-2.5">
              {roles.map(role => {
                const isSelected = role.id === selectedRole.id;
                const assignedEmployees = employees.filter(e => e.roleId === role.id || e.roleName === role.name);

                return (
                  <div
                    key={role.id}
                    onClick={() => setSelectedRoleId(role.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? 'bg-orange-50/60 border-orange-500 shadow-md ring-1 ring-orange-500/30'
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-slate-900 text-sm font-heading">{role.name}</h4>
                          {role.name === 'Super Admin' && (
                            <span className="text-[9.5px] font-mono font-bold bg-orange-200 text-orange-900 px-1.5 py-0.5 rounded">
                              Root Admin
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2">{role.description}</p>
                      </div>

                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md shrink-0 ${
                        role.scope === 'All' ? 'bg-emerald-100 text-emerald-800' :
                        role.scope === 'Team' ? 'bg-blue-100 text-blue-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {role.scope} Scope
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-mono">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenAssignStaffModal(role.id);
                        }}
                        className="text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>{assignedEmployees.length} Staff Assigned</span>
                        <span className="text-[10px] bg-orange-100 px-1 rounded text-orange-800">+ Add</span>
                      </button>

                      {role.name !== 'Super Admin' && (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingRole(role);
                              setIsEditRoleModalOpen(true);
                            }}
                            className="p-1 text-slate-400 hover:text-slate-600"
                            title="Edit Role Details"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm(`Delete custom role "${role.name}"?`)) {
                                deleteRole(role.id);
                                showNotification(`Role deleted`, 'info');
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600"
                            title="Delete Role"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Permission Matrix Grid */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-slate-900 text-lg font-heading">
                    Permission Matrix: <span className="text-orange-600">{selectedRole.name}</span>
                  </h3>
                  <span className="text-xs font-mono font-bold bg-orange-100 text-orange-800 px-2.5 py-0.5 rounded-full">
                    {selectedRole.scope} Scope Visibility
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {selectedRole.name === 'Super Admin' 
                    ? 'Super Admin has permanent full master permissions across all modules.' 
                    : `Toggle granular CRUD and approval permissions for the ${selectedRole.name} role.`}
                </p>
              </div>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-mono font-bold">
                    <th className="py-2.5 px-3">CRM Module</th>
                    {ALL_ACTIONS.map(act => (
                      <th key={act.id} className="py-2.5 px-2 text-center uppercase tracking-wider text-[10px]">
                        {act.label}
                      </th>
                    ))}
                    {selectedRole.name !== 'Super Admin' && (
                      <th className="py-2.5 px-2 text-right text-[10px]">Toggle</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {ALL_CRM_MODULES.map(mod => {
                    const rule = selectedRole.permissions?.find(p => p.module === mod.id);
                    const activeActions = selectedRole.name === 'Super Admin' 
                      ? ALL_ACTIONS.map(a => a.id) 
                      : (rule ? rule.actions : []);
                    
                    const isAllChecked = activeActions.length === ALL_ACTIONS.length;

                    return (
                      <tr key={mod.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-3">
                          <p className="font-bold text-slate-900 text-xs">{mod.label}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{mod.description}</p>
                        </td>

                        {ALL_ACTIONS.map(act => {
                          const isChecked = activeActions.includes(act.id);
                          const isDisabled = selectedRole.name === 'Super Admin';

                          return (
                            <td key={act.id} className="py-3 px-2 text-center">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                disabled={isDisabled}
                                onChange={() => handleTogglePermission(mod.id, act.id)}
                                className={`rounded border-slate-300 text-orange-600 focus:ring-orange-500 w-4 h-4 ${
                                  isDisabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                                }`}
                              />
                            </td>
                          );
                        })}

                        {selectedRole.name !== 'Super Admin' && (
                          <td className="py-3 px-2 text-right">
                            <button
                              type="button"
                              onClick={() => handleToggleAllForModule(mod.id)}
                              className="text-[10px] font-mono text-orange-700 hover:text-orange-900 font-bold underline cursor-pointer"
                            >
                              {isAllChecked ? 'Clear' : 'All'}
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer Summary */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-mono text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Auto-saved in real-time. Employee permissions sync instantly.</span>
              </span>
              <span>Total Active Modules: {ALL_CRM_MODULES.length}</span>
            </div>

          </div>

        </div>
      )}

      {/* ASSIGN EMPLOYEES TO ROLE MODAL */}
      {isAssignStaffModalOpen && targetRoleIdForAssign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Assign Employees to Role</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Role: <strong className="text-orange-400">{roles.find(r => r.id === targetRoleIdForAssign)?.name}</strong>
                </p>
              </div>
              <button onClick={() => setIsAssignStaffModalOpen(false)} className="p-1 text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <p className="text-slate-600">Select employees below who should have this role assigned:</p>
              <div className="space-y-2 max-h-60 overflow-y-auto border border-slate-200 rounded-xl p-2">
                {employees.map(emp => {
                  const isChecked = selectedStaffIdsToAssign.includes(emp.id);
                  return (
                    <label 
                      key={emp.id}
                      className={`flex items-center justify-between p-2.5 rounded-xl border transition-colors cursor-pointer ${
                        isChecked ? 'bg-orange-50 border-orange-300' : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={e => {
                            if (e.target.checked) {
                              setSelectedStaffIdsToAssign(prev => [...prev, emp.id]);
                            } else {
                              setSelectedStaffIdsToAssign(prev => prev.filter(id => id !== emp.id));
                            }
                          }}
                          className="rounded border-slate-300 text-orange-600 focus:ring-orange-500 w-4 h-4"
                        />
                        <div>
                          <p className="font-bold text-slate-900 text-xs">{emp.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{emp.designation} • {emp.department}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">
                        Current: {roles.find(r => r.id === emp.roleId)?.name || 'Default'}
                      </span>
                    </label>
                  );
                })}
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAssignStaffModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveBulkStaffAssignment}
                  className="btn-primary text-xs py-2 px-5 shadow-orange-500/20"
                >
                  Save Staff Assignments
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE CUSTOM ROLE MODAL */}
      {isCreateRoleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Create New Custom Security Role</h3>
                <p className="text-xs text-slate-400 mt-0.5">Define custom role name, scope, and template permissions.</p>
              </div>
              <button onClick={() => setIsCreateRoleModalOpen(false)} className="p-1 text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRoleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Role Title / Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Regional Sales Executive"
                  value={newRoleName}
                  onChange={e => setNewRoleName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 font-sans text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Role Description</label>
                <textarea
                  rows={2}
                  placeholder="Briefly describe what this role does..."
                  value={newRoleDescription}
                  onChange={e => setNewRoleDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 font-sans text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Data Visibility Scope</label>
                  <select
                    value={newRoleScope}
                    onChange={e => setNewRoleScope(e.target.value as RoleScope)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 font-sans text-xs"
                  >
                    <option value="All">All Scope (Global View)</option>
                    <option value="Team">Team Scope (Department View)</option>
                    <option value="Assigned">Assigned Only (Personal View)</option>
                    <option value="Location">Location / Plant Scope</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Permission Template</label>
                  <select
                    value={roleTemplate}
                    onChange={e => setRoleTemplate(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 font-sans text-xs"
                  >
                    <option value="sales">Sales & RFQ Template</option>
                    <option value="ops">Production & QC Template</option>
                    <option value="readonly">Read-Only View All</option>
                    <option value="custom">Custom (Blank)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCreateRoleModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-2 px-5 shadow-orange-500/20"
                >
                  Create Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT ROLE INFO MODAL */}
      {isEditRoleModalOpen && editingRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Edit Role Information</h3>
                <p className="text-xs text-slate-400 mt-0.5">{editingRole.name}</p>
              </div>
              <button onClick={() => setIsEditRoleModalOpen(false)} className="p-1 text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Role Title</label>
                <input
                  type="text"
                  value={editingRole.name}
                  onChange={e => setEditingRole({ ...editingRole, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingRole.description}
                  onChange={e => setEditingRole({ ...editingRole, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Visibility Scope</label>
                <select
                  value={editingRole.scope}
                  onChange={e => setEditingRole({ ...editingRole, scope: e.target.value as RoleScope })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                >
                  <option value="All">All Scope (Global View)</option>
                  <option value="Team">Team Scope (Department View)</option>
                  <option value="Assigned">Assigned Only (Personal View)</option>
                  <option value="Location">Location / Plant Scope</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditRoleModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateRole(editingRole.id, {
                      name: editingRole.name,
                      description: editingRole.description,
                      scope: editingRole.scope
                    });
                    setIsEditRoleModalOpen(false);
                    showNotification(`Role updated`, 'success');
                  }}
                  className="btn-primary text-xs py-2 px-5 shadow-orange-500/20"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
