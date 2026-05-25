import { ChevronLeft } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChatInputBar } from '@/components/ChatInputBar'
import TextType from '@/components/TextType'
import { ManusAssistantMessage } from '@/components/ManusAssistantMessage'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import type { ManusMessage } from '@/hooks/useManusChatStream'
import { cn } from '@/lib/utils'

interface ManusChatRoomProps {
  title: string
  subtitle?: string
  messages: ManusMessage[]
  loading: boolean
  placeholder?: string
  emptyIcon?: string
  emptyTitle?: string
  emptyDesc?: string
  onSend: (text: string) => void
}

export function ManusChatRoom({
  title,
  subtitle,
  messages,
  loading,
  placeholder = '有什么我能帮您的吗？',
  emptyTitle = '开始对话',
  emptyDesc = '输入你的问题，AI 会实时回复',
  onSend,
}: ManusChatRoomProps) {
  const navigate = useNavigate()
  const [inputText, setInputText] = useState('')
  const messageListRef = useRef<HTMLDivElement>(null)

  const canSend = inputText.trim().length > 0 && !loading

  useEffect(() => {
    const el = messageListRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, loading])

  const handleSend = () => {
    const text = inputText.trim()
    if (!text || loading) return
    setInputText('')
    onSend(text)
  }

  return (
    <div className="flex h-full flex-col bg-white">
      <header className="flex shrink-0 items-center gap-3 bg-white px-5 py-3.5">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-[10px] text-[#4e5969] hover:bg-[#f2f3f5]"
          onClick={() => navigate('/')}
          aria-label="返回主页"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold text-[#1f2329]">{title}</h1>
            <Badge variant="secondary" className="rounded-full bg-[#f3f2ff] text-[#615ced]">
              Manus
            </Badge>
          </div>
          {subtitle ? <p className="mt-0.5 text-xs text-[#86909c]">{subtitle}</p> : null}
        </div>
      </header>

      <Separator />

      <ScrollArea className="flex-1 bg-white">
        <div ref={messageListRef} className="px-0 py-5">
          {messages.length === 0 ? (
            <div className="flex min-h-[50vh] flex-col items-center justify-center px-6 text-center">
              <TextType
                text={emptyTitle}
                className="mb-2 text-lg font-semibold text-[#1f2329]"
                typingSpeed={35}
                loop={false}
                showCursor={false}
              />
              <p className="max-w-[360px] text-sm leading-relaxed text-[#86909c]">{emptyDesc}</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  'mx-auto flex w-full max-w-[960px] px-8 py-2.5',
                  msg.role === 'user' ? 'justify-end' : 'justify-start',
                )}
              >
                <div
                  className={cn(
                    'min-w-0',
                    msg.role === 'user' ? 'max-w-[min(72%,560px)]' : 'w-full max-w-[min(92%,760px)]',
                  )}
                >
                  {msg.role === 'user' ? (
                    <div className="whitespace-pre-wrap break-words rounded-[20px] bg-[#f4f4f4] px-[18px] py-3 text-[15px] leading-relaxed text-[#1f2329]">
                      {msg.content}
                    </div>
                  ) : (
                    <ManusAssistantMessage
                      thinking={msg.thinking}
                      answer={msg.answer}
                      loading={msg.loading}
                      summarizing={msg.summarizing}
                      phase={msg.phase}
                      thinkingDurationMs={msg.thinkingDurationMs}
                      attachments={msg.attachments}
                    />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      <ChatInputBar
        value={inputText}
        onChange={setInputText}
        onSend={handleSend}
        placeholder={placeholder}
        disabled={loading}
        canSend={canSend}
      />
    </div>
  )
}
