import React, { useEffect, useState } from 'react';
import { api } from '../../api/client.js';
import { Calendar, MapPin, Users, Check, X, Clock, AlertCircle, Compass, Shield } from 'lucide-react';

export const MemberEventsView: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'UPCOMING' | 'RSVP'>('ALL');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const res = await api.events.getAll();
      if (res.success && Array.isArray(res.data)) {
        setEvents(res.data);
      }
    } catch (err: any) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId: string) => {
    setActionLoading(eventId);
    setStatusMessage(null);
    try {
      const res = await api.events.register(eventId);
      if (res.success) {
        setStatusMessage({ type: 'success', text: 'RSVP confirmed! See you on the ground, brother.' });
        await loadEvents();
      } else {
        setStatusMessage({ type: 'error', text: res.error || 'Failed to complete RSVP.' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Error communicating with server.' });
    } finally {
      setActionLoading(null);
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  const handleCancel = async (eventId: string) => {
    setActionLoading(eventId);
    setStatusMessage(null);
    try {
      const res = await api.events.cancel(eventId);
      if (res.success) {
        setStatusMessage({ type: 'success', text: 'RSVP cancelled successfully.' });
        await loadEvents();
      } else {
        setStatusMessage({ type: 'error', text: res.error || 'Failed to cancel RSVP.' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Error communicating with server.' });
    } finally {
      setActionLoading(null);
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  // Helper functions for safely rendering event properties without object crashing
  const getLocationName = (loc: any): string => {
    if (!loc) return 'Sovereign Hall';
    if (typeof loc === 'string') return loc;
    if (typeof loc === 'object') {
      return loc.name || loc.address || loc.city || 'Sovereign Hall';
    }
    return 'Sovereign Hall';
  };

  const getCategoryName = (cat: any): string => {
    if (!cat) return 'Brotherhood Expedition';
    if (typeof cat === 'string') return cat;
    if (typeof cat === 'object') {
      return cat.name || cat.code || 'Brotherhood Expedition';
    }
    return 'Brotherhood Expedition';
  };

  const formatEventDate = (dateVal: any): string => {
    if (!dateVal) return 'Date TBD';
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return 'Date TBD';
    return `${d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} at ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  const filteredEvents = events.filter((e) => {
    const isRegistered = Boolean(e.isRegistered || (e.registrations && e.registrations.length > 0));
    if (filter === 'RSVP') return isRegistered;
    if (filter === 'UPCOMING') {
      if (!e.startTime) return true;
      return new Date(e.startTime) >= new Date();
    }
    return true;
  });

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Events & Expeditions</h1>
          <p className="page-subtitle">
            Summits, Brotherhood Rucks, Strategic Masterminds, and Tactical Training.
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            className={`btn btn-sm ${filter === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('ALL')}
          >
            All Expeditions ({events.length})
          </button>
          <button
            className={`btn btn-sm ${filter === 'UPCOMING' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('UPCOMING')}
          >
            Upcoming
          </button>
          <button
            className={`btn btn-sm ${filter === 'RSVP' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('RSVP')}
          >
            My RSVPs ({events.filter((e) => e.isRegistered || (e.registrations && e.registrations.length > 0)).length})
          </button>
        </div>
      </div>

      {/* Status Feedback Notification */}
      {statusMessage && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.88rem',
            fontWeight: 600,
            background: statusMessage.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            border: `1px solid ${statusMessage.type === 'success' ? '#10b981' : '#ef4444'}`,
            color: statusMessage.type === 'success' ? '#10b981' : '#ef4444',
          }}
        >
          {statusMessage.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && events.length === 0 && (
        <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
            <Calendar size={32} className="spin" color="var(--gold-400)" />
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>Loading Sovereign Calendar...</div>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredEvents.length === 0 && (
        <div className="card" style={{ padding: '48px 24px', textAlign: 'center', maxWidth: '600px', margin: '30px auto' }}>
          <Compass size={40} color="var(--gold-400)" style={{ margin: '0 auto 14px auto', display: 'block' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
            {filter === 'RSVP' ? 'No Confirmed RSVPs Yet' : 'No Expeditions Found'}
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '20px' }}>
            {filter === 'RSVP'
              ? 'Browse the schedule and reserve your spot in upcoming summits, tactical drills, and mountain rucks.'
              : 'New calendar gatherings are currently being coordinated by council leadership.'}
          </p>
          {filter !== 'ALL' && (
            <button className="btn btn-primary" onClick={() => setFilter('ALL')}>
              View All Expeditions
            </button>
          )}
        </div>
      )}

      {/* Events Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
        {filteredEvents.map((event) => {
          const isRegistered = Boolean(event.isRegistered || (event.registrations && event.registrations.length > 0));
          const regCount = Number(event.registeredCount ?? event._count?.registrations ?? 0);
          const capacity = Number(event.capacity || 50);
          const isFull = regCount >= capacity;
          const locationText = getLocationName(event.location);
          const categoryText = getCategoryName(event.category);
          const dateText = formatEventDate(event.startTime);

          return (
            <div
              key={event.id}
              className="card card-gold-border"
              style={{
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
            >
              {/* Event Card Header Graphic */}
              <div
                style={{
                  minHeight: '84px',
                  background: 'linear-gradient(135deg, rgba(201, 151, 56, 0.12) 0%, rgba(15, 18, 26, 0.04) 100%)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                }}
              >
                <div style={{ overflow: 'hidden', paddingRight: '8px' }}>
                  <span className="badge badge-gold" style={{ letterSpacing: '0.04em' }}>
                    {categoryText}
                  </span>
                  <div
                    style={{
                      fontSize: '0.78rem',
                      color: 'var(--text-secondary)',
                      marginTop: '6px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      fontWeight: 500,
                    }}
                  >
                    {locationText}
                  </div>
                </div>

                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: '8px',
                    background: 'rgba(201, 151, 56, 0.14)',
                    border: '1px solid rgba(201, 151, 56, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--gold-400)',
                    flexShrink: 0,
                  }}
                >
                  <Calendar size={18} />
                </div>
              </div>

              {/* Title & Description */}
              <h3
                style={{
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  color: 'var(--text-main)',
                  marginBottom: '8px',
                  lineHeight: 1.3,
                  letterSpacing: '-0.015em',
                }}
              >
                {event.title}
              </h3>

              <p
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.86rem',
                  flex: 1,
                  marginBottom: '16px',
                  lineHeight: '1.55',
                }}
              >
                {event.description}
              </p>

              {/* Event Metadata */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  fontSize: '0.82rem',
                  color: 'var(--text-secondary)',
                  marginBottom: '16px',
                  background: 'var(--bg-primary)',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={14} color="var(--gold-400)" style={{ flexShrink: 0 }} />
                  <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{dateText}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={14} color="var(--gold-400)" style={{ flexShrink: 0 }} />
                  <span>{locationText}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={14} color="var(--gold-400)" style={{ flexShrink: 0 }} />
                  <span>
                    <strong style={{ color: 'var(--text-main)' }}>{regCount}</strong> / {capacity} Registered
                  </span>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div
                style={{
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                {isRegistered ? (
                  <>
                    <span className="badge badge-success" style={{ gap: '6px' }}>
                      <Check size={13} /> CONFIRMED RSVP
                    </span>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => handleCancel(event.id)}
                      disabled={actionLoading === event.id}
                      style={{ fontWeight: 600 }}
                    >
                      {actionLoading === event.id ? 'Processing...' : 'Cancel RSVP'}
                    </button>
                  </>
                ) : (
                  <>
                    <span
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: isFull ? 'var(--status-danger)' : 'var(--text-gold)',
                      }}
                    >
                      {isFull ? 'Waitlist Only' : 'Spots Available'}
                    </span>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleRegister(event.id)}
                      disabled={actionLoading === event.id}
                      style={{ fontWeight: 700 }}
                    >
                      {actionLoading === event.id
                        ? 'Registering...'
                        : isFull
                        ? 'Join Waitlist'
                        : 'RSVP Register'}
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
