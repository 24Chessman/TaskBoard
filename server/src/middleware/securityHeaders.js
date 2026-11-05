// Basic security headers for every response. There is no Content-Security-Policy on purpose: the client loads
// Google Fonts and uses inline styles, so a policy would need to be written and tested for them first.
const securityHeaders = (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
};

export default securityHeaders;
