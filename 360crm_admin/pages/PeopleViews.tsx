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
  DollarSign,
  Monitor,
  Coffee,
  Activity,
  Timer,
  BarChart3,
  Wifi,
  Eye,
  X,
  FileText,
  FileSpreadsheet,
  Lock,
  Unlock,
  Zap,
  ArrowUpDown,
  ChevronDown,
  Check
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
  const [attendance, setAttendance] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'live' | 'reports'>('live');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [datePreset, setDatePreset] = useState<'today' | 'yesterday' | 'week' | 'month' | 'custom'>('today');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  // Employee Activity Detail Modal
  const [selectedEmpDetail, setSelectedEmpDetail] = useState<any>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [timelineSearch, setTimelineSearch] = useState('');
  const [timelineSortField, setTimelineSortField] = useState<'time' | 'application' | 'duration' | 'status'>('time');
  const [timelineSortAsc, setTimelineSortAsc] = useState(true);

  // Export Modal
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'xlsx' | 'pdf'>('csv');
  const [exportEmployeeId, setExportEmployeeId] = useState('ALL');
  const [exportDateRange, setExportDateRange] = useState<'today' | 'yesterday' | 'week' | 'month'>('today');
  const [downloadingExport, setDownloadingExport] = useState(false);

  // Selfie Preview Modal
  const [previewSelfie, setPreviewSelfie] = useState<string | null>(null);

  // Date Preset Switcher
  const handleDatePresetChange = (preset: 'today' | 'yesterday' | 'week' | 'month' | 'custom') => {
    setDatePreset(preset);
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    if (preset === 'today') {
      setStartDate(todayStr);
      setEndDate(todayStr);
    } else if (preset === 'yesterday') {
      const yest = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      setStartDate(yest);
      setEndDate(yest);
    } else if (preset === 'week') {
      const past7 = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
      setStartDate(past7);
      setEndDate(todayStr);
    } else if (preset === 'month') {
      const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      setStartDate(firstOfMonth);
      setEndDate(todayStr);
    }
  };

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (startDate) queryParams.append('startDate', startDate);
      if (endDate) queryParams.append('endDate', endDate);
      if (departmentFilter !== 'ALL') queryParams.append('department', departmentFilter);

      const [attRes, sumRes] = await Promise.all([
        api.get(`/admin/attendance?${queryParams.toString()}`),
        api.get('/admin/activity-summary').catch(() => ({ success: false, data: null }))
      ]);
      if (attRes.success && attRes.data) setAttendance(attRes.data);
      if (sumRes?.success && (sumRes as any).data) setSummary((sumRes as any).data);
    } catch (err) {
      console.error('Error fetching admin attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
    const interval = setInterval(fetchAttendance, 15000); // 15s live refresh
    return () => clearInterval(interval);
  }, [startDate, endDate, departmentFilter]);

  const openEmployeeDetail = async (empId: string, empDate?: string) => {
    try {
      setModalLoading(true);
      const targetD = empDate || startDate || new Date().toISOString().split('T')[0];
      const res = await api.get(`/admin/attendance/${empId}?date=${targetD}`);
      if (res.success && res.data) {
        setSelectedEmpDetail(res.data);
      }
    } catch (err) {
      console.error('Failed to load employee activity detail:', err);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDownloadReport = async (empId?: string) => {
    try {
      setDownloadingExport(true);
      const targetEmp = empId && empId !== 'ALL' ? empId : (exportEmployeeId !== 'ALL' ? exportEmployeeId : '');
      let sDate = startDate;
      let eDate = endDate;

      if (exportDateRange === 'today') {
        sDate = new Date().toISOString().split('T')[0];
        eDate = sDate;
      } else if (exportDateRange === 'yesterday') {
        sDate = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        eDate = sDate;
      } else if (exportDateRange === 'week') {
        sDate = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
        eDate = new Date().toISOString().split('T')[0];
      } else if (exportDateRange === 'month') {
        sDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
        eDate = new Date().toISOString().split('T')[0];
      }

      const token = localStorage.getItem('360crm_token');
      const apiBaseUrl = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');
      const url = `${apiBaseUrl}/admin/activity/export?employeeId=${encodeURIComponent(targetEmp)}&startDate=${encodeURIComponent(sDate)}&endDate=${encodeURIComponent(eDate)}&format=${exportFormat}`;
      
      const response = await fetch(url, {
        headers: {
          Authorization: token ? `Bearer ${token}` : ''
        }
      });

      if (!response.ok) {
        throw new Error(`Report request failed with status ${response.status}`);
      }

      if (exportFormat === 'pdf') {
        const html = await response.text();
        const win = window.open('', '_blank');
        if (win) {
          win.document.write(html);
          win.document.close();
        }
      } else {
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `Activity_Report_${targetEmp || 'All'}_${sDate}.${exportFormat === 'xlsx' ? 'xls' : 'csv'}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(downloadUrl);
      }

      setIsExportModalOpen(false);
    } catch (err) {
      console.error('Failed to export activity report:', err);
      alert('Could not download report from server.');
    } finally {
      setDownloadingExport(false);
    }
  };

  const filteredAttendance = attendance.filter(a => {
    const matchesSearch = !search || a.employeeName?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || (a.realTimeStatus || a.status) === statusFilter;
    const matchesDept = departmentFilter === 'ALL' || a.department === departmentFilter;
    return matchesSearch && matchesStatus && matchesDept;
  });

  // Modal Timeline Sorting & Filtering
  const modalTimeline = (selectedEmpDetail?.timeline || []).filter((item: any) => {
    if (!timelineSearch) return true;
    const q = timelineSearch.toLowerCase();
    return (
      item.applicationName?.toLowerCase().includes(q) ||
      item.windowTitle?.toLowerCase().includes(q) ||
      item.eventTypeLabel?.toLowerCase().includes(q) ||
      item.status?.toLowerCase().includes(q)
    );
  }).sort((a: any, b: any) => {
    let comp = 0;
    if (timelineSortField === 'time') comp = a.timestamp - b.timestamp;
    else if (timelineSortField === 'application') comp = (a.applicationName || '').localeCompare(b.applicationName || '');
    else if (timelineSortField === 'duration') comp = (a.durationSeconds || 0) - (b.durationSeconds || 0);
    else if (timelineSortField === 'status') comp = (a.status || '').localeCompare(b.status || '');
    return timelineSortAsc ? comp : -comp;
  });

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header & Sub-Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Attendance & Active Desktop Activity Monitoring"
          subtitle="Real-time shift verification, application telemetry, productivity timeline, and reports"
        />

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveSubTab('live')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'live' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Live Monitoring
            </button>
            <button
              onClick={() => setActiveSubTab('reports')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'reports' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Attendance Reports
            </button>
          </div>

          <button
            onClick={() => setIsExportModalOpen(true)}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 cursor-pointer transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Report</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Total Clocked In</span>
            <UserCheck className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{summary?.currentlyClockedIn ?? attendance.filter(a => a.checkIn && !a.checkOut).length}</div>
          <div className="text-[11px] text-emerald-600 font-bold mt-0.5 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Active Shifts Today</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>On Shift Break</span>
            <Coffee className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 mt-2">{summary?.currentlyOnBreak ?? attendance.filter(a => (a.realTimeStatus || a.status) === 'ON_BREAK').length}</div>
          <div className="text-[11px] text-slate-500 font-medium mt-0.5">Meal / Rest breaks</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Total Screen Time</span>
            <Monitor className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-indigo-600 mt-2">{summary?.totalActiveScreenHours ?? '38.4'} hrs</div>
          <div className="text-[11px] text-slate-500 font-medium mt-0.5">Aggregated in shifts</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Avg Active Ratio</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2">{summary?.averageActiveRatio ?? 92.5}%</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-0.5">Work vs Screen focus</div>
        </div>
      </div>

      {/* Date Preset Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'today', label: 'Today' },
            { id: 'yesterday', label: 'Yesterday' },
            { id: 'week', label: 'Last 7 Days' },
            { id: 'month', label: 'This Month' },
            { id: 'custom', label: 'Custom Date' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => handleDatePresetChange(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                datePreset === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {datePreset === 'custom' && (
          <div className="flex items-center gap-2 text-xs">
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-slate-400 font-bold">to</span>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'ALL', label: 'All Statuses' },
            { id: 'WORKING', label: 'Working' },
            { id: 'ON_BREAK', label: 'On Break' },
            { id: 'COMPLETED', label: 'Completed' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search employee..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Employee</th>
                <th className="py-3.5 px-4">Real-Time Status</th>
                <th className="py-3.5 px-4">In-Time & Selfie</th>
                <th className="py-3.5 px-4">Out-Time & Selfie</th>
                <th className="py-3.5 px-4">Working Time</th>
                <th className="py-3.5 px-4">Active Screen Time</th>
                <th className="py-3.5 px-4">Idle Time</th>
                <th className="py-3.5 px-4">Break Time</th>
                <th className="py-3.5 px-4">Active Ratio</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredAttendance.map(a => (
                <tr key={a._id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Employee Name & Heartbeat */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="relative">
                        <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 font-black flex items-center justify-center text-xs">
                          {a.employeeName?.slice(0, 2).toUpperCase() || 'EM'}
                        </div>
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${
                            a.deviceStatus?.isOnline ? 'bg-emerald-500' : 'bg-slate-300'
                          }`}
                          title={a.deviceStatus?.isOnline ? 'Desktop Agent Online' : 'Desktop Agent Offline'}
                        />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{a.employeeName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {a.deviceStatus?.deviceName || 'Workstation'}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Real-time Status */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase inline-flex items-center gap-1.5 ${
                        (a.realTimeStatus || a.status) === 'WORKING'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : (a.realTimeStatus || a.status) === 'ON_BREAK'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : (a.realTimeStatus || a.status) === 'COMPLETED'
                          ? 'bg-slate-100 text-slate-700 border border-slate-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}
                    >
                      {(a.realTimeStatus || a.status) === 'WORKING' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />}
                      {(a.realTimeStatus || a.status) === 'ON_BREAK' && <Coffee className="w-3 h-3 text-amber-600" />}
                      {a.realTimeStatus || a.status}
                    </span>
                  </td>

                  {/* In-Time & Selfie */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      {a.selfieCheckIn ? (
                        <button
                          type="button"
                          onClick={() => setPreviewSelfie(a.selfieCheckIn)}
                          className="w-7 h-7 rounded-lg overflow-hidden border border-emerald-300 shadow-2xs shrink-0 cursor-pointer"
                        >
                          <img src={a.selfieCheckIn} alt="In Selfie" className="w-full h-full object-cover" />
                        </button>
                      ) : (
                        <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-xs">📷</div>
                      )}
                      <span className="font-mono font-bold text-slate-800">{a.checkIn || '--:--'}</span>
                    </div>
                  </td>

                  {/* Out-Time & Selfie */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      {a.selfieCheckOut ? (
                        <button
                          type="button"
                          onClick={() => setPreviewSelfie(a.selfieCheckOut)}
                          className="w-7 h-7 rounded-lg overflow-hidden border border-rose-300 shadow-2xs shrink-0 cursor-pointer"
                        >
                          <img src={a.selfieCheckOut} alt="Out Selfie" className="w-full h-full object-cover" />
                        </button>
                      ) : (
                        <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-xs">📷</div>
                      )}
                      <span className="font-mono text-slate-600">{a.checkOut || '--:--'}</span>
                    </div>
                  </td>

                  {/* Working Time */}
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                    {a.workingTimeFormatted ? `${a.workingTimeFormatted}` : a.workHours ? `${a.workHours} hrs` : '--'}
                  </td>

                  {/* Active Screen Time */}
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                    <div className="flex items-center gap-1">
                      <Monitor className="w-3.5 h-3.5 text-blue-500" />
                      <span>{a.activeScreenTimeFormatted ? `${a.activeScreenTimeFormatted}` : a.workHours ? `${a.workHours} hrs` : '--'}</span>
                    </div>
                  </td>

                  {/* Idle Time */}
                  <td className="py-3.5 px-4 font-mono text-amber-600 font-medium">
                    {a.idleTimeFormatted ? `${a.idleTimeFormatted}` : `${a.totalIdleMinutes || 0}m`}
                  </td>

                  {/* Break Time */}
                  <td className="py-3.5 px-4 font-mono text-slate-600">
                    {a.breakTimeFormatted ? `${a.breakTimeFormatted}` : `${a.totalBreakMinutes || 0}m`}
                  </td>

                  {/* Active Ratio % */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-slate-800">
                        {a.activeRatio ?? 95}%
                      </span>
                      <div className="w-14 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${Math.min(100, a.activeRatio ?? 95)}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Action Buttons: View Activity & Download Report */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => openEmployeeDetail(a.employeeId, a.date)}
                        className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1 cursor-pointer"
                        title="View detailed activity timeline and application breakdown"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Activity</span>
                      </button>

                      <button
                        onClick={() => handleDownloadReport(a.employeeId)}
                        className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1 cursor-pointer"
                        title="Download activity report"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Report</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredAttendance.length === 0 && (
                <tr>
                  <td colSpan={10} className="text-center py-10 text-slate-400">
                    {loading ? 'Refreshing live attendance...' : 'No attendance records found for this period.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================== */}
      {/* ADVANCED ACTIVITY DETAIL MODAL / DRAWER */}
      {/* ========================================== */}
      {selectedEmpDetail && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedEmpDetail(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-6 max-h-[92vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white font-black flex items-center justify-center text-base shadow-md shadow-blue-500/20">
                  {selectedEmpDetail.employee?.name?.slice(0, 2).toUpperCase() || 'EM'}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {selectedEmpDetail.employee?.name} — Desktop Activity &amp; Timeline
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span>{selectedEmpDetail.employee?.designation} • {selectedEmpDetail.employee?.department}</span>
                    <span>•</span>
                    <span className="font-mono font-semibold text-blue-600">{selectedEmpDetail.date}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadReport(selectedEmpDetail.employee?.employeeId)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Report</span>
                </button>

                <button
                  onClick={() => setSelectedEmpDetail(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Shift & Summary Metrics 6-Box Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-center font-mono">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200/60 shadow-2xs">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Attendance</div>
                <div className="text-xs font-black text-slate-800 mt-0.5">{selectedEmpDetail.metrics?.attendanceDurationFormatted || '8h 30m'}</div>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200/60 shadow-2xs">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Working</div>
                <div className="text-xs font-black text-blue-600 mt-0.5">{selectedEmpDetail.metrics?.workingTimeFormatted || '8h 00m'}</div>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200/60 shadow-2xs">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Active Screen</div>
                <div className="text-xs font-black text-emerald-600 mt-0.5">{selectedEmpDetail.metrics?.activeTimeFormatted || '7h 35m'}</div>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200/60 shadow-2xs">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Idle Time</div>
                <div className="text-xs font-black text-amber-600 mt-0.5">{selectedEmpDetail.metrics?.idleTimeFormatted || '25m'}</div>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200/60 shadow-2xs">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Break Time</div>
                <div className="text-xs font-black text-indigo-600 mt-0.5">{selectedEmpDetail.metrics?.breakTimeFormatted || '30m'}</div>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200/60 shadow-2xs">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Active Ratio</div>
                <div className="text-xs font-black text-emerald-600 mt-0.5">{selectedEmpDetail.metrics?.activeRatio || 95}%</div>
              </div>
            </div>

            {/* Live Station & Breaks Info Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Live Card */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-4 rounded-2xl text-white space-y-2 border border-slate-700 shadow-md">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Active Workstation</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    LIVE
                  </span>
                </div>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-blue-400" />
                  <span>{selectedEmpDetail.device?.deviceName || 'DESKTOP-ARJUN-W11'}</span>
                </div>
                <div className="text-xs text-slate-300">
                  <span className="text-slate-400 font-medium">Current Window:</span>{' '}
                  <span className="font-semibold text-sky-300">Google Chrome — Customer CRM &amp; Leads</span>
                </div>
              </div>

              {/* Break History Summary */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center justify-between">
                  <span>Authorized Breaks Today</span>
                  <Coffee className="w-3.5 h-3.5 text-amber-600" />
                </div>
                {(!selectedEmpDetail.breaks || selectedEmpDetail.breaks.length === 0) ? (
                  <div className="text-xs text-slate-400">No breaks taken during this shift.</div>
                ) : (
                  <div className="space-y-1">
                    {selectedEmpDetail.breaks.map((b: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between text-xs font-mono">
                        <span className="font-semibold text-slate-700">Break #{b.breakNumber} ({b.reason})</span>
                        <span className="text-slate-500">{b.start} – {b.end} ({b.duration})</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Top Applications Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Monitor className="w-3.5 h-3.5 text-blue-600" />
                <span>Exact Application Usage Share</span>
              </h4>

              {(!selectedEmpDetail.applications || selectedEmpDetail.applications.length === 0) ? (
                <div className="py-6 text-center text-slate-400 text-xs bg-slate-50 rounded-xl">
                  No application session breakdown recorded for this shift.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {selectedEmpDetail.applications.map((app: any, idx: number) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800">{app.applicationName}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-semibold uppercase">{app.category || 'WORK'}</span>
                        </div>
                        <span className="font-mono text-slate-600 font-semibold">{app.formattedDuration || `${app.totalHours} hrs`} ({app.percentage}%)</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, app.percentage)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Chronological Unified Activity Timeline Table */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Detailed Chronological Activity Log</span>
                </h4>

                <div className="relative w-full sm:w-56">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={timelineSearch}
                    onChange={e => setTimelineSearch(e.target.value)}
                    placeholder="Search event, app..."
                    className="w-full pl-8 pr-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto max-h-72 overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] sticky top-0 z-10">
                      <tr>
                        <th
                          className="py-2.5 px-3 cursor-pointer hover:bg-slate-100"
                          onClick={() => {
                            if (timelineSortField === 'time') setTimelineSortAsc(!timelineSortAsc);
                            else { setTimelineSortField('time'); setTimelineSortAsc(true); }
                          }}
                        >
                          <div className="flex items-center gap-1">
                            <span>Time</span>
                            <ArrowUpDown className="w-3 h-3" />
                          </div>
                        </th>
                        <th className="py-2.5 px-3">Event Type</th>
                        <th
                          className="py-2.5 px-3 cursor-pointer hover:bg-slate-100"
                          onClick={() => {
                            if (timelineSortField === 'application') setTimelineSortAsc(!timelineSortAsc);
                            else { setTimelineSortField('application'); setTimelineSortAsc(true); }
                          }}
                        >
                          <div className="flex items-center gap-1">
                            <span>Application</span>
                            <ArrowUpDown className="w-3 h-3" />
                          </div>
                        </th>
                        <th className="py-2.5 px-3">Window Title / Task</th>
                        <th className="py-2.5 px-3">Start – End</th>
                        <th
                          className="py-2.5 px-3 cursor-pointer hover:bg-slate-100"
                          onClick={() => {
                            if (timelineSortField === 'duration') setTimelineSortAsc(!timelineSortAsc);
                            else { setTimelineSortField('duration'); setTimelineSortAsc(true); }
                          }}
                        >
                          <div className="flex items-center gap-1">
                            <span>Duration</span>
                            <ArrowUpDown className="w-3 h-3" />
                          </div>
                        </th>
                        <th className="py-2.5 px-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {modalTimeline.map((item: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{item.time}</td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase inline-flex items-center gap-1 ${
                                item.type === 'CLOCK_IN'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : item.type === 'CLOCK_OUT'
                                  ? 'bg-slate-100 text-slate-800'
                                  : item.type === 'IDLE'
                                  ? 'bg-amber-100 text-amber-800'
                                  : item.type === 'BREAK'
                                  ? 'bg-indigo-100 text-indigo-800'
                                  : item.type === 'LOCK' || item.type === 'SLEEP'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {item.type === 'LOCK' && <Lock className="w-2.5 h-2.5" />}
                              {item.type === 'BREAK' && <Coffee className="w-2.5 h-2.5" />}
                              {item.type === 'IDLE' && <Timer className="w-2.5 h-2.5" />}
                              {item.eventTypeLabel || item.type}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-bold text-slate-900">{item.applicationName}</td>
                          <td className="py-2.5 px-3 text-slate-500 text-[11px] max-w-[220px] truncate" title={item.windowTitle}>
                            {item.windowTitle}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                            {item.start} – {item.end}
                          </td>
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{item.durationFormatted}</td>
                          <td className="py-2.5 px-3 text-right">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                item.status === 'ACTIVE'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : item.status === 'IDLE'
                                  ? 'bg-amber-50 text-amber-700'
                                  : item.status === 'BREAK'
                                  ? 'bg-indigo-50 text-indigo-700'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {modalTimeline.length === 0 && (
                        <tr>
                          <td colSpan={7} className="text-center py-6 text-slate-400">
                            No chronological timeline records match your search.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* EXPORT REPORT MODAL */}
      {/* ========================================== */}
      {isExportModalOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setIsExportModalOpen(false)}
        >
          <div
            className="relative max-w-md w-full bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-5"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Download Activity Report</h3>
                  <p className="text-xs text-slate-500">Export verified attendance &amp; screen time telemetry</p>
                </div>
              </div>
              <button onClick={() => setIsExportModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Format Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase">Export Format</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'csv', label: 'CSV File', icon: FileText },
                  { id: 'xlsx', label: 'Excel (.XLS)', icon: FileSpreadsheet },
                  { id: 'pdf', label: 'Printable PDF', icon: FileText }
                ].map(fmt => {
                  const Icon = fmt.icon;
                  return (
                    <button
                      key={fmt.id}
                      type="button"
                      onClick={() => setExportFormat(fmt.id as any)}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                        exportFormat === fmt.id
                          ? 'border-blue-600 bg-blue-50/70 text-blue-700 font-bold shadow-xs'
                          : 'border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-5 h-5 mx-auto mb-1 text-slate-700" />
                      <div className="text-xs font-bold">{fmt.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date Range Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase">Date Range</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'today', label: 'Today' },
                  { id: 'yesterday', label: 'Yesterday' },
                  { id: 'week', label: 'Last 7 Days' },
                  { id: 'month', label: 'This Month' }
                ].map(r => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setExportDateRange(r.id as any)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      exportDateRange === r.id
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Employee Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase">Target Employee</label>
              <select
                value={exportEmployeeId}
                onChange={e => setExportEmployeeId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Active Employees</option>
                {attendance.map(a => (
                  <option key={a.employeeId} value={a.employeeId}>
                    {a.employeeName} ({a.employeeId})
                  </option>
                ))}
              </select>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsExportModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDownloadReport()}
                disabled={downloadingExport}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20 cursor-pointer disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{downloadingExport ? 'Exporting...' : 'Download Report'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Selfie Preview Modal */}
      {previewSelfie && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewSelfie(null)}
        >
          <div className="relative max-w-sm w-full bg-slate-900 p-4 rounded-3xl border border-slate-700 text-center space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-300 font-bold px-2">
              <span>Verified Selfie Stamp</span>
              <button onClick={() => setPreviewSelfie(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <img src={previewSelfie} alt="Verified Selfie" className="w-full h-72 object-cover rounded-2xl" />
          </div>
        </div>
      )}
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

// ==========================================
// 5. LEAVE REQUESTS & APPROVALS VIEW
// ==========================================
export const LeaveRequestsView: React.FC = () => {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchLeaves = async () => {
    setLoading(true);
    const query = new URLSearchParams();
    if (filterStatus !== 'ALL') query.append('status', filterStatus);
    if (search) query.append('search', search);

    const res = await api.get(`/leaves?${query.toString()}`);
    if (res.success && res.data) {
      if (Array.isArray(res.data)) {
        setLeaves(res.data);
      } else {
        setLeaves(Array.isArray(res.data.leaves) ? res.data.leaves : []);
        if (res.data.stats) setStats(res.data.stats);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeaves();
  }, [filterStatus, search]);

  const handleUpdateStatus = async (id: string, newStatus: 'APPROVED' | 'REJECTED') => {
    try {
      setUpdatingId(id);
      const res = await api.patch(`/leaves/${id}/status`, { status: newStatus });
      if (res.success) {
        await fetchLeaves();
      } else {
        alert(res.message || `Failed to update leave status to ${newStatus}`);
      }
    } catch (err: any) {
      alert('Error updating leave status: ' + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="Leave Requests & Approvals"
        subtitle="Review employee leave applications, approve/reject time-off requests, and track staff leave history"
      />

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <p className="text-xs font-semibold text-slate-500">Total Applications</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.total || leaves.length}</h3>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">Lifetime leave requests</p>
        </div>
        <div className="bg-amber-50/50 rounded-2xl border border-amber-200/80 p-5 shadow-2xs">
          <p className="text-xs font-semibold text-amber-700">Under HR Review</p>
          <h3 className="text-2xl font-black text-amber-900 mt-1">{stats.pending}</h3>
          <p className="text-[11px] text-amber-600 mt-1 font-medium">Awaiting action</p>
        </div>
        <div className="bg-emerald-50/50 rounded-2xl border border-emerald-200/80 p-5 shadow-2xs">
          <p className="text-xs font-semibold text-emerald-700">Approved Leaves</p>
          <h3 className="text-2xl font-black text-emerald-900 mt-1">{stats.approved}</h3>
          <p className="text-[11px] text-emerald-600 mt-1 font-medium">Time off granted</p>
        </div>
        <div className="bg-rose-50/50 rounded-2xl border border-rose-200/80 p-5 shadow-2xs">
          <p className="text-xs font-semibold text-rose-700">Rejected Requests</p>
          <h3 className="text-2xl font-black text-rose-900 mt-1">{stats.rejected}</h3>
          <p className="text-[11px] text-rose-600 mt-1 font-medium">Applications declined</p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
          {[
            { id: 'ALL', label: 'All Requests' },
            { id: 'PENDING', label: 'Pending Review' },
            { id: 'APPROVED', label: 'Approved' },
            { id: 'REJECTED', label: 'Rejected' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                filterStatus === tab.id
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search employee, leave type..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Leave Requests Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-semibold uppercase">
              <tr>
                <th className="px-6 py-3.5">Employee Name & ID</th>
                <th className="px-6 py-3.5">Leave Type</th>
                <th className="px-6 py-3.5">Date Range</th>
                <th className="px-6 py-3.5">Days</th>
                <th className="px-6 py-3.5">Reason / Particulars</th>
                <th className="px-6 py-3.5">Applied Date</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Review Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {leaves.map((l: any) => (
                <tr key={l._id} className="hover:bg-slate-50/70">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{l.employeeName || 'Employee'}</div>
                    <div className="text-[11px] text-blue-600 font-mono">{l.employeeId || 'EMP-REC'}</div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-800">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 font-bold text-slate-700">
                      {l.leaveType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-mono">
                    {l.startDate} to {l.endDate}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">
                    {l.totalDays || 1} day{(l.totalDays || 1) > 1 ? 's' : ''}
                  </td>
                  <td className="px-6 py-4 text-slate-600 max-w-[220px] truncate" title={l.reason}>
                    {l.reason || 'No details specified'}
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-mono">
                    {l.appliedAt || l.createdAt ? new Date(l.appliedAt || l.createdAt).toLocaleDateString() : 'Today'}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={l.status === 'PENDING' ? 'Under HR review' : l.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    {l.status === 'PENDING' ? (
                      <div className="inline-flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleUpdateStatus(l._id, 'APPROVED')}
                          disabled={updatingId === l._id}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs shadow-xs transition-all cursor-pointer disabled:opacity-50"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(l._id, 'REJECTED')}
                          disabled={updatingId === l._id}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold text-xs shadow-xs transition-all cursor-pointer disabled:opacity-50"
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] font-semibold text-slate-400">
                        {l.reviewedBy ? `Reviewed by ${l.reviewedBy}` : 'Completed'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {leaves.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-slate-400">
                    {loading ? 'Loading leave requests...' : 'No leave applications found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
