import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/markdown-editor/',
  build: {
    // 分割代码
    rollupOptions: {
      output: {
        manualChunks: {
          // 将大型库单独打包
          html2pdf: ['html2pdf.js'],
          highlight: ['highlight.js'],
          marked: ['marked'],
          dompurify: ['dompurify']
        }
      }
    },
    // 调整警告阈值（可选）
    chunkSizeWarningLimit: 1000 // 1000KB
  },
})
