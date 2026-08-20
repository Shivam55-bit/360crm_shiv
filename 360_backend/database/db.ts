import fs from 'fs';
import path from 'path';
import { getSeedData } from './seedData';
import {
  UserDoc, RoleDoc, PermissionDoc, LeadDoc, CustomerDoc, ProductDoc, CategoryDoc,
  WarehouseDoc, SupplierDoc, PurchaseDoc, QuotationDoc, SalesOrderDoc,
  InvoiceDoc, PaymentDoc, ExpenseDoc, EmployeeDoc, AttendanceDoc,
  SalaryDoc, PerformanceDoc, CampaignDoc, LeadSourceDoc, IntegrationDoc,
  AuditLogDoc, FollowUpDoc, StockTransactionDoc, CreditNoteDoc, CallLogDoc,
  LeaveDoc, TaskDoc, MessageDoc, ActivityTimelineDoc, NotificationDoc
} from './types';

export class Collection<T extends { _id: string }> {
  private name: string;
  private items: Map<string, T> = new Map();

  constructor(name: string, initialItems: T[] = []) {
    this.name = name;
    initialItems.forEach(item => this.items.set(item._id, JSON.parse(JSON.stringify(item))));
  }

  public getAll(): T[] {
    return Array.from(this.items.values()).map(i => JSON.parse(JSON.stringify(i)));
  }

  public findById(id: string): T | null {
    const found = this.items.get(id);
    return found ? JSON.parse(JSON.stringify(found)) : null;
  }

  public findOne(predicate: (item: T) => boolean): T | null {
    for (const item of this.items.values()) {
      if (predicate(item)) {
        return JSON.parse(JSON.stringify(item));
      }
    }
    return null;
  }

  public find(predicate?: (item: T) => boolean): T[] {
    const list: T[] = [];
    for (const item of this.items.values()) {
      if (!predicate || predicate(item)) {
        list.push(JSON.parse(JSON.stringify(item)));
      }
    }
    return list;
  }

