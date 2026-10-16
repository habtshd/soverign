import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/youtube_channel.dart';
import '../models/youtube_video.dart';

class YouTubeRepository {
  final String baseUrl;
  final String? authToken;

  YouTubeRepository({
    this.baseUrl = 'http://10.0.2.2:5200/api/youtube', // Default for Android emulator. Use 'http://localhost:5200/api/youtube' for desktop/web
    this.authToken,
  });

  Map<String, String> get _headers => {
        'Content-Type': 'application/json',
        if (authToken != null) 'Authorization': 'Bearer $authToken',
      };

  /// Fetch connected YouTube channel metadata for @official_eyobhaile
  Future<YouTubeChannelProfile> getChannel() async {
    final response = await http.get(
      Uri.parse('$baseUrl/channel'),
      headers: _headers,
    );

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      if (data['success'] == true) {
        return YouTubeChannelProfile.fromJson(data['data']);
      }
      throw Exception(data['error'] ?? 'Failed to load channel profile');
    } else {
      throw Exception('Server returned ${response.statusCode} while loading channel profile');
    }
  }

  /// Fetch paginated and sorted videos from TypeScript backend
  Future<{List<YouTubeVideoItem> videos, YouTubePagination pagination}> getVideos({
    int page = 1,
    int limit = 20,
    String sort = 'newest', // 'newest', 'oldest', 'most_viewed'
    String? search,
    String? playlistId,
  }) async {
    final queryParams = <String, String>{
      'page': page.toString(),
      'limit': limit.toString(),
      'sort': sort,
    };

    if (search != null && search.trim().isNotEmpty) {
      queryParams['search'] = search.trim();
    }
    if (playlistId != null && playlistId != 'ALL') {
      queryParams['playlistId'] = playlistId;
    }

    final uri = Uri.parse('$baseUrl/videos').replace(queryParameters: queryParams);
    final response = await http.get(uri, headers: _headers);

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      if (data['success'] == true) {
        final List list = data['data'] ?? [];
        final videos = list.map((item) => YouTubeVideoItem.fromJson(item)).toList();
        final pagination = data['pagination'] != null
            ? YouTubePagination.fromJson(data['pagination'])
            : YouTubePagination(page: page, limit: limit, total: videos.length, totalPages: 1, hasNext: false, hasPrev: false);
        return (videos: videos, pagination: pagination);
      }
      throw Exception(data['error'] ?? 'Failed to load videos from catalog');
    } else {
      throw Exception('Server returned ${response.statusCode} while loading video catalog');
    }
  }

  /// Fetch single video by its YouTube video ID
  Future<YouTubeVideoItem> getVideoById(String videoId) async {
    final response = await http.get(
      Uri.parse('$baseUrl/videos/$videoId'),
      headers: _headers,
    );

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      if (data['success'] == true && data['data'] != null) {
        return YouTubeVideoItem.fromJson(data['data']);
      }
      throw Exception(data['error'] ?? 'Video not found');
    } else {
      throw Exception('Video not found or server error (${response.statusCode})');
    }
  }

  /// Trigger manual catalog sync on backend
  Future<Map<String, dynamic>> triggerSync() async {
    final response = await http.post(
      Uri.parse('$baseUrl/sync'),
      headers: _headers,
    );

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return data;
    } else {
      final data = json.decode(response.body);
      throw Exception(data['error'] ?? 'Sync failed (${response.statusCode})');
    }
  }

  /// Fetch latest sync telemetry status
  Future<Map<String, dynamic>> getSyncStatus() async {
    final response = await http.get(
      Uri.parse('$baseUrl/sync/status'),
      headers: _headers,
    );

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to get sync status (${response.statusCode})');
    }
  }
}
