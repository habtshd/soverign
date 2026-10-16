import { YouTubeService } from './youtube.service.js';

export class YouTubeScheduler {
  private static intervalHandle: NodeJS.Timeout | null = null;
  private static isRunning = false;

  /**
   * Initializes the scheduled reconciliation background job
   */
  public static startScheduler(): void {
    if (this.isRunning) return;

    // Configurable interval in minutes (default: 30 minutes)
    const intervalMinutes = parseInt(process.env.YOUTUBE_RECONCILE_INTERVAL_MINUTES || '30', 10);
    const intervalMs = Math.max(5, intervalMinutes) * 60 * 1000;

    console.log(`[YouTubeScheduler] Initializing periodic reconciliation job every ${intervalMinutes} minutes.`);

    // Run initial sync after a brief boot delay
    setTimeout(async () => {
      try {
        console.log(`[YouTubeScheduler] Executing boot-time YouTube catalog reconciliation...`);
        await YouTubeService.synchronize('SCHEDULED_RECONCILE');
      } catch (err) {
        console.error(`[YouTubeScheduler] Error during boot-time reconciliation:`, err);
      }
    }, 5000);

    // Schedule periodic reconciliation loop
    this.intervalHandle = setInterval(async () => {
      try {
        console.log(`[YouTubeScheduler] Triggering periodic reconciliation of @official_eyobhaile uploads...`);
        await YouTubeService.synchronize('SCHEDULED_RECONCILE');
      } catch (err) {
        console.error(`[YouTubeScheduler] Error during scheduled reconciliation:`, err);
      }
    }, intervalMs);

    this.isRunning = true;
  }

  /**
   * Gracefully stops the scheduler
   */
  public static stopScheduler(): void {
    if (this.intervalHandle) {
      clearInterval(this.intervalHandle);
      this.intervalHandle = null;
    }
    this.isRunning = false;
    console.log(`[YouTubeScheduler] Reconciliation job stopped.`);
  }
}
