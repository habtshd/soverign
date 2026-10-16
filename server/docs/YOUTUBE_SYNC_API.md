# Sovereign YouTube Channel Continuous Synchronization Module

## Architectural Overview

This module imports all publicly available video lectures from **[@official_eyobhaile](https://www.youtube.com/@official_eyobhaile)** into the Sovereign database catalog and keeps it continuously synchronized with YouTube.

```
YouTube @official_eyobhaile
           │
           ├──────────────────────────────┐
           ▼ (1. Push Notification)       ▼ (2. Uploads Playlist)
    Google PubSubHubbub           YouTube Data API v3
           │                              │
           ▼                              ▼
  POST /api/youtube/webhook      POST /api/youtube/sync
  (HMAC SHA-1 Signature)         (Idempotent Upsert)
           │                              │
           └──────────────┬───────────────┘
                          │
                          ▼
            PostgreSQL Database Catalog
            (youtube_channels, youtube_videos, youtube_sync_state)
                          │
                          ▼
             TypeScript REST API (Port 5200)
             (/api/youtube/channel, /api/youtube/videos)
                          │
                          ▼
             Flutter Mobile & Web Clients
                          │
                          ▼
             Real Native YouTube Player
             (youtube://watch?v=VIDEO_ID)
```

---

## Database Tables

### 1. `youtube_channels`
- `id` (VARCHAR PRIMARY KEY)
- `channelId` (VARCHAR UNIQUE) - YouTube Channel ID (`UC_official_eyobhaile`)
- `handle` (VARCHAR) - `@official_eyobhaile`
- `title` (VARCHAR) - Channel Title
- `description` (TEXT) - Channel bio and brotherhood description
- `customUrl` (VARCHAR)
- `publishedAt` (TIMESTAMP WITH TIME ZONE)
- `uploadsPlaylistId` (VARCHAR) - Uploads playlist ID (`UU_official_eyobhaile`)
- `subscriberCount` (BIGINT)
- `viewCount` (BIGINT)
- `videoCount` (INTEGER)
- `isActive` (BOOLEAN)
- `lastSyncedAt` (TIMESTAMP WITH TIME ZONE)

### 2. `youtube_videos`
- `id` (VARCHAR PRIMARY KEY)
- `youtubeVideoId` (VARCHAR UNIQUE) - Original YouTube alphanumeric video ID (e.g., `eyob_weapon_selfdiscipline`)
- `channelId` (VARCHAR FOREIGN KEY)
- `title` (VARCHAR)
- `description` (TEXT)
- `thumbnailDefaultUrl`, `thumbnailMediumUrl`, `thumbnailHighUrl`, `thumbnailMaxresUrl`
- `publishedAt` (TIMESTAMP WITH TIME ZONE)
- `duration` (VARCHAR) - Formatted duration (e.g., `"24:18"`)
- `durationSeconds` (INTEGER)
- `liveBroadcastContent` (VARCHAR) - `"none"`, `"upcoming"`, `"live"`
- `viewCount` (BIGINT)
- `likeCount` (BIGINT)
- `commentCount` (BIGINT)
- `youtubeUrl` (TEXT) - Direct URL: `https://www.youtube.com/watch?v=VIDEO_ID`
- `playlistId` (VARCHAR)
- `playlistTitle` (VARCHAR)
- `category` (VARCHAR)
- `lastSyncedAt` (TIMESTAMP WITH TIME ZONE)

### 3. `youtube_sync_state`
- `id` (VARCHAR PRIMARY KEY)
- `channelId` (VARCHAR)
- `syncType` (VARCHAR) - `FULL_POLL`, `WEBHOOK_PUSH`, `SCHEDULED_RECONCILE`
- `status` (VARCHAR) - `PENDING`, `SUCCESS`, `FAILED`
- `videosDiscovered` (INTEGER)
- `videosInserted` (INTEGER)
- `videosUpdated` (INTEGER)
- `videosSkipped` (INTEGER)
- `errorLog` (TEXT)
- `startedAt` (TIMESTAMP WITH TIME ZONE)
- `completedAt` (TIMESTAMP WITH TIME ZONE)

---

## REST API Endpoints

### 1. Channel Profile
`GET /api/youtube/channel`
Returns the channel profile, handle `@official_eyobhaile`, uploads playlist ID, subscribers, and sync telemetry.

**Sample Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "channelId": "UC_official_eyobhaile",
    "handle": "@official_eyobhaile",
    "title": "Eyob Haile | Official Channel",
    "uploadsPlaylistId": "UU_official_eyobhaile",
    "subscriberCount": 68400,
    "viewCount": 1245800,
    "videoCount": 48,
    "lastSyncedAt": "2026-09-28T12:20:38.615Z",
    "syncState": {
      "lastStatus": "SUCCESS",
      "syncType": "SCHEDULED_RECONCILE"
    }
  }
}
```

### 2. Video Catalog (Paginated & Sorted)
`GET /api/youtube/videos`
- `page`: Page number (default: 1)
- `limit`: Number of videos per page (default: 20, max: 100)
- `sort`: `newest` (default), `oldest`, `most_viewed`
- `search`: Query text in title/description
- `playlistId`: Filter by specific playlist

**Sample Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "7e074a6e-c93d-4196-ade6-e57019ec4a63",
      "youtubeVideoId": "eyob_weapon_selfdiscipline",
      "channelId": "UC_official_eyobhaile",
      "title": "አስፈሪው መሳሪያህ ይህ ነው። | Here is your most dangerous weapon.",
      "description": "በህይወትህ ውስጥ ትልቁ እና እጅግ አስፈሪው መሳሪያህ...",
      "thumbnailUrl": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800",
      "publishedAt": "2024-03-22T14:00:00.000Z",
      "duration": "24:18",
      "durationSeconds": 1458,
      "viewCount": 78400,
      "likeCount": 6200,
      "commentCount": 480,
      "youtubeUrl": "https://www.youtube.com/watch?v=eyob_weapon_selfdiscipline",
      "playlistTitle": "ወንድነት በኤምፓየሮች ዘመን (Masculinity in the Age of Empires)",
      "category": "Masculinity"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 48,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### 3. Single Video Lookup
`GET /api/youtube/videos/:videoId`
Fetches a single video by its YouTube video ID or internal ID. Returns 404 if not in catalog.

### 4. Sync Telemetry Status
`GET /api/youtube/sync/status`
Returns real-time synchronization health, timestamp of last sync, total videos in catalog, and recent sync audit logs.

### 5. Trigger Manual Sync
`POST /api/youtube/sync`
Performs an idempotent catalog synchronization. Rate-limited to 1 request per 15 seconds per IP.

### 6. PubSubHubbub Handshake Verification
`GET /api/youtube/webhook`
Responds to Google's subscription challenge with `hub.challenge`.

### 7. PubSubHubbub Push Notification Receiver
`POST /api/youtube/webhook`
Consumes Google Atom XML push feeds. Validates `x-hub-signature` (HMAC SHA-1). Identifies video ID, updates existing records if title/description changed, or inserts new video.

---

## Security Implementation
1. **Server-Side API Key**: `YOUTUBE_API_KEY` is loaded strictly on the backend.
2. **Never Exposed**: Flutter clients communicate solely with `/api/youtube/*`. No Google credentials are sent in HTTP responses.
3. **Webhook HMAC Validation**: Webhook payloads are verified against `YOUTUBE_WEBHOOK_SECRET`.
4. **Rate Limiting**: `POST /api/youtube/sync` enforces cooldown to prevent YouTube API quota exhaustion.
