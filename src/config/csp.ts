// CSP Configuration for different environments
export const CSP_POLICIES = {
  // Production CSP - Strict security
  production: [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self'",
    "img-src 'self' data:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; '),

  // Development CSP - Allows dev tools but still reasonably secure
  development: [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' ws: wss:",
    "img-src 'self' data:",
    "object-src 'none'",
    "base-uri 'self'"
  ].join('; ')
};

// Function to update CSP based on environment
export function updateCSP() {
  const isDevelopment = import.meta.env.DEV;
  const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]') as HTMLMetaElement;
  
  if (cspMeta && isDevelopment) {
    // Only relax CSP in development
    cspMeta.content = CSP_POLICIES.development;
    console.info('🔓 Development CSP applied - Dev tools enabled');
  } else if (cspMeta) {
    // Ensure production CSP is applied
    cspMeta.content = CSP_POLICIES.production;
    console.info('🔒 Production CSP applied - Maximum security');
  }
}