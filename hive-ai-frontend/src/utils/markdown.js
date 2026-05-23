import { marked } from 'marked'
import DOMPurify from 'dompurify'

marked.setOptions({
  gfm: true,
  breaks: true,
})

export function renderMarkdown(content) {
  if (!content) return ''
  try {
    const html = marked.parse(content, { async: false })
    if (typeof html !== 'string') return escapeHtml(content)
    return DOMPurify.sanitize(html)
  } catch {
    return escapeHtml(content)
  }
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\n/g, '<br>')
}
