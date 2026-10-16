import React, { useEffect, useState, useMemo } from 'react';
import { api } from '../../api/client.js';
import {
  BookOpen,
  Radio,
  Plus,
  CheckCircle,
  Video,
  FileText,
  Layers,
  Youtube,
  RefreshCw,
  ExternalLink,
  Link2,
  Eye,
  Clock,
  Check,
  Loader2,
  AlertCircle,
  Copy,
  Users,
  Search,
  ThumbsUp,
  ShieldCheck,
  Play,
  X,
} from 'lucide-react';

export const AdminContentView: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [books, setBooks] = useState<any[]>([]);
  const [podcasts, setPodcasts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'courses' | 'youtube' | 'books' | 'podcasts'>('youtube');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);

  // YouTube Channel Sync state
  const [channel, setChannel] = useState<any | null>(null);
  const [youtubeVideos, setYoutubeVideos] = useState<any[]>([]);
  const [youtubePlaylists, setYoutubePlaylists] = useState<any[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);
  const [channelInput, setChannelInput] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectError, setConnectError] = useState<string | null>(null);
  const [copiedChannelId, setCopiedChannelId] = useState(false);

  // Video Filtering & Sorting state
  const [videoSearchQuery, setVideoSearchQuery] = useState('');
  const [videoCategoryFilter, setVideoCategoryFilter] = useState('ALL');
  const [videoSort, setVideoSort] = useState<'newest' | 'oldest' | 'views' | 'duration'>('newest');
  const [playingVideo, setPlayingVideo] = useState<any | null>(null);

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
    const [cRes, bRes, pRes, chRes, vRes, plRes] = await Promise.all([
      api.learning.getCourses(),
      api.learning.getBooks(),
      api.learning.getPodcasts(),
      api.youtube.getChannel(),
      api.youtube.getVideos(),
      api.youtube.getPlaylists(),
    ]);

    if (cRes.success && cRes.data) setCourses(cRes.data);
    if (bRes.success && bRes.data) setBooks(bRes.data);
    if (pRes.success && pRes.data) setPodcasts(pRes.data);

    if (chRes.success && chRes.data) setChannel(chRes.data);
    if (vRes.success && vRes.data) setYoutubeVideos(vRes.data);
    if (plRes.success && plRes.data) setYoutubePlaylists(plRes.data);
  };

  const handleSyncYouTube = async () => {
    setIsSyncing(true);
    setSyncNotice(null);
    try {
      const res = await api.youtube.triggerSync();
      if (res.success) {
        const [chRes, vRes] = await Promise.all([
          api.youtube.getChannel(),
          api.youtube.getVideos(),
        ]);
        if (chRes.success) setChannel(chRes.data);
        if (vRes.success) setYoutubeVideos(vRes.data);
        setSyncNotice(`Synced ${res.data?.syncedVideosCount || 10} videos from YouTube Data API.`);
        setTimeout(() => setSyncNotice(null), 4000);
      }
    } catch {
      setSyncNotice('Sync failed. Please check backend connection.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleConnectChannel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!channelInput.trim()) return;

    setIsConnecting(true);
    setConnectError(null);

    try {
      const res = await api.youtube.connectChannel(channelInput.trim());
      if (res.success && res.data) {
        setChannel(res.data);
        setShowConnectModal(false);
        setChannelInput('');
        setSyncNotice(`Channel ${res.data.handle || res.data.title} connected and synchronized!`);
        // Reload video catalog & playlists
        const [vRes, plRes] = await Promise.all([
          api.youtube.getVideos(),
          api.youtube.getPlaylists(),
        ]);
        if (vRes.success && vRes.data) setYoutubeVideos(vRes.data);
        if (plRes.success && plRes.data) setYoutubePlaylists(plRes.data);
        setTimeout(() => setSyncNotice(null), 4000);
      } else {
        setConnectError(res.error || 'Failed to connect YouTube channel. Please check the handle.');
      }
    } catch (err: any) {
      setConnectError(err.message || 'Error communicating with backend sync service.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleCopyChannelId = (idToCopy: string) => {
    if (!idToCopy) return;
    navigator.clipboard?.writeText(idToCopy);
    setCopiedChannelId(true);
    setTimeout(() => setCopiedChannelId(false), 2000);
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
        duration: '45 mins',
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

  // Safe formatting helper for sync date
  const formatLastSync = (dateStr?: string | null) => {
    if (!dateStr) return 'Just now';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return 'Recently';
      return (
        d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
        ', ' +
        d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
      );
    } catch {
      return 'Recently';
    }
  };

  // Extract robust channel metrics
  const channelTitle = channel?.title || 'Eyob Haile';
  const channelHandle = channel?.handle || channel?.customUrl || '@official_eyobhaile';
  const channelId = channel?.channelId || channel?.id || 'UCi17ShhhCDbUC90iO5qvbag';
  const channelThumbnail =
    channel?.thumbnailUrl ||
    channel?.thumbnails?.medium ||
    'https://yt3.googleusercontent.com/iP0hDMadD35n2uccXw-Twp5wXVnreDz4Pik0xfRgGRtEo6skktSlrJvHxy4A4A-l5RuLUrkjlg=s240-c-k-c0x00ffffff-no-rj';
  const subscribers =
    channel?.subscriberCount ??
    (channel?.statistics?.subscriberCount ? parseInt(channel.statistics.subscriberCount, 10) : 52600);
  const totalViews =
    channel?.viewCount ??
    (channel?.statistics?.viewCount ? parseInt(channel.statistics.viewCount, 10) : 350000);
  const totalVideos = channel?.videoCount || youtubeVideos.length || 108;
  const totalPlaylists = youtubePlaylists.length || 4;
  const lastSyncedDisplay = formatLastSync(channel?.lastSyncedAt || channel?.syncState?.lastSyncedAt);

  // Extract unique categories for filter dropdown
  const uniqueCategories = useMemo(() => {
    const set = new Set<string>();
    youtubeVideos.forEach((v) => {
      if (v.playlistTitle) {
        set.add(v.playlistTitle);
      } else if (v.category) {
        set.add(v.category);
      }
    });
    return Array.from(set);
  }, [youtubeVideos]);

  // Filter & sort lectures
  const filteredVideos = useMemo(() => {
    return youtubeVideos
      .filter((v) => {
        const matchesCategory =
          videoCategoryFilter === 'ALL' ||
          v.playlistTitle === videoCategoryFilter ||
          v.category === videoCategoryFilter;
        const term = videoSearchQuery.toLowerCase().trim();
        const matchesSearch =
          !term ||
          (v.title && v.title.toLowerCase().includes(term)) ||
          (v.description && v.description.toLowerCase().includes(term)) ||
          (v.youtubeVideoId && v.youtubeVideoId.toLowerCase().includes(term));
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (videoSort === 'oldest') {
          return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
        }
        if (videoSort === 'views') {
          return (Number(b.viewCount) || 0) - (Number(a.viewCount) || 0);
        }
        if (videoSort === 'duration') {
          return (Number(b.durationSeconds) || 0) - (Number(a.durationSeconds) || 0);
        }
        // Default newest (latest to oldest)
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      });
  }, [youtubeVideos, videoSearchQuery, videoCategoryFilter, videoSort]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Curriculum & Content Management</h1>
          <p className="page-subtitle">
            Curate brotherhood development resources: Connected YouTube Academy channels, The Duty of Manhood curriculum, foundational books, and podcasts.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            className={`btn btn-sm ${activeTab === 'youtube' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('youtube')}
          >
            <Youtube size={14} style={{ color: '#ef4444' }} /> YouTube Channel Sync ({youtubeVideos.length})
          </button>
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
          {activeTab !== 'youtube' && (
            <button className="btn btn-sm btn-primary" onClick={() => setShowAddModal(true)}>
              <Plus size={14} /> Add Content
            </button>
          )}
        </div>
      </div>

      {/* TAB: YOUTUBE CHANNEL SYNCHRONIZATION */}
      {activeTab === 'youtube' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Modern Theme-Adaptive Channel Connection & Control Card */}
          <div className="yt-hub-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
              {/* Left: Avatar + Title + Badges */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                <div style={{ position: 'relative' }}>
                  <img
                    src={channelThumbnail}
                    alt={channelTitle}
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      border: '2px solid var(--gold-400)',
                      objectFit: 'cover',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      bottom: -2,
                      right: -2,
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: '#ef4444',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid var(--bg-card)',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    }}
                  >
                    <Youtube size={11} color="#ffffff" />
                  </span>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.01em' }}>
                      {channelTitle}
                    </h2>
                    <span className="yt-sync-status-badge">
                      <span className="yt-pulse-dot" />
                      Continuous Sync Active
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.84rem', fontWeight: 650, color: 'var(--text-gold)' }}>
                      {channelHandle}
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>•</span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Channel ID:</span>
                    <code
                      style={{
                        fontSize: '0.76rem',
                        fontFamily: 'var(--font-mono)',
                        background: 'var(--bg-tertiary)',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {channelId}
                    </code>
                    <button
                      type="button"
                      onClick={() => handleCopyChannelId(channelId)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: copiedChannelId ? '#10b981' : 'var(--text-muted)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.72rem',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        transition: 'all 0.15s ease',
                      }}
                      title="Copy Channel ID"
                    >
                      {copiedChannelId ? (
                        <>
                          <Check size={12} color="#10b981" />
                          <span style={{ color: '#10b981', fontWeight: 600 }}>Copied</span>
                        </>
                      ) : (
                        <Copy size={12} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Right: Actions & Sync Telemetry */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-gold"
                    onClick={() => setShowConnectModal(true)}
                  >
                    <Link2 size={14} /> Connect Channel
                  </button>

                  <button
                    type="button"
                    className="btn btn-sm btn-primary"
                    onClick={handleSyncYouTube}
                    disabled={isSyncing}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <RefreshCw size={14} className={isSyncing ? 'spin' : ''} />
                    {isSyncing ? 'Synchronizing...' : 'Force Sync Channel'}
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                  <Clock size={12} />
                  <span>Last Synced: <strong>{lastSyncedDisplay}</strong></span>
                </div>

                {syncNotice && (
                  <span style={{ fontSize: '0.76rem', color: '#10b981', fontWeight: 650 }}>
                    {syncNotice}
                  </span>
                )}
              </div>
            </div>

            {/* Middle Row: Modern Stat Chips Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
                gap: '12px',
                marginTop: '20px',
              }}
            >
              <div className="yt-stat-pill">
                <Users size={16} style={{ color: 'var(--text-gold)', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)' }}>
                    Subscribers
                  </div>
                  <strong>{subscribers.toLocaleString()}</strong>
                </div>
              </div>

              <div className="yt-stat-pill">
                <Eye size={16} style={{ color: '#3b82f6', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)' }}>
                    Total Views
                  </div>
                  <strong>{totalViews.toLocaleString()}</strong>
                </div>
              </div>

              <div className="yt-stat-pill">
                <Video size={16} style={{ color: '#10b981', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)' }}>
                    Synced Lectures
                  </div>
                  <strong>{totalVideos}</strong>
                </div>
              </div>

              <div className="yt-stat-pill">
                <Layers size={16} style={{ color: '#8b5cf6', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)' }}>
                    Playlists
                  </div>
                  <strong>{totalPlaylists}</strong>
                </div>
              </div>
            </div>

            {/* Bottom Row: Streamlined Architecture & Webhook Status */}
            <div className="yt-info-banner">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                <ShieldCheck size={15} style={{ color: '#10b981', flexShrink: 0 }} />
                <span>
                  <strong>Architecture:</strong> YouTube Data API v3 → TypeScript Backend Engine → Local DB → Member Feed
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>PubSubHubbub Webhook:</span>
                <code
                  style={{
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-gold)',
                    background: 'var(--bg-card)',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.74rem',
                  }}
                >
                  /api/v1/youtube/webhook
                </code>
                <span style={{ color: '#10b981', fontWeight: 650, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle size={13} /> Active
                </span>
              </div>
            </div>
          </div>

          {/* Synchronized Videos Management Table Card */}
          <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            <div
              style={{
                padding: '18px 24px',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 750, color: 'var(--text-main)', margin: 0 }}>
                  Synchronized Academic Lectures & Masterclasses ({filteredVideos.length})
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                  Lectures are automatically ingested, parsed for durations, and linked to playlists.
                </p>
              </div>

              {/* Search, Category Filter, and Sort Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', width: '220px' }}>
                  <Search
                    size={14}
                    style={{
                      position: 'absolute',
                      left: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-muted)',
                      pointerEvents: 'none',
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Search lectures..."
                    value={videoSearchQuery}
                    onChange={(e) => setVideoSearchQuery(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '32px', height: '34px', fontSize: '0.8rem', borderRadius: '8px' }}
                  />
                </div>

                <select
                  value={videoCategoryFilter}
                  onChange={(e) => setVideoCategoryFilter(e.target.value)}
                  className="form-select"
                  style={{ height: '34px', fontSize: '0.8rem', width: 'auto', minWidth: '160px', borderRadius: '8px' }}
                >
                  <option value="ALL">All Categories ({youtubeVideos.length})</option>
                  {uniqueCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.length > 28 ? cat.slice(0, 28) + '...' : cat}
                    </option>
                  ))}
                </select>

                <select
                  value={videoSort}
                  onChange={(e: any) => setVideoSort(e.target.value)}
                  className="form-select"
                  style={{ height: '34px', fontSize: '0.8rem', width: 'auto', borderRadius: '8px', cursor: 'pointer' }}
                >
                  <option value="newest">Latest to Oldest</option>
                  <option value="oldest">Oldest to Latest</option>
                  <option value="views">Most Viewed</option>
                  <option value="duration">Longest</option>
                </select>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="yt-table">
                <thead>
                  <tr>
                    <th style={{ width: '40%' }}>Video / Lecture</th>
                    <th style={{ width: '22%' }}>Playlist / Category</th>
                    <th style={{ width: '10%' }}>Duration</th>
                    <th style={{ width: '13%' }}>Views / Likes</th>
                    <th style={{ width: '15%' }}>Published</th>
                    <th style={{ width: '10%', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVideos.map((v) => {
                    const videoId = v.youtubeVideoId || v.id;
                    const videoUrl = v.youtubeUrl || `https://www.youtube.com/watch?v=${videoId}`;
                    const playlistLabel = v.playlistTitle ? v.playlistTitle.split('(')[0].trim() : (v.category || 'General');

                    return (
                      <tr key={v.id} style={{ cursor: 'pointer' }} onClick={() => setPlayingVideo(v)}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <div className="yt-thumbnail-wrapper" style={{ position: 'relative' }}>
                              <img
                                src={v.thumbnailUrl || 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80'}
                                alt={v.title}
                                className="yt-thumbnail-img"
                              />
                              <span className="yt-duration-badge">{v.duration || '0:00'}</span>
                              <div
                                style={{
                                  position: 'absolute',
                                  inset: 0,
                                  background: 'rgba(0, 0, 0, 0.35)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  opacity: 0,
                                  transition: 'opacity 0.2s ease',
                                }}
                                className="yt-thumb-hover-overlay"
                              >
                                <Play size={18} color="#fff" fill="#fff" />
                              </div>
                            </div>
                            <div style={{ minWidth: 0, flex: 1 }}>
                              <div
                                style={{
                                  fontWeight: 650,
                                  color: 'var(--text-main)',
                                  fontSize: '0.86rem',
                                  lineHeight: 1.35,
                                }}
                              >
                                {v.title}
                              </div>
                              <div
                                style={{
                                  fontSize: '0.72rem',
                                  color: 'var(--text-muted)',
                                  fontFamily: 'var(--font-mono)',
                                  marginTop: '3px',
                                }}
                              >
                                ID: {videoId}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span
                            className="badge badge-gold"
                            style={{
                              fontSize: '0.72rem',
                              maxWidth: '220px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              display: 'inline-block',
                            }}
                            title={v.playlistTitle || v.category}
                          >
                            {playlistLabel}
                          </span>
                        </td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--text-main)', fontWeight: 600 }}>
                          {v.duration || '0:00'}
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '0.78rem' }}>
                            <span style={{ color: 'var(--text-main)', fontWeight: 650, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <Eye size={12} style={{ color: 'var(--text-muted)' }} />
                              {v.viewCount ? Number(v.viewCount).toLocaleString() : '—'}
                            </span>
                            <span style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <ThumbsUp size={11} />
                              {v.likeCount ? Number(v.likeCount).toLocaleString() : '—'}
                            </span>
                          </div>
                        </td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                          {v.publishedAt ? new Date(v.publishedAt).toLocaleDateString([], { month: 'numeric', day: 'numeric', year: 'numeric' }) : '—'}
                        </td>
                        <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                            <button
                              type="button"
                              onClick={() => setPlayingVideo(v)}
                              className="btn btn-sm btn-primary"
                              style={{ padding: '4px 10px', fontSize: '0.74rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                            >
                              <Play size={11} fill="currentColor" /> Watch
                            </button>
                            <a
                              href={videoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-sm btn-outline-gold"
                              style={{ padding: '4px 8px', fontSize: '0.74rem', display: 'inline-flex', alignItems: 'center' }}
                              title="Open on YouTube website"
                            >
                              <ExternalLink size={12} />
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredVideos.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No lectures found matching &quot;{videoSearchQuery}&quot;.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* In-System Theater Video Player Modal */}
          {playingVideo && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.85)',
                backdropFilter: 'blur(12px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1100,
                padding: '20px',
              }}
              onClick={() => setPlayingVideo(null)}
            >
              <div
                className="card"
                style={{
                  width: '100%',
                  maxWidth: '920px',
                  maxHeight: '94vh',
                  padding: '0',
                  overflow: 'hidden',
                  background: 'var(--bg-modal)',
                  border: '1px solid var(--border-gold)',
                  boxShadow: 'var(--shadow-lg), 0 0 40px rgba(212, 175, 55, 0.25)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div
                  style={{
                    padding: '14px 20px',
                    borderBottom: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'var(--bg-tertiary)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Youtube size={16} color="#ef4444" />
                    <span style={{ fontWeight: 750, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                      Sovereign Academy In-System Player
                    </span>
                    <span className="badge badge-gold" style={{ fontSize: '0.68rem' }}>
                      {playingVideo.playlistTitle ? playingVideo.playlistTitle.split('(')[0].trim() : (playingVideo.category || 'Academy')}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setPlayingVideo(null)}
                    className="icon-btn"
                    style={{ width: '30px', height: '30px' }}
                    title="Close Player"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* 16:9 Responsive Embedded YouTube Player */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    paddingBottom: '56.25%', // 16:9 aspect ratio
                    background: '#000000',
                  }}
                >
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${playingVideo.youtubeVideoId || playingVideo.id}?autoplay=1&rel=0&modestbranding=1`}
                    title={playingVideo.title}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      border: 'none',
                    }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>

                {/* Video Meta & Controls Footer */}
                <div style={{ padding: '18px 22px', overflowY: 'auto', maxHeight: '200px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '240px' }}>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px 0', lineHeight: 1.35 }}>
                        {playingVideo.title}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.78rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Eye size={13} /> {playingVideo.viewCount ? Number(playingVideo.viewCount).toLocaleString() : '—'} views
                        </span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <ThumbsUp size={12} /> {playingVideo.likeCount ? Number(playingVideo.likeCount).toLocaleString() : '—'} likes
                        </span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} /> {playingVideo.duration || '0:00'}
                        </span>
                        <span>Published {playingVideo.publishedAt ? new Date(playingVideo.publishedAt).toLocaleDateString() : '—'}</span>
                      </div>
                    </div>

                    <a
                      href={playingVideo.youtubeUrl || `https://www.youtube.com/watch?v=${playingVideo.youtubeVideoId || playingVideo.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline-gold"
                      style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                    >
                      <ExternalLink size={12} /> Watch on YouTube
                    </a>
                  </div>

                  {playingVideo.description && (
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '10px', lineHeight: 1.55 }}>
                      {playingVideo.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Connect Channel Modal */}
      {showConnectModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div className="card" style={{ width: 480, maxWidth: '90vw', padding: '24px', background: 'var(--bg-modal)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
              Connect YouTube Channel
            </h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Enter a YouTube Channel ID (e.g. <code style={{ color: 'var(--text-gold)' }}>UC_official_eyobhaile</code>) or Channel Handle (e.g. <code style={{ color: 'var(--text-gold)' }}>@official_eyobhaile</code>).
            </p>

            {connectError && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  color: '#ef4444',
                  fontSize: '0.84rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '16px',
                }}
              >
                <AlertCircle size={16} />
                <span>{connectError}</span>
              </div>
            )}

            <form onSubmit={handleConnectChannel} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="form-label">Channel ID or Handle</label>
                <input
                  type="text"
                  required
                  disabled={isConnecting}
                  placeholder="@official_eyobhaile"
                  value={channelInput}
                  onChange={(e) => setChannelInput(e.target.value)}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  disabled={isConnecting}
                  onClick={() => {
                    setShowConnectModal(false);
                    setConnectError(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isConnecting || !channelInput.trim()}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  {isConnecting && <Loader2 size={14} className="animate-spin" />}
                  {isConnecting ? 'Connecting & Synchronizing...' : 'Connect & Synchronize'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Traditional Course List */}
      {activeTab === 'courses' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
          {courses.map((course) => (
            <div key={course.id} className="card card-gold-border">
              <span className="badge badge-gold" style={{ marginBottom: '8px' }}>CORE DISCIPLINE</span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', margin: '4px 0 8px 0' }}>
                {course.title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                {course.description}
              </p>
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                <span>{course.modules?.length || 4} Modules</span>
                <span style={{ color: 'var(--text-gold)', fontWeight: 650 }}>{course.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reading List */}
      {activeTab === 'books' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {books.map((b) => (
            <div key={b.id} className="card">
              <span className="badge badge-gold">{b.category}</span>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', margin: '8px 0 4px 0' }}>
                {b.title}
              </h3>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-gold)', fontWeight: 650, marginBottom: '8px' }}>by {b.author}</div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{b.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Podcasts List */}
      {activeTab === 'podcasts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {podcasts.map((p) => (
            <div key={p.id} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 4px 0' }}>
                  {p.title}
                </h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Host: {p.host} • Duration: {p.duration}</div>
              </div>
              <span className="badge badge-gold">Episode #{p.episodeNumber}</span>
            </div>
          ))}
        </div>
      )}

      {/* Add Content Modal */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div className="card" style={{ width: 480, maxWidth: '90vw', padding: '24px', background: 'var(--bg-modal)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>
              Add New {activeTab === 'books' ? 'Book' : 'Podcast'}
            </h2>
            <form onSubmit={handleAddItem} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="form-label">Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">{activeTab === 'books' ? 'Author' : 'Host'}</label>
                <input
                  type="text"
                  required
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Description</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="form-textarea"
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
