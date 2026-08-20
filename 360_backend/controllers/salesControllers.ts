import { Response } from 'express';
import { db } from '../database/db';
import { AuthenticatedRequest } from '../middleware/auth';
import { recordAuditLog } from '../middleware/audit';

// LEADS
export async function getLeads(req: AuthenticatedRequest, res: Response) {
  try {
    const { status, source, assignedTo, search } = req.query;
    let leads = db.leads.getAll();

    if (status) leads = leads.filter(l => l.status === status);
    if (source) leads = leads.filter(l => l.source === source);
    if (assignedTo) leads = leads.filter(l => l.assignedTo === assignedTo);
    if (search) {
      const q = String(search).toLowerCase();
      leads = leads.filter(l =>
        l.name.toLowerCase().includes(q) ||
        (l.companyName && l.companyName.toLowerCase().includes(q)) ||
        l.email.toLowerCase().includes(q) ||
        l.phone.includes(q)
      );
    }

    return res.json({ success: true, data: leads });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function createLead(req: AuthenticatedRequest, res: Response) {
  try {
    const { name, companyName, email, phone, source, status, assignedTo, estimatedValue, notes, tags } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Lead name and phone number are required.' });
    }

    const newLead = db.leads.insertOne({
      name,
      companyName: companyName || '',
      email: email || '',
      phone,
      source: source || 'Manual',
      status: status || 'NEW',
      assignedTo: assignedTo || req.user?.name || 'Unassigned',
      estimatedValue: Number(estimatedValue) || 0,
      notes: notes || '',
      tags: tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    recordAuditLog(req, 'CREATE', 'leads', 'Lead', newLead._id, undefined, { name, status, source });
    return res.status(201).json({ success: true, message: 'Lead created successfully', data: newLead });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function updateLead(req: AuthenticatedRequest, res: Response) {
  try {
    const id = req.params.id;
    const existing = db.leads.findById(id);
    if (!existing) return res.status(404).json({ success: false, message: 'Lead not found' });

    const updated = db.leads.updateById(id, req.body);
    recordAuditLog(req, 'UPDATE', 'leads', 'Lead', id, existing, req.body);
    return res.json({ success: true, message: 'Lead updated', data: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function deleteLead(req: AuthenticatedRequest, res: Response) {
  try {
    const id = req.params.id;
    const existing = db.leads.findById(id);
    if (!existing) return res.status(404).json({ success: false, message: 'Lead not found' });

    db.leads.deleteById(id);
    recordAuditLog(req, 'DELETE', 'leads', 'Lead', id, existing);
    return res.json({ success: true, message: 'Lead deleted' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

// CUSTOMERS
export async function getCustomers(req: AuthenticatedRequest, res: Response) {
  try {
    const { search, status } = req.query;
    let customers = db.customers.getAll();
    if (status) customers = customers.filter(c => c.status === status);
    if (search) {
      const q = String(search).toLowerCase();
      customers = customers.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.companyName.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q)
      );
    }
    return res.json({ success: true, data: customers });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function createCustomer(req: AuthenticatedRequest, res: Response) {
  try {
    const { name, companyName, email, phone, gstNumber, address, assignedTo } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Customer name and phone are required' });
    }

    const newCustomer = db.customers.insertOne({
      name,
      companyName: companyName || name,
      email: email || '',
      phone,
      gstNumber: gstNumber || '',
      address: address || { city: 'Ahmedabad', state: 'Gujarat', country: 'India' },
      assignedTo: assignedTo || req.user?.name || 'Admin',
      totalOrdersCount: 0,
      totalSpent: 0,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    recordAuditLog(req, 'CREATE', 'customers', 'Customer', newCustomer._id, undefined, { name, companyName });
    return res.status(201).json({ success: true, message: 'Customer created', data: newCustomer });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function updateCustomer(req: AuthenticatedRequest, res: Response) {
  try {
    const id = req.params.id;
    const existing = db.customers.findById(id);
    if (!existing) return res.status(404).json({ success: false, message: 'Customer not found' });

    const updated = db.customers.updateById(id, req.body);
    recordAuditLog(req, 'UPDATE', 'customers', 'Customer', id, existing, req.body);
    return res.json({ success: true, message: 'Customer updated', data: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function deleteCustomer(req: AuthenticatedRequest, res: Response) {
  try {
    const id = req.params.id;
    const existing = db.customers.findById(id);
    if (!existing) return res.status(404).json({ success: false, message: 'Customer not found' });

    db.customers.deleteById(id);
    recordAuditLog(req, 'DELETE', 'customers', 'Customer', id, existing);
    return res.json({ success: true, message: 'Customer deleted' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

// QUOTATIONS
export async function getQuotations(req: AuthenticatedRequest, res: Response) {
  try {
    const { status, customerId } = req.query;
    let quotations = db.quotations.getAll();
    if (status) quotations = quotations.filter(q => q.status === status);
    if (customerId) quotations = quotations.filter(q => q.customerId === customerId);
    return res.json({ success: true, data: quotations });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function createQuotation(req: AuthenticatedRequest, res: Response) {
  try {
    const { customerId, customerName, date, validUntil, items, discountAmount, notes } = req.body;
    if (!customerId || !items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Customer and items are required' });
    }

    let subTotal = 0;
    let taxAmount = 0;
    const processedItems = items.map((item: any) => {
      const itemSub = Number(item.quantity) * Number(item.unitPrice);
      const discount = (itemSub * (Number(item.discountPercent) || 0)) / 100;
      const taxable = itemSub - discount;
      const tax = (taxable * (Number(item.taxPercent) || 18)) / 100;
      const total = taxable + tax;
      subTotal += itemSub;
      taxAmount += tax;
      return {
        ...item,
        total: Math.round(total)
      };
    });

    const disc = Number(discountAmount) || 0;
    const grandTotal = Math.round(subTotal + taxAmount - disc);

    const quotationNumber = `QT-${new Date().getFullYear()}-${String(db.quotations.countDocuments() + 1).padStart(4, '0')}`;

    const newQuotation = db.quotations.insertOne({
      quotationNumber,
      customerId,
      customerName,
      date: date || new Date().toISOString().split('T')[0],
      validUntil: validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: processedItems,
      subTotal,
      taxAmount: Math.round(taxAmount),
      discountAmount: disc,
      grandTotal,
      status: 'SENT',
      notes: notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    recordAuditLog(req, 'CREATE', 'quotations', 'Quotation', newQuotation._id, undefined, { quotationNumber, grandTotal });
    return res.status(201).json({ success: true, message: 'Quotation created', data: newQuotation });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function convertQuotationToSalesOrder(req: AuthenticatedRequest, res: Response) {
  try {
    const id = req.params.id;
    const quote = db.quotations.findById(id);
    if (!quote) return res.status(404).json({ success: false, message: 'Quotation not found' });

    if (quote.status === 'CONVERTED') {
      return res.status(400).json({ success: false, message: 'Quotation has already been converted' });
    }

    const salesOrderNumber = `SO-${new Date().getFullYear()}-${String(db.salesOrders.countDocuments() + 1).padStart(4, '0')}`;
    const newSO = db.salesOrders.insertOne({
      salesOrderNumber,
      customerId: quote.customerId,
      customerName: quote.customerName,
      quotationId: quote._id,
      orderDate: new Date().toISOString().split('T')[0],
      expectedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: quote.items,
      subTotal: quote.subTotal,
      taxAmount: quote.taxAmount,
      discountAmount: quote.discountAmount,
      shipping: 2000,
      grandTotal: quote.grandTotal + 2000,
      status: 'APPROVED',
      isInvoiced: false,
      approvedBy: req.user?.name || 'Admin',
      notes: `Converted from quotation ${quote.quotationNumber}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    db.quotations.updateById(id, {
      status: 'CONVERTED',
      convertedSalesOrderId: newSO._id
    });

    recordAuditLog(req, 'CONVERT', 'quotations', 'Quotation', id, { status: quote.status }, { convertedSalesOrderId: newSO._id });
    return res.json({ success: true, message: 'Quotation successfully converted to Sales Order', data: newSO });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

// SALES ORDERS
export async function getSalesOrders(req: AuthenticatedRequest, res: Response) {
  try {
    const { status, customerId } = req.query;
    let orders = db.salesOrders.getAll();
    if (status) orders = orders.filter(o => o.status === status);
    if (customerId) orders = orders.filter(o => o.customerId === customerId);
    return res.json({ success: true, data: orders });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function createSalesOrder(req: AuthenticatedRequest, res: Response) {
  try {
    const { customerId, customerName, items, shipping, notes, expectedDelivery } = req.body;
    if (!customerId || !items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Customer and items are required' });
    }

    let subTotal = 0;
    let taxAmount = 0;
    const processedItems = items.map((item: any) => {
      const itemSub = Number(item.quantity) * Number(item.unitPrice);
      const discount = (itemSub * (Number(item.discountPercent) || 0)) / 100;
      const taxable = itemSub - discount;
      const tax = (taxable * (Number(item.taxPercent) || 18)) / 100;
      subTotal += itemSub;
      taxAmount += tax;
      return { ...item, total: Math.round(taxable + tax) };
    });

    const shp = Number(shipping) || 0;
    const grandTotal = Math.round(subTotal + taxAmount + shp);
    const salesOrderNumber = `SO-${new Date().getFullYear()}-${String(db.salesOrders.countDocuments() + 1).padStart(4, '0')}`;

    const newSO = db.salesOrders.insertOne({
      salesOrderNumber,
      customerId,
      customerName,
      orderDate: new Date().toISOString().split('T')[0],
      expectedDelivery: expectedDelivery || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: processedItems,
      subTotal,
      taxAmount: Math.round(taxAmount),
      discountAmount: 0,
      shipping: shp,
      grandTotal,
      status: 'APPROVED',
      isInvoiced: false,
      approvedBy: req.user?.name || 'Admin',
      notes: notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    recordAuditLog(req, 'CREATE', 'sales_orders', 'SalesOrder', newSO._id, undefined, { salesOrderNumber, grandTotal });
    return res.status(201).json({ success: true, message: 'Sales Order created', data: newSO });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function approveSalesOrder(req: AuthenticatedRequest, res: Response) {
  try {
    const id = req.params.id;
    const existing = db.salesOrders.findById(id);
    if (!existing) return res.status(404).json({ success: false, message: 'Sales order not found' });

    const updated = db.salesOrders.updateById(id, {
      status: 'APPROVED',
      approvedBy: req.user?.name || 'Admin'
    });

    recordAuditLog(req, 'APPROVE', 'sales_orders', 'SalesOrder', id);
    return res.json({ success: true, message: 'Sales Order approved', data: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

// FOLLOW-UPS
export async function getFollowUps(req: AuthenticatedRequest, res: Response) {
  try {
    const { status, type } = req.query;
    let followUps = db.followUps.getAll();
    if (status) followUps = followUps.filter(f => f.status === status);
    if (type) followUps = followUps.filter(f => f.type === type);
    return res.json({ success: true, data: followUps });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function createFollowUp(req: AuthenticatedRequest, res: Response) {
  try {
    const { leadId, customerId, type, title, description, scheduledAt, assignedTo } = req.body;
    if (!title || !type) {
      return res.status(400).json({ success: false, message: 'Title and type are required' });
    }

    const newFup = db.followUps.insertOne({
      leadId,
      customerId,
      type: type || 'Call',
      title,
      description: description || '',
      scheduledAt: scheduledAt || new Date().toISOString(),
      status: 'PENDING',
      assignedTo: assignedTo || req.user?.name || 'Admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    recordAuditLog(req, 'CREATE', 'follow_ups', 'FollowUp', newFup._id, undefined, { title, type });
    return res.status(201).json({ success: true, message: 'Follow-up scheduled', data: newFup });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function completeFollowUp(req: AuthenticatedRequest, res: Response) {
  try {
    const id = req.params.id;
    const { outcomeNotes } = req.body;
    const existing = db.followUps.findById(id);
    if (!existing) return res.status(404).json({ success: false, message: 'Follow-up not found' });

    const updated = db.followUps.updateById(id, {
      status: 'COMPLETED',
      completedAt: new Date().toISOString(),
      outcomeNotes: outcomeNotes || 'Marked completed'
    });

    recordAuditLog(req, 'UPDATE', 'follow_ups', 'FollowUp', id, existing, { status: 'COMPLETED' });
    return res.json({ success: true, message: 'Follow-up marked completed', data: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

// ==================== EMPLOYEE LEAD CALLS & VOICE RECORDINGS ====================

export async function logLeadCall(req: AuthenticatedRequest, res: Response) {
  try {
    const leadId = req.params.id || req.body.leadId;
    const {
      durationSeconds,
      outcome,
      notes,
      recordingUrl,
      recordingName,
      followUpDate,
      followUpNotes,
      direction,
      updateLeadStatus
    } = req.body;

    const lead = db.leads.findById(leadId);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Target Lead record not found' });
    }

    const callerName = req.user?.name || 'Sales Representative';
    const callerId = req.user?.userId || 'usr_emp_1';

    // 1. Create Call Log with Audio Recording
    const newCallLog = db.callLogs.insertOne({
      leadId,
      leadName: lead.name,
      leadPhone: lead.phone,
      employeeId: callerId,
      employeeName: callerName,
      direction: direction || 'OUTBOUND',
      durationSeconds: Number(durationSeconds) || 0,
      outcome: outcome || 'CONNECTED',
      notes: notes || 'Call conducted with prospective client',
      recordingUrl: recordingUrl || '',
      recordingName: recordingName || (recordingUrl ? `rec_lead_${leadId}_${Date.now()}.wav` : ''),
      followUpDate: followUpDate || '',
      followUpNotes: followUpNotes || '',
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString()
    });

    // 2. Automatically update Lead status if requested or progressed
    let newStatus = lead.status;
    if (updateLeadStatus) {
      newStatus = updateLeadStatus;
    } else if (lead.status === 'NEW') {
      newStatus = 'CONTACTED';
    } else if (outcome === 'INTERESTED' && lead.status === 'CONTACTED') {
      newStatus = 'QUALIFIED';
    } else if (outcome === 'CONVERTED') {
      newStatus = 'WON';
    }

    db.leads.updateById(leadId, {
      status: newStatus,
      updatedAt: new Date().toISOString()
    });

    // 3. Automatically schedule a Follow-Up if followUpDate is specified
    let scheduledFollowUp = null;
    if (followUpDate) {
      scheduledFollowUp = db.followUps.insertOne({
        leadId,
        type: 'Call',
        title: `Follow-up with ${lead.name} (${lead.companyName || lead.phone})`,
        description: followUpNotes || notes || `Follow-up discussion after call on ${new Date().toLocaleDateString()}`,
        scheduledAt: followUpDate.includes('T') ? followUpDate : `${followUpDate}T10:00:00.000Z`,
        status: 'PENDING',
        assignedTo: lead.assignedTo || callerName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    recordAuditLog(req, 'CREATE', 'call_logs', 'Lead Call & Recording', newCallLog._id, undefined, {
      leadName: lead.name,
      outcome,
      duration: durationSeconds,
      hasAudioRecording: !!recordingUrl
    });

    return res.status(201).json({
      success: true,
      message: `✅ Call logged successfully for ${lead.name}${recordingUrl ? ' with audio recording attached' : ''}!`,
      data: {
        callLog: newCallLog,
        lead: db.leads.findById(leadId),
        followUp: scheduledFollowUp
      }
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function getLeadCallLogs(req: AuthenticatedRequest, res: Response) {
  try {
    const leadId = req.params.id;
    let logs = db.callLogs.find(c => c.leadId === leadId);
    logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return res.json({ success: true, data: logs });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function getAllCallLogs(req: AuthenticatedRequest, res: Response) {
  try {
    const { employeeId, outcome, leadId } = req.query;
    let logs = db.callLogs.getAll();

    if (leadId) logs = logs.filter(c => c.leadId === leadId);
    if (employeeId) logs = logs.filter(c => c.employeeId === employeeId);
    if (outcome) logs = logs.filter(c => c.outcome === outcome);

    logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return res.json({ success: true, data: logs });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function deleteCallLog(req: AuthenticatedRequest, res: Response) {
  try {
    const id = req.params.id;
    const existing = db.callLogs.findById(id);
    if (!existing) return res.status(404).json({ success: false, message: 'Call log not found' });

    db.callLogs.deleteById(id);
    recordAuditLog(req, 'DELETE', 'call_logs', 'Call Log', id, existing);
    return res.json({ success: true, message: 'Call log deleted' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

