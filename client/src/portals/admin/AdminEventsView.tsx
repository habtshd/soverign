import React, { useEffect, useState } from 'react';
import { api } from '../../api/client.js';
import { Calendar, Plus, Users, MapPin, Check } from 'lucide-react';

export const AdminEventsView: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [capacity, setCapacity] = useState('50');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const [eRes, cRes] = await Promise.all([
      api.events.getAll(),
      api.events.getCategories(),
    ]);

    if (eRes.success && eRes.data) setEvents(eRes.data);
    if (cRes.success && cRes.data) {
      setCategories(cRes.data);
      if (cRes.data.length > 0) setCategoryId(cRes.data[0].id);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await api.events.create({
      title,
      description,
      categoryId,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime || startTime).toISOString(),
      capacity: Number(capacity),
    });

    if (res.success) {
      setShowCreateModal(false);
      setTitle('');
      setDescription('');
      loadEvents();
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Event Operations & Management</h1>
          <p className="page-subtitle">
            Curate national summits, regional rucks, private retreats, and masterminds.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          <Plus size={16} /> Create New Expedition
        </button>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Expedition / Event</th>
              <th>Category</th>
              <th>Date & Schedule</th>
              <th>Location</th>
              <th>Registrations</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e) => (
              <tr key={e.id}>
                <td>
                  <div style={{ fontWeight: 700, color: '#fff' }}>{e.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Organizer: {e.organizer?.firstName} {e.organizer?.lastName}
                  </div>
                </td>
                <td>
                  <span className="badge badge-gold">{e.category?.name}</span>
                </td>
                <td>
                  <div>{new Date(e.startTime).toLocaleDateString()}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {new Date(e.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </td>
                <td>{e.location?.name || 'Sovereign Mountain Lodge'}</td>
                <td>
                  <strong>{e.registeredCount}</strong> / {e.capacity}
                </td>
                <td>
                  <span className="badge badge-success">{e.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 700 }}>Schedule New Sovereign Event</h3>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleCreateEvent}>
              <div className="form-group">
                <label className="form-label">Event Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Q3 Strategic Asset Protection Summit"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
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
                <label className="form-label">Description & Standards</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="Provide scope, packing checklist, and agenda..."
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Start Time</label>
                  <input
                    type="datetime-local"
                    className="form-input"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">End Time</label>
                  <input
                    type="datetime-local"
                    className="form-input"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Capacity (Max Brothers)</label>
                <input
                  type="number"
                  className="form-input"
                  required
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Publish Expedition</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
