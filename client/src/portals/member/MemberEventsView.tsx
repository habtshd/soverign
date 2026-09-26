import React, { useEffect, useState } from 'react';
import { api } from '../../api/client.js';
import { Calendar, MapPin, Users, Check, X, Clock } from 'lucide-react';

export const MemberEventsView: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const res = await api.events.getAll();
      if (res.success && res.data) {
        setEvents(res.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId: string) => {
    setActionLoading(eventId);
    try {
      const res = await api.events.register(eventId);
      if (res.success) {
        await loadEvents();
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (eventId: string) => {
    setActionLoading(eventId);
    try {
      const res = await api.events.cancel(eventId);
      if (res.success) {
        await loadEvents();
      }
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Events & Expeditions</h1>
          <p className="page-subtitle">
            Summits, Brotherhood Rucks, Strategic Masterminds, and Tactical Training.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
        {events.map((event) => {
          const isRegistered = event.isRegistered;
          const isFull = event.registeredCount >= event.capacity;

          return (
            <div key={event.id} className="card card-gold-border" style={{ display: 'flex', flexDirection: 'column' }}>
              {event.coverImage && (
                <div
                  style={{
                    height: '180px',
                    backgroundImage: `url(${event.coverImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '8px',
                    marginBottom: '16px',
                    position: 'relative',
                  }}
                >
                  <span
                    className="badge badge-gold"
                    style={{ position: 'absolute', top: 12, left: 12 }}
                  >
                    {event.category?.name || 'Summit'}
                  </span>
                </div>
              )}

              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                {event.title}
              </h3>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', flex: 1, marginBottom: '16px', lineHeight: '1.5' }}>
                {event.description}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={14} color="var(--gold-400)" />
                  <span>{new Date(event.startTime).toLocaleDateString()} at {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={14} color="var(--gold-400)" />
                  <span>{event.location?.name || 'Sovereign Mountain Lodge'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Users size={14} color="var(--gold-400)" />
                  <span>
                    {event.registeredCount} / {event.capacity} Registered
                  </span>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {isRegistered ? (
                  <>
                    <span className="badge badge-success">
                      <Check size={12} /> CONFIRMED RSVP
                    </span>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => handleCancel(event.id)}
                      disabled={actionLoading === event.id}
                    >
                      Cancel RSVP
                    </button>
                  </>
                ) : (
                  <>
                    <span style={{ fontSize: '0.8rem', color: isFull ? 'var(--status-danger)' : 'var(--text-gold)' }}>
                      {isFull ? 'Waitlist Only' : 'Spots Available'}
                    </span>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleRegister(event.id)}
                      disabled={actionLoading === event.id}
                    >
                      {isFull ? 'Join Waitlist' : 'RSVP Register'}
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
