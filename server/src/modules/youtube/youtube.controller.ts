import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { YouTubeService } from './youtube.service.js';
import { VideoSortOption } from './youtube.types.js';

// Simple in-memory rate limiting map for POST /sync
const syncRateLimit = new Map<string, number>();

export class YouTubeController {
  /**
   * GET /api/youtube/channel
   */
  public static async getChannel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const channel = await YouTubeService.getChannelProfile();
      res.json({
        success: true,
        data: channel,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/youtube/videos
   * Supports pagination (page, limit) and sorting (newest, oldest, most viewed)
   */
  public static async getVideos(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
      const sort = (req.query.sort as VideoSortOption) || 'newest';
      const search = (req.query.search as string) || (req.query.q as string) || '';
      const playlistId = req.query.playlistId as string | undefined;

      const result = await YouTubeService.getVideos({
        page,
        limit,
        sort,
        search,
        playlistId,
      });

      res.json({
        success: true,
        data: result.videos,
        pagination: result.pagination,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/youtube/videos/:videoId
   */
  public static async getVideoById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const videoId = String(req.params.videoId);
      const video = await YouTubeService.getVideoById(videoId);

      if (!video) {
        res.status(404).json({
          success: false,
          error: `Video with ID '${videoId}' was not found in the synchronized catalog.`,
        });
        return;
      }

      res.json({
        success: true,
        data: video,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/youtube/sync/status
   */
  public static async getSyncStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const status = await YouTubeService.getSyncStatus();
      res.json({
        success: true,
        data: status,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/youtube/sync
   * Idempotent full synchronization trigger
   */
  public static async triggerSync(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Basic rate limiting: Allow 1 manual sync request every 15 seconds per IP
      const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
      const lastCall = syncRateLimit.get(clientIp) || 0;
      const now = Date.now();

      if (now - lastCall < 15000) {
        const waitSec = Math.ceil((15000 - (now - lastCall)) / 1000);
        res.status(429).json({
          success: false,
          error: `Sync rate limit exceeded. Please wait ${waitSec} seconds before triggering synchronization again.`,
        });
        return;
      }

      syncRateLimit.set(clientIp, now);

      const result = await YouTubeService.synchronize('FULL_POLL');
      res.json({
        success: result.success,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/youtube/webhook
   * PubSubHubbub subscription handshake verification (Google sends hub.challenge)
   */
  public static async verifyWebhook(req: Request, res: Response): Promise<void> {
    const hubMode = req.query['hub.mode'];
    const hubChallenge = req.query['hub.challenge'];
    const hubTopic = req.query['hub.topic'];

    console.log(`[YouTubeWebhook] Verification handshake received: mode=${hubMode}, topic=${hubTopic}`);

    if (hubMode === 'subscribe' || hubMode === 'unsubscribe') {
      res.status(200).send(hubChallenge);
      return;
    }

    res.status(400).send('Invalid hub.mode');
  }

  /**
   * POST /api/youtube/webhook
   * Handles incoming YouTube push notification XML feed
   */
  public static async handleWebhook(req: Request, res: Response): Promise<void> {
    try {
      const signature = req.headers['x-hub-signature'] as string | undefined;
      const rawPayload = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);

      // Verify HMAC-SHA1 signature if secret is configured
      const secret = process.env.YOUTUBE_WEBHOOK_SECRET;
      if (secret && signature) {
        const expectedSignature = `sha1=${crypto
          .createHmac('sha1', secret)
          .update(rawPayload, 'utf8')
          .digest('hex')}`;

        if (signature !== expectedSignature) {
          console.warn(`[YouTubeWebhook] Invalid HMAC signature received. Ignoring payload.`);
          res.status(403).send('Invalid signature');
          return;
        }
      }

      // Process notification in background / immediate resolution
      const result = await YouTubeService.handleWebhookNotification(rawPayload);

      res.status(200).json({
        success: true,
        message: 'Notification acknowledged',
        result,
      });
    } catch (err) {
      console.error(`[YouTubeWebhook] Error handling webhook payload:`, err);
      res.status(200).send('Error logged');
    }
  }

  /**
   * GET /api/youtube/playlists
   */
  public static async getPlaylists(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const playlists = await YouTubeService.getPlaylists();
      res.json({
        success: true,
        data: playlists,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/youtube/connect
   * Connects YouTube channel by handle or ID and synchronizes catalog
   */
  public static async connectChannel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const handleOrId =
        req.body.channel || req.body.handle || req.body.channelId || req.body.channelInput;
      if (!handleOrId || typeof handleOrId !== 'string') {
        res.status(400).json({
          success: false,
          error: 'YouTube channel handle or ID is required (e.g. @official_eyobhaile)',
        });
        return;
      }

      console.log(`[YouTubeController] Connecting channel: ${handleOrId}`);
      const channel = await YouTubeService.connectChannel(handleOrId.trim());

      res.json({
        success: true,
        message: `Successfully connected channel ${channel.handle}`,
        data: channel,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/youtube/subscribe
   * Helper to trigger PubSubHubbub subscription to Google Hub
   */
  public static async subscribe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const subscribed = await YouTubeService.subscribeToPushNotifications();
      res.json({
        success: subscribed,
        message: subscribed
          ? 'PubSubHubbub subscription request submitted to Google hub'
          : 'Subscription could not be dispatched (check YOUTUBE_CALLBACK_URL in environment)',
      });
    } catch (err) {
      next(err);
    }
  }
}

