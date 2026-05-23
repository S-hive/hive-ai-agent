import { ref } from 'vue'
import { consumeSseStream } from '../utils/sse'
import { appendManusChunk, finalizeManusAssistantMessage } from '../utils/manusMessageParser'

let messageSeq = 0

function nextMessageId() {
  messageSeq += 1
  return `msg-${Date.now()}-${messageSeq}`
}

export function useManusChatStream(buildUrl) {
  const messages = ref([])
  const loading = ref(false)
  let abortController = null

  function addUserMessage(content) {
    messages.value.push({
      id: nextMessageId(),
      role: 'user',
      content,
    })
  }

  function addAssistantPlaceholder() {
    messages.value.push({
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
    })
    return messages.value.length - 1
  }

  async function sendMessage(userText) {
    if (!userText.trim() || loading.value) return

    addUserMessage(userText)
    const assistantIndex = addAssistantPlaceholder()
    loading.value = true
    abortController = new AbortController()

    const url = buildUrl(userText)

    await consumeSseStream(url, {
      signal: abortController.signal,
      onChunk: (chunk) => {
        const msg = messages.value[assistantIndex]
        if (!msg) return
        msg.rawBuffer += chunk
        appendManusChunk(msg, chunk)
      },
      onDone: () => {
        const msg = messages.value[assistantIndex]
        if (msg) {
          msg.loading = false
          finalizeManusAssistantMessage(msg)
        }
        loading.value = false
        abortController = null
      },
      onError: (err) => {
        const msg = messages.value[assistantIndex]
        if (msg) {
          msg.loading = false
          msg.summarizing = false
          msg.answer = msg.answer || `请求失败：${err?.message || '未知错误'}`
          msg.thinkingDurationMs = Date.now() - (msg.thinkingStartedAt || Date.now())
        }
        loading.value = false
        abortController = null
      },
    })
  }

  function stop() {
    if (abortController) {
      abortController.abort()
      abortController = null
    }
    loading.value = false
  }

  return {
    messages,
    loading,
    sendMessage,
    stop,
  }
}
