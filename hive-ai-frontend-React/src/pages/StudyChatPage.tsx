import { useCallback, useEffect, useState } from 'react'
import { buildStudyAppSseUrl } from '@/api/ai'
import { ChatRoom } from '@/components/ChatRoom'
import { useChatStream } from '@/hooks/useChatStream'
import { createChatId } from '@/utils/chatId'

export function StudyChatPage() {
  const [chatId, setChatId] = useState('')

  const buildUrl = useCallback(
    (message: string) => buildStudyAppSseUrl(message, chatId),
    [chatId],
  )

  const { messages, loading, sendMessage, stop } = useChatStream(buildUrl)

  useEffect(() => {
    setChatId(createChatId())
    return () => stop()
  }, [stop])

  return (
    <div className="h-full">
      <ChatRoom
        title="AI 学习搭子"
        subtitle={`会话 ID：${chatId}`}
        messages={messages}
        loading={loading}
        emptyTitle="你好，我是你的 AI 学习搭子"
        emptyDesc="可以问我学习计划、知识点讲解、习题思路等问题，我会实时流式回复。"
        placeholder="有什么我能帮您的吗？"
        onSend={sendMessage}
      />
    </div>
  )
}
