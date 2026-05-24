const STEP_PATTERN = /^Step\s+(\d+):\s*([\s\S]*)$/

export type ManusChunkType = 'step' | 'meta' | 'error' | 'summary'

export interface ManusStep {
  step: number
  content: string
}

export interface ManusAssistantMessage {
  id: string
  role: 'assistant'
  loading: boolean
  phase: 'thinking' | 'summary'
  summarizing: boolean
  thinking: string
  thinkingSteps: ManusStep[]
  metaLines: string[]
  answer: string
  thinkingStartedAt: number
  thinkingDurationMs: number
  rawBuffer: string
}

export function parseManusStepChunk(chunk: string) {
  const match = chunk.match(STEP_PATTERN)
  if (match) {
    return { type: 'step' as const, step: Number(match[1]), content: match[2] }
  }
  if (isMetaStep(chunk)) {
    return { type: 'meta' as const, content: chunk.trim() }
  }
  if (chunk.startsWith('错误:') || chunk.startsWith('执行错误')) {
    return { type: 'error' as const, content: chunk.trim() }
  }
  return { type: 'summary' as const, content: chunk }
}

export function isMetaStep(content: string) {
  const text = content.trim()
  return text.startsWith('执行结束') || text.startsWith('Terminated:')
}

function formatStepForThinking(step: ManusStep) {
  if (step.content === '思考完成 - 无需行动') return ''
  return `### 步骤 ${step.step}\n\n${step.content}`
}

function buildThinkingText(steps: ManusStep[], metaLines: string[]) {
  const blocks = steps.map(formatStepForThinking)
  if (metaLines.length) blocks.push(...metaLines)
  return blocks.filter(Boolean).join('\n\n')
}

function dedupeConsecutiveLines(text: string) {
  const lines = text.split('\n')
  const deduped: string[] = []
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue
    if (deduped.length && deduped[deduped.length - 1].trim() === trimmed) continue
    deduped.push(trimmed)
  }
  return deduped.join('\n')
}

function rebuildThinking(msg: ManusAssistantMessage) {
  msg.thinking = buildThinkingText(msg.thinkingSteps || [], msg.metaLines || [])
}

function appendStep(msg: ManusAssistantMessage, stepNum: number, content: string) {
  const incoming = dedupeConsecutiveLines(content.trim())
  if (!incoming) return

  if (!msg.thinkingSteps) msg.thinkingSteps = []
  const existing = msg.thinkingSteps.find((s) => s.step === stepNum)
  if (existing) {
    const prev = existing.content
    if (prev === incoming || prev.endsWith(`\n${incoming}`)) {
      rebuildThinking(msg)
      return
    }
    if (incoming.startsWith(prev)) {
      existing.content = incoming
    } else {
      existing.content = `${prev}\n${incoming}`
      existing.content = dedupeConsecutiveLines(existing.content)
    }
  } else {
    msg.thinkingSteps.push({ step: stepNum, content: incoming })
  }
  msg.thinkingSteps.sort((a, b) => a.step - b.step)
  rebuildThinking(msg)
}

export function appendManusChunk(msg: ManusAssistantMessage, chunk: string) {
  if (!chunk) return

  const parsed = parseManusStepChunk(chunk)

  if (parsed.type === 'step') {
    msg.phase = 'thinking'
    appendStep(msg, parsed.step, parsed.content.trim())
    return
  }

  if (parsed.type === 'meta') {
    if (!msg.metaLines) msg.metaLines = []
    if (!msg.metaLines.includes(parsed.content)) {
      msg.metaLines.push(parsed.content)
    }
    rebuildThinking(msg)
    return
  }

  if (parsed.type === 'error') {
    msg.phase = 'summary'
    msg.answer = (msg.answer || '') + parsed.content
    msg.summarizing = true
    return
  }

  msg.phase = 'summary'
  msg.summarizing = true
  msg.answer = (msg.answer || '') + parsed.content
}

export function finalizeManusAssistantMessage(msg: ManusAssistantMessage) {
  msg.thinkingDurationMs = Date.now() - (msg.thinkingStartedAt || Date.now())
  msg.summarizing = false
  rebuildThinking(msg)

  if (msg.answer?.trim()) return

  const steps = msg.thinkingSteps || []
  if (!steps.length) {
    msg.answer = msg.rawBuffer?.trim() || ''
    return
  }

  const last = steps[steps.length - 1]
  msg.answer =
    last.content === '思考完成 - 无需行动'
      ? '思考已完成，当前步骤无需进一步操作。'
      : last.content
}

export function formatThinkingDuration(ms: number) {
  const sec = Math.max(1, Math.round(ms / 1000))
  return `${sec} 秒`
}
