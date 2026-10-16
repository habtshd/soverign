import 'package:flutter/material.dart';
import '../models/youtube_channel.dart';
import '../models/youtube_video.dart';
import '../repositories/youtube_repository.dart';

class AcademicBroadcastScreen extends StatefulWidget {
  final YouTubeRepository repository;

  const AcademicBroadcastScreen({Key? key, required this.repository}) : super(key: key);

  @override
  State<AcademicBroadcastScreen> createState() => _AcademicBroadcastScreenState();
}

class _AcademicBroadcastScreenState extends State<AcademicBroadcastScreen> {
  YouTubeChannelProfile? _channel;
  List<YouTubePlaylistItem> _playlists = [];
  List<YouTubeVideoItem> _videos = [];
  YouTubeVideoItem? _selectedVideo;
  String _selectedPlaylistId = 'ALL';
  bool _isLoading = true;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _loadAllContent();
  }

  Future<void> _loadAllContent() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final channelFuture = widget.repository.getChannel();
      final playlistsFuture = widget.repository.getPlaylists();
      final videosFuture = widget.repository.getVideos(
        playlistId: _selectedPlaylistId == 'ALL' ? null : _selectedPlaylistId,
      );

      final results = await Future.wait([channelFuture, playlistsFuture, videosFuture]);

      setState(() {
        _channel = results[0] as YouTubeChannelProfile;
        _playlists = results[1] as List<YouTubePlaylistItem>;
        _videos = results[2] as List<YouTubeVideoItem>;
        if (_videos.isNotEmpty && _selectedVideo == null) {
          _selectedVideo = _videos.first;
        }
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _errorMessage = e.toString();
        _isLoading = false;
      });
    }
  }

  Future<void> _filterByPlaylist(String playlistId) async {
    setState(() {
      _selectedPlaylistId = playlistId;
      _isLoading = true;
    });

    try {
      final videos = await widget.repository.getVideos(
        playlistId: playlistId == 'ALL' ? null : playlistId,
      );
      setState(() {
        _videos = videos;
        if (videos.isNotEmpty) {
          _selectedVideo = videos.first;
        }
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
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
          'Sovereign Academy Broadcasts',
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Colors.white),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh, color: goldColor),
            onPressed: _loadAllContent,
            tooltip: 'Sync Channel Content',
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: goldColor))
          : _errorMessage != null
              ? Center(
                  child: Padding(
                    padding: const EdgeInsets.all(24.0),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.error_outline, color: Colors.redAccent, size: 48),
                        const SizedBox(height: 12),
                        Text(_errorMessage!, style: const TextStyle(color: Colors.white70), textAlign: TextAlign.center),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          style: ElevatedButton.styleFrom(backgroundColor: goldColor),
                          onPressed: _loadAllContent,
                          child: const Text('Retry Connection', style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
                        )
                      ],
                    ),
                  ),
                )
              : RefreshIndicator(
                  color: goldColor,
                  backgroundColor: cardColor,
                  onRefresh: _loadAllContent,
                  child: SingleChildScrollView(
                    physics: const AlwaysScrollableScrollPhysics(),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // CHANNEL BANNER: Eyob Haile (@official_eyobhaile)
                        if (_channel != null)
                          Container(
                            margin: const EdgeInsets.all(16),
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: cardColor,
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(color: goldColor.withOpacity(0.3), width: 1),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withOpacity(0.5),
                                  blurRadius: 10,
                                  offset: const Offset(0, 4),
                                )
                              ],
                            ),
                            child: Row(
                              children: [
                                Stack(
                                  children: [
                                    CircleAvatar(
                                      radius: 30,
                                      backgroundImage: NetworkImage(_channel!.thumbnailUrl),
                                    ),
                                    Positioned(
                                      bottom: 0,
                                      right: 0,
                                      child: Container(
                                        padding: const EdgeInsets.all(4),
                                        decoration: const BoxDecoration(
                                          color: Color(0xFFEF4444),
                                          shape: BoxShape.circle,
                                        ),
                                        child: const Icon(Icons.play_arrow, size: 12, color: Colors.white),
                                      ),
                                    ),
                                  ],
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
                                              _channel!.title,
                                              style: const TextStyle(
                                                color: Colors.white,
                                                fontSize: 16,
                                                fontWeight: FontWeight.bold,
                                              ),
                                              maxLines: 1,
                                              overflow: TextOverflow.ellipsis,
                                            ),
                                          ),
                                          Container(
                                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                            decoration: BoxDecoration(
                                              color: const Color(0xFF10B981).withOpacity(0.15),
                                              borderRadius: BorderRadius.circular(12),
                                              border: Border.all(color: const Color(0xFF10B981).withOpacity(0.4)),
                                            ),
                                            child: const Text(
                                              'LIVE SYNC',
                                              style: TextStyle(
                                                color: Color(0xFF10B981),
                                                fontSize: 10,
                                                fontWeight: FontWeight.bold,
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        '${_channel!.customUrl} • ${_channel!.subscriberCount} Brothers • ${_channel!.videoCount} Lectures',
                                        style: const TextStyle(color: textMuted, fontSize: 12),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),

                        // ACTIVE LECTURE SPOTLIGHT / THEATER
                        if (_selectedVideo != null)
                          Container(
                            margin: const EdgeInsets.symmetric(horizontal: 16),
                            decoration: BoxDecoration(
                              color: cardColor,
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(color: Colors.white.withOpacity(0.08)),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                // Thumbnail with duration and play button
                                Stack(
                                  alignment: Alignment.center,
                                  children: [
                                    ClipRRect(
                                      borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
                                      child: AspectRatio(
                                        aspectRatio: 16 / 9,
                                        child: Image.network(
                                          _selectedVideo!.thumbnailUrl,
                                          fit: BoxFit.cover,
                                          errorBuilder: (_, __, ___) => Container(color: Colors.black26),
                                        ),
                                      ),
                                    ),
                                    Container(
                                      width: 56,
                                      height: 56,
                                      decoration: BoxDecoration(
                                        color: goldColor.withOpacity(0.9),
                                        shape: BoxShape.circle,
                                        boxShadow: [
                                          BoxShadow(color: Colors.black.withOpacity(0.6), blurRadius: 12),
                                        ],
                                      ),
                                      child: const Icon(Icons.play_arrow, size: 36, color: Colors.black),
                                    ),
                                    Positioned(
                                      bottom: 12,
                                      right: 12,
                                      child: Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                        decoration: BoxDecoration(
                                          color: Colors.black.withOpacity(0.85),
                                          borderRadius: BorderRadius.circular(6),
                                        ),
                                        child: Text(
                                          _selectedVideo!.duration,
                                          style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                                Padding(
                                  padding: const EdgeInsets.all(16),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        _selectedVideo!.title,
                                        style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold, height: 1.3),
                                      ),
                                      const SizedBox(height: 8),
                                      Text(
                                        _selectedVideo!.description,
                                        style: const TextStyle(color: textMuted, fontSize: 13, height: 1.4),
                                        maxLines: 3,
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                      const SizedBox(height: 12),
                                      Row(
                                        children: [
                                          Icon(Icons.remove_red_eye_outlined, size: 14, color: textMuted),
                                          const SizedBox(width: 4),
                                          Text('${_selectedVideo!.views} views', style: const TextStyle(color: textMuted, fontSize: 12)),
                                          const SizedBox(width: 16),
                                          Icon(Icons.thumb_up_outlined, size: 14, color: textMuted),
                                          const SizedBox(width: 4),
                                          Text('${_selectedVideo!.likes} likes', style: const TextStyle(color: textMuted, fontSize: 12)),
                                        ],
                                      )
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),

                        const SizedBox(height: 20),

                        // PLAYLIST CATEGORIES FILTER
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 16),
                          child: const Text(
                            'FOUNDATIONAL PLAYLISTS',
                            style: TextStyle(
                              color: goldColor,
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                              letterSpacing: 1.2,
                            ),
                          ),
                        ),
                        const SizedBox(height: 10),

                        SizedBox(
                          height: 42,
                          child: ListView(
                            scrollDirection: Axis.horizontal,
                            padding: const EdgeInsets.symmetric(horizontal: 16),
                            children: [
                              ChoiceChip(
                                label: const Text('All Lectures'),
                                selected: _selectedPlaylistId == 'ALL',
                                selectedColor: goldColor,
                                labelStyle: TextStyle(
                                  color: _selectedPlaylistId == 'ALL' ? Colors.black : Colors.white70,
                                  fontWeight: FontWeight.bold,
                                ),
                                backgroundColor: cardColor,
                                onSelected: (sel) => _filterByPlaylist('ALL'),
                              ),
                              const SizedBox(width: 8),
                              ..._playlists.map((pl) => Padding(
                                    padding: const EdgeInsets.only(right: 8.0),
                                    child: ChoiceChip(
                                      label: Text(pl.title),
                                      selected: _selectedPlaylistId == pl.id,
                                      selectedColor: goldColor,
                                      labelStyle: TextStyle(
                                        color: _selectedPlaylistId == pl.id ? Colors.black : Colors.white70,
                                        fontWeight: FontWeight.bold,
                                      ),
                                      backgroundColor: cardColor,
                                      onSelected: (sel) => _filterByPlaylist(pl.id),
                                    ),
                                  )),
                            ],
                          ),
                        ),

                        const SizedBox(height: 20),

                        // LECTURE CATALOG LIST
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 16),
                          child: Text(
                            'SYNCHRONIZED BROADCASTS (${_videos.length})',
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 15,
                              fontWeight: FontWeight.bold,
                              letterSpacing: 0.5,
                            ),
                          ),
                        ),
                        const SizedBox(height: 12),

                        ListView.separated(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          padding: const EdgeInsets.symmetric(horizontal: 16),
                          itemCount: _videos.length,
                          separatorBuilder: (_, __) => const SizedBox(height: 12),
                          itemBuilder: (context, index) {
                            final video = _videos[index];
                            final isPlaying = _selectedVideo?.id == video.id;

                            return InkWell(
                              onTap: () {
                                setState(() {
                                  _selectedVideo = video;
                                });
                              },
                              borderRadius: BorderRadius.circular(12),
                              child: Container(
                                padding: const EdgeInsets.all(10),
                                decoration: BoxDecoration(
                                  color: cardColor,
                                  borderRadius: BorderRadius.circular(12),
                                  border: Border.all(
                                    color: isPlaying ? goldColor : Colors.white.withOpacity(0.06),
                                    width: isPlaying ? 1.5 : 1,
                                  ),
                                ),
                                child: Row(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    ClipRRect(
                                      borderRadius: BorderRadius.circular(8),
                                      child: SizedBox(
                                        width: 110,
                                        height: 65,
                                        child: Stack(
                                          fit: StackFit.expand,
                                          children: [
                                            Image.network(
                                              video.thumbnailUrl,
                                              fit: BoxFit.cover,
                                              errorBuilder: (_, __, ___) => Container(color: Colors.black38),
                                            ),
                                            Positioned(
                                              bottom: 4,
                                              right: 4,
                                              child: Container(
                                                padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
                                                decoration: BoxDecoration(
                                                  color: Colors.black.withOpacity(0.85),
                                                  borderRadius: BorderRadius.circular(4),
                                                ),
                                                child: Text(
                                                  video.duration,
                                                  style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                                                ),
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                    ),
                                    const SizedBox(width: 12),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            video.title,
                                            style: TextStyle(
                                              color: isPlaying ? goldColor : Colors.white,
                                              fontSize: 13,
                                              fontWeight: FontWeight.bold,
                                              height: 1.3,
                                            ),
                                            maxLines: 2,
                                            overflow: TextOverflow.ellipsis,
                                          ),
                                          const SizedBox(height: 6),
                                          Text(
                                            '${video.views} views • ${video.category}',
                                            style: const TextStyle(color: textMuted, fontSize: 11),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            );
                          },
                        ),
                        const SizedBox(height: 40),
                      ],
                    ),
                  ),
                ),
    );
  }
}
