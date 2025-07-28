import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: '/Generate-IBAN/',
  define: {
    __DEV__: mode === 'development',
  },
  server: {
    headers: {
      // Development CSP - Allows Vite HMR and dev tools
      'Content-Security-Policy': mode === 'development' 
        ? "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; connect-src 'self' ws: wss: http://localhost:* https://localhost:*; img-src 'self' data: blob:; object-src 'none'; base-uri 'self'; worker-src 'self' blob:;"
        : undefined
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          i18n: ['i18next', 'react-i18next', 'i18next-browser-languagedetector']
        }
      }
    }
  }
}))
