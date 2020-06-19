<template lang="pug">
div.post-tags
  template(v-if="post.frontmatter.categories" v-for="(ca,index) in post.frontmatter.categories")
    a.ca-tag(
      @click="$emit('postTagClick', ['CATEGORIES', ...post.frontmatter.categories.slice(0,index+1)])" 
      :class="{firstca:index == 0, endcd:index == post.frontmatter.categories.length - 1}"
    ) {{ca}}
    //- a.ca-div(v-if="index != post.frontmatter.categories.length - 1") &gt;
    font-awesome-icon(
      v-if="index != post.frontmatter.categories.length - 1"
      :icon="['fa','caret-right']"
      style="background-color:#409eff;color:white;height:1.5rem;position:relative;top:0.3rem"
    )
  template(v-if="post.frontmatter.tags" v-for="(tag,index) in post.frontmatter.tags")
    a.ta-tag(@click="$emit('postTagClick', ['TAGS', tag])") {{tag}}
</template>

<script>
export default {
  props: ['post']
}
</script>

<style lang="stylus">
.ca-tag, .ca-div, .ta-tag
  font-size 0.9rem
.ta-tag
  padding 0.15rem 0.4rem
  border-radius 0.3rem
  color white
  background-color #67c23a
  margin-left 0.5rem
.ca-tag, .ca-div
  color white
  background-color #409eff
.ca-div
  padding 0.15rem 0rem
.ca-tag
  padding 0.15rem 0.4rem
  &.firstca
    border-top-left-radius 0.3rem
    border-bottom-left-radius 0.3rem
  &.endcd
    border-top-right-radius 0.3rem
    border-bottom-right-radius 0.3rem
</style>