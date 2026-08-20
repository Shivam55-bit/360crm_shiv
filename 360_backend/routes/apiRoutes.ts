import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { requirePermission, requireRole } from '../middleware/rbac';

// Controllers
import * as authCtrl from '../controllers/authController';
import * as userCtrl from '../controllers/userController';
import * as roleCtrl from '../controllers/roleController';
import * as salesCtrl from '../controllers/salesControllers';
import * as invCtrl from '../controllers/inventoryControllers';
import * as acctCtrl from '../controllers/accountsControllers';
import * as hrCtrl from '../controllers/peopleControllers';
import * as mktCtrl from '../controllers/marketingControllers';
import * as sysCtrl from '../controllers/systemControllers';
import employeeRouter from './employeeRoutes';

const router = Router();

// ==================== DEDICATED EMPLOYEE PORTAL API ====================
router.use('/employee', employeeRouter);

// ==================== AUTHENTICATION ====================
router.post('/auth/login', authCtrl.login);
router.get('/auth/demo-users', authCtrl.getDemoUsers);
router.get('/auth/me', authenticateToken, authCtrl.getCurrentUser);
router.post('/auth/switch-demo', authCtrl.switchDemoUser);

// ==================== USERS & ADMINS ====================
router.get('/users', authenticateToken, requirePermission('users.view'), userCtrl.getAllUsers);
router.get('/users/:id', authenticateToken, requirePermission('users.view'), userCtrl.getUserById);
router.post('/users', authenticateToken, requirePermission('users.create'), userCtrl.createUser);
router.put('/users/:id', authenticateToken, requirePermission('users.update'), userCtrl.updateUser);
router.put('/users/:id/permissions', authenticateToken, requireRole('SUPER_ADMIN'), userCtrl.updateUserPermissions);
router.patch('/users/:id/status', authenticateToken, requirePermission('users.update'), userCtrl.toggleUserStatus);
router.post('/users/:id/reset-password', authenticateToken, requirePermission('users.update'), userCtrl.resetUserPassword);

// ==================== ROLES & PERMISSIONS ====================
router.get('/roles', authenticateToken, requirePermission('roles.view'), roleCtrl.getAllRoles);
router.post('/roles', authenticateToken, requirePermission('roles.create'), roleCtrl.createRole);
router.put('/roles/:id', authenticateToken, requirePermission('roles.update'), roleCtrl.updateRole);
router.get('/permissions', authenticateToken, roleCtrl.getAllPermissions);

// ==================== SALES - LEADS ====================
router.get('/leads', authenticateToken, requirePermission('leads.view'), salesCtrl.getLeads);
router.post('/leads', authenticateToken, requirePermission('leads.create'), salesCtrl.createLead);
router.put('/leads/:id', authenticateToken, requirePermission('leads.update'), salesCtrl.updateLead);
router.delete('/leads/:id', authenticateToken, requirePermission('leads.delete'), salesCtrl.deleteLead);

// Lead Calls & Voice Recordings
router.post('/leads/:id/calls', authenticateToken, salesCtrl.logLeadCall);
router.get('/leads/:id/calls', authenticateToken, salesCtrl.getLeadCallLogs);
router.get('/call-logs', authenticateToken, salesCtrl.getAllCallLogs);
router.delete('/call-logs/:id', authenticateToken, salesCtrl.deleteCallLog);

// ==================== SALES - CUSTOMERS ====================
router.get('/customers', authenticateToken, requirePermission('customers.view'), salesCtrl.getCustomers);
router.post('/customers', authenticateToken, requirePermission('customers.create'), salesCtrl.createCustomer);
router.put('/customers/:id', authenticateToken, requirePermission('customers.update'), salesCtrl.updateCustomer);
router.delete('/customers/:id', authenticateToken, requirePermission('customers.delete'), salesCtrl.deleteCustomer);

