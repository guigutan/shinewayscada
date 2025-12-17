import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'  // Node.js 的 path



export default defineConfig({
  //------------------------------
  plugins: [vue()],
//------------------------------
  server: {
      host: '0.0.0.0', // 监听所有地址
      port: 5173, // 端口号（可选，默认5173）
      open: false, // 是否自动打开浏览器（可选）
      cors: true // 允许跨域（可选，避免局域网访问时的跨域问题）
    },
//------------------------------
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  }
//------------------------------

})