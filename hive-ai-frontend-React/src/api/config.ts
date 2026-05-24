/** 开发环境直连后端；生产环境走同域 /api（由 Nginx 等反向代理） */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? 'http://localhost:8123/api' : '/api')
