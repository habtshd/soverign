import assert from 'node:assert';
import { createApp } from '../src/app.js';
import http from 'node:http';

async function runTests() {
  console.log('🧪 Starting Sovereign Platform API Verification Tests...');
  const app = createApp();
  const server = http.createServer(app);

  await new Promise<void>((resolve) => {
    server.listen(5099, () => {
      resolve();
    });
  });

  const baseUrl = 'http://localhost:5099';

  try {
    // Test 1: Health Check
    console.log('  Testing: GET /api/health');
    const healthRes = await fetch(`${baseUrl}/api/health`);
    assert.strictEqual(healthRes.status, 200);
    const healthData = await healthRes.json();
    assert.strictEqual(healthData.status, 'HEALTHY');
    console.log('  ✔ Health check passed');

    // Test 2: Admin Login
    console.log('  Testing: POST /api/v1/auth/login (Admin)');
    const loginRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@sovereign.club',
        password: 'Password123!',
      }),
    });
    assert.strictEqual(loginRes.status, 200);
    const loginData = await loginRes.json();
    assert.strictEqual(loginData.success, true);
    assert.ok(loginData.data.token, 'Token must be returned');
    assert.ok(loginData.data.user.roles.includes('SUPER_ADMIN'));
    const adminToken = loginData.data.token;
    console.log('  ✔ Admin authentication & token generation passed');

    // Test 3: Member Login
    console.log('  Testing: POST /api/v1/auth/login (Member)');
    const memberLoginRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'alex@sovereign.club',
        password: 'Password123!',
      }),
    });
    assert.strictEqual(memberLoginRes.status, 200);
    const memberLoginData = await memberLoginRes.json();
    assert.strictEqual(memberLoginData.success, true);
    assert.ok(memberLoginData.data.user.roles.includes('MEMBER'));
    const memberToken = memberLoginData.data.token;
    console.log('  ✔ Member authentication passed');

    // Test 4: Member Digital ID Verification
    console.log('  Testing: GET /api/v1/members/digital-id/SOV-001');
    const digitalIdRes = await fetch(`${baseUrl}/api/v1/members/digital-id/SOV-001`);
    assert.strictEqual(digitalIdRes.status, 200);
    const digitalIdData = await digitalIdRes.json();
    assert.strictEqual(digitalIdData.success, true);
    assert.strictEqual(digitalIdData.data.isValid, true);
    assert.strictEqual(digitalIdData.data.memberNumber, 'SOV-001');
    console.log('  ✔ Digital ID verification passed');

    // Test 5: Admin Dashboard Metrics
    console.log('  Testing: GET /api/v1/admin/dashboard (RBAC protected)');
    const metricsRes = await fetch(`${baseUrl}/api/v1/admin/dashboard`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(metricsRes.status, 200);
    const metricsData = await metricsRes.json();
    assert.strictEqual(metricsData.success, true);
    assert.ok(metricsData.data.membership.totalMembers > 0);
    assert.ok(metricsData.data.events.totalEvents > 0);
    console.log('  ✔ Real database metrics passed (Members:', metricsData.data.membership.totalMembers, ')');

    // Test 6: RBAC Rejection for Member on Admin Endpoint
    console.log('  Testing: RBAC rejection for ordinary member on /api/v1/admin/dashboard');
    const forbiddenRes = await fetch(`${baseUrl}/api/v1/admin/dashboard`, {
      headers: { Authorization: `Bearer ${memberToken}` },
    });
    assert.strictEqual(forbiddenRes.status, 403);
    console.log('  ✔ Role-based access control properly rejected unauthorized member');

    // Test 7: Google Forms Ingestion Webhook
    console.log('  Testing: POST /api/v1/integrations/google/forms-webhook');
    const webhookRes = await fetch(`${baseUrl}/api/v1/integrations/google/forms-webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Test Applicant via Webhook',
        email: `webhook.test.${Date.now()}@example.com`,
        phone: '+1 555 999 1122',
        occupation: 'Civil Engineer',
        reasonToJoin: 'Testing automated intake integration pipeline.',
        formResponseId: `TEST-GF-${Date.now()}`,
      }),
    });
    assert.strictEqual(webhookRes.status, 200);
    const webhookData = await webhookRes.json();
    assert.strictEqual(webhookData.success, true);
    assert.strictEqual(webhookData.data.status, 'SUCCESS');
    console.log('  ✔ Google Forms automated ingestion pipeline passed');

    console.log('\n🎉 ALL BACKEND API & PERSISTENCE TESTS PASSED!');
  } finally {
    server.close();
  }
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
