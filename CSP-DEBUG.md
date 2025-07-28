# Web Inspector & CSP Debug Guide

## Het Probleem
Je website gebruikt Content Security Policy (CSP) voor beveiliging. Dit kan soms de web inspector blokkeren, vooral in development mode waar Vite speciale permissions nodig heeft.

## Oplossingen per Situatie

### 🛠️ Development (npm run dev)
**Status**: Web inspector werkt automatisch
- CSP is automatisch aangepast voor development
- Vite HMR (Hot Module Replacement) werkt
- Alle browser dev tools werken normaal

### 🌐 Production Site (live website)
**Status**: Web inspector werkt, maar beperkt voor security

#### Normale Production Mode
- Web inspector werkt voor DOM inspectie
- Console werkt normaal
- Secure CSP voorkomt XSS aanvallen

#### Debug Mode voor Production Issues
Als je problemen hebt op de live site en meer permissies nodig hebt:

**Optie 1: URL Parameter (tijdelijk)**
```
https://jouwsite.com/?debug
```

**Optie 2: Browser Console (persistent)**
```javascript
enableDebugCSP()
```

**Uitschakelen debug mode:**
```javascript
disableDebugCSP()
```

**CSP status bekijken:**
```javascript
showCSPInfo()
```

## CSP Levels Uitgelegd

### 🔒 Production CSP (normaal)
- **Veilig** - Voorkomt XSS aanvallen
- **Web inspector werkt** - DOM inspectie, console, network tab
- **Beperkt** - Geen inline scripts van derden

### 🔓 Development CSP  
- **Vite-vriendelijk** - HMR werkt
- **Dev tools optimized** - Alle browser tools werken
- **Minder veilig** - Alleen voor development

### 🚨 Debug CSP (alleen voor debugging)
- **Ultra-permissief** - Alles werkt
- **NIET VEILIG** - Alleen gebruiken voor debugging
- **Tijdelijk** - Schakel uit na debugging

## Praktische Tips

### Voor Development
```bash
npm run dev
# Web inspector werkt automatisch
```

### Voor Production Debugging
1. **Open je live website**
2. **Open browser console** (F12)
3. **Type**: `enableDebugCSP()`
4. **Pagina herlaadt** met debug CSP
5. **Debug je probleem**
6. **Type**: `disableDebugCSP()` (belangrijk!)

### Troubleshooting
Als de DOM nog steeds leeg lijkt:
1. Check **Elements tab** (niet Sources tab)
2. Refresh de Elements tab
3. Kijk naar Console voor JavaScript errors
4. Probeer debug mode: `?debug` in URL

## Security Note
⚠️ **Vergeet niet debug mode uit te schakelen** na debugging op production!
Debug CSP maakt je site kwetsbaar voor aanvallen.