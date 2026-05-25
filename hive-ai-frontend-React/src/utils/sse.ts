/**
 * 使用 fetch 消费 SSE 流，兼容 Spring WebFlux 与 SseEmitter 格式
 */
import type { ChatAttachment } from '@/types/attachment'

export async function consumeSseStream(
  url: string,
  {
    onChunk,
    onAttachment,
    onDone,
    onError,
    signal,
  }: {
    onChunk?: (chunk: string) => void
    onAttachment?: (attachment: ChatAttachment) => void
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
      buffer = flushSseBuffer(buffer, onChunk, onAttachment)
    }

    if (buffer) {
      emitSsePayload(buffer, onChunk, onAttachment)
    }
    onDone?.()
  } catch (err) {
    if ((err as Error).name !== 'AbortError') {
      onError?.(err as Error)
    }
  }
}

function flushSseBuffer(
  buffer: string,
  onChunk?: (chunk: string) => void,
  onAttachment?: (attachment: ChatAttachment) => void,
) {
  let rest = buffer

  while (true) {
    const eventEnd = rest.indexOf('\n\n')
    if (eventEnd === -1) break

    const block = rest.slice(0, eventEnd)
    rest = rest.slice(eventEnd + 2)
    emitSsePayload(block, onChunk, onAttachment)
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

function parseAttachmentPayload(raw: string): ChatAttachment | null {
  try {
    const parsed = JSON.parse(raw) as ChatAttachment
    if (!parsed?.id || !parsed?.fileName || !parsed?.url) {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

function emitSsePayload(
  block: string,
  onChunk?: (chunk: string) => void,
  onAttachment?: (attachment: ChatAttachment) => void,
) {
  if (!block) return

  const lines = block.split('\n')
  const dataLines: string[] = []
  let eventName = 'message'

  for (const line of lines) {
    if (line.startsWith('event:')) {
      eventName = line.slice(6).trim()
      continue
    }
    if (line.startsWith('data:')) {
      dataLines.push(line.slice(5).replace(/^\s/, ''))
      continue
    }
    if (
      line.trim() &&
      !line.startsWith('id:') &&
      !line.startsWith(':')
    ) {
      dataLines.push(line)
    }
  }

  if (dataLines.length) {
    const payload = normalizeSseDataLines(dataLines)
    if (eventName === 'attachment') {
      const attachment = parseAttachmentPayload(payload)
      if (attachment) {
        onAttachment?.(attachment)
      }
      return
    }
    onChunk?.(payload)
    return
  }

  const trimmed = block.trim()
  if (trimmed) {
    onChunk?.(trimmed)
  }
}
