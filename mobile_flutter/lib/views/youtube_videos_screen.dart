import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../models/youtube_channel.dart';
import '../models/youtube_video.dart';
import '../repositories/youtube_repository.dart';

class YouTubeVideosScreen extends StatefulWidget {
  final YouTubeRepository repository;

  const YouTubeVideosScreen({Key? key, required this.repository}) : super(key: key);

  @override
  State<YouTubeVideosScreen> createState() => _YouTubeVideosScreenState();
}

class _YouTubeVideosScreenState extends State<YouTubeVideosScreen> {
  // State variables
  YouTubeChannelProfile? _channel;
  List<YouTubeVideoItem> _videos = [];
  YouTubePagination? _pagination;

  bool _isLoading = true;
  bool _isRefreshing = false;
  String? _errorMessage;

  // Filters & sorting
  String _selectedSort = 'newest'; // 'newest', 'oldest', 'most_viewed'
  String _searchQuery = '';
  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _loadInitialData();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  /// Load channel profile and video catalog from TypeScript backend
  Future<void> _loadInitialData() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Fetch channel profile & video catalog concurrently
      final channelFuture = widget.repository.getChannel();
      final videosFuture = widget.repository.getVideos(
        page: 1,
        limit: 50,
        sort: _selectedSort,
        search: _searchQuery.isNotEmpty ? _searchQuery : null,
      );

      final results = await Future.wait([channelFuture, videosFuture]);

