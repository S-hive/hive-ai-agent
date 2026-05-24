import { ArrowUp } from 'lucide-react'
import { useRef, type KeyboardEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface ChatInputBarProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  placeholder?: string
  disabled?: boolean
  canSend?: boolean
}

export function ChatInputBar({
  value,
  onChange,
  onSend,
  placeholder = '有什么我能帮您的吗？',
  disabled = false,
  canSend = false,
}: ChatInputBarProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const autoResize = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      if (canSend) onSend()
    }
  }

  const handleSend = () => {
    if (!canSend) return
    onSend()
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  return (
    <footer className="shrink-0 bg-white px-6 pb-6 pt-3">
      <div className="mx-auto flex max-w-[900px] items-end gap-2 rounded-[20px] border border-[#ced0de] bg-white px-4 py-2.5">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(event) => {
            onChange(event.target.value)
            autoResize()
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          disabled={disabled}
          className="max-h-[120px] min-h-[28px] flex-1 resize-none border-0 bg-transparent px-1 py-1.5 text-[15px] leading-relaxed text-[#1f2329] shadow-none placeholder:text-[#c9cdd4] focus-visible:ring-0"
        />
        <Button
          type="button"
          size="icon"
          disabled={!canSend}
          onClick={handleSend}
          className="h-9 w-9 shrink-0 rounded-xl bg-[#b8b0f0] text-white hover:bg-[#a89ef0] disabled:bg-[#e8e5fc] disabled:text-white/80"
        >
          <ArrowUp className="h-[18px] w-[18px]" />
        </Button>
      </div>
    </footer>
  )
}
