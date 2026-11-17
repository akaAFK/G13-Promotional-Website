import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // GitHub Pages project-site base path.
  base: './',
  server: {
    proxy: {
      '/events': {
        target: process.env.VITE_EVENTS_TARGET || 'http://127.0.0.1:8000',
        changeOrigin: true
      }
    }
  }
});