// ==================== SALES - QUOTATIONS ====================
router.get('/quotations', authenticateToken, requirePermission('quotations.view'), salesCtrl.getQuotations);
router.post('/quotations', authenticateToken, requirePermission('quotations.create'), salesCtrl.createQuotation);
router.post('/quotations/:id/convert', authenticateToken, requirePermission('quotations.convert'), salesCtrl.convertQuotationToSalesOrder);

// ==================== SALES - ORDERS ====================
router.get('/sales-orders', authenticateToken, requirePermission('sales_orders.view'), salesCtrl.getSalesOrders);
router.post('/sales-orders', authenticateToken, requirePermission('sales_orders.create'), salesCtrl.createSalesOrder);
router.patch('/sales-orders/:id/approve', authenticateToken, requirePermission('sales_orders.approve'), salesCtrl.approveSalesOrder);

// ==================== SALES - FOLLOW-UPS ====================
router.get('/follow-ups', authenticateToken, requirePermission('follow_ups.view'), salesCtrl.getFollowUps);
router.post('/follow-ups', authenticateToken, requirePermission('follow_ups.create'), salesCtrl.createFollowUp);
router.patch('/follow-ups/:id/complete', authenticateToken, requirePermission('follow_ups.update'), salesCtrl.completeFollowUp);

// ==================== STORE / INVENTORY ====================
router.get('/products', authenticateToken, requirePermission('products.view'), invCtrl.getProducts);
router.post('/products', authenticateToken, requirePermission('products.create'), invCtrl.createProduct);
router.put('/products/:id', authenticateToken, requirePermission('products.update'), invCtrl.updateProduct);
router.delete('/products/:id', authenticateToken, requirePermission('products.delete'), invCtrl.deleteProduct);

router.get('/categories', authenticateToken, requirePermission('categories.view'), invCtrl.getCategories);
router.post('/categories', authenticateToken, requirePermission('categories.create'), invCtrl.createCategory);

router.get('/warehouses', authenticateToken, requirePermission('warehouses.view'), invCtrl.getWarehouses);
router.post('/warehouses', authenticateToken, requirePermission('warehouses.create'), invCtrl.createWarehouse);

router.get('/inventory', authenticateToken, requirePermission('inventory.view'), invCtrl.getInventorySummary);
router.post('/stock-in', authenticateToken, requirePermission('stock_in.create'), invCtrl.performStockIn);
router.post('/stock-out', authenticateToken, requirePermission('stock_out.create'), invCtrl.performStockOut);
router.get('/stock-transactions', authenticateToken, requirePermission('inventory.view'), invCtrl.getStockTransactions);

// ==================== PURCHASES & SUPPLIERS ====================
router.get('/suppliers', authenticateToken, requirePermission('suppliers.view'), invCtrl.getSuppliers);
router.post('/suppliers', authenticateToken, requirePermission('suppliers.create'), invCtrl.createSupplier);
router.put('/suppliers/:id', authenticateToken, requirePermission('suppliers.update'), invCtrl.updateSupplier);

router.get('/purchases', authenticateToken, requirePermission('purchase.view'), invCtrl.getPurchases);
router.post('/purchases', authenticateToken, requirePermission('purchase.create'), invCtrl.createPurchase);
router.patch('/purchases/:id/receive', authenticateToken, requirePermission('purchase.receive'), invCtrl.receivePurchase);

// ==================== ACCOUNTS ====================
router.get('/invoices', authenticateToken, requirePermission('invoices.view'), acctCtrl.getInvoices);
router.post('/invoices', authenticateToken, requirePermission('invoices.create'), acctCtrl.createInvoice);

router.get('/payments', authenticateToken, requirePermission('payments.view'), acctCtrl.getPayments);
router.post('/payments', authenticateToken, requirePermission('payments.create'), acctCtrl.createPayment);

router.get('/expenses', authenticateToken, requirePermission('expenses.view'), acctCtrl.getExpenses);
router.post('/expenses', authenticateToken, requirePermission('expenses.create'), acctCtrl.createExpense);

