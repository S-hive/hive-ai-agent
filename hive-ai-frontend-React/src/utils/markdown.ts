import { marked } from 'marked'
import DOMPurify from 'dompurify'

marked.setOptions({
  gfm: true,
  breaks: true,
})

const FENCED_OR_INLINE_CODE = /(```[\s\S]*?```|`[^`\n]+`)/g

/** 预处理 AI 输出，提升中文场景下的标准 Markdown 解析效果 */
export function preprocessMarkdown(content: string) {
  if (!content) return ''

  const segments: string[] = []
  let lastIndex = 0

  for (const match of content.matchAll(FENCED_OR_INLINE_CODE)) {
    const index = match.index ?? 0
    segments.push(normalizeMarkdownSegment(content.slice(lastIndex, index)))
    segments.push(match[0])
    lastIndex = index + match[0].length
  }

  segments.push(normalizeMarkdownSegment(content.slice(lastIndex)))
  return segments.join('')
}

function normalizeMarkdownSegment(text: string) {
  return text
    // marked 对紧贴 CJK 的 **加粗** 识别不稳定，补空格以符合 GFM flanking 规则
    .replace(/\*\*([^*\n]+?)\*\*/g, (_, inner: string) => ` **${inner.trim()}** `)
    .replace(/\*([^*\n]+?)\*/g, (_, inner: string) => ` *${inner.trim()}* `)
    // 冒号后直接跟列表项时补换行
    .replace(/([：:])(-\s)/g, '$1\n\n$2')
    // GFM 无序列表要求 "- " 后有空格
    .replace(/^-(\S)/gm, '- $1')
}

export function renderMarkdown(content: string) {
  if (!content) return ''
  try {
    const html = marked.parse(preprocessMarkdown(content), { async: false })
    if (typeof html !== 'string') return escapeHtml(content)
    return DOMPurify.sanitize(html, {
      USE_PROFILES: { html: true },
    })
  } catch {
    return escapeHtml(content)
  }
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\n/g, '<br>')
}
