import request from './request'

const API_PREFIX = '/ai'

export function buildStudyAppSseUrl(message: string, chatId: string) {
  const params = new URLSearchParams({ message, chatId })
  const base = import.meta.env.VITE_API_BASE_URL || '/api'
  return `${base}${API_PREFIX}/study_app/chat/sse?${params.toString()}`
}

export function buildManusChatUrl(message: string) {
  const params = new URLSearchParams({ message })
  const base = import.meta.env.VITE_API_BASE_URL || '/api'
  return `${base}${API_PREFIX}/manus/chat?${params.toString()}`
}

export function doChatWithStudyAppSync(message: string, chatId: string) {
  return request.get(`${API_PREFIX}/study_app/chat/sync`, {
    params: { message, chatId },
  })
}
