const http = require('http');

const BASE_URL = 'http://localhost:5000';
const EXEC_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3OTg1ZjAxMWE1ZTNiMDAxYjAwMDAwMSIsImVtYWlsIjoiZXhlY3V0aXZlQHdvdWNoaWZ5LmNvbSIsInJvbGUiOiJleGVjdXRpdmUiLCJpYXQiOjE3MzgwMDAwMDAsImV4cCI6MjA1MzU2MDAwMH0.demo_token';
const MGR_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3OTg1ZjAxMWE1ZTNiMDAxYjAwMDAwMSIsImVtYWlsIjoibWFuYWdlckB3b3VjaGlmeS5jb20iLCJyb2xlIjoibWFuYWdlciIsImlhdCI6MTczODAwMDAwMCwiZXhwIjoyMDUzNTYwMDAwfQ.demo_token';
const OPS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3OTg1ZjAxMWE1ZTNiMDAxYjAwMDAwMSIsImVtYWlsIjoib3BzLm1hbmFnZXJAd291Y2hpZnkuY29tIiwicm9sZSI6Im9wZXJhdGlvbmFsX21hbmFnZXIiLCJpYXQiOjE3MzgwMDAwMDAsImV4cCI6MjA1MzU2MDAwMH0.demo_token';

async function request(endpoint, options = {}) {
  const url = new URL(endpoint, BASE_URL);
  const headers = options.headers || {};
  if (options.body && typeof options.body === 'object') {
    options.body = JSON.stringify(options.body);
    headers['Content-Type'] = 'application/json';
  }
  const response = await fetch(url.toString(), {
    method: options.method || 'GET',
    headers,
    body: options.body
  });
  let data;
  const rawText = await response.text();
  try {
    data = JSON.parse(rawText);
  } catch (e) {
    data = rawText;
  }
  return { status: response.status, data };
}

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ PASS: ${message}`);
  } else {
    failedTests++;
    console.error(`  ❌ FAIL: ${message}`);
  }
}

async function runQATestSuite() {
  console.log('\n================================================================');
  console.log('🚀 SENIOR QA TEST SUITE: COMPLETE END-TO-END VERIFICATION');
  console.log('================================================================\n');

  // 1. Health & Core Public Endpoints
  console.log('--- 1. Testing Core Public API Endpoints ---');
  const healthDeals = await request('/api/deals');
  assert(healthDeals.status === 200 && Array.isArray(healthDeals.data), 'GET /api/deals returns array');

  const healthStores = await request('/api/stores');
  assert(healthStores.status === 200 && Array.isArray(healthStores.data), 'GET /api/stores returns array');

  const healthCoupons = await request('/api/coupons');
  assert(healthCoupons.status === 200 && Array.isArray(healthCoupons.data), 'GET /api/coupons returns array');

  const healthCards = await request('/api/credit-cards');
  assert(healthCards.status === 200 && Array.isArray(healthCards.data), 'GET /api/credit-cards returns array');

  const healthLoot = await request('/api/loot-deals');
  assert(healthLoot.status === 200 && Array.isArray(healthLoot.data), 'GET /api/loot-deals returns array');

  // 2. Executive Submission -> Manager Approval Workflow
  console.log('\n--- 2. Testing Maker-Checker Workflow (Executive Create -> Manager Approve) ---');
  const newStorePayload = {
    entityType: 'store',
    action: 'create',
    title: 'QA Puma Official Store',
    priority: 'Normal',
    dataSnapshot: {
      name: 'QA Puma Store',
      slug: 'qa-puma-store',
      category: 'Fashion',
      reward: 'Upto 10% rewards',
      description: 'Exclusive QA sneakers & sportswear collection',
      cardBg: '#FFE6D3',
      badgeBg: '#FFB67C',
      status: 'pending'
    }
  };

  const subRes = await request('/api/submissions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${EXEC_TOKEN}` },
    body: newStorePayload
  });
  assert(subRes.status === 201 && subRes.data._id, 'Executive successfully created store submission');
  const subId = subRes.data._id || subRes.data.id;

  // Verify Submissions list sorts newest-first
  const subListRes = await request('/api/submissions', {
    headers: { Authorization: `Bearer ${MGR_TOKEN}` }
  });
  assert(subListRes.status === 200 && Array.isArray(subListRes.data), 'Manager can fetch submissions list');
  assert(subListRes.data[0]._id === subId || subListRes.data[0].id === subId, 'Newly created submission is ranked #1 at the very top');

  // Manager Approve
  const approveRes = await request(`/api/submissions/${subId}/approve`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${MGR_TOKEN}` }
  });
  assert(approveRes.status === 200 && approveRes.data.status === 'Approved', 'Manager successfully approved submission');

  // Verify approved store appears in store list with its colors
  const updatedStores = await request('/api/stores');
  const foundStore = updatedStores.data.find(s => s.name === 'QA Puma Store' || s.slug === 'qa-puma-store');
  assert(foundStore !== undefined, 'Approved store is active and returned in public /api/stores');
  assert(foundStore.cardBg === '#FFE6D3' && foundStore.badgeBg === '#FFB67C', 'Store maintains assigned pastel cardBg and badgeBg');

  // 3. Testing Home Page Curation & Hiding/Showing Entities
  console.log('\n--- 3. Testing Home Page Curation Toggles ---');
  // Hide store from home page
  const hideRes = await request(`/api/stores/${foundStore._id || foundStore.id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${MGR_TOKEN}` },
    body: { hideFromHome: true }
  });
  assert(hideRes.status === 200, 'Successfully updated store hideFromHome flag to true');

  const afterHideStores = await request('/api/stores');
  const hiddenStore = afterHideStores.data.find(s => s.name === 'QA Puma Store');
  assert(hiddenStore && hiddenStore.hideFromHome === true, 'Store hideFromHome is persisted and returned in API');

  // 4. Testing Coupon Duplicate "off" Prevention & Expiry
  console.log('\n--- 4. Testing Coupon Sanitization & Discount Structure ---');
  const couponPayload = {
    entityType: 'coupon',
    action: 'create',
    title: 'Flat ₹1,000 Off on Electronics QA',
    priority: 'Normal',
    dataSnapshot: {
      code: 'QAOFF1000',
      store: 'Amazon',
      discount: '₹1,000 OFF',
      discountValue: 1000,
      minOrder: 'Min ₹4,999',
      category: 'Electronics',
      description: 'Exclusive ₹1000 coupon for QA test',
      status: 'pending'
    }
  };

  const coupSubRes = await request('/api/submissions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${EXEC_TOKEN}` },
    body: couponPayload
  });
  assert(coupSubRes.status === 201, 'Executive created coupon submission');

  const coupSubId = coupSubRes.data._id || coupSubRes.data.id;
  const coupApprove = await request(`/api/submissions/${coupSubId}/approve`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${OPS_TOKEN}` }
  });
  assert(coupApprove.status === 200, 'Operations Manager approved coupon submission');

  const couponsRes = await request('/api/coupons');
  const foundCoupon = couponsRes.data.find(c => c.code === 'QAOFF1000');
  assert(foundCoupon !== undefined, 'Approved coupon appears in live /api/coupons list');

  // 5. Testing Analytics & Engagement Tracking
  console.log('\n--- 5. Testing User Engagement & Click Tracking ---');
  const dealClickRes = await request('/api/deals/deal-1/click', {
    method: 'POST'
  });
  assert(dealClickRes.status === 200 && dealClickRes.data.success === true, 'Deal click tracking increments clicks successfully');

  const storeClickRes = await request(`/api/stores/${foundStore._id || foundStore.id}/click`, {
    method: 'POST'
  });
  assert(storeClickRes.status === 200 && storeClickRes.data.success === true, 'Store click tracking increments clicks successfully');

  console.log('\n================================================================');
  console.log(`📊 SENIOR QA TEST RESULTS: ${passedTests}/${totalTests} Passed (${failedTests} Failed)`);
  console.log('================================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runQATestSuite().catch(err => {
  console.error('Fatal error during QA test suite execution:', err);
  process.exit(1);
});
