//vite.config.ts
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = env.VITE_API_PROXY_TARGET || 'http://127.0.0.1:7003'

  return {
//------------------------------------------------------------------------------------------------------------------------------------------------------
  plugins: [vue()],
//------------------------------------------------------------------------------------------------------------------------------------------------------
  server: {
      allowedHosts: ['shinewaygroup.com', 'scada.shinewaygroup.com', 'api.shinewaygroup.com'],
      host: '0.0.0.0', // 监听所有地址
      port: 5173, // 端口号（可选，默认5173）
      open: false, // 是否自动打开浏览器（可选）
      cors: true, // 允许跨域（可选，避免局域网访问时的跨域问题）
      proxy: {
        '/api': { target: apiTarget, changeOrigin: true }
      }
    },
//------------------------------------------------------------------------------------------------------------------------------------------------------ 
  preview: {
    allowedHosts: ['shinewaygroup.com', 'scada.shinewaygroup.com', 'api.shinewaygroup.com'],
    host: '0.0.0.0',
    port: 5173, 
    cors: true,
    proxy: {
      '/api': { target: apiTarget, changeOrigin: true }
    }
  },
//------------------------------------------------------------------------------------------------------------------------------------------------------
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    }
  }
//------------------------------------------------------------------------------------------------------------------------------------------------------
  }
})
