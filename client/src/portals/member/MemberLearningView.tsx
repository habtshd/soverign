import React, { useEffect, useState, useMemo } from 'react';
import { api } from '../../api/client.js';
import {
  BookOpen,
  Headphones,
  CheckSquare,
  Square,
  PlayCircle,
  Play,
  X,
  Maximize2,
  ThumbsUp,
  ExternalLink,
  Youtube,
  RefreshCw,
  Eye,
  Clock,
  Sparkles,
  Search,
  Radio,
  Check,
  Share2,
} from 'lucide-react';

export const MemberLearningView: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [books, setBooks] = useState<any[]>([]);
  const [podcasts, setPodcasts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'courses' | 'broadcasts' | 'books' | 'podcasts'>('broadcasts');

  // YouTube Channel & Synced Video state
  const [channel, setChannel] = useState<any | null>(null);
  const [youtubeVideos, setYoutubeVideos] = useState<any[]>([]);
  const [youtubePlaylists, setYoutubePlaylists] = useState<any[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<any | null>(null);
  const [theaterModalVideo, setTheaterModalVideo] = useState<any | null>(null);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string>('ALL');
  const [videoSearchQuery, setVideoSearchQuery] = useState('');
  const [videoSort, setVideoSort] = useState<'newest' | 'oldest' | 'views' | 'duration'>('newest');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  useEffect(() => {
    loadLearningData();
  }, []);

  const loadLearningData = async () => {
    const [cRes, bRes, pRes, chRes, vRes, plRes] = await Promise.all([
      api.learning.getCourses(),
      api.learning.getBooks(),
      api.learning.getPodcasts(),
      api.youtube.getChannel(),
      api.youtube.getVideos(),
      api.youtube.getPlaylists(),
    ]);

    if (cRes.success && cRes.data) {
      setCourses(cRes.data);
      if (cRes.data.length > 0) {
        loadCourseDetail(cRes.data[0].slug);
      }
    }
    if (bRes.success && bRes.data) setBooks(bRes.data);
    if (pRes.success && pRes.data) setPodcasts(pRes.data);

    if (chRes.success && chRes.data) setChannel(chRes.data);
    if (vRes.success && vRes.data) {
      const sorted = [...vRes.data].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      setYoutubeVideos(sorted);
      if (sorted.length > 0) {
        setSelectedVideo(sorted[0]);
      }
    }
    if (plRes.success && plRes.data) setYoutubePlaylists(plRes.data);
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

  const handleSyncYouTube = async () => {
    setIsSyncing(true);
    setSyncFeedback(null);
    try {
      const res = await api.youtube.triggerSync();
      if (res.success) {
        const [chRes, vRes] = await Promise.all([
          api.youtube.getChannel(),
          api.youtube.getVideos({ playlistId: selectedPlaylistId, search: videoSearchQuery }),
        ]);
        if (chRes.success) setChannel(chRes.data);
        if (vRes.success) {
          const sorted = [...vRes.data].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
          setYoutubeVideos(sorted);
        }
        setSyncFeedback(`Successfully synchronized ${res.data.syncedVideosCount} videos via YouTube Data API`);
        setTimeout(() => setSyncFeedback(null), 3500);
      }
    } catch {
      setSyncFeedback('Sync failed. Please check network connection.');
    } finally {
      setIsSyncing(false);
    }
  };

  const filteredVideos = useMemo(() => {
    return youtubeVideos
      .filter((v) => {
        const matchesPlaylist =
          selectedPlaylistId === 'ALL' || v.playlistId === selectedPlaylistId;
        const matchesSearch =
          !videoSearchQuery.trim() ||
          v.title.toLowerCase().includes(videoSearchQuery.toLowerCase()) ||
          v.description.toLowerCase().includes(videoSearchQuery.toLowerCase());
        return matchesPlaylist && matchesSearch;
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
        // Default newest to oldest (Latest first)
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      });
  }, [youtubeVideos, selectedPlaylistId, videoSearchQuery, videoSort]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Academic & Intellectual Mastery</h1>
          <p className="page-subtitle">
            Curated brotherhood doctrine, video masterclasses, and synchronized YouTube academy broadcasts.
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            className={`btn btn-sm ${activeTab === 'broadcasts' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('broadcasts')}
          >
            <Youtube size={14} style={{ color: '#ef4444' }} /> Academy Broadcasts ({youtubeVideos.length})
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'courses' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('courses')}
          >
            <BookOpen size={14} /> Curriculum Modules ({courses.length})
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'books' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('books')}
          >
            Library ({books.length})
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'podcasts' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('podcasts')}
          >
            <Headphones size={14} /> Podcast Hub
          </button>
        </div>
      </div>

      {/* TAB 1: ACADEMY YOUTUBE BROADCASTS */}
      {activeTab === 'broadcasts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Synchronized Channel Banner */}
          {channel && (
            <div className="yt-hub-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ position: 'relative' }}>
                    <img
                      src={channel.thumbnailUrl || channel.thumbnails?.medium || 'https://yt3.googleusercontent.com/iP0hDMadD35n2uccXw-Twp5wXVnreDz4Pik0xfRgGRtEo6skktSlrJvHxy4A4A-l5RuLUrkjlg=s240-c-k-c0x00ffffff-no-rj'}
                      alt={channel.title}
                      style={{
                        width: 54,
                        height: 54,
                        borderRadius: '50%',
                        border: '2px solid var(--gold-400)',
                        objectFit: 'cover',
                      }}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        bottom: -2,
                        right: -2,
                        background: '#ef4444',
                        borderRadius: '50%',
                        width: 18,
                        height: 18,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid var(--bg-card)',
                      }}
                    >
                      <Youtube size={10} color="#fff" />
                    </span>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <h2 style={{ fontSize: '1.18rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                        {channel.title}
                      </h2>
                      <span className="yt-sync-status-badge">
                        <span className="yt-pulse-dot" />
                        Continuous Sync Active
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <span style={{ color: 'var(--text-gold)', fontWeight: 650 }}>{channel.handle || channel.customUrl}</span>
                      <span>•</span>
                      <span>{(channel.subscriberCount ?? parseInt(channel.statistics?.subscriberCount || '52600', 10)).toLocaleString()} Brothers Subscribed</span>
                      <span>•</span>
                      <span>{youtubeVideos.length || channel.videoCount || 15} Synchronized Lectures</span>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {syncFeedback && (
                    <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 600 }}>
                      {syncFeedback}
                    </span>
                  )}

                  <button
                    type="button"
                    className="btn btn-sm btn-outline-gold"
                    onClick={handleSyncYouTube}
                    disabled={isSyncing}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <RefreshCw size={13} className={isSyncing ? 'spin' : ''} />
                    {isSyncing ? 'Syncing...' : 'Sync YouTube Channel'}
                  </button>

                  <a
                    href={`https://youtube.com/${channel.handle || channel.customUrl || ''}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-primary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <ExternalLink size={13} /> Open Channel
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Active Theater Player (When a video is selected) */}
          {selectedVideo && (
            <div
              className="card"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                padding: '24px',
                borderRadius: '16px',
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(280px, 1fr)', gap: '24px' }}>
                {/* Video Broadcast Showcase (Authentic In-System Embedded YouTube Player) */}
                <div>
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      paddingBottom: '56.25%', // 16:9 Aspect Ratio
                      height: 0,
                      borderRadius: '12px',
                      overflow: 'hidden',
                      background: '#000000',
                      boxShadow: '0 12px 30px rgba(0, 0, 0, 0.65)',
                      border: '1px solid var(--border-gold)',
                    }}
                  >
                    <iframe
                      key={selectedVideo.youtubeVideoId || selectedVideo.id}
                      src={`https://www.youtube-nocookie.com/embed/${selectedVideo.youtubeVideoId || selectedVideo.id}?autoplay=0&rel=0&modestbranding=1`}
                      title={selectedVideo.title}
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

                  <div style={{ marginTop: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="badge badge-gold">{selectedVideo.category || 'Discipline'}</span>
                      {selectedVideo.playlistTitle && (
                        <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                          {selectedVideo.playlistTitle}
                        </span>
                      )}
                    </div>

                    <h2 style={{ fontSize: '1.28rem', fontWeight: 750, color: 'var(--text-main)', marginTop: '8px' }}>
                      {selectedVideo.title}
                    </h2>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Eye size={13} /> {(selectedVideo.viewCount ?? selectedVideo.statistics?.views)?.toLocaleString() || '—'} views
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={13} /> {selectedVideo.duration}
                      </span>
                      <span>Published {new Date(selectedVideo.publishedAt).toLocaleDateString()}</span>
                    </div>

                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', marginTop: '12px', lineHeight: '1.6' }}>
                      {selectedVideo.description}
                    </p>
                  </div>
                </div>

                {/* Sidebar: Lecture Notes & Direct Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div
                    style={{
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '12px',
                      padding: '16px',
                    }}
                  >
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-gold)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      ✦ Sovereign Masterclass Notes
                    </div>
                    <div style={{ fontSize: '0.83rem', color: 'var(--text-main)', marginTop: '8px', lineHeight: '1.5' }}>
                      This video lecture plays directly inside Sovereign via synchronized channel integration with @official_eyobhaile.
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
                      <button
                        type="button"
                        onClick={() => setTheaterModalVideo(selectedVideo)}
                        className="btn btn-sm btn-primary"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                      >
                        <Maximize2 size={13} /> Fullscreen Theater Mode
                      </button>
                      <a
                        href={selectedVideo.youtubeUrl || selectedVideo.videoUrl || `https://www.youtube.com/watch?v=${selectedVideo.youtubeVideoId || selectedVideo.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-gold"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                      >
                        <ExternalLink size={13} /> Watch on YouTube
                      </a>
                    </div>
                  </div>

                  {/* Playlists quick list */}
                  <div
                    style={{
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '12px',
                      padding: '16px',
                    }}
                  >
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                      Curated Playlists
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => setSelectedPlaylistId('ALL')}
                        style={{
                          textAlign: 'left',
                          background: selectedPlaylistId === 'ALL' ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                          border: 'none',
                          color: selectedPlaylistId === 'ALL' ? 'var(--gold-400)' : 'var(--text-secondary)',
                          padding: '6px 8px',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: selectedPlaylistId === 'ALL' ? 700 : 500,
                          cursor: 'pointer',
                        }}
                      >
                        All Synchronized Videos ({youtubeVideos.length})
                      </button>
                      {youtubePlaylists.map((pl) => (
                        <button
                          key={pl.id}
                          type="button"
                          onClick={() => setSelectedPlaylistId(pl.id)}
                          style={{
                            textAlign: 'left',
                            background: selectedPlaylistId === pl.id ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                            border: 'none',
                            color: selectedPlaylistId === pl.id ? 'var(--gold-400)' : 'var(--text-secondary)',
                            padding: '6px 8px',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: selectedPlaylistId === pl.id ? 700 : 500,
                            cursor: 'pointer',
                          }}
                        >
                          {pl.title} ({pl.itemCount})
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Search and Filters Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', width: 340 }}>
              <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search synchronized lectures..."
                value={videoSearchQuery}
                onChange={(e) => setVideoSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  height: 38,
                  borderRadius: '10px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  paddingLeft: 34,
                  paddingRight: 12,
                  color: 'var(--text-main)',
                  fontSize: '0.84rem',
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <button
                  className={`btn btn-sm ${selectedPlaylistId === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setSelectedPlaylistId('ALL')}
                >
                  All Lectures
                </button>
                {youtubePlaylists.map((pl) => (
                  <button
                    key={pl.id}
                    className={`btn btn-sm ${selectedPlaylistId === pl.id ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setSelectedPlaylistId(pl.id)}
                  >
                    {pl.title.split(':')[0]}
                  </button>
                ))}
              </div>

              {/* Sort Selector: Latest to Oldest by default */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Sort:</span>
                <select
                  value={videoSort}
                  onChange={(e: any) => setVideoSort(e.target.value)}
                  className="form-select"
                  style={{ height: '34px', fontSize: '0.8rem', width: 'auto', borderRadius: '8px', cursor: 'pointer' }}
                >
                  <option value="newest">Latest to Oldest</option>
                  <option value="oldest">Oldest to Latest</option>
                  <option value="views">Most Viewed</option>
                  <option value="duration">Longest Duration</option>
                </select>
              </div>
            </div>
          </div>

          {/* Videos Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '20px' }}>
            {filteredVideos.map((v) => {
              const isSelected = selectedVideo?.id === v.id;
              const videoId = v.youtubeVideoId || v.id;
              const youtubeUrl = v.youtubeUrl || v.videoUrl || `https://www.youtube.com/watch?v=${videoId}`;
              return (
                <div
                  key={v.id}
                  onClick={() => {
                    setSelectedVideo(v);
                    window.scrollTo({ top: 120, behavior: 'smooth' });
                  }}
                  className={`card ${isSelected ? 'card-gold-border' : ''}`}
                  style={{
                    cursor: 'pointer',
                    padding: '0',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 0 20px rgba(212, 175, 55, 0.3)' : undefined,
                  }}
                >
                  {/* Thumbnail Container */}
                  <div style={{ position: 'relative', width: '100%', height: 165, overflow: 'hidden', background: '#000' }}>
                    <img
                      src={v.thumbnailUrl || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
                      alt={v.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.25s ease' }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 8,
                        right: 8,
                        background: 'rgba(0, 0, 0, 0.85)',
                        color: '#fff',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {v.duration}
                    </div>

                    <div
                      style={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        background: 'rgba(0, 0, 0, 0.65)',
                        backdropFilter: 'blur(8px)',
                        color: 'var(--gold-400)',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        padding: '2px 7px',
                        borderRadius: '4px',
                        textTransform: 'uppercase',
                      }}
                    >
                      {v.category}
                    </div>

                    {/* Sovereign Play Overlay */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(0, 0, 0, 0.35)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: isSelected ? 1 : 0.8,
                        transition: 'opacity 0.2s ease',
                      }}
                    >
                      <div
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: '50%',
                          background: isSelected ? 'var(--gold-gradient)' : 'rgba(0, 0, 0, 0.7)',
                          border: '1px solid var(--border-gold)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isSelected ? '#000' : 'var(--gold-400)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                        }}
                      >
                        <Play size={16} fill="currentColor" />
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h3
                      style={{
                        fontSize: '0.92rem',
                        fontWeight: 700,
                        color: isSelected ? 'var(--gold-400)' : 'var(--text-main)',
                        lineHeight: '1.4',
                        marginBottom: '6px',
                      }}
                    >
                      {v.title}
                    </h3>

                    <p
                      style={{
                        fontSize: '0.78rem',
                        color: 'var(--text-secondary)',
                        lineHeight: '1.45',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        marginBottom: '12px',
                        flex: 1,
                      }}
                    >
                      {v.description}
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.74rem',
                        color: 'var(--text-muted)',
                        borderTop: '1px solid var(--border-subtle)',
                        paddingTop: '10px',
                        marginTop: 'auto',
                      }}
                    >
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Eye size={12} /> {(v.viewCount ?? v.statistics?.views)?.toLocaleString() || '—'} views
                      </span>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }} onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedVideo(v);
                            window.scrollTo({ top: 120, behavior: 'smooth' });
                          }}
                          className="btn btn-sm btn-primary"
                          style={{ padding: '3px 8px', fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Play size={10} fill="currentColor" /> Watch
                        </button>
                        <button
                          type="button"
                          onClick={() => setTheaterModalVideo(v)}
                          className="btn btn-sm btn-outline-gold"
                          style={{ padding: '3px 7px', fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center' }}
                          title="Cinema Theater Mode"
                        >
                          <Maximize2 size={11} />
                        </button>
                        <a
                          href={youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-outline-gold"
                          style={{ padding: '3px 7px', fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center' }}
                          title="Open on YouTube"
                        >
                          <ExternalLink size={11} />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: TRADITIONAL COURSES & MODULES */}
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

      {/* TAB 3: LIBRARY */}
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

      {/* TAB 4: PODCASTS */}
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

      {/* In-System Fullscreen Theater Cinema Modal */}
      {theaterModalVideo && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0, 0, 0, 0.88)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
          onClick={() => setTheaterModalVideo(null)}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '1040px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-gold)',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.95)',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 20px',
                borderBottom: '1px solid var(--border-subtle)',
                background: 'var(--bg-tertiary)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Youtube size={18} color="#ef4444" />
                <span style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Sovereign Theater • {theaterModalVideo.category || 'Academy Lecture'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setTheaterModalVideo(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--text-main)',
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* 16:9 Responsive Player */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                paddingBottom: '56.25%',
                background: '#000000',
              }}
            >
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${theaterModalVideo.youtubeVideoId || theaterModalVideo.id}?autoplay=1&rel=0&modestbranding=1`}
                title={theaterModalVideo.title}
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

            {/* Meta Footer */}
            <div style={{ padding: '18px 22px', background: 'var(--bg-card)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '240px' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px 0', lineHeight: 1.35 }}>
                    {theaterModalVideo.title}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.78rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Eye size={13} /> {(theaterModalVideo.viewCount ?? theaterModalVideo.statistics?.views)?.toLocaleString() || '—'} views
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={13} /> {theaterModalVideo.duration}
                    </span>
                    <span>Published {new Date(theaterModalVideo.publishedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <a
                  href={theaterModalVideo.youtubeUrl || theaterModalVideo.videoUrl || `https://www.youtube.com/watch?v=${theaterModalVideo.youtubeVideoId || theaterModalVideo.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-outline-gold"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <ExternalLink size={12} /> Open on YouTube
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
