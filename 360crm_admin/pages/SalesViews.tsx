import React, { useState, useEffect } from 'react';
import { api } from '@/src/services/api';
import { useAuth } from '@/src/context/AuthContext';
import { Lead, Customer, Quotation, SalesOrder } from '@/src/types';
import {
  PageHeader,
  StatusBadge,
  Modal,
  EmptyState,
  exportToCSV
} from '@/src/components/common/UIComponents';
import {
  Target,
  Users,
  ShoppingCart,
  ShoppingBag,
  Zap,
  Plus,
  Search,
  CheckCircle2,
  Trash2,
  Edit2,
  Eye,
  ArrowRight,
  Phone,
  Mail,
  Building,
  Calendar,
  DollarSign,
  Download,
  AlertCircle
} from 'lucide-react';

// ==========================================
// 1. LEADS VIEW
// ==========================================
export const LeadsView: React.FC = () => {
  const { hasPermission } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    email: '',
    phone: '',
    source: 'Website',
    status: 'NEW',
    assignedTo: 'Vikram Mehta',
    estimatedValue: 100000,
    notes: '',
  });

  const fetchLeads = async () => {
    setLoading(true);
    const res = await api.get('/leads', { search, status: statusFilter });
    if (res.success && res.data) setLeads(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLeads();
  };

  const handleSaveLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLead) {
      const res = await api.put(`/leads/${editingLead._id}`, formData);
      if (res.success) {
        setEditingLead(null);
        setIsCreateOpen(false);
        fetchLeads();
      }
    } else {
      const res = await api.post('/leads', formData);
      if (res.success) {
        setIsCreateOpen(false);
        fetchLeads();
      }
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (confirm('Are you sure you want to delete this lead?')) {
      await api.delete(`/leads/${id}`);
      fetchLeads();
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="Sales Leads"
        subtitle="Capture, qualify and convert inbound & outbound prospects"
        actionText="Add New Lead"
        actionIcon={Plus}
        actionPermission="leads.create"
        onAction={() => {
          setEditingLead(null);
          setFormData({
            name: '',
            companyName: '',
            email: '',
            phone: '',
            source: 'Website',
            status: 'NEW',
            assignedTo: 'Vikram Mehta',
            estimatedValue: 100000,
            notes: '',
          });
          setIsCreateOpen(true);
        }}
        secondaryAction={
          <button
            onClick={() => exportToCSV('360CRM_Leads', leads)}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl shadow-2xs"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Export CSV
          </button>
        }
      />

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full sm:w-80">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by prospect name, company or phone..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </form>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:bg-white"
          >
            <option value="">All Statuses</option>
            <option value="NEW">NEW</option>
            <option value="CONTACTED">CONTACTED</option>
            <option value="QUALIFIED">QUALIFIED</option>
            <option value="PROPOSAL">PROPOSAL</option>
            <option value="WON">WON</option>
            <option value="LOST">LOST</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {leads.length === 0 ? (
          <EmptyState
            icon={Target}
            title="No leads found"
            description="Create your first prospect lead or capture from TradeIndia / Website automatically."
            actionText="Create Lead"
            onAction={() => setIsCreateOpen(true)}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Prospect & Company</th>
                  <th className="px-6 py-3.5">Contact Info</th>
                  <th className="px-6 py-3.5">Source</th>
                  <th className="px-6 py-3.5">Estimated Value</th>
                  <th className="px-6 py-3.5">Assigned To</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {leads.map(lead => (
                  <tr key={lead._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{lead.name}</div>
                      <div className="text-[11px] text-slate-400 font-normal">{lead.companyName || 'Individual Prospect'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div>{lead.phone}</div>
                      <div className="text-[11px] text-slate-400 font-normal">{lead.email || 'No email'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] bg-slate-100 text-slate-700 font-medium">
                        {lead.source}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      ₹{lead.estimatedValue.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {lead.assignedTo || 'Unassigned'}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {hasPermission('leads.update') && (
                          <button
                            onClick={() => {
                              setEditingLead(lead);
                              setFormData({
                                name: lead.name,
                                companyName: lead.companyName || '',
                                email: lead.email || '',
                                phone: lead.phone,
                                source: lead.source,
                                status: lead.status,
                                assignedTo: lead.assignedTo || 'Vikram Mehta',
                                estimatedValue: lead.estimatedValue,
                                notes: lead.notes || '',
                              });
                              setIsCreateOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                            title="Edit Lead"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                        {hasPermission('leads.delete') && (
                          <button
                            onClick={() => handleDeleteLead(lead._id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                            title="Delete Lead"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title={editingLead ? 'Edit Lead' : 'Create New Lead'}
        subtitle="Fill in customer inquiry and qualification details"
      >
        <form onSubmit={handleSaveLead} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Contact Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                placeholder="e.g. Rahul Sharma"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Company Name</label>
              <input
                type="text"
                value={formData.companyName}
                onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                placeholder="e.g. Apex Engineering Ltd"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mobile / Phone *</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                placeholder="+91 98765 43210"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                placeholder="rahul@apex.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Lead Source</label>
              <select
                value={formData.source}
                onChange={e => setFormData({ ...formData, source: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
              >
                <option value="Website">Website</option>
                <option value="TradeIndia">TradeIndia</option>
                <option value="IndiaMART">IndiaMART</option>
                <option value="Referral">Referral</option>
                <option value="Direct Call">Direct Call</option>
                <option value="WhatsApp">WhatsApp</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
              >
                <option value="NEW">NEW</option>
                <option value="CONTACTED">CONTACTED</option>
                <option value="QUALIFIED">QUALIFIED</option>
                <option value="PROPOSAL">PROPOSAL</option>
                <option value="NEGOTIATION">NEGOTIATION</option>
                <option value="WON">WON</option>
                <option value="LOST">LOST</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Estimated Value (₹)</label>
              <input
                type="number"
                value={formData.estimatedValue}
                onChange={e => setFormData({ ...formData, estimatedValue: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Requirement Notes</label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
              placeholder="Products inquired, delivery timeline, specific requirements..."
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-xs"
            >
              {editingLead ? 'Update Lead' : 'Save Lead'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

// ==========================================
// 2. CUSTOMERS VIEW
// ==========================================
export const CustomersView: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    email: '',
    phone: '',
    gstNumber: '',
    city: 'Ahmedabad',
    state: 'Gujarat'
  });

  const fetchCustomers = async () => {
    setLoading(true);
    const res = await api.get('/customers');
    if (res.success && res.data) setCustomers(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await api.post('/customers', formData);
    if (res.success) {
      setIsModalOpen(false);
      fetchCustomers();
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="Customers"
        subtitle="Manage client relationships, GST information & billing history"
        actionText="Add Customer"
        actionIcon={Plus}
        actionPermission="customers.create"
        onAction={() => setIsModalOpen(true)}
        secondaryAction={
          <button
            onClick={() => exportToCSV('360CRM_Customers', customers)}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl shadow-2xs"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Export CSV
          </button>
        }
      />

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Company & Contact</th>
                <th className="px-6 py-3.5">Contact Details</th>
                <th className="px-6 py-3.5">GST Number</th>
                <th className="px-6 py-3.5">Location</th>
                <th className="px-6 py-3.5">Total Orders</th>
                <th className="px-6 py-3.5">Total Invoiced</th>
                <th className="px-6 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {customers.map(c => (
                <tr key={c._id} className="hover:bg-slate-50/70">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{c.companyName}</div>
                    <div className="text-[11px] text-slate-400 font-normal">{c.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div>{c.phone}</div>
                    <div className="text-[11px] text-slate-400 font-normal">{c.email}</div>
                  </td>
                  <td className="px-6 py-4 font-mono text-[11px] text-slate-600">
                    {c.gstNumber || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {c.address?.city}, {c.address?.state}
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    {c.totalOrdersCount}
                  </td>
                  <td className="px-6 py-4 font-bold text-emerald-600">
                    ₹{c.totalSpent.toLocaleString('en-IN')}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={c.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Customer"
        subtitle="Record client organization profile & billing coordinates"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Company / Organization *</label>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Contact Person *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone *</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">GSTIN Number</label>
              <input
                type="text"
                value={formData.gstNumber}
                onChange={e => setFormData({ ...formData, gstNumber: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl uppercase font-mono"
                placeholder="24ABCDE1234F1Z5"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={e => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">State</label>
              <input
                type="text"
                value={formData.state}
                onChange={e => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white rounded-xl font-semibold"
            >
              Save Customer
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

// ==========================================
// 3. QUOTATIONS VIEW
// ==========================================
export const QuotationsView: React.FC<{ onNavigate?: (view: string) => void }> = () => {
  const { hasPermission } = useAuth();
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Quote form
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [items, setItems] = useState<any[]>([
    { productId: '', quantity: 1, unitPrice: 0, taxPercent: 18 }
  ]);

  const fetchQuotes = async () => {
    const res = await api.get('/quotations');
    if (res.success && res.data) setQuotations(res.data);
    const custRes = await api.get('/customers');
    if (custRes.success && custRes.data) setCustomers(custRes.data);
    const prodRes = await api.get('/products');
    if (prodRes.success && prodRes.data) setProducts(prodRes.data);
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const handleAddItem = () => {
    setItems([...items, { productId: '', quantity: 1, unitPrice: 0, taxPercent: 18 }]);
  };

  const handleProductSelect = (idx: number, prodId: string) => {
    const p = products.find(prod => prod._id === prodId);
    const updated = [...items];
    updated[idx].productId = prodId;
    updated[idx].productName = p?.name || '';
    updated[idx].sku = p?.sku || '';
    updated[idx].unitPrice = p?.sellingPrice || 0;
    setItems(updated);
  };

  const handleCreateQuotation = async (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find(c => c._id === selectedCustomerId);
    if (!cust) return;

    const res = await api.post('/quotations', {
      customerId: cust._id,
      customerName: cust.companyName || cust.name,
      items: items.filter(i => i.productId)
    });

    if (res.success) {
      setIsModalOpen(false);
      fetchQuotes();
    }
  };

  const handleConvert = async (quoteId: string) => {
    if (confirm('Convert this Quotation directly into a confirmed Sales Order?')) {
      const res = await api.post(`/quotations/${quoteId}/convert`);
      if (res.success) {
        alert(res.message);
        fetchQuotes();
      }
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="Quotations & Estimates"
        subtitle="Prepare price quotes and convert them to confirmed sales orders"
        actionText="Create Quotation"
        actionIcon={Plus}
        actionPermission="quotations.create"
        onAction={() => setIsModalOpen(true)}
      />

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-semibold uppercase">
              <tr>
                <th className="px-6 py-3.5">Quotation #</th>
                <th className="px-6 py-3.5">Customer</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5">Items Count</th>
                <th className="px-6 py-3.5">Grand Total</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {quotations.map(q => (
                <tr key={q._id} className="hover:bg-slate-50/70">
                  <td className="px-6 py-4 font-bold text-blue-600 font-mono">
                    {q.quotationNumber}
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    {q.customerName}
                  </td>
                  <td className="px-6 py-4 text-slate-500">{q.date}</td>
                  <td className="px-6 py-4">{q.items?.length || 0} line items</td>
                  <td className="px-6 py-4 font-bold text-slate-900">
                    ₹{q.grandTotal.toLocaleString('en-IN')}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={q.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    {q.status !== 'CONVERTED' && hasPermission('quotations.convert') && (
                      <button
                        onClick={() => handleConvert(q._id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-lg text-xs font-semibold transition-colors"
                      >
                        Convert to Order →
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Quotation"
        subtitle="Select customer and add line items with automatic GST calculation"
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleCreateQuotation} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Select Customer *</label>
            <select
              required
              value={selectedCustomerId}
              onChange={e => setSelectedCustomerId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            >
              <option value="">Choose customer...</option>
              {customers.map(c => (
                <option key={c._id} value={c._id}>
                  {c.companyName} ({c.name})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-700">Line Items</label>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-blue-600 font-semibold hover:underline"
              >
                + Add Item
              </button>
            </div>

            {items.map((it, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="col-span-6">
                  <select
                    required
                    value={it.productId}
                    onChange={e => handleProductSelect(idx, e.target.value)}
                    className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="">Select Product...</option>
                    {products.map(p => (
                      <option key={p._id} value={p._id}>
                        {p.name} (SKU: {p.sku}) - ₹{p.sellingPrice}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    min="1"
                    value={it.quantity}
                    onChange={e => {
                      const updated = [...items];
                      updated[idx].quantity = Number(e.target.value);
                      setItems(updated);
                    }}
                    placeholder="Qty"
                    className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    value={it.unitPrice}
                    onChange={e => {
                      const updated = [...items];
                      updated[idx].unitPrice = Number(e.target.value);
                      setItems(updated);
                    }}
                    placeholder="Price"
                    className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div className="col-span-2 text-right pt-2 font-bold text-slate-900">
                  ₹{(Number(it.quantity) * Number(it.unitPrice) * 1.18).toFixed(0)}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white rounded-xl font-semibold"
            >
              Generate Quotation
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

// ==========================================
// 4. SALES ORDERS VIEW
// ==========================================
export const SalesOrdersView: React.FC = () => {
  const { hasPermission } = useAuth();
  const [orders, setOrders] = useState<SalesOrder[]>([]);

  const fetchOrders = async () => {
    const res = await api.get('/sales-orders');
    if (res.success && res.data) setOrders(res.data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleApprove = async (id: string) => {
    if (confirm('Approve this Sales Order for dispatch & billing?')) {
      const res = await api.patch(`/sales-orders/${id}/approve`);
      if (res.success) {
        alert(res.message);
        fetchOrders();
      }
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="Sales Orders"
        subtitle="Confirmed customer orders pending fulfillment & invoice generation"
        secondaryAction={
          <button
            onClick={() => exportToCSV('360CRM_Sales_Orders', orders)}
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
                <th className="px-6 py-3.5">Order Number</th>
                <th className="px-6 py-3.5">Customer</th>
                <th className="px-6 py-3.5">Order Date</th>
                <th className="px-6 py-3.5">Expected Delivery</th>
                <th className="px-6 py-3.5">Total Amount</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {orders.map(ord => (
                <tr key={ord._id} className="hover:bg-slate-50/70">
                  <td className="px-6 py-4 font-bold text-blue-600 font-mono">{ord.salesOrderNumber}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">{ord.customerName}</td>
                  <td className="px-6 py-4 text-slate-500">{ord.orderDate}</td>
                  <td className="px-6 py-4 text-slate-500">{ord.expectedDelivery}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">₹{ord.grandTotal.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4"><StatusBadge status={ord.status} /></td>
                  <td className="px-6 py-4 text-right">
                    {ord.status === 'PENDING' && hasPermission('sales_orders.approve') && (
                      <button
                        onClick={() => handleApprove(ord._id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                      >
                        Approve Order
                      </button>
                    )}
                  </td>
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
// 5. FOLLOW-UPS VIEW
// ==========================================
export const FollowUpsView: React.FC = () => {
  const [followUps, setFollowUps] = useState<any[]>([]);

  const fetchFollowUps = async () => {
    const res = await api.get('/follow-ups');
    if (res.success && res.data) setFollowUps(res.data);
  };

  useEffect(() => {
    fetchFollowUps();
  }, []);

  const handleComplete = async (id: string) => {
    const notes = prompt('Enter follow-up outcome notes:');
    if (notes !== null) {
      await api.patch(`/follow-ups/${id}/complete`, { outcomeNotes: notes });
      fetchFollowUps();
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="Follow-ups & CRM Pipeline Activity"
        subtitle="Track upcoming prospect interactions, scheduled calls and customer check-ins"
      />

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-semibold uppercase">
              <tr>
                <th className="px-6 py-3.5">Lead / Customer</th>
                <th className="px-6 py-3.5">Interaction Type</th>
                <th className="px-6 py-3.5">Scheduled Date & Time</th>
                <th className="px-6 py-3.5">Assigned Rep</th>
                <th className="px-6 py-3.5">Notes</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {followUps.map(f => (
                <tr key={f._id} className="hover:bg-slate-50/70">
                  <td className="px-6 py-4 font-bold text-slate-900">{f.leadName}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 bg-blue-50 text-blue-700 font-semibold rounded-md">
                      {f.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{f.scheduledDate} {f.scheduledTime}</td>
                  <td className="px-6 py-4 text-slate-600">{f.assignedTo}</td>
                  <td className="px-6 py-4 text-slate-500 max-w-xs truncate">{f.notes}</td>
                  <td className="px-6 py-4"><StatusBadge status={f.status} /></td>
                  <td className="px-6 py-4 text-right">
                    {f.status === 'PENDING' && (
                      <button
                        onClick={() => handleComplete(f._id)}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-black text-white rounded-lg text-xs font-semibold"
                      >
                        Mark Done
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
