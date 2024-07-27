<template v-for="item in items">
  <TheBody/>
</template>

<script setup>
import { h } from 'vue'
import { useSidebar } from 'vitepress/theme'

const { sidebar } = useSidebar()

const TheBody = () => {
  const render_item = (item) => {
    if (item.link === undefined) {
      return item.text
    } else {
      return h('a', { href: item.link }, item.text)
    }
  }
  const render_items = (items) => {
    console.log(items)
    const elist = []
    for (const item of items) {
      if (item.items === undefined) {
        elist.push(h('li', [render_item(item)]))
      } else {
        elist.push(h('li', [render_item(item), render_items(item.items)]))
      }
    }
    return h('ul', elist)
  }
  return render_items(sidebar.value[0].items.slice(1))
}
</script>
