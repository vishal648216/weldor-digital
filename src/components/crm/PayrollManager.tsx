import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import type { PayrollRecord } from '../../types';
import { 
  CreditCard, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Download, 
  Printer, 
  FileText, 
  Plus, 
  Filter, 
  Search, 
  DollarSign, 
  Building2, 
  ArrowUpRight, 
  AlertCircle, 
  Send, 
  ShieldCheck, 
  Eye, 
  Edit3, 
  Trash2, 
  X, 
  Sparkles,
  Layers
} from 'lucide-react';

export const PayrollManager: React.FC = () => {
  const { 
    payrolls, 
    generateMonthlyPayroll, 
    updatePayrollRecord, 
    deletePayrollRecord, 
    approvePayrollRecord, 
    bulkApprovePayroll,
    disbursePayrollRecord, 
    bulkDisbursePayroll, 
    employees, 
    companySettings,
    hasPermission 
  } = useApp();

  const [selectedMonth, setSelectedMonth] = useState<string>('September 2026');
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [departmentFilter, setDepartmentFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [viewingSlip, setViewingSlip] = useState<PayrollRecord | null>(null);
  const [editingSlip, setEditingSlip] = useState<PayrollRecord | null>(null);
  const [disbursingSlip, setDisbursingSlip] = useState<PayrollRecord | null>(null);
  const [txRefInput, setTxRefInput] = useState('');

  const monthsList = [
    'October 2026',
    'September 2026',
    'August 2026',
    'July 2026',
    'June 2026',
    'May 2026',
    'April 2026',
    'March 2026',
    'February 2026',
    'January 2026',
  ];

  const handleMonthChange = (newMonth: string) => {
    setSelectedMonth(newMonth);
    const parts = newMonth.split(' ');
    if (parts.length > 1) {
      const parsedYear = parseInt(parts[1], 10);
      if (!isNaN(parsedYear)) setSelectedYear(parsedYear);
    }
  };

  // Filtered Payroll Records
  const currentMonthRecords = useMemo(() => {
    return payrolls.filter(p => p.payrollMonth === selectedMonth);
  }, [payrolls, selectedMonth]);

  const filteredRecords = useMemo(() => {
    return currentMonthRecords.filter(rec => {
      const matchesSearch = 
        rec.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.employeeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.bankAccountNumber.includes(searchQuery);

      const matchesStatus = statusFilter === 'All' || rec.status === statusFilter;
      const matchesDept = departmentFilter === 'All' || rec.department === departmentFilter;

      return matchesSearch && matchesStatus && matchesDept;
    });
  }, [currentMonthRecords, searchQuery, statusFilter, departmentFilter]);

  // Statistics for Current Month
  const totalGrossMonthly = currentMonthRecords.reduce((sum, r) => sum + r.grossEarnings, 0);
  const totalNetMonthly = currentMonthRecords.reduce((sum, r) => sum + r.netPayable, 0);
  const totalDeductionsMonthly = currentMonthRecords.reduce((sum, r) => sum + r.totalDeductions, 0);
  const totalPfMonthly = currentMonthRecords.reduce((sum, r) => sum + r.pfDeduction, 0);
  const totalTdsMonthly = currentMonthRecords.reduce((sum, r) => sum + r.tdsTax, 0);

  const pendingApprovalCount = currentMonthRecords.filter(r => r.status === 'Draft').length;
  const approvedCount = currentMonthRecords.filter(r => r.status === 'Approved').length;
  const paidCount = currentMonthRecords.filter(r => r.status === 'Paid').length;

  const activeStaffCount = employees.filter(e => e.status !== 'Inactive').length;
  const isMonthFullyGenerated = currentMonthRecords.length > 0 && currentMonthRecords.length >= activeStaffCount;
  const isMonthFullyPaid = isMonthFullyGenerated && paidCount === currentMonthRecords.length;

  const departments = ['All', 'Sales & BD', 'Engineering & R&D', 'Production & CNC', 'Quality Control', 'Accounts & Finance', 'HR & Admin', 'Logistics & Dispatch'];

  // Handle Edit Adjustments Save
  const handleSaveAdjustments = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlip) return;

    const otPay = editingSlip.overtimeHours * (editingSlip.overtimeRate || 300);
    const gross = editingSlip.baseSalary + editingSlip.hra + editingSlip.da + editingSlip.specialAllowance + 
                  editingSlip.conveyanceAllowance + editingSlip.medicalAllowance + otPay + editingSlip.performanceBonus;
    
    const leaveDed = editingSlip.unpaidLeaves * Math.round(editingSlip.baseSalary / 30);
    const totalDed = editingSlip.pfDeduction + editingSlip.professionalTax + editingSlip.tdsTax + leaveDed + editingSlip.otherDeductions;
    const net = gross - totalDed;

    updatePayrollRecord(editingSlip.id, {
      ...editingSlip,
      overtimePay: otPay,
      grossEarnings: gross,
      leaveDeduction: leaveDed,
      totalDeductions: totalDed,
      netPayable: net,
    });

    setEditingSlip(null);
  };

  const handlePrintPayslip = () => {
    window.print();
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 rounded-2xl text-white shadow-xl border border-slate-700/50">
        <div>
          <div className="flex items-center gap-2.5 text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider mb-1">
            <CreditCard className="w-4 h-4" />
            <span>PAYROLL ROLL & DISBURSAL MANAGEMENT</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Salary Roll & Payslip Generator
          </h1>
          <p className="text-slate-300 text-xs md:text-sm mt-1 max-w-2xl">
            Automated monthly salary calculation, attendance deductions, overtime bonuses, PF/TDS tax compliance, and one-click bank disbursal.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Month Selector */}
          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-600">
            <Calendar className="w-4 h-4 text-orange-400" />
            <select
              value={selectedMonth}
              onChange={e => handleMonthChange(e.target.value)}
              className="bg-transparent text-white text-xs font-bold font-mono focus:outline-none cursor-pointer"
            >
              {monthsList.map(m => (
                <option key={m} value={m} className="bg-slate-900 text-white">{m}</option>
              ))}
            </select>
          </div>

          {/* If Month is already completely paid */}
          {isMonthFullyPaid ? (
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-900/60 border border-emerald-500/60 text-emerald-300 font-bold text-xs md:text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{selectedMonth.split(' ')[0]} Fully Disbursed</span>
            </div>
          ) : (
            <>
              {/* Run Payroll button */}
              {hasPermission('payroll', 'create') && !isMonthFullyGenerated && (
                <button
                  onClick={() => generateMonthlyPayroll(selectedMonth, selectedYear)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs md:text-sm shadow-lg shadow-orange-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Run Payroll for {selectedMonth.split(' ')[0]}</span>
                </button>
              )}

              {/* Bulk Approve */}
              {hasPermission('payroll', 'approve') && pendingApprovalCount > 0 && (
                <button
                  onClick={() => bulkApprovePayroll(selectedMonth)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs md:text-sm shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve All ({pendingApprovalCount})</span>
                </button>
              )}

              {/* Bulk Disburse */}
              {hasPermission('payroll', 'approve') && approvedCount > 0 && (
                <button
                  onClick={() => bulkDisbursePayroll(selectedMonth)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs md:text-sm shadow-lg shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Disburse All ({approvedCount})</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* KPI Metric Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-mono font-bold text-slate-400 uppercase">Gross Salary Bill</p>
            <h3 className="text-xl font-extrabold text-slate-900 font-mono">₹{totalGrossMonthly.toLocaleString()}</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">{currentMonthRecords.length} Employees Logged</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-mono font-bold text-slate-400 uppercase">Net Payable to Bank</p>
            <h3 className="text-xl font-extrabold text-emerald-600 font-mono">₹{totalNetMonthly.toLocaleString()}</h3>
            <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">{paidCount} Disbursed / {currentMonthRecords.length}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-mono font-bold text-slate-400 uppercase">Statutory Deductions</p>
            <h3 className="text-xl font-extrabold text-rose-600 font-mono">₹{totalDeductionsMonthly.toLocaleString()}</h3>
            <p className="text-[10px] text-slate-500 mt-0.5 font-mono">PF: ₹{totalPfMonthly.toLocaleString()} • TDS: ₹{totalTdsMonthly.toLocaleString()}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-mono font-bold text-slate-400 uppercase">Disbursal Pipeline</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                {pendingApprovalCount} Drafts
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {approvedCount} Ready
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Automated NEFT Batch</p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by staff name, code, designation, A/C..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={departmentFilter}
              onChange={e => setDepartmentFilter(e.target.value)}
              className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {departments.map(d => (
                <option key={d} value={d}>{d === 'All' ? 'All Departments' : d}</option>
              ))}
            </select>
          </div>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="All">All Statuses</option>
            <option value="Draft">Draft</option>
            <option value="Approved">Approved</option>
            <option value="Paid">Paid / Disbursed</option>
          </select>
        </div>

        <div className="text-xs text-slate-500 font-mono">
          Showing <strong>{filteredRecords.length}</strong> of {currentMonthRecords.length} payslips
        </div>
      </div>

      {/* Main Payroll Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-mono uppercase text-slate-500 font-bold tracking-wider">
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Designation & Dept</th>
                <th className="py-3 px-4">Attendance</th>
                <th className="py-3 px-4">Gross Earnings</th>
                <th className="py-3 px-4">Deductions</th>
                <th className="py-3 px-4">Net In-Hand Pay</th>
                <th className="py-3 px-4">Disbursal Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <div className="max-w-md mx-auto space-y-3">
                      <p>No payroll records found for {selectedMonth}.</p>
                      <button
                        onClick={() => generateMonthlyPayroll(selectedMonth, selectedYear)}
                        className="px-4 py-2 rounded-xl bg-orange-600 text-white font-bold text-xs hover:bg-orange-500 transition-all cursor-pointer"
                      >
                        ⚡ Generate {selectedMonth} Payroll Now
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRecords.map(rec => (
                  <tr key={rec.id} className="hover:bg-slate-50/70 transition-colors group">
                    
                    {/* Employee */}
                    <td className="py-3.5 px-4">
                      <div>
                        <p className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                          {rec.employeeName}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500 font-mono">
                          <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-bold border border-slate-200">
                            {rec.employeeCode}
                          </span>
                          <span>•</span>
                          <span>{rec.bankName.split(' ')[0]}</span>
                        </div>
                      </div>
                    </td>

                    {/* Designation & Dept */}
                    <td className="py-3.5 px-4">
                      <p className="font-medium text-slate-800">{rec.designation}</p>
                      <span className="text-[10.5px] font-mono text-slate-500">{rec.department}</span>
                    </td>

                    {/* Attendance / Paid Days */}
                    <td className="py-3.5 px-4 font-mono">
                      <p className="font-semibold text-slate-800">{rec.paidDays} / {rec.workingDays} Days</p>
                      {rec.overtimeHours > 0 && (
                        <span className="text-[10px] text-emerald-600 font-bold">+{rec.overtimeHours}h Overtime</span>
                      )}
                      {rec.unpaidLeaves > 0 && (
                        <span className="text-[10px] text-rose-600 font-bold">-{rec.unpaidLeaves}d LOP</span>
                      )}
                    </td>

                    {/* Gross Earnings */}
                    <td className="py-3.5 px-4 font-mono">
                      <p className="font-bold text-slate-900">₹{rec.grossEarnings.toLocaleString()}</p>
                      <p className="text-[10px] text-slate-400">Base: ₹{rec.baseSalary.toLocaleString()}</p>
                    </td>

                    {/* Deductions */}
                    <td className="py-3.5 px-4 font-mono">
                      <p className="font-bold text-rose-600">-₹{rec.totalDeductions.toLocaleString()}</p>
                      <p className="text-[10px] text-slate-400">PF: ₹{rec.pfDeduction} • TDS: ₹{rec.tdsTax}</p>
                    </td>

                    {/* Net Pay */}
                    <td className="py-3.5 px-4 font-mono">
                      <p className="font-extrabold text-emerald-700 text-sm">₹{rec.netPayable.toLocaleString()}</p>
                      <p className="text-[10px] text-slate-400">{rec.paymentMode}</p>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px] font-bold ${
                          rec.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          rec.status === 'Approved' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            rec.status === 'Paid' ? 'bg-emerald-500' :
                            rec.status === 'Approved' ? 'bg-blue-500' : 'bg-amber-500'
                          }`} />
                          {rec.status === 'Paid' ? 'Disbursed / Paid' : rec.status}
                        </span>
                        {rec.status === 'Paid' && rec.transactionReference && (
                          <span className="text-[9.5px] font-mono text-emerald-800 bg-emerald-100/60 px-1.5 py-0.5 rounded truncate max-w-[150px]" title={rec.transactionReference}>
                            Ref: {rec.transactionReference}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* Inspect Payslip */}
                        <button
                          onClick={() => setViewingSlip(rec)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-orange-600 hover:bg-orange-50 transition-colors cursor-pointer"
                          title="Generate & View Official Payslip"
                        >
                          <FileText className="w-4 h-4" />
                        </button>

                        {/* Edit Adjustments */}
                        {rec.status !== 'Paid' && hasPermission('payroll', 'edit') && (
                          <button
                            onClick={() => setEditingSlip({ ...rec })}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Edit Overtime / Bonus Adjustments"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        )}

                        {/* Approve Action */}
                        {rec.status === 'Draft' && hasPermission('payroll', 'approve') && (
                          <button
                            onClick={() => approvePayrollRecord(rec.id)}
                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                            title="Approve for Bank Disbursal"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}

                        {/* Disburse Action */}
                        {rec.status === 'Approved' && hasPermission('payroll', 'approve') && (
                          <button
                            onClick={() => {
                              setDisbursingSlip(rec);
                              setTxRefInput(`CMS-NEFT-${Date.now().toString().slice(-8)}`);
                            }}
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                            title="Disburse / Mark as Paid"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        )}

                        {/* Delete Slip */}
                        {rec.status !== 'Paid' && hasPermission('payroll', 'delete') && (
                          <button
                            onClick={() => deletePayrollRecord(rec.id)}
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

      {/* OFFICIAL INDUSTRIAL PAYSLIP MODAL & PRINT VIEW */}
      {viewingSlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header Actions */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between no-print">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-400" />
                <span className="font-bold text-sm">Official Salary Slip: {viewingSlip.payrollMonth}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintPayslip}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Payslip</span>
                </button>
                <button
                  onClick={() => setViewingSlip(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Payslip Body */}
            <div className="p-8 overflow-y-auto space-y-6 text-xs text-slate-900 font-sans print-area bg-white">
              
              {/* Company Header */}
              <div className="flex items-start justify-between border-b-2 border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white font-extrabold text-base">
                      W
                    </div>
                    <div>
                      <h2 className="text-base font-extrabold text-slate-900 tracking-tight">{companySettings.legalEntityName}</h2>
                      <p className="text-[10px] text-slate-500 font-mono">CIN: {companySettings.cinNumber} • GSTIN: {companySettings.gstinNumber}</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-600 mt-1 max-w-md">{companySettings.registeredOffice}</p>
                </div>

                <div className="text-right">
                  <span className="inline-block px-3 py-1 rounded bg-orange-100 text-orange-900 font-bold font-mono text-xs uppercase border border-orange-200">
                    PAYSLIP
                  </span>
                  <p className="text-xs font-extrabold text-slate-900 font-mono mt-1">{viewingSlip.payrollMonth}</p>
                </div>
              </div>

              {/* Employee Summary Grid */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="space-y-1.5">
                  <p><span className="text-slate-500">Employee Name:</span> <strong className="text-slate-900 font-bold">{viewingSlip.employeeName}</strong></p>
                  <p><span className="text-slate-500">Employee Code:</span> <strong className="font-mono text-slate-900">{viewingSlip.employeeCode}</strong></p>
                  <p><span className="text-slate-500">Department:</span> <span className="text-slate-800">{viewingSlip.department}</span></p>
                  <p><span className="text-slate-500">Designation:</span> <span className="text-slate-800 font-semibold">{viewingSlip.designation}</span></p>
                </div>

                <div className="space-y-1.5">
                  <p><span className="text-slate-500">Bank Name:</span> <span className="text-slate-800 font-medium">{viewingSlip.bankName}</span></p>
                  <p><span className="text-slate-500">Bank A/C No:</span> <strong className="font-mono text-slate-900">{viewingSlip.bankAccountNumber}</strong></p>
                  <p><span className="text-slate-500">IFSC Code:</span> <span className="font-mono text-slate-800">{viewingSlip.ifscCode}</span></p>
                  <p><span className="text-slate-500">PAN Number:</span> <span className="font-mono text-slate-800 uppercase">{viewingSlip.panNumber}</span></p>
                </div>
              </div>

              {/* Attendance Bar */}
              <div className="flex items-center justify-between px-4 py-2 rounded-lg bg-orange-50 border border-orange-200/80 font-mono text-[11px]">
                <span>Total Days in Month: <strong>{viewingSlip.workingDays}</strong></span>
                <span>Paid Days: <strong className="text-emerald-700">{viewingSlip.paidDays}</strong></span>
                <span>Unpaid Leaves (LOP): <strong className="text-rose-600">{viewingSlip.unpaidLeaves}</strong></span>
                <span>Overtime Hours: <strong className="text-blue-700">{viewingSlip.overtimeHours} hrs</strong></span>
              </div>

              {/* Earnings vs Deductions Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="grid grid-cols-2 divide-x divide-slate-200">
                  
                  {/* EARNINGS */}
                  <div>
                    <div className="bg-slate-100 px-4 py-2 font-bold text-slate-800 border-b border-slate-200">
                      EARNINGS (A)
                    </div>
                    <div className="p-4 space-y-2 font-mono text-[11.5px]">
                      <div className="flex justify-between"><span className="text-slate-600">Basic Salary</span><span>₹{viewingSlip.baseSalary.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span className="text-slate-600">House Rent Allowance (HRA)</span><span>₹{viewingSlip.hra.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span className="text-slate-600">Dearness Allowance (DA)</span><span>₹{viewingSlip.da.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span className="text-slate-600">Special Allowance</span><span>₹{viewingSlip.specialAllowance.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span className="text-slate-600">Conveyance Allowance</span><span>₹{viewingSlip.conveyanceAllowance.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span className="text-slate-600">Medical Allowance</span><span>₹{viewingSlip.medicalAllowance.toLocaleString()}</span></div>
                      {viewingSlip.overtimePay > 0 && (
                        <div className="flex justify-between text-emerald-700 font-bold"><span>Overtime Pay ({viewingSlip.overtimeHours}h)</span><span>+₹{viewingSlip.overtimePay.toLocaleString()}</span></div>
                      )}
                      {viewingSlip.performanceBonus > 0 && (
                        <div className="flex justify-between text-emerald-700 font-bold"><span>Performance Bonus</span><span>+₹{viewingSlip.performanceBonus.toLocaleString()}</span></div>
                      )}
                    </div>
                    <div className="bg-slate-50 px-4 py-2.5 font-bold text-slate-900 border-t border-slate-200 flex justify-between font-mono">
                      <span>Total Gross Earnings</span>
                      <span>₹{viewingSlip.grossEarnings.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* DEDUCTIONS */}
                  <div>
                    <div className="bg-slate-100 px-4 py-2 font-bold text-slate-800 border-b border-slate-200">
                      DEDUCTIONS (B)
                    </div>
                    <div className="p-4 space-y-2 font-mono text-[11.5px]">
                      <div className="flex justify-between"><span className="text-slate-600">Provident Fund (PF)</span><span className="text-rose-600">-₹{viewingSlip.pfDeduction.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span className="text-slate-600">Professional Tax (PT)</span><span className="text-rose-600">-₹{viewingSlip.professionalTax.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span className="text-slate-600">TDS / Income Tax</span><span className="text-rose-600">-₹{viewingSlip.tdsTax.toLocaleString()}</span></div>
                      {viewingSlip.leaveDeduction > 0 && (
                        <div className="flex justify-between"><span className="text-slate-600">Leave Deduction (LOP)</span><span className="text-rose-600">-₹{viewingSlip.leaveDeduction.toLocaleString()}</span></div>
                      )}
                      {viewingSlip.otherDeductions > 0 && (
                        <div className="flex justify-between"><span className="text-slate-600">Other Deductions</span><span className="text-rose-600">-₹{viewingSlip.otherDeductions.toLocaleString()}</span></div>
                      )}
                    </div>
                    <div className="bg-slate-50 px-4 py-2.5 font-bold text-rose-700 border-t border-slate-200 flex justify-between font-mono">
                      <span>Total Deductions</span>
                      <span>-₹{viewingSlip.totalDeductions.toLocaleString()}</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* NET SALARY HIGHLIGHT BOX */}
              <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between font-mono shadow-md">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">NET IN-HAND TAKE HOME PAY (A - B)</p>
                  <p className="text-2xl font-extrabold text-emerald-400 mt-0.5">₹{viewingSlip.netPayable.toLocaleString()}</p>
                </div>

                <div className="text-right">
                  <span className="text-xs bg-emerald-950 text-emerald-300 px-3 py-1 rounded border border-emerald-500/40 font-bold">
                    {viewingSlip.status === 'Paid' ? 'PAID & TRANSFERRED' : 'APPROVED FOR DISBURSAL'}
                  </span>
                  {viewingSlip.transactionReference && (
                    <p className="text-[10px] text-slate-400 mt-1 font-mono">Tx Ref: {viewingSlip.transactionReference}</p>
                  )}
                </div>
              </div>

              {/* Signatures & Verification */}
              <div className="pt-8 border-t border-slate-300 flex items-center justify-between text-[11px] text-slate-600">
                <div>
                  <p className="font-bold text-slate-800">For Weldor Industries Private Limited</p>
                  <div className="w-28 h-10 mt-1 border-b border-dashed border-slate-400 flex items-end">
                    <span className="font-serif italic text-[11px] text-slate-500">Authorized Signatory</span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-bold text-slate-800">Employee Signature</p>
                  <div className="w-28 h-10 mt-1 border-b border-dashed border-slate-400 flex items-end justify-end">
                    <span className="font-serif italic text-[11px] text-slate-500">Received & Confirmed</span>
                  </div>
                </div>
              </div>

              <p className="text-[9.5px] text-slate-400 text-center font-mono pt-4">
                This is a computer generated salary document and requires no physical signature when digitally approved.
              </p>

            </div>

          </div>
        </div>
      )}

      {/* EDIT OVERTIME / BONUS ADJUSTMENTS MODAL */}
      {editingSlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Adjust Payroll Slip: {editingSlip.employeeName}</h3>
                <p className="text-[11px] text-slate-400 font-mono">{editingSlip.payrollMonth}</p>
              </div>
              <button
                onClick={() => setEditingSlip(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdjustments} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Overtime Hours</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={editingSlip.overtimeHours}
                    onChange={e => setEditingSlip(prev => prev ? ({ ...prev, overtimeHours: Number(e.target.value) }) : null)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">OT Hourly Rate (₹)</label>
                  <input
                    type="number"
                    min="100"
                    step="50"
                    value={editingSlip.overtimeRate || 300}
                    onChange={e => setEditingSlip(prev => prev ? ({ ...prev, overtimeRate: Number(e.target.value) }) : null)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Performance Bonus (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={editingSlip.performanceBonus}
                    onChange={e => setEditingSlip(prev => prev ? ({ ...prev, performanceBonus: Number(e.target.value) }) : null)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Unpaid Leaves (LOP Days)</label>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={editingSlip.unpaidLeaves}
                    onChange={e => setEditingSlip(prev => prev ? ({ ...prev, unpaidLeaves: Number(e.target.value), paidDays: 30 - Number(e.target.value) }) : null)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Remarks & Incentive Notes</label>
                <textarea
                  rows={2}
                  value={editingSlip.remarks || ''}
                  onChange={e => setEditingSlip(prev => prev ? ({ ...prev, remarks: e.target.value }) : null)}
                  placeholder="e.g. Approved overtime for high-volume export dispatch."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingSlip(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold shadow-md shadow-orange-600/30"
                >
                  Save & Re-calculate Net Pay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DISBURSE SINGLE PAYSLIP MODAL */}
      {disbursingSlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-2xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Send className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">Disburse Salary: {disbursingSlip.employeeName}</h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                A/C: {disbursingSlip.bankAccountNumber} ({disbursingSlip.bankName})
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Net Payable:</span>
                <strong className="text-emerald-700 text-sm">₹{disbursingSlip.netPayable.toLocaleString()}</strong>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Bank UTR / NEFT Transaction Reference</label>
              <input
                type="text"
                value={txRefInput}
                onChange={e => setTxRefInput(e.target.value)}
                placeholder="e.g. CMS-HDFC-90219481"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDisbursingSlip(null)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  disbursePayrollRecord(disbursingSlip.id, txRefInput);
                  setDisbursingSlip(null);
                }}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30"
              >
                Confirm Disbursal
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
