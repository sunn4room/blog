<!-- themePath/layouts/GlobalLayout.vue -->
<template lang="pug">
div#main(
  v-swipeleft="swipeleft"
  v-swiperight="swiperight"
)
  div#sidebar.box(:class="{active: sidebarActive}" v-clickoutside="hideSidebar")
    vue-scroll(ref="sidebar")
      div#sidebar-content
        div(style="display:flex;justify-content:space-between;padding-top:1rem;max-width: calc(300px - 2rem)")
          button.switch-button(@click="switchLang") {{lang == 'zh' ? 'EN' : '中文'}}
          SearchBox
          button.switch-button(@click="switchColor")
            font-awesome-icon(:icon="['far',dark?'sun':'moon']")
        div#hero(style="max-width: calc(300px - 2rem)")
          img#hero-img(:src="require('@theme/assets/hero.png')")
          div
            a.hero-str(style="font-size:1.2rem;font-weight:bold" href="/") sunn4room
            a.hero-str(href="/") All is Well
        slot(name="sidebar" :lang="lang")
  vue-scroll(ref="main" @handle-scroll="mainScroll")
    div#main-content
      slot(:lang="lang")
</template>

<script>
import SearchBox from '@theme/components/SearchBox.vue'
export default {
  components: { SearchBox },
  data: () => ({
    sidebarActive: false,
    lang: 'zh' ,
    dark: false
  }),
  mounted() {
    this.lang = this.$cookies.get('lang') || 'zh'
    this.dark = this.$cookies.isKey('dark') ? (this.$cookies.get('dark') == 'true') : (this.$moment().hour() >= 19 || this.$moment().hour() <= 6)
  },
  watch: {
    dark(val) {
      if (val) {
        document.querySelector("html").classList.add("dark-mode")
      } else {
        document.querySelector("html").classList.remove("dark-mode")
      }
    }
  },
  computed: {
    layout() {
      if (this.$page.path) {
        if (this.$frontmatter.layout) {
          return this.$frontmatter.layout;
        }
        return "Layout";
      }
      return "NotFound";
    },
  },
  methods: {
    swipeleft() {
      const w = document.body.clientWidth || document.documentElement.clientWidth
      if (w > 800) return
      this.sidebarActive = false
    },
    swiperight() {
      const w = document.body.clientWidth || document.documentElement.clientWidth
      if (w > 800) return
      this.sidebarActive = true
    },
    hideSidebar() {
      const w = document.body.clientWidth || document.documentElement.clientWidth
      if (w > 800) return
      this.sidebarActive = false
    },
    mainScroll(vertical, horizontal, nativeEvent) {
      this.$emit('mainScroll', vertical.scrollTop)
    },
    setSidebarTop(vertical) {
      let curTop = this.$refs["sidebar"].getPosition().scrollTop
      const ch = document.body.clientheight || document.documentElement.clientHeight
      let curBottom = curTop + ch
      if (vertical < curTop) {
        this.$refs["sidebar"].scrollTo(
          {
            y: vertical
          },
          300,
          "easeInQuad"
        );
      } else if (vertical + 30 > curBottom) {
        this.$refs["sidebar"].scrollTo(
          {
            y: vertical + 30 - ch
          },
          300,
          "easeInQuad"
        );
      }
    },
    switchLang() {
      if (this.lang == 'zh') this.lang = 'en'
      else this.lang = 'zh'
      this.$cookies.set('lang', this.lang, 60 * 60 * 24 * 7)
    },
    switchColor() {
      this.dark = ! this.dark
      this.$cookies.set('dark', this.dark, 60 * 60)
    }
  },
};
</script>

<style lang="stylus">
// *:not(path):not(g)
//   color: hsla(210,100%,100%,0.9) !important;
//   background: hsla(210,100%,50%,0.5) !important;
//   outline: solid 0.25rem hsla(210,100%,100%,0.5) !important;
//   box-shadow: none !important

*
  box-sizing border-box

:root
  --bg1 white
  --bg2 #f3f3f3
  --bg3 #ccc

  --fg1 black
  --fg2 #333
  --fg3 #777

  --blue #409eff
  --green #67c23a

.dark-mode
  --bg1 #2b2b2b
  --bg2 #333333
  --bg3 #6a6a6a

  --fg1 #cbcbcb
  --fg2 #8f8f8f
  --fg3 #7a7a7a

  --blue #0466c8
  --green #458725

html
  font-size 16px
  font-family -apple-system,SF UI Display,Arial,PingFang SC,Hiragino Sans GB,Microsoft YaHei,WenQuanYi Micro Hei,sans-serif
  // font-family -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale

body
  margin 0px
  padding 0px
  color var(--fg1)
  min-height 100vh

code
  font-family: source-code-pro,Menlo,Monaco,Consolas,Courier New,monospace !important;

#main
  height 100vh
  width 100%
  background-color var(--bg2)
  padding-left 300px
  transition padding-left 0.3s
  #main-content
    max-width 800px
    margin 0px auto
    padding 20px 20px 0px
    .box
      margin-bottom 20px
      border-radius 0.5rem
      padding 1rem
      max-width calc(100vw - 340px)
#sidebar
  z-index 20
  position fixed
  left 0px
  transition left 0.3s
  height 100vh
  width 300px
  background-color var(--bg1)
  overflow auto
  #sidebar-content
    padding 0rem 1rem
    #hero
      padding-top 1rem
      display flex
      align-items center
      #hero-img
        height 64px
        width 64px
        border-radius 32px
        margin 1rem 1.5rem
      .hero-str
        margin-bottom 0.5rem
        display: block
#sidebar-toggler
  display none
  bottom 10px

@media (max-width 800px)
  #main
    padding-left 0px
    #main-content
      padding 10px 10px 0px
      .box
        margin-bottom 10px
        max-width calc(100vw - 20px)
  #sidebar
    left -300px
    &.active
      left 0px
  #sidebar-toggler
    display block

.box
  box-shadow 0 4px 10px rgba(0,0,0,0.05), 0 0 1px rgba(0,0,0,0.1)
  background-color var(--bg1)
  color var(--fg1)
a
  text-decoration none
  color var(--fg1)
  cursor pointer
button
  margin: 0px;
  padding: 0px;
  border: 0px;
  outline: none;
hr
  background-color var(--bg3)
  height 1px
  border:none
img
  display block
  margin 1rem auto
  max-width calc(100% - 2rem)

.switch-button
  width 3rem
  background-color var(--bg1)
  color var(--fg2)
  border-radius 0.3rem
  border 1px solid var(--bg3)
</style>
