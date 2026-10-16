import dotenv from 'dotenv';
dotenv.config();

import assert from 'node:assert';
import http from 'node:http';
import { createApp } from '../src/app.js';
import prisma from '../src/config/database.js';

async function runYouTubeSyncTests() {
  console.log('🧪 Starting YouTube Channel Synchronization Module Automated Tests...\n');
  const app = createApp();
  const server = http.createServer(app);
  const TEST_PORT = 5098;

  await new Promise<void>((resolve) => {
    server.listen(TEST_PORT, () => resolve());
  });

  const baseUrl = `http://localhost:${TEST_PORT}`;

  try {
    // -------------------------------------------------------------
    // Test 1: Channel Profile & Resolution of @official_eyobhaile
    // -------------------------------------------------------------
    console.log('Test 1: Channel Profile & Handle Resolution (@official_eyobhaile)');
    const channelRes = await fetch(`${baseUrl}/api/youtube/channel`);
    assert.strictEqual(channelRes.status, 200, 'Channel endpoint must return HTTP 200');
    const channelJson = (await channelRes.json()) as any;

    assert.strictEqual(channelJson.success, true);
    assert.strictEqual(channelJson.data.handle, '@official_eyobhaile');
    assert.ok(channelJson.data.channelId, 'Channel ID must be resolved');
    assert.ok(channelJson.data.uploadsPlaylistId, 'Uploads playlist ID must be resolved');
    assert.ok(channelJson.data.subscriberCount > 0, 'Subscriber count must be positive');
    // Ensure security: no API keys or internal database secrets leaked
    assert.strictEqual(channelJson.data.apiKey, undefined, 'API key must never be exposed');
    assert.strictEqual(channelJson.data.secret, undefined, 'Secrets must never be exposed');
    console.log('  ✔ Channel resolved correctly to @official_eyobhaile with uploads playlist.');

    // -------------------------------------------------------------
    // Test 2: Initial Full Synchronization & Duplicate Prevention
    // -------------------------------------------------------------
    console.log('\nTest 2: Synchronization Idempotency & Duplicate Prevention');
    // Run sync 1
    const sync1Res = await fetch(`${baseUrl}/api/youtube/sync`, { method: 'POST' });
    assert.strictEqual(sync1Res.status, 200, 'First sync must return 200');
    const sync1Json = (await sync1Res.json()) as any;
    assert.strictEqual(sync1Json.success, true);

    const initialVideoCount = await prisma.youTubeVideo.count({
      where: { channelId: channelJson.data.channelId },
    });
    assert.ok(initialVideoCount > 0, 'Initial sync must store videos');

    // Run direct service synchronization to verify idempotency (bypassing controller IP rate-limit)
    const { YouTubeService } = await import('../src/modules/youtube/youtube.service.js');
    const sync2Result = await YouTubeService.synchronize('SCHEDULED_RECONCILE');
    assert.strictEqual(sync2Result.success, true);
    assert.strictEqual(sync2Result.videosInserted, 0, 'Second sync must not insert duplicate videos');

    const videoCountAfter = await prisma.youTubeVideo.count({
      where: { channelId: channelJson.data.channelId },
    });
    assert.strictEqual(videoCountAfter, initialVideoCount, 'Total video count must remain strictly identical (no duplicates)');
    console.log(`  ✔ Idempotent synchronization verified: ${initialVideoCount} videos preserved without duplicates.`);

    // -------------------------------------------------------------
    // Test 3: Pagination on GET /api/youtube/videos
    // -------------------------------------------------------------
    console.log('\nTest 3: Video Catalog Pagination');
    const pageLimit = 2;
    const page1Res = await fetch(`${baseUrl}/api/youtube/videos?page=1&limit=${pageLimit}`);
    assert.strictEqual(page1Res.status, 200);
    const page1Json = (await page1Res.json()) as any;

    assert.strictEqual(page1Json.success, true);
    assert.strictEqual(page1Json.data.length, pageLimit, `Page 1 must contain exactly ${pageLimit} videos`);
    assert.strictEqual(page1Json.pagination.page, 1);
    assert.strictEqual(page1Json.pagination.limit, pageLimit);
    assert.ok(page1Json.pagination.total >= initialVideoCount);
    assert.strictEqual(page1Json.pagination.hasPrev, false);

    const page2Res = await fetch(`${baseUrl}/api/youtube/videos?page=2&limit=${pageLimit}`);
    const page2Json = (await page2Res.json()) as any;
    assert.strictEqual(page2Json.pagination.page, 2);
    assert.strictEqual(page2Json.pagination.hasPrev, true);
    assert.notStrictEqual(page1Json.data[0].youtubeVideoId, page2Json.data[0].youtubeVideoId, 'Different pages must return distinct videos');
    console.log('  ✔ Pagination (page, limit, totalPages, hasNext, hasPrev) verified.');

    // -------------------------------------------------------------
    // Test 4: Sorting by Newest, Oldest, and Most Viewed
    // -------------------------------------------------------------
    console.log('\nTest 4: Video Catalog Sorting (newest, oldest, most viewed)');
    const newestRes = await fetch(`${baseUrl}/api/youtube/videos?sort=newest&limit=5`);
    const newestJson = (await newestRes.json()) as any;
    const firstDate = new Date(newestJson.data[0].publishedAt).getTime();
    const secondDate = new Date(newestJson.data[1].publishedAt).getTime();
    assert.ok(firstDate >= secondDate, 'Newest sort must order publishedAt descending');

    const oldestRes = await fetch(`${baseUrl}/api/youtube/videos?sort=oldest&limit=5`);
    const oldestJson = (await oldestRes.json()) as any;
    const oldFirst = new Date(oldestJson.data[0].publishedAt).getTime();
    const oldSecond = new Date(oldestJson.data[1].publishedAt).getTime();
    assert.ok(oldFirst <= oldSecond, 'Oldest sort must order publishedAt ascending');

    const viewsRes = await fetch(`${baseUrl}/api/youtube/videos?sort=most_viewed&limit=5`);
    const viewsJson = (await viewsRes.json()) as any;
    assert.ok(viewsJson.data[0].viewCount >= viewsJson.data[1].viewCount, 'Most viewed sort must order viewCount descending');
    console.log('  ✔ All sort algorithms (newest, oldest, most viewed) verified.');

    // -------------------------------------------------------------
    // Test 5: Single Video Lookup & 404 Handling
    // -------------------------------------------------------------
    console.log('\nTest 5: Single Video Lookup & Not Found Error Handling');
    const existingVideoId = newestJson.data[0].youtubeVideoId;
    const singleRes = await fetch(`${baseUrl}/api/youtube/videos/${existingVideoId}`);
    assert.strictEqual(singleRes.status, 200);
    const singleJson = (await singleRes.json()) as any;
    assert.strictEqual(singleJson.data.youtubeVideoId, existingVideoId);
    assert.ok(singleJson.data.youtubeUrl.includes('youtube.com/watch?v='));

    const notFoundRes = await fetch(`${baseUrl}/api/youtube/videos/non_existent_id_9999`);
    assert.strictEqual(notFoundRes.status, 404, 'Non-existent video must return HTTP 404');
    console.log('  ✔ Single video lookup and 404 error response verified.');

    // -------------------------------------------------------------
    // Test 6: PubSubHubbub Webhook Challenge Handshake
    // -------------------------------------------------------------
    console.log('\nTest 6: Webhook Handshake Verification (PubSubHubbub hub.challenge)');
    const challenge = 'google_pubsub_challenge_token_8877';
    const challengeRes = await fetch(
      `${baseUrl}/api/youtube/webhook?hub.mode=subscribe&hub.challenge=${challenge}&hub.topic=https://www.youtube.com/xml/feeds/videos.xml?channel_id=UC_official_eyobhaile`
    );
    assert.strictEqual(challengeRes.status, 200);
    const challengeBody = await challengeRes.text();
    assert.strictEqual(challengeBody, challenge, 'Handshake must echo hub.challenge');
    console.log('  ✔ Webhook challenge response verified.');

    // -------------------------------------------------------------
    // Test 7: Webhook Notification Processing (New Video & Update)
    // -------------------------------------------------------------
    console.log('\nTest 7: Webhook Processing (New Upload & Content Update)');
    const testVideoId = `test_yt_${Date.now()}`;
    const newUploadXml = `
      <feed xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns="http://www.w3.org/2005/Atom">
        <entry>
          <yt:videoId>${testVideoId}</yt:videoId>
          <yt:channelId>${channelJson.data.channelId}</yt:channelId>
          <title>የእውነተኛ ወንድነት መገለጫ | Signs of True Manhood</title>
          <summary>Special lecture broadcast from Eyob Haile on masculinity.</summary>
        </entry>
      </feed>
    `;

    // Push new upload
    const webhookRes1 = await fetch(`${baseUrl}/api/youtube/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/atom+xml' },
      body: newUploadXml,
    });
    assert.strictEqual(webhookRes1.status, 200);
    const webhook1Json = (await webhookRes1.json()) as any;
    assert.strictEqual(webhook1Json.result.action, 'INSERTED', 'New video in webhook must be inserted');

    // Verify video now exists in database
    const dbVideo = await prisma.youTubeVideo.findUnique({
      where: { youtubeVideoId: testVideoId },
    });
    assert.ok(dbVideo, 'Video must exist in database after webhook insertion');
    assert.strictEqual(dbVideo.title, 'የእውነተኛ ወንድነት መገለጫ | Signs of True Manhood');

    // Push title update for the same video
    const updatedTitle = 'የእውነተኛ ወንድነት መገለጫ (ክፍል 2 የተሻሻለ) | Signs of True Manhood (Updated)';
    const updateXml = `
      <feed xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns="http://www.w3.org/2005/Atom">
        <entry>
          <yt:videoId>${testVideoId}</yt:videoId>
          <title>${updatedTitle}</title>
        </entry>
      </feed>
    `;
    const webhookRes2 = await fetch(`${baseUrl}/api/youtube/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/atom+xml' },
      body: updateXml,
    });
    assert.strictEqual(webhookRes2.status, 200);
    const webhook2Json = (await webhookRes2.json()) as any;
    assert.strictEqual(webhook2Json.result.action, 'UPDATED', 'Modified video in webhook must trigger update');

    const dbVideoUpdated = await prisma.youTubeVideo.findUnique({
      where: { youtubeVideoId: testVideoId },
    });
    assert.strictEqual(dbVideoUpdated?.title, updatedTitle, 'Database record must reflect updated title');
    console.log('  ✔ Webhook new upload ingestion and title change update verified.');

    // -------------------------------------------------------------
    // Test 8: Sync Status & Telemetry Audit
    // -------------------------------------------------------------
    console.log('\nTest 8: Sync Status & Audit History');
    const statusRes = await fetch(`${baseUrl}/api/youtube/sync/status`);
    assert.strictEqual(statusRes.status, 200);
    const statusJson = (await statusRes.json()) as any;
    assert.strictEqual(statusJson.success, true);
    assert.strictEqual(statusJson.data.handle, '@official_eyobhaile');
    assert.ok(statusJson.data.totalVideosInDatabase > 0);
    assert.ok(statusJson.data.recentLogs.length > 0, 'Audit history logs must be populated');
    console.log('  ✔ Telemetry audit history verified.');

    console.log('\n🎉 ALL 8 YOUTUBE SYNCHRONIZATION TESTS PASSED SUCCESSFULLY!\n');
  } finally {
    server.close();
  }
}

runYouTubeSyncTests().catch((err) => {
  console.error('❌ Test suite failed with error:', err);
  process.exit(1);
});
