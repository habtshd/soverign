import React, { useEffect, useState } from 'react';
import { api } from '../../api/client.js';
import { DollarSign, FileText, Plus, CheckCircle, ArrowDownRight, ArrowUpRight } from 'lucide-react';

export const FinanceDashboardView: React.FC = () => {
  const [overview, setOverview] = useState<any | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  // Expense form
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadFinance();
  }, []);

  const loadFinance = async () => {
    const [oRes, cRes] = await Promise.all([
      api.finance.getOverview(),
      api.finance.getCategories(),
    ]);

    if (oRes.success && oRes.data) setOverview(oRes.data);
    if (cRes.success && cRes.data) {
      const expenseCats = cRes.data.filter((c: any) => c.type === 'EXPENSE');
      setCategories(expenseCats);
      if (expenseCats.length > 0) setCategoryId(expenseCats[0].id);
    }
  };

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.finance.recordExpense({
      title,
      amount: Number(amount),
      categoryId,
      notes,
    });
    setShowExpenseModal(false);
    setTitle('');
    setAmount('');
    setNotes('');
    loadFinance();
  };

  if (!overview) {
    return <div style={{ color: 'var(--text-muted)', padding: '40px', textAlign: 'center' }}>Loading treasury records...</div>;
  }

  const { metrics, invoices, recentExpenses, payments } = overview;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Treasury & Financial Ledger</h1>
          <p className="page-subtitle">
            Autonomous accounting, multi-tier dues invoicing, and verified operational expenditures.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowExpenseModal(true)}>
          <Plus size={16} /> Record Operational Expense
        </button>
      </div>

      {/* Metrics Row */}
      <div className="metrics-grid">
        <div className="stat-card">
          <div>
            <div className="stat-label">Net Sovereign Reserves</div>
            <div className="stat-value" style={{ color: 'var(--text-gold)' }}>
              ${metrics?.netBalance?.toLocaleString() || 0}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#10b981' }}>Current Treasury Balance</div>
          </div>
          <div className="stat-icon-wrapper">
            <DollarSign size={22} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Total Inflow / Dues</div>
            <div className="stat-value" style={{ color: '#10b981' }}>
              ${metrics?.totalIncome?.toLocaleString() || 0}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>From Dues & Summit Tickets</div>
          </div>
          <div className="stat-icon-wrapper">
            <ArrowUpRight size={22} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Operational Outflow</div>
            <div className="stat-value" style={{ color: '#f87171' }}>
              ${metrics?.totalExpenses?.toLocaleString() || 0}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Facilities & Expeditions</div>
          </div>
          <div className="stat-icon-wrapper">
            <ArrowDownRight size={22} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Pending Invoices</div>
            <div className="stat-value">{metrics?.pendingInvoicesCount || 0}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Awaiting settlement</div>
          </div>
          <div className="stat-icon-wrapper">
            <FileText size={22} />
          </div>
        </div>
      </div>

      {/* Tables: Invoices & Expenses */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '24px' }}>
        {/* Member Invoices */}
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: '14px' }}>
            <FileText size={18} color="var(--gold-400)" />
            Member Dues & Summit Invoices
          </h3>

          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Brother</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices?.map((inv: any) => (
                  <tr key={inv.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-gold)', fontWeight: 600 }}>
                      {inv.invoiceNumber}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#fff' }}>
                        {inv.member?.user?.firstName} {inv.member?.user?.lastName}
                      </div>
                    </td>
                    <td style={{ fontWeight: 700, color: '#fff' }}>${inv.amount}</td>
                    <td>
                      <span className={`badge ${inv.status === 'PAID' ? 'badge-success' : 'badge-warning'}`}>
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Expenses Ledger */}
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: '14px' }}>
            <DollarSign size={18} color="var(--gold-400)" />
            Operational Expense Disbursements
          </h3>

          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title / Payee</th>
                  <th>Category</th>
                  <th>Disbursed</th>
                  <th>Approved By</th>
                </tr>
              </thead>
              <tbody>
                {recentExpenses?.map((exp: any) => (
                  <tr key={exp.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: '#fff' }}>{exp.title}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {new Date(exp.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-gold">{exp.category?.name || 'General'}</span>
                    </td>
                    <td style={{ fontWeight: 700, color: '#f87171' }}>-${exp.amount}</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {exp.approvedBy ? `${exp.approvedBy.firstName} ${exp.approvedBy.lastName}` : 'Eyob Haile'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Record Expense Modal */}
      {showExpenseModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 700 }}>Record Operational Expense</h3>
              <button onClick={() => setShowExpenseModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleCreateExpense}>
              <div className="form-group">
                <label className="form-label">Expense Title / Item</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Lodge Retreat Security & Cabin Deposit"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Amount (USD)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-input"
                  placeholder="1500.00"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Accounting Category</label>
                <select
                  className="form-select"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Accounting Notes & Justification</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="Enter audit remarks or vendor reference..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowExpenseModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Certify & Disburse</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
