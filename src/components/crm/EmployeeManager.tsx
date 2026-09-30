import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import type { Employee, RoleName, EmployeeSalaryStructure } from '../../types';
import { api } from '../../services/api';
import { 
  Users, 
  UserPlus, 
  Search, 
  Building2, 
  Briefcase, 
  Mail, 
  Phone, 
  CreditCard, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Edit3, 
  Trash2, 
  Eye, 
  X, 
  FileText, 
  Shield, 
  Sparkles,
  MapPin,
  Printer,
  Download,
  Award,
  Upload,
  Image as ImageIcon,
  Check,
  Sliders,
  ArrowLeft,
  Settings2,
  RefreshCw,
  Lock,
  EyeOff,
  KeyRound
} from 'lucide-react';

export const EmployeeManager: React.FC = () => {
  const { 
    employees, 
    addEmployee, 
    updateEmployee, 
    deleteEmployee, 
    roles, 
    hasPermission,
    currentUser,
    companySettings
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);
  const [offerLetterEmployee, setOfferLetterEmployee] = useState<Employee | null>(null);
  const [joiningLetterEmployee, setJoiningLetterEmployee] = useState<Employee | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Letter customization mode
  const [isLetterEditMode, setIsLetterEditMode] = useState(false);
  const [customLetterData, setCustomLetterData] = useState({
    signatoryName: '',
    signatoryDesignation: '',
    refNumber: '',
    letterDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
    probationMonths: '3 Months',
    workLocation: 'Plot No. 12/B, Phase II, GIDC Metoda, Rajkot Plant',
    reportingManager: '',
    customNote: '',
  });

  // Photo Upload State
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoUploadError, setPhotoUploadError] = useState<string | null>(null);
  const [showEmployeePassword, setShowEmployeePassword] = useState(false);

  // Form tab state
  const [formTab, setFormTab] = useState<'personal' | 'job' | 'salary' | 'bank'>('personal');

  // Salary Customizer Options State
  const [salaryOptions, setSalaryOptions] = useState({
    mode: 'smart' as 'smart' | 'manual',
    hasHra: true,
    hraMode: 'percent' as 'percent' | 'fixed',
    hraPercent: 40,
    hasDa: true,
    daMode: 'percent' as 'percent' | 'fixed',
    daPercent: 20,
    hasSpecial: true,
    hasConveyance: true,
    conveyanceAmount: 3000,
    hasMedical: true,
    medicalAmount: 3000,
    hasPf: true,
    pfRatePercent: 12,
    hasPt: true,
    ptAmount: 200,
    hasTds: true,
    tdsAmount: 1500,
  });

  // Default Form state
  const defaultFormData: Omit<Employee, 'id'> = {
    employeeId: `WEL-${Math.floor(1000 + Math.random() * 9000)}`,
    employeeCode: `WLD-${String(employees.length + 1).padStart(3, '0')}`,
    name: '',
    fatherName: '',
    dateOfBirth: '1995-01-01',
    dateOfJoining: new Date().toISOString().split('T')[0],
    gender: 'Male',
    employmentType: 'Full-Time',
    designation: '',
    department: 'Sales & BD',
    roleId: roles[2]?.id || 'role-sales-exec',
    roleName: (roles[2]?.name as RoleName) || 'Sales Executive',
    reportingManager: currentUser?.name || 'Super Admin',
    email: '',
    phone: '',
    panNumber: '',
    aadhaarNumber: '',
    uanNumber: '',
    pfNumber: '',
    bankDetails: {
      bankName: 'HDFC Bank Ltd',
      accountNumber: '',
      ifscCode: '',
      branch: 'Ahmedabad',
      accountType: 'Salary',
    },
    salaryStructure: {
      baseSalary: 30000,
      hra: 12000,
      da: 6000,
      specialAllowance: 6000,
      conveyanceAllowance: 3000,
      medicalAllowance: 3000,
      pfDeductionEmployee: 3600,
      pfDeductionEmployer: 3600,
      professionalTax: 200,
      tdsTax: 1500,
      grossMonthlySalary: 60000,
      netMonthlySalary: 54700,
      annualCTC: 763200,
    },
    territory: ['India'],
    productCategories: ['Pneumatic Components'],
    scope: 'Assigned',
    status: 'Active',
    avatarUrl: '',
    address: {
      currentAddress: '',
      city: 'Ahmedabad',
      state: 'Gujarat',
      pincode: '380015',
    },
    emergencyContact: {
      name: '',
      relation: 'Parent / Spouse',
      phone: '',
    },
    password: 'Weldor@2026',
  };

  const [formData, setFormData] = useState<Omit<Employee, 'id'>>(defaultFormData);

  // Fully customizable salary calculation helper
  const computeSalaryStructure = (
    base: number,
    opts = salaryOptions,
    overrides?: Partial<EmployeeSalaryStructure>
  ): EmployeeSalaryStructure => {
    // 1. Allowances
    const hra = opts.hasHra 
      ? (overrides?.hra !== undefined ? overrides.hra : (opts.hraMode === 'percent' ? Math.round(base * (opts.hraPercent / 100)) : 0))
      : 0;

    const da = opts.hasDa 
      ? (overrides?.da !== undefined ? overrides.da : (opts.daMode === 'percent' ? Math.round(base * (opts.daPercent / 100)) : 0))
      : 0;

    const special = opts.hasSpecial 
      ? (overrides?.specialAllowance !== undefined ? overrides.specialAllowance : Math.round(base * 0.2))
      : 0;

    const conveyance = opts.hasConveyance 
      ? (overrides?.conveyanceAllowance !== undefined ? overrides.conveyanceAllowance : opts.conveyanceAmount)
      : 0;

    const medical = opts.hasMedical 
      ? (overrides?.medicalAllowance !== undefined ? overrides.medicalAllowance : opts.medicalAmount)
      : 0;

    const gross = base + hra + da + special + conveyance + medical;

    // 2. Deductions
    const pf = opts.hasPf 
      ? (overrides?.pfDeductionEmployee !== undefined ? overrides.pfDeductionEmployee : Math.round(base * (opts.pfRatePercent / 100)))
      : 0;

    const pt = opts.hasPt 
      ? (overrides?.professionalTax !== undefined ? overrides.professionalTax : opts.ptAmount)
      : 0;

    const tds = opts.hasTds 
      ? (overrides?.tdsTax !== undefined ? overrides.tdsTax : (gross > 100000 ? Math.round(gross * 0.1) : gross > 50000 ? Math.round(gross * 0.05) : 500))
      : 0;

    const totalDeductions = pf + pt + tds;
    const net = Math.max(0, gross - totalDeductions);
    const annualCtc = (gross + pf) * 12;

    return {
      baseSalary: base,
      hra,
      da,
      specialAllowance: special,
      conveyanceAllowance: conveyance,
      medicalAllowance: medical,
      pfDeductionEmployee: pf,
      pfDeductionEmployer: pf,
      professionalTax: pt,
      tdsTax: tds,
      grossMonthlySalary: gross,
      netMonthlySalary: net,
      annualCTC: annualCtc,
    };
  };

  // Handler when base salary or options change
  const handleBaseSalaryChange = (newBase: number) => {
    const updated = computeSalaryStructure(newBase, salaryOptions);
    setFormData(prev => ({
      ...prev,
      salaryStructure: updated
    }));
  };

  const handleSalaryOptionChange = (key: string, value: any) => {
    const nextOpts = { ...salaryOptions, [key]: value };
    setSalaryOptions(nextOpts);
    const updated = computeSalaryStructure(formData.salaryStructure.baseSalary, nextOpts);
    setFormData(prev => ({
      ...prev,
      salaryStructure: updated
    }));
  };

  const handleManualSalaryFieldChange = (field: keyof EmployeeSalaryStructure, val: number) => {
    const current = { ...formData.salaryStructure, [field]: val };
    const gross = current.baseSalary + current.hra + current.da + current.specialAllowance + current.conveyanceAllowance + current.medicalAllowance;
    const deductions = current.pfDeductionEmployee + current.professionalTax + current.tdsTax;
    const net = Math.max(0, gross - deductions);
    const annualCtc = (gross + current.pfDeductionEmployer) * 12;

    setFormData(prev => ({
      ...prev,
      salaryStructure: {
        ...current,
        grossMonthlySalary: gross,
        netMonthlySalary: net,
        annualCTC: annualCtc
      }
    }));
  };

  // Photo Upload Handler (Supports both file input and drag & drop)
  const handlePhotoUpload = async (file: File) => {
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      setPhotoUploadError('File is too large. Maximum size allowed is 8MB.');
      return;
    }

    setPhotoUploadError(null);
    setIsUploadingPhoto(true);

    // 1. Instant local base64 preview
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setFormData(prev => ({ ...prev, avatarUrl: base64 }));
    };
    reader.readAsDataURL(file);

    // 2. Server upload
    try {
      const res = await api.uploadFile(file);
      if (res?.success && res.data?.url) {
        setFormData(prev => ({ ...prev, avatarUrl: res.data.url }));
      }
    } catch (err) {
      console.warn('Server upload fallback to base64 preview:', err);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Filtered employees
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchesSearch = 
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (emp.employeeCode && emp.employeeCode.toLowerCase().includes(searchQuery.toLowerCase())) ||
        emp.designation.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDept = selectedDepartment === 'All' || emp.department === selectedDepartment;
      const matchesStatus = selectedStatus === 'All' || emp.status === selectedStatus;

      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [employees, searchQuery, selectedDepartment, selectedStatus]);

  const departments = ['All', 'Sales & BD', 'Engineering & R&D', 'Production & CNC', 'Quality Control', 'Accounts & Finance', 'HR & Admin', 'Logistics & Dispatch'];

  const openAddModal = () => {
    setFormData({
      ...defaultFormData,
      employeeId: `WEL-${Math.floor(1000 + Math.random() * 9000)}`,
      employeeCode: `WLD-${String(employees.length + 1).padStart(3, '0')}`,
      reportingManager: currentUser?.name || 'Super Admin',
    });
    setFormTab('personal');
    setEditingEmployee(null);
    setPhotoUploadError(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (emp: Employee) => {
    setEditingEmployee(emp);
    setFormData({ ...emp });
    setFormTab('personal');
    setPhotoUploadError(null);
    setIsAddModalOpen(true);
  };

  const handleOpenOfferLetter = (emp: Employee) => {
    setCustomLetterData({
      signatoryName: currentUser?.name || 'Super Admin',
      signatoryDesignation: currentUser?.designation || 'Managing Director & Platform Administrator',
      refNumber: `WEL/HR-OFFER/2026/${emp.employeeCode || emp.employeeId}`,
      letterDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      probationMonths: '3 Months from Joining',
      workLocation: 'Plot No. 12/B, Phase II, GIDC Metoda, Rajkot Plant',
      reportingManager: emp.reportingManager || currentUser?.name || 'Managing Director',
      customNote: '',
    });
    setIsLetterEditMode(false);
    setOfferLetterEmployee(emp);
  };

  const handleOpenJoiningLetter = (emp: Employee) => {
    setCustomLetterData({
      signatoryName: currentUser?.name || 'Super Admin',
      signatoryDesignation: currentUser?.designation || 'Managing Director & Platform Administrator',
      refNumber: `WEL/HR-APPT/2026/${emp.employeeCode || emp.employeeId}`,
      letterDate: emp.dateOfJoining || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      probationMonths: '3 (Three) Months',
      workLocation: 'Plot No. 12/B, Phase II, GIDC Metoda, Rajkot Plant',
      reportingManager: emp.reportingManager || currentUser?.name || 'Managing Director',
      customNote: '',
    });
    setIsLetterEditMode(false);
    setJoiningLetterEmployee(emp);
  };

  const handleSaveEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Please fill all mandatory personal details (Name, Email, Phone).');
      return;
    }

    if (editingEmployee) {
      updateEmployee(editingEmployee.id, formData);
    } else {
      addEmployee(formData);
    }

    setIsAddModalOpen(false);
    setEditingEmployee(null);
  };

  const handleDeleteConfirm = () => {
    if (deletingId) {
      deleteEmployee(deletingId);
      setDeletingId(null);
      if (viewingEmployee?.id === deletingId) {
        setViewingEmployee(null);
      }
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 rounded-2xl text-white shadow-xl border border-slate-700/50">
        <div>
          <div className="flex items-center gap-2.5 text-xs font-mono text-orange-400 font-bold uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>ENTERPRISE HRMS & STAFF DIRECTORY</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Employee Directory & Onboarding
          </h1>
          <p className="text-slate-300 text-xs md:text-sm mt-1 max-w-2xl">
            Register new staff with direct photo upload, flexible custom CTC salary structures (PF / Non-PF, HRA, DA), official offer & appointment letters, and RBAC security access.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openAddModal}
            className="px-5 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm shadow-lg shadow-orange-600/30 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Register New Employee</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, employee code, designation..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-slate-900"
            />
          </div>

          <select
            value={selectedDepartment}
            onChange={e => setSelectedDepartment(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-700 font-medium"
          >
            {departments.map(d => (
              <option key={d} value={d}>{d === 'All' ? 'All Departments' : d}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-700 font-medium"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Probation">Probation</option>
            <option value="On Leave">On Leave</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              viewMode === 'table' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Table View
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              viewMode === 'grid' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Card Grid
          </button>
        </div>
      </div>

      {/* Directory Content */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Employee</th>
                  <th className="py-3.5 px-4">Role & Dept</th>
                  <th className="py-3.5 px-4">Contact Info</th>
                  <th className="py-3.5 px-4">Salary / CTC</th>
                  <th className="py-3.5 px-4">Bank & PAN</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p className="font-bold text-sm text-slate-600">No employees registered yet</p>
                      <p className="text-xs mt-1">Click "+ Register New Employee" to onboard your first staff member.</p>
                      <button
                        onClick={openAddModal}
                        className="mt-4 px-4 py-2 rounded-xl bg-orange-600 text-white font-bold text-xs hover:bg-orange-500 cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>Add Employee Now</span>
                      </button>
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map(emp => (
                    <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                      
                      {/* Employee Info & Photo */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {emp.avatarUrl ? (
                            <img
                              src={emp.avatarUrl}
                              alt={emp.name}
                              className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-2xs"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                              {emp.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'EM'}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-slate-900 text-xs">{emp.name}</p>
                            <p className="text-slate-400 text-[10.5px] font-mono">{emp.employeeCode || emp.employeeId}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role & Department */}
                      <td className="py-3.5 px-4">
                        <div>
                          <p className="font-semibold text-slate-800">{emp.designation}</p>
                          <span className="inline-block text-[10.5px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md mt-0.5">
                            {emp.department}
                          </span>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <p className="text-slate-700 flex items-center gap-1 font-mono text-[11px]">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <span>{emp.email}</span>
                          </p>
                          <p className="text-slate-500 flex items-center gap-1 font-mono text-[11px]">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{emp.phone}</span>
                          </p>
                        </div>
                      </td>

                      {/* Salary / CTC */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono">
                          <p className="font-bold text-slate-900">
                            ₹{(emp.salaryStructure?.grossMonthlySalary || 0).toLocaleString()} <span className="text-[10px] font-normal text-slate-400">/mo</span>
                          </p>
                          <p className="text-[10.5px] text-emerald-600">
                            Net: ₹{(emp.salaryStructure?.netMonthlySalary || 0).toLocaleString()}
                          </p>
                        </div>
                      </td>

                      {/* Bank & PAN */}
                      <td className="py-3.5 px-4">
                        <div className="text-[11px] font-mono text-slate-600">
                          <p className="font-semibold text-slate-800 truncate max-w-[120px]">{emp.bankDetails?.bankName || 'N/A'}</p>
                          <p className="text-slate-400">PAN: {emp.panNumber || 'N/A'}</p>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] font-bold ${
                          emp.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          emp.status === 'Probation' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          emp.status === 'On Leave' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            emp.status === 'Active' ? 'bg-emerald-500' :
                            emp.status === 'Probation' ? 'bg-amber-500' :
                            emp.status === 'On Leave' ? 'bg-blue-500' : 'bg-slate-400'
                          }`} />
                          {emp.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setViewingEmployee(emp)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="View Full Profile & Salary Breakdown"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleOpenOfferLetter(emp)}
                            className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                            title="Print / Generate Job Offer Letter"
                          >
                            <FileText className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleOpenJoiningLetter(emp)}
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                            title="Print / Generate Joining & Appointment Letter"
                          >
                            <Award className="w-4 h-4" />
                          </button>
                          
                          {hasPermission('employees', 'edit') && (
                            <button
                              onClick={() => openEditModal(emp)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-orange-600 hover:bg-orange-50 transition-colors cursor-pointer"
                              title="Edit Employee & CTC"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          )}

                          {hasPermission('employees', 'delete') && emp.roleName !== 'Super Admin' && (
                            <button
                              onClick={() => setDeletingId(emp.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Delete Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Card Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEmployees.map(emp => (
            <div key={emp.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {emp.avatarUrl ? (
                      <img
                        src={emp.avatarUrl}
                        alt={emp.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-2xs"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-white font-bold flex items-center justify-center text-sm shadow-2xs">
                        {emp.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'EM'}
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{emp.name}</h4>
                      <p className="text-xs text-orange-600 font-semibold">{emp.designation}</p>
                      <span className="text-[10px] font-mono text-slate-400">{emp.employeeCode || emp.employeeId}</span>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    emp.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {emp.status}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5" /> Department
                    </span>
                    <span className="font-medium text-slate-800">{emp.department}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5" /> Monthly Gross
                    </span>
                    <span className="font-bold text-slate-900 font-mono">₹{(emp.salaryStructure?.grossMonthlySalary || 0).toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" /> Email
                    </span>
                    <span className="font-mono text-slate-700 truncate max-w-[160px]">{emp.email}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setViewingEmployee(emp)}
                    className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
                  >
                    <span>View</span>
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleOpenOfferLetter(emp)}
                    className="p-1 rounded bg-amber-50 text-amber-700 hover:bg-amber-100 text-[10.5px] font-bold flex items-center gap-0.5 cursor-pointer"
                    title="Generate Offer Letter"
                  >
                    <FileText className="w-3 h-3" />
                    <span>Offer</span>
                  </button>
                  <button
                    onClick={() => handleOpenJoiningLetter(emp)}
                    className="p-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[10.5px] font-bold flex items-center gap-0.5 cursor-pointer"
                    title="Generate Joining Letter"
                  >
                    <Award className="w-3 h-3" />
                    <span>Join</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(emp)}
                    className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-orange-50 hover:text-orange-600 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  {emp.roleName !== 'Super Admin' && (
                    <button
                      onClick={() => setDeletingId(emp.id)}
                      className="p-1.5 rounded-lg bg-slate-100 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* VIEW EMPLOYEE FULL PROFILE MODAL */}
      {viewingEmployee && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                {viewingEmployee.avatarUrl ? (
                  <img
                    src={viewingEmployee.avatarUrl}
                    alt={viewingEmployee.name}
                    className="w-12 h-12 rounded-xl object-cover border-2 border-orange-500 shadow-md"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-orange-600 text-white font-bold flex items-center justify-center text-sm shadow-md border-2 border-orange-400">
                    {viewingEmployee.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'EM'}
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold">{viewingEmployee.name}</h3>
                  <p className="text-xs text-orange-400 font-mono">
                    {viewingEmployee.designation} • {viewingEmployee.department} ({viewingEmployee.employeeCode || viewingEmployee.employeeId})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setViewingEmployee(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-600">
              
              {/* Top Overview Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <div>
                  <span className="text-slate-400 font-mono uppercase text-[10px]">Employment Type</span>
                  <p className="font-bold text-slate-800 mt-0.5">{viewingEmployee.employmentType}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-mono uppercase text-[10px]">Date of Joining</span>
                  <p className="font-bold text-slate-800 mt-0.5 font-mono">{viewingEmployee.dateOfJoining}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-mono uppercase text-[10px]">Security Role</span>
                  <p className="font-bold text-orange-600 mt-0.5">{viewingEmployee.roleName}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-mono uppercase text-[10px]">Status</span>
                  <p className="font-bold text-emerald-600 mt-0.5">{viewingEmployee.status}</p>
                </div>
              </div>

              {/* Salary & CTC Breakdown */}
              <div className="border border-slate-200 rounded-xl p-4 space-y-3 bg-white">
                <h4 className="font-bold text-slate-900 text-sm flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-orange-600" />
                    <span>Monthly Salary & CTC Structure</span>
                  </span>
                  <span className="text-orange-600 font-mono font-bold text-sm">
                    CTC: ₹{(viewingEmployee.salaryStructure?.annualCTC || 0).toLocaleString()} / yr
                  </span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-[11.5px]">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 text-[10px] uppercase">Base Salary</span>
                    <p className="font-bold text-slate-800 mt-0.5">₹{(viewingEmployee.salaryStructure?.baseSalary || 0).toLocaleString()}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 text-[10px] uppercase">HRA</span>
                    <p className="font-bold text-slate-800 mt-0.5">₹{(viewingEmployee.salaryStructure?.hra || 0).toLocaleString()}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 text-[10px] uppercase">Dearness (DA)</span>
                    <p className="font-bold text-slate-800 mt-0.5">₹{(viewingEmployee.salaryStructure?.da || 0).toLocaleString()}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 text-[10px] uppercase">Special Allowance</span>
                    <p className="font-bold text-slate-800 mt-0.5">₹{(viewingEmployee.salaryStructure?.specialAllowance || 0).toLocaleString()}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 text-[10px] uppercase">Conveyance + Med</span>
                    <p className="font-bold text-slate-800 mt-0.5">₹{((viewingEmployee.salaryStructure?.conveyanceAllowance || 0) + (viewingEmployee.salaryStructure?.medicalAllowance || 0)).toLocaleString()}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200">
                    <span className="text-rose-600 text-[10px] uppercase font-bold">PF Deduction</span>
                    <p className="font-bold text-rose-700 mt-0.5">₹{(viewingEmployee.salaryStructure?.pfDeductionEmployee || 0).toLocaleString()}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200">
                    <span className="text-rose-600 text-[10px] uppercase font-bold">PT & TDS Tax</span>
                    <p className="font-bold text-rose-700 mt-0.5">₹{((viewingEmployee.salaryStructure?.professionalTax || 0) + (viewingEmployee.salaryStructure?.tdsTax || 0)).toLocaleString()}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-300">
                    <span className="text-emerald-700 text-[10px] uppercase font-bold">Net In-Hand</span>
                    <p className="font-extrabold text-emerald-800 mt-0.5 text-sm">₹{(viewingEmployee.salaryStructure?.netMonthlySalary || 0).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Bank & Identification */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-1">Banking Details</h4>
                  <p><span className="text-slate-400">Bank:</span> <strong className="text-slate-800">{viewingEmployee.bankDetails?.bankName || 'N/A'}</strong></p>
                  <p><span className="text-slate-400">Account No:</span> <strong className="text-slate-800 font-mono">{viewingEmployee.bankDetails?.accountNumber || 'N/A'}</strong></p>
                  <p><span className="text-slate-400">IFSC Code:</span> <strong className="text-slate-800 font-mono">{viewingEmployee.bankDetails?.ifscCode || 'N/A'}</strong></p>
                  <p><span className="text-slate-400">Branch:</span> <span className="text-slate-700">{viewingEmployee.bankDetails?.branch || 'N/A'}</span></p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-1">Statutory Identifiers & KYC</h4>
                  <p><span className="text-slate-400">PAN Number:</span> <strong className="text-slate-800 font-mono">{viewingEmployee.panNumber || 'N/A'}</strong></p>
                  <p><span className="text-slate-400">Aadhaar No:</span> <strong className="text-slate-800 font-mono">{viewingEmployee.aadhaarNumber || 'N/A'}</strong></p>
                  <p><span className="text-slate-400">PF Number:</span> <span className="text-slate-700 font-mono">{viewingEmployee.pfNumber || 'N/A'}</span></p>
                  <p><span className="text-slate-400">Emergency Phone:</span> <span className="text-slate-700 font-mono">{viewingEmployee.emergencyContact?.phone || 'N/A'}</span></p>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => setViewingEmployee(null)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-200 font-bold cursor-pointer"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const target = viewingEmployee;
                    setViewingEmployee(null);
                    handleOpenOfferLetter(target);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <FileText className="w-4 h-4" />
                  <span>Job Offer Letter</span>
                </button>

                <button
                  onClick={() => {
                    const target = viewingEmployee;
                    setViewingEmployee(null);
                    handleOpenJoiningLetter(target);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Award className="w-4 h-4" />
                  <span>Appointment Letter</span>
                </button>

                <button
                  onClick={() => {
                    openEditModal(viewingEmployee);
                    setViewingEmployee(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ADD / EDIT EMPLOYEE MODAL (4-TAB WIZARD WITH PHOTO UPLOAD & CUSTOM CTC) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[94vh] flex flex-col animate-in fade-in zoom-in duration-200">
            
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">
                  {editingEmployee ? `Edit Employee: ${editingEmployee.name}` : 'Register New Employee & Configure Custom CTC'}
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Upload photo, configure customized CTC allowances & statutory deductions.
                </p>
              </div>

              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 4 Tabs Bar */}
            <div className="flex border-b border-slate-200 bg-slate-50 px-5 text-xs font-bold overflow-x-auto">
              <button
                type="button"
                onClick={() => setFormTab('personal')}
                className={`py-3 px-4 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  formTab === 'personal' ? 'border-orange-600 text-orange-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                1. Personal, KYC & Photo
              </button>
              <button
                type="button"
                onClick={() => setFormTab('job')}
                className={`py-3 px-4 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  formTab === 'job' ? 'border-orange-600 text-orange-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                2. Job & Role Scope
              </button>
              <button
                type="button"
                onClick={() => setFormTab('salary')}
                className={`py-3 px-4 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  formTab === 'salary' ? 'border-orange-600 text-orange-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                3. Custom CTC & Allowances
              </button>
              <button
                type="button"
                onClick={() => setFormTab('bank')}
                className={`py-3 px-4 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  formTab === 'bank' ? 'border-orange-600 text-orange-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                4. Banking & Emergency
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSaveEmployee} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              
              {/* TAB 1: Personal & KYC with Interactive Photo Upload */}
              {formTab === 'personal' && (
                <div className="space-y-4">
                  
                  {/* PHOTO UPLOAD BOX (Drag & Drop + File Upload) */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <label className="block font-bold text-slate-900 mb-2">Employee Profile Photo / Avatar</label>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      {/* Avatar Preview */}
                      <div className="relative">
                        {formData.avatarUrl ? (
                          <img
                            src={formData.avatarUrl}
                            alt="Avatar Preview"
                            className="w-20 h-20 rounded-2xl object-cover border-2 border-orange-500 shadow-md"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 text-slate-500 font-bold flex flex-col items-center justify-center border-2 border-dashed border-slate-300">
                            <ImageIcon className="w-6 h-6 mb-1 opacity-50" />
                            <span className="text-[10px]">No Photo</span>
                          </div>
                        )}
                        {formData.avatarUrl && (
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, avatarUrl: '' }))}
                            className="absolute -top-2 -right-2 p-1 bg-rose-600 text-white rounded-full hover:bg-rose-700 shadow-md cursor-pointer"
                            title="Remove Photo"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      {/* Upload Controls */}
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <label className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold cursor-pointer inline-flex items-center gap-2 shadow-xs transition-colors">
                            <Upload className="w-4 h-4 text-orange-400" />
                            <span>{isUploadingPhoto ? 'Uploading...' : 'Choose Image File'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handlePhotoUpload(file);
                              }}
                            />
                          </label>

                          {formData.avatarUrl && (
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, avatarUrl: '' }))}
                              className="px-3 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold cursor-pointer"
                            >
                              Remove
                            </button>
                          )}
                        </div>

                        <p className="text-[11px] text-slate-500">
                          Supports PNG, JPG, JPEG, WebP (Max 8MB). Upload directly from your computer.
                        </p>

                        {photoUploadError && (
                          <p className="text-xs text-rose-600 font-semibold flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            {photoUploadError}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Full Legal Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Chandra Patel"
                        value={formData.name}
                        onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Father's Name / Guardian</label>
                      <input
                        type="text"
                        placeholder="e.g. Chandrakant Patel"
                        value={formData.fatherName || ''}
                        onChange={e => setFormData(prev => ({ ...prev, fatherName: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  {/* Dedicated Portal Login Credentials (Email & Password) Card */}
                  <div className="p-4 rounded-2xl bg-orange-50/70 border-2 border-orange-200/90 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-orange-950 font-bold text-xs">
                        <KeyRound className="w-4 h-4 text-orange-600" />
                        <span>Portal Login Credentials (Work Email & Password)</span>
                      </div>
                      <span className="text-[10px] font-mono text-orange-800 bg-orange-100 border border-orange-300 px-2.5 py-0.5 rounded-full font-bold">
                        Staff Auth Access
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-800 text-xs mb-1">
                          Official Work Email (Login ID) *
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="email"
                            required
                            placeholder="e.g. r.patel@weldorindustries.com"
                            value={formData.email}
                            onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block font-bold text-slate-800 text-xs">
                            Portal Login Password *
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              const generated = `Wel#${Math.floor(1000 + Math.random() * 9000)}!`;
                              setFormData(prev => ({ ...prev, password: generated }));
                              setShowEmployeePassword(true);
                            }}
                            className="text-[10.5px] text-orange-700 hover:text-orange-900 font-bold cursor-pointer underline flex items-center gap-1"
                          >
                            <span>Auto-Generate</span>
                          </button>
                        </div>
                        <div className="relative">
                          <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type={showEmployeePassword ? 'text' : 'password'}
                            required
                            placeholder="Enter portal password (e.g. Weldor@2026)"
                            value={formData.password || ''}
                            onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
                            className="w-full pl-9 pr-10 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold"
                          />
                          <button
                            type="button"
                            onClick={() => setShowEmployeePassword(!showEmployeePassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                            title={showEmployeePassword ? 'Hide Password' : 'Show Password'}
                          >
                            {showEmployeePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 font-medium">
                      💡 <strong>Portal Access:</strong> This employee can directly sign in to the Weldor CRM Portal using this Official Email and Password.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98250 12345"
                        value={formData.phone}
                        onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Date of Birth</label>
                      <input
                        type="date"
                        value={formData.dateOfBirth || ''}
                        onChange={e => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">PAN Card Number</label>
                      <input
                        type="text"
                        placeholder="ABCDE1234F"
                        value={formData.panNumber || ''}
                        onChange={e => setFormData(prev => ({ ...prev, panNumber: e.target.value.toUpperCase() }))}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-orange-500 uppercase"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Aadhaar Card Number</label>
                      <input
                        type="text"
                        placeholder="4512 8890 2213"
                        value={formData.aadhaarNumber || ''}
                        onChange={e => setFormData(prev => ({ ...prev, aadhaarNumber: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Gender</label>
                      <select
                        value={formData.gender || 'Male'}
                        onChange={e => setFormData(prev => ({ ...prev, gender: e.target.value as any }))}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Residential Address</label>
                    <input
                      type="text"
                      placeholder="Street address, society or apartment details"
                      value={formData.address?.currentAddress || ''}
                      onChange={e => setFormData(prev => ({
                        ...prev,
                        address: { ...prev.address!, currentAddress: e.target.value }
                      }))}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: Job & Role Scope */}
              {formTab === 'job' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Employee Code</label>
                      <input
                        type="text"
                        value={formData.employeeCode || formData.employeeId}
                        onChange={e => setFormData(prev => ({ ...prev, employeeCode: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Department</label>
                      <select
                        value={formData.department}
                        onChange={e => setFormData(prev => ({ ...prev, department: e.target.value as any }))}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                      >
                        <option value="Executive Management">Executive Management</option>
                        <option value="Sales & BD">Sales & BD</option>
                        <option value="Engineering & R&D">Engineering & R&D</option>
                        <option value="Production & CNC">Production & CNC</option>
                        <option value="Quality Control">Quality Control</option>
                        <option value="Accounts & Finance">Accounts & Finance</option>
                        <option value="HR & Admin">HR & Admin</option>
                        <option value="Logistics & Dispatch">Logistics & Dispatch</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Designation</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Senior CNC Programmer"
                        value={formData.designation}
                        onChange={e => setFormData(prev => ({ ...prev, designation: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Assigned Security Role</label>
                      <select
                        value={formData.roleId}
                        onChange={e => {
                          const matchedRole = roles.find(r => r.id === e.target.value);
                          setFormData(prev => ({
                            ...prev,
                            roleId: e.target.value,
                            roleName: (matchedRole?.name as RoleName) || 'Sales Executive',
                            scope: matchedRole?.scope || 'Assigned'
                          }));
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        {roles.map(r => (
                          <option key={r.id} value={r.id}>{r.name} ({r.scope} Scope)</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Employment Type</label>
                      <select
                        value={formData.employmentType}
                        onChange={e => setFormData(prev => ({ ...prev, employmentType: e.target.value as any }))}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="Full-Time">Full-Time</option>
                        <option value="Contract">Contract</option>
                        <option value="Probation">Probation</option>
                        <option value="Intern">Intern</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Status</label>
                      <select
                        value={formData.status}
                        onChange={e => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold"
                      >
                        <option value="Active">Active</option>
                        <option value="Probation">Probation</option>
                        <option value="On Leave">On Leave</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Date of Joining</label>
                      <input
                        type="date"
                        value={formData.dateOfJoining}
                        onChange={e => setFormData(prev => ({ ...prev, dateOfJoining: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Reporting Manager / Signatory</label>
                      <input
                        type="text"
                        value={formData.reportingManager || currentUser?.name || 'Super Admin'}
                        onChange={e => setFormData(prev => ({ ...prev, reportingManager: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: FULLY CUSTOMIZABLE CTC & SALARY STRUCTURE */}
              {formTab === 'salary' && (
                <div className="space-y-4">
                  
                  {/* Customizer Mode Bar */}
                  <div className="p-4 rounded-xl bg-orange-50/80 border border-orange-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-orange-950 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-orange-600" />
                        <span>Customizable Salary & CTC Policy Engine</span>
                      </p>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Enable or disable HRA, DA, PF, or PT based on company rules, contract type, or custom percentages.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleSalaryOptionChange('mode', salaryOptions.mode === 'smart' ? 'manual' : 'smart')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer border transition-colors ${
                          salaryOptions.mode === 'smart'
                            ? 'bg-orange-600 text-white border-orange-600'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        <Sliders className="w-3.5 h-3.5" />
                        <span>{salaryOptions.mode === 'smart' ? 'Smart Auto Calc' : 'Manual Override'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Base Salary Input */}
                  <div className="p-4 rounded-xl bg-white border-2 border-orange-400 shadow-2xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <label className="block font-extrabold text-sm text-slate-900 mb-0.5">
                          Basic Monthly Salary (₹) *
                        </label>
                        <span className="text-[11px] text-slate-500">The foundational monthly pay upon which allowances and statutory formulas are calculated.</span>
                      </div>
                      <div className="w-full sm:w-48">
                        <input
                          type="number"
                          min="0"
                          step="500"
                          value={formData.salaryStructure.baseSalary}
                          onChange={e => handleBaseSalaryChange(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-lg border border-orange-500 text-slate-900 font-extrabold font-mono text-base focus:outline-none focus:ring-2 focus:ring-orange-500 text-right"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Allowances Policy Grid */}
                  <div className="space-y-3 pt-1">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-emerald-600" />
                      <span>Monthly Allowances & Earnings (Customizable)</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      
                      {/* HRA Toggle & Field */}
                      <div className={`p-3.5 rounded-xl border transition-all ${
                        salaryOptions.hasHra ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-200 opacity-60'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                            <input
                              type="checkbox"
                              checked={salaryOptions.hasHra}
                              onChange={e => handleSalaryOptionChange('hasHra', e.target.checked)}
                              className="rounded text-orange-600 focus:ring-orange-500"
                            />
                            <span>House Rent Allowance (HRA)</span>
                          </label>
                          {salaryOptions.hasHra && (
                            <span className="text-[10.5px] font-mono text-orange-600 font-bold">
                              {salaryOptions.hraPercent}% of Basic
                            </span>
                          )}
                        </div>
                        {salaryOptions.hasHra ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={formData.salaryStructure.hra}
                              onChange={e => handleManualSalaryFieldChange('hra', Number(e.target.value))}
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-slate-900 font-mono font-bold text-right"
                            />
                            <span className="text-xs text-slate-500 font-mono">₹/mo</span>
                          </div>
                        ) : (
                          <p className="text-[11px] text-slate-400 italic">Company provides accommodation / No HRA</p>
                        )}
                      </div>

                      {/* DA Toggle & Field */}
                      <div className={`p-3.5 rounded-xl border transition-all ${
                        salaryOptions.hasDa ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-200 opacity-60'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                            <input
                              type="checkbox"
                              checked={salaryOptions.hasDa}
                              onChange={e => handleSalaryOptionChange('hasDa', e.target.checked)}
                              className="rounded text-orange-600 focus:ring-orange-500"
                            />
                            <span>Dearness Allowance (DA)</span>
                          </label>
                          {salaryOptions.hasDa && (
                            <span className="text-[10.5px] font-mono text-orange-600 font-bold">
                              {salaryOptions.daPercent}% of Basic
                            </span>
                          )}
                        </div>
                        {salaryOptions.hasDa ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={formData.salaryStructure.da}
                              onChange={e => handleManualSalaryFieldChange('da', Number(e.target.value))}
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-slate-900 font-mono font-bold text-right"
                            />
                            <span className="text-xs text-slate-500 font-mono">₹/mo</span>
                          </div>
                        ) : (
                          <p className="text-[11px] text-slate-400 italic">No DA component applicable</p>
                        )}
                      </div>

                      {/* Special Allowance */}
                      <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                        <label className="block font-bold text-slate-800 mb-1.5">Special / Production Allowance</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={formData.salaryStructure.specialAllowance}
                            onChange={e => handleManualSalaryFieldChange('specialAllowance', Number(e.target.value))}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-slate-900 font-mono font-bold text-right"
                          />
                          <span className="text-xs text-slate-500 font-mono">₹/mo</span>
                        </div>
                      </div>

                      {/* Conveyance & Medical Allowance */}
                      <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="font-bold text-slate-800">Conveyance & Medical Allowance</label>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-[10px] text-slate-400">Conveyance:</span>
                            <input
                              type="number"
                              value={formData.salaryStructure.conveyanceAllowance}
                              onChange={e => handleManualSalaryFieldChange('conveyanceAllowance', Number(e.target.value))}
                              className="w-full px-2 py-1 rounded-lg border border-slate-300 text-slate-900 font-mono font-bold text-right"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400">Medical:</span>
                            <input
                              type="number"
                              value={formData.salaryStructure.medicalAllowance}
                              onChange={e => handleManualSalaryFieldChange('medicalAllowance', Number(e.target.value))}
                              className="w-full px-2 py-1 rounded-lg border border-slate-300 text-slate-900 font-mono font-bold text-right"
                            />
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Deductions & Statutory Policy Grid */}
                  <div className="space-y-3 pt-2">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-rose-600" />
                      <span>Statutory Deductions & Taxes (PF / PT / TDS)</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      
                      {/* PF Toggle & Rate */}
                      <div className={`p-3.5 rounded-xl border transition-all ${
                        salaryOptions.hasPf ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-200 opacity-60'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                            <input
                              type="checkbox"
                              checked={salaryOptions.hasPf}
                              onChange={e => handleSalaryOptionChange('hasPf', e.target.checked)}
                              className="rounded text-rose-600 focus:ring-rose-500"
                            />
                            <span>Provident Fund (EPF)</span>
                          </label>
                        </div>
                        {salaryOptions.hasPf ? (
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-slate-500">Rate ({salaryOptions.pfRatePercent}%):</span>
                              <input
                                type="number"
                                value={formData.salaryStructure.pfDeductionEmployee}
                                onChange={e => handleManualSalaryFieldChange('pfDeductionEmployee', Number(e.target.value))}
                                className="w-24 px-2 py-1 rounded-lg border border-slate-300 text-rose-600 font-mono font-bold text-right"
                              />
                            </div>
                            <p className="text-[10px] text-slate-400">Employer matches equal {salaryOptions.pfRatePercent}% contribution</p>
                          </div>
                        ) : (
                          <p className="text-[11px] text-slate-400 italic">No PF deduction applicable</p>
                        )}
                      </div>

                      {/* PT (Professional Tax) */}
                      <div className={`p-3.5 rounded-xl border transition-all ${
                        salaryOptions.hasPt ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-200 opacity-60'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                            <input
                              type="checkbox"
                              checked={salaryOptions.hasPt}
                              onChange={e => handleSalaryOptionChange('hasPt', e.target.checked)}
                              className="rounded text-rose-600 focus:ring-rose-500"
                            />
                            <span>Professional Tax (PT)</span>
                          </label>
                        </div>
                        {salaryOptions.hasPt ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={formData.salaryStructure.professionalTax}
                              onChange={e => handleManualSalaryFieldChange('professionalTax', Number(e.target.value))}
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-rose-600 font-mono font-bold text-right"
                            />
                            <span className="text-xs text-slate-500 font-mono">₹/mo</span>
                          </div>
                        ) : (
                          <p className="text-[11px] text-slate-400 italic">PT Exempted / ₹0</p>
                        )}
                      </div>

                      {/* TDS / Income Tax */}
                      <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                        <label className="block font-bold text-slate-800 mb-1.5">TDS / Monthly Income Tax</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={formData.salaryStructure.tdsTax}
                            onChange={e => handleManualSalaryFieldChange('tdsTax', Number(e.target.value))}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-rose-600 font-mono font-bold text-right"
                          />
                          <span className="text-xs text-slate-500 font-mono">₹/mo</span>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Summary Box */}
                  <div className="p-4 rounded-xl bg-slate-900 text-white grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono shadow-md">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase">Gross Monthly Pay</p>
                      <p className="text-lg font-bold text-white">₹{formData.salaryStructure.grossMonthlySalary.toLocaleString()}</p>
                    </div>

                    <div>
                      <p className="text-[10px] text-slate-400 uppercase">Total Deductions</p>
                      <p className="text-lg font-bold text-rose-400">
                        ₹{(formData.salaryStructure.pfDeductionEmployee + formData.salaryStructure.professionalTax + formData.salaryStructure.tdsTax).toLocaleString()}
                      </p>
                    </div>

                    <div className="bg-emerald-950/90 px-3 py-2 rounded-xl border border-emerald-500/40">
                      <p className="text-[10px] text-emerald-400 uppercase font-bold">Net In-Hand Pay</p>
                      <p className="text-xl font-extrabold text-emerald-300">₹{formData.salaryStructure.netMonthlySalary.toLocaleString()}</p>
                    </div>

                    <div>
                      <p className="text-[10px] text-orange-400 uppercase font-bold">Projected Annual CTC</p>
                      <p className="text-lg font-extrabold text-orange-300">₹{formData.salaryStructure.annualCTC.toLocaleString()}</p>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 4: Banking & Emergency */}
              {formTab === 'bank' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Bank Name</label>
                      <input
                        type="text"
                        placeholder="e.g. HDFC Bank Ltd"
                        value={formData.bankDetails?.bankName || ''}
                        onChange={e => setFormData(prev => ({
                          ...prev,
                          bankDetails: { ...prev.bankDetails, bankName: e.target.value }
                        }))}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Account Number</label>
                      <input
                        type="text"
                        placeholder="50200034891234"
                        value={formData.bankDetails?.accountNumber || ''}
                        onChange={e => setFormData(prev => ({
                          ...prev,
                          bankDetails: { ...prev.bankDetails, accountNumber: e.target.value }
                        }))}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">IFSC Code</label>
                      <input
                        type="text"
                        placeholder="HDFC0000006"
                        value={formData.bankDetails?.ifscCode || ''}
                        onChange={e => setFormData(prev => ({
                          ...prev,
                          bankDetails: { ...prev.bankDetails, ifscCode: e.target.value.toUpperCase() }
                        }))}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Branch Name</label>
                      <input
                        type="text"
                        placeholder="Navrangpura, Ahmedabad"
                        value={formData.bankDetails?.branch || ''}
                        onChange={e => setFormData(prev => ({
                          ...prev,
                          bankDetails: { ...prev.bankDetails, branch: e.target.value }
                        }))}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-2">Emergency Contact Information</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Contact Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Radhika Patel"
                          value={formData.emergencyContact?.name || ''}
                          onChange={e => setFormData(prev => ({
                            ...prev,
                            emergencyContact: { ...prev.emergencyContact!, name: e.target.value }
                          }))}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Relationship</label>
                        <input
                          type="text"
                          placeholder="Spouse / Parent"
                          value={formData.emergencyContact?.relation || ''}
                          onChange={e => setFormData(prev => ({
                            ...prev,
                            emergencyContact: { ...prev.emergencyContact!, relation: e.target.value }
                          }))}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Emergency Phone</label>
                        <input
                          type="tel"
                          placeholder="+91 98250 99887"
                          value={formData.emergencyContact?.phone || ''}
                          onChange={e => setFormData(prev => ({
                            ...prev,
                            emergencyContact: { ...prev.emergencyContact!, phone: e.target.value }
                          }))}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Actions Footer */}
              <div className="p-4 border-t border-slate-200 bg-slate-50 -mx-6 -mb-6 mt-6 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-200 font-bold cursor-pointer"
                >
                  Cancel
                </button>

                <div className="flex items-center gap-2">
                  {formTab !== 'personal' && (
                    <button
                      type="button"
                      onClick={() => {
                        if (formTab === 'job') setFormTab('personal');
                        if (formTab === 'salary') setFormTab('job');
                        if (formTab === 'bank') setFormTab('salary');
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 font-bold hover:bg-slate-300 cursor-pointer"
                    >
                      Back
                    </button>
                  )}

                  {formTab !== 'bank' ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (formTab === 'personal') setFormTab('job');
                        if (formTab === 'job') setFormTab('salary');
                        if (formTab === 'salary') setFormTab('bank');
                      }}
                      className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 cursor-pointer"
                    >
                      Next Step →
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="px-6 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold shadow-lg shadow-orange-600/30 flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{editingEmployee ? 'Save Changes' : 'Complete Registration'}</span>
                    </button>
                  )}
                </div>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* JOB OFFER LETTER MODAL (OFFICIAL & PRINTABLE WITH BACK / CLOSE / CUSTOMIZE) */}
      {offerLetterEmployee && (
        <div className="fixed inset-0 z-[99999] flex items-start justify-center p-2 sm:p-6 bg-slate-950/90 backdrop-blur-md overflow-y-auto min-h-screen">
          <div className="bg-white max-w-4xl w-full rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-4 sm:my-8 animate-in fade-in zoom-in duration-200 flex flex-col">
            
            {/* Modal Controls Bar (Sticky Top) */}
            <div className="sticky top-0 z-50 p-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-700 shadow-md print:hidden">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setOfferLetterEmployee(null)}
                  className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-orange-600/30 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>← Back to Directory</span>
                </button>

                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <h3 className="font-bold text-xs sm:text-sm">Job Offer Letter — {offerLetterEmployee.name}</h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsLetterEditMode(!isLetterEditMode)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors border ${
                    isLetterEditMode 
                      ? 'bg-amber-500 text-white border-amber-500' 
                      : 'bg-slate-800 text-amber-300 border-amber-400/40 hover:bg-slate-700'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isLetterEditMode ? 'Preview Letter' : 'Customize Letter'}</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 border border-slate-600 shadow-xs cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Offer Letter</span>
                </button>

                <button
                  onClick={() => setOfferLetterEmployee(null)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Close Letter"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Customizer Drawer / Form (When in Edit Mode) */}
            {isLetterEditMode && (
              <div className="p-4 bg-amber-50/80 border-b border-amber-200 text-xs space-y-3 print:hidden">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Settings2 className="w-4 h-4 text-amber-600" />
                  <span>Customize Signatory, Company Reference & Terms</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Authorized Signatory Name</label>
                    <input
                      type="text"
                      value={customLetterData.signatoryName}
                      onChange={e => setCustomLetterData(prev => ({ ...prev, signatoryName: e.target.value }))}
                      placeholder="e.g. Super Admin"
                      className="w-full px-3 py-1.5 rounded-lg border border-amber-300 bg-white text-slate-900 font-bold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Signatory Title / Designation</label>
                    <input
                      type="text"
                      value={customLetterData.signatoryDesignation}
                      onChange={e => setCustomLetterData(prev => ({ ...prev, signatoryDesignation: e.target.value }))}
                      placeholder="Managing Director / Platform Administrator"
                      className="w-full px-3 py-1.5 rounded-lg border border-amber-300 bg-white text-slate-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Reference Number</label>
                    <input
                      type="text"
                      value={customLetterData.refNumber}
                      onChange={e => setCustomLetterData(prev => ({ ...prev, refNumber: e.target.value }))}
                      className="w-full px-3 py-1.5 rounded-lg border border-amber-300 bg-white text-slate-900 font-mono focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Work Location</label>
                    <input
                      type="text"
                      value={customLetterData.workLocation}
                      onChange={e => setCustomLetterData(prev => ({ ...prev, workLocation: e.target.value }))}
                      className="w-full px-3 py-1.5 rounded-lg border border-amber-300 bg-white text-slate-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Probation Period</label>
                    <input
                      type="text"
                      value={customLetterData.probationMonths}
                      onChange={e => setCustomLetterData(prev => ({ ...prev, probationMonths: e.target.value }))}
                      className="w-full px-3 py-1.5 rounded-lg border border-amber-300 bg-white text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Printable Letterhead & Body Content */}
            <div className="p-8 sm:p-12 text-slate-800 space-y-6 text-xs sm:text-sm bg-white font-sans leading-relaxed flex-1">
              
              {/* Header Letterhead with Official Company Logo & Stamp */}
              <div className="border-b-2 border-slate-900 pb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center font-extrabold text-xl shadow-md border border-orange-500">
                      W
                    </div>
                    <div>
                      <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">WELDOR INDUSTRIES PVT. LTD.</h1>
                      <p className="text-[10.5px] font-mono text-orange-600 font-bold uppercase tracking-wider">Precision Pneumatics, Hydraulic Cylinders & Valve Automation</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 font-mono">
                    Plot No. 12/B, Phase II, GIDC Metoda, Rajkot - 360021, Gujarat, India | CIN: U29253GJ2012PTC071234
                  </p>
                </div>

                <div className="text-left sm:text-right font-mono text-[10px] text-slate-500">
                  <p><strong>ISO 9001:2015</strong> Certified Facility</p>
                  <p>GSTIN: 24AAACW4921K1ZX</p>
                  <p>contact@weldorindustries.com</p>
                </div>
              </div>

              {/* Reference & Date */}
              <div className="flex items-center justify-between font-mono text-xs pt-1">
                <div>
                  <span className="text-slate-400">Ref: </span>
                  <strong className="text-slate-900">{customLetterData.refNumber || `WEL/HR-OFFER/2026/${offerLetterEmployee.employeeCode || offerLetterEmployee.employeeId}`}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Date: </span>
                  <strong className="text-slate-900">{customLetterData.letterDate}</strong>
                </div>
              </div>

              {/* Candidate Info */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <p className="font-bold text-slate-900 text-sm">{offerLetterEmployee.name}</p>
                {offerLetterEmployee.address?.currentAddress && (
                  <p className="text-slate-600">{offerLetterEmployee.address.currentAddress}, {offerLetterEmployee.address.city}, {offerLetterEmployee.address.state} - {offerLetterEmployee.address.pincode}</p>
                )}
                <p className="text-slate-600 font-mono mt-0.5">Email: {offerLetterEmployee.email} | Phone: {offerLetterEmployee.phone}</p>
              </div>

              {/* Subject */}
              <div className="py-1">
                <p className="font-extrabold text-sm text-slate-900 uppercase tracking-wide underline underline-offset-4 decoration-orange-500">
                  Subject: Offer of Employment for the position of "{offerLetterEmployee.designation}"
                </p>
              </div>

              {/* Greeting & Body */}
              <div className="space-y-3 text-slate-700">
                <p>Dear <strong>{offerLetterEmployee.name}</strong>,</p>
                <p>
                  With reference to your application and subsequent technical & managerial interviews with our leadership panel, we are pleased to offer you the position of <strong className="text-slate-900 font-bold">{offerLetterEmployee.designation}</strong> in the <strong className="text-slate-900 font-bold">{offerLetterEmployee.department}</strong> department at <strong>Weldor Industries Pvt. Ltd.</strong>
                </p>
                <p>
                  We are confident that your technical skills and industrial experience will play an instrumental role in scaling our precision manufacturing operations, automated production pipelines, and commercial deliverables.
                </p>
              </div>

              {/* Key Terms Summary Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-orange-50/60 p-4 rounded-xl border border-orange-200/80 text-xs">
                <div>
                  <span className="text-slate-500 text-[10px] font-mono uppercase font-bold">Proposed Designation</span>
                  <p className="font-bold text-slate-900 mt-0.5">{offerLetterEmployee.designation}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] font-mono uppercase font-bold">Reporting Manager</span>
                  <p className="font-bold text-slate-900 mt-0.5">{customLetterData.reportingManager || offerLetterEmployee.reportingManager || 'Managing Director'}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] font-mono uppercase font-bold">Date of Joining</span>
                  <p className="font-bold text-slate-900 mt-0.5 font-mono">{offerLetterEmployee.dateOfJoining}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] font-mono uppercase font-bold">Work Location</span>
                  <p className="font-bold text-slate-900 mt-0.5">{customLetterData.workLocation}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] font-mono uppercase font-bold">Probation Period</span>
                  <p className="font-bold text-slate-900 mt-0.5">{customLetterData.probationMonths}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] font-mono uppercase font-bold">Annual Compensation (CTC)</span>
                  <p className="font-extrabold text-orange-700 mt-0.5 font-mono text-sm">₹{(offerLetterEmployee.salaryStructure?.annualCTC || 0).toLocaleString()} / yr</p>
                </div>
              </div>

              {/* Annexure A: Salary Breakdown */}
              <div className="space-y-2 pt-2">
                <h4 className="font-bold text-slate-900 uppercase text-xs tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-orange-600" />
                  <span>Annexure A — Detailed Salary & Cost to Company (CTC) Structure</span>
                </h4>
                
                <div className="border border-slate-300 rounded-xl overflow-hidden font-mono text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                      <tr>
                        <th className="py-2 px-3">Salary Component</th>
                        <th className="py-2 px-3 text-right">Monthly (₹)</th>
                        <th className="py-2 px-3 text-right">Annualized (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr>
                        <td className="py-1.5 px-3 font-semibold">Basic Pay</td>
                        <td className="py-1.5 px-3 text-right">₹{(offerLetterEmployee.salaryStructure?.baseSalary || 0).toLocaleString()}</td>
                        <td className="py-1.5 px-3 text-right">₹{((offerLetterEmployee.salaryStructure?.baseSalary || 0) * 12).toLocaleString()}</td>
                      </tr>
                      {offerLetterEmployee.salaryStructure?.hra > 0 && (
                        <tr>
                          <td className="py-1.5 px-3">House Rent Allowance (HRA)</td>
                          <td className="py-1.5 px-3 text-right">₹{(offerLetterEmployee.salaryStructure?.hra || 0).toLocaleString()}</td>
                          <td className="py-1.5 px-3 text-right">₹{((offerLetterEmployee.salaryStructure?.hra || 0) * 12).toLocaleString()}</td>
                        </tr>
                      )}
                      {offerLetterEmployee.salaryStructure?.da > 0 && (
                        <tr>
                          <td className="py-1.5 px-3">Dearness Allowance (DA)</td>
                          <td className="py-1.5 px-3 text-right">₹{(offerLetterEmployee.salaryStructure?.da || 0).toLocaleString()}</td>
                          <td className="py-1.5 px-3 text-right">₹{((offerLetterEmployee.salaryStructure?.da || 0) * 12).toLocaleString()}</td>
                        </tr>
                      )}
                      {offerLetterEmployee.salaryStructure?.specialAllowance > 0 && (
                        <tr>
                          <td className="py-1.5 px-3">Special Allowance</td>
                          <td className="py-1.5 px-3 text-right">₹{(offerLetterEmployee.salaryStructure?.specialAllowance || 0).toLocaleString()}</td>
                          <td className="py-1.5 px-3 text-right">₹{((offerLetterEmployee.salaryStructure?.specialAllowance || 0) * 12).toLocaleString()}</td>
                        </tr>
                      )}
                      {((offerLetterEmployee.salaryStructure?.conveyanceAllowance || 0) + (offerLetterEmployee.salaryStructure?.medicalAllowance || 0)) > 0 && (
                        <tr>
                          <td className="py-1.5 px-3">Conveyance & Medical Allowance</td>
                          <td className="py-1.5 px-3 text-right">₹{((offerLetterEmployee.salaryStructure?.conveyanceAllowance || 0) + (offerLetterEmployee.salaryStructure?.medicalAllowance || 0)).toLocaleString()}</td>
                          <td className="py-1.5 px-3 text-right">₹{(((offerLetterEmployee.salaryStructure?.conveyanceAllowance || 0) + (offerLetterEmployee.salaryStructure?.medicalAllowance || 0)) * 12).toLocaleString()}</td>
                        </tr>
                      )}
                      <tr className="bg-slate-50 font-bold text-slate-900 border-t border-slate-300">
                        <td className="py-2 px-3">Total Gross Salary (A)</td>
                        <td className="py-2 px-3 text-right">₹{(offerLetterEmployee.salaryStructure?.grossMonthlySalary || 0).toLocaleString()}</td>
                        <td className="py-2 px-3 text-right">₹{((offerLetterEmployee.salaryStructure?.grossMonthlySalary || 0) * 12).toLocaleString()}</td>
                      </tr>
                      {offerLetterEmployee.salaryStructure?.pfDeductionEmployee > 0 && (
                        <tr className="text-slate-600">
                          <td className="py-1.5 px-3">Provident Fund (EPF Employee Deduction)</td>
                          <td className="py-1.5 px-3 text-right text-rose-600">-₹{(offerLetterEmployee.salaryStructure?.pfDeductionEmployee || 0).toLocaleString()}</td>
                          <td className="py-1.5 px-3 text-right text-rose-600">-₹{((offerLetterEmployee.salaryStructure?.pfDeductionEmployee || 0) * 12).toLocaleString()}</td>
                        </tr>
                      )}
                      {((offerLetterEmployee.salaryStructure?.professionalTax || 0) + (offerLetterEmployee.salaryStructure?.tdsTax || 0)) > 0 && (
                        <tr className="text-slate-600">
                          <td className="py-1.5 px-3">Professional Tax (PT) & Statutory TDS</td>
                          <td className="py-1.5 px-3 text-right text-rose-600">-₹{((offerLetterEmployee.salaryStructure?.professionalTax || 0) + (offerLetterEmployee.salaryStructure?.tdsTax || 0)).toLocaleString()}</td>
                          <td className="py-1.5 px-3 text-right text-rose-600">-₹{(((offerLetterEmployee.salaryStructure?.professionalTax || 0) + (offerLetterEmployee.salaryStructure?.tdsTax || 0)) * 12).toLocaleString()}</td>
                        </tr>
                      )}
                      <tr className="bg-emerald-50 font-bold text-emerald-800 border-t border-emerald-300">
                        <td className="py-2 px-3">Net Estimated Monthly Take-Home Pay</td>
                        <td className="py-2 px-3 text-right font-extrabold text-sm">₹{(offerLetterEmployee.salaryStructure?.netMonthlySalary || 0).toLocaleString()}</td>
                        <td className="py-2 px-3 text-right font-extrabold text-sm">₹{((offerLetterEmployee.salaryStructure?.netMonthlySalary || 0) * 12).toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Acceptance and Signatures with Super Admin Name & Seal */}
              <div className="pt-8 border-t border-slate-300 grid grid-cols-2 gap-8 text-xs">
                <div>
                  <p className="font-bold text-slate-900">For Weldor Industries Pvt. Ltd.</p>
                  
                  {/* Digital Stamp Seal */}
                  <div className="w-20 h-20 my-2 border-2 border-dashed border-orange-600/40 rounded-full flex flex-col items-center justify-center text-center p-1.5 rotate-[-4deg]">
                    <span className="text-[8px] font-extrabold text-orange-800 font-mono">WELDOR IND.</span>
                    <span className="text-[6.5px] text-slate-500 font-mono">AUTHORIZED</span>
                    <span className="text-[7.5px] text-orange-700 font-bold font-mono">RAJKOT (GUJ)</span>
                  </div>

                  <p className="font-bold text-slate-900 mt-1">
                    {customLetterData.signatoryName || currentUser?.name || 'Super Admin'}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono">
                    {customLetterData.signatoryDesignation || currentUser?.designation || 'Managing Director / Platform Administrator'}
                  </p>
                </div>

                <div>
                  <p className="font-bold text-slate-900">Candidate Acceptance & Confirmation</p>
                  <div className="mt-16 border-b border-dashed border-slate-400 w-48" />
                  <p className="font-bold text-slate-900 mt-1">{offerLetterEmployee.name}</p>
                  <p className="text-[10px] text-slate-500 font-mono">
                    Emp Code: {offerLetterEmployee.employeeCode || offerLetterEmployee.employeeId} | Signature & Date: ______________
                  </p>
                </div>
              </div>

            </div>

            {/* Bottom Modal Actions Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between print:hidden">
              <button
                onClick={() => setOfferLetterEmployee(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Employee List</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-orange-600/30 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Offer Letter</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* APPOINTMENT & JOINING LETTER MODAL (OFFICIAL & PRINTABLE WITH BACK / CLOSE / CUSTOMIZE) */}
      {joiningLetterEmployee && (
        <div className="fixed inset-0 z-[99999] flex items-start justify-center p-2 sm:p-6 bg-slate-950/90 backdrop-blur-md overflow-y-auto min-h-screen">
          <div className="bg-white max-w-4xl w-full rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-4 sm:my-8 animate-in fade-in zoom-in duration-200 flex flex-col">
            
            {/* Modal Controls Bar (Sticky Top) */}
            <div className="sticky top-0 z-50 p-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-700 shadow-md print:hidden">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setJoiningLetterEmployee(null)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/30 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>← Back to Directory</span>
                </button>

                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-bold text-xs sm:text-sm">Letter of Appointment & Joining — {joiningLetterEmployee.name}</h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsLetterEditMode(!isLetterEditMode)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors border ${
                    isLetterEditMode 
                      ? 'bg-emerald-500 text-white border-emerald-500' 
                      : 'bg-slate-800 text-emerald-300 border-emerald-400/40 hover:bg-slate-700'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isLetterEditMode ? 'Preview Letter' : 'Customize Letter'}</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 border border-slate-600 shadow-xs cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Appointment Letter</span>
                </button>

                <button
                  onClick={() => setJoiningLetterEmployee(null)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Close Letter"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Customizer Drawer / Form (When in Edit Mode) */}
            {isLetterEditMode && (
              <div className="p-4 bg-emerald-50/80 border-b border-emerald-200 text-xs space-y-3 print:hidden">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Settings2 className="w-4 h-4 text-emerald-600" />
                  <span>Customize Signatory, Company Reference & Appointment Terms</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Authorized Signatory Name</label>
                    <input
                      type="text"
                      value={customLetterData.signatoryName}
                      onChange={e => setCustomLetterData(prev => ({ ...prev, signatoryName: e.target.value }))}
                      placeholder="e.g. Super Admin"
                      className="w-full px-3 py-1.5 rounded-lg border border-emerald-300 bg-white text-slate-900 font-bold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Signatory Title / Designation</label>
                    <input
                      type="text"
                      value={customLetterData.signatoryDesignation}
                      onChange={e => setCustomLetterData(prev => ({ ...prev, signatoryDesignation: e.target.value }))}
                      placeholder="Managing Director / Platform Administrator"
                      className="w-full px-3 py-1.5 rounded-lg border border-emerald-300 bg-white text-slate-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Reference Number</label>
                    <input
                      type="text"
                      value={customLetterData.refNumber}
                      onChange={e => setCustomLetterData(prev => ({ ...prev, refNumber: e.target.value }))}
                      className="w-full px-3 py-1.5 rounded-lg border border-emerald-300 bg-white text-slate-900 font-mono focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Work Location</label>
                    <input
                      type="text"
                      value={customLetterData.workLocation}
                      onChange={e => setCustomLetterData(prev => ({ ...prev, workLocation: e.target.value }))}
                      className="w-full px-3 py-1.5 rounded-lg border border-emerald-300 bg-white text-slate-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Probation Period</label>
                    <input
                      type="text"
                      value={customLetterData.probationMonths}
                      onChange={e => setCustomLetterData(prev => ({ ...prev, probationMonths: e.target.value }))}
                      className="w-full px-3 py-1.5 rounded-lg border border-emerald-300 bg-white text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Printable Letterhead & Body Content */}
            <div className="p-8 sm:p-12 text-slate-800 space-y-6 text-xs sm:text-sm bg-white font-sans leading-relaxed flex-1">
              
              {/* Header Letterhead with Official Company Logo & Details */}
              <div className="border-b-2 border-slate-900 pb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-extrabold text-xl shadow-md border border-emerald-500">
                      W
                    </div>
                    <div>
                      <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">WELDOR INDUSTRIES PVT. LTD.</h1>
                      <p className="text-[10.5px] font-mono text-emerald-700 font-bold uppercase tracking-wider">Corporate Human Resources & Operations Directorate</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 font-mono">
                    Plot No. 12/B, Phase II, GIDC Metoda, Rajkot - 360021, Gujarat, India | CIN: U29253GJ2012PTC071234
                  </p>
                </div>

                <div className="text-left sm:text-right font-mono text-[10px] text-slate-500">
                  <p><strong>EMPLOYEE CODE: {joiningLetterEmployee.employeeCode || joiningLetterEmployee.employeeId}</strong></p>
                  <p>PF Registration: {joiningLetterEmployee.pfNumber || 'GJ/RAJ/008921/WEL'}</p>
                  <p>PAN: {joiningLetterEmployee.panNumber || 'APPLIED'}</p>
                </div>
              </div>

              {/* Reference & Date */}
              <div className="flex items-center justify-between font-mono text-xs pt-1">
                <div>
                  <span className="text-slate-400">Ref: </span>
                  <strong className="text-slate-900">{customLetterData.refNumber || `WEL/HR-APPT/2026/${joiningLetterEmployee.employeeCode || joiningLetterEmployee.employeeId}`}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Date of Appointment: </span>
                  <strong className="text-slate-900">{customLetterData.letterDate || joiningLetterEmployee.dateOfJoining}</strong>
                </div>
              </div>

              {/* Subject */}
              <div className="py-1">
                <p className="font-extrabold text-sm text-slate-900 uppercase tracking-wide underline underline-offset-4 decoration-emerald-500">
                  LETTER OF APPOINTMENT & EMPLOYMENT TERMS CONFIRMATION
                </p>
              </div>

              {/* Body Paragraphs */}
              <div className="space-y-3 text-slate-700">
                <p>Dear <strong>{joiningLetterEmployee.name}</strong>,</p>
                <p>
                  We are pleased to formally confirm your appointment as <strong className="text-slate-900 font-bold">{joiningLetterEmployee.designation}</strong> with <strong>Weldor Industries Pvt. Ltd.</strong> effective from your date of joining <strong className="font-mono text-slate-900">{joiningLetterEmployee.dateOfJoining}</strong>.
                </p>
                <p>
                  Your employment with the Company shall be governed by the following operational terms, statutory compliances, and standard industrial regulations:
                </p>
              </div>

              {/* Terms & Conditions Clauses */}
              <div className="space-y-3 pt-2 text-xs text-slate-700">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <p className="font-bold text-slate-900">1. Role & Department Responsibilities</p>
                  <p className="text-slate-600">
                    You are assigned to the <strong>{joiningLetterEmployee.department}</strong> department, reporting directly to <strong>{customLetterData.reportingManager || joiningLetterEmployee.reportingManager || 'Managing Director'}</strong>. You shall diligently perform the duties assigned to your designation and adhere to ISO 9001:2015 quality standards.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <p className="font-bold text-slate-900">2. Compensation & Leave Deduction (LOP)</p>
                  <p className="text-slate-600">
                    Your gross monthly compensation is <strong>₹{(joiningLetterEmployee.salaryStructure?.grossMonthlySalary || 0).toLocaleString()}</strong> (Annual CTC: <strong>₹{(joiningLetterEmployee.salaryStructure?.annualCTC || 0).toLocaleString()}</strong>). Salary is disbursed via NEFT/RTGS on the 1st of every calendar month. Unapproved absences shall be computed under Loss of Pay (LOP) at <code>(Base Pay / 30) × Unpaid Days</code>. Approved overtime is compensated at 1.5x hourly standard rate.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <p className="font-bold text-slate-900">3. Confidentiality, Technical Blueprints & IP Assignment</p>
                  <p className="text-slate-600">
                    You agree that all CAD blueprints, CNC program files, technical tolerance matrices, customer catalogs, pricing structures, and testing reports created or accessed during your tenure remain the exclusive intellectual property of Weldor Industries Pvt. Ltd.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <p className="font-bold text-slate-900">4. Probation & Notice Period</p>
                  <p className="text-slate-600">
                    You shall be on probation for a period of <strong>{customLetterData.probationMonths}</strong>. During probation, either party may terminate employment by giving 30 days written notice. Post-confirmation, the notice period shall be 60 days.
                  </p>
                </div>
              </div>

              {/* Signatures & Official Stamp with Super Admin Name */}
              <div className="pt-8 border-t border-slate-300 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900">For Weldor Industries Pvt. Ltd.</p>
                  <div className="w-22 h-22 my-2 border-2 border-dashed border-emerald-600/40 rounded-full flex flex-col items-center justify-center text-center p-2 rotate-[-5deg]">
                    <span className="text-[9px] font-extrabold text-emerald-800 font-mono">WELDOR IND.</span>
                    <span className="text-[7.5px] text-slate-500 font-mono">SEAL OF APPOINTMENT</span>
                    <span className="text-[8px] text-emerald-700 font-bold font-mono">RAJKOT (GUJ)</span>
                  </div>
                  <p className="font-bold text-slate-900 mt-1">
                    {customLetterData.signatoryName || currentUser?.name || 'Super Admin'}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono">
                    {customLetterData.signatoryDesignation || currentUser?.designation || 'HR Directorate & Managing Director'}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-slate-900">Employee Acceptance & Undertaking</p>
                  <div className="mt-14 border-b border-dashed border-slate-400 w-48 ml-auto" />
                  <p className="font-bold text-slate-900 mt-1">{joiningLetterEmployee.name}</p>
                  <p className="text-[10px] text-slate-500 font-mono">Emp Code: {joiningLetterEmployee.employeeCode || joiningLetterEmployee.employeeId}</p>
                </div>
              </div>

            </div>

            {/* Bottom Modal Actions Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between print:hidden">
              <button
                onClick={() => setJoiningLetterEmployee(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Employee List</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/30 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Appointment Letter</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingId && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white max-w-md w-full p-6 rounded-2xl shadow-2xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Remove Employee from Directory?</h3>
            <p className="text-xs text-slate-500">
              This will remove the employee record and archive their historical permissions. Are you sure you want to proceed?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/30 cursor-pointer"
              >
                Confirm Deletion
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
