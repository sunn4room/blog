<template lang="pug">
div.post-tags
  template(v-if="post.frontmatter.categories")
    span.post-tag.ca-tag
      span(v-for="(ca,index) in post.frontmatter.categories")
        a(
          @click="$emit('postTagClick', ['CATEGORIES', ...post.frontmatter.categories.slice(0,index+1)])" 
          :class="{firstca:index == 0, endcd:index == post.frontmatter.categories.length - 1}"
          style="color:white"
        ) {{ca}}
        span(v-if="index != post.frontmatter.categories.length - 1")
          font-awesome-icon(:icon="['fa','caret-right']" style="width:1rem")
  template(v-if="post.frontmatter.tags" v-for="(tag,index) in post.frontmatter.tags")
    a.ta-tag.post-tag(@click="$emit('postTagClick', ['TAGS', tag])") {{tag}}
  span.da-tag.post-tag {{$moment(post.frontmatter.date).format('YYYY.MM.DD')}}
  span.uda-tag.post-tag(v-if="post.frontmatter.updated") {{$moment(post.frontmatter.updated).format('YYYY.MM.DD')}}
</template>

<script>
export default {
  props: ['post']
}
</script>

<style lang="stylus">
.post-tags
  display flex
  flex-wrap wrap
  margin-bottom -0.5rem
  .post-tag
    margin-right 0.5rem
    margin-bottom 0.5rem
    display inline-flex
    align-items center
    border-radius 0.3rem
    font-size 0.9rem
    padding 0.15rem 0.4rem
    &.ca-tag
      color white
      background-color #409eff
    &.ta-tag
      color white
      background-color #67c23a
    &.da-tag
      color #909399
      background-color #f4f4f5
    &.uda-tag
      color #67c23a
      background-color #f0f9eb
</style>