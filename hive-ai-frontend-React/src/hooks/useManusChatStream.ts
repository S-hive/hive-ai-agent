import { useCallback, useRef, useState } from 'react'
import { consumeSseStream } from '@/utils/sse'
import {
  appendManusChunk,
  finalizeManusAssistantMessage,
  type ManusAssistantMessage,
} from '@/utils/manusMessageParser'

export type ManusMessage =
  | { id: string; role: 'user'; content: string }
  | ManusAssistantMessage

let messageSeq = 0

function nextMessageId() {
  messageSeq += 1
  return `msg-${Date.now()}-${messageSeq}`
}

function createAssistantPlaceholder(): ManusAssistantMessage {
  return {
    id: nextMessageId(),
    role: 'assistant',
    loading: true,
    phase: 'thinking',
    summarizing: false,
    thinking: '',
    thinkingSteps: [],
    metaLines: [],
    answer: '',
    thinkingStartedAt: Date.now(),
    thinkingDurationMs: 0,
    rawBuffer: '',
  }
}

export function useManusChatStream(buildUrl: (message: string) => string) {
  const [messages, setMessages] = useState<ManusMessage[]>([])
  const [loading, setLoading] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  const sendMessage = useCallback(
    async (userText: string) => {
      if (!userText.trim() || loading) return

      const assistant = createAssistantPlaceholder()

      setMessages((prev) => [
        ...prev,
        { id: nextMessageId(), role: 'user', content: userText },
        assistant,
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
              if (msg.role !== 'assistant' || msg.id !== assistant.id) return msg
              const updated = { ...msg, rawBuffer: msg.rawBuffer + chunk }
              appendManusChunk(updated, chunk)
              return { ...updated }
            }),
          )
        },
        onDone: () => {
          setMessages((prev) =>
            prev.map((msg) => {
              if (msg.role !== 'assistant' || msg.id !== assistant.id) return msg
              const updated = { ...msg, loading: false }
              finalizeManusAssistantMessage(updated)
              return { ...updated }
            }),
          )
          setLoading(false)
          abortControllerRef.current = null
        },
        onError: (err) => {
          setMessages((prev) =>
            prev.map((msg) => {
              if (msg.role !== 'assistant' || msg.id !== assistant.id) return msg
              return {
                ...msg,
                loading: false,
                summarizing: false,
                answer: msg.answer || `请求失败：${err?.message || '未知错误'}`,
                thinkingDurationMs: Date.now() - (msg.thinkingStartedAt || Date.now()),
              }
            }),
          )
          setLoading(false)
          abortControllerRef.current = null
        },
      })
    },
    [buildUrl, loading],
  )

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
    stop,
  }
}
