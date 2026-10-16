import { Router } from 'express';
import { YouTubeController } from './youtube.controller.js';

const router = Router();

// PubSubHubbub Webhook endpoints (Public for Google push notifications & verification)
router.get('/webhook', YouTubeController.verifyWebhook);
router.post('/webhook', YouTubeController.handleWebhook);

// Channel Profile & Video Read endpoints (accessible by Flutter mobile, Member Portal, and Web)
router.get('/channel', YouTubeController.getChannel);
router.get('/videos', YouTubeController.getVideos);
router.get('/videos/:videoId', YouTubeController.getVideoById);
router.get('/playlists', YouTubeController.getPlaylists);

// Synchronization Telemetry & Manual Sync Trigger endpoints
router.get('/sync/status', YouTubeController.getSyncStatus);
router.post('/sync', YouTubeController.triggerSync);
router.post('/connect', YouTubeController.connectChannel);
router.post('/subscribe', YouTubeController.subscribe);

export default router;
