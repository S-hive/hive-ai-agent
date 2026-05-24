/**
 * 使用 fetch 消费 SSE 流，兼容 Spring WebFlux 与 SseEmitter 格式
 */
export async function consumeSseStream(
  url: string,
  {
    onChunk,
    onDone,
    onError,
    signal,
  }: {
    onChunk?: (chunk: string) => void
    onDone?: () => void
    onError?: (err: Error) => void
    signal?: AbortSignal
  },
) {
  let response: Response
  try {
    response = await fetch(url, { signal })
  } catch (err) {
    if ((err as Error).name !== 'AbortError') {
      onError?.(err as Error)
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
    if ((err as Error).name !== 'AbortError') {
      onError?.(err as Error)
    }
  }
}

function flushSseBuffer(buffer: string, onChunk?: (chunk: string) => void) {
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

const STEP_PREFIX_PATTERN = /^Step\s+\d+:\s*([\s\S]*)$/

function normalizeSseDataLines(dataLines: string[]) {
  if (dataLines.length <= 1) return dataLines.join('\n')

  const first = dataLines[0]
  const stepMatch = first.match(STEP_PREFIX_PATTERN)
  if (stepMatch) {
    const stepBody = stepMatch[1].trim()
    const extras = dataLines.slice(1).map((line) => line.trim()).filter(Boolean)
    const redundantTail = extras.every(
      (line) => line === stepBody || line === first.trim(),
    )
    if (redundantTail) return first
  }

  const deduped: string[] = []
  for (const line of dataLines) {
    const trimmed = line.trim()
    if (!trimmed) continue
    if (deduped.length && deduped[deduped.length - 1].trim() === trimmed) continue
    deduped.push(line)
  }
  return deduped.join('\n')
}

function emitSsePayload(block: string, onChunk?: (chunk: string) => void) {
  if (!block) return

  const lines = block.split('\n')
  const dataLines: string[] = []

  for (const line of lines) {
    if (line.startsWith('data:')) {
      dataLines.push(line.slice(5).replace(/^\s/, ''))
    } else if (
      line.trim() &&
      !line.startsWith('event:') &&
      !line.startsWith('id:') &&
      !line.startsWith(':')
    ) {
      dataLines.push(line)
    }
  }

  if (dataLines.length) {
    onChunk?.(normalizeSseDataLines(dataLines))
    return
  }

  const trimmed = block.trim()
  if (trimmed) {
    onChunk?.(trimmed)
  }
}
