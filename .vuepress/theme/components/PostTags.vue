<template lang="pug">
div.post-tags
  template(v-if="post.frontmatter.categories")
    span.post-tag
      span(v-for="(ca,index) in post.frontmatter.categories")
        a.ca-tag(
          @click="$emit('postTagClick', ['CATEGORIES', ...post.frontmatter.categories.slice(0,index+1)])" 
          :class="{firstca:index == 0, endcd:index == post.frontmatter.categories.length - 1}"
        ) {{ca}}
        span.ca-tag(v-if="index != post.frontmatter.categories.length - 1")
          font-awesome-icon(:icon="['fa','caret-right']")
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
.ca-tag, .ta-tag, .da-tag, .uda-tag
  font-size 0.9rem
  padding 0.15rem 0.4rem
.da-tag
  color #909399
  background-color #f4f4f5
.uda-tag
  color #67c23a
  background-color #f0f9eb
.ta-tag
  border-radius 0.3rem
  color white
  background-color #67c23a
.ca-tag
  color white
  background-color #409eff
  &.firstca
    border-top-left-radius 0.3rem
    border-bottom-left-radius 0.3rem
  &.endcd
    border-top-right-radius 0.3rem
    border-bottom-right-radius 0.3rem
</style>