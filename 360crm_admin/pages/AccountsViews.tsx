import React, { useState, useEffect } from 'react';
import { api } from '@/src/services/api';
import { useAuth } from '@/src/context/AuthContext';
import { Invoice, Payment, Customer } from '@/src/types';
import {
  PageHeader,
  StatusBadge,
  Modal,
  exportToCSV
} from '@/src/components/common/UIComponents';
import {
  Mail,
  CreditCard,
  Receipt,
  Plus,
  Search,
  Download,
  CheckCircle2,
  DollarSign,
  TrendingDown,
  Clock,
  ArrowUpRight
} from 'lucide-react';

// ==========================================
// 1. INVOICES VIEW
// ==========================================
export const InvoicesView: React.FC = () => {
  const { hasPermission } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [items, setItems] = useState<any[]>([
    { productId: 'prod_valv', productName: 'Stainless Steel Industrial Valve 2-inch', quantity: 5, unitPrice: 12500, taxPercent: 18 }
  ]);

  const fetchInvoices = async () => {
    const res = await api.get('/invoices');
    if (res.success && res.data) setInvoices(res.data);
    const custRes = await api.get('/customers');
    if (custRes.success && custRes.data) setCustomers(custRes.data);
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find(c => c._id === selectedCustomerId);
    if (!cust) return;

    const res = await api.post('/invoices', {
      customerId: cust._id,
      customerName: cust.companyName || cust.name,
      dueDate,
      items
    });

    if (res.success) {
      setIsModalOpen(false);
      fetchInvoices();
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="Tax Invoices & Billing"
        subtitle="Manage GST tax invoices, customer payment tracking and accounts receivables"
        actionText="Generate Invoice"
        actionIcon={Plus}
        actionPermission="invoices.create"
        onAction={() => setIsModalOpen(true)}
        secondaryAction={
          <button
            onClick={() => exportToCSV('360CRM_Invoices', invoices)}
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
                <th className="px-6 py-3.5">Invoice #</th>
                <th className="px-6 py-3.5">Customer</th>
                <th className="px-6 py-3.5">Invoice Date</th>
                <th className="px-6 py-3.5">Due Date</th>
                <th className="px-6 py-3.5">Grand Total</th>
                <th className="px-6 py-3.5">Paid Amount</th>
                <th className="px-6 py-3.5">Balance Due</th>
                <th className="px-6 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {invoices.map(inv => (
                <tr key={inv._id} className="hover:bg-slate-50/70">
                  <td className="px-6 py-4 font-bold text-blue-600 font-mono">{inv.invoiceNumber}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">{inv.customerName}</td>
                  <td className="px-6 py-4 text-slate-500">{inv.invoiceDate}</td>
                  <td className="px-6 py-4 text-slate-500">{inv.dueDate}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">₹{inv.grandTotal.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 font-semibold text-emerald-600">₹{inv.paidAmount.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 font-bold text-rose-600">₹{inv.dueAmount.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4"><StatusBadge status={inv.paymentStatus} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Tax Invoice"
        subtitle="Generate GST compliant commercial invoice"
      >
        <form onSubmit={handleCreateInvoice} className="space-y-4 text-xs">
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

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Payment Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
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
              className="px-5 py-2 bg-blue-600 text-white rounded-xl font-semibold shadow-xs"
            >
              Issue Invoice
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

// ==========================================
// 2. PAYMENTS VIEW
// ==========================================
export const PaymentsView: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    invoiceId: '',
    amount: 50000,
    paymentMethod: 'BANK',
    referenceNumber: '',
    paymentDate: new Date().toISOString().split('T')[0],
    notes: 'Online RTGS Transfer'
  });

  const fetchData = async () => {
    const pRes = await api.get('/payments');
    if (pRes.success) setPayments(pRes.data);
    const iRes = await api.get('/invoices');
    if (iRes.success) setInvoices(iRes.data.filter((i: any) => i.dueAmount > 0));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const inv = invoices.find(i => i._id === formData.invoiceId);
    if (!inv) return;

    const res = await api.post('/payments', {
      ...formData,
      customerId: inv.customerId,
      customerName: inv.customerName,
      invoiceNumber: inv.invoiceNumber
    });

    if (res.success) {
      alert(res.message);
      setIsModalOpen(false);
      fetchData();
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="Payments Received"
        subtitle="Record incoming remittances (Bank, UPI, Cash, Cheque) and auto-reconcile invoices"
        actionText="Record Payment"
        actionIcon={Plus}
        actionPermission="payments.create"
        onAction={() => setIsModalOpen(true)}
      />

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-semibold uppercase">
              <tr>
                <th className="px-6 py-3.5">Payment #</th>
                <th className="px-6 py-3.5">Customer</th>
                <th className="px-6 py-3.5">Invoice #</th>
                <th className="px-6 py-3.5">Amount Received</th>
                <th className="px-6 py-3.5">Mode</th>
                <th className="px-6 py-3.5">Reference #</th>
                <th className="px-6 py-3.5">Received Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {payments.map(pay => (
                <tr key={pay._id} className="hover:bg-slate-50/70">
                  <td className="px-6 py-4 font-bold text-blue-600 font-mono">{pay.paymentNumber}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">{pay.customerName}</td>
                  <td className="px-6 py-4 font-mono text-slate-600">{pay.invoiceNumber || 'Direct Deposit'}</td>
                  <td className="px-6 py-4 font-bold text-emerald-600 text-sm">₹{pay.amount.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 bg-slate-100 rounded-md font-semibold text-[11px]">
                      {pay.paymentMethod}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-500">{pay.referenceNumber || 'N/A'}</td>
                  <td className="px-6 py-4 text-slate-500">{pay.paymentDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Record Payment Receipt"
        subtitle="Apply remittance towards outstanding customer invoice"
      >
        <form onSubmit={handleRecordPayment} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Select Outstanding Invoice *</label>
            <select
              required
              value={formData.invoiceId}
              onChange={e => {
                const inv = invoices.find(i => i._id === e.target.value);
                setFormData({
                  ...formData,
                  invoiceId: e.target.value,
                  amount: inv ? inv.dueAmount : 0
                });
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            >
              <option value="">Choose invoice...</option>
              {invoices.map(i => (
                <option key={i._id} value={i._id}>
                  {i.invoiceNumber} - {i.customerName} (Due: ₹{i.dueAmount.toLocaleString('en-IN')})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Payment Amount (₹) *</label>
              <input
                type="number"
                required
                value={formData.amount}
                onChange={e => setFormData({ ...formData, amount: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
              <select
                value={formData.paymentMethod}
                onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="BANK">Bank Transfer (NEFT/RTGS)</option>
                <option value="UPI">UPI / QR Code</option>
                <option value="CHEQUE">Cheque</option>
                <option value="CASH">Cash</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">UTR / Cheque Ref #</label>
              <input
                type="text"
                value={formData.referenceNumber}
                onChange={e => setFormData({ ...formData, referenceNumber: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                placeholder="UTR202604081029"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Payment Date</label>
              <input
                type="date"
                value={formData.paymentDate}
                onChange={e => setFormData({ ...formData, paymentDate: e.target.value })}
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
              className="px-5 py-2 bg-emerald-600 text-white rounded-xl font-semibold shadow-xs"
            >
              Confirm Receipt
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

// ==========================================
// 3. RECEIVABLES VIEW
// ==========================================
export const ReceivablesView: React.FC = () => {
  const [data, setData] = useState<any>(null);

  const fetchReceivables = async () => {
    const res = await api.get('/receivables');
    if (res.success && res.data) setData(res.data);
  };

  useEffect(() => {
    fetchReceivables();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="Accounts Receivable (Debtors)"
        subtitle="Monitor customer outstanding ledger balances and overdue collections"
      />

      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Outstanding Invoiced Receivables</p>
          <h2 className="text-3xl font-black text-white mt-1">₹{(data?.totalReceivable || 0).toLocaleString('en-IN')}</h2>
        </div>
        <Clock className="w-8 h-8 text-rose-400" />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-semibold uppercase">
              <tr>
                <th className="px-6 py-3.5">Customer Name</th>
                <th className="px-6 py-3.5">Pending Invoices</th>
                <th className="px-6 py-3.5">Total Outstanding Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {data?.customers?.map((c: any) => (
                <tr key={c.customerId} className="hover:bg-slate-50/70">
                  <td className="px-6 py-4 font-bold text-slate-900">{c.customerName}</td>
                  <td className="px-6 py-4">{c.totalInvoices} invoice(s)</td>
                  <td className="px-6 py-4 font-bold text-rose-600 text-sm">₹{c.totalDue.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
