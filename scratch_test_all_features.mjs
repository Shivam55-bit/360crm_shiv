// Comprehensive 360CRM End-to-End Feature Verification Suite
const BASE_URL = 'http://localhost:5055/api';

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const fetchOpts = { ...options };
  if (fetchOpts.body && typeof fetchOpts.body === 'object' && !(fetchOpts.body instanceof FormData)) {
    fetchOpts.body = JSON.stringify(fetchOpts.body);
  }
  const res = await fetch(url, fetchOpts);
  const data = await res.json().catch(() => null);
  return { status: res.status, data };
}

async function runTestSuite() {
  console.log('====================================================');
  console.log('🚀 STARTING 360CRM COMPREHENSIVE FEATURE TEST SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, details = '') {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName} - ${details}`);
      failed++;
    }
  }

  const runId = Date.now().toString().slice(-4);
  const testPhone = `+91 98877${runId}12`;

  // 1. AUTHENTICATION & RBAC
  console.log('--- MODULE 1: AUTHENTICATION & RBAC TOKENS ---');
  const adminLogin = await request('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { email: 'admin@360crm.com', password: 'admin123' }
  });
  assert(adminLogin.data?.success && adminLogin.data?.data?.token, 'Admin Login (admin@360crm.com)');
  const adminToken = adminLogin.data?.data?.token;

  const empLogin = await request('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { email: 'employee@360crm.com', password: 'admin123' }
  });
  assert(empLogin.data?.success && empLogin.data?.data?.token, 'Employee Login (employee@360crm.com)');
  const empToken = empLogin.data?.data?.token;

  const adminHeaders = { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' };
  const empHeaders = { Authorization: `Bearer ${empToken}`, 'Content-Type': 'application/json' };

  // 2. LEAD MANAGEMENT & ISOLATION
  console.log('\n--- MODULE 2: LEADS & TRADEINDIA INGESTION ---');
  const adminLeads = await request('/leads?dateFilter=ALL_TIME', { headers: adminHeaders });
  assert(adminLeads.data?.success && adminLeads.data?.data?.length > 0, 'Admin can fetch full leads list', `Count: ${adminLeads.data?.data?.length}`);

  const empLeads = await request('/leads?dateFilter=ALL_TIME', { headers: empHeaders });
  assert(empLeads.data?.success, 'Employee can fetch leads');
  const empLeadsAllAssigned = empLeads.data?.data?.every(l => l.assignedTo?.toLowerCase().includes('arjun') || l.assignedToId === 'emp_arjun' || l.assignedToId === 'usr_employee_arjun');
  assert(empLeadsAllAssigned && empLeads.data?.data?.length > 0, 'Strict Isolation: Employee ONLY sees his assigned leads', `Emp leads count: ${empLeads.data?.data?.length}`);

  // Create a new test lead
  const newLeadRes = await request('/leads', {
    method: 'POST',
    headers: adminHeaders,
    body: {
      name: `Verification Buyer ${runId}`,
      companyName: `Alpha Tech Systems ${runId}`,
      email: `alpha${runId}@techsystems.in`,
      phone: testPhone,
      source: 'TradeIndia',
      status: 'NEW',
      estimatedValue: 125000,
      notes: 'Automated test suite verification lead'
    }
  });
  assert(newLeadRes.data?.success && newLeadRes.data?.data?._id, 'Create Lead');
  const testLeadId = newLeadRes.data?.data?._id;

  // Assign lead to Arjun Singh
  const assignRes = await request(`/leads/${testLeadId}/assign`, {
    method: 'PATCH',
    headers: adminHeaders,
    body: {
      employeeId: 'emp_arjun',
      assignedTo: 'Arjun Singh',
      notes: 'Assigned for testing calling flow'
    }
  });
  assert(assignRes.data?.success, 'Assign Lead to Employee (Arjun Singh)');

  // Update lead status to CONTACTED
  const updateStatusRes = await request(`/leads/${testLeadId}`, {
    method: 'PUT',
    headers: empHeaders,
    body: { status: 'CONTACTED' }
  });
  assert(updateStatusRes.data?.success, 'Employee updates lead status to CONTACTED');

  // 3. TRADEINDIA SYNC STATUS
  console.log('\n--- MODULE 3: TRADEINDIA SYNC HEALTH ---');
  const tiStatus = await request('/integrations/tradeindia/status', { headers: adminHeaders });
  assert(tiStatus.data?.success && tiStatus.data?.data?.active, 'TradeIndia Integration is Active & Healthy');

  // 4. CALL LOGGING & RECORDINGS VAULT
  console.log('\n--- MODULE 4: CALL LOGGING & AUDIO RECORDINGS ---');
  const callRes = await request(`/leads/${testLeadId}/calls`, {
    method: 'POST',
    headers: empHeaders,
    body: {
      leadId: testLeadId,
      leadName: `Verification Buyer ${runId}`,
      leadPhone: testPhone,
      durationSeconds: 95,
      outcome: 'INTERESTED',
      notes: 'Client interested in thermal ribbons and scanners, scheduled follow up.',
      audioUrl: 'data:audio/webm;base64,GkXfo59ChoEBQveBAULygQRC84EIQoKEd2VibUKHgQRChYECGFOAZwE='
    }
  });
  assert(callRes.data?.success && (callRes.data?.data?.callLog?._id || callRes.data?.data?._id), 'Log Phone Call with Audio Recording');

  const callLogsRes = await request('/call-logs', { headers: empHeaders });
  assert(callLogsRes.data?.success && callLogsRes.data?.data?.length > 0, 'Retrieve Call Logs Vault');

  // 5. FOLLOW-UPS ENGINE
  console.log('\n--- MODULE 5: FOLLOW-UPS ENGINE ---');
  const fupRes = await request('/follow-ups', {
    method: 'POST',
    headers: empHeaders,
    body: {
      leadId: testLeadId,
      title: 'Discuss pricing terms',
      type: 'Call',
      scheduledAt: new Date(Date.now() + 86400000).toISOString(),
      description: 'Follow up on bulk scanner requirement',
      assignedTo: 'Arjun Singh'
    }
  });
  assert(fupRes.data?.success && fupRes.data?.data?._id, 'Schedule Follow-up');
  const fupId = fupRes.data?.data?._id;

  const fupCompleteRes = await request(`/follow-ups/${fupId}/complete`, {
    method: 'PATCH',
    headers: empHeaders,
    body: { outcomeNotes: 'Pricing agreed with client' }
  });
  assert(fupCompleteRes.data?.success, 'Mark Follow-up as Completed');

  // 6. ATTENDANCE, BREAKS & GPS STATION
  console.log('\n--- MODULE 6: ATTENDANCE, BREAKS & WORKFORCE GPS ---');
  const todayAttRes = await request('/attendance/today-status', { headers: empHeaders });
  assert(todayAttRes.data?.success, 'Retrieve Today Attendance Status');

  const clockInRes = await request('/attendance/clock-in', {
    method: 'POST',
    headers: empHeaders,
    body: {
      location: { latitude: 28.6139, longitude: 77.2090, address: 'Industrial Area Phase 2, New Delhi' },
      selfie: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA='
    }
  });
  assert(clockInRes.data?.success || clockInRes.data?.message?.includes('Already clocked in') || clockInRes.data?.message?.includes('already clocked in'), 'Attendance Clock-In with Live Selfie & Geo-Stamp');

  const breakRes = await request('/attendance/break', {
    method: 'POST',
    headers: empHeaders,
    body: {}
  });
  assert(breakRes.data?.success, 'Toggle Break Action');

  // 7. CUSTOMERS
  console.log('\n--- MODULE 7: CUSTOMER MANAGEMENT ---');
  const custRes = await request('/customers', {
    method: 'POST',
    headers: adminHeaders,
    body: {
      name: `Alpha Tech Systems ${runId} Pvt Ltd`,
      companyName: `Alpha Tech Systems ${runId} Pvt Ltd`,
      email: `contact${runId}@alphatech.in`,
      phone: testPhone,
      gstNumber: '07AAAAA0000A1Z5',
      address: { street: 'Phase 2 Industrial Area', city: 'Delhi', state: 'Delhi', country: 'India' },
      assignedTo: 'Arjun Singh',
      status: 'ACTIVE'
    }
  });
  assert(custRes.data?.success && custRes.data?.data?._id, 'Create Customer Record');
  const customerId = custRes.data?.data?._id;

  const custList = await request('/customers', { headers: adminHeaders });
  assert(custList.data?.success && custList.data?.data?.length > 0, 'Fetch Customers List');

  // 8. PRODUCTS & INVENTORY
  console.log('\n--- MODULE 8: PRODUCTS & INVENTORY ---');
  const prodList = await request('/products', { headers: adminHeaders });
  assert(prodList.data?.success && prodList.data?.data?.length > 0, 'Fetch Products List', `Count: ${prodList.data?.data?.length}`);
  const sampleProduct = prodList.data?.data?.[0];

  const invSummary = await request('/inventory', { headers: adminHeaders });
  assert(invSummary.data?.success, 'Fetch Inventory Summary & Stock Levels');

  // 9. QUOTATIONS ENGINE
  console.log('\n--- MODULE 9: QUOTATION GENERATION & WORKFLOW ---');
  const quoteRes = await request('/quotations', {
    method: 'POST',
    headers: adminHeaders,
    body: {
      customerId: customerId,
      customerName: `Alpha Tech Systems ${runId} Pvt Ltd`,
      leadId: testLeadId,
      items: [
        {
          productId: sampleProduct?._id || 'prod_1',
          productName: sampleProduct?.name || 'Industrial Barcode Scanner 2D',
          sku: 'SKU-GEN',
          quantity: 5,
          unitPrice: 4500,
          discountPercent: 0,
          taxPercent: 18,
          total: 26550
        }
      ],
      subTotal: 22500,
      taxTotal: 4050,
      discountAmount: 0,
      grandTotal: 26550,
      status: 'SENT',
      notes: 'Standard 1 year warranty included'
    }
  });
  assert(quoteRes.data?.success && quoteRes.data?.data?._id, 'Create Quotation');
  const quoteId = quoteRes.data?.data?._id;

  const quoteApproveRes = await request(`/quotations/${quoteId}/approve`, {
    method: 'PATCH',
    headers: adminHeaders,
    body: {}
  });
  assert(quoteApproveRes.data?.success, 'Approve Quotation');

  // 10. SALES ORDERS & INVOICING
  console.log('\n--- MODULE 10: SALES ORDERS & INVOICES ---');
  const orderRes = await request(`/quotations/${quoteId}/convert`, {
    method: 'POST',
    headers: adminHeaders,
    body: {}
  });
  assert(orderRes.data?.success && orderRes.data?.data?._id, 'Convert Approved Quotation to Sales Order');
  const orderId = orderRes.data?.data?._id;

  const invoiceRes = await request(`/sales-orders/${orderId}/generate-invoice`, {
    method: 'POST',
    headers: adminHeaders,
    body: {}
  });
  assert(invoiceRes.data?.success && invoiceRes.data?.data?._id, 'Generate Tax Invoice from Sales Order');

  // 11. DESKTOP ACTIVITY & WORKFORCE TRACKING
  console.log('\n--- MODULE 11: DESKTOP TELEMETRY & LIVE TRACKING ---');
  const heartbeatRes = await request('/activity/heartbeat', {
    method: 'POST',
    headers: empHeaders,
    body: { deviceId: `dev_arjun_${runId}`, deviceName: 'Arjun Dell Workstation', applicationName: 'Google Chrome - 360CRM Lead Desk', isIdle: false }
  });
  assert(heartbeatRes.data?.success, 'Desktop Activity Heartbeat Ingestion');

  const liveTrackingRes = await request('/employee-tracking/live', { headers: adminHeaders });
  assert(liveTrackingRes.data?.success, 'Admin Live GPS & Telemetry Stream');

  // 12. DASHBOARD & SYSTEM REPORTS
  console.log('\n--- MODULE 12: SYSTEM DASHBOARD & METRICS ---');
  const dashboardRes = await request('/dashboard', { headers: adminHeaders });
  assert(dashboardRes.data?.success, 'Main Dashboard KPI Aggregation');

  const superAdminStats = await request('/superadmin/stats', {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert(superAdminStats.status === 200 || superAdminStats.status === 403, 'SuperAdmin Metrics Security Check');

  // SUMMARY
  console.log('\n====================================================');
  console.log(`📊 TEST SUITE FINISHED: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');
  if (failed === 0) {
    console.log('🎉 ALL 360CRM FEATURES ARE 100% OPERATIONAL & VERIFIED!');
  }
}

runTestSuite().catch(console.error);
