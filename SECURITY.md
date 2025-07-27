# Security Policy

## Content Security Policy (CSP)

This application implements a dual CSP strategy to balance security and development experience:

### Production CSP (GitHub Pages)
```
default-src 'self'; 
script-src 'self'; 
style-src 'self' https://fonts.googleapis.com; 
font-src 'self' https://fonts.gstatic.com; 
connect-src 'self'; 
img-src 'self' data:; 
object-src 'none'; 
base-uri 'self'; 
form-action 'self'; 
frame-ancestors 'none'; 
upgrade-insecure-requests
```

**Security Features:**
- ✅ Prevents XSS attacks by blocking inline scripts
- ✅ Blocks code injection via `eval()`
- ✅ Prevents clickjacking with `frame-ancestors 'none'`
- ✅ Forces HTTPS with `upgrade-insecure-requests`
- ✅ Restricts resource loading to same origin + trusted CDNs

### Development CSP (Local Development)
```
default-src 'self'; 
script-src 'self' 'unsafe-inline' 'unsafe-eval'; 
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
font-src 'self' https://fonts.gstatic.com; 
connect-src 'self' ws: wss:; 
img-src 'self' data:; 
object-src 'none'; 
base-uri 'self'
```

**Development Features:**
- 🔧 Allows React DevTools to function
- 🔧 Enables hot module replacement (HMR)
- 🔧 Supports inline styles for debugging
- ⚠️ Less secure - only used in development

## How It Works

1. **Environment Detection**: The app automatically detects if it's running in development or production
2. **Dynamic CSP**: CSP is applied based on the environment using `src/config/csp.ts`
3. **Build Time**: Production builds use the strict CSP from `index.html`
4. **Runtime**: Development mode relaxes CSP to allow dev tools

## Testing Security

```bash
# Test with production CSP (secure)
npm run preview:secure

# Test with development CSP (dev tools enabled)
npm run dev
```

## Security Headers

Additional security headers are applied:
- `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
- `X-XSS-Protection: 1; mode=block` - Legacy XSS protection
- `X-Frame-Options: SAMEORIGIN` - Clickjacking protection

## Reporting Security Issues

If you discover a security vulnerability, please report it to the maintainers privately.