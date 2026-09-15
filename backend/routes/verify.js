const express = require('express');
const router = express.Router();
const https = require('https');
const http = require('http');

// Helper to verify URL reachability and redirects
async function testUrlReachability(targetUrl, timeoutMs = 6000) {
  const startTime = Date.now();
  let secure = false;

  try {
    const parsed = new URL(targetUrl);
    secure = parsed.protocol === 'https:';
  } catch (e) {
    return {
      valid: false,
      statusCode: 400,
      finalUrl: targetUrl,
      responseTimeMs: 0,
      secure: false,
      error: 'Invalid URL format'
    };
  }

  // Attempt using global fetch if available
  if (typeof fetch === 'function') {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(targetUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        },
        redirect: 'follow',
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const responseTimeMs = Date.now() - startTime;
      const finalUrl = response.url || targetUrl;
      const statusCode = response.status;
      const valid = statusCode >= 200 && statusCode < 400;

      return {
        valid,
        statusCode,
        finalUrl,
        responseTimeMs,
        secure: finalUrl.startsWith('https://'),
        statusText: response.statusText
      };
    } catch (err) {
      clearTimeout(timeoutId);
      const responseTimeMs = Date.now() - startTime;
      return {
        valid: false,
        statusCode: err.name === 'AbortError' ? 408 : 502,
        finalUrl: targetUrl,
        responseTimeMs,
        secure,
        error: err.name === 'AbortError' ? 'Request timed out after ' + timeoutMs + 'ms' : err.message
      };
    }
  }

  // Fallback to node http/https
  return new Promise((resolve) => {
    try {
      const parsed = new URL(targetUrl);
      const client = parsed.protocol === 'https:' ? https : http;
      
      const req = client.request(targetUrl, { method: 'HEAD', timeout: timeoutMs }, (res) => {
        const responseTimeMs = Date.now() - startTime;
        const statusCode = res.statusCode || 200;
        const valid = statusCode >= 200 && statusCode < 400;
        resolve({
          valid,
          statusCode,
          finalUrl: res.headers.location || targetUrl,
          responseTimeMs,
          secure: targetUrl.startsWith('https://')
        });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({
          valid: false,
          statusCode: 408,
          finalUrl: targetUrl,
          responseTimeMs: Date.now() - startTime,
          secure,
          error: 'Connection timeout'
        });
      });

      req.on('error', (err) => {
        resolve({
          valid: false,
          statusCode: 502,
          finalUrl: targetUrl,
          responseTimeMs: Date.now() - startTime,
          secure,
          error: err.message
        });
      });

      req.end();
    } catch (err) {
      resolve({
        valid: false,
        statusCode: 400,
        finalUrl: targetUrl,
        responseTimeMs: Date.now() - startTime,
        secure,
        error: err.message
      });
    }
  });
}

// POST /api/verify/link
router.post('/link', async (req, res) => {
  try {
    const { url, timeoutMs = 5000 } = req.body;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({
        valid: false,
        statusCode: 400,
        finalUrl: '',
        responseTimeMs: 0,
        secure: false,
        error: 'URL is required in request body'
      });
    }

    const result = await testUrlReachability(url.trim(), timeoutMs);
    res.json(result);
  } catch (err) {
    res.status(500).json({
      valid: false,
      statusCode: 500,
      finalUrl: req.body?.url || '',
      responseTimeMs: 0,
      secure: false,
      error: err.message
    });
  }
});

// POST /api/verify/coupon
router.post('/coupon', (req, res) => {
  try {
    const { code, expiry, store, discount } = req.body;

    if (!code || typeof code !== 'string' || !code.trim()) {
      return res.status(400).json({
        valid: false,
        daysLeft: 0,
        isExpired: true,
        status: 'Missing Coupon Code',
        details: { codeValid: false, dateValid: false, discountValid: false }
      });
    }

    const trimmedCode = code.trim().toUpperCase();

    // 1. Validate Code Format (Alphanumeric + hyphens/underscores, 3 to 30 characters)
    const codeRegex = /^[A-Z0-9_\-\.]{3,30}$/;
    const codeValid = codeRegex.test(trimmedCode);

    // 2. Validate Expiry Date
    let isExpired = false;
    let daysLeft = 30; // default assumption if no expiry passed
    let dateValid = true;

    if (expiry) {
      const parsedDate = new Date(expiry);
      if (isNaN(parsedDate.getTime())) {
        dateValid = false;
        daysLeft = 0;
      } else {
        const now = new Date();
        // End of the target day
        parsedDate.setHours(23, 59, 59, 999);
        const diffMs = parsedDate.getTime() - now.getTime();
        daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        isExpired = daysLeft < 0;
      }
    }

    // 3. Validate Discount Pattern (if provided)
    let discountValid = true;
    if (discount) {
      const discPattern = /(\d+%\s*OFF|FLAT\s*₹?\s*\d+|₹\s*\d+|FREE\s*(DELIVERY|SHIPPING)|BUY\s*\d+\s*GET\s*\d+|UPTO\s*₹?\s*\d+|CASHBACK|SAVE)/i;
      discountValid = discPattern.test(discount);
    }

    // Determine status & overall validity
    let valid = true;
    let status = 'Verified Active';

    if (!codeValid) {
      valid = false;
      status = 'Invalid Code Format (Allowed: 3-30 letters/numbers/hyphens)';
    } else if (isExpired) {
      valid = false;
      status = `Coupon Expired (${Math.abs(daysLeft)} days ago)`;
    } else if (!dateValid) {
      valid = false;
      status = 'Invalid Expiry Date Format';
    } else if (!discountValid) {
      status = 'Valid Code (Unrecognized Discount Format)';
      // code is still valid, but marked with notice
    }

    res.json({
      valid,
      code: trimmedCode,
      daysLeft: Math.max(0, daysLeft),
      isExpired,
      status,
      details: {
        codeValid,
        dateValid,
        discountValid,
        daysLeft,
        store: store || 'Not Specified',
        discount: discount || 'Not Specified'
      }
    });
  } catch (err) {
    res.status(500).json({
      valid: false,
      daysLeft: 0,
      isExpired: true,
      status: `Verification error: ${err.message}`
    });
  }
});

module.exports = router;
