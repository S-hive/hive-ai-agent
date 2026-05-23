<template>
  <div class="chat-page">
    <header class="chat-header">
      <button class="back-btn" type="button" @click="goHome" aria-label="返回主页">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M15 18l-6-6 6-6"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
      <div class="header-main">
        <h1 class="title">{{ title }}</h1>
        <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
      </div>
    </header>

    <main ref="messageListRef" class="chat-messages">
      <div v-if="messages.length === 0" class="empty-state">
        <div class="empty-icon">{{ emptyIcon }}</div>
        <p class="empty-title">{{ emptyTitle }}</p>
        <p class="empty-desc">{{ emptyDesc }}</p>
      </div>

      <div
        v-for="msg in messages"
        :key="msg.id"
        class="message-row"
        :class="msg.role === 'user' ? 'is-user' : 'is-assistant'"
      >
        <div class="message-body">
          <div v-if="msg.role === 'user'" class="user-bubble">{{ msg.content }}</div>
          <ManusAssistantMessage
            v-else
            :thinking="msg.thinking"
            :answer="msg.answer"
            :loading="msg.loading"
            :summarizing="msg.summarizing"
            :phase="msg.phase"
            :thinking-duration-ms="msg.thinkingDurationMs"
          />
        </div>
      </div>
    </main>

    <footer class="chat-input-area">
      <div class="input-card">
        <textarea
          ref="textareaRef"
          v-model="inputText"
          class="chat-textarea"
          :placeholder="placeholder"
          rows="1"
          :disabled="loading"
          @keydown="handleKeydown"
          @input="autoResize"
        />
        <div class="input-actions">
          <span class="hint">Enter 发送，Shift + Enter 换行</span>
          <button class="send-btn" type="button" :disabled="!canSend" @click="handleSend">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 19V5M5 12l7-7 7 7"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import ManusAssistantMessage from './ManusAssistantMessage.vue'

const props = defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  messages: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  placeholder: { type: String, default: '向 AI 提问...' },
  emptyIcon: { type: String, default: '🤖' },
  emptyTitle: { type: String, default: '开始对话' },
  emptyDesc: { type: String, default: '输入你的问题，AI 会实时回复' },
})

const emit = defineEmits(['send'])

const router = useRouter()
const inputText = ref('')
const messageListRef = ref(null)
const textareaRef = ref(null)

const canSend = computed(() => inputText.value.trim().length > 0 && !props.loading)

watch(
  () => props.messages,
  async () => {
    await nextTick()
    scrollToBottom()
  },
  { deep: true },
)

watch(
  () => props.loading,
  async () => {
    await nextTick()
    scrollToBottom()
  },
)

function scrollToBottom() {
  const el = messageListRef.value
  if (el) el.scrollTop = el.scrollHeight
}

function autoResize() {
  const el = textareaRef.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = `${Math.min(el.scrollHeight, 160)}px`
}

function handleKeydown(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleSend()
  }
}

function handleSend() {
  const text = inputText.value.trim()
  if (!text || props.loading) return
  inputText.value = ''
  nextTick(() => {
    if (textareaRef.value) textareaRef.value.style.height = 'auto'
  })
  emit('send', text)
}

function goHome() {
  router.push('/')
}
</script>

<style scoped>
.chat-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #ffffff;
}

.chat-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  border-bottom: 1px solid #eef0f3;
  background: #fff;
  flex-shrink: 0;
}

.back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  color: #4e5969;
  transition: background 0.2s;
}

.back-btn:hover {
  background: #f2f3f5;
}

.header-main {
  flex: 1;
  min-width: 0;
}

.title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2329;
}

.subtitle {
  margin-top: 2px;
  font-size: 12px;
  color: #86909c;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px 0 16px;
  background: #ffffff;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  padding: 0 24px;
  text-align: center;
}

.empty-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  border-radius: 16px;
  background: linear-gradient(135deg, #f3f2ff 0%, #eef6ff 100%);
  margin-bottom: 16px;
}

.empty-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2329;
  margin-bottom: 8px;
}

.empty-desc {
  font-size: 14px;
  color: #86909c;
  max-width: 360px;
  line-height: 1.6;
}

.message-row {
  display: flex;
  padding: 10px 32px;
  max-width: 960px;
  margin: 0 auto;
  width: 100%;
}

.message-row.is-user {
  justify-content: flex-end;
}

.message-row.is-assistant {
  justify-content: flex-start;
}

.message-body {
  min-width: 0;
}

.message-row.is-user .message-body {
  max-width: min(72%, 560px);
}

.message-row.is-assistant .message-body {
  max-width: min(92%, 760px);
  width: 100%;
}

.user-bubble {
  padding: 12px 18px;
  background: #f0f0f0;
  color: #1f2329;
  border-radius: 20px;
  font-size: 15px;
  line-height: 1.65;
  white-space: pre-wrap;
  word-break: break-word;
}

.chat-input-area {
  flex-shrink: 0;
  padding: 12px 24px 24px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #fff 24%);
}

.input-card {
  max-width: 900px;
  margin: 0 auto;
  border: 1px solid #e5e6eb;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.chat-textarea {
  width: 100%;
  min-height: 52px;
  max-height: 160px;
  padding: 16px 18px 8px;
  border: none;
  outline: none;
  resize: none;
  color: #1f2329;
  background: transparent;
}

.chat-textarea::placeholder {
  color: #c9cdd4;
}

.chat-textarea:disabled {
  opacity: 0.6;
}

.input-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px 12px 18px;
}

.hint {
  font-size: 12px;
  color: #c9cdd4;
}

.send-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  color: #fff;
  background: linear-gradient(135deg, #615ced 0%, #7b6dff 100%);
  transition: transform 0.15s, opacity 0.15s;
}

.send-btn:hover:not(:disabled) {
  transform: scale(1.04);
}

.send-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
