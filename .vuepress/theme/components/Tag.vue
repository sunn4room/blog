<template lang="pug">
div.tag-wrap
  a(@click="tagClick(tag.path)" style="cursor:pointer")
    span.tag-name {{tag.name}}
    span.tag-number {{tag.posts.length}}
  template(v-if="tag.children&&tag.children.length != 0")
    button.is-father(@click="setShow")
      font-awesome-icon(:icon="['fas',showList?'folder-open':'folder']" size="lg" style="margin-left:10px;color:#3298dc")
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
  font-size 0.8rem
  padding 0.15rem 0.4rem
.tag-name
  border-radius 0.3rem 0rem 0rem 0.3rem
.tag-number
  border-radius 0rem 0.3rem 0.3rem 0rem
  background-color #eeeeee
  color #222222
.is-all .tag-name
  color white
  background-color #363636
.is-categories .tag-name
  color white
  background-color #3298dc
.is-tags .tag-name
  color white
  background-color #48c774
.is-father
  background-color: white;
  height:1.2rem;
  width: 1.2rem;
  border: 0 none;
  outline:none
</style>
