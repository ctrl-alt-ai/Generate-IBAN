# 🔍 Professional Web Inspector Debugging Guide

## Hoe Experts bij Grote Bedrijven Dit Doen

### 1. **Browser DevTools - De Basis**

#### ✅ **Juiste Tab Gebruiken**
- **Elements Tab** - Voor DOM inspectie (NIET Sources tab)
- **Console Tab** - Voor JavaScript errors
- **Network Tab** - Voor resource loading issues
- **Security Tab** - Voor CSP violations

#### ✅ **DOM Inspectie Stappen**
1. **Rechtsklik** op de pagina → "Inspect Element"
2. **Ga naar Elements tab**
3. **Zoek naar `<div id="root">`**
4. **Klik op het driehoekje** om uit te klappen
5. **Refresh de pagina** als DOM leeg lijkt

### 2. **CSP Debugging - Professioneel**

#### ✅ **CSP Violations Checken**
```javascript
// In Console tab - check voor CSP errors:
// Zoek naar berichten zoals:
// "Refused to execute inline script because it violates the following Content Security Policy directive"
```

#### ✅ **CSP Headers Controleren**
```bash
# Via curl (command line):
curl -I https://jouw-site.com

# Zoek naar:
# Content-Security-Policy: ...
```

#### ✅ **Browser Security Tab**
1. Open **DevTools** → **Security tab**
2. Check **"View certificate"** sectie
3. Kijk naar **CSP violations** warnings

### 3. **React Debugging - Enterprise Methoden**

#### ✅ **React DevTools Extension**
```
1. Installeer React Developer Tools browser extensie
2. Open DevTools → "Components" tab
3. Bekijk React component tree
4. Check props en state
```

#### ✅ **JavaScript Execution Check**
```javascript
// In Console tab:
console.log('JavaScript werkt:', typeof React !== 'undefined');
console.log('DOM root:', document.getElementById('root'));
console.log('Root children:', document.getElementById('root').children.length);
```

#### ✅ **Network Tab Analysis**
1. Open **Network tab**
2. Refresh pagina
3. Check of **JavaScript files** laden (status 200)
4. Check of **CSS files** laden
5. Zoek naar **failed requests** (rood)

### 4. **Production vs Development**

#### 🛠️ **Development Environment**
```bash
# Lokaal testen:
npm run dev
# Open: http://localhost:5173
# DevTools werken volledig
```

#### 🌐 **Production Environment**  
```bash
# Production build testen:
npm run build
python3 -m http.server 8080 --directory dist
# Open: http://localhost:8080
# Test of production CSP JavaScript toestaat
```

### 5. **Veel Voorkomende Problemen & Oplossingen**

#### ❌ **Probleem: DOM toont alleen `<div id="root"></div>`**
**Oorzaken:**
- CSP blokkeert JavaScript
- JavaScript errors in Console
- React app laadt niet

**Oplossing:**
1. Check **Console tab** voor errors
2. Check **Network tab** - laden JS files?
3. Check **Security tab** - CSP violations?

#### ❌ **Probleem: "Script blocked by CSP"**
**Oplossing:**
```html
<!-- Te streng: -->
<meta http-equiv="Content-Security-Policy" content="script-src 'none'">

<!-- Correct: -->
<meta http-equiv="Content-Security-Policy" content="script-src 'self'">
```

#### ❌ **Probleem: Werkt lokaal maar niet op live site**
**Oplossing:**
1. Check of **deployment** up-to-date is
2. **Hard refresh** browser (Ctrl+F5)
3. Check **different browser**
4. Check **browser cache**

### 6. **Professional Tools & Techniques**

#### ✅ **Lighthouse Audit**
```
1. DevTools → Lighthouse tab
2. Run audit
3. Check "Best Practices" sectie
4. Kijk naar CSP recommendations
```

#### ✅ **Performance Monitoring**
```javascript
// Check render performance:
console.time('React Render');
// ... React renders ...
console.timeEnd('React Render');
```

#### ✅ **Error Monitoring (Production)**
```javascript
// Professionele error tracking:
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
  // In productie: send to monitoring service
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise:', e.reason);
  // In productie: send to monitoring service  
});
```

### 7. **Quick Diagnosis Checklist**

```
□ Elements tab toont volledige DOM structuur
□ Console tab heeft geen rode errors
□ Network tab toont alle resources laden (200 status)
□ Security tab toont geen CSP violations
□ React DevTools extension werkt
□ Hard refresh gedaan (Ctrl+F5)
□ Verschillende browser getest
□ Incognito mode getest
```

### 8. **Enterprise Debugging Commands**

```javascript
// Quick DOM check:
document.getElementById('root').innerHTML.length > 50

// React check:
typeof window.React !== 'undefined'

// CSP check:
document.querySelector('meta[http-equiv="Content-Security-Policy"]').content

// Performance check:
performance.getEntriesByType('navigation')[0].loadEventEnd
```

## 🎯 Conclusion

**Grote bedrijven houden het simpel:**
1. **Eenvoudige CSP** - Geen complexe JavaScript manipulatie
2. **Environment-based configuration** - Development vs Production
3. **Standard browser tools** - Geen custom debug scripts
4. **Systematic debugging** - Volg altijd dezelfde stappen
5. **Proper monitoring** - Log errors, don't guess

**De beste debugging tool is gewoon je browser DevTools gebruikt op de juiste manier.**