import React, { useEffect, useState } from 'react';
import { api } from '../../api/client.js';
import { BookOpen, Headphones, CheckSquare, Square, PlayCircle, ExternalLink } from 'lucide-react';

export const MemberLearningView: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [books, setBooks] = useState<any[]>([]);
  const [podcasts, setPodcasts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'courses' | 'books' | 'podcasts'>('courses');

  useEffect(() => {
    loadLearningData();
  }, []);

  const loadLearningData = async () => {
    const [cRes, bRes, pRes] = await Promise.all([
      api.learning.getCourses(),
      api.learning.getBooks(),
      api.learning.getPodcasts(),
    ]);

    if (cRes.success && cRes.data) {
      setCourses(cRes.data);
      if (cRes.data.length > 0) {
        loadCourseDetail(cRes.data[0].slug);
      }
    }
    if (bRes.success && bRes.data) setBooks(bRes.data);
    if (pRes.success && pRes.data) setPodcasts(pRes.data);
  };

  const loadCourseDetail = async (slug: string) => {
    const res = await api.learning.getCourseBySlug(slug);
    if (res.success && res.data) {
      setSelectedCourse(res.data);
    }
  };

  const handleToggleLesson = async (lessonId: string) => {
    const res = await api.learning.toggleLesson(lessonId);
    if (res.success && selectedCourse) {
      loadCourseDetail(selectedCourse.slug);
      const cRes = await api.learning.getCourses();
      if (cRes.success && cRes.data) setCourses(cRes.data);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Learning & Mastery</h1>
          <p className="page-subtitle">
            Cultivate strategic intellect, leadership doctrine, and financial autonomy.
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`btn btn-sm ${activeTab === 'courses' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('courses')}
          >
            <BookOpen size={14} /> Courses
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'books' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('books')}
          >
            Library
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'podcasts' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('podcasts')}
          >
            <Headphones size={14} /> Podcasts
          </button>
        </div>
      </div>

      {activeTab === 'courses' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 340px) 1fr', gap: '24px' }}>
          {/* Courses Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {courses.map((c) => (
              <div
                key={c.id}
                onClick={() => loadCourseDetail(c.slug)}
                className={`card ${selectedCourse?.slug === c.slug ? 'card-gold-border' : ''}`}
                style={{ cursor: 'pointer', padding: '16px' }}
              >
                <div style={{ fontSize: '0.72rem', color: 'var(--text-gold)', textTransform: 'uppercase', fontWeight: 600 }}>
                  {c.category}
                </div>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.98rem', marginTop: '4px' }}>
                  {c.title}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                  <span>{c.instructor}</span>
                  <span>{c.progressPercent}% Completed</span>
                </div>
                <div style={{ height: '4px', background: 'var(--bg-primary)', borderRadius: '2px', marginTop: '8px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: 'var(--gold-gradient)', width: `${c.progressPercent}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Course Details & Modules */}
          {selectedCourse && (
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <span className="badge badge-gold">{selectedCourse.level}</span>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff', marginTop: '6px' }}>
                    {selectedCourse.title}
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '4px' }}>
                    {selectedCourse.description}
                  </p>
                </div>
              </div>

              {/* Modules & Lessons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '24px' }}>
                {selectedCourse.modules?.map((m: any) => (
                  <div key={m.id} style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '16px' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-gold)', fontSize: '0.92rem', marginBottom: '12px' }}>
                      {m.title}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {m.lessons?.map((lesson: any) => {
                        const isDone = lesson.progresses?.[0]?.isCompleted;
                        return (
                          <div
                            key={lesson.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '10px 12px',
                              background: 'var(--bg-tertiary)',
                              borderRadius: '6px',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <button
                                onClick={() => handleToggleLesson(lesson.id)}
                                style={{ background: 'none', border: 'none', color: isDone ? '#10b981' : 'var(--text-muted)', cursor: 'pointer' }}
                              >
                                {isDone ? <CheckSquare size={18} /> : <Square size={18} />}
                              </button>
                              <span style={{ fontSize: '0.88rem', color: isDone ? 'var(--text-muted)' : '#fff', textDecoration: isDone ? 'line-through' : 'none' }}>
                                {lesson.title}
                              </span>
                            </div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {lesson.durationMinutes} min
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'books' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {books.map((b) => (
            <div key={b.id} className="card card-gold-border">
              <span className="badge badge-gold">{b.category}</span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', margin: '8px 0 4px 0' }}>
                {b.title}
              </h3>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-gold)', marginBottom: '10px' }}>
                by {b.author}
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                {b.description}
              </p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'podcasts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {podcasts.map((p) => (
            <div key={p.id} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--gold-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0b0d12' }}>
                  <PlayCircle size={24} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: '#fff', fontSize: '1.05rem' }}>{p.title}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Host: {p.host} • Duration: {p.duration}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>{p.description}</div>
                </div>
              </div>
              <button className="btn btn-sm btn-outline-gold">Listen Episode</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
