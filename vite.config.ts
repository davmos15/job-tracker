import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/job-tracker/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  define: {
    global: 'globalThis',
  }
})
