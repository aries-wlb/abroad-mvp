import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import generateHtmlWithRoutes from './src/plugins/generateHtmlWithRoutes'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), generateHtmlWithRoutes()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src/') },
  },
  server: {
    open: true,
    proxy: {
      '/dev/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        rewrite: path => path.replace(/^\/dev\/api/, ''),
      },
    },
  },
  build: {
    assetsDir: '',
  },
  base: '/',
})
