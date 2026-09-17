const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader ? authHeader.replace(/^Bearer\s+/i, '').trim() : null;

  // 1. Dev Bypass Tokens (for direct local navigation & layout dev states)
  if (token === 'dev-ops-token' || token === 'dev-ops') {
    req.user = { id: 'ops-1', role: 'operational_manager', email: 'ops.manager@wouchify.com', name: 'Operational Manager' };
    return next();
  }
  if (token === 'dev-executive-token' || token === 'dev-exec-token' || token === 'dev-token' || token === 'dev-exec') {
    req.user = { id: 'exec-1', role: 'executive', email: 'executive@wouchify.com', name: 'Content Executive' };
    return next();
  }
  if (token === 'dev-token-local' || token === 'dev-admin-token' || token === 'dev-manager') {
    req.user = { id: 'admin-1', role: 'manager', email: 'admin@wouchify.com', name: 'Platform Manager' };
    return next();
  }

  // 2. Real JWT Token Verification (tries active and legacy secrets)
  if (token && token !== 'null' && token !== 'undefined' && token !== '') {
    const candidateSecrets = [
      process.env.JWT_SECRET,
      'wouchify_super_secret_key_change_this_in_production',
      'wouchify_super_secret_dev_key'
    ].filter(Boolean);

    for (const secret of candidateSecrets) {
      try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        return next();
      } catch {
        // Try next secret candidate
      }
    }
  }

  // 3. Fallback for Local Dev Mode
  const referer = req.header('Referer') || '';
  if (process.env.NODE_ENV !== 'production' || !process.env.NODE_ENV) {
    if (referer.includes('/executive')) {
      req.user = { id: 'exec-dev', role: 'executive', email: 'executive@wouchify.com', name: 'Content Executive' };
      return next();
    }
    if (referer.includes('/operations') || referer.includes('/operational-manager')) {
      req.user = { id: 'ops-dev', role: 'operational_manager', email: 'ops.manager@wouchify.com', name: 'Operational Manager' };
      return next();
    }
    if (referer.includes('/manager') || referer.includes('/admin')) {
      req.user = { id: 'admin-dev', role: 'manager', email: 'admin@wouchify.com', name: 'Platform Manager' };
      return next();
    }
    
    // Default fallback in development environment
    req.user = { id: 'ops-dev', role: 'operational_manager', email: 'ops.manager@wouchify.com', name: 'Operational Manager' };
    return next();
  }

  return res.status(401).json({ message: 'Authentication required. Please log in.' });
};

module.exports = authMiddleware;