  public insertOne(doc: Omit<T, '_id'> & { _id?: string }): T {
    const id = doc._id || `${this.name.slice(0, 3)}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const fullDoc = { ...doc, _id: id } as T;
    this.items.set(id, JSON.parse(JSON.stringify(fullDoc)));
    return JSON.parse(JSON.stringify(fullDoc));
  }

  public updateById(id: string, updates: Partial<T> | ((prev: T) => T)): T | null {
    const existing = this.items.get(id);
    if (!existing) return null;

    let updated: T;
    if (typeof updates === 'function') {
      updated = updates(JSON.parse(JSON.stringify(existing)));
    } else {
      updated = { ...existing, ...updates, _id: id, updatedAt: new Date().toISOString() } as T;
    }

    this.items.set(id, JSON.parse(JSON.stringify(updated)));
    return JSON.parse(JSON.stringify(updated));
  }

  public deleteById(id: string): boolean {
    return this.items.delete(id);
  }

  public countDocuments(predicate?: (item: T) => boolean): number {
    if (!predicate) return this.items.size;
    let count = 0;
    for (const item of this.items.values()) {
      if (predicate(item)) count++;
    }
    return count;
  }
}

export class Database {
  private static instance: Database;
  public initialized = false;

  public users!: Collection<UserDoc>;
  public roles!: Collection<RoleDoc>;
  public permissions!: Collection<PermissionDoc>;
  public leads!: Collection<LeadDoc>;
  public customers!: Collection<CustomerDoc>;
  public followUps!: Collection<FollowUpDoc>;
  public campaigns!: Collection<CampaignDoc>;
  public leadSources!: Collection<LeadSourceDoc>;
  public products!: Collection<ProductDoc>;
  public categories!: Collection<CategoryDoc>;
  public warehouses!: Collection<WarehouseDoc>;
  public stockTransactions!: Collection<StockTransactionDoc>;
  public suppliers!: Collection<SupplierDoc>;
  public purchases!: Collection<PurchaseDoc>;
  public quotations!: Collection<QuotationDoc>;
  public salesOrders!: Collection<SalesOrderDoc>;
  public invoices!: Collection<InvoiceDoc>;
  public payments!: Collection<PaymentDoc>;
  public expenses!: Collection<ExpenseDoc>;
  public creditNotes!: Collection<CreditNoteDoc>;
  public employees!: Collection<EmployeeDoc>;
  public attendance!: Collection<AttendanceDoc>;
  public salaries!: Collection<SalaryDoc>;
  public performance!: Collection<PerformanceDoc>;
  public integrations!: Collection<IntegrationDoc>;
  public auditLogs!: Collection<AuditLogDoc>;
  public callLogs!: Collection<CallLogDoc>;
  public leaves!: Collection<LeaveDoc>;
  public tasks!: Collection<TaskDoc>;
  public messages!: Collection<MessageDoc>;
  public activityTimeline!: Collection<ActivityTimelineDoc>;
  public notifications!: Collection<NotificationDoc>;

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async init() {
    if (this.initialized) return;

    const seed = await getSeedData();
    this.users = new Collection<UserDoc>('users', seed.users);
    this.roles = new Collection<RoleDoc>('roles', seed.roles);
    this.permissions = new Collection<PermissionDoc>('permissions', seed.permissions);
    this.leads = new Collection<LeadDoc>('leads', seed.leads);
    this.customers = new Collection<CustomerDoc>('customers', seed.customers);
    this.followUps = new Collection<FollowUpDoc>('followUps', seed.followUps);
    this.campaigns = new Collection<CampaignDoc>('campaigns', seed.campaigns);
    this.leadSources = new Collection<LeadSourceDoc>('leadSources', seed.leadSources);
    this.products = new Collection<ProductDoc>('products', seed.products);
    this.categories = new Collection<CategoryDoc>('categories', seed.categories);
    this.warehouses = new Collection<WarehouseDoc>('warehouses', seed.warehouses);
    this.stockTransactions = new Collection<StockTransactionDoc>('stockTransactions', seed.stockTransactions);
    this.suppliers = new Collection<SupplierDoc>('suppliers', seed.suppliers);
    this.purchases = new Collection<PurchaseDoc>('purchases', seed.purchases);
    this.quotations = new Collection<QuotationDoc>('quotations', seed.quotations);
    this.salesOrders = new Collection<SalesOrderDoc>('salesOrders', seed.salesOrders);
    this.invoices = new Collection<InvoiceDoc>('invoices', seed.invoices);
    this.payments = new Collection<PaymentDoc>('payments', seed.payments);
    this.expenses = new Collection<ExpenseDoc>('expenses', seed.expenses);
    this.creditNotes = new Collection<CreditNoteDoc>('creditNotes', seed.creditNotes);
    this.employees = new Collection<EmployeeDoc>('employees', seed.employees);
    this.attendance = new Collection<AttendanceDoc>('attendance', seed.attendance);
    this.salaries = new Collection<SalaryDoc>('salaries', seed.salaries);
    this.performance = new Collection<PerformanceDoc>('performance', seed.performance);
    this.integrations = new Collection<IntegrationDoc>('integrations', seed.integrations);
    this.auditLogs = new Collection<AuditLogDoc>('auditLogs', seed.auditLogs);
    this.callLogs = new Collection<CallLogDoc>('callLogs', (seed as any).callLogs || []);
    this.leaves = new Collection<LeaveDoc>('leaves', (seed as any).leaves || []);
    this.tasks = new Collection<TaskDoc>('tasks', (seed as any).tasks || []);
    this.messages = new Collection<MessageDoc>('messages', (seed as any).messages || []);
    this.activityTimeline = new Collection<ActivityTimelineDoc>('activityTimeline', (seed as any).activityTimeline || []);
    this.notifications = new Collection<NotificationDoc>('notifications', (seed as any).notifications || []);

    this.initialized = true;
    console.log('✅ 360CRM Enterprise Database & Memory Engine Initialized with Shiv Shakti Seed Data');
  }

  // Atomic Stock In Transaction
  public stockIn(params: {
    productId: string;
    warehouseId: string;
    quantity: number;
    referenceType: 'MANUAL' | 'PURCHASE' | 'RETURN';
    referenceId?: string;
    reason?: string;
    supplierId?: string;
    supplierName?: string;
    createdBy: string;
  }): { success: boolean; message: string; transaction?: StockTransactionDoc; product?: ProductDoc } {
    const product = this.products.findById(params.productId);
    if (!product) {
      return { success: false, message: 'Product not found' };
    }

    const warehouse = this.warehouses.findById(params.warehouseId);
    const warehouseName = warehouse ? warehouse.name : (product.warehouseName || 'Default Warehouse');

    const previousStock = product.currentStock;
    const newStock = previousStock + Number(params.quantity);

    // Update Product Stock atomically
    const updatedProduct = this.products.updateById(params.productId, {
      currentStock: newStock,
      warehouseId: params.warehouseId,
      warehouseName
    });

    // Create Stock Transaction
    const tx = this.stockTransactions.insertOne({
      productId: params.productId,
      productName: product.name,
      warehouseId: params.warehouseId,
      warehouseName,
      type: 'STOCK_IN',
      quantity: Number(params.quantity),
      previousStock,
      newStock,
      referenceType: params.referenceType,
      referenceId: params.referenceId,
      reason: params.reason || 'Goods received into inventory',
      supplierId: params.supplierId,
      supplierName: params.supplierName,
      createdBy: params.createdBy,
      createdAt: new Date().toISOString()
    });

    return { success: true, message: 'Stock received successfully', transaction: tx, product: updatedProduct || undefined };
  }

  // Atomic Stock Out Transaction with strict stockout validation
  public stockOut(params: {
    productId: string;
    warehouseId: string;
    quantity: number;
    referenceType: 'MANUAL' | 'SALES_ORDER' | 'DAMAGE';
    referenceId?: string;
    reason?: string;
    createdBy: string;
  }): { success: boolean; message: string; transaction?: StockTransactionDoc; product?: ProductDoc } {
    const product = this.products.findById(params.productId);
    if (!product) {
      return { success: false, message: 'Product not found' };
    }

    const reqQty = Number(params.quantity);
    if (reqQty <= 0) {
      return { success: false, message: 'Quantity must be greater than 0' };
    }

    if (product.currentStock < reqQty) {
      return {
        success: false,
        message: `Insufficient stock. Requested: ${reqQty}, Available: ${product.currentStock}`
      };
    }

    const warehouse = this.warehouses.findById(params.warehouseId);
    const warehouseName = warehouse ? warehouse.name : (product.warehouseName || 'Default Warehouse');

    const previousStock = product.currentStock;
    const newStock = previousStock - reqQty;

    const updatedProduct = this.products.updateById(params.productId, {
      currentStock: newStock
    });

    const tx = this.stockTransactions.insertOne({
      productId: params.productId,
      productName: product.name,
      warehouseId: params.warehouseId,
      warehouseName,
      type: 'STOCK_OUT',
      quantity: reqQty,
      previousStock,
      newStock,
      referenceType: params.referenceType,
      referenceId: params.referenceId,
      reason: params.reason || 'Goods dispatched from warehouse',
      createdBy: params.createdBy,
      createdAt: new Date().toISOString()
    });

    return { success: true, message: 'Stock dispatched successfully', transaction: tx, product: updatedProduct || undefined };
  }
}

export const db = Database.getInstance();
