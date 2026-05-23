<template>
  <ManusChatRoom
    title="AI 超级智能体"
    subtitle="Manus · 支持工具调用与多步推理"
    :messages="messages"
    :loading="loading"
    empty-icon="🤖"
    empty-title="你好，我是 Hive Manus"
    empty-desc="描述你的复杂任务，我会先展示思考与工具执行过程，再给出最终回答。"
    placeholder="描述你的任务，例如：帮我搜索并整理某主题资料..."
    @send="onSend"
  />
</template>

<script setup>
import { onUnmounted } from 'vue'
import ManusChatRoom from '../components/ManusChatRoom.vue'
import { buildManusChatUrl } from '../api/ai'
import { useManusChatStream } from '../composables/useManusChatStream'

const { messages, loading, sendMessage, stop } = useManusChatStream((message) =>
  buildManusChatUrl(message),
)

onUnmounted(() => {
  stop()
})

function onSend(text) {
  sendMessage(text)
}
</script>
