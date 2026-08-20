export * from '../../360_backend/database/types';

// Frontend Convenience Type Aliases
import {
  UserDoc, RoleDoc, PermissionDoc, LeadDoc, CustomerDoc, ProductDoc, CategoryDoc,
  WarehouseDoc, SupplierDoc, PurchaseDoc, QuotationDoc, SalesOrderDoc,
  InvoiceDoc, PaymentDoc, ExpenseDoc, EmployeeDoc, AttendanceDoc,
  SalaryDoc, PerformanceDoc, CampaignDoc, LeadSourceDoc, IntegrationDoc,
  AuditLogDoc, FollowUpDoc, StockTransactionDoc, CreditNoteDoc, CallLogDoc,
  LeaveDoc, TaskDoc, MessageDoc, ActivityTimelineDoc, NotificationDoc
} from '../../360_backend/database/types';

export type User = UserDoc;
export type Role = RoleDoc;
export type Permission = PermissionDoc;
export type Lead = LeadDoc;
export type Customer = CustomerDoc;
export type Product = ProductDoc;
export type Category = CategoryDoc;
export type Warehouse = WarehouseDoc;
export type Supplier = SupplierDoc;
export type Purchase = PurchaseDoc;
export type Quotation = QuotationDoc;
export type SalesOrder = SalesOrderDoc;
export type Invoice = InvoiceDoc;
export type Payment = PaymentDoc;
export type Expense = ExpenseDoc;
export type Employee = EmployeeDoc;
export type Attendance = AttendanceDoc;
export type Salary = SalaryDoc;
export type Performance = PerformanceDoc;
export type Campaign = CampaignDoc;
export type LeadSource = LeadSourceDoc;
export type Integration = IntegrationDoc;
export type AuditLog = AuditLogDoc;
export type FollowUp = FollowUpDoc;
export type StockTransaction = StockTransactionDoc;
export type CreditNote = CreditNoteDoc;
export type CallLog = CallLogDoc;
export type Leave = LeaveDoc;
export type Task = TaskDoc;
export type Message = MessageDoc;
export type ActivityTimeline = ActivityTimelineDoc;
export type Notification = NotificationDoc;
