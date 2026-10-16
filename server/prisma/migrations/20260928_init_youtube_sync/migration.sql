-- =========================================================================
-- PostgreSQL DDL Migration: YouTube Channel & Video Continuous Synchronization
-- Target: @official_eyobhaile YouTube Integration
-- =========================================================================

-- 1. YouTube Channels Table
CREATE TABLE IF NOT EXISTS "youtube_channels" (
    "id" VARCHAR(64) PRIMARY KEY,
    "channelId" VARCHAR(128) NOT NULL UNIQUE,
    "handle" VARCHAR(128) NOT NULL DEFAULT '@official_eyobhaile',
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "customUrl" VARCHAR(255),
    "publishedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "thumbnailDefaultUrl" TEXT,
    "thumbnailMediumUrl" TEXT,
    "thumbnailHighUrl" TEXT,
    "uploadsPlaylistId" VARCHAR(128) NOT NULL,
    "subscriberCount" BIGINT NOT NULL DEFAULT 0,
    "viewCount" BIGINT NOT NULL DEFAULT 0,
    "videoCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
    "lastSyncedAt" TIMESTAMP WITH TIME ZONE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index for channel lookup
CREATE INDEX IF NOT EXISTS "idx_youtube_channels_handle" ON "youtube_channels" ("handle");

-- 2. YouTube Videos Table
CREATE TABLE IF NOT EXISTS "youtube_videos" (
    "id" VARCHAR(64) PRIMARY KEY,
    "youtubeVideoId" VARCHAR(64) NOT NULL UNIQUE,
    "channelId" VARCHAR(128) NOT NULL,
    "title" VARCHAR(500) NOT NULL,
    "description" TEXT NOT NULL,
    "thumbnailDefaultUrl" TEXT,
    "thumbnailMediumUrl" TEXT,
    "thumbnailHighUrl" TEXT,
    "thumbnailMaxresUrl" TEXT,
    "publishedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "duration" VARCHAR(32) NOT NULL,
    "durationSeconds" INTEGER NOT NULL DEFAULT 0,
    "liveBroadcastContent" VARCHAR(32) NOT NULL DEFAULT 'none',
    "viewCount" BIGINT NOT NULL DEFAULT 0,
    "likeCount" BIGINT NOT NULL DEFAULT 0,
    "commentCount" BIGINT NOT NULL DEFAULT 0,
    "youtubeUrl" TEXT NOT NULL,
    "playlistId" VARCHAR(128),
    "playlistTitle" VARCHAR(255),
    "category" VARCHAR(128) DEFAULT 'Curriculum',
    "lastSyncedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk_youtube_videos_channel" FOREIGN KEY ("channelId") 
        REFERENCES "youtube_channels" ("channelId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- High-performance indices for sorting and filtering
CREATE INDEX IF NOT EXISTS "idx_youtube_videos_published_at_desc" ON "youtube_videos" ("publishedAt" DESC);
CREATE INDEX IF NOT EXISTS "idx_youtube_videos_view_count_desc" ON "youtube_videos" ("viewCount" DESC);
CREATE INDEX IF NOT EXISTS "idx_youtube_videos_channel_id" ON "youtube_videos" ("channelId");
CREATE INDEX IF NOT EXISTS "idx_youtube_videos_playlist_id" ON "youtube_videos" ("playlistId");

-- 3. YouTube Sync State & Telemetry Log Table
CREATE TABLE IF NOT EXISTS "youtube_sync_state" (
    "id" VARCHAR(64) PRIMARY KEY,
    "channelId" VARCHAR(128) NOT NULL,
    "syncType" VARCHAR(64) NOT NULL DEFAULT 'FULL_POLL', -- 'FULL_POLL', 'WEBHOOK_PUSH', 'SCHEDULED_RECONCILE'
    "status" VARCHAR(32) NOT NULL DEFAULT 'SUCCESS',    -- 'PENDING', 'SUCCESS', 'FAILED'
    "videosDiscovered" INTEGER NOT NULL DEFAULT 0,
    "videosInserted" INTEGER NOT NULL DEFAULT 0,
    "videosUpdated" INTEGER NOT NULL DEFAULT 0,
    "videosSkipped" INTEGER NOT NULL DEFAULT 0,
    "errorLog" TEXT,
    "startedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP WITH TIME ZONE,
    CONSTRAINT "fk_youtube_sync_channel" FOREIGN KEY ("channelId") 
        REFERENCES "youtube_channels" ("channelId") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "idx_youtube_sync_state_channel_started" ON "youtube_sync_state" ("channelId", "startedAt" DESC);
