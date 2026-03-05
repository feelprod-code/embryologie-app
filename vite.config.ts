import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    proxy: {
      '/cf-stream': {
        target: 'https://customer-6i2z59dst7q6iswv.cloudflarestream.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cf-stream/, '')
      }
    }
  }
})
