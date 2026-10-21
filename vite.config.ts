import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Served from the site root on Netlify
  base: '/',
  build: {
    // Keep flag SVGs as separate files so they load (and get cached) on demand
    assetsInlineLimit: 0,
  },
})
