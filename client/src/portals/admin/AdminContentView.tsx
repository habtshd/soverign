import React, { useEffect, useState } from 'react';
import { api } from '../../api/client.js';
import { BookOpen, Radio, Plus, CheckCircle, Video, FileText, Layers } from 'lucide-react';

export const AdminContentView: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [books, setBooks] = useState<any[]>([]);
  const [podcasts, setPodcasts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'courses' | 'books' | 'podcasts'>('courses');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('LEADERSHIP');
  const [successMsg, setSuccessMsg] = useState(false);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    const [cRes, bRes, pRes] = await Promise.all([
      api.learning.getCourses(),
      api.learning.getBooks(),
      api.learning.getPodcasts(),
    ]);

    if (cRes.success && cRes.data) setCourses(cRes.data);
    if (bRes.success && bRes.data) setBooks(bRes.data);
    if (pRes.success && pRes.data) setPodcasts(pRes.data);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    if (activeTab === 'books') {
      const newBook = {
        id: `book-${Date.now()}`,
        title: newTitle,
        author: newAuthor || "Sovereign Men's Council",
        description: newDesc,
        category: newCategory,
        coverUrl: '',
      };
      setBooks([newBook, ...books]);
    } else if (activeTab === 'podcasts') {
      const newPod = {
        id: `pod-${Date.now()}`,
        title: newTitle,
        host: newAuthor || 'Eyob Haile & Council',
        description: newDesc,
        durationMinutes: 45,
        episodeNumber: podcasts.length + 1,
      };
      setPodcasts([newPod, ...podcasts]);
    }

    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      setShowAddModal(false);
      setNewTitle('');
      setNewAuthor('');
      setNewDesc('');
    }, 1500);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Curriculum & Content Management</h1>
          <p className="page-subtitle">
            Curate brotherhood development resources: The Duty of Manhood curriculum, foundational books, and the Sovereign Podcast Hub.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`btn btn-sm ${activeTab === 'courses' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('courses')}
          >
            <Layers size={14} /> Courses & Modules ({courses.length})
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'books' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('books')}
          >
            <BookOpen size={14} /> Reading List ({books.length})
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'podcasts' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('podcasts')}
          >
            <Radio size={14} /> Podcasts ({podcasts.length})
          </button>
          <button className="btn btn-sm btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={14} /> Add Content
          </button>
        </div>
      </div>

      {activeTab === 'courses' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
          {courses.map((course) => (
            <div key={course.id} className="card card-gold-border">
              <span className="badge badge-gold" style={{ marginBottom: '8px' }}>CORE DISCIPLINE</span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px' }}>{course.title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
                {course.description}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-muted)', paddingTop: '10px' }}>
                <span>{course.modules?.length || 4} Modules</span>
                <span>{course.enrollments?.length || 0} Brothers Enrolled</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'books' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {books.map((b) => (
            <div key={b.id} className="card" style={{ display: 'flex', gap: '16px' }}>
              <div
                style={{
                  width: 68,
                  height: 94,
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #1c2130 0%, #10131d 100%)',
                  border: '1px solid rgba(201, 151, 56, 0.35)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  color: 'var(--gold-400)',
                  gap: '6px',
                }}
              >
                <BookOpen size={24} />
                <span style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.06em', color: 'var(--text-muted)' }}>
                  BOOK
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span className="badge" style={{ width: 'fit-content', marginBottom: '4px', fontSize: '0.65rem' }}>{b.category || 'MASCULINITY'}</span>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '2px 0' }}>{b.title}</h4>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-gold)' }}>By {b.author}</div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.3 }}>
                  {b.description?.slice(0, 100)}...
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'podcasts' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          {podcasts.map((pod) => (
            <div key={pod.id} className="card card-gold-border">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className="badge badge-gold">EPISODE #{pod.episodeNumber}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{pod.durationMinutes || 45} mins</span>
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{pod.title}</h4>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-gold)', margin: '4px 0 10px' }}>Host: {pod.host}</div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                {pod.description}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '480px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '16px' }}>
              Add Content to {activeTab.toUpperCase()}
            </h3>

            <form onSubmit={handleAddItem}>
              <div className="form-group">
                <label className="form-label">Title / Headline</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. Meditations by Marcus Aurelius"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Author / Host / Creator</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Eyob Haile & Council"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description & Key Takeaway</label>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="Explain why this content develops the brothers..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                />
              </div>

              {successMsg && (
                <div style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', marginBottom: '12px' }}>
                  <CheckCircle size={16} /> Content added successfully to Sovereign Hub!
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Publish Content
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
