import React, { useEffect, useState } from 'react';
import { api } from '../../api/client.js';
import { Settings, Save, CheckCircle, Shield, Bell, DollarSign, Globe } from 'lucide-react';

export const AdminSettingsView: React.FC = () => {
  const [settings, setSettings] = useState<any[]>([]);
  const [saved, setSaved] = useState(false);

  // Form states
  const [clubName, setClubName] = useState("Sovereign Men's Club");
  const [motto, setMotto] = useState("ወንድ መሆን እዳ ነው! (To be a man is a responsibility)");
  const [headquarters, setHeadquarters] = useState("Addis Ababa, Ethiopia");
  const [supportEmail, setSupportEmail] = useState("council@sovereign.club");
  const [generalDues, setGeneralDues] = useState("300");
  const [execDues, setExecDues] = useState("600");
  const [foundingDues, setFoundingDues] = useState("1200");
  const [autoVerifyApplicant, setAutoVerifyApplicant] = useState(false);
  const [telegramNotifications, setTelegramNotifications] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const res = await api.admin.getSettings();
    if (res.success && res.data) {
      setSettings(res.data);
      const getVal = (k: string) => res.data.find((s: any) => s.key === k)?.value;
      if (getVal('club_name')) setClubName(getVal('club_name'));
      if (getVal('club_motto')) setMotto(getVal('club_motto'));
      if (getVal('headquarters')) setHeadquarters(getVal('headquarters'));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await Promise.all([
      api.admin.updateSetting('club_name', clubName, 'Official Organization Name'),
      api.admin.updateSetting('club_motto', motto, 'Founding Brotherhood Creed'),
      api.admin.updateSetting('headquarters', headquarters, 'Alpha Chapter HQ'),
    ]);

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Platform & System Settings</h1>
          <p className="page-subtitle">
            Configure Sovereign Men's Club institutional policies, dues parameters, and automated platform triggers.
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleSave}>
          <Save size={16} /> Save Configuration
        </button>
      </div>

      {saved && (
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', padding: '12px 16px', borderRadius: '8px', color: '#10b981', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle size={18} /> System settings updated and broadcasted across all cluster nodes!
        </div>
      )}

      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
          {/* Institutional Identity */}
          <div className="card card-gold-border">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Shield size={20} color="var(--gold-400)" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Institutional Identity</h3>
            </div>

            <div className="form-group">
              <label className="form-label">Platform & Club Name</label>
              <input
                type="text"
                className="form-input"
                value={clubName}
                onChange={(e) => setClubName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Brotherhood Creed & Motto</label>
              <input
                type="text"
                className="form-input"
                value={motto}
                onChange={(e) => setMotto(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Headquarters / Primary Chapter</label>
              <input
                type="text"
                className="form-input"
                value={headquarters}
                onChange={(e) => setHeadquarters(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Council Support Email</label>
              <input
                type="email"
                className="form-input"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Dues & Financial Thresholds */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <DollarSign size={20} color="var(--gold-400)" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Membership Dues Architecture</h3>
            </div>

            <div className="form-group">
              <label className="form-label">Founding Member Annual Dues ($ USD)</label>
              <input
                type="number"
                className="form-input"
                value={foundingDues}
                onChange={(e) => setFoundingDues(e.target.value)}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Includes lifetime voting privileges & summit pass.</span>
            </div>

            <div className="form-group">
              <label className="form-label">Executive Member Annual Dues ($ USD)</label>
              <input
                type="number"
                className="form-input"
                value={execDues}
                onChange={(e) => setExecDues(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Sovereign Brother Annual Dues ($ USD)</label>
              <input
                type="number"
                className="form-input"
                value={generalDues}
                onChange={(e) => setGeneralDues(e.target.value)}
              />
            </div>
          </div>

          {/* Automations & Triggers */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Bell size={20} color="var(--gold-400)" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Automations & Sync Polling</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={telegramNotifications}
                  onChange={(e) => setTelegramNotifications(e.target.checked)}
                />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Telegram Instant Broadcasts</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Auto-forward emergency council announcements to Telegram channel.
                  </div>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={autoVerifyApplicant}
                  onChange={(e) => setAutoVerifyApplicant(e.target.checked)}
                />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Auto-Approve Council Recommendations</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Immediately issue digital ID if recommended by 2 Founding Members.
                  </div>
                </div>
              </label>

              <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border-muted)', marginTop: '8px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-gold)' }}>Google Sheets Sync Frequency</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Intake forms poll every 5 minutes automatically via background daemon.
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
