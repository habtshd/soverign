import dotenv from 'dotenv';
import { createApp } from './app.js';
import { YouTubeScheduler } from './modules/youtube/youtube.scheduler.js';

dotenv.config();

const app = createApp();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🏛️  Sovereign Men's Club API running on http://localhost:${PORT}`);
  console.log(`🛡️  Health check: http://localhost:${PORT}/api/health`);
  console.log(`📹  YouTube Sync Service running on http://localhost:${PORT}/api/youtube`);
  
  // Start automatic reconciliation scheduler for @official_eyobhaile
  YouTubeScheduler.startScheduler();
});

