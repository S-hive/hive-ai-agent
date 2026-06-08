# Hive AI Agent
基于 Spring Boot 3 + Spring AI + RAG + Tool Calling + MCP 的企业级 AI 智能体，为用户提供学习指导服务。支持多轮对话、记忆持久化、RAG 知识库检索等能力，并且基于 ReAct 模式，能够自主思考并调用工具来完成复杂任务，比如利用网页搜索、资源下载和 PDF 生成工具制定完整的学习计划并生成文档。

## 功能特性

### AI 学习搭子
- 面向学习场景：学习计划、知识点讲解、习题思路
- 多轮对话记忆（基于文件持久化）
- SSE 流式回复，支持 Markdown + KaTeX 数学公式渲染
- 可配置系统提示词（`SystemPrompt.md`、`StudyResponseStyle.md`）

### AI 超级智能体（Manus）
- ReAct + Tool Calling 多步推理
- 内置工具：网页搜索、图片搜索下载、网页抓取、文件读写、PDF 生成、资源下载、终端命令等
- 思考过程与最终回答分开展示
- 工具产出文件通过 SSE `attachment` 事件推送，前端可预览/下载

### 其他能力
- 附件服务：`/api/attachments/{id}`
- API 文档：Knife4j / Swagger（`/api/doc.html`）
- RAG 知识库（PgVector / 云知识库，部分配置可选）
- Docker 部署

## 技术选型

本项目以 **Spring AI** 为核心开发框架，结合主流 AI 客户端与工具库，构建企业级 AI 智能体应用。

### AI 核心架构
- **基础框架**：Java 21 + Spring Boot 3
- **AI 编排**：Spring AI + LangChain4j
- **智能体模式**：ReAct Agent (自主思考) + Tool Calling (工具调用) + MCP (模型上下文协议)
- **知识库 (RAG)**：PGvector 向量数据库 + RAG 检索增强生成

### 部署与模型服务
- **大模型平台**：百度百炼 (AI 大模型开发平台)
- **本地部署**：Ollama (支持私有化模型运行)
- **计算服务**：Serverless 架构

### 业务功能组件
- **第三方集成**：SearchAPI (联网搜索) / Pexels API (资源获取)
- **文档处理**：iText PDF 生成
- **开发辅助**：Cursor AI + MCP (代码生成)、Knife4j (接口文档)

## 架构设计
<img width="770" height="932" alt="image" src="https://github.com/user-attachments/assets/fa35e2c2-faef-4465-ac79-99bd7fd2b8f6" />

## 快速开始

### 环境要求
- JDK 21+
- Maven 3.9+
- Node.js 20+（前端）
- 阿里云百炼 API Key（`DASHSCOPE_API_KEY`）

### 1. 配置后端

在 `src/main/resources/` 下创建 `application-local.yaml`（已被 gitignore），示例：

```yaml
spring:
  ai:
    dashscope:
      api-key: ${DASHSCOPE_API_KEY:你的百炼API密钥}

search-api:
  api-key: ${SEARCH_API_API_KEY:}   # 可选，用于网页/图片搜索
```

或通过环境变量注入：

```bash
# Windows PowerShell
$env:DASHSCOPE_API_KEY="sk-xxx"
$env:SEARCH_API_API_KEY="xxx"
```
2. 启动后端
```bash
mvn spring-boot:run
```
默认地址：http://localhost:8123/api

3. 启动前端
```bash
npm install
npm run dev
```
默认地址：http://localhost:5174（通过 Vite 代理访问 /api）

## 功能截图
<img width="1863" height="1045" alt="image" src="https://github.com/user-attachments/assets/cde8a185-bd57-499a-8b9e-d21eab757fcd" />

<img width="1863" height="1045" alt="image" src="https://github.com/user-attachments/assets/d939eae6-be8b-456e-8ea5-744f84577e66" />

<img width="1863" height="1045" alt="image" src="https://github.com/user-attachments/assets/224fb37e-a70a-40c1-abbc-9424139d6668" />






