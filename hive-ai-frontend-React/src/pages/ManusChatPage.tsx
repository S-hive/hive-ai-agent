import { useCallback, useEffect } from 'react'
import { buildManusChatUrl } from '@/api/ai'
import { ManusChatRoom } from '@/components/ManusChatRoom'
import { useManusChatStream } from '@/hooks/useManusChatStream'

export function ManusChatPage() {
  const buildUrl = useCallback((message: string) => buildManusChatUrl(message), [])

  const { messages, loading, sendMessage, stop } = useManusChatStream(buildUrl)

  useEffect(() => () => stop(), [stop])

  return (
    <div className="h-full">
      <ManusChatRoom
        title="AI 超级智能体"
        subtitle="Manus · 支持工具调用与多步推理"
        messages={messages}
        loading={loading}
        emptyIcon="🤖"
        emptyTitle="你好，我是 Hive Manus"
        emptyDesc="描述你的复杂任务，我会先展示思考与工具执行过程，再给出最终回答。"
        placeholder="有什么我能帮您的吗？"
        onSend={sendMessage}
      />
    </div>
  )
}
