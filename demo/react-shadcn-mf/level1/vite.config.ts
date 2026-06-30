import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'level1',
      filename: 'remoteEntry.js',
      exposes: { './LevelApp': './src/LevelApp.tsx' },
      shared: ['react', 'react-dom'],
    }),
  ],
  build: { target: 'esnext', cssCodeSplit: false },
})
