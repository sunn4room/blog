<template>
  <img :src="src" alt="plantuml diagram" />
</template>

<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'
import { encode64, zip_deflate } from "./deflate.js";

const props = defineProps({
  ptype: {
    type: String,
    default: 'uml',
  },
  pcontent: {
    type: String,
    required: true,
  },
})

const { isDark } = useData()
const src = computed(() => {
  return `https://www.plantuml.com/plantuml/svg/${encode64(
    zip_deflate(
      unescape(
        encodeURIComponent(`@start${props.ptype}\n${isDark.value ? '!theme reddress-darkred\n' : '!theme reddress-lightred\n'}${decodeURIComponent(props.pcontent).trim()}\n@end${props.ptype}`),
      ),
      9,
    ),
  )}`
})
</script>