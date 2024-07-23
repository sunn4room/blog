<template>
  <div v-html="mermaidSvg"></div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { useData } from 'vitepress'
import mermaid from'mermaid'

const props = defineProps({
  graph: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
})

const { isDark } = useData()
const mermaidSvg = ref('')
watchEffect(() => {
  mermaid.initialize({
    securityLevel: 'loose',
    startOnLoad: false,
    theme: isDark.value ? 'dark' : 'default',
  })
  const mermaidCode = decodeURIComponent(props.graph)
  mermaid.render(props.id, mermaidCode).then(mermaidRenderer => mermaidSvg.value = mermaidRenderer.svg)
})
</script>
