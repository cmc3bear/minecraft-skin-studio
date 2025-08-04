import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Three.js and 3D dependencies - lazy loaded on editor page
          'three': ['three', 'three-stdlib'],
          // AI and OpenAI dependencies - only loaded when AI features are used
          'ai': ['openai'],
          // React core - needed immediately
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Large utility libraries
          'utils': ['./src/utils/canvasUtils.ts', './src/utils/defaultSkins.ts', './src/utils/minecraftExport.ts']
        }
      }
    },
    chunkSizeWarningLimit: 600, // Increase warning limit slightly
    sourcemap: false, // Disable sourcemaps in production for smaller build
  },
  // Optimize deps for better chunking
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: ['three', 'three-stdlib', 'openai'] // Exclude heavy deps from pre-bundling
  }
})
