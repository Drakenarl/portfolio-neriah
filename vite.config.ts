import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2018',
    sourcemap: false,
    rollupOptions: {
      output: {
        // React change rarement : à part, il reste en cache d'une version du site à l'autre.
        manualChunks: { vendor: ['react', 'react-dom'] },
      },
    },
  },
  server: {
    port: 5180,
    open: true,
  },
})