router.get('/receivables', authenticateToken, requirePermission('receivables.view'), acctCtrl.getReceivables);
router.get('/payables', authenticateToken, requirePermission('payables.view'), acctCtrl.getPayables);

router.get('/credit-notes', authenticateToken, requirePermission('credit_notes.view'), acctCtrl.getCreditNotes);
router.post('/credit-notes', authenticateToken, requirePermission('credit_notes.create'), acctCtrl.createCreditNote);

// ==================== PEOPLE / HR ====================
router.get('/employees', authenticateToken, requirePermission('employees.view'), hrCtrl.getEmployees);
router.post('/employees', authenticateToken, requirePermission('employees.create'), hrCtrl.createEmployee);
router.put('/employees/:id', authenticateToken, requirePermission('employees.update'), hrCtrl.updateEmployee);
router.delete('/employees/:id', authenticateToken, requirePermission('employees.delete'), hrCtrl.deleteEmployee);

// Attendance & Clock-In/Out
router.get('/attendance', authenticateToken, requirePermission('attendance.view'), hrCtrl.getAttendance);
router.post('/attendance', authenticateToken, requirePermission('attendance.create'), hrCtrl.logAttendance);
router.post('/attendance/clock-in', authenticateToken, hrCtrl.clockIn);
router.post('/attendance/clock-out', authenticateToken, hrCtrl.clockOut);
router.get('/attendance/today-status', authenticateToken, hrCtrl.getTodayAttendanceStatus);

router.get('/salary', authenticateToken, requirePermission('salary.view'), hrCtrl.getSalaries);
router.post('/salary', authenticateToken, requirePermission('salary.create'), hrCtrl.generateSalary);

router.get('/performance', authenticateToken, requirePermission('performance.view'), hrCtrl.getPerformanceReviews);
router.post('/performance', authenticateToken, requirePermission('performance.create'), hrCtrl.createPerformanceReview);

// ==================== MARKETING ====================
router.get('/campaigns', authenticateToken, requirePermission('campaigns.view'), mktCtrl.getCampaigns);
router.post('/campaigns', authenticateToken, requirePermission('campaigns.create'), mktCtrl.createCampaign);
router.get('/lead-sources', authenticateToken, requirePermission('lead_sources.view'), mktCtrl.getLeadSources);

// External Webhook Ingestion (Public with payload validation)
router.post('/tradeindia/webhook', mktCtrl.receiveTradeIndiaLead);
router.post('/website-leads', mktCtrl.receiveWebsiteLead);
router.post('/whatsapp/send', authenticateToken, requirePermission('whatsapp.view'), mktCtrl.sendWhatsAppMessage);

// ==================== SYSTEM, DASHBOARD, REPORTS & AUDIT ====================
router.get('/dashboard', authenticateToken, sysCtrl.getDashboardStats);
router.get('/superadmin/stats', authenticateToken, requireRole('SUPER_ADMIN'), sysCtrl.getSuperAdminStats);
router.get('/reports', authenticateToken, requirePermission('reports.view'), sysCtrl.getReports);
router.get('/integrations', authenticateToken, requirePermission('integrations.view'), sysCtrl.getIntegrations);
router.post('/integrations', authenticateToken, requirePermission('integrations.manage'), sysCtrl.createIntegration);
router.put('/integrations/:id', authenticateToken, requirePermission('integrations.manage'), sysCtrl.updateIntegration);
router.delete('/integrations/:id', authenticateToken, requirePermission('integrations.manage'), sysCtrl.deleteIntegration);
router.post('/integrations/:id/test', authenticateToken, requirePermission('integrations.manage'), sysCtrl.testIntegrationConnection);
router.post('/integrations/:id/sync', authenticateToken, requirePermission('integrations.manage'), sysCtrl.syncIntegrationNow);
router.get('/audit-logs', authenticateToken, requirePermission('audit_logs.view'), sysCtrl.getAuditLogs);

export default router;
