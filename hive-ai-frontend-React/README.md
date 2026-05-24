# Hive AI Frontend (React)

基于 React + Vite + shadcn/ui 的 Hive AI 前端应用。

## 功能

- **主页**：切换 AI 学习搭子 / AI 超级智能体
- **AI 学习搭子**：千问风格白色聊天室，自动生成会话 ID，SSE 流式调用 `/api/ai/study_app/chat/sse`
- **AI 超级智能体**：同风格界面，SSE 流式调用 `/api/ai/manus/chat`

## 组件库

已通过 shadcn CLI 正式集成：

- **shadcn/ui**：`button`、`card`、`textarea`、`scroll-area`、`avatar`、`badge`、`separator`、`skeleton`、`collapsible`
- **React Bits**：[`TextType`](https://reactbits.dev/text-animations/text-type) 打字机动画
- **UI TripleD**：[`WebPerformancePage`](https://ui.tripled.work/components/web-performance-page) 性能展示区块

添加更多组件示例：

```bash
npx.cmd shadcn@latest add @react-bits/TextType-TS-TW
npx.cmd shadcn@latest add https://ui.tripled.work/r/web-performance-page-shadcnui.json
npx.cmd shadcn@latest add scroll-area avatar badge
```

## 开发

```bash
npm install
npm run dev
```

默认开发地址：http://localhost:5174

后端 API 通过 Vite 代理转发到 `http://localhost:8123/api`。

## 环境变量

`.env` 中可配置：

```
VITE_API_BASE_URL=/api
```

## 构建

```bash
npm run build
npm run preview
```
