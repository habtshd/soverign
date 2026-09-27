import React, { useEffect, useState } from 'react';
import { api } from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.js';
import { Avatar } from '../../components/common/Avatar.js';
import { MessageSquare, ThumbsUp, Send, Flame } from 'lucide-react';

export const MemberCommunityView: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    loadCommunityData();
  }, []);

  const loadCommunityData = async () => {
    const [pRes, aRes] = await Promise.all([
      api.community.getPosts(),
      api.community.getAnnouncements(),
    ]);

    if (pRes.success && pRes.data) setPosts(pRes.data);
    if (aRes.success && aRes.data) setAnnouncements(aRes.data);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    setPosting(true);
    try {
      const res = await api.community.createPost({ content: newPostContent });
      if (res.success) {
        setNewPostContent('');
        loadCommunityData();
      }
    } finally {
      setPosting(false);
    }
  };

  const handleToggleLike = async (postId: string) => {
    await api.community.toggleLike(postId);
    loadCommunityData();
  };

  const handleAddComment = async (postId: string) => {
    const content = commentInputs[postId];
    if (!content?.trim()) return;
    const res = await api.community.addComment(postId, content);
    if (res.success) {
      setCommentInputs({ ...commentInputs, [postId]: '' });
      loadCommunityData();
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Brotherhood Feed & Communications</h1>
          <p className="page-subtitle">
            Private communications channel for the Sovereign Brotherhood. Iron sharpens iron.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr minmax(280px, 340px)', gap: '24px' }}>
        {/* Left Column: Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Create Post Box */}
          <div className="card">
            <form onSubmit={handleCreatePost}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <Avatar
                  firstName={user?.firstName}
                  lastName={user?.lastName}
                  size={38}
                />
                <div style={{ flex: 1 }}>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    placeholder="Share an insight, workout standard, or strategic principle with the brothers..."
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <button type="submit" className="btn btn-primary" disabled={posting || !newPostContent.trim()}>
                      <Send size={14} /> Post to Brotherhood
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Posts List */}
          {posts.map((post) => (
            <div key={post.id} className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <Avatar
                  firstName={post.author?.firstName}
                  lastName={post.author?.lastName}
                  size={36}
                />
                <div>
                  <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>
                    {post.author?.firstName} {post.author?.lastName}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {new Date(post.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>

              <p style={{ color: '#fff', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '14px' }}>
                {post.content}
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '16px', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                <button
                  onClick={() => handleToggleLike(post.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: post.hasLiked ? 'var(--gold-400)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                  }}
                >
                  <ThumbsUp size={16} />
                  <span>Respect ({post.likesCount})</span>
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <MessageSquare size={16} />
                  <span>Comments ({post.comments?.length || 0})</span>
                </div>
              </div>

              {/* Comments Section */}
              <div style={{ marginTop: '14px', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {post.comments?.map((c: any) => (
                  <div key={c.id} style={{ background: 'var(--bg-primary)', padding: '8px 12px', borderRadius: '6px' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-gold)' }}>
                      {c.author?.firstName} {c.author?.lastName}
                    </div>
                    <div style={{ fontSize: '0.84rem', color: '#fff', marginTop: '2px' }}>
                      {c.content}
                    </div>
                  </div>
                ))}

                {/* Add Comment Input */}
                <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Add a reply..."
                    style={{ height: '34px', fontSize: '0.82rem' }}
                    value={commentInputs[post.id] || ''}
                    onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                  />
                  <button
                    className="btn btn-sm btn-outline-gold"
                    onClick={() => handleAddComment(post.id)}
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Leadership Announcements */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="card card-gold-border">
            <h3 className="card-title">
              <Flame size={18} color="var(--gold-400)" />
              Executive Directives
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '14px' }}>
              {announcements.map((a) => (
                <div key={a.id} style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
                  <span className="badge badge-gold" style={{ marginBottom: '6px' }}>{a.priority}</span>
                  <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>{a.title}</div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: '1.4' }}>
                    {a.content}
                  </p>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                    By {a.author?.firstName} {a.author?.lastName}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
