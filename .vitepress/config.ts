import { defineConfig } from 'vitepress'
import MarkdownItSub from 'markdown-it-sub'
import MarkdownItSup from 'markdown-it-sup'
import MarkdownItFootnote from'markdown-it-footnote'

export default defineConfig({
  title: "sunn4room's notes",
  description: "A collection of my study notes.",
  themeConfig: {
    logo: {
      src: '/avatar.png',
    },
    outline: 'deep',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Notes', link: '/welcome' }
    ],

    sidebar: [
      { text: 'Welcome', link: '/welcome' },
      { text: 'Markdown Demo', link: '/markdown-demo' }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/sunn4room/notes' }
    ],
    search: {
      provider: 'local',
    },
  },
  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark',
    },
    math: true,
    image: {
      lazyLoading: true
    },
    config: async (md) => {
      md.use(MarkdownItSub)
      md.use(MarkdownItSup)
      md.use(MarkdownItFootnote)

      const defaultRenderer = md.renderer.rules.fence;
      if (!defaultRenderer) {
        throw new Error('defaultRenderer is undefined');
      }
      md.renderer.rules.fence = (tokens, index, options, env, slf) => {
        const token = tokens[index];
        const language = token.info.trim();
        if (language === 'mermaid') {
          return `<ClientOnly><Mermaid id="mermaid-${index}" graph="${encodeURIComponent(token.content)}"></Mermaid></ClientOnly>`
        } else if (language === 'chart') {
          return `<Chart config="${encodeURIComponent(token.content)}"></Chart>`
        } else if (language.startsWith('plantuml')) {
          if (language === 'plantuml') {
            return `<Plantuml pcontent="${encodeURIComponent(token.content)}"></Plantuml>`
          } else {
            return `<Plantuml ptype="${language.substring(9)}" pcontent="${encodeURIComponent(token.content)}"></Plantuml>`
          }
        } else {
          return defaultRenderer(tokens, index, options, env, slf)
        }
      }
    }
  }
})
