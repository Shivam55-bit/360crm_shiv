import React, { useState, useEffect } from 'react';
import { useAuth } from '@/src/context/AuthContext';
import {
  LayoutDashboard,
  Target,
  Users,
  ShoppingCart,
  ShoppingBag,
  Zap,
  BarChart3,
  LayoutGrid,
  Boxes,
  Layers,
  ArrowDownToLine,
  ArrowUpFromLine,
  Mail,
  CreditCard,
  Receipt,
  User,
  UserCheck,
  CalendarDays,
  TrendingUp,
  Plug,
  Settings,
  Flame,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  FolderOpen,
  Building2,
  PieChart,
  ShieldCheck,
  DollarSign,
  PackageCheck,
  Megaphone,
  Briefcase,
  Smartphone,
  PhoneCall,
  FileAudio,
  Bell,
  CheckSquare,
  Clock,
  Award
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (viewId: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

interface NavSubItem {
  id: string;
  label: string;
  icon: React.ElementType;
  permission: string;
  badge?: string;
}

interface NavGroup {
  id: string;
  title: string;
  icon: React.ElementType;
  isDropdown: boolean;
  permission?: string;
  items?: NavSubItem[];
}

export const AdminSidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, isOpen, onClose }) => {
  const { hasPermission, user, setActivePortal } = useAuth();

  const handleNavClick = (viewId: string) => {
    onNavigate(viewId);
    if (onClose) onClose();
  };

  const isEmployee = user?.role === 'EMPLOYEE';
  const isHrUser = user?.role === 'HR_EMPLOYEE';

  // Employee workspace navigation; each item opens its relevant portal section.
  const employeeNavItems = [
    { id: 'emp_dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: 'Daily' },
    { id: 'emp_customers', label: 'My Customers', icon: Users },
    { id: 'emp_tasks', label: 'My Tasks', icon: CheckSquare },
    { id: 'emp_quotations', label: 'Quotations', icon: ShoppingCart },
    { id: 'emp_orders', label: 'Sales Orders', icon: ShoppingBag },
    { id: 'emp_performance', label: 'My Performance', icon: Award },
    { id: 'emp_leave', label: 'Leave Requests', icon: CalendarDays },
    { id: 'emp_salary', label: 'My Salary Slips', icon: DollarSign },
    { id: 'emp_profile', label: 'My Profile', icon: User },
    { id: 'emp_notifications', label: 'Notifications', icon: Bell },
  ];

  // Standard Admin Navigation schema with collapsible dropdown groups
  const navGroups: NavGroup[] = [
    {
      id: 'main',
      title: 'Main Dashboard',
      icon: LayoutDashboard,
      isDropdown: false,
      permission: 'dashboard.view',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, permission: 'dashboard.view' }
      ]
    },
    {
      id: 'sales',
      title: 'Sales',
      icon: TrendingUp,
      isDropdown: true,
      items: [
        { id: 'leads', label: 'Leads', icon: Target, permission: 'leads.view' },
        { id: 'customers', label: 'Customers', icon: Users, permission: 'customers.view' },
        { id: 'quotations', label: 'Quotations', icon: ShoppingCart, permission: 'quotations.view' },
        { id: 'sales_orders', label: 'Sales Orders', icon: ShoppingBag, permission: 'sales_orders.view' },
        { id: 'follow_ups', label: 'Follow-ups', icon: Zap, permission: 'follow_ups.view' },
        { id: 'sales_reports', label: 'Sales Reports', icon: BarChart3, permission: 'sales_reports.view' },
      ],
    },
    {
      id: 'marketing',
      title: 'Marketing',
      icon: Megaphone,
      isDropdown: true,
      items: [
        { id: 'marketing_dashboard', label: 'Dashboard', icon: LayoutGrid, permission: 'campaigns.view' },
        { id: 'campaigns', label: 'Campaigns', icon: Target, permission: 'campaigns.view' },
        { id: 'lead_sources', label: 'Lead Sources', icon: Target, permission: 'lead_sources.view' },
        { id: 'tradeindia', label: 'TradeIndia', icon: Plug, permission: 'tradeindia.view' },
        { id: 'website_leads', label: 'Website Leads', icon: Zap, permission: 'website_leads.view' },
        { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare, permission: 'whatsapp.view' },
        { id: 'marketing_reports', label: 'Reports', icon: BarChart3, permission: 'marketing_reports.view' },
      ],
    },
    {
      id: 'inventory',
      title: 'Store / Inventory',
      icon: Boxes,
      isDropdown: true,
      items: [
        { id: 'products', label: 'Products', icon: Boxes, permission: 'products.view' },
        { id: 'categories', label: 'Categories', icon: Layers, permission: 'categories.view' },
        { id: 'inventory', label: 'Inventory', icon: Boxes, permission: 'inventory.view' },
        { id: 'warehouses', label: 'Warehouses', icon: Building2, permission: 'warehouses.view' },
        { id: 'stock_in', label: 'Stock In', icon: ArrowDownToLine, permission: 'stock_in.view' },
        { id: 'stock_out', label: 'Stock Out', icon: ArrowUpFromLine, permission: 'stock_out.view' },
        { id: 'purchase', label: 'Purchase', icon: ShoppingCart, permission: 'purchase.view' },
        { id: 'suppliers', label: 'Suppliers', icon: Users, permission: 'suppliers.view' },
      ],
    },
    {
      id: 'accounts',
      title: 'Accounts & Finance',
      icon: Receipt,
      isDropdown: true,
      items: [
        { id: 'invoices', label: 'Invoices', icon: Receipt, permission: 'invoices.view' },
        { id: 'payments', label: 'Payments', icon: CreditCard, permission: 'payments.view' },
        { id: 'expenses', label: 'Expenses', icon: DollarSign, permission: 'expenses.view' },
        { id: 'receivables', label: 'Receivables', icon: ArrowDownToLine, permission: 'receivables.view' },
        { id: 'payables', label: 'Payables', icon: ArrowUpFromLine, permission: 'payables.view' },
        { id: 'credit_notes', label: 'Credit Notes', icon: Mail, permission: 'credit_notes.view' },
        { id: 'accounts_reports', label: 'Accounts Reports', icon: BarChart3, permission: 'accounts_reports.view' },
      ],
    },
    {
      id: 'people',
      title: 'People & HR',
      icon: Briefcase,
      isDropdown: false,
      items: [
        { id: 'employees', label: 'Employees', icon: User, permission: 'employees.view' },
        { id: 'attendance', label: 'Attendance', icon: UserCheck, permission: 'attendance.view' },
        { id: 'salary', label: 'Salary', icon: CalendarDays, permission: 'salary.view' },
        { id: 'performance', label: 'Performance', icon: BarChart3, permission: 'performance.view' },
      ],
    },
    {
      id: 'reports_hub',
      title: 'Reports Hub',
      icon: BarChart3,
      isDropdown: false,
      permission: 'reports.view',
      items: [
        { id: 'reports', label: 'All Analytics', icon: BarChart3, permission: 'reports.view' },
      ],
    },
    {
      id: 'integrations_group',
      title: 'Integrations',
      icon: Plug,
      isDropdown: false,
      permission: 'integrations.view',
      items: [
        { id: 'integrations', label: 'Integrations', icon: Plug, permission: 'integrations.view' },
      ],
    },
    {
      id: 'settings_group',
      title: 'Users & Roles',
      icon: Settings,
      isDropdown: false,
      permission: 'users.view',
      items: [
        { id: 'users_roles', label: 'Users & Roles', icon: Users, permission: 'users.view' },
      ],
    },
  ];

  // State to track which dropdowns are open
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({
    sales: true,
    marketing: false,
    inventory: false,
    accounts: false,
    people: false,
  });

  // Automatically expand the dropdown that contains the active currentView
  useEffect(() => {
    navGroups.forEach(group => {
      if (group.isDropdown && group.items) {
        const hasActiveItem = group.items.some(item => item.id === currentView);
        if (hasActiveItem) {
          setOpenDropdowns(prev => ({
            ...prev,
            [group.id]: true
          }));
        }
      }
    });
  }, [currentView]);

  const toggleDropdown = (groupId: string) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  return (
    <>
      {/* Mobile Dark Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container - Off-canvas drawer on mobile, static on lg */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#090f1d] text-slate-400 flex flex-col shrink-0 min-h-screen border-r border-slate-800/80 select-none transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 flex items-center justify-between border-b border-slate-800/80 bg-[#070b16]">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl ${isEmployee ? 'bg-gradient-to-tr from-emerald-600 to-teal-500' : 'bg-gradient-to-tr from-blue-600 to-indigo-500'} text-white font-black flex items-center justify-center text-sm shadow-md tracking-wider`}>
              {isEmployee ? 'EP' : 'SS'}
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-wide uppercase leading-tight">
                {isEmployee ? 'EMPLOYEE PORTAL' : 'SHIV SHAKTI'}
              </h1>
              <p className="text-[10px] text-blue-400 font-semibold tracking-wider uppercase">
                {isEmployee ? 'Field & Calling Desk' : isHrUser ? 'HR Management' : 'Enterprise ERP'}
              </p>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden focus:outline-hidden"
            aria-label="Close menu"
          >
            <span className="text-lg leading-none">&times;</span>
          </button>
        </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto py-3 px-2.5 space-y-1.5 custom-scrollbar">
        {isEmployee ? (
          /* STRICT EMPLOYEE ONLY MENU - 15 Modules */
          <div className="space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>My Workspace</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold">10 MODULES</span>
            </div>
            {employeeNavItems.map(item => {
              const ItemIcon = item.icon;
              const isActive = currentView === item.id || (currentView === 'employee_portal' && item.id === 'emp_dashboard') || (currentView === 'dashboard' && item.id === 'emp_dashboard');

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <ItemIcon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold font-mono ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          /* STANDARD ADMIN / SUPERADMIN MENU */
          navGroups
            .filter(group => !isHrUser || group.id === 'main' || group.id === 'people')
            .map(group => {
            // Check permissions for sub-items
            const visibleItems = group.items ? group.items.filter(item => hasPermission(item.permission)) : [];

            // If no items are visible and top-level permission isn't granted, skip
            if (visibleItems.length === 0 && group.permission && !hasPermission(group.permission)) {
              return null;
            }

            const GroupIcon = group.icon;
            const isOpen = !!openDropdowns[group.id];
            const isGroupActive = visibleItems.some(item => item.id === currentView);

            // Render single direct item if not a dropdown
            if (!group.isDropdown) {
              return (
                <div key={group.id} className="pt-0.5">
                  {visibleItems.map(item => {
                    const ItemIcon = item.icon;
                    const isActive = currentView === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          if (item.id === 'users_roles' && user?.role === 'SUPER_ADMIN') {
                            setActivePortal('superadmin');
                            if (onClose) onClose();
                          } else {
                            handleNavClick(item.id);
                          }
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-blue-600/15 text-blue-400 font-semibold border border-blue-500/30 shadow-xs'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <ItemIcon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.id === 'users_roles' && user?.role === 'SUPER_ADMIN' && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30">
                            ROOT
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            }

            // If group is a Dropdown Accordion
            return (
              <div key={group.id} className="space-y-0.5 pt-1">
                {/* Dropdown Header Trigger */}
                <button
                  onClick={() => toggleDropdown(group.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isGroupActive
                      ? 'text-white bg-slate-800/60 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <GroupIcon className={`w-4 h-4 shrink-0 ${isGroupActive ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span className="truncate tracking-wide">{group.title}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-400 px-1.5 py-0.5 rounded-full bg-slate-900/80 font-mono">
                      {visibleItems.length}
                    </span>
                    {isOpen ? (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 transition-transform duration-200" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 transition-transform duration-200" />
                    )}
                  </div>
                </button>

                {/* Collapsible Dropdown Sub-Items List */}
                {isOpen && (
                  <div className="pl-3 pr-1 py-1 space-y-0.5 border-l border-slate-800/80 ml-4 animate-in fade-in slide-in-from-top-1 duration-150">
                    {visibleItems.map(item => {
                      const ItemIcon = item.icon;
                      const isActive = currentView === item.id;

                      return (
                        <button
                          key={item.id}
                          onClick={() => handleNavClick(item.id)}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                            isActive
                              ? 'bg-blue-600 text-white font-semibold shadow-xs shadow-blue-500/20'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <ItemIcon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                            <span className="truncate">{item.label}</span>
                          </div>
                          {isActive && (
                            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
            })
        )}
      </div>

      {/* Bottom User Pill */}
      <div className="p-3 border-t border-slate-800/80 bg-[#070b16]">
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`w-7 h-7 rounded-lg ${isEmployee ? 'bg-emerald-600/30 border-emerald-500/40 text-emerald-400' : 'bg-blue-600/30 border-blue-500/40 text-blue-400'} border font-bold text-xs flex items-center justify-center`}>
              {user?.avatar || 'EM'}
            </div>
            <div className="truncate">
              <div className="text-xs font-bold text-slate-200 truncate">{user?.name || 'Employee'}</div>
              <div className={`text-[10px] ${isEmployee ? 'text-emerald-400' : 'text-blue-400'} font-mono font-semibold`}>
                {user?.role || 'EMPLOYEE'}
              </div>
            </div>
          </div>
          {user?.role === 'SUPER_ADMIN' && (
            <button
              onClick={() => setActivePortal('superadmin')}
              className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 transition-colors"
              title="Open Super Admin Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
      </aside>
    </>
  );
};

