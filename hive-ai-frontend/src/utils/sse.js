/**
 * 使用 fetch 消费 SSE 流，兼容 Spring WebFlux 与 SseEmitter 格式
 */
export async function consumeSseStream(url, { onChunk, onDone, onError, signal }) {
  let response
  try {
    response = await fetch(url, { signal })
  } catch (err) {
    if (err.name !== 'AbortError') {
      onError?.(err)
    }
    return
  }

  if (!response.ok) {
    onError?.(new Error(`请求失败: ${response.status}`))
    return
  }

  const reader = response.body?.getReader()
  if (!reader) {
    onError?.(new Error('浏览器不支持流式读取'))
    return
  }

  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      buffer = flushSseBuffer(buffer, onChunk)
    }

    if (buffer) {
      emitSsePayload(buffer, onChunk)
    }
    onDone?.()
  } catch (err) {
    if (err.name !== 'AbortError') {
      onError?.(err)
    }
  }
}

function flushSseBuffer(buffer, onChunk) {
  let rest = buffer

  while (true) {
    const eventEnd = rest.indexOf('\n\n')
    if (eventEnd === -1) break

    const block = rest.slice(0, eventEnd)
    rest = rest.slice(eventEnd + 2)
    emitSsePayload(block, onChunk)
  }

  return rest
}

function emitSsePayload(block, onChunk) {
  if (!block) return

  const lines = block.split('\n')
  const dataLines = []

  for (const line of lines) {
    if (line.startsWith('data:')) {
      dataLines.push(line.slice(5).replace(/^\s/, ''))
    } else if (line.trim() && !line.startsWith('event:') && !line.startsWith('id:') && !line.startsWith(':')) {
      dataLines.push(line)
    }
  }

  if (dataLines.length) {
    onChunk(dataLines.join('\n'))
    return
  }

  // 兼容纯文本流（无 SSE 包装）
  const trimmed = block.trim()
  if (trimmed) {
    onChunk(trimmed)
  }
}
