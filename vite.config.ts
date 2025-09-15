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
  server: {
    host: true, // 确保可以通过局域网访问
    proxy: {
      '/api/picgo': {
        target: 'https://www.picgo.net', // 目标接口域名（picgo的根域名）
        changeOrigin: true, // 开启跨域：让目标接口认为请求来自「本地代理服务器」，而非前端
        rewrite: (path) => path.replace(/^\/api\/picgo/, ''), // 重写路径：去掉前缀，还原真实接口路径
        // 可选：若接口是HTTPS，忽略证书校验（开发环境用，生产环境需关闭）
        secure: false
      },
      '/proxy': {
        target: 'https://spark-api-open.xf-yun.com', // 确保地址和端口正确
        changeOrigin: true,
        secure: false,
      },
    },
  },
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
          highlightjs: ['highlight.js'],
          marked: ['marked'],
          mermaid: ['mermaid'],
          dompurify: ['dompurify'],
          compressorjs: ['compressorjs'],
          mammoth: ['mammoth'],
          pdfjsDist: ['pdfjs-dist'],
        }
      }
    },
    // 调整警告阈值（可选）
    chunkSizeWarningLimit: 1000 // 1000KB
  },
})
