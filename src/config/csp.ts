// CSP Configuration for different environments
export const CSP_POLICIES = {
  // Production CSP - Maximum security for live site
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
    "upgrade-insecure-requests",
    "block-all-mixed-content"
  ].join('; '),

  // Development CSP - Optimized for debugging and dev tools
  development: [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "connect-src 'self' ws: wss: http://localhost:* https://localhost:*",
    "img-src 'self' data: blob: https:",
    "media-src 'self' data: blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "worker-src 'self' blob:"
  ].join('; '),

  // Debug CSP - Ultra permissive for deep debugging (use with caution)
  debug: [
    "default-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' data: blob:",
    "style-src 'self' 'unsafe-inline' 'unsafe-hashes' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data: blob:",
    "connect-src 'self' ws: wss: http: https:",
    "img-src 'self' data: blob: https: http:",
    "media-src 'self' data: blob: https: http:",
    "object-src 'self'",
    "base-uri 'self'",
    "worker-src 'self' blob: data:",
    "child-src 'self' blob: data:"
  ].join('; ')
};

// Enhanced CSP update function with debug mode detection
export function updateCSP() {
  const isDevelopment = import.meta.env.DEV;
  const isDebugMode = new URLSearchParams(window.location.search).has('debug') || 
                      localStorage.getItem('csp-debug') === 'true';
  const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]') as HTMLMetaElement;
  
  if (!cspMeta) return;

  if (isDebugMode && isDevelopment) {
    // Ultra permissive for debugging
    cspMeta.content = CSP_POLICIES.debug;
    console.warn('🚨 DEBUG CSP applied - Ultra permissive mode! Use only for debugging.');
    console.info('💡 To disable: localStorage.removeItem("csp-debug") or remove ?debug from URL');
  } else if (isDevelopment) {
    // Development CSP - balanced
    cspMeta.content = CSP_POLICIES.development;
    console.info('🔓 Development CSP applied - Dev tools enabled');
    console.info('💡 For ultra-permissive debugging: add ?debug to URL or run enableDebugCSP()');
  } else {
    // Production CSP - maximum security
    cspMeta.content = CSP_POLICIES.production;
    console.info('🔒 Production CSP applied - Maximum security');
  }
}

// Debug utilities for developers
declare global {
  interface Window {
    enableDebugCSP: () => void;
    disableDebugCSP: () => void;
    showCSPInfo: () => void;
  }
}

// Expert debugging utilities
if (import.meta.env.DEV) {
  window.enableDebugCSP = () => {
    localStorage.setItem('csp-debug', 'true');
    location.reload();
  };

  window.disableDebugCSP = () => {
    localStorage.removeItem('csp-debug');
    location.reload();
  };

  window.showCSPInfo = () => {
    const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]') as HTMLMetaElement;
    console.group('🔍 Current CSP Configuration');
    console.log('Policy:', cspMeta?.content || 'No CSP found');
    console.log('Environment:', import.meta.env.DEV ? 'Development' : 'Production');
    console.log('Debug Mode:', localStorage.getItem('csp-debug') === 'true');
    console.groupEnd();
  };

  // Show available debug commands
  console.group('🛠️ CSP Debug Commands Available');
  console.log('enableDebugCSP() - Enable ultra-permissive CSP');
  console.log('disableDebugCSP() - Disable debug CSP');
  console.log('showCSPInfo() - Show current CSP details');
  console.groupEnd();
}