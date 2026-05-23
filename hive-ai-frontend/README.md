# Hive AI Frontend

基于 Vue 3 + Vite + Axios 的 Hive AI 前端应用。

## 功能

- **主页**：切换「AI 学习搭子」与「AI 超级智能体」
- **学习搭子**：白色聊天室风格，SSE 流式调用 `/ai/study_app/chat/sse`，自动生成 `chatId`
- **超级智能体**：同款 UI，SSE 流式调用 `/ai/manus/chat`

## 开发

```bash
npm install
npm run dev
```

默认访问 http://localhost:5173 ，开发环境通过 Vite 代理将 `/api` 转发到 `http://localhost:8123`。

请先启动 Spring Boot 后端（端口 8123）。

## 构建

```bash
npm run build
npm run preview
```
