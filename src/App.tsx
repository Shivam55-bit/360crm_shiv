import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { LoginPage } from './components/LoginPage';
import { AdminHeader } from './../360crm_admin/components/AdminHeader';
import { AdminSidebar } from './../360crm_admin/components/AdminSidebar';

// Admin Page Views
import { DashboardView } from './../360crm_admin/pages/DashboardView';
import {
  LeadsView,
  CustomersView,
  QuotationsView,
  SalesOrdersView,
  FollowUpsView,
  SalesReportsView
} from './../360crm_admin/pages/SalesViews';
import {
  ProductsView,
  CategoriesView,
  InventoryView,
  StockInView,
  StockOutView,
  PurchasesView,
  SuppliersView
} from './../360crm_admin/pages/InventoryViews';
import {
  InvoicesView,
  PaymentsView,
  ReceivablesView,
  PayablesView,
  ExpensesView,
  CreditNotesView
} from './../360crm_admin/pages/AccountsViews';
import {
  EmployeesView,
  AttendanceView,
  SalaryView,
  PerformanceView,
  LeaveRequestsView
} from './../360crm_admin/pages/PeopleViews';
import {
  CampaignsView,
  TradeIndiaView,
  WhatsAppView,
  ReportsHubView,
  IntegrationsView
} from './../360crm_admin/pages/MarketingAndSystemViews';
import { EmployeePortalView } from './../360crm_admin/pages/EmployeePortalView';
import { EmployeeCustomersView } from './../360crm_admin/pages/EmployeeCustomersView';
import { EmployeeTasksView } from './../360crm_admin/pages/EmployeeTasksView';
import { EmployeeQuotationsView } from './../360crm_admin/pages/EmployeeQuotationsView';
import { EmployeeSalesOrdersView } from './../360crm_admin/pages/EmployeeSalesOrdersView';
import { EmployeePerformanceView } from './../360crm_admin/pages/EmployeePerformanceView';
import { EmployeeLeaveView } from './../360crm_admin/pages/EmployeeLeaveView';
import { EmployeeSalaryView } from './../360crm_admin/pages/EmployeeSalaryView';
import { EmployeeProfileView } from './../360crm_admin/pages/EmployeeProfileView';
import { EmployeeNotificationsView } from './../360crm_admin/pages/EmployeeNotificationsView';
import { HrDashboardView } from './../360crm_admin/pages/HrDashboardView';

// Super Admin Portal
import { SuperAdminPortal } from './../360crm_superadmin/SuperAdminPortal';

export const AppContent: React.FC = () => {
  const { user, isAuthenticated, isLoading, activePortal, setActivePortal } = useAuth();
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // If user role is EMPLOYEE, default view is employee portal
  useEffect(() => {
    if (user?.role === 'EMPLOYEE') {
      setCurrentView('emp_dashboard');
    } else if (user?.role === 'SUPER_ADMIN' && activePortal === 'superadmin') {
      // stay in superadmin
    } else if (currentView.startsWith('emp_') && user?.role !== 'EMPLOYEE') {
      setCurrentView('dashboard');
    }
  }, [user?.role, activePortal]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-semibold text-slate-300">Loading 360CRM Workspace...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Render Super Admin Portal when active
  if (activePortal === 'superadmin' && user?.role === 'SUPER_ADMIN') {
    return <SuperAdminPortal />;
  }

  // Render Main Admin / Employee Workspace Layout
  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return user?.role === 'HR_EMPLOYEE'
          ? <HrDashboardView onNavigate={setCurrentView} />
          : <DashboardView onNavigate={setCurrentView} />;
      
      // Employee Portal
      case 'emp_dashboard':
      case 'emp_attendance':
      case 'emp_leads':
      case 'emp_followups':
      case 'emp_calls':
        return <EmployeePortalView currentView={currentView} />;

      case 'emp_messages':
        return <EmployeePortalView currentView={currentView} />;
      case 'emp_customers':
        return <EmployeeCustomersView />;
      case 'emp_tasks':
        return <EmployeeTasksView />;
      case 'emp_quotations':
        return <EmployeeQuotationsView />;
      case 'emp_orders':
        return <EmployeeSalesOrdersView />;
      case 'emp_performance':
        return <EmployeePerformanceView />;
      case 'emp_leave':
        return <EmployeeLeaveView />;
      case 'emp_salary':
        return <EmployeeSalaryView />;
      case 'emp_profile':
        return <EmployeeProfileView />;
      case 'emp_notifications':
        return <EmployeeNotificationsView />;

      case 'employee_portal':
        return <EmployeePortalView currentView="emp_dashboard" />;

      // Sales Views
      case 'leads':
        return <LeadsView />;
      case 'customers':
        return <CustomersView />;
      case 'quotations':
        return <QuotationsView onNavigate={setCurrentView} />;
      case 'sales_orders':
        return <SalesOrdersView />;
      case 'follow_ups':
        return <FollowUpsView />;
      case 'sales_reports':
        return <SalesReportsView />;

      // Marketing Views
      case 'marketing_dashboard':
      case 'campaigns':
      case 'lead_sources':
        return <CampaignsView />;
      case 'tradeindia':
      case 'website_leads':
        return <TradeIndiaView />;
      case 'whatsapp':
        return <WhatsAppView />;
      case 'marketing_reports':
        return <ReportsHubView />;

      // Inventory Views
      case 'products':
        return <ProductsView />;
      case 'categories':
        return <CategoriesView />;
      case 'inventory':
      case 'warehouses':
        return <InventoryView />;
      case 'stock_in':
        return <StockInView />;
      case 'stock_out':
        return <StockOutView />;
      case 'purchase':
        return <PurchasesView />;
      case 'suppliers':
        return <SuppliersView />;

      // Accounts Views
      case 'invoices':
        return <InvoicesView />;
      case 'expenses':
        return <ExpensesView />;
      case 'credit_notes':
        return <CreditNotesView />;
      case 'payments':
        return <PaymentsView />;
      case 'receivables':
        return <ReceivablesView />;
      case 'payables':
        return <PayablesView />;
      case 'accounts_reports':
        return <ReportsHubView />;

      // People / HR Views
      case 'employees':
        return <EmployeesView />;
      case 'leave_requests':
        return <LeaveRequestsView />;
      case 'attendance':
        return <AttendanceView />;
      case 'performance':
        return <PerformanceView />;
      case 'salary':
        return <SalaryView />;

      // Reports Hub
      case 'reports':
        return <ReportsHubView />;

      // Integrations
      case 'integrations':
        return <IntegrationsView />;

      // Users & Roles (if accessible in admin mode)
      case 'users_roles':
        if (user?.role === 'SUPER_ADMIN') {
          setActivePortal('superadmin');
          return null;
        }
        return <EmployeesView />;

      default:
        return <DashboardView onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-800">
      {/* Sidebar Navigation */}
      <AdminSidebar
        currentView={currentView}
        onNavigate={setCurrentView}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader
          onExportReport={() => {}}
          onToggleSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
        />

        <main className="flex-1 overflow-y-auto bg-[#f8fafc]">
          {renderCurrentView()}
        </main>
      </div>
    </div>
  );
};

export default AppContent;
