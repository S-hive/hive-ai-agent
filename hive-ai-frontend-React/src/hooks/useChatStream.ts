import { useCallback, useRef, useState } from 'react'
import { consumeSseStream } from '@/utils/sse'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  loading?: boolean
}

let messageSeq = 0

function nextMessageId() {
  messageSeq += 1
  return `msg-${Date.now()}-${messageSeq}`
}

export function useChatStream(
  buildUrl: (message: string) => string,
  options: { chunkSeparator?: string } = {},
) {
  const { chunkSeparator = '' } = options
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  const sendMessage = useCallback(
    async (userText: string) => {
      if (!userText.trim() || loading) return

      const userMessage: ChatMessage = {
        id: nextMessageId(),
        role: 'user',
        content: userText,
      }
      const assistantId = nextMessageId()

      setMessages((prev) => [
        ...prev,
        userMessage,
        { id: assistantId, role: 'assistant', content: '', loading: true },
      ])
      setLoading(true)

      const abortController = new AbortController()
      abortControllerRef.current = abortController

      const url = buildUrl(userText)

      await consumeSseStream(url, {
        signal: abortController.signal,
        onChunk: (chunk) => {
          setMessages((prev) =>
            prev.map((msg) => {
              if (msg.id !== assistantId) return msg
              const separator = chunkSeparator && msg.content ? chunkSeparator : ''
              return {
                ...msg,
                loading: false,
                content: msg.content + separator + chunk,
              }
            }),
          )
        },
        onDone: () => {
          setMessages((prev) =>
            prev.map((msg) => (msg.id === assistantId ? { ...msg, loading: false } : msg)),
          )
          setLoading(false)
          abortControllerRef.current = null
        },
        onError: (err) => {
          setMessages((prev) =>
            prev.map((msg) => {
              if (msg.id !== assistantId) return msg
              return {
                ...msg,
                loading: false,
                content: msg.content || `请求失败：${err?.message || '未知错误'}`,
              }
            }),
          )
          setLoading(false)
          abortControllerRef.current = null
        },
      })
    },
    [buildUrl, chunkSeparator, loading],
  )

  const clearMessages = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setMessages([])
    setLoading(false)
  }, [])

  const stop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setLoading(false)
  }, [])

  return {
    messages,
    loading,
    sendMessage,
    clearMessages,
    stop,
  }
}