      setState(() {
        _channel = results[0] as YouTubeChannelProfile;
        final videoResult = results[1] as ({List<YouTubeVideoItem> videos, YouTubePagination pagination});
        _videos = videoResult.videos;
        _pagination = videoResult.pagination;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _errorMessage = e.toString().replaceFirst('Exception: ', '');
        _isLoading = false;
      });
    }
  }

  /// Pull-to-refresh handler: reloads videos from backend
  Future<void> _handleRefresh() async {
    setState(() {
      _isRefreshing = true;
    });

    try {
      final videoResult = await widget.repository.getVideos(
        page: 1,
        limit: 50,
        sort: _selectedSort,
        search: _searchQuery.isNotEmpty ? _searchQuery : null,
      );

      final channel = await widget.repository.getChannel();

      setState(() {
        _channel = channel;
        _videos = videoResult.videos;
        _pagination = videoResult.pagination;
        _isRefreshing = false;
      });
    } catch (e) {
      setState(() {
        _isRefreshing = false;
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to refresh: ${e.toString()}'),
            backgroundColor: Colors.redAccent,
          ),
        );
      }
    }
  }

  /// Change sorting filter and reload
  void _changeSort(String newSort) {
    if (_selectedSort == newSort) return;
    setState(() {
      _selectedSort = newSort;
    });
    _loadInitialData();
  }

  /// Play REAL YouTube video using its authentic youtubeVideoId
  Future<void> _playRealYouTubeVideo(YouTubeVideoItem video) async {
    final videoId = video.youtubeVideoId;
    final webUrl = Uri.parse('https://www.youtube.com/watch?v=$videoId');
    final appUrl = Uri.parse('vnd.youtube:$videoId');

    try {
      // First attempt: Open native YouTube mobile app
      if (await canLaunchUrl(appUrl)) {
        await launchUrl(appUrl, mode: LaunchMode.externalApplication);
      } else {
        // Fallback: Open YouTube web player in browser
        await launchUrl(webUrl, mode: LaunchMode.externalApplication);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Could not open YouTube video: $e'),
            backgroundColor: Colors.redAccent,
          ),
        );
      }
    }
  }

  /// Trigger manual catalog synchronization on backend
  Future<void> _triggerBackendSync() async {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Triggering catalog synchronization on backend...'),
        duration: Duration(seconds: 2),
      ),
    );

    try {
      await widget.repository.triggerSync();
      await _handleRefresh();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Synchronization complete! Catalog updated.'),
            backgroundColor: Color(0xFF10B981),
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Sync failed: $e'),
            backgroundColor: Colors.redAccent,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    const bgColor = Color(0xFF0B0D13);
    const cardColor = Color(0xFF131722);
    const goldColor = Color(0xFFD4AF37);
    const textMuted = Color(0xFF9CA3AF);

    return Scaffold(
      backgroundColor: bgColor,
      appBar: AppBar(
        backgroundColor: cardColor,
        elevation: 0,
        title: const Text(
          '@official_eyobhaile Broadcasts',
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 17, color: Colors.white),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.sync, color: goldColor),
            tooltip: 'Synchronize Catalog',
            onPressed: _triggerBackendSync,
          ),
        ],
      ),
      body: _buildBody(bgColor, cardColor, goldColor, textMuted),
    );
  }

  Widget _buildBody(Color bgColor, Color cardColor, Color goldColor, Color textMuted) {
    // 1. LOADING STATE
    if (_isLoading) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const CircularProgressIndicator(color: Color(0xFFD4AF37)),
            const SizedBox(height: 16),
            Text(
              'Loading broadcasts from Sovereign backend...',
              style: TextStyle(color: textMuted, fontSize: 13),
            ),
          ],
        ),
      );
    }

    // 2. ERROR STATE
    if (_errorMessage != null) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(28.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.redAccent.withOpacity(0.12),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.cloud_off_rounded, color: Colors.redAccent, size: 48),
              ),
              const SizedBox(height: 16),
              const Text(
                'Connection Failure',
                style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              Text(
                _errorMessage!,
                textAlign: TextAlign.center,
                style: TextStyle(color: textMuted, fontSize: 13, height: 1.4),
              ),
              const SizedBox(height: 24),
              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: goldColor,
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
                onPressed: _loadInitialData,
                icon: const Icon(Icons.refresh, color: Colors.black, size: 18),
                label: const Text(
                  'Retry Connection',
                  style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: 14),
                ),
              ),
            ],
          ),
        ),
      );
    }

    // 3. MAIN CONTENT WITH PULL-TO-REFRESH
    return RefreshIndicator(
      color: goldColor,
      backgroundColor: cardColor,
      onRefresh: _handleRefresh,
      child: CustomScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        slivers: [
          // Channel Profile Header
          if (_channel != null)
            SliverToBoxAdapter(
              child: _buildChannelCard(_channel!, cardColor, goldColor, textMuted),
            ),

          // Search & Sort Bar
          SliverToBoxAdapter(
            child: _buildFilterBar(cardColor, goldColor, textMuted),
          ),

          // 4. EMPTY STATE
          if (_videos.isEmpty)
            SliverFillRemaining(
              hasScrollBody: false,
              child: Center(
                child: Padding(
                  padding: const EdgeInsets.all(32.0),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.video_library_outlined, size: 56, color: textMuted.withOpacity(0.5)),
                      const SizedBox(height: 16),
                      const Text(
                        'No Broadcasts Found',
                        style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        _searchQuery.isNotEmpty
                            ? 'No videos match "$_searchQuery". Try clearing your search.'
                            : 'The catalog is currently empty. Run synchronization to import videos.',
                        textAlign: TextAlign.center,
                        style: TextStyle(color: textMuted, fontSize: 13),
                      ),
                      const SizedBox(height: 20),
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(backgroundColor: cardColor),
                        onPressed: _searchQuery.isNotEmpty
                            ? () {
                                _searchController.clear();
                                setState(() => _searchQuery = '');
                                _loadInitialData();
                              }
                            : _triggerBackendSync,
                        child: Text(_searchQuery.isNotEmpty ? 'Clear Search' : 'Trigger Sync',
                            style: const TextStyle(color: Colors.white)),
                      )
                    ],
                  ),
                ),
              ),
            )
          else
            // Video Feed List
            SliverPadding(
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 32),
              sliver: SliverList(
                delegate: SliverChildBuilderDelegate(
                  (context, index) {
                    final video = _videos[index];
                    return _buildVideoCard(video, cardColor, goldColor, textMuted);
                  },
                  childCount: _videos.length,
                ),
              ),
            ),
        ],
      ),
    );
  }

  /// Official Channel Card Widget
  Widget _buildChannelCard(
      YouTubeChannelProfile channel, Color cardColor, Color goldColor, Color textMuted) {
    return Container(
      margin: const EdgeInsets.fromLTRB(16, 16, 16, 8),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: cardColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: goldColor.withOpacity(0.3), width: 1),
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 26,
            backgroundImage: NetworkImage(channel.thumbnailUrl),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        channel.title,
                        style: const TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: const Color(0xFF10B981).withOpacity(0.15),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Text(
                        'SYNCED',
                        style: TextStyle(color: Color(0xFF10B981), fontSize: 10, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  '${channel.customUrl} • ${channel.subscriberCount} Subscribers • ${_pagination?.total ?? channel.videoCount} Videos',
                  style: TextStyle(color: textMuted, fontSize: 11),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  /// Filter and Sorting Toolbar
  Widget _buildFilterBar(Color cardColor, Color goldColor, Color textMuted) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Column(
        children: [
          // Search input
          TextField(
            controller: _searchController,
            style: const TextStyle(color: Colors.white, fontSize: 13),
            decoration: InputDecoration(
              hintText: 'Search synchronized lectures...',
              hintStyle: TextStyle(color: textMuted, fontSize: 13),
              prefixIcon: Icon(Icons.search, color: textMuted, size: 18),
              suffixIcon: _searchQuery.isNotEmpty
                  ? IconButton(
                      icon: const Icon(Icons.clear, color: Colors.white54, size: 16),
                      onPressed: () {
                        _searchController.clear();
                        setState(() => _searchQuery = '');
                        _loadInitialData();
                      },
                    )
                  : null,
              filled: true,
              fillColor: cardColor,
              contentPadding: const EdgeInsets.symmetric(vertical: 0),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(color: Colors.white.withOpacity(0.08)),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(color: Colors.white.withOpacity(0.08)),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(color: goldColor.withOpacity(0.5)),
              ),
            ),
            onSubmitted: (val) {
              setState(() => _searchQuery = val);
              _loadInitialData();
            },
          ),
          const SizedBox(height: 10),

          // Sorting Tabs
          Row(
            children: [
              Text('Sort:', style: TextStyle(color: textMuted, fontSize: 12, fontWeight: FontWeight.w600)),
              const SizedBox(width: 8),
              _buildSortChip('Newest', 'newest', goldColor, cardColor),
              const SizedBox(width: 6),
              _buildSortChip('Oldest', 'oldest', goldColor, cardColor),
              const SizedBox(width: 6),
              _buildSortChip('Most Viewed', 'most_viewed', goldColor, cardColor),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSortChip(String label, String value, Color goldColor, Color cardColor) {
    final isSelected = _selectedSort == value;
    return GestureDetector(
      onTap: () => _changeSort(value),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
        decoration: BoxDecoration(
          color: isSelected ? goldColor : cardColor,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: isSelected ? goldColor : Colors.white.withOpacity(0.08)),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: isSelected ? Colors.black : Colors.white70,
            fontSize: 11,
            fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
          ),
        ),
      ),
    );
  }

  /// Video Card Item: Displays thumbnail, title, published date, duration, views
  Widget _buildVideoCard(
      YouTubeVideoItem video, Color cardColor, Color goldColor, Color textMuted) {
    final formattedDate = DateTime.tryParse(video.publishedAt)?.toLocal().toString().split(' ')[0] ?? '';

    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      decoration: BoxDecoration(
        color: cardColor,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: Colors.white.withOpacity(0.07)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.35),
            blurRadius: 8,
            offset: const Offset(0, 3),
          )
        ],
      ),
      child: InkWell(
        borderRadius: BorderRadius.circular(14),
        onTap: () => _playRealYouTubeVideo(video),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Thumbnail with Duration Overlay & Play Badge
            Stack(
              alignment: Alignment.center,
              children: [
                ClipRRect(
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(14)),
                  child: AspectRatio(
                    aspectRatio: 16 / 9,
                    child: Image.network(
                      video.thumbnailUrl,
                      fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) => Container(
                        color: Colors.black38,
                        child: const Center(child: Icon(Icons.broken_image, color: Colors.white30)),
                      ),
                    ),
                  ),
                ),

                // Play trigger
                Container(
                  width: 52,
                  height: 52,
                  decoration: BoxDecoration(
                    color: goldColor.withOpacity(0.92),
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(color: Colors.black.withOpacity(0.6), blurRadius: 10),
                    ],
                  ),
                  child: const Icon(Icons.play_arrow, size: 32, color: Colors.black),
                ),

                // Duration badge
                Positioned(
                  bottom: 8,
                  right: 8,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
                    decoration: BoxDecoration(
                      color: Colors.black.withOpacity(0.85),
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Text(
                      video.duration,
                      style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
                    ),
                  ),
                ),
              ],
            ),

            // Metadata: Title, Published Date, Views
            Padding(
              padding: const EdgeInsets.all(14),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    video.title,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      height: 1.3,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Icon(Icons.visibility_outlined, size: 13, color: textMuted),
                      const SizedBox(width: 4),
                      Text(
                        '${video.viewCount.toString()} views',
                        style: TextStyle(color: textMuted, fontSize: 12),
                      ),
                      const SizedBox(width: 14),
                      Icon(Icons.calendar_today_outlined, size: 12, color: textMuted),
                      const SizedBox(width: 4),
                      Text(
                        formattedDate,
                        style: TextStyle(color: textMuted, fontSize: 12),
                      ),
                      const Spacer(),
                      Text(
                        'Watch on YouTube',
                        style: TextStyle(color: goldColor, fontSize: 11, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(width: 2),
                      Icon(Icons.arrow_forward_ios, size: 10, color: goldColor),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
