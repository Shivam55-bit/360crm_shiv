import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Shield, Lock, Mail, ArrowRight, CheckCircle2, Building2, User, KeyRound, Sparkles } from 'lucide-react';

interface LoginAccount {
  role: string;
  email: string;
  password?: string;
  name: string;
  badge: string;
  color: string;
}

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [enabledLoginEmails, setEnabledLoginEmails] = useState<string[] | null>(null);

  const demoAccounts: LoginAccount[] = [
    {
      role: '👨‍💼 Field Employee (Arjun)',
      email: 'employee@360crm.com',
      password: 'admin123',
      name: 'Arjun Singh (Field & Calling Desk)',
      badge: 'Dedicated 15-Module Employee Portal',
      color: 'border-rose-500/50 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 ring-2 ring-rose-500/30',
    },
    {
      role: 'Super Admin',
      email: 'shivamshishodia5541@gmail.com',
      password: 'shivamshishodia5541@gmail.com',
      name: 'Priyanshu (CEO & Super Admin)',
      badge: 'Unrestricted System Access',
      color: 'border-blue-500/40 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300',
    },
    {
      role: 'Admin CRM',
      email: 'admin@360crm.com',
      password: 'admin123',
      name: 'Rohan Sharma (Operations Lead)',
      badge: 'Full Business CRM Access',
      color: 'border-indigo-500/40 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300',
    },
    {
      role: 'Sales Rep',
      email: 'sales@360crm.com',
      password: 'admin123',
      name: 'Vikram Mehta (Sales Manager)',
      badge: 'Leads, Calls & Quotations',
      color: 'border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300',
    },
    {
      role: 'Store / Inventory',
      email: 'inventory@360crm.com',
      password: 'admin123',
      name: 'Anjali Verma (Warehouse Mgr)',
      badge: 'Stock In/Out & Suppliers',
      color: 'border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300',
    },
    {
      role: 'Accounts & Finance',
      email: 'accounts@360crm.com',
      password: 'admin123',
      name: 'Suresh Patel (Senior Accountant)',
      badge: 'Invoices & Payments',
      color: 'border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300',
    },
    {
      role: 'HR & People',
      email: 'hr@360crm.com',
      password: 'admin123',
      name: 'Neha Kapoor (HR Director)',
      badge: 'Attendance & Salaries',
      color: 'border-purple-500/40 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300',
    },
  ];

  useEffect(() => {
    const loadEnabledLoginUsers = async () => {
      const res = await api.get('/auth/demo-users');
      if (res.success && Array.isArray(res.data)) {
        const enabledEmails = res.data.map((account: { email: string }) => account.email.toLowerCase());
        setEnabledLoginEmails(enabledEmails);
        const knownEmails = new Set(demoAccounts.map(account => account.email.toLowerCase()));
        const dynamicAccounts: LoginAccount[] = res.data
          .filter((account: { email: string }) => !knownEmails.has(account.email.toLowerCase()))
          .map((account: { name: string; email: string; role: string }) => ({
            role: account.role,
            email: account.email,
            name: account.name,
            badge: 'Admin Access Portal',
            color: 'border-slate-500/50 bg-slate-500/10 hover:bg-slate-500/20 text-slate-300'
          }));
        setDynamicLoginAccounts(dynamicAccounts);
      }
    };
    loadEnabledLoginUsers();
  }, []);

  const [dynamicLoginAccounts, setDynamicLoginAccounts] = useState<LoginAccount[]>([]);

  const visibleDemoAccounts = [...demoAccounts, ...dynamicLoginAccounts].filter(account =>
    enabledLoginEmails === null || enabledLoginEmails.includes(account.email.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login({ email, password });
    if (!res.success) {
      setError(res.message || 'Login failed. Please check credentials.');
    }
    setLoading(false);
  };

  const handleQuickLogin = async (account: LoginAccount) => {
    setEmail(account.email);
    setPassword(account.password || '');
    setError('');
    if (!account.password) {
      return;
    }
    setLoading(true);

    const res = await login({ email: account.email, password: account.password });
    if (!res.success) {
      setError(res.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-4xl relative z-10 space-y-8">
        {/* Brand Banner */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold shadow-inner">
            <Sparkles className="w-3.5 h-3.5" />
            Enterprise Fullstack CRM Platform
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            360CRM Enterprise
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto">
            Unified platform powering Sales, Marketing, Inventory, Accounts, HR, and Super Admin RBAC.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Direct Sign-In Form */}
          <div className="lg:col-span-5 bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-7 shadow-2xl space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white">Sign In</h2>
              <p className="text-xs text-slate-400 mt-0.5">Enter your enterprise email and password</p>
            </div>

            {error && (
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-xs text-rose-400 flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-300">Work Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="user@360crm.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-300">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/30 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Security: AES-256 JWT RBAC</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                API Connected
              </span>
            </div>
          </div>

          {/* 1-Click Role Quick Login Cards */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <KeyRound className="w-3.5 h-3.5 text-blue-400" />
                Instant Demo Quick Login (Click any Role):
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {visibleDemoAccounts.map(account => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => handleQuickLogin(account)}
                  className={`p-3.5 rounded-2xl border text-left transition-all duration-150 flex flex-col justify-between gap-2.5 cursor-pointer ${account.color}`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-bold text-white">{account.role}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/10 font-semibold text-white">
                      {account.password ? '1-Click' : 'Use Credentials'}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-300 font-medium">{account.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{account.email}</p>
                  </div>
                  <div className="text-[10px] text-slate-400/90 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{account.badge}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
