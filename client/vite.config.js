import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/templates': 'http://localhost:2305',
      '/folders': 'http://localhost:2305',
      '/1': 'http://localhost:2305',
      '/check-status': 'http://localhost:2305',
      '/health': 'http://localhost:2305',
    },
  },
})
