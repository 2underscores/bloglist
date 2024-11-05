import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './testSetup.js'
  },
  server: { // The Vite dev server that hotloads, etc.
    proxy: {
      '/api': {
        target: 'http://localhost:3003',
        changeOrigin: true,
      },
    },
    sourcemap: true // Ensures source maps are available in dev mode
  },
  build: {
    sourcemap: true // Ensures source maps are available for debugging
  }
})
