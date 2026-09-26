import React, { useEffect, useState } from 'react';
import { api } from '../../api/client.js';
import { QrCode, CheckCircle, Search, Users, Calendar } from 'lucide-react';

export const OrganizerDashboardView: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [memberCode, setMemberCode] = useState('');
  const [checkInResult, setCheckInResult] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const res = await api.events.getAll();
    if (res.success && res.data) {
      setEvents(res.data);
      if (res.data.length > 0) setSelectedEventId(res.data[0].id);
    }
  };

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventId || !memberCode.trim()) return;

    setErrorMsg(null);
    setCheckInResult(null);

    const res = await api.events.checkIn(selectedEventId, memberCode.trim());
    if (res.success && res.data) {
      setCheckInResult(res.data);
      setMemberCode('');
      loadEvents();
    } else {
      setErrorMsg(res.error || 'Failed to check in member');
    }
  };

  const selectedEvent = events.find((e) => e.id === selectedEventId);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Organizer Command & Attendance Scanner</h1>
          <p className="page-subtitle">
            Validate digital credentials, verify security standing, and log event attendance.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 420px) 1fr', gap: '24px' }}>
        {/* Scanner / Check-in Form */}
        <div className="card card-gold-border">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <QrCode size={22} color="var(--gold-400)" />
            <h3 style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 700 }}>
              Physical Check-In Terminal
            </h3>
          </div>

          <form onSubmit={handleCheckIn}>
            <div className="form-group">
              <label className="form-label">Select Active Event</label>
              <select
                className="form-select"
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
              >
                {events.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.title} ({new Date(e.startTime).toLocaleDateString()})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Scan QR Code or Input Member ID</label>
              <input
                type="text"
                className="form-input"
                placeholder="Scan or enter code (e.g. SOV-001 or SOV-108)"
                required
                value={memberCode}
                onChange={(e) => setMemberCode(e.target.value)}
              />
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Accepts QR hash, Digital ID string, or Member Number.
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
              Verify & Check In Brother
            </button>
          </form>

          {/* Result Alert */}
          {checkInResult && (
            <div style={{ marginTop: '20px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', borderRadius: '8px', padding: '14px', color: '#34d399' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
                <CheckCircle size={18} /> Attendance Verified!
              </div>
              <div style={{ fontSize: '0.85rem', color: '#fff', marginTop: '4px' }}>
                Brother: <strong>{checkInResult.member?.name}</strong> ({checkInResult.member?.memberNumber})
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Checked in via {checkInResult.attendance?.method} at {new Date(checkInResult.attendance?.checkedInAt).toLocaleTimeString()}
              </div>
            </div>
          )}

          {errorMsg && (
            <div style={{ marginTop: '20px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', borderRadius: '8px', padding: '14px', color: '#f87171', fontSize: '0.85rem' }}>
              ✕ {errorMsg}
            </div>
          )}
        </div>

        {/* Selected Event Details */}
        {selectedEvent && (
          <div className="card">
            <h3 className="card-title">
              <Calendar size={18} color="var(--gold-400)" />
              Expedition Roster & Check-In Log
            </h3>
            <div style={{ marginTop: '12px', fontSize: '0.88rem', color: '#fff', fontWeight: 600 }}>
              {selectedEvent.title}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-gold)', marginBottom: '16px' }}>
              Location: {selectedEvent.location?.name || 'Sovereign Mountain Lodge'} • Capacity: {selectedEvent.capacity}
            </div>

            <div style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: '8px', marginBottom: '16px', display: 'flex', gap: '24px' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Confirmed Registrations</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff' }}>{selectedEvent.registeredCount}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Spots Remaining</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-gold)' }}>
                  {Math.max(0, selectedEvent.capacity - selectedEvent.registeredCount)}
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              {selectedEvent.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
