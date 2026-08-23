# Shineway SCADA 前端

Vue 3 + Vite 8 + 严格 TypeScript 的机台看板。前端只访问 `shinewayserver` 提供的 HTTP API，不直接连接数据库。

## 开发

```powershell
npm ci
npm run dev
```

开发服务器把 `/api` 代理到 `.env` 中的 `VITE_API_PROXY_TARGET`。可从 `.env.example` 复制配置。

## 检查与构建

```powershell
npm run typecheck
npm run build
```

生产环境由统一 Nginx 网关发布到 `/scada/`，并把同域 `/api/` 反向代理到后端 `7003` 端口。若前后端使用不同域名，在构建前设置 `VITE_API_BASE_URL` 为完整 API 地址。
