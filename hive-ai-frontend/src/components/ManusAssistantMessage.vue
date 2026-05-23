<template>
  <div class="manus-assistant">
    <div v-if="showThinking" class="thinking-section">
      <button
        type="button"
        class="thinking-header"
        @click="thinkingCollapsed = !thinkingCollapsed"
      >
        <span class="thinking-icon" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="2" fill="currentColor" />
            <path
              d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
            />
          </svg>
        </span>
        <span class="thinking-title">{{ headerText }}</span>
        <svg
          class="chevron"
          :class="{ collapsed: thinkingCollapsed }"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      <div v-if="!thinkingCollapsed" class="thinking-quote">
        <span v-if="isThinkingPhase && !thinking" class="typing"><i></i><i></i><i></i></span>
        <div v-else class="thinking-text">{{ thinking }}</div>
      </div>
    </div>

    <div v-if="showAnswer" class="answer-bubble">
      <MarkdownContent :content="answer" class="answer-text" />
      <span v-if="summarizing" class="answer-cursor" aria-hidden="true">|</span>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { formatThinkingDuration } from '../utils/manusMessageParser'
import MarkdownContent from './MarkdownContent.vue'

const props = defineProps({
  thinking: { type: String, default: '' },
  answer: { type: String, default: '' },
  loading: { type: Boolean, default: false },
  summarizing: { type: Boolean, default: false },
  phase: { type: String, default: 'thinking' },
  thinkingDurationMs: { type: Number, default: 0 },
})

const thinkingCollapsed = ref(false)

watch(
  () => props.summarizing,
  (val) => {
    if (val) thinkingCollapsed.value = true
  },
)

watch(
  () => props.loading,
  (isLoading) => {
    if (isLoading && props.phase === 'thinking') {
      thinkingCollapsed.value = false
    }
    if (!isLoading && props.answer) {
      thinkingCollapsed.value = true
    }
  },
)

const durationLabel = computed(() => formatThinkingDuration(props.thinkingDurationMs))

const isThinkingPhase = computed(
  () => props.loading && props.phase === 'thinking' && !props.summarizing,
)

const headerText = computed(() => {
  if (props.summarizing) return '正在生成回答...'
  if (isThinkingPhase.value) return '思考中...'
  if (props.loading) return '思考中...'
  return `已思考 (用时 ${durationLabel.value})`
})

const showThinking = computed(
  () => props.thinking?.trim() || isThinkingPhase.value,
)

const showAnswer = computed(() => Boolean(props.answer?.trim()))
</script>

<style scoped>
.manus-assistant {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}

.thinking-section {
  min-width: 0;
}

.thinking-header {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
  color: #666;
  font-size: 14px;
  font-weight: 500;
}

.thinking-header:hover {
  opacity: 0.85;
}

.thinking-icon {
  display: flex;
  color: #888;
}

.thinking-title {
  line-height: 1.4;
}

.chevron {
  color: #86909c;
  transition: transform 0.2s;
}

.chevron.collapsed {
  transform: rotate(-90deg);
}

.thinking-quote {
  margin-top: 8px;
  padding: 4px 0 4px 16px;
  border-left: 2px solid #e5e6eb;
  color: #86909c;
  font-size: 14px;
  line-height: 1.75;
  white-space: pre-wrap;
  word-break: break-word;
}

.thinking-text {
  word-break: break-word;
}

.answer-bubble {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  padding: 4px 0;
  color: #1f2329;
  font-size: 15px;
  line-height: 1.7;
  word-break: break-word;
}

.answer-text {
  min-height: 1em;
  flex: 1;
  min-width: 0;
}

.answer-cursor {
  display: inline-block;
  margin-left: 2px;
  color: #1f2329;
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

.typing {
  display: inline-flex;
  gap: 4px;
  align-items: center;
  height: 20px;
}

.typing i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #c9cdd4;
  animation: bounce 1.2s infinite ease-in-out;
}

.typing i:nth-child(2) {
  animation-delay: 0.15s;
}

.typing i:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes bounce {
  0%,
  80%,
  100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
