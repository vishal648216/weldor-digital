import React from 'react';
import { useApp } from '../../context/AppContext';
import { Activity, ShieldCheck, Download, Search } from 'lucide-react';

export const AuditLogViewer: React.FC = () => {
  const { auditLogs, showNotification } = useApp();

  return (
    <div className="p-6 space-y-6 text-slate-900">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 bg-white p-6 rounded-2xl shadow-xs">
        <div>
          <span className="text-xs font-mono font-bold text-orange-600 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full uppercase">
            Compliance & Security Trail
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 font-heading mt-2">
            System Audit Trail Logs
          </h1>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Immutable log stream capturing role changes, quotation approvals, lead stage updates, and system configuration edits.
          </p>
        </div>

        <button 
          onClick={() => showNotification('Exported system audit logs to CSV', 'info')}
          className="btn-secondary text-xs shrink-0 py-2 px-3.5"
        >
          <Download className="w-3.5 h-3.5 text-orange-600" /> Export Audit CSV
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-mono border-b border-slate-200">
                <th className="p-3 font-bold">TIMESTAMP</th>
                <th className="p-3 font-bold">USER / ROLE</th>
                <th className="p-3 font-bold">ACTION</th>
                <th className="p-3 font-bold">MODULE</th>
                <th className="p-3 font-bold">IP ADDRESS</th>
                <th className="p-3 font-bold">DETAILS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-3 font-mono text-slate-500">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="p-3">
                    <span className="font-bold text-slate-900 block">{log.userName}</span>
                    <span className="font-mono text-[10px] text-orange-700 font-bold">{log.userRole}</span>
                  </td>
                  <td className="p-3 font-mono font-bold text-sky-700">{log.action}</td>
                  <td className="p-3 font-mono text-slate-700 uppercase font-semibold">{log.module}</td>
                  <td className="p-3 font-mono text-slate-400">{log.ipAddress}</td>
                  <td className="p-3 text-slate-600 font-medium">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
