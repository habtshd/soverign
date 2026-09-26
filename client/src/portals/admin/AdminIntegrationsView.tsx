import React, { useEffect, useState } from 'react';
import { api } from '../../api/client.js';
import { Workflow, RefreshCw, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export const AdminIntegrationsView: React.FC = () => {
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<any | null>(null);

  // Telegram broadcast state
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [selectedAnnouncementId, setSelectedAnnouncementId] = useState('');
  const [broadcastStatus, setBroadcastStatus] = useState<string | null>(null);

  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = async () => {
    const [iRes, aRes] = await Promise.all([
      api.integrations.getAll(),
      api.community.getAnnouncements(),
    ]);

    if (iRes.success && iRes.data) setIntegrations(iRes.data);
    if (aRes.success && aRes.data) {
      setAnnouncements(aRes.data);
      if (aRes.data.length > 0) setSelectedAnnouncementId(aRes.data[0].id);
    }
  };

  const handleSyncSheets = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await api.integrations.syncGoogleSheets();
      if (res.success) {
        setSyncResult(res.data);
        await loadIntegrations();
      }
    } finally {
      setSyncing(false);
    }
  };

  const handleBroadcastTelegram = async () => {
    if (!selectedAnnouncementId) return;
    setBroadcastStatus('Broadcasting...');
    const res = await api.integrations.broadcastTelegram(selectedAnnouncementId);
    if (res.success) {
      setBroadcastStatus('Broadcast successfully delivered to official Telegram channel!');
      setTimeout(() => setBroadcastStatus(null), 4000);
      await loadIntegrations();
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Ecosystem Integrations & Webhooks</h1>
          <p className="page-subtitle">
            Bidirectional connectivity between Google Workspace (Forms/Sheets/Drive) and Telegram Communications.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {/* Google Ecosystem Card */}
        <div className="card card-gold-border">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <span className="badge badge-success" style={{ marginBottom: '6px' }}>ACTIVE SYNC</span>
              <h3 style={{ fontSize: '1.25rem', color: '#fff', fontWeight: 700 }}>
                Google Forms & Sheets Bridge
              </h3>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: '8px', background: 'rgba(201,151,56,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-400)' }}>
              <Workflow size={22} />
            </div>
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '16px' }}>
            Automated member application ingestion from external intake Google Forms and historical spreadsheet repositories directly into the Sovereign Operating System.
          </p>

          <div style={{ background: 'var(--bg-primary)', padding: '12px', borderRadius: '8px', marginBottom: '18px', fontSize: '0.8rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Webhook Endpoint:</span>
              <code style={{ color: 'var(--text-gold)' }}>/api/v1/integrations/google/forms-webhook</code>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Status:</span>
              <span style={{ color: '#10b981', fontWeight: 600 }}>LISTENING (LIVE)</span>
            </div>
          </div>

          {syncResult && (
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#34d399', padding: '10px 14px', borderRadius: '6px', marginBottom: '16px', fontSize: '0.82rem' }}>
              ✔ Batch sync complete: {syncResult.importedCount} new application records ingested from Google Sheets!
            </div>
          )}

          <button
            className="btn btn-primary"
            style={{ width: '100%' }}
            onClick={handleSyncSheets}
            disabled={syncing}
          >
            <RefreshCw size={15} className={syncing ? 'animate-spin' : ''} />
            {syncing ? 'Synchronizing with Google Sheets...' : 'Trigger Google Sheets Manual Sync'}
          </button>
        </div>

        {/* Telegram Bot Card */}
        <div className="card card-gold-border">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <span className="badge badge-success" style={{ marginBottom: '6px' }}>CONNECTED BOT</span>
              <h3 style={{ fontSize: '1.25rem', color: '#fff', fontWeight: 700 }}>
                Telegram Community Dispatcher
              </h3>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: '8px', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa' }}>
              <Send size={22} />
            </div>
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '16px' }}>
            Dispatches urgent announcements, expedition alerts, and membership credentials to the official Telegram channel (<code>@sovereign_mens_club_official</code>).
          </p>

          <div className="form-group">
            <label className="form-label">Select Announcement to Broadcast</label>
            <select
              className="form-select"
              value={selectedAnnouncementId}
              onChange={(e) => setSelectedAnnouncementId(e.target.value)}
            >
              {announcements.map((a) => (
                <option key={a.id} value={a.id}>{a.title} ({a.priority})</option>
              ))}
            </select>
          </div>

          {broadcastStatus && (
            <div style={{ background: 'rgba(59, 130, 246, 0.15)', border: '1px solid #3b82f6', color: '#93c5fd', padding: '10px 14px', borderRadius: '6px', marginBottom: '16px', fontSize: '0.82rem' }}>
              {broadcastStatus}
            </div>
          )}

          <button
            className="btn btn-outline-gold"
            style={{ width: '100%' }}
            onClick={handleBroadcastTelegram}
          >
            <Send size={15} /> Dispatch to Telegram Channel
          </button>
        </div>
      </div>

      {/* Integration Registry Table */}
      <div className="card">
        <h3 className="card-title" style={{ marginBottom: '16px' }}>
          Registered Integration Pipelines
        </h3>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Service Name</th>
                <th>Status</th>
                <th>Lifetime Synchronizations</th>
                <th>Last Operational Sync</th>
                <th>Health Status</th>
              </tr>
            </thead>
            <tbody>
              {integrations.map((item) => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 700, color: '#fff' }}>{item.serviceName}</td>
                  <td>
                    <span className="badge badge-success">{item.status}</span>
                  </td>
                  <td>
                    <strong>{item.syncCount}</strong> events processed
                  </td>
                  <td>
                    {item.lastSyncAt ? new Date(item.lastSyncAt).toLocaleString() : 'Just now'}
                  </td>
                  <td>
                    <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem' }}>
                      <CheckCircle2 size={14} /> Operational
                    </span>
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
