import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    hmr: {
      protocol: 'wss',
      clientPort: 443,
    },
    allowedHosts: [
      'frontend',
      'localhost',
      'cheatsheet.urben.dev'
    ],
  }
})