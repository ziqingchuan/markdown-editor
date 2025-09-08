import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import compression from 'vite-plugin-compression'; // 新增：压缩插件
// https://vite.dev/config/
export default defineConfig({
  plugins: [
      vue(),
      compression({
        algorithm: 'gzip',
        threshold: 10240, // 大于10KB的文件才压缩
      })
  ],
  base: './',
  // base: '/markdown-editor/',
  optimizeDeps: {
    include: ['mammoth', 'pdfjs-dist'],
  },
  build: {
    // 分割代码
    rollupOptions: {
      output: {
        manualChunks: {
          // 将大型库单独打包
          html2pdf: ['html2pdf.js'],
          marked: ['marked'],
          dompurify: ['dompurify'],
          compressorjs: ['compressorjs'],
          mammoth: ['mammoth'],
          pdfjsDist: ['pdfjs-dist'],
          prismjs: ['prismjs'],
        }
      }
    },
    // 调整警告阈值（可选）
    chunkSizeWarningLimit: 1000 // 1000KB
  },
})
