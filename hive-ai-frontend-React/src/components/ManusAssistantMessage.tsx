import { ChevronDown, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { MarkdownContent } from '@/components/MarkdownContent'
import { Badge } from '@/components/ui/badge'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Skeleton } from '@/components/ui/skeleton'
import { formatThinkingDuration } from '@/utils/manusMessageParser'

interface ManusAssistantMessageProps {
  thinking: string
  answer: string
  loading: boolean
  summarizing: boolean
  phase: 'thinking' | 'summary'
  thinkingDurationMs: number
}

export function ManusAssistantMessage({
  thinking,
  answer,
  loading,
  summarizing,
  phase,
  thinkingDurationMs,
}: ManusAssistantMessageProps) {
  const [open, setOpen] = useState(true)

  useEffect(() => {
    if (summarizing) setOpen(false)
  }, [summarizing])

  useEffect(() => {
    if (loading && phase === 'thinking') {
      setOpen(true)
    }
    if (!loading && answer) {
      setOpen(false)
    }
  }, [loading, phase, answer])

  const durationLabel = formatThinkingDuration(thinkingDurationMs)
  const isThinkingPhase = loading && phase === 'thinking' && !summarizing

  const headerText = summarizing
    ? '正在生成回答...'
    : isThinkingPhase || loading
      ? '思考中...'
      : `已思考 (用时 ${durationLabel})`

  const showThinking = Boolean(thinking?.trim()) || isThinkingPhase
  const showAnswer = Boolean(answer?.trim())

  return (
    <section className="flex min-w-0 flex-col gap-3">
      {showThinking ? (
        <Collapsible open={open} onOpenChange={setOpen}>
          <CollapsibleTrigger className="inline-flex items-center gap-2 px-0 py-1 text-sm font-medium text-[#666] hover:opacity-85">
            <Sparkles className="h-4 w-4 text-[#888]" />
            <Badge variant="outline" className="rounded-full border-[#e5e6eb] bg-white text-[#666]">
              {headerText}
            </Badge>
            <ChevronDown className={`h-4 w-4 text-[#86909c] transition-transform ${open ? '' : '-rotate-90'}`} />
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-2 border-l-2 border-[#e5e6eb] py-1 pl-4 text-sm leading-relaxed break-words text-[#86909c]">
            {isThinkingPhase && !thinking ? (
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-[88%]" />
                <Skeleton className="h-3.5 w-[72%]" />
              </div>
            ) : (
              <MarkdownContent content={thinking} className="min-h-[1em] text-sm text-[#86909c]" />
            )}
          </CollapsibleContent>
        </Collapsible>
      ) : null}

      {showAnswer ? (
        <article className="flex items-end gap-0.5 break-words py-1 text-[15px] leading-relaxed text-[#1f2329]">
          <MarkdownContent content={answer} className="min-h-[1em] flex-1 min-w-0" />
          {summarizing ? (
            <span className="ml-0.5 inline-block animate-pulse text-[#1f2329]">|</span>
          ) : null}
        </article>
      ) : null}
    </section>
  )
}
