# hive-ai-agent
基于 Spring Boot 3 + Spring AI + RAG + Tool Calling + MCP 的企业级 AI 恋爱大师智能体，为用户提供情感指导服务。支持多轮对话、记忆持久化、RAG 知识库检索等能力，并且基于 ReAct 模式，能够自主思考并调用工具来完成复杂任务，比如利用网页搜索、资源下载和 PDF 生成工具制定完整的约会计划并生成文档。
## 项目架构

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
```

```
## 功能截图




