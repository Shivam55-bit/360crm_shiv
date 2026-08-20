import React, { useState, useEffect } from 'react';
import { api } from '@/src/services/api';
import { useAuth } from '@/src/context/AuthContext';
import { Employee, Attendance, Salary } from '@/src/types';
import {
  PageHeader,
  StatusBadge,
  Modal,
  exportToCSV
} from '@/src/components/common/UIComponents';
import {
  User,
  UserCheck,
  CalendarDays,
  TrendingUp,
  Plus,
  Search,
  Download,
  CheckCircle2,
  Clock,
  DollarSign
} from 'lucide-react';

// ==========================================
// 1. EMPLOYEES VIEW
// ==========================================
export const EmployeesView: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    department: 'Sales',
    designation: 'Sales Executive',
    salary: 40000
  });

  const fetchEmployees = async () => {
    const res = await api.get('/employees');
    if (res.success && res.data) setEmployees(res.data);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await api.post('/employees', formData);
    if (res.success) {
      setIsModalOpen(false);
      fetchEmployees();
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="Employee Directory & HR"
        subtitle="Manage company staff profiles, designations, department allocation & payroll"
        actionText="Onboard Employee"
        actionIcon={Plus}
        actionPermission="employees.create"
        onAction={() => setIsModalOpen(true)}
        secondaryAction={
          <button
            onClick={() => exportToCSV('360CRM_Employees', employees)}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Export CSV
          </button>
        }
      />

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-semibold uppercase">
              <tr>
                <th className="px-6 py-3.5">Emp ID & Name</th>
                <th className="px-6 py-3.5">Department</th>
                <th className="px-6 py-3.5">Designation</th>
                <th className="px-6 py-3.5">Contact Details</th>
                <th className="px-6 py-3.5">Monthly Base Salary</th>
                <th className="px-6 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {employees.map(e => (
                <tr key={e._id} className="hover:bg-slate-50/70">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{e.name}</div>
                    <div className="text-[11px] text-blue-600 font-mono">{e.employeeId}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 font-semibold text-slate-700 text-[11px]">
                      {e.department}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-800">{e.designation}</td>
                  <td className="px-6 py-4">
                    <div>{e.phone}</div>
                    <div className="text-[11px] text-slate-400">{e.email}</div>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">₹{e.salary.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4"><StatusBadge status={e.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Onboard New Employee"
        subtitle="Register employee profile, salary and contact details"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Password *</label>
              <input
                type="password"
                required
                placeholder="Required for portal login"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Designation *</label>
              <input
                type="text"
                required
                value={formData.designation}
                onChange={e => setFormData({ ...formData, designation: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Department</label>
              <select
                value={formData.department}
                onChange={e => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="Sales">Sales</option>
                <option value="Store / Warehouse">Store / Warehouse</option>
                <option value="Accounts">Accounts</option>
                <option value="HR & Admin">HR & Admin</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Base Salary (₹)</label>
              <input
                type="number"
                value={formData.salary}
                onChange={e => setFormData({ ...formData, salary: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white rounded-xl font-semibold shadow-xs"
            >
              Save Employee
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

// ==========================================
// 2. ATTENDANCE VIEW
// ==========================================
export const AttendanceView: React.FC = () => {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const fetchAttendance = async () => {
    const res = await api.get('/attendance');
    if (res.success && res.data) setAttendance(res.data);
    const empRes = await api.get('/employees');
    if (empRes.success && empRes.data) setEmployees(empRes.data);
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleMarkPresent = async (emp: Employee) => {
    const res = await api.post('/attendance', {
      employeeId: emp.employeeId,
      employeeName: emp.name,
      status: 'PRESENT',
      checkIn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    if (res.success) fetchAttendance();
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="Attendance Tracker"
        subtitle="Daily biometric & shift attendance logs with check-in/out stamps"
      />

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-semibold uppercase">
              <tr>
                <th className="px-6 py-3.5">Employee</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5">Check In & Selfie</th>
                <th className="px-6 py-3.5">Check Out & Selfie</th>
                <th className="px-6 py-3.5">GPS Location</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Work Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {attendance.map(a => (
                <tr key={a._id} className="hover:bg-slate-50/70">
                  <td className="px-6 py-4 font-bold text-slate-900">{a.employeeName}</td>
                  <td className="px-6 py-4 text-slate-600 font-mono">{a.date}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {a.selfieCheckIn ? (
                        <img src={a.selfieCheckIn} alt="In Selfie" className="w-8 h-8 rounded-lg object-cover border border-emerald-300 shadow-2xs" />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs text-slate-400">📷</div>
                      )}
                      <span className="font-mono text-emerald-600 font-bold">{a.checkIn || '--:--'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {a.selfieCheckOut ? (
                        <img src={a.selfieCheckOut} alt="Out Selfie" className="w-8 h-8 rounded-lg object-cover border border-rose-300 shadow-2xs" />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs text-slate-400">📷</div>
                      )}
                      <span className="font-mono text-slate-600">{a.checkOut || '--:--'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[11px] text-slate-500 max-w-[200px] truncate">
                    {a.locationCheckIn?.address || (a.locationCheckIn?.lat ? `Lat: ${a.locationCheckIn.lat.toFixed(4)}, Lng: ${a.locationCheckIn.lng.toFixed(4)}` : 'Office Registered')}
                  </td>
                  <td className="px-6 py-4"><StatusBadge status={a.status} /></td>
                  <td className="px-6 py-4 font-mono font-bold text-slate-800">
                    {a.workHours ? `${a.workHours} hrs` : a.checkOut ? '8.0 hrs' : 'Active Shift'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. PERFORMANCE VIEW
// ==========================================
export const PerformanceView: React.FC = () => {
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    api.get('/performance').then(res => {
      if (res.success && res.data) setReviews(Array.isArray(res.data) ? res.data : res.data.reviews || []);
    });
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <PageHeader title="Performance Reviews" subtitle="Track employee ratings, goals and review history from the live HR API" />
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-semibold uppercase">
              <tr>
                <th className="px-6 py-3.5">Employee</th>
                <th className="px-6 py-3.5">Review Period</th>
                <th className="px-6 py-3.5">Rating</th>
                <th className="px-6 py-3.5">Goals Achieved</th>
                <th className="px-6 py-3.5">Reviewer</th>
                <th className="px-6 py-3.5">Review Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {reviews.map(review => (
                <tr key={review._id} className="hover:bg-slate-50/70">
                  <td className="px-6 py-4 font-bold text-slate-900">{review.employeeName}</td>
                  <td className="px-6 py-4 text-blue-600 font-semibold">{review.reviewPeriod}</td>
                  <td className="px-6 py-4 font-bold text-amber-600">{review.rating} / 5</td>
                  <td className="px-6 py-4 text-slate-600">{review.goalsAchieved || 'Not recorded'}</td>
                  <td className="px-6 py-4 text-slate-600">{review.reviewerName}</td>
                  <td className="px-6 py-4 text-slate-500">{review.reviewDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {reviews.length === 0 && <div className="p-10 text-center text-xs text-slate-500">No performance reviews found.</div>}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. SALARY / PAYROLL VIEW
// ==========================================
export const SalaryView: React.FC = () => {
  const [salaries, setSalaries] = useState<Salary[]>([]);

  const fetchSalaries = async () => {
    const res = await api.get('/salary');
    if (res.success && res.data) setSalaries(res.data);
  };

  useEffect(() => {
    fetchSalaries();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="Payroll & Salary Disbursals"
        subtitle="Monthly payroll register, allowances, deductions and net salary calculation"
      />

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-semibold uppercase">
              <tr>
                <th className="px-6 py-3.5">Employee</th>
                <th className="px-6 py-3.5">Salary Month</th>
                <th className="px-6 py-3.5">Basic Pay</th>
                <th className="px-6 py-3.5">Allowances</th>
                <th className="px-6 py-3.5">Deductions (TDS/PF)</th>
                <th className="px-6 py-3.5">Net Pay</th>
                <th className="px-6 py-3.5">Payment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {salaries.map(s => (
                <tr key={s._id} className="hover:bg-slate-50/70">
                  <td className="px-6 py-4 font-bold text-slate-900">{s.employeeName}</td>
                  <td className="px-6 py-4 font-semibold text-blue-600">{s.month}</td>
                  <td className="px-6 py-4">₹{s.basicSalary.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 text-emerald-600">+₹{s.allowances.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 text-rose-600">-₹{s.deductions.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 font-bold text-slate-900 text-sm">₹{s.netSalary.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4"><StatusBadge status={s.paymentStatus} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
