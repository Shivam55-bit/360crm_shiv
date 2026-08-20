export type RoleType = 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'SALES_EMPLOYEE' | 'STORE_EMPLOYEE' | 'ACCOUNTANT' | 'HR_EMPLOYEE' | 'EMPLOYEE' | 'SALES_REP' | string;

export interface UserDoc {
  _id: string;
  id?: string;
  name: string;
  email: string;
  passwordHash: string;
  phone?: string;
  role: RoleType;
  roleId?: string;
  permissions?: string[];
  customPermissions?: string[]; // Overrides or specific grants
  permissionMode?: 'ROLE' | 'REPLACE';
  showLoginCredentials?: boolean; // Controls whether the login email is shown in admin directory views
  showOnLogin?: boolean; // Controls whether this account appears in the login quick-access list
  organization?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  lastLogin?: string;
  avatar?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface RoleDoc {
  _id: string;
  name: string;
  code: string;
  description: string;
  permissions: string[];
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PermissionDoc {
  _id: string;
  module: string;
  action: string;
  code: string; // e.g. 'leads.view'
  name: string;
  description: string;
  category: string;
}

export interface LeadDoc {
  _id: string;
  name: string;
  companyName?: string;
  email: string;
  phone: string;
  source: string; // 'Website' | 'TradeIndia' | 'IndiaMART' | 'WhatsApp' | 'Referral' | 'Google' | 'Manual'
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'PROPOSAL' | 'NEGOTIATION' | 'WON' | 'LOST';
  stage?: string;
  assignedTo?: string; // User ID or Name
  assignedToId?: string;
  estimatedValue: number;
  probability?: number;
  city?: string;
  state?: string;
  notes?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CustomerDoc {
  _id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  gstNumber?: string;
  address: {
    street?: string;
    city: string;
    state: string;
    country: string;
    pincode?: string;
  };
  assignedTo?: string;
  totalOrdersCount: number;
  totalSpent: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface FollowUpDoc {
  _id: string;
  leadId?: string;
  customerId?: string;
  type: 'Call' | 'Meeting' | 'WhatsApp' | 'Email' | 'Task' | 'Reminder';
  title: string;
  description?: string;
  scheduledAt: string;
  completedAt?: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  assignedTo: string;
  outcomeNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignDoc {
  _id: string;
  name: string;
  source?: string;
  type?: string;
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  leadsGenerated: number;
  conversions: number;
  revenueGenerated?: number;
  roi?: number;
  targetAudience?: string;
  description?: string;
  createdBy?: string;
  status: 'PLANNING' | 'ACTIVE' | 'COMPLETED' | 'PAUSED';
  createdAt: string;
  updatedAt?: string;
}

export interface LeadSourceDoc {
  _id: string;
  name: string;
  type: string;
  status: 'ACTIVE' | 'INACTIVE';
  leadsCount: number;
  conversionRate: number;
  createdAt: string;
}

export interface ProductDoc {
  _id: string;
  name: string;
  sku: string;
  barcode?: string;
  category: string;
  categoryId?: string;
  unit: string; // 'Pcs' | 'Kg' | 'Mtr' | 'Box' | 'Ltr' | 'Set'
  purchasePrice: number;
  sellingPrice: number;
  taxPercent?: number;
  taxRate?: number;
  currentStock: number;
  minStock?: number;
  minStockLevel?: number;
  maxStock?: number;
  warehouseId?: string;
  warehouseName?: string;
  status: 'ACTIVE' | 'INACTIVE';
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryDoc {
  _id: string;
  name: string;
  code?: string;
  parentId?: string;
  description?: string;
  productsCount?: number;
  createdAt: string;
}

export interface WarehouseDoc {
  _id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  pincode?: string;
  manager?: string;
  contactPerson?: string;
  phone: string;
  status: 'ACTIVE' | 'INACTIVE';
  capacityUsage?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface StockTransactionDoc {
  _id: string;
  productId: string;
  productName: string;
  sku?: string;
  warehouseId: string;
  warehouseName?: string;
  type: 'STOCK_IN' | 'STOCK_OUT' | 'ADJUSTMENT' | 'PURCHASE_RECEIVE' | 'SALES_FULFILL';
  quantity: number;
  previousStock?: number;
  newStock?: number;
  unitPrice?: number;
  totalAmount?: number;
  performedBy?: string;
  date?: string;
  notes?: string;
  referenceType: 'MANUAL' | 'PURCHASE' | 'SALES_ORDER' | 'RETURN' | 'DAMAGE' | 'INITIAL';
  referenceId?: string;
  reason?: string;
  supplierId?: string;
  supplierName?: string;
  createdBy?: string;
  createdAt?: string;
}

export interface SupplierDoc {
  _id: string;
  name: string;
  companyName?: string;
  contactPerson?: string;
  phone: string;
  email: string;
  gstNumber?: string;
  address: string;
  city: string;
  state: string;
  pincode?: string;
  country?: string;
  paymentTerms: string;
  balancePayable?: number;
  outstandingBalance?: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt?: string;
}

export interface PurchaseItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  taxPercent?: number;
  taxRate?: number;
  discountPercent?: number;
  total: number;
}

export interface PurchaseDoc {
  _id: string;
  purchaseNumber: string;
  supplierId: string;
  supplierName: string;
  warehouseId?: string;
  warehouseName?: string;
  purchaseDate?: string;
  date?: string;
  expectedDate?: string;
  items: PurchaseItem[];
  subTotal: number;
  taxAmount: number;
  discountAmount?: number;
  shipping?: number;
  grandTotal: number;
  paidAmount: number;
  dueAmount?: number;
  paymentStatus: 'UNPAID' | 'PARTIAL' | 'PAID';
  status: 'DRAFT' | 'ORDERED' | 'RECEIVED' | 'CANCELLED';
  receivedAt?: string;
  notes?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface QuotationItem {
  productId: string;
  productName: string;
  sku?: string;
  quantity: number;
  unitPrice: number;
  taxPercent?: number;
  taxRate?: number;
  discountPercent?: number;
  total: number;
}

export interface QuotationDoc {
  _id: string;
  quotationNumber: string;
  customerId: string;
  customerName: string;
  date: string;
  validUntil: string;
  items: QuotationItem[];
  subTotal: number;
  taxAmount: number;
  discountAmount?: number;
  grandTotal: number;
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'CONVERTED';
  convertedSalesOrderId?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SalesOrderDoc {
  _id: string;
  salesOrderNumber: string;
  customerId: string;
  customerName: string;
  quotationId?: string;
  orderDate: string;
  expectedDelivery: string;
  items: QuotationItem[];
  subTotal: number;
  taxAmount: number;
  discountAmount?: number;
  shipping?: number;
  grandTotal: number;
  status: 'PENDING' | 'APPROVED' | 'IN_PROCESS' | 'COMPLETED' | 'CANCELLED';
  isInvoiced: boolean;
  invoiceId?: string;
  approvedBy?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface InvoiceItem {
  productId: string;
  productName: string;
  sku?: string;
  quantity: number;
  unitPrice: number;
  taxPercent?: number;
  taxRate?: number;
  total: number;
}

export interface InvoiceDoc {
  _id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  salesOrderId?: string;
  invoiceDate?: string;
  date?: string;
  dueDate: string;
  items: InvoiceItem[];
  subTotal: number;
  taxAmount: number;
  discountAmount?: number;
  grandTotal: number;
  paidAmount: number;
  dueAmount: number;
  status?: string;
  paymentStatus?: 'UNPAID' | 'PARTIAL' | 'PAID' | 'OVERDUE';
  paymentTerms?: string;
  notes?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PaymentDoc {
  _id: string;
  paymentNumber: string;
  partyId?: string;
  partyName?: string;
  type?: 'INFLOW' | 'OUTFLOW' | string;
  customerId?: string;
  customerName?: string;
  invoiceId?: string;
  invoiceNumber?: string;
  amount: number;
  paymentMode?: string;
  paymentMethod?: 'CASH' | 'BANK' | 'UPI' | 'CARD' | 'CHEQUE' | 'OTHER' | string;
  referenceNumber?: string;
  transactionReference?: string;
  paymentDate?: string;
  date?: string;
  notes?: string;
  receivedBy: string;
  createdAt: string;
}

export interface ExpenseDoc {
  _id: string;
  expenseNumber?: string;
  category: 'Rent' | 'Utilities' | 'Salaries' | 'Marketing' | 'Supplies' | 'Travel' | 'Maintenance' | 'Other' | string;
  title: string;
  amount: number;
  expenseDate?: string;
  date?: string;
  paymentMethod?: 'CASH' | 'BANK' | 'UPI' | 'CARD' | 'CHEQUE' | string;
  paymentMode?: string;
  vendor?: string;
  description?: string;
  receiptUrl?: string;
  status?: string;
  recordedBy?: string;
  submittedBy?: string;
  approvedBy?: string;
  createdAt: string;
}

export interface CreditNoteDoc {
  _id: string;
  creditNoteNumber: string;
  customerId: string;
  customerName: string;
  invoiceId?: string;
  amount: number;
  reason: string;
  items?: any[];
  date: string;
  status: 'ACTIVE' | 'REDEEMED' | 'CANCELLED' | 'ISSUED';
  createdBy?: string;
  createdAt: string;
}

export interface EmployeeDoc {
  _id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  department: 'Sales' | 'Store' | 'Accounts' | 'HR' | 'Management' | 'Technical' | string;
  designation: string;
  joiningDate: string;
  salary: number;
  status: 'ACTIVE' | 'ON_LEAVE' | 'RESIGNED' | 'TERMINATED';
  userId?: string;
  bankDetails?: {
    accountNumber: string;
    bankName: string;
    ifsc: string;
  };
  createdAt: string;
  updatedAt?: string;
}

export interface CallLogDoc {
  _id: string;
  leadId: string;
  leadName?: string;
  leadPhone?: string;
  employeeId?: string;
  employeeName: string;
  direction: 'OUTBOUND' | 'INBOUND';
  durationSeconds: number;
  outcome: 'CONNECTED' | 'BUSY' | 'NO_ANSWER' | 'WRONG_NUMBER' | 'FOLLOWUP_REQUESTED' | 'INTERESTED' | 'CONVERTED' | 'NOT_INTERESTED';
  notes: string;
  recordingUrl?: string; // Audio Data URL / Base64 / MP3 URL
  recordingName?: string;
  followUpDate?: string;
  followUpNotes?: string;
  timestamp: string;
  createdAt?: string;
}

export interface AttendanceDoc {
  _id: string;
  employeeId: string;
  employeeName: string;
  date: string; // YYYY-MM-DD
  checkIn?: string;
  checkOut?: string;
  status: 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'LEAVE';
  remarks?: string;
  selfieCheckIn?: string; // Base64 or Image URL of selfie
  selfieCheckOut?: string;
  locationCheckIn?: {
    lat: number;
    lng: number;
    address?: string;
    accuracy?: number;
  };
  locationCheckOut?: {
    lat: number;
    lng: number;
    address?: string;
    accuracy?: number;
  };
  workHours?: number;
  breaks?: { start: string; end?: string; durationMinutes?: number }[];
  createdAt: string;
  updatedAt?: string;
}

export interface SalaryDoc {
  _id: string;
  employeeId: string;
  employeeName: string;
  month: string; // e.g. "2026-08"
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  paymentStatus: 'PENDING' | 'PROCESSED' | 'PAID';
  paymentDate?: string;
  notes?: string;
  createdAt: string;
}

export interface LeaveDoc {
  _id: string;
  employeeId: string;
  employeeName: string;
  leaveType: 'CASUAL' | 'SICK' | 'PAID' | 'EMERGENCY' | 'UNPAID';
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  totalDays: number;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  appliedAt: string;
  reviewedBy?: string;
  approvedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TaskDoc {
  _id: string;
  title: string;
  description: string;
  assignedTo: string; // User / Employee ID or Name
  assignedToId?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
  relatedTo?: {
    type: 'LEAD' | 'CUSTOMER' | 'QUOTATION' | 'SALES_ORDER' | 'GENERAL';
    id: string;
    name: string;
  } | string;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  completedAt?: string;
  notes?: string;
}

export interface MessageDoc {
  _id: string;
  leadId?: string;
  customerId?: string;
  recipientName?: string;
  recipientPhone: string;
  recipientEmail?: string;
  employeeId?: string;
  employeeName?: string;
  message?: string;
  content?: string;
  channel?: string;
  messageType?: 'WHATSAPP' | 'SMS' | 'EMAIL';
  direction?: 'OUTBOUND' | 'INBOUND';
  status?: 'SENT' | 'DELIVERED' | 'READ' | 'FAILED' | string;
  deliveryStatus?: string;
  sentBy?: string;
  sentAt?: string;
  templateId?: string;
  timestamp?: string;
  createdAt?: string;
}

export interface ActivityTimelineDoc {
  _id: string;
  leadId?: string;
  entityType?: string;
  entityId?: string;
  employeeId?: string;
  employeeName?: string;
  performedBy?: string;
  action?: string;
  activityType?: 'LEAD_CREATED' | 'ASSIGNED' | 'CALL_MADE' | 'RECORDING_ATTACHED' | 'MESSAGE_SENT' | 'FOLLOWUP_CREATED' | 'FOLLOWUP_COMPLETED' | 'QUOTATION_CREATED' | 'SALES_ORDER_CREATED' | 'STATUS_CHANGED' | 'NOTE_ADDED';
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface NotificationDoc {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: 'LEAD_ASSIGNED' | 'FOLLOWUP_REMINDER' | 'TASK_ASSIGNED' | 'LEAVE_STATUS' | 'SALARY_PUBLISHED' | 'ADMIN_ALERT';
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface PerformanceDoc {
  _id: string;
  employeeId: string;
  employeeName: string;
  reviewPeriod: string; // e.g. "Q2 2026"
  rating: number; // 1 to 5
  comments: string;
  goalsAchieved?: string;
  reviewerName: string;
  reviewDate: string;
  createdAt: string;
}

export interface AuditLogDoc {
  _id: string;
  userId: string;
  userName: string;
  userEmail?: string;
  role?: string;
  userRole?: string;
  action: string; // 'LOGIN' | 'LOGOUT' | 'CREATE' | 'UPDATE' | 'DELETE' | 'PERMISSION_CHANGED' | 'ROLE_CHANGED' | 'STOCK_IN' | 'STOCK_OUT' | 'PURCHASE_RECEIVED' | 'INVOICE_CREATED' | 'PAYMENT_CREATED' | 'USER_CREATED' | 'USER_DISABLED' | string
  module: string;
  entity?: string;
  entityId?: string;
  description?: string;
  recordId?: string;
  oldData?: any;
  newData?: any;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
  createdAt?: string;
}

export interface IntegrationDoc {
  _id: string;
  name: string;
  code: string; // 'tradeindia' | 'indiamart' | 'whatsapp' | 'website_webhook' | 'email_smtp' | 'custom_rest_api' | 'razorpay' | 'sms_gateway' | string
  category?: 'PORTAL' | 'WEBHOOK' | 'COMMUNICATION' | 'PAYMENT' | 'CUSTOM';
  status: 'ACTIVE' | 'INACTIVE' | 'CONFIGURED';
  endpointUrl?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH';
  authType?: 'API_KEY' | 'BEARER_TOKEN' | 'BASIC_AUTH' | 'NO_AUTH' | 'WEBHOOK_SECRET';
  apiKey?: string;
  apiSecret?: string;
  syncFrequency?: 'REALTIME' | 'EVERY_5_MIN' | 'HOURLY' | 'DAILY' | 'MANUAL';
  description?: string;
  config: Record<string, any>;
  lastSyncedAt?: string;
  totalSyncedEvents: number;
  lastTestStatus?: 'SUCCESS' | 'FAILED' | 'PENDING';
  lastTestResponse?: string;
  createdAt?: string;
  updatedAt: string;
}
