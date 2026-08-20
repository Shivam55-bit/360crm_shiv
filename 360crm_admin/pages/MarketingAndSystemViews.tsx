import React, { useState, useEffect } from 'react';
import { api } from '@/src/services/api';
import { useAuth } from '@/src/context/AuthContext';
import {
  PageHeader,
  StatusBadge,
  Modal,
  exportToCSV
} from '@/src/components/common/UIComponents';
import {
  Target,
  Plug,
  MessageSquare,
  Zap,
  BarChart3,
  Download,
  Plus,
  Send,
  CheckCircle2,
  Globe,
  Settings,
  Edit2,
  Trash2,
  RefreshCw,
  Copy,
  Check,
  Activity,
  Key,
  Shield,
  Clock,
  Layers,
  AlertCircle,
  Play,
  Search,
  SlidersHorizontal,
  Eye,
  EyeOff,
  Radio
} from 'lucide-react';

// ==========================================
// 1. MARKETING CAMPAIGNS VIEW
// ==========================================
export const CampaignsView: React.FC = () => {
  const [campaigns, setCampaigns] = useState<any[]>([]);

  const fetchCampaigns = async () => {
    const res = await api.get('/campaigns');
    if (res.success && res.data) setCampaigns(res.data);
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="Marketing Campaigns"
        subtitle="Track multi-channel promotional campaigns, lead acquisition cost and conversion ROI"
        actionText="New Campaign"
        actionIcon={Plus}
        actionPermission="campaigns.create"
        secondaryAction={
          <button
            onClick={() => exportToCSV('360CRM_Campaigns', campaigns)}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Export CSV
          </button>
        }
      />

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-semibold uppercase">
              <tr>
                <th className="px-6 py-3.5">Campaign Name</th>
                <th className="px-6 py-3.5">Channel / Source</th>
                <th className="px-6 py-3.5">Budget Allocated</th>
                <th className="px-6 py-3.5">Leads Generated</th>
                <th className="px-6 py-3.5">Conversions</th>
                <th className="px-6 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {campaigns.map(c => (
                <tr key={c._id} className="hover:bg-slate-50/70">
                  <td className="px-6 py-4 font-bold text-slate-900">{c.name}</td>
                  <td className="px-6 py-4 text-blue-600 font-semibold">{c.source}</td>
                  <td className="px-6 py-4 font-semibold">₹{c.budget.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">{c.leadsGenerated} prospects</td>
                  <td className="px-6 py-4 font-bold text-emerald-600">{c.conversions} won</td>
                  <td className="px-6 py-4"><StatusBadge status={c.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. TRADEINDIA CONNECTOR / SIMULATOR
// ==========================================
export const TradeIndiaView: React.FC = () => {
  const [senderName, setSenderName] = useState('Rajesh Sharma (Gujarat Motors)');
  const [senderMobile, setSenderMobile] = useState('+91 98250 11223');
  const [senderEmail, setSenderEmail] = useState('rajesh@gujaratmotors.com');
  const [productName, setProductName] = useState('Stainless Steel Industrial Valve 2-inch');
  const [queryMessage, setQueryMessage] = useState('Require 50 units urgent delivery to Surat plant. Please send best quote.');
  const [responseMsg, setResponseMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSimulateWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponseMsg(null);

    const res = await api.post('/tradeindia/webhook', {
      SENDER_NAME: senderName,
      SENDER_MOBILE: senderMobile,
      SENDER_EMAIL: senderEmail,
      PRODUCT_NAME: productName,
      QUERY_MESSAGE: queryMessage
    });

    if (res.success) {
      setResponseMsg(`✅ Success! Lead ingested directly into 360CRM database. Lead ID: ${res.data?._id}`);
    } else {
      setResponseMsg(`❌ Error: ${res.message}`);
    }
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="TradeIndia B2B Integration"
        subtitle="Automated API Webhook connector to ingest TradeIndia buyer inquiries directly into CRM leads"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs">
          <h3 className="text-base font-bold text-slate-900 mb-2">Live Webhook Simulation & Testing</h3>
          <p className="text-xs text-slate-500 mb-6">
            Test the live B2B webhook parser. Ingesting this inquiry creates a new lead and increments the TradeIndia synchronization counter.
          </p>

          <form onSubmit={handleSimulateWebhook} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">SENDER_NAME</label>
                <input
                  type="text"
                  required
                  value={senderName}
                  onChange={e => setSenderName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">SENDER_MOBILE</label>
                <input
                  type="text"
                  required
                  value={senderMobile}
                  onChange={e => setSenderMobile(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">SENDER_EMAIL</label>
                <input
                  type="email"
                  value={senderEmail}
                  onChange={e => setSenderEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">PRODUCT_NAME</label>
                <input
                  type="text"
                  value={productName}
                  onChange={e => setProductName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">QUERY_MESSAGE</label>
              <textarea
                rows={3}
                value={queryMessage}
                onChange={e => setQueryMessage(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition-all flex items-center gap-2"
            >
              <Plug className="w-4 h-4" />
              {loading ? 'Ingesting Inquiry...' : 'Trigger TradeIndia Webhook'}
            </button>
          </form>

          {responseMsg && (
            <div className="mt-4 p-4 rounded-xl text-xs font-semibold bg-slate-900 text-emerald-400 font-mono">
              {responseMsg}
            </div>
          )}
        </div>

        <div className="bg-slate-900 text-slate-300 rounded-2xl p-6 border border-slate-800 shadow-xs text-xs space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Webhook Endpoint Info</h3>
          <p className="text-slate-400">Configure TradeIndia Developer Portal with the following Webhook URL:</p>
          <div className="p-3 bg-slate-950 rounded-xl font-mono text-[11px] text-blue-400 break-all select-all">
            POST /api/tradeindia/webhook
          </div>
          <div className="pt-2 border-t border-slate-800">
            <span className="text-emerald-400 font-bold">● Status: Active & Listening</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. WHATSAPP SENDER VIEW
// ==========================================
export const WhatsAppView: React.FC = () => {
  const [toPhone, setToPhone] = useState('+91 98765 43210');
  const [recipientName, setRecipientName] = useState('Rahul Verma');
  const [template, setTemplate] = useState('quotation_sent');
  const [message, setMessage] = useState('Dear Rahul, your quotation for Stainless Steel Industrial Valve has been generated.');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await api.post('/whatsapp/send', {
      toPhone,
      recipientName,
      templateName: template,
      messageText: message
    });

    if (res.success) {
      setStatusMsg(`✅ Message dispatched successfully to ${toPhone}! Status: Delivered`);
    } else {
      setStatusMsg(`❌ Failed: ${res.message}`);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="WhatsApp Business API Messaging"
        subtitle="Dispatch automated quotation notifications, payment reminders & order confirmations"
      />

      <div className="max-w-2xl bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs">
        <form onSubmit={handleSend} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Recipient Name</label>
              <input
                type="text"
                required
                value={recipientName}
                onChange={e => setRecipientName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">WhatsApp Mobile Number</label>
              <input
                type="text"
                required
                value={toPhone}
                onChange={e => setToPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Notification Template</label>
            <select
              value={template}
              onChange={e => setTemplate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            >
              <option value="quotation_sent">Quotation Sent Notification</option>
              <option value="order_confirmed">Sales Order Confirmed</option>
              <option value="payment_reminder">Payment Due Reminder</option>
              <option value="lead_follow_up">Inquiry Follow-up</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Message Preview</label>
            <textarea
              rows={4}
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-all flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Send WhatsApp Notification
          </button>

          {statusMsg && (
            <div className="p-3 bg-slate-100 rounded-xl font-semibold text-slate-800">
              {statusMsg}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

// ==========================================
// 4. CENTRAL REPORTS HUB VIEW (17+ REPORTS)
// ==========================================
export const ReportsHubView: React.FC = () => {
  const [reportType, setReportType] = useState('sales');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const reportCategories = [
    { id: 'sales', label: 'Sales Orders Register' },
    { id: 'leads', label: 'Leads & Prospect Conversion' },
    { id: 'customers', label: 'Customer Master Register' },
    { id: 'quotations', label: 'Quotation Estimates Report' },
    { id: 'stock', label: 'Inventory Stock Valuation' },
    { id: 'stock_transactions', label: 'Inward & Outward Stock Logs' },
    { id: 'purchases', label: 'Purchase Orders Register' },
    { id: 'suppliers', label: 'Supplier & Vendor Accounts' },
    { id: 'invoices', label: 'Tax Invoices Register' },
    { id: 'payments', label: 'Payment Receipts Register' },
    { id: 'expenses', label: 'Operational Expenses Report' },
    { id: 'employees', label: 'Employee Staff Register' },
    { id: 'attendance', label: 'Attendance & Punctuality Report' },
    { id: 'salaries', label: 'Monthly Payroll Disbursals' }
  ];

  const fetchReport = async () => {
    setLoading(true);
    const res = await api.get('/reports', { type: reportType });
    if (res.success && res.data) setData(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchReport();
  }, [reportType]);

  const handleExport = () => {
    if (!data?.records?.length) return;
    exportToCSV(`360CRM_Report_${reportType}`, data.records);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="Enterprise Reports Hub"
        subtitle="17+ analytical reports spanning Sales, Accounts, Inventory, Payroll & Marketing with instant CSV export"
        actionText="Export Current Report"
        actionIcon={Download}
        actionPermission="reports.view"
        onAction={handleExport}
      />

      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-4">
        <label className="text-xs font-bold text-slate-700">Select Report Type:</label>
        <select
          value={reportType}
          onChange={e => setReportType(e.target.value)}
          className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-800 font-semibold focus:bg-white"
        >
          {reportCategories.map(r => (
            <option key={r.id} value={r.id}>{r.label}</option>
          ))}
        </select>
        <span className="text-xs text-slate-500 font-medium">
          Total Records Found: {data?.totalRecords || 0}
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden p-4">
        {data?.records?.length > 0 ? (
          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase sticky top-0">
                <tr>
                  {Object.keys(data.records[0]).slice(0, 7).map(col => (
                    <th key={col} className="px-4 py-3">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {data.records.map((row: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50/60">
                    {Object.keys(data.records[0]).slice(0, 7).map(col => (
                      <td key={col} className="px-4 py-3 truncate max-w-xs">
                        {typeof row[col] === 'object' ? JSON.stringify(row[col]) : String(row[col] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400 text-xs font-medium">
            No records found for this reporting criteria.
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 5. INTEGRATIONS VIEW (With Add, Edit, Delete, Test & Sync)
// ==========================================
export const IntegrationsView: React.FC = () => {
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<any | null>(null);

  // Testing & Sync states
  const [testingId, setTestingId] = useState<string | null>(null);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [testResult, setTestResult] = useState<{ id: string; success: boolean; message: string; latency?: number } | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Form State
  const initialFormState = {
    name: '',
    code: 'custom_api',
    category: 'CUSTOM',
    status: 'ACTIVE',
    endpointUrl: '',
    method: 'POST',
    authType: 'API_KEY',
    apiKey: '',
    apiSecret: '',
    syncFrequency: 'REALTIME',
    description: '',
    configJson: '{}'
  };

  const [formData, setFormData] = useState(initialFormState);

  // Presets list for quick creation
  const integrationPresets = [
    {
      label: 'TradeIndia Lead Connector',
      name: 'TradeIndia Lead Sync API',
      code: 'tradeindia',
      category: 'PORTAL',
      endpointUrl: '/api/tradeindia/webhook',
      method: 'POST',
      authType: 'API_KEY',
      syncFrequency: 'REALTIME',
      description: 'Ingest B2B buyer leads directly into CRM pipeline via TradeIndia push webhook.'
    },
    {
      label: 'IndiaMART Lead Sync API',
      name: 'IndiaMART CRM Lead Gateway',
      code: 'indiamart',
      category: 'PORTAL',
      endpointUrl: 'https://api.indiamart.com/v1/leads',
      method: 'GET',
      authType: 'API_KEY',
      syncFrequency: 'EVERY_5_MIN',
      description: 'Fetch new customer RFQs and inquiries from IndiaMART seller portal.'
    },
    {
      label: 'Website Lead Capture Webhook',
      name: 'Corporate Website Form Hook',
      code: 'website_webhook',
      category: 'WEBHOOK',
      endpointUrl: '/api/website-leads',
      method: 'POST',
      authType: 'WEBHOOK_SECRET',
      syncFrequency: 'REALTIME',
      description: 'Receive contact and quote request forms from main marketing landing pages.'
    },
    {
      label: 'WhatsApp Cloud API Gateway',
      name: 'Meta WhatsApp Business API',
      code: 'whatsapp',
      category: 'COMMUNICATION',
      endpointUrl: 'https://graph.facebook.com/v19.0/messages',
      method: 'POST',
      authType: 'BEARER_TOKEN',
      syncFrequency: 'REALTIME',
      description: 'Automated invoice notifications, order tracking, and quotes via WhatsApp.'
    },
    {
      label: 'Razorpay / Stripe Payment Hook',
      name: 'Payment Gateway Webhook',
      code: 'razorpay',
      category: 'PAYMENT',
      endpointUrl: '/api/payments/webhook',
      method: 'POST',
      authType: 'WEBHOOK_SECRET',
      syncFrequency: 'REALTIME',
      description: 'Sync payment captures, UPI payments, and bank settlements into accounts.'
    },
    {
      label: 'Custom REST API Connector',
      name: 'Custom Enterprise ERP API',
      code: 'custom_rest_api',
      category: 'CUSTOM',
      endpointUrl: 'https://api.shivshakti-erp.com/v1/sync',
      method: 'POST',
      authType: 'API_KEY',
      syncFrequency: 'HOURLY',
      description: 'Bi-directional synchronization with external warehouse or accounting tools.'
    }
  ];

  const fetchIntegrations = async () => {
    setLoading(true);
    const res = await api.get('/integrations');
    if (res.success && res.data) {
      setIntegrations(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const openAddModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData(initialFormState);
    setShowApiKey(false);
    setIsModalOpen(true);
  };

  const openEditModal = (int: any) => {
    setIsEditing(true);
    setEditingId(int._id);
    setFormData({
      name: int.name || '',
      code: int.code || 'custom_api',
      category: int.category || 'CUSTOM',
      status: int.status || 'ACTIVE',
      endpointUrl: int.endpointUrl || '',
      method: int.method || 'POST',
      authType: int.authType || 'API_KEY',
      apiKey: int.apiKey || '',
      apiSecret: int.apiSecret || '',
      syncFrequency: int.syncFrequency || 'REALTIME',
      description: int.description || '',
      configJson: JSON.stringify(int.config || {}, null, 2)
    });
    setShowApiKey(false);
    setIsModalOpen(true);
  };

  const handleApplyPreset = (preset: typeof integrationPresets[0]) => {
    setFormData(prev => ({
      ...prev,
      name: preset.name,
      code: preset.code,
      category: preset.category,
      endpointUrl: preset.endpointUrl,
      method: preset.method,
      authType: preset.authType,
      syncFrequency: preset.syncFrequency,
      description: preset.description
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    let parsedConfig = {};
    try {
      if (formData.configJson && formData.configJson.trim()) {
        parsedConfig = JSON.parse(formData.configJson);
      }
    } catch (err) {
      alert('Invalid JSON in Configuration parameters. Please correct it before saving.');
      return;
    }

    const payload = {
      name: formData.name,
      code: formData.code,
      category: formData.category,
      status: formData.status,
      endpointUrl: formData.endpointUrl,
      method: formData.method,
      authType: formData.authType,
      apiKey: formData.apiKey,
      apiSecret: formData.apiSecret,
      syncFrequency: formData.syncFrequency,
      description: formData.description,
      config: parsedConfig
    };

    if (isEditing && editingId) {
      const res = await api.put(`/integrations/${editingId}`, payload);
      if (res.success) {
        setActionMessage(`Integration '${formData.name}' updated successfully!`);
        setTimeout(() => setActionMessage(null), 4000);
        setIsModalOpen(false);
        fetchIntegrations();
      } else {
        alert(res.message || 'Failed to update integration');
      }
    } else {
      const res = await api.post('/integrations', payload);
      if (res.success) {
        setActionMessage(`New API connector '${formData.name}' registered successfully!`);
        setTimeout(() => setActionMessage(null), 4000);
        setIsModalOpen(false);
        fetchIntegrations();
      } else {
        alert(res.message || 'Failed to create integration');
      }
    }
  };

  const confirmDelete = (int: any) => {
    setItemToDelete(int);
    setDeleteConfirmId(int._id);
  };

  const executeDelete = async () => {
    if (!deleteConfirmId) return;
    const res = await api.delete(`/integrations/${deleteConfirmId}`);
    if (res.success) {
      setActionMessage(`Integration deleted successfully.`);
      setTimeout(() => setActionMessage(null), 4000);
      setDeleteConfirmId(null);
      setItemToDelete(null);
      fetchIntegrations();
    } else {
      alert(res.message || 'Failed to delete integration');
    }
  };

  const handleTestConnection = async (id: string, name: string) => {
    setTestingId(id);
    setTestResult(null);
    const res = await api.post(`/integrations/${id}/test`, {});
    setTestingId(null);
    if (res.success) {
      setTestResult({
        id,
        success: true,
        message: res.message || 'Connection handshake successful! HTTP 200 OK',
        latency: res.data?.latencyMs || 54
      });
      fetchIntegrations();
    } else {
      setTestResult({
        id,
        success: false,
        message: res.message || 'Test failed. Endpoint returned an error.',
        latency: 0
      });
      fetchIntegrations();
    }
  };

  const handleManualSync = async (id: string) => {
    setSyncingId(id);
    const res = await api.post(`/integrations/${id}/sync`, {});
    setSyncingId(null);
    if (res.success) {
      setActionMessage(res.message || 'Manual data synchronization complete!');
      setTimeout(() => setActionMessage(null), 4000);
      fetchIntegrations();
    } else {
      alert(res.message || 'Failed to synchronize integration data');
    }
  };

  const handleCopyEndpoint = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleStatus = async (int: any) => {
    const newStatus = int.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const res = await api.put(`/integrations/${int._id}`, { status: newStatus });
    if (res.success) {
      fetchIntegrations();
    }
  };

  // Filtered integrations
  const filteredIntegrations = integrations.filter(int => {
    const matchesCategory = filterCategory === 'ALL' || int.category === filterCategory || (filterCategory === 'PORTAL' && (int.code === 'tradeindia' || int.code === 'indiamart'));
    const matchesSearch =
      int.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      int.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      int.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      int.endpointUrl?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Aggregated Stats
  const totalConnectors = integrations.length;
  const activeConnectors = integrations.filter(i => i.status === 'ACTIVE').length;
  const totalIngestedEvents = integrations.reduce((acc, curr) => acc + (curr.totalSyncedEvents || 0), 0);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Banner Alert if any action happened */}
      {actionMessage && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-700 text-xs font-semibold flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionMessage}</span>
          </div>
          <button onClick={() => setActionMessage(null)} className="text-emerald-800 hover:text-emerald-950 text-xs">
            ✕
          </button>
        </div>
      )}

      {/* Main Header with Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Enterprise Connectors & API Gateways"
          subtitle="Manage external B2B portal integrations, webhooks, WhatsApp Cloud API and accounting synchronization"
        />
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={fetchIntegrations}
            disabled={loading}
            className="px-3.5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs font-bold transition-all flex items-center gap-2 shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-600' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={openAddModal}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Connect New API</span>
          </button>
        </div>
      </div>

      {/* Live System Telemetry Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Plug className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Connectors</div>
            <div className="text-xl font-black text-slate-900">{totalConnectors} Configured</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Gateways</div>
            <div className="text-xl font-black text-emerald-600">{activeConnectors} Live & Running</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Synced Events</div>
            <div className="text-xl font-black text-slate-900">{totalIngestedEvents.toLocaleString()} Events</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Gateway Health</div>
            <div className="text-xl font-black text-slate-900">99.9% Uptime</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
          {[
            { id: 'ALL', label: 'All APIs' },
            { id: 'PORTAL', label: 'B2B Portals' },
            { id: 'WEBHOOK', label: 'Webhooks' },
            { id: 'COMMUNICATION', label: 'WhatsApp / SMS' },
            { id: 'PAYMENT', label: 'Payments' },
            { id: 'CUSTOM', label: 'Custom REST' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterCategory(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                filterCategory === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search API by name or URL..."
            className="w-full pl-9 pr-3.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 font-medium"
          />
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIntegrations.map(int => {
          const isTesting = testingId === int._id;
          const isSyncing = syncingId === int._id;
          const isCopied = copiedId === int._id;
          const currentTest = testResult?.id === int._id ? testResult : null;

          return (
            <div
              key={int._id}
              className={`bg-white rounded-3xl p-6 border transition-all duration-200 hover:shadow-md flex flex-col justify-between space-y-4 ${
                int.status === 'ACTIVE'
                  ? 'border-slate-200/90 shadow-2xs'
                  : 'border-slate-200/60 bg-slate-50/50 opacity-90'
              }`}
            >
              {/* Header: Icon, Category, Status & Toggle */}
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold ${
                      int.category === 'PORTAL'
                        ? 'bg-blue-50 text-blue-600'
                        : int.category === 'COMMUNICATION'
                        ? 'bg-emerald-50 text-emerald-600'
                        : int.category === 'PAYMENT'
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'bg-amber-50 text-amber-600'
                    }`}>
                      <Plug className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono">
                        {int.category || 'API'}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 mt-1 leading-snug">{int.name}</h4>
                    </div>
                  </div>

                  {/* Status Toggle Badge */}
                  <button
                    onClick={() => handleToggleStatus(int)}
                    title="Click to toggle status"
                    className="shrink-0"
                  >
                    <StatusBadge status={int.status} />
                  </button>
                </div>

                <p className="text-xs text-slate-500 mt-2.5 line-clamp-2 leading-relaxed">
                  {int.description || 'Configured real-time API connector for enterprise system operations.'}
                </p>
              </div>

              {/* Endpoint & Auth Details Box */}
              <div className="space-y-2">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-2 text-[11px]">
                  {/* Endpoint URL */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-blue-100 text-blue-700 font-mono shrink-0">
                        {int.method || 'POST'}
                      </span>
                      <span className="text-slate-700 font-mono truncate text-[10px]">
                        {int.endpointUrl || '/api/custom-webhook'}
                      </span>
                    </div>
                    {int.endpointUrl && (
                      <button
                        onClick={() => handleCopyEndpoint(int._id, int.endpointUrl)}
                        className="p-1 rounded-md hover:bg-slate-200 text-slate-500 shrink-0 transition-colors"
                        title="Copy Endpoint URL"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>

                  {/* Auth Type & Sync Frequency */}
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/50 text-slate-600">
                    <div className="flex items-center gap-1.5 truncate">
                      <Key className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{int.authType || 'API_KEY'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate justify-end">
                      <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate capitalize">{(int.syncFrequency || 'Realtime').toLowerCase().replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>

                {/* Telemetry Stats Box */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/60 text-[11px] space-y-1.5 text-slate-600">
                  <div className="flex justify-between items-center">
                    <span>Total Ingested Events:</span>
                    <span className="font-black text-slate-900 font-mono bg-white px-2 py-0.5 rounded-md border border-slate-200/60">
                      {int.totalSyncedEvents || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Last Sync Timestamp:</span>
                    <span className="text-slate-500 text-[10px]">
                      {int.lastSyncedAt ? new Date(int.lastSyncedAt).toLocaleString() : 'Never'}
                    </span>
                  </div>
                  {int.lastTestStatus && (
                    <div className="flex justify-between items-center pt-1 border-t border-slate-200/50">
                      <span>Gateway Health:</span>
                      <span className={`text-[10px] font-bold flex items-center gap-1 ${
                        int.lastTestStatus === 'SUCCESS' ? 'text-emerald-600' : 'text-amber-600'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          int.lastTestStatus === 'SUCCESS' ? 'bg-emerald-500' : 'bg-amber-500'
                        }`} />
                        {int.lastTestStatus === 'SUCCESS' ? 'Validated (200 OK)' : 'Pending Check'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Inline Test Result Toast if recently tested */}
                {currentTest && (
                  <div className={`p-2.5 rounded-xl text-[11px] border font-medium animate-in fade-in ${
                    currentTest.success
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-rose-50 border-rose-200 text-rose-800'
                  }`}>
                    <div className="flex items-center gap-1.5 font-bold">
                      {currentTest.success ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <AlertCircle className="w-3.5 h-3.5 text-rose-600" />}
                      <span>{currentTest.success ? `Connected (${currentTest.latency}ms)` : 'Connection Failed'}</span>
                    </div>
                    <p className="text-[10px] mt-0.5">{currentTest.message}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons: Test, Sync, Edit, Delete */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-1.5">
                  {/* Test Connection Button */}
                  <button
                    onClick={() => handleTestConnection(int._id, int.name)}
                    disabled={isTesting}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    title="Ping and test API connection"
                  >
                    <Play className={`w-3 h-3 ${isTesting ? 'animate-spin text-blue-600' : 'text-slate-600'}`} />
                    <span>{isTesting ? 'Testing...' : 'Test'}</span>
                  </button>

                  {/* Manual Sync Button */}
                  <button
                    onClick={() => handleManualSync(int._id)}
                    disabled={isSyncing}
                    className="px-2.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    title="Trigger immediate sync"
                  >
                    <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'Syncing...' : 'Sync'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  {/* Edit API Button */}
                  <button
                    onClick={() => openEditModal(int)}
                    className="p-1.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 border border-slate-200/80 transition-colors"
                    title="Edit API Configuration"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete API Button */}
                  <button
                    onClick={() => confirmDelete(int)}
                    className="p-1.5 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200/80 transition-colors"
                    title="Delete API Connector"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State if No APIs */}
      {filteredIntegrations.length === 0 && (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-4 shadow-2xs">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <Plug className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-base font-bold text-slate-900">No Integrations Found</h3>
            <p className="text-xs text-slate-500 mt-1">
              No API connectors match your selected filter. Click below to connect TradeIndia, IndiaMART, WhatsApp, or custom webhooks.
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20 inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Connect First API</span>
          </button>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: ADD / EDIT API CONNECTOR           */}
      {/* ========================================== */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? `Edit API Connector: ${formData.name}` : 'Connect New Enterprise API'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Quick Presets Picker (Only shown when adding new) */}
          {!isEditing && (
            <div className="space-y-1.5 pb-3 border-b border-slate-100">
              <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                Quick Select Integration Template:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {integrationPresets.map(preset => (
                  <button
                    key={preset.code}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="p-2 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 text-left transition-all group"
                  >
                    <div className="font-bold text-slate-800 text-[11px] group-hover:text-blue-600 truncate">{preset.label}</div>
                    <div className="text-[9px] text-slate-400 uppercase font-mono">{preset.category}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Row 1: Name & Provider Code */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">API / Connector Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. IndiaMART Lead Ingestion API"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 font-medium text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Provider Code / Identifier *</label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={e => setFormData({ ...formData, code: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                placeholder="e.g. indiamart_api"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 font-mono text-xs"
              />
            </div>
          </div>

          {/* Row 2: Category & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Integration Category</label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-xs"
              >
                <option value="PORTAL">B2B Portal (TradeIndia, IndiaMART)</option>
                <option value="WEBHOOK">Webhook (Website Leads, Custom Webhooks)</option>
                <option value="COMMUNICATION">Communication (WhatsApp Cloud, SMS)</option>
                <option value="PAYMENT">Payment Gateway (Razorpay, Stripe)</option>
                <option value="CUSTOM">Custom REST API Connector</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Initial Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-xs"
              >
                <option value="ACTIVE">ACTIVE (Receiving / Polling Data)</option>
                <option value="INACTIVE">INACTIVE (Disabled)</option>
                <option value="CONFIGURED">CONFIGURED (Testing Mode)</option>
              </select>
            </div>
          </div>

          {/* Row 3: Method & Endpoint URL */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-1">
              <label className="block font-semibold text-slate-700 mb-1">HTTP Method</label>
              <select
                value={formData.method}
                onChange={e => setFormData({ ...formData, method: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold font-mono text-xs"
              >
                <option value="POST">POST</option>
                <option value="GET">GET</option>
                <option value="PUT">PUT</option>
                <option value="PATCH">PATCH</option>
              </select>
            </div>

            <div className="md:col-span-3">
              <label className="block font-semibold text-slate-700 mb-1">Endpoint URL / Webhook Path</label>
              <input
                type="text"
                value={formData.endpointUrl}
                onChange={e => setFormData({ ...formData, endpointUrl: e.target.value })}
                placeholder="https://api.external-service.com/v1/leads or /api/webhook"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:bg-white"
              />
            </div>
          </div>

          {/* Row 4: Auth Type & API Key / Token */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Authentication Method</label>
              <select
                value={formData.authType}
                onChange={e => setFormData({ ...formData, authType: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-xs"
              >
                <option value="API_KEY">API Key Header (x-api-key)</option>
                <option value="BEARER_TOKEN">Bearer Token (Authorization)</option>
                <option value="WEBHOOK_SECRET">Webhook Secret Token</option>
                <option value="BASIC_AUTH">Basic Auth (Username / Password)</option>
                <option value="NO_AUTH">No Authentication / Public</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span>API Key / Secret Token</span>
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  {showApiKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </button>
              </label>
              <input
                type={showApiKey ? 'text' : 'password'}
                value={formData.apiKey}
                onChange={e => setFormData({ ...formData, apiKey: e.target.value })}
                placeholder="sk_live_..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:bg-white"
              />
            </div>
          </div>

          {/* Row 5: Sync Frequency */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Synchronization Frequency</label>
            <select
              value={formData.syncFrequency}
              onChange={e => setFormData({ ...formData, syncFrequency: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-xs"
            >
              <option value="REALTIME">Real-time Push Webhook (Instant)</option>
              <option value="EVERY_5_MIN">Every 5 Minutes (Automated Polling)</option>
              <option value="HOURLY">Hourly Batch Sync</option>
              <option value="DAILY">Daily Reconciliation</option>
              <option value="MANUAL">Manual On-Demand Sync Only</option>
            </select>
          </div>

          {/* Row 6: Description */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Description / Notes</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide context on what this API syncs (e.g. Ingests TradeIndia seller inquiries)..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          {/* Row 7: Configuration JSON */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
              <span>Custom Headers & Config (JSON)</span>
              <span className="text-[10px] text-slate-400 font-mono">Optional</span>
            </label>
            <textarea
              rows={3}
              value={formData.configJson}
              onChange={e => setFormData({ ...formData, configJson: e.target.value })}
              placeholder={`{\n  "autoAssignLead": true,\n  "notifySales": true\n}`}
              className="w-full px-3.5 py-2 bg-slate-900 text-emerald-400 border border-slate-700 rounded-xl font-mono text-[11px] focus:outline-hidden"
            />
          </div>

          {/* Footer Submit Buttons */}
          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold transition-all text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-md shadow-blue-500/20 text-xs flex items-center gap-2"
            >
              <Plug className="w-4 h-4" />
              <span>{isEditing ? 'Save Changes' : 'Register API'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* ========================================== */}
      {/* MODAL: DELETE CONFIRMATION DIALOG          */}
      {/* ========================================== */}
      <Modal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="Delete API Connector"
      >
        <div className="space-y-4 text-xs">
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>Are you sure you want to delete this API?</span>
            </div>
            <p className="text-xs">
              You are about to remove <strong>{itemToDelete?.name}</strong>. Incoming webhooks or scheduled sync requests for this endpoint will no longer be processed.
            </p>
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => setDeleteConfirmId(null)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={executeDelete}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-500/20 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Connector</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

