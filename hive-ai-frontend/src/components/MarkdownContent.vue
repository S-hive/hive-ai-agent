<template>
  <div v-if="html" class="markdown-body" v-html="html" />
  <div v-else-if="content" class="markdown-body plain-fallback">{{ content }}</div>
</template>

<script setup>
import { computed } from 'vue'
import { renderMarkdown } from '../utils/markdown'

const props = defineProps({
  content: { type: String, default: '' },
})

const html = computed(() => renderMarkdown(props.content))
</script>

<style src="../styles/markdown.css"></style>

<style scoped>
.plain-fallback {
  white-space: pre-wrap;
}
</style>
