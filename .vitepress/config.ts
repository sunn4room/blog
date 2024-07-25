import { defineConfig } from 'vitepress'
import MarkdownItSub from 'markdown-it-sub'
import MarkdownItSup from 'markdown-it-sup'
import MarkdownItFootnote from'markdown-it-footnote'

export default defineConfig({
  title: "sunn4room's blog",
  description: "A Collection of My Notes and Diaries",
  head: [['link', { rel: 'icon', href: '/icon.png' }]],
  themeConfig: {
    logo: {
      src: '/logo.png',
    },
    outline: 'deep',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Notes', link: '/notes/' },
      { text: 'Diaries', link: '/diaries/' },
    ],

    sidebar: {
      '/notes/': [
        { items: [
          { text: 'Welcome', link: '/notes/' },
          { text: 'Linux', items: [
            { text: 'bash', link: '/notes/linux/bash' },
            { text: 'sed', link: '/notes/linux/sed' },
            { text: 'awk', link: '/notes/linux/awk' },
            { text: 'grep', link: '/notes/linux/grep' },
          ]},
          { text: 'Rust', items: [
            { text: 'Introduction', link: '/notes/rust/intro' },
          ]},
          { text: 'Regular Expression', link: '/notes/regex' },
          { text: 'Markdown Demo', link: '/notes/markdown-demo' },
        ]},
      ],
      '/diaries/': [
        { items: [
          { text: 'Welcome', link: '/diaries/' },
          // 𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵
          { text: '2024-07', items: [
            { text: '𝟮𝟯 VitePress is Awesome', link: '/diaries/vitepress-is-awesome' },
          ]},
        ]},
      ],
    },

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
