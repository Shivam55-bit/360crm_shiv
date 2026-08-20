import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';
import * as empCtrl from '../controllers/employeeController';

const router = Router();

// Apply JWT authentication to all employee routes
router.use(authenticateToken);

// 1. Dashboard
router.get('/dashboard', empCtrl.getEmployeeDashboard);

// 2. Attendance
router.get('/attendance', empCtrl.getEmployeeAttendance);
router.post('/attendance/clock-in', empCtrl.clockIn);
router.post('/attendance/clock-out', empCtrl.clockOut);
router.post('/attendance/break', empCtrl.toggleBreak);

// 3. My Leads & Timeline
router.get('/leads', empCtrl.getEmployeeLeads);
router.get('/leads/:id', empCtrl.getEmployeeLeadById);
router.put('/leads/:id/status', empCtrl.updateEmployeeLeadStatus);

// 4. Follow-ups
router.get('/follow-ups', empCtrl.getEmployeeFollowUps);
router.post('/follow-ups', empCtrl.createEmployeeFollowUp);
router.patch('/follow-ups/:id', empCtrl.updateFollowUpStatus);

// 5. Calls & Recordings
router.get('/calls', empCtrl.getEmployeeCalls);
router.post('/calls', empCtrl.logEmployeeCall);

// 6. Messages (WhatsApp, SMS, Email)
router.get('/messages', empCtrl.getEmployeeMessages);
router.post('/messages', empCtrl.sendEmployeeMessage);

// 7. Customers
router.get('/customers', empCtrl.getEmployeeCustomers);

// 8. Tasks
router.get('/tasks', empCtrl.getEmployeeTasks);
router.post('/tasks', empCtrl.createEmployeeTask);
router.patch('/tasks/:id', empCtrl.updateEmployeeTaskStatus);

// 9. Quotations
router.get('/quotations', empCtrl.getEmployeeQuotations);
router.post('/quotations', empCtrl.createEmployeeQuotation);

// 10. Sales Orders
router.get('/sales-orders', empCtrl.getEmployeeSalesOrders);

// 11. Performance
router.get('/performance', empCtrl.getEmployeePerformance);

// 12. Leave
router.get('/leave', empCtrl.getEmployeeLeaves);
router.post('/leave', empCtrl.applyEmployeeLeave);

// 13. Salary
router.get('/salary', empCtrl.getEmployeeSalary);

// 14. Profile
router.get('/profile', empCtrl.getEmployeeProfile);
router.put('/profile', empCtrl.updateEmployeeProfile);

// 15. Notifications
router.get('/notifications', empCtrl.getEmployeeNotifications);
router.patch('/notifications/:id/read', empCtrl.markNotificationRead);

export default router;
