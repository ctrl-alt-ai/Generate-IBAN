# 🔍 Web Inspector Expert Guide

## Quick Start

### ✅ **Development Mode (Recommended)**
```bash
npm run dev
# Open http://localhost:5173
# Web Inspector works perfectly!
```

### 🚨 **Debug Mode (Ultra Permissive)**
```bash
npm run dev
# Then in browser console:
enableDebugCSP()
# Or add ?debug to URL: http://localhost:5173?debug
```

### 🔒 **Production Testing**
```bash
npm run preview:secure
# Test with strict CSP like GitHub Pages
```

## 🎯 **Expert Web Inspector Settings**

### **Chrome DevTools - Optimal Settings**

#### **1. General Settings**
```
⚙️ Settings → Preferences:
☑️ Show rulers on hover
☑️ Show user agent shadow DOM
☑️ Enable CSS source maps
☑️ Enable JavaScript source maps
☑️ Auto-open DevTools for popups
```

#### **2. Console Settings**
```
Console → Settings:
☑️ Hide network messages
☑️ Show timestamps
☑️ Autocomplete from history
☑️ Group similar messages in console
```

#### **3. Network Tab**
```
☑️ Preserve log
☑️ Disable cache (while DevTools is open)
Filter: All, XHR/Fetch, JS, CSS, Img, Media, Font, Doc, WS, Wasm, Other
```

#### **4. Elements Tab**
```
☑️ Show user agent shadow DOM
☑️ Word wrap
☑️ Show HTML comments
☑️ Reveal DOM node on hover
```

### **Firefox Developer Tools - Optimal Settings**

#### **1. Toolbox Settings**
```
⚙️ Settings:
☑️ Enable browser chrome and add-on debugging
☑️ Enable remote debugging
☑️ Enable service workers debugging
☑️ Show browser styles
```

#### **2. Console Settings**
```
☑️ Enable timestamps
☑️ Show content messages
☑️ Persist logs
☑️ Enable autocompletion
```

## 🛠️ **CSP Debugging Commands**

### **Available in Development Console:**

```javascript
// Show current CSP configuration
showCSPInfo()

// Enable ultra-permissive debugging
enableDebugCSP()

// Disable debug mode
disableDebugCSP()

// Check if CSP is blocking something
document.addEventListener('securitypolicyviolation', (e) => {
  console.error('CSP Violation:', e.violatedDirective, e.blockedURI);
});
```

## 🔧 **Troubleshooting Common Issues**

### **Issue: Styles not showing in Elements tab**
```javascript
// Solution 1: Enable debug CSP
enableDebugCSP()

// Solution 2: Check for CSP violations
document.addEventListener('securitypolicyviolation', console.error);

// Solution 3: Temporarily disable CSP
document.querySelector('meta[http-equiv="Content-Security-Policy"]').remove();
```

### **Issue: React DevTools not working**
```bash
# Make sure you're in development mode
npm run dev

# Check CSP allows unsafe-eval
showCSPInfo()

# If needed, enable debug mode
enableDebugCSP()
```

### **Issue: Network requests blocked**
```javascript
// Check connect-src policy
showCSPInfo()

// For debugging APIs, use debug mode
enableDebugCSP()
```

## 🎨 **Advanced Debugging Techniques**

### **1. CSS Debugging**
```css
/* Add to any element for visual debugging */
* { 
  outline: 1px solid red !important; 
}

/* Debug specific component */
.your-component * {
  background: rgba(255,0,0,0.1) !important;
}
```

### **2. JavaScript Debugging**
```javascript
// Global error handler
window.addEventListener('error', (e) => {
  console.error('Global Error:', e.error);
});

// CSP violation handler
document.addEventListener('securitypolicyviolation', (e) => {
  console.group('🚨 CSP Violation');
  console.error('Directive:', e.violatedDirective);
  console.error('Blocked URI:', e.blockedURI);
  console.error('Original Policy:', e.originalPolicy);
  console.groupEnd();
});
```

### **3. Performance Debugging**
```javascript
// Measure component render time
console.time('Component Render');
// ... your code ...
console.timeEnd('Component Render');

// Monitor memory usage
console.log('Memory:', performance.memory);
```

## 📊 **CSP Security Levels**

### **🔒 Production (GitHub Pages)**
- ✅ **Maximum Security**
- ❌ No inline styles/scripts
- ❌ No eval()
- ✅ Basic debugging possible
- ✅ Network tab works
- ✅ Console works

### **🔧 Development (npm run dev)**
- ✅ **Balanced Security**
- ✅ React DevTools work
- ✅ Hot reloading works
- ✅ Inline styles allowed
- ✅ Full inspector functionality

### **🚨 Debug Mode (enableDebugCSP)**
- ⚠️ **Minimal Security**
- ✅ Everything works
- ✅ All browser extensions work
- ✅ Perfect for deep debugging
- ❌ Use only for debugging!

## 🎯 **Expert Tips**

### **1. Conditional Breakpoints**
```javascript
// Break only when specific condition is true
if (user.id === 'debug-user') {
  debugger;
}
```

### **2. Network Throttling**
```
DevTools → Network → Throttling:
- Fast 3G (for mobile testing)
- Slow 3G (for poor connections)
- Offline (for offline functionality)
```

### **3. Device Simulation**
```
DevTools → Device Toolbar:
- iPhone 12 Pro
- iPad
- Desktop HD
- Custom responsive dimensions
```

### **4. Performance Profiling**
```
DevTools → Performance:
1. Click record
2. Interact with your app
3. Stop recording
4. Analyze the flame graph
```

## 🚀 **Production Debugging**

### **For GitHub Pages (Limited)**
```javascript
// Safe debugging in production
console.log('Debug info:', {
  userAgent: navigator.userAgent,
  url: window.location.href,
  timestamp: new Date().toISOString()
});

// Monitor errors
window.addEventListener('error', (e) => {
  // Send to your logging service
  fetch('/api/log-error', {
    method: 'POST',
    body: JSON.stringify({
      message: e.message,
      filename: e.filename,
      lineno: e.lineno,
      colno: e.colno
    })
  });
});
```

## 📝 **Best Practices**

1. **Always use development mode** for debugging
2. **Enable debug CSP** only when needed
3. **Test with production CSP** before deploying
4. **Use console commands** for quick CSP changes
5. **Monitor CSP violations** in production
6. **Keep DevTools settings** consistent across team

---

**Remember**: The goal is maximum security in production while maintaining excellent developer experience in development!