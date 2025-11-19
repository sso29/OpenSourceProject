import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',  // spring 서버
        changeOrigin: true,
        secure: false,
      },
      '/ai-api': { 
        target: 'http://localhost:5001', // 5001 포트로 노출된 AI 서버
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ai-api/, ''),
    },
    },
  },
})
