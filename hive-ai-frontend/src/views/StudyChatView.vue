<template>
  <ChatRoom
    title="AI 学习搭子"
    :subtitle="`会话 ID：${chatId}`"
    :messages="messages"
    :loading="loading"
    show-new-session
    empty-icon="📚"
    empty-title="你好，我是你的 AI 学习搭子"
    empty-desc="可以问我学习计划、知识点讲解、习题思路等问题，我会实时流式回复。"
    placeholder="输入你的学习问题..."
    @send="onSend"
    @new-session="startNewSession"
  />
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import ChatRoom from '../components/ChatRoom.vue'
import { buildStudyAppSseUrl } from '../api/ai'
import { useChatStream } from '../composables/useChatStream'
import { createChatId } from '../utils/chatId'

const chatId = ref('')

const { messages, loading, sendMessage, clearMessages, stop } = useChatStream(
  (message) => buildStudyAppSseUrl(message, chatId.value),
)

onMounted(() => {
  chatId.value = createChatId()
})

onUnmounted(() => {
  stop()
})

function onSend(text) {
  sendMessage(text)
}

function startNewSession() {
  stop()
  clearMessages()
  chatId.value = createChatId()
}
</script>
