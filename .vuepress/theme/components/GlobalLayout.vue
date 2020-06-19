<!-- themePath/layouts/GlobalLayout.vue -->
<template lang="pug">
div#main(v-swipeleft="swipeleft" v-swiperight="swiperight")
  div#sidebar.box(:class="{active: sidebarActive}" v-clickoutside="hideSidebar")
    vue-scroll(ref="sidebar")
      div#sidebar-content
        div(style="display:flex;justify-content:center;padding-top:1rem")
          SearchBox
        div#hero
          img#hero-img(:src="require('@theme/assets/hero.png')")
          div
            a.hero-str(style="font-size:1.2rem;font-weight:bold" href="/") sunn4room
            a.hero-str(href="/") All is Well
        slot(name="sidebar")
  vue-scroll(ref="main" @handle-scroll="mainScroll")
    div#main-content
      slot
</template>

<script>
import SearchBox from '@SearchBox'
export default {
  components: { SearchBox },
  data: () => ({
    sidebarActive: false,
  }),
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

html
  font-size 16px
  font-family -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale

body
  margin 0px
  padding 0px
  background-color #f7f7f7
  min-height 100vh

code
  font-family: source-code-pro,Menlo,Monaco,Consolas,Courier New,monospace !important;

#main
  height 100vh
  width 100%
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
  background-color white
  overflow auto
  #sidebar-content
    padding 0rem 1rem
    #hero
      padding-top 1rem
      display flex
      // flex-direction column
      align-items center
      background-color white
      // position sticky
      // top 0px
      #hero-img
        height 64px
        width 64px
        border-radius 32px
        margin 1rem 1.5rem
      .hero-str
        margin-bottom 0.5rem
        display: block
.fixed-button
  height 50px
  width 50px
  position fixed
  right 10px
  background-color white
  border 1px solid rgba(0,0,0,0.1)
  opacity 0.7
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
  background-color white

a
  text-decoration none
  color black
  cursor pointer
button
  margin: 0px;
  padding: 0px;
  border: 0px;
  outline: none;
hr
  background-color #eee
  height 1px
  border:none
img
  display block
  margin 1rem auto
  max-width calc(100% - 2rem)
</style>
