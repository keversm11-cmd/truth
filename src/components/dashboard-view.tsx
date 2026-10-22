'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Customer = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  createdAt: string;
};

type Invoice = {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customer: Customer;
  total: number;
  dueDate: string;
  status: 'PENDING' | 'PAID' | 'OVERDUE';
  notes: string | null;
  createdAt: string;
};

export function DashboardView({ user }: { user: { id: string; email: string } }) {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [summary, setSummary] = useState({
    customers: 0,
    invoices: 0,
    totalRevenue: 0,
    outstanding: 0,
    pendingCount: 0,
  });
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [invoiceCustomerId, setInvoiceCustomerId] = useState('');
  const [invoiceTotal, setInvoiceTotal] = useState('');
  const [invoiceDueDate, setInvoiceDueDate] = useState('');
  const [invoiceNotes, setInvoiceNotes] = useState('');
  const [status, setStatus] = useState<'PENDING' | 'PAID' | 'OVERDUE'>('PENDING');
  const [error, setError] = useState('');

  async function loadDashboard() {
    const response = await fetch('/api/dashboard');

    if (!response.ok) {
      router.push('/login');
      return;
    }

    const data = await response.json();
    setCustomers(data.customers ?? []);
    setInvoices(data.invoices ?? []);
    setSummary(data.summary ?? {
      customers: 0,
      invoices: 0,
      totalRevenue: 0,
      outstanding: 0,
      pendingCount: 0,
    });

    if (data.customers?.length) {
      setInvoiceCustomerId(data.customers[0].id);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  async function handleCreateCustomer(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    const response = await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.message || 'Could not create customer');
      return;
    }

    setCustomerName('');
    setCustomerEmail('');
    setCustomerPhone('');
    loadDashboard();
  }

  async function handleCreateInvoice(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    const response = await fetch('/api/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerId: invoiceCustomerId,
        total: Number(invoiceTotal),
        dueDate: invoiceDueDate,
        status,
        notes: invoiceNotes,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.message || 'Could not create invoice');
      return;
    }

    setInvoiceTotal('');
    setInvoiceDueDate('');
    setInvoiceNotes('');
    setStatus('PENDING');
    loadDashboard();
  }

  async function handleLogout() {
    await fetch('/api/auth/login', { method: 'DELETE' });
    router.push('/login');
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-violet-300">Truth</p>
            <h1 className="mt-2 text-3xl font-bold">Payment dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="rounded-full border border-slate-700 px-3 py-1 text-sm text-slate-200">{user.email}</span>
            <button
              onClick={handleLogout}
              className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:border-slate-500"
            >
              Log out
            </button>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-4">
          <MetricCard label="Customers" value={summary.customers} tone="violet" />
          <MetricCard label="Invoices" value={summary.invoices} tone="sky" />
          <MetricCard label="Collected" value={`$${summary.totalRevenue.toFixed(2)}`} tone="green" />
          <MetricCard label="Outstanding" value={`$${summary.outstanding.toFixed(2)}`} tone="amber" />
        </section>

        {error ? <div className="mt-6 rounded-xl border border-rose-500/50 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div> : null}

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="mb-5 text-xl font-semibold">Add customer</h2>
            <form onSubmit={handleCreateCustomer} className="space-y-4">
              <input
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-violet-500"
                placeholder="Customer name"
                required
              />
              <input
                type="email"
                value={customerEmail}
                onChange={(event) => setCustomerEmail(event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-violet-500"
                placeholder="Email address"
              />
              <input
                value={customerPhone}
                onChange={(event) => setCustomerPhone(event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-violet-500"
                placeholder="Phone number"
              />
              <button className="w-full rounded-xl bg-violet-600 px-4 py-3 font-medium text-white transition hover:bg-violet-500">
                Save customer
              </button>
            </form>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="mb-5 text-xl font-semibold">Create invoice</h2>
            <form onSubmit={handleCreateInvoice} className="space-y-4">
              <select
                value={invoiceCustomerId}
                onChange={(event) => setInvoiceCustomerId(event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-violet-500"
                required
              >
                <option value="">Select customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>{customer.name}</option>
                ))}
              </select>

              <input
                type="number"
                min="0"
                step="0.01"
                value={invoiceTotal}
                onChange={(event) => setInvoiceTotal(event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-violet-500"
                placeholder="Total amount"
                required
              />

              <input
                type="date"
                value={invoiceDueDate}
                onChange={(event) => setInvoiceDueDate(event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-violet-500"
                required
              />

              <select
                value={status}
                onChange={(event) => setStatus(event.target.value as 'PENDING' | 'PAID' | 'OVERDUE')}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-violet-500"
              >
                <option value="PENDING">Pending</option>
                <option value="PAID">Paid</option>
                <option value="OVERDUE">Overdue</option>
              </select>

              <textarea
                value={invoiceNotes}
                onChange={(event) => setInvoiceNotes(event.target.value)}
                rows={3}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-violet-500"
                placeholder="Notes"
              />

              <button className="w-full rounded-xl bg-emerald-600 px-4 py-3 font-medium text-white transition hover:bg-emerald-500">
                Create invoice
              </button>
            </form>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent invoices</h2>
            <span className="text-sm text-slate-400">{summary.pendingCount} pending</span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-slate-400">
                <tr>
                  <th className="pb-3 pr-4">Invoice</th>
                  <th className="pb-3 pr-4">Customer</th>
                  <th className="pb-3 pr-4">Due date</th>
                  <th className="pb-3 pr-4">Total</th>
                  <th className="pb-3 pr-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-t border-slate-800 text-slate-200">
                    <td className="py-3 pr-4 font-medium">{invoice.invoiceNumber}</td>
                    <td className="py-3 pr-4">{invoice.customer?.name || 'N/A'}</td>
                    <td className="py-3 pr-4">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                    <td className="py-3 pr-4">${invoice.total.toFixed(2)}</td>
                    <td className="py-3 pr-4">
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusStyle(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

function MetricCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string | number;
  tone: 'violet' | 'sky' | 'green' | 'amber';
}) {
  const palette = {
    violet: 'bg-violet-500/10 text-violet-200 border-violet-500/30',
    sky: 'bg-sky-500/10 text-sky-200 border-sky-500/30',
    green: 'bg-emerald-500/10 text-emerald-200 border-emerald-500/30',
    amber: 'bg-amber-500/10 text-amber-200 border-amber-500/30',
  };

  return (
    <div className={`rounded-2xl border p-5 ${palette[tone]}`}>
      <p className="text-sm text-slate-300">{label}</p>
      <p className="mt-3 text-3xl font-bold">{value}</p>
    </div>
  );
}

function statusStyle(status: string) {
  switch (status) {
    case 'PAID':
      return 'bg-emerald-500/10 text-emerald-200';
    case 'OVERDUE':
      return 'bg-rose-500/10 text-rose-200';
    default:
      return 'bg-amber-500/10 text-amber-200';
  }
}
