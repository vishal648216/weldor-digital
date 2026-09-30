import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { AttendanceRecord, LeaveRequest } from '../../types';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  UserCheck, 
  Users, 
  Plus, 
  Search, 
  Filter, 
  X, 
  Building2, 
  Briefcase,
  Layers,
  Sparkles
} from 'lucide-react';

export const AttendanceManager: React.FC = () => {
  const { 
    attendance, 
    logAttendance, 
    updateAttendance, 
    leaveRequests, 
    applyLeaveRequest, 
    updateLeaveRequestStatus, 
    employees, 
    currentEmployee,
    hasPermission 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'attendance' | 'leaves'>('attendance');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Modals
  const [isLogPunchOpen, setIsLogPunchOpen] = useState(false);
  const [isApplyLeaveOpen, setIsApplyLeaveOpen] = useState(false);

  // Form State for Punch
  const [punchForm, setPunchForm] = useState<{
    employeeId: string;
    checkIn: string;
    checkOut: string;
    shift: AttendanceRecord['shift'];
    status: AttendanceRecord['status'];
  }>({
    employeeId: employees[0]?.id || '',
    checkIn: '09:00',
    checkOut: '18:00',
    shift: 'Morning General (09:00 - 18:00)',
    status: 'Present',
  });

  // Form State for Leave
  const [leaveForm, setLeaveForm] = useState<{
    employeeId: string;
    leaveType: LeaveRequest['leaveType'];
    startDate: string;
    endDate: string;
    totalDays: number;
    reason: string;
  }>({
    employeeId: employees[0]?.id || '',
    leaveType: 'Casual Leave (CL)',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    totalDays: 1,
    reason: '',
  });

  // Filtered Attendance
  const filteredAttendance = attendance.filter(a => {
    const matchesSearch = a.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Handle Submit Punch
  const handleSavePunch = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find(e => e.id === punchForm.employeeId);
    if (!emp) return;

    const inHour = Number(punchForm.checkIn.split(':')[0]) + Number(punchForm.checkIn.split(':')[1]) / 60;
    const outHour = Number(punchForm.checkOut.split(':')[0]) + Number(punchForm.checkOut.split(':')[1]) / 60;
    const diff = Math.max(0, outHour - inHour);
    const ot = Math.max(0, diff - 9);

    logAttendance({
      employeeId: emp.id,
      employeeName: emp.name,
      department: emp.department,
      date: selectedDate,
      checkIn: punchForm.checkIn,
      checkOut: punchForm.checkOut,
      totalHours: Number(diff.toFixed(2)),
      overtimeHours: Number(ot.toFixed(2)),
      status: punchForm.status,
      shift: punchForm.shift,
    });

    setIsLogPunchOpen(false);
  };

  // Handle Submit Leave
  const handleSaveLeave = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find(e => e.id === leaveForm.employeeId);
    if (!emp) return;

    applyLeaveRequest({
      employeeId: emp.id,
      employeeName: emp.name,
      department: emp.department,
      leaveType: leaveForm.leaveType,
      startDate: leaveForm.startDate,
      endDate: leaveForm.endDate,
      totalDays: Number(leaveForm.totalDays) || 1,
      reason: leaveForm.reason || 'Personal Leave',
      status: 'Pending',
      appliedAt: new Date().toISOString().split('T')[0],
    });

    setIsApplyLeaveOpen(false);
  };

  const presentCount = attendance.filter(a => a.status === 'Present').length;
  const lateCount = attendance.filter(a => a.status === 'Late').length;
  const leaveCount = attendance.filter(a => a.status === 'On Leave').length;
  const pendingLeavesCount = leaveRequests.filter(l => l.status === 'Pending').length;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 rounded-2xl text-white shadow-xl border border-slate-700/50">
        <div>
          <div className="flex items-center gap-2.5 text-xs font-mono text-blue-400 font-bold uppercase tracking-wider mb-1">
            <Clock className="w-4 h-4" />
            <span>DAILY TIME & ATTENDANCE MANAGEMENT</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Floor Attendance & Leave Roster
          </h1>
          <p className="text-slate-300 text-xs md:text-sm mt-1 max-w-2xl">
            Real-time shop-floor biometric check-ins, overtime calculation, shift scheduling, and leave request approval workflow.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLogPunchOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs md:text-sm shadow-lg shadow-orange-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Clock className="w-4 h-4" />
            <span>Log Time Punch</span>
          </button>

          <button
            onClick={() => setIsApplyLeaveOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs md:text-sm border border-slate-600 shadow-md transition-all cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-blue-400" />
            <span>Apply Leave</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-mono font-bold text-slate-400 uppercase">Present Today</p>
            <h3 className="text-2xl font-extrabold text-slate-900">{presentCount}</h3>
            <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">On Shift</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-mono font-bold text-slate-400 uppercase">Late Arrivals</p>
            <h3 className="text-2xl font-extrabold text-amber-700">{lateCount}</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Grace period applied</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-mono font-bold text-slate-400 uppercase">On Approved Leave</p>
            <h3 className="text-2xl font-extrabold text-blue-600">{leaveCount}</h3>
            <p className="text-[10px] text-slate-500 mt-0.5 font-mono">Planned Leaves</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-mono font-bold text-slate-400 uppercase">Pending Approvals</p>
            <h3 className="text-2xl font-extrabold text-rose-600">{pendingLeavesCount}</h3>
            <p className="text-[10px] text-rose-600 font-semibold mt-0.5">Requires Manager Review</p>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-2 shadow-xs text-xs font-bold">
        <button
          onClick={() => setActiveTab('attendance')}
          className={`py-3 px-5 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'attendance' ? 'border-orange-600 text-orange-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Today's Time Logs ({attendance.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('leaves')}
          className={`py-3 px-5 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'leaves' ? 'border-orange-600 text-orange-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Leave Applications ({leaveRequests.length})</span>
          {pendingLeavesCount > 0 && (
            <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono">
              {pendingLeavesCount}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: Attendance Logs */}
      {activeTab === 'attendance' && (
        <div className="bg-white rounded-b-xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search employee or department..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-600">
              <span>Date:</span>
              <input
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 font-mono text-xs bg-slate-50"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-mono uppercase text-slate-500 font-bold tracking-wider">
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Shift</th>
                  <th className="py-3 px-4">Check-In</th>
                  <th className="py-3 px-4">Check-Out</th>
                  <th className="py-3 px-4">Total Hours</th>
                  <th className="py-3 px-4">Overtime</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-mono">
                {filteredAttendance.map(att => (
                  <tr key={att.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-sans">
                      <p className="font-bold text-slate-900">{att.employeeName}</p>
                    </td>
                    <td className="py-3.5 px-4 font-sans text-slate-600">{att.department}</td>
                    <td className="py-3.5 px-4 text-[11px] text-slate-500">{att.shift}</td>
                    <td className="py-3.5 px-4 text-emerald-700 font-bold">{att.checkIn}</td>
                    <td className="py-3.5 px-4 text-slate-700">{att.checkOut || 'Active'}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{att.totalHours} hrs</td>
                    <td className="py-3.5 px-4 text-blue-700 font-bold">
                      {att.overtimeHours > 0 ? `+${att.overtimeHours} hrs` : '-'}
                    </td>
                    <td className="py-3.5 px-4 text-right font-sans">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold ${
                        att.status === 'Present' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        att.status === 'Late' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {att.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Leave Applications & Approvals */}
      {activeTab === 'leaves' && (
        <div className="bg-white rounded-b-xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-mono uppercase text-slate-500 font-bold tracking-wider">
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Leave Type</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Total Days</th>
                  <th className="py-3 px-4">Reason / Notes</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Approval Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {leaveRequests.map(lev => (
                  <tr key={lev.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{lev.employeeName}</p>
                      <span className="text-[10px] text-slate-500 font-mono">{lev.department}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-medium text-slate-800">
                        {lev.leaveType}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                      {lev.startDate} to {lev.endDate}
                    </td>

                    <td className="py-3.5 px-4 font-bold font-mono text-slate-900">
                      {lev.totalDays} Day{lev.totalDays > 1 ? 's' : ''}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                      {lev.reason}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] font-bold ${
                        lev.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        lev.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                        'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {lev.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {lev.status === 'Pending' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => updateLeaveRequestStatus(lev.id, 'Approved')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => updateLeaveRequestStatus(lev.id, 'Rejected')}
                            className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] font-mono text-slate-400">
                          Reviewed by {lev.approvedBy || 'Admin'}
                        </span>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* LOG TIME PUNCH MODAL */}
      {isLogPunchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Log Shop-Floor Time Punch</h3>
              <button onClick={() => setIsLogPunchOpen(false)} className="p-1.5 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePunch} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Employee</label>
                <select
                  value={punchForm.employeeId}
                  onChange={e => setPunchForm(prev => ({ ...prev, employeeId: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-medium"
                >
                  {employees.map(e => (
                    <option key={e.id} value={e.id}>{e.name} ({e.department})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Check-In Time</label>
                  <input
                    type="time"
                    value={punchForm.checkIn}
                    onChange={e => setPunchForm(prev => ({ ...prev, checkIn: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Check-Out Time</label>
                  <input
                    type="time"
                    value={punchForm.checkOut}
                    onChange={e => setPunchForm(prev => ({ ...prev, checkOut: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Shift</label>
                <select
                  value={punchForm.shift}
                  onChange={e => setPunchForm(prev => ({ ...prev, shift: e.target.value as any }))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900"
                >
                  <option value="Morning General (09:00 - 18:00)">Morning General (09:00 - 18:00)</option>
                  <option value="Night Shift (20:00 - 05:00)">Night Shift (20:00 - 05:00)</option>
                  <option value="Evening Shift (14:00 - 23:00)">Evening Shift (14:00 - 23:00)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Attendance Status</label>
                <select
                  value={punchForm.status}
                  onChange={e => setPunchForm(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900"
                >
                  <option value="Present">Present</option>
                  <option value="Late">Late Arrival</option>
                  <option value="Half Day">Half Day</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLogPunchOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold shadow-md shadow-orange-600/30"
                >
                  Log Punch Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* APPLY LEAVE MODAL */}
      {isApplyLeaveOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Apply Leave Request</h3>
              <button onClick={() => setIsApplyLeaveOpen(false)} className="p-1.5 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLeave} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Employee</label>
                <select
                  value={leaveForm.employeeId}
                  onChange={e => setLeaveForm(prev => ({ ...prev, employeeId: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-medium"
                >
                  {employees.map(e => (
                    <option key={e.id} value={e.id}>{e.name} ({e.department})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Leave Type</label>
                <select
                  value={leaveForm.leaveType}
                  onChange={e => setLeaveForm(prev => ({ ...prev, leaveType: e.target.value as any }))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900"
                >
                  <option value="Casual Leave (CL)">Casual Leave (CL)</option>
                  <option value="Sick Leave (SL)">Sick Leave (SL)</option>
                  <option value="Paid Leave (PL)">Paid Leave (PL)</option>
                  <option value="Maternity / Paternity">Maternity / Paternity</option>
                  <option value="Unpaid Leave">Unpaid Leave (LOP)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={leaveForm.startDate}
                    onChange={e => setLeaveForm(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={leaveForm.endDate}
                    onChange={e => setLeaveForm(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Reason for Leave</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Attending family function / medical checkup"
                  value={leaveForm.reason}
                  onChange={e => setLeaveForm(prev => ({ ...prev, reason: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsApplyLeaveOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold shadow-md shadow-orange-600/30"
                >
                  Submit for Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
