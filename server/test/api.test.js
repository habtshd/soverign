"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const app_js_1 = require("../src/app.js");
const node_http_1 = __importDefault(require("node:http"));
async function runTests() {
    console.log('🧪 Starting Sovereign Platform API Verification Tests...');
    const app = (0, app_js_1.createApp)();
    const server = node_http_1.default.createServer(app);
    await new Promise((resolve) => {
        server.listen(5099, () => {
            resolve();
        });
    });
    const baseUrl = 'http://localhost:5099';
    try {
        // Test 1: Health Check
        console.log('  Testing: GET /api/health');
        const healthRes = await fetch(`${baseUrl}/api/health`);
        node_assert_1.default.strictEqual(healthRes.status, 200);
        const healthData = await healthRes.json();
        node_assert_1.default.strictEqual(healthData.status, 'HEALTHY');
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
        node_assert_1.default.strictEqual(loginRes.status, 200);
        const loginData = await loginRes.json();
        node_assert_1.default.strictEqual(loginData.success, true);
        node_assert_1.default.ok(loginData.data.token, 'Token must be returned');
        node_assert_1.default.ok(loginData.data.user.roles.includes('SUPER_ADMIN'));
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
        node_assert_1.default.strictEqual(memberLoginRes.status, 200);
        const memberLoginData = await memberLoginRes.json();
        node_assert_1.default.strictEqual(memberLoginData.success, true);
        node_assert_1.default.ok(memberLoginData.data.user.roles.includes('MEMBER'));
        const memberToken = memberLoginData.data.token;
        console.log('  ✔ Member authentication passed');
        // Test 4: Member Digital ID Verification
        console.log('  Testing: GET /api/v1/members/digital-id/SOV-001');
        const digitalIdRes = await fetch(`${baseUrl}/api/v1/members/digital-id/SOV-001`);
        node_assert_1.default.strictEqual(digitalIdRes.status, 200);
        const digitalIdData = await digitalIdRes.json();
        node_assert_1.default.strictEqual(digitalIdData.success, true);
        node_assert_1.default.strictEqual(digitalIdData.data.isValid, true);
        node_assert_1.default.strictEqual(digitalIdData.data.memberNumber, 'SOV-001');
        console.log('  ✔ Digital ID verification passed');
        // Test 5: Admin Dashboard Metrics
        console.log('  Testing: GET /api/v1/admin/dashboard (RBAC protected)');
        const metricsRes = await fetch(`${baseUrl}/api/v1/admin/dashboard`, {
            headers: { Authorization: `Bearer ${adminToken}` },
        });
        node_assert_1.default.strictEqual(metricsRes.status, 200);
        const metricsData = await metricsRes.json();
        node_assert_1.default.strictEqual(metricsData.success, true);
        node_assert_1.default.ok(metricsData.data.membership.totalMembers > 0);
        node_assert_1.default.ok(metricsData.data.events.totalEvents > 0);
        console.log('  ✔ Real database metrics passed (Members:', metricsData.data.membership.totalMembers, ')');
        // Test 6: RBAC Rejection for Member on Admin Endpoint
        console.log('  Testing: RBAC rejection for ordinary member on /api/v1/admin/dashboard');
        const forbiddenRes = await fetch(`${baseUrl}/api/v1/admin/dashboard`, {
            headers: { Authorization: `Bearer ${memberToken}` },
        });
        node_assert_1.default.strictEqual(forbiddenRes.status, 403);
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
        node_assert_1.default.strictEqual(webhookRes.status, 200);
        const webhookData = await webhookRes.json();
        node_assert_1.default.strictEqual(webhookData.success, true);
        node_assert_1.default.strictEqual(webhookData.data.status, 'SUCCESS');
        console.log('  ✔ Google Forms automated ingestion pipeline passed');
        console.log('\n🎉 ALL BACKEND API & PERSISTENCE TESTS PASSED!');
    }
    finally {
        server.close();
    }
}
runTests().catch((err) => {
    console.error('❌ Test failed:', err);
    process.exit(1);
});
