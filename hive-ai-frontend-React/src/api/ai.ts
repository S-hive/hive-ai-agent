import request from './request'
import { API_BASE_URL } from './config'

const API_PREFIX = '/ai'

export function buildStudyAppSseUrl(message: string, chatId: string) {
  const params = new URLSearchParams({ message, chatId })
  return `${API_BASE_URL}${API_PREFIX}/study_app/chat/sse?${params.toString()}`
}

export function buildManusChatUrl(message: string) {
  const params = new URLSearchParams({ message })
  return `${API_BASE_URL}${API_PREFIX}/manus/chat?${params.toString()}`
}
export function doChatWithStudyAppSync(message: string, chatId: string) {
  return request.get(`${API_PREFIX}/study_app/chat/sync`, {
    params: { message, chatId },
  })
}
