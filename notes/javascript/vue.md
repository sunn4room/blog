# Vue.js

Vue 是一个流行的前端框架，提供了**声明式**的**响应性**的组件开发体验。

```html
<html>
  <body>
    <div id="app">{{ message }}</div>
    <script type="module">
      import { createApp, ref } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'
      createApp({
        setup() {
          const message = ref('Hello Vue!')
          return {
            message
          }
        }
      }).mount('#app')
    </script>
  </body>
</html>
```

