<template lang="pug">
.shell
  .sh-header
    .dot(style="background-color: #e9524a")
    .dot(style="background-color: #f1ae1b")
    .dot(style="background-color: #59c837")
  .sh-body
    .line
      span >&nbsp;
      span(style="color:#4ebdcf") Who are you?
    .line.right
      span(style="color:#97d209") I'm sunn4room
      span &nbsp;<
    .line.right
      span(style="color:#97d209") em... Just Sunny Room
      span &nbsp;<
    .line.right
      span(style="color:#97d209") And you?
      span.cursor a
      span &nbsp;<
</template>

<style lang="stylus">
.shell
  width 100%
  height 8.6rem
  background-color #1c1c1c
  border-radius 0.5rem
  margin-bottom 1rem
  > .sh-header
    width 100%
    height 2rem
    background-color #3e3e3e
    border-radius 0.5rem 0.5rem 0 0
    box-sizing border-box
    padding-left 10px
    > .dot
      float left
      margin-top 0.6rem
      margin-left 0.2rem
      margin-right 0.2rem
      width 0.8rem
      height 0.8rem
      border-radius 8px
      display inline-block
  > .sh-body
    width 100%
    height 6.6rem
    box-sizing border-box
    padding-top 0.5rem
    padding-bottom 0.5rem
    border-radius 0 0 0.5rem 0.5rem
    > .line
      font-family SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      margin-left 0.2rem
      margin-right 0.2rem
      height 1.4rem
      width calc(100% - 0.4rem)
      color #9fa291
      &.right
        text-align right

.cursor
  color #fec041
  background-color #fec041
  animation blink 1s linear 1s infinite
@keyframes blink {
  0% {
    color: #fec04100;
    background-color: #fec04100;
  }
  50% {
    color: #fec04100;
    background-color: #fec04100;
  }
  51% {
    color: #fec041;
    background-color: #fec041;
  }
  100% {
    color: #fec041;
    background-color: #fec041;
  }
}
</style>
