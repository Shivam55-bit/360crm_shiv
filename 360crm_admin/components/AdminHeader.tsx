import React, { useState } from 'react';
import { useAuth } from '@/src/context/AuthContext';
import { Shield, LogOut, ChevronDown, Check, UserCheck, RefreshCw } from 'lucide-react';

export const AdminHeader: React.FC<{ onExportReport?: () => void }> = ({ onExportReport }) => {
  const { user, logout, switchUser, activePortal, setActivePortal } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const demoAccounts = [
    { name: 'Arjun Singh (Field Employee)', email: 'employee@360crm.com', role: 'EMPLOYEE' },
    { name: 'Priyanshu (Super Admin)', email: 'shivamshishodia5541@gmail.com', role: 'SUPER_ADMIN' },
    { name: 'Rohan Sharma (Full Admin)', email: 'admin@360crm.com', role: 'ADMIN' },
    { name: 'Vikram Mehta (Sales Only)', email: 'sales@360crm.com', role: 'SALES_EMPLOYEE' },
    { name: 'Anjali Verma (Store Only)', email: 'inventory@360crm.com', role: 'STORE_EMPLOYEE' },
    { name: 'Suresh Patel (Accounts Only)', email: 'accounts@360crm.com', role: 'ACCOUNTANT' },
    { name: 'Neha Kapoor (HR Only)', email: 'hr@360crm.com', role: 'HR_EMPLOYEE' },
  ];

  return (
    <header className="bg-white border-b border-slate-200/80 px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      <div>
        <h2 className="text-base font-bold text-slate-900 leading-tight">Business Management</h2>
        <p className="text-xs text-slate-500 font-normal">Sales, marketing, inventory and accounts in one place.</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Portal Switcher for Super Admin */}
        {user?.role === 'SUPER_ADMIN' && (
          <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActivePortal('admin')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                activePortal === 'admin'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Admin CRM View
            </button>
            <button
              onClick={() => setActivePortal('superadmin')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                activePortal === 'superadmin'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              Super Admin Portal
            </button>
          </div>
        )}

        {/* Live Online Status */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium border border-emerald-200/60">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Online</span>
        </div>

        {/* User Profile & Demo Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 p-1 pl-1.5 pr-2.5 rounded-full hover:bg-slate-100 border border-slate-200 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
              {user?.avatar || user?.name?.slice(0, 2).toUpperCase() || 'PA'}
            </div>
            <span className="text-xs font-semibold text-slate-800 hidden md:inline">
              {user?.avatar || 'PA'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 py-2.5 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                <div className="mt-1.5 inline-block px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-semibold rounded-md border border-blue-200">
                  Role: {user?.role}
                </div>
              </div>

              <div className="px-3 py-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-1">
                  Test Multi-Admin RBAC (Switch Role):
                </div>
                <div className="space-y-1">
                  {demoAccounts.map(account => (
                    <button
                      key={account.email}
                      onClick={() => {
                        switchUser(account.email);
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg flex items-center justify-between transition-colors ${
                        user?.email === account.email
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="truncate">
                        <div>{account.name}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{account.role}</div>
                      </div>
                      {user?.email === account.email && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-1 px-2">
                <button
                  onClick={() => {
                    logout();
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
