# Sovereign Men's Club — Flutter YouTube Synchronization Integration

## Architecture Overview
The system implements the requested enterprise sync pipeline:
```
YouTube Data API v3 + PubSubHubbub Webhook
                 ↓
TypeScript Backend (Express + YouTubeService)
  - Port: 5200
  - Mount: /api/v1/youtube
                 ↓
  Database (dev.db / PostgreSQL / In-Memory Store)
                 ↓
Flutter Mobile App & Web Client
```

## Directory Structure
- `lib/models/youtube_channel.dart`: Model for `@official_eyobhaile` channel profile, subscriber counts, and sync status.
- `lib/models/youtube_video.dart`: Models for video items, durations, view metrics, and playlists.
- `lib/repositories/youtube_repository.dart`: HTTP repository talking to `/api/v1/youtube/*`.
- `lib/views/academic_broadcast_screen.dart`: Complete screen featuring the Obsidian Dark & Sovereign Gold styling, active lecture player, playlist filter chips, and video feed.

## Dependencies for `pubspec.yaml`
```yaml
dependencies:
  flutter:
    sdk: flutter
  http: ^1.2.0
  url_launcher: ^6.3.0  # Launch official channel and broadcast lectures directly
```

## Endpoints Consumed:
- `GET /api/v1/youtube/channel`: Returns channel profile for `@official_eyobhaile` (68.4K subscribers, Eyob Haile).
- `GET /api/v1/youtube/videos`: Returns synchronized video lectures with playlists and stats.
- `GET /api/v1/youtube/playlists`: Returns foundational playlists (*ወንድነት በኤምፓየሮች ዘመን*, *The Hidden War*, etc.).
- `POST /api/v1/youtube/sync`: Force refresh from YouTube Data API (Admin authorized).
