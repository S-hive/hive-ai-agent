import request from './request'

const API_PREFIX = '/ai'

/**
 * 构建 SSE 请求 URL（GET 流式接口使用 fetch，axios 不适合消费 SSE）
 */
export function buildStudyAppSseUrl(message, chatId) {
  const params = new URLSearchParams({ message, chatId })
  const base = import.meta.env.VITE_API_BASE_URL || '/api'
  return `${base}${API_PREFIX}/study_app/chat/sse?${params.toString()}`
}

export function buildManusChatUrl(message) {
  const params = new URLSearchParams({ message })
  const base = import.meta.env.VITE_API_BASE_URL || '/api'
  return `${base}${API_PREFIX}/manus/chat?${params.toString()}`
}

/** 同步接口示例（axios） */
export function doChatWithStudyAppSync(message, chatId) {
  return request.get(`${API_PREFIX}/study_app/chat/sync`, {
    params: { message, chatId },
  })
}
