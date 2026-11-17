import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const root = fileURLToPath(new URL('.', import.meta.url))

// 화면은 포트폴리오와 같은 도메인의 /maple-ai/ 아래에서 서비스된다.
// 개발 중 API 는 운영 nginx(https://3geun.com/maple-ai/api)를 그대로 쓴다.
// 공유 토큰은 nginx 가 붙이므로 개발 PC 에 토큰을 둘 필요가 없다.
export default defineConfig({
  root,
  base: '/maple-ai/',
  plugins: [react(), tailwindcss()],
  server: {
    host: '127.0.0.1',
    port: 5190,
    proxy: {
      '/maple-ai/api': {
        target: process.env.MAPLE_API_ORIGIN ?? 'https://3geun.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
  preview: { host: '127.0.0.1', port: 5191 },
  build: { outDir: 'dist', emptyOutDir: true, sourcemap: false },
  test: {
    root,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: false,
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
