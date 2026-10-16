// Type definitions for YouTube Synchronization Module

export interface YouTubeChannelDTO {
  id: string;
  channelId: string;
  handle: string;
  title: string;
  description: string;
  customUrl?: string | null;
  publishedAt: string;
  thumbnailUrl: string;
  uploadsPlaylistId: string;
  subscriberCount: number;
  viewCount: number;
  videoCount: number;
  isActive: boolean;
  lastSyncedAt?: string | null;
  syncState?: {
    lastStatus: string;
    lastSyncedAt?: string | null;
    syncType: string;
  };
}

export interface YouTubeVideoDTO {
  id: string;
  youtubeVideoId: string;
  channelId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  thumbnailUrls: {
    default?: string | null;
    medium?: string | null;
    high?: string | null;
    maxres?: string | null;
  };
  publishedAt: string;
  duration: string;
  durationSeconds: number;
  liveBroadcastContent: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  youtubeUrl: string;
  playlistId?: string | null;
  playlistTitle?: string | null;
  category?: string | null;
  lastSyncedAt: string;
}

export interface YouTubeSyncStatusDTO {
  channelId: string;
  handle: string;
  isConfigured: boolean;
  hasApiKey: boolean;
  lastSyncAt: string | null;
  status: 'IDLE' | 'SYNCING' | 'SUCCESS' | 'FAILED';
  totalVideosInDatabase: number;
  latestSyncState: {
    syncType: string;
    status: string;
    videosDiscovered: number;
    videosInserted: number;
    videosUpdated: number;
    videosSkipped: number;
    startedAt: string;
    completedAt?: string | null;
    errorLog?: string | null;
  } | null;
  recentLogs: Array<{
    id: string;
    syncType: string;
    status: string;
    videosDiscovered: number;
    videosInserted: number;
    videosUpdated: number;
    startedAt: string;
    completedAt?: string | null;
  }>;
}

export interface SyncResult {
  success: boolean;
  channelId: string;
  syncType: 'FULL_POLL' | 'WEBHOOK_PUSH' | 'SCHEDULED_RECONCILE';
  videosDiscovered: number;
  videosInserted: number;
  videosUpdated: number;
  videosSkipped: number;
  durationMs: number;
  error?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export type VideoSortOption = 'newest' | 'oldest' | 'most_viewed' | 'most viewed';
