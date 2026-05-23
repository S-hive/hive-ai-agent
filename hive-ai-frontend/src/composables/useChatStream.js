import { ref } from 'vue'
import { consumeSseStream } from '../utils/sse'

let messageSeq = 0

function nextMessageId() {
  messageSeq += 1
  return `msg-${Date.now()}-${messageSeq}`
}

export function useChatStream(buildUrl, options = {}) {
  const { chunkSeparator = '' } = options
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
      content: '',
      loading: true,
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
        msg.loading = false
        if (chunkSeparator && msg.content) {
          msg.content += chunkSeparator
        }
        msg.content += chunk
      },
      onDone: () => {
        const msg = messages.value[assistantIndex]
        if (msg) msg.loading = false
        loading.value = false
        abortController = null
      },
      onError: (err) => {
        const msg = messages.value[assistantIndex]
        if (msg) {
          msg.loading = false
          msg.content = msg.content || `请求失败：${err?.message || '未知错误'}`
        }
        loading.value = false
        abortController = null
      },
    })
  }

  function clearMessages() {
    if (abortController) {
      abortController.abort()
      abortController = null
    }
    messages.value = []
    loading.value = false
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
    clearMessages,
    stop,
  }
}
