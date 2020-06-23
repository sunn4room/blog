<template lang="pug">
div.tag-wrap
  a(@click="tagClick(tag.path)")
    span.tag-name {{tag.name}}
    span.tag-number {{tag.posts.length}}
  template(v-if="tag.children&&tag.children.length != 0")
    button(@click="setShow" style="background-color: var(--bg1); height:1.2rem; width: 1.2rem")
      font-awesome-icon(:icon="['fa',showList?'caret-down':'caret-right']" size="lg" style="color:var(--fg1)")
    div.tag-list(:style="{display: showList?'block':'none'}")
      Tag(@tagClick="tagClick" v-for="t in tag.children" :tag="t")
</template>

<script>
export default {
  name: "Tag",
  data: () => ({
    showList: false
  }),
  props: ['tag'],
  methods: {
    setShow() {
      this.showList = ! this.showList
    },
    tagClick(qp) {
      this.$emit("tagClick", qp)
    }
  }
}
</script>

<style lang="stylus">
.tag-wrap
  margin 0.75rem 0.25rem
  display block
  &.is-tags
    display inline-block !important
    margin 0.75rem 0.25rem 0rem
.tag-list
  margin-left 1rem
.tag-name, .tag-number
  font-size 0.9rem
  padding 0.15rem 0.4rem
.tag-name
  border-radius 0.3rem 0rem 0rem 0.3rem
.tag-number
  border-radius 0rem 0.3rem 0.3rem 0rem
  background-color var(--bg2)
  color var(--fg2)
.is-all .tag-name
  color white
  background-color #909399
.is-categories .tag-name
  color white
  background-color var(--blue)
.is-tags .tag-name
  color white
  background-color var(--green)
</style>