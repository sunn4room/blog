import { defineConfig } from 'vitepress'
import MarkdownItSub from 'markdown-it-sub'
import MarkdownItSup from 'markdown-it-sup'
import MarkdownItFootnote from'markdown-it-footnote'

export default defineConfig({
  title: "sunn4room",
  lang: 'zh-CN',
  head: [['link', { rel: 'icon', href: '/icon.png' }]],
  cleanUrls: true,
  themeConfig: {
    nav: [
      { text: '笔记', link: '/notes/' },
      { text: '日记', link: '/diaries/' },
    ],
    sidebar: {
      '/notes/': [
        { items: [
          { text: '索引页', link: '/notes/' },
          { text: 'Javascript', items: [
            { text: 'Eslint', link: '/notes/javascript/eslint' },
            { text: 'Prettier', link: '/notes/javascript/prettier' },
          ]},
          { text: 'Linux', items: [
            { text: 'bash', link: '/notes/linux/bash' },
            { text: 'sed', link: '/notes/linux/sed' },
            { text: 'awk', link: '/notes/linux/awk' },
            { text: 'grep', link: '/notes/linux/grep' },
          ]},
          { text: 'Rust', items: [
            { text: 'Rust 基础', link: '/notes/rust/base' },
          ]},
          { text: 'Golang', items: [
            { text: 'Golang 基础', link: '/notes/golang/base' },
          ]},
          { text: '正则表达式', link: '/notes/regex' },
          { text: 'Markdown 示例', link: '/notes/markdown-demo' },
        ]},
      ],
      '/diaries/': [
        { items: [
          { text: '索引页', link: '/diaries/' },
          // 𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵
          { text: '𝟮𝟬𝟮𝟰-𝟬𝟳', items: [
            { text: '𝟮𝟯 遇见 VitePress', link: '/diaries/vitepress-is-awesome' },
          ]},
        ]},
      ],
    },
    logo: {
      src: '/logo.png',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/sunn4room/notes' }
    ],
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档'
          },
          modal: {
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换'
            }
          }
        }
      },
    },
    darkModeSwitchLabel: '外观模式',
    lightModeSwitchTitle: '切换为浅色模式',
    darkModeSwitchTitle: '切换为深色模式',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '返回顶部',
    outline: { level: 'deep', label: '当前页' },
    docFooter: { prev: '上一篇', next: '下一篇' },
  },
  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark',
    },
    container: {
      tipLabel: '提示',
      warningLabel: '警告',
      dangerLabel: '危险',
      infoLabel: '信息',
      detailsLabel: '详情',
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
