const STEP_PATTERN = /^Step\s+(\d+):\s*([\s\S]*)$/

export function parseManusStepChunk(chunk) {
  const match = chunk.match(STEP_PATTERN)
  if (match) {
    return { type: 'step', step: Number(match[1]), content: match[2] }
  }
  if (isMetaStep(chunk)) {
    return { type: 'meta', content: chunk.trim() }
  }
  if (chunk.startsWith('错误:') || chunk.startsWith('执行错误')) {
    return { type: 'error', content: chunk.trim() }
  }
  return { type: 'summary', content: chunk }
}

export function isMetaStep(content) {
  const text = content.trim()
  return (
    text.startsWith('执行结束') ||
    text.startsWith('Terminated:')
  )
}

function formatStepForThinking(step) {
  return `步骤 ${step.step}\n${step.content}`
}

function buildThinkingText(steps, metaLines) {
  const blocks = steps.map(formatStepForThinking)
  if (metaLines.length) blocks.push(...metaLines)
  return blocks.filter(Boolean).join('\n\n')
}

function rebuildThinking(msg) {
  const steps = msg.thinkingSteps || []
  const metaLines = msg.metaLines || []
  msg.thinking = buildThinkingText(steps, metaLines)
}

function appendStep(msg, stepNum, content) {
  if (!msg.thinkingSteps) msg.thinkingSteps = []
  const existing = msg.thinkingSteps.find((s) => s.step === stepNum)
  if (existing) {
    existing.content += `\n${content}`
  } else {
    msg.thinkingSteps.push({ step: stepNum, content })
  }
  msg.thinkingSteps.sort((a, b) => a.step - b.step)
  rebuildThinking(msg)
}

/**
 * 处理 Manus SSE 分片：
 * - Step N: → 思考区
 * - 执行结束/Terminated → 思考区元信息
 * - 其余 token → 最终总结（回答气泡，流式追加）
 */
export function appendManusChunk(msg, chunk) {
  if (!chunk) return

  const parsed = parseManusStepChunk(chunk)

  if (parsed.type === 'step') {
    msg.phase = 'thinking'
    appendStep(msg, parsed.step, parsed.content.trim())
    return
  }

  if (parsed.type === 'meta') {
    if (!msg.metaLines) msg.metaLines = []
    msg.metaLines.push(parsed.content)
    rebuildThinking(msg)
    return
  }

  if (parsed.type === 'error') {
    msg.phase = 'summary'
    msg.answer = (msg.answer || '') + parsed.content
    msg.summarizing = true
    return
  }

  // 后端流式总结：无 Step 前缀的 token 直接追加到回答
  msg.phase = 'summary'
  msg.summarizing = true
  msg.answer = (msg.answer || '') + parsed.content
}

export function finalizeManusAssistantMessage(msg) {
  msg.thinkingDurationMs = Date.now() - (msg.thinkingStartedAt || Date.now())
  msg.summarizing = false
  rebuildThinking(msg)

  // 已有流式总结则保留，不再从 step 中推断
  if (msg.answer?.trim()) return

  // 兼容旧后端：无总结流时从最后一步推断
  const steps = msg.thinkingSteps || []
  if (!steps.length) {
    msg.answer = msg.rawBuffer?.trim() || ''
    return
  }

  const last = steps[steps.length - 1]
  msg.answer = last.content === '思考完成 - 无需行动'
    ? '思考已完成，当前步骤无需进一步操作。'
    : last.content
}

export function formatThinkingDuration(ms) {
  const sec = Math.max(1, Math.round(ms / 1000))
  return `${sec} 秒`
}
