import { useMemo } from 'react'
import { renderMarkdown } from '@/utils/markdown'
import '@/styles/markdown.css'

interface MarkdownContentProps {
  content: string
  className?: string
}

export function MarkdownContent({ content, className = '' }: MarkdownContentProps) {
  const html = useMemo(() => renderMarkdown(content), [content])

  if (html) {
    return (
      <div
        className={`markdown-body ${className}`.trim()}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    )
  }

  if (content) {
    return <div className={`markdown-body plain-fallback ${className}`.trim()}>{content}</div>
  }

  return null
}
