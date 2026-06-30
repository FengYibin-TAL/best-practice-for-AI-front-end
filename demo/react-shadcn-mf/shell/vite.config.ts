import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: 'shell',
      remotes: {
        level1: 'http://localhost:5175/assets/remoteEntry.js',
        level2: 'http://localhost:5176/assets/remoteEntry.js',
        level3: 'http://localhost:5177/assets/remoteEntry.js',
      },
      shared: ['react', 'react-dom'],
    }),
  ],
  build: { target: 'esnext' },
})
