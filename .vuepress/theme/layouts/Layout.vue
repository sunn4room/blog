<template lang="pug">
GlobalLayout(@mainScroll="mainScroll" ref="global")
  template(#aside)
    div.header-tag(style="font-size:1rem;font-weight:bold;margin-top:1.5rem") {{$page.title}}
    a.header-tag(
      v-for="(h,index) in $page.headers"
      :style="{fontSize: '1rem', marginLeft: (h.level-1)+'rem'}"
      :class="{active: h.slug == curheader, endtag:index == $page.headers.length - 1}"
      :href="'#'+h.slug"
      @click="$refs.global.hideSidebar()"
    ) {{h.title}}
  template(#main)
    div.box
      PostTags(@postTagClick="goHomeWithPath" :post="$page")
    div.box
      h1(style="text-align:center") {{$page.title}}
      Content.markdown-body
    div.box
      PostTags(@postTagClick="goHomeWithPath" :post="$page")
    div.box
      Valine
</template>

<script>
import debounce from "@theme/utils/debounce.js";
import PostTags from "@theme/components/PostTags.vue"
import Valine from "@theme/components/Valine.vue"

export default {
  components: { PostTags, Valine },
  data: () => ({
    curheader: ''
  }),
  methods: {
    mainScroll: debounce(function(scrollTop) {
      let hs = this.$page.headers
      if (!hs) return
      let ch = document.body.clientheight || document.documentElement.clientHeight - 58
      scrollTop += ch * 0.4
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
  },
  beforeMount() {
    let cates = this.$page.relativePath.split("/")
    cates.shift()
    cates.pop()
    this.$page.frontmatter.categories = cates
  }
}
</script>

<style lang="stylus">
@import '../styles/prism.css'
@import '../styles/markdown.css'

.markdown-body {
  box-sizing: border-box;
  min-width: 200px;
  max-width: 980px;
  margin: 0 auto;
  padding: 45px;
}

@media (max-width: 767px) {
  .markdown-body {
    padding: 15px;
  }
}

.content__default > h1
  display none
a.header-anchor
  font-size: .85em;
  float: left;
  margin-left: -.87em;
  padding-right: .23em;
  margin-top: .125em;
  opacity: 0;

.header-tag
  word-wrap: break-word
  word-break: break-all
  line-height 1.8em
  font-size 1em
  color #111
  display block
  &.active
    color #3eaf7c
    font-weight bold
  &:hover
    background-color #eee
  &.endtag
    margin-bottom 1.5rem
</style>