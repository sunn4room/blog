<template lang="pug">
#app
  #header
    img#hero(:src="require('@theme/assets/hero.png')")
    span#title {{ $page.title }}
    SearchBox#search-box
  aside#aside(:class="{asideActive: asideIsActive}")
    VueScroll(ref="aside" @handle-scroll="asideScroll")
      .margin-box
        .white-line
        SunnyRoom
        slot(name="aside")
  #curtain(:class="{asideActive: asideIsActive}" @click="asideIsActive = false")
  #gesture(:class="{asideActive: asideIsActive}" v-swiperight="toggleAside")
  main#main
    VueScroll(ref="main" @handle-scroll="mainScroll")
      .margin-box
        .white-line
        slot(name="main")
  #top-btn.btn(@click="gotoTop" :style="{display: showTopBtn?'inline':'none'}")
    font-awesome-icon(:icon="['fas','arrow-up']" size="lg")
</template>

<script>
import debounce from "@theme/utils/debounce.js"
import SearchBox from '@SearchBox'
import SunnyRoom from "@theme/components/SunnyRoom.vue"

export default {
  components: { SearchBox, SunnyRoom },
  data: () => ({
    asideIsActive: false,
    showTopBtn: false
  }),
  methods: {
    toggleAside: function() {
      this.asideIsActive = !this.asideIsActive;
    },
    gotoTop: function() {
      this.$refs["main"].scrollTo(
        {
          y: 0,
        },
        500,
        "easeInQuad"
      );
    },
    mainScroll: debounce(function(vertical, horizontal, nativeEvent) {
      if (vertical.scrollTop > 400 && !this.showTopBtn) {
        this.showTopBtn = true
      } else if (vertical.scrollTop <= 400 && this.showTopBtn) {
        this.showTopBtn = false
      }
      this.$emit('mainScroll', vertical.scrollTop)
    },500),
    asideScroll: debounce(function(vertical, horizontal, nativeEvent) {
    },500),
    hideSidebar() {
      const w = document.body.clientWidth || document.documentElement.clientWidth
      if (w > 800) return
      this.asideIsActive = false
    },
    setSidebarTop(vertical) {
      let curTop = this.$refs["aside"].getPosition().scrollTop
      let ch = document.body.clientheight || document.documentElement.clientHeight - 58
      let curBottom = curTop + ch
      if (vertical < curTop) {
        this.$refs["aside"].scrollTo(
          {
            y: vertical
          },
          300,
          "easeInQuad"
        );
      } else if (vertical + 30 > curBottom) {
        this.$refs["aside"].scrollTo(
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
#header
  z-index 300
  position fixed
  width 100vw
  height 3.6rem
  background-color #24292e
  #hero
    position fixed
    width 2rem
    height 2rem
    padding 0.8rem
    border-radius 2rem
  #title
    position fixed
    line-height 3.6rem
    left 3.6rem
    color white
    overflow hidden
    max-width calc(100vw - 7.2rem)
    word-break break-all
  #search-box
    float right
    margin-top 12px
    margin-right 10px
    input
      background-color #3f4448
      color #cfd0c8
      border: 1px solid #3f4448
.margin-box
  padding-left 1rem
  padding-right 1rem
  max-width 800px
  margin 0 auto
  box-sizing border-box

#aside
  z-index 200
  position fixed
  width 299px
  height calc(100vh - 3.6rem)
  top 3.6rem
  background-color white
  border-width 0 1px 0 0
  border-style solid
  border-color #e1e4e8
  box-sizing border-box
  transition left 0.3s
  font-size 14px
  #logo
    font-size 1.2rem
#curtain
  z-index 199
  position fixed
  width 100vw
  height 100vh
  background-color #00000000
  display none
#gesture
  z-index 198
  position fixed
  width 30vw
  height 100vh
  display none
#main
  z-index 100
  position fixed
  width calc(100vw - 300px)
  height calc(100vh - 3.6rem)
  top 3.6rem
  left 300px
  box-sizing border-box
  background-color #f6f8fa
  transition left 0.3s
.btn
  z-index 150
  position fixed
  height 2.5rem
  width 2.5rem
  text-align center
  line-height 2.5rem
  font-size 1.2rem
  background-color white
  opacity 0.5
  right 1rem
  cursor pointer
  border-radius 0.25rem
  box-shadow 0 1px 6px 0 rgba(0,0,0,0.2)
#top-btn
  bottom 7.5rem
  top 50vh

.box
  margin-bottom 1rem
  border 1px solid #e1e4e8
  border-radius 6px
  box-sizing border-box
  background-color white
  padding 1rem
  max-width calc(100vw - 300px - 2rem)
.white-line
  color white
  height 1rem

@media (max-width: 900px)
  #aside
    left -300px
    &.asideActive
      left 0px
  #curtain.asideActive
    display inline
    background-color #00000088
  #gesture
    display inline
  #main
    left 0px
    width 100vw
    .box
      max-width calc(100vw - 2rem)
  #aside-btn
    display inline
    &.asideActive
      transform rotate(180deg)
@media (max-width: 719px)
  .search-box input
    left 0rem

</style>
