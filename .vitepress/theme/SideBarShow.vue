<template v-for="item in items">
  <TheBody/>
</template>

<script setup>
import { h } from 'vue'
import { useSidebar } from 'vitepress/theme'

const { sidebar } = useSidebar()

const TheBody = () => {
  const elist = []
  const handle = (items, level) => {
    for (const item of items) {
      if (item.items !== undefined) {
        elist.push(h('h' + level, item.text))
        handle(item.items, level + 1)
      } else {
        if (item.text.startsWith('<code>')) {
          elist.push(h('p', [h('code', {style: { 'background-color': '#00000000' }}, item.text.substring(6, 8)), h('a', { href: item.link }, item.text.substring(15))]))
        } else {
          elist.push(h('p', [h('a', { href: item.link }, item.text)]))
        }
      }
    }
  }
  handle(sidebar.value.slice(1), 3)
  return elist
}
</script>
