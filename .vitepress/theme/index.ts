import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './style.css'
import Mermaid from './Mermaid.vue'
import Chart from './Chart.vue'
import Plantuml from './Plantuml.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app, router, siteData }) {
    app.component('Mermaid', Mermaid)
    app.component('Chart', Chart)
    app.component('Plantuml', Plantuml)
  }
} satisfies Theme
