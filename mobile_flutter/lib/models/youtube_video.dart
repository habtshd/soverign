// Flutter Data Model: YouTube Video & Playlist items for Sovereign Platform

class YouTubeVideoItem {
  final String id;
  final String youtubeVideoId;
  final String channelId;
  final String title;
  final String description;
  final String thumbnailUrl;
  final String publishedAt;
  final String duration;
  final int durationSeconds;
  final String liveBroadcastContent;
  final int viewCount;
  final int likeCount;
  final int commentCount;
  final String youtubeUrl;
  final String? playlistId;
  final String? playlistTitle;
  final String category;
  final String lastSyncedAt;

  YouTubeVideoItem({
    required this.id,
    required this.youtubeVideoId,
    required this.channelId,
    required this.title,
    required this.description,
    required this.thumbnailUrl,
    required this.publishedAt,
    required this.duration,
    required this.durationSeconds,
    this.liveBroadcastContent = 'none',
    required this.viewCount,
    required this.likeCount,
    required this.commentCount,
    required this.youtubeUrl,
    this.playlistId,
    this.playlistTitle,
    required this.category,
    required this.lastSyncedAt,
  });

  factory YouTubeVideoItem.fromJson(Map<String, dynamic> json) {
    final stats = json['statistics'] as Map<String, dynamic>? ?? {};
    final rawThumbs = json['thumbnailUrls'] as Map<String, dynamic>? ?? {};
    final vId = (json['youtubeVideoId'] ?? json['videoId'] ?? '').toString();

    final thumb = (json['thumbnailUrl'] ??
            rawThumbs['high'] ??
            rawThumbs['medium'] ??
            rawThumbs['default'] ??
            'https://i.ytimg.com/vi/$vId/hqdefault.jpg')
        .toString();

    return YouTubeVideoItem(
      id: (json['id'] ?? vId).toString(),
      youtubeVideoId: vId,
      channelId: (json['channelId'] ?? 'UC_official_eyobhaile').toString(),
      title: (json['title'] ?? 'Untitled Broadcast').toString(),
      description: (json['description'] ?? '').toString(),
      thumbnailUrl: thumb,
      publishedAt: (json['publishedAt'] ?? DateTime.now().toIso8601String()).toString(),
      duration: (json['duration'] ?? '0:00').toString(),
      durationSeconds: int.tryParse(json['durationSeconds']?.toString() ?? '0') ?? 0,
      liveBroadcastContent: (json['liveBroadcastContent'] ?? 'none').toString(),
      viewCount: int.tryParse(json['viewCount']?.toString() ?? stats['views']?.toString() ?? '0') ?? 0,
      likeCount: int.tryParse(json['likeCount']?.toString() ?? stats['likes']?.toString() ?? '0') ?? 0,
      commentCount: int.tryParse(json['commentCount']?.toString() ?? stats['comments']?.toString() ?? '0') ?? 0,
      youtubeUrl: (json['youtubeUrl'] ?? 'https://www.youtube.com/watch?v=$vId').toString(),
      playlistId: json['playlistId']?.toString(),
      playlistTitle: json['playlistTitle']?.toString(),
      category: (json['category'] ?? 'Curriculum').toString(),
      lastSyncedAt: (json['lastSyncedAt'] ?? DateTime.now().toIso8601String()).toString(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'youtubeVideoId': youtubeVideoId,
      'channelId': channelId,
      'title': title,
      'description': description,
      'thumbnailUrl': thumbnailUrl,
      'publishedAt': publishedAt,
      'duration': duration,
      'durationSeconds': durationSeconds,
      'viewCount': viewCount,
      'likeCount': likeCount,
      'commentCount': commentCount,
      'youtubeUrl': youtubeUrl,
      'playlistId': playlistId,
      'playlistTitle': playlistTitle,
      'category': category,
      'lastSyncedAt': lastSyncedAt,
    };
  }
}

class YouTubePagination {
  final int page;
  final int limit;
  final int total;
  final int totalPages;
  final boolean hasNext;
  final boolean hasPrev;

  YouTubePagination({
    required this.page,
    required this.limit,
    required this.total,
    required this.totalPages,
    required this.hasNext,
    required this.hasPrev,
  });

  factory YouTubePagination.fromJson(Map<String, dynamic> json) {
    return YouTubePagination(
      page: json['page'] ?? 1,
      limit: json['limit'] ?? 20,
      total: json['total'] ?? 0,
      totalPages: json['totalPages'] ?? 1,
      hasNext: json['hasNext'] ?? false,
      hasPrev: json['hasPrev'] ?? false,
    );
  }
}

typedef boolean = bool;
