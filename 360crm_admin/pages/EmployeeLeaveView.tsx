import React, { useState } from 'react';
import { api } from '@/src/services/api';
import { CalendarDays, CheckCircle2, Clock3, Plus, X } from 'lucide-react';
import { DetailDrawer, EmployeePage, EmployeeRecord, Stats, useEmployeeRecords } from './EmployeeModuleShared';

export const EmployeeLeaveView: React.FC = () => {
  const [selected, setSelected] = useState<EmployeeRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [leaveType, setLeaveType] = useState('CASUAL');
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(new Date(Date.now() + 86400000).toISOString().slice(0, 10));
  const [reason, setReason] = useState('');

  const data = useEmployeeRecords('/employee/leave', [], value => value?.leaves || []);

  const handleApplyLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) {
      alert('Please state a reason for your leave request.');
      return;
    }

    try {
      setSubmitting(true);
      const response = await api.post('/employee/leave', {
        leaveType,
        startDate,
        endDate,
        reason
      });

      if (response.success) {
        setIsModalOpen(false);
        setReason('');
        await data.reload();
      } else {
        alert(response.message || 'Failed to submit leave application');
      }
    } catch (err: any) {
      alert('Error applying for leave: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <EmployeePage
      eyebrow="People workspace"
      title="Leave Requests"
      description="Review your leave balance, upcoming time off and approval history."
      icon={CalendarDays}
      action="Apply leave"
      onAction={() => setIsModalOpen(true)}
    >
      <Stats
        items={[
          { label: 'Available Leave', value: '18 days', detail: 'Annual quota', tone: 'text-blue-600' },
          { label: 'Approved Requests', value: String(data.records.filter(row => row.status === 'APPROVED').length), detail: 'Past approvals', tone: 'text-emerald-600' },
          { label: 'Pending Requests', value: String(data.records.filter(row => row.status === 'PENDING' || row.status === 'Under HR review').length), detail: 'Under HR review', tone: 'text-amber-600' },
          { label: 'Total Submitted', value: String(data.records.length), detail: 'Leave history', tone: 'text-blue-600' }
        ]}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        {/* Calendar View */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-slate-900">Leave calendar</h2>
              <p className="mt-1 text-xs text-slate-500">{new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })} • Scheduled time off</p>
            </div>
            <Clock3 className="h-5 w-5 text-blue-600" />
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
              <span key={`${day}-${index}`} className="py-2">{day}</span>
            ))}
            {Array.from({ length: 31 }, (_, index) => (
              <button
                key={index}
                className={`rounded-lg py-2.5 text-xs ${
                  index + 1 === 20
                    ? 'bg-blue-600 font-black text-white'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </section>

        {/* Requests List */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-black text-slate-900 mb-3">Recent Requests</h2>
          <div className="space-y-3">
            {data.records.map(row => (
              <button
                key={row.id}
                onClick={() => setSelected(row)}
                className="flex w-full items-start justify-between gap-3 border-b border-slate-100 pb-3 text-left last:border-0 hover:bg-slate-50 p-2 rounded-xl transition-colors cursor-pointer"
              >
                <div>
                  <p className="text-xs font-bold text-slate-900">{row.name}</p>
                  <p className="mt-0.5 text-[11px] text-slate-500">{row.detail}</p>
                  <p className="mt-0.5 text-[10px] text-slate-400">
                    {row.date ? new Date(row.date).toLocaleDateString() : 'Today'}
                  </p>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                  row.status === 'APPROVED'
                    ? 'bg-emerald-50 text-emerald-700'
                    : row.status === 'REJECTED'
                    ? 'bg-rose-50 text-rose-700'
                    : 'bg-amber-50 text-amber-700'
                }`}>
                  {row.status === 'PENDING' ? 'Under HR review' : row.status}
                </span>
              </button>
            ))}
            {data.records.length === 0 && (
              <p className="text-xs text-slate-400 py-6 text-center">No leave applications yet.</p>
            )}
          </div>
        </section>
      </div>

      {/* Apply Leave Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-blue-600" />
                <span>Apply for Leave</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplyLeave} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Leave Type</label>
                <select
                  value={leaveType}
                  onChange={e => setLeaveType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  <option value="CASUAL">Casual Leave (CL)</option>
                  <option value="SICK">Sick / Medical Leave (SL)</option>
                  <option value="EARNED">Earned / Annual Leave (EL)</option>
                  <option value="EMERGENCY">Emergency Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">End Date *</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Reason for Leave *</label>
                <textarea
                  rows={3}
                  required
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  placeholder="Explain why you are requesting leave..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-600/25 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{submitting ? 'Submitting...' : 'Submit Application'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DetailDrawer record={selected} onClose={() => setSelected(null)} />
    </EmployeePage>
  );
};
