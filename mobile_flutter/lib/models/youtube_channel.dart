// Flutter Data Model: YouTube Channel Profile for @official_eyobhaile

class YouTubeChannelProfile {
  final String id;
  final String title;
  final String description;
  final String customUrl;
  final String publishedAt;
  final String thumbnailUrl;
  final int subscriberCount;
  final int viewCount;
  final int videoCount;
  final String syncStatus;
  final String lastSyncAt;

  YouTubeChannelProfile({
    required this.id,
    required this.title,
    required this.description,
    required this.customUrl,
    required this.publishedAt,
    required this.thumbnailUrl,
    required this.subscriberCount,
    required this.viewCount,
    required this.videoCount,
    required this.syncStatus,
    required this.lastSyncAt,
  });

  factory YouTubeChannelProfile.fromJson(Map<String, dynamic> json) {
    final stats = json['statistics'] as Map<String, dynamic>? ?? {};
    final syncState = json['syncState'] as Map<String, dynamic>? ?? {};
    final thumbs = json['thumbnails'] as Map<String, dynamic>? ?? {};

    return YouTubeChannelProfile(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      customUrl: json['customUrl'] ?? '@official_eyobhaile',
      publishedAt: json['publishedAt'] ?? '',
      thumbnailUrl: thumbs['high'] ?? thumbs['medium'] ?? thumbs['default'] ?? '',
      subscriberCount: int.tryParse(stats['subscriberCount']?.toString() ?? '0') ?? 0,
      viewCount: int.tryParse(stats['viewCount']?.toString() ?? '0') ?? 0,
      videoCount: int.tryParse(stats['videoCount']?.toString() ?? '0') ?? 0,
      syncStatus: syncState['status'] ?? 'SYNCED',
      lastSyncAt: syncState['lastSyncAt'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'customUrl': customUrl,
      'publishedAt': publishedAt,
      'thumbnailUrl': thumbnailUrl,
      'subscriberCount': subscriberCount,
      'viewCount': viewCount,
      'videoCount': videoCount,
      'syncStatus': syncStatus,
      'lastSyncAt': lastSyncAt,
    };
  }
}
