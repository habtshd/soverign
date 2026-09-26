import React, { useEffect, useState } from 'react';
import { api } from '../../api/client.js';
import { Shield, Clock, User } from 'lucide-react';

export const AdminAuditView: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    const res = await api.admin.getAuditLogs();
    if (res.success && res.logs) {
      setLogs(res.logs);
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Security & Operational Audit Log</h1>
          <p className="page-subtitle">
            Immutable system audit records tracking every mutation, intake approval, and financial record.
          </p>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Action</th>
              <th>Target Entity</th>
              <th>Operator / User</th>
              <th>Details & Telemetry</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td>
                  <span className="badge badge-gold">{log.action}</span>
                </td>
                <td style={{ fontWeight: 600, color: '#fff' }}>{log.entity}</td>
                <td>
                  <div style={{ color: '#fff', fontSize: '0.85rem' }}>
                    {log.user ? `${log.user.firstName} ${log.user.lastName}` : 'Automated Engine'}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {log.user?.email || 'System'}
                  </div>
                </td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {log.details || 'Operational event recorded'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
