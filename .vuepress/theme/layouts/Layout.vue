<template lang="pug">
GlobalLayout(@mainScroll="mainScroll" ref="global")
  template(v-slot:sidebar)
    div.header-tag(style="font-size:1rem;font-weight:bold;margin-top:1.5rem") {{$page.title}}
    a.header-tag(
      v-for="(h,index) in $page.headers"
      :style="{fontSize: '1rem', marginLeft: (h.level-1)+'rem'}"
      :class="{active: h.slug == curheader, endtag:index == $page.headers.length - 1}"
      :href="'#'+h.slug"
      @click="$refs.global.hideSidebar()"
    ) {{h.title}}
  div.box
    PostTags(@postTagClick="goHomeWithPath" :post="$page")
  div.box
    h1 {{$page.title}}
    Content
  div.box
    PostTags(@postTagClick="goHomeWithPath" :post="$page")
  div.box
    Valine
</template>

<script>
import GlobalLayout from "@theme/components/GlobalLayout.vue";
var debounce = require('lodash.debounce');
import PostTags from "@theme/components/PostTags.vue"
import Valine from "@theme/components/Valine.vue"

export default {
  components: { GlobalLayout, PostTags, Valine },
  data: () => ({
    curheader: ''
  }),
  methods: {
    mainScroll: debounce(function(scrollTop) {
      let hs = this.$page.headers
      if (!hs) return
      let temp = 0
      for (let i = 0; i < hs.length; i++) {
        if (scrollTop < document.getElementById(hs[i].slug).offsetTop) break
        temp = i
      }
      this.curheader = hs[temp].slug
      const tag = document.querySelector('a.header-tag[href="#'+hs[temp].slug+'"]')
      this.$refs.global.setSidebarTop(tag.offsetTop)
    }, 500),
    goHomeWithPath(qp) {
      this.$router.push({ path: '/', query: { qp: qp.join(">>>") }})
    }
  },
  mounted() {
    const cs = document.querySelectorAll('pre[class*="language-"]')
    cs.forEach(c => {
      c.addEventListener("touchstart", function(e) {
        e.stopPropagation()
      })
      c.addEventListener("touchmove", function(e) {
        e.stopPropagation()
      })
      c.addEventListener("touchend", function(e) {
        e.stopPropagation()
      })
    })
  }
};
</script>

<style lang="stylus">
@import '../styles/prism-tmr.css'

h1, h2, h3, h4, h5, h6, p
  margin-block-start: 0em;
  margin-block-end: 0em;
p, blockquote, ul, ol, dl
  margin 0.75rem 0rem
p, ul, ol
  line-height: 1.6em;
h1, h2, h3, h4, h5, h6
  margin-top 2rem
  margin-bottom 0rem
  padding-top 0.3rem
  padding-bottom 0.3rem
h6
  font-size 1.1rem
h5
  font-size 1.2rem
h4
  font-size 1.3rem
h3
  font-size 1.4rem
h2
  font-size 1.5rem
  border-bottom 1px solid #ddd
h1
  margin-top 1rem
  font-size 1.7rem
  text-align center
li > ol, li > ul
  margin: 0 0;
li p.first
  display: inline-block;

ul,
ol
  padding-left: 30px;

ul:first-child,
ol:first-child
  margin-top: 0;

ul:last-child,
ol:last-child
  margin-bottom: 0;

blockquote
  border-left: 4px solid #42b983;
  font-size: 1rem;
  background-color: #ecf8f2;
  color: var(--fg2);
  padding: 0.1rem 1rem;
.dark-mode blockquote
  background-color #287850
a.header-anchor
  font-size: .85em;
  float: left;
  margin-left: -.87em;
  padding-right: .23em;
  margin-top: .125em;
  opacity: 0;

.header-tag
  line-height 1.8rem
  color var(--fg2)
  display block
  &.active
    color #3eaf7c
    font-weight bold
  &:hover
    background-color var(--bg2)
  &.endtag
    margin-bottom 1.5rem
</style>
