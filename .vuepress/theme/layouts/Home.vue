<template lang="pug">
GlobalLayout(ref="global")
  template(v-slot:sidebar="props")
    div.tab(style="margin-top:1.5rem") {{$i18n[props.lang].all}}
    Tag.is-all(@tagClick="tagClick" :tag="{name: $i18n[props.lang].all, posts:posts, path:['ALL']}")
    div.tab {{$i18n[props.lang].categories}}
    Tag.is-categories(@tagClick="tagClick" v-for="ca in categories" :tag="ca")
    div.tab {{$i18n[props.lang].tags}}
    Tag.is-tags(@tagClick="tagClick" v-for="(ps,tag) in tags" :tag="{name:tag,posts:ps,path:['TAGS',tag]}")
    div(style="height:1.5rem")
  template(v-slot:default="props")
    div.box
      template(v-for="(p,index) in querypath")
        span(
          style="font-size:0.9rem;cursor: pointer"
          @click="qpClick(index)"
        ) {{index == 0?$i18n[props.lang][p.toLowerCase()]:p}}
        span(v-if="index != querypath.length - 1" style="font-size:0.9rem") &nbsp;&nbsp;&frasl;&nbsp;&nbsp;
    transition-group(name="ps" tag="div" mode="out-in")
      div.box(v-for="(p,index) in postsinpage" :key="p.key+postKeyNum" @click="setActiveIndex(index)")
        PostTags(
          @postTagClick="changeQueryPath" :post="p"
          style="margin-bottom: 0.3rem"
        )
        div
          a.post-title(
            :href="p.path"
            :class="{'pinned-post': p.frontmatter.pin}"
          ) {{p.title}}
          button(
            v-if="p.excerpt"
            style="background-color: var(--bg1); height:1.2rem; width: 1.2rem;margin-left:0.5rem"
          )
            font-awesome-icon(:icon="['fa',index == activeIndex?'angle-down':'angle-right']" size="lg" style="color:var(--blue)")
        Collapse(v-if="p.excerpt")
          div(v-show="index == activeIndex")
            div.post-excerpt(v-html="p.excerpt")
    div.box(style="display:flex;justify-content:center;align-items:center")
      font-awesome-icon.page-button(@click="pagedown" :icon="['fa','angle-left']")
      span.page-info {{p}} / {{Math.ceil(curposts.length / pnum)}}
      font-awesome-icon.page-button(@click="pageup" :icon="['fa','angle-right']")
    div.box
      Valine
</template>

<script>
import GlobalLayout from "@theme/components/GlobalLayout.vue";
import Tag from "@theme/components/Tag.vue"
import PostTags from "@theme/components/PostTags.vue"
import Valine from "@theme/components/Valine.vue"
import Collapse from "@theme/components/Collapse.vue"

export default {
  components: { GlobalLayout, Tag, PostTags, Valine, Collapse },
  data: () => ({
    querypath: [],
    p: 1,
    pnum: 8,
    postKeyNum: 0,
    activeIndex: 0
  }),
  computed: {
    posts() {
      return this.$site.pages
        .filter(page => /^\/posts\//.test(page.path))
        .sort((a, b) => {
          if (a.frontmatter.pin && !b.frontmatter.pin) {
            return -1;
          } else if (!a.frontmatter.pin && b.frontmatter.pin) {
            return 1;
          } else {
            return a.frontmatter.date > b.frontmatter.date ? -1 : 1;
          }
        });
    },
    categories() {
      let categories = [];
      this.posts.forEach(page => {
        let ns = categories;
        let cs = page.relativePath.split("/")
        cs.shift()
        cs.pop()
        page.frontmatter.categories = cs
        let cateindex = 1;
        cs.forEach(category => {
          let f = ns.find(n => n.name == category);
          if (f) {
            f.posts.push(page);
            ns = f.children;
          } else {
            let newnode = {
              name: category,
              children: [],
              posts: [page],
              path: ['CATEGORIES', ...cs.slice(0, cateindex)],
            };
            ns.push(newnode);
            ns = newnode.children;
          }
          cateindex++;
        });
      });
      return categories;
    },
    tags() {
      let tags = {};
      this.posts.forEach(page => {
        if (page.frontmatter.tags) {
          page.frontmatter.tags.forEach(tag => {
            if (tags[tag]) {
              tags[tag].push(page);
            } else {
              tags[tag] = [page];
            }
          });
        }
      });
      return tags;
    },
    curposts() {
      let ps
      if (this.querypath.length == 0) ps = []
      if (this.querypath[0] == "ALL") ps = this.posts
      if (this.querypath[0] == "CATEGORIES") {
        let temp = this.categories
        let ret
        for (let i = 1; i < this.querypath.length; i ++) {
          ret = temp.find(n => n.name == this.querypath[i]);
          temp = ret.children
        }
        ps = ret.posts
      }
      if (this.querypath[0] == "TAGS") ps = this.tags[this.querypath[1]]
      return ps
    },
    postsinpage() {
      let s = (this.p - 1) * this.pnum;
      return this.curposts.slice(s, s + this.pnum);
    },
  },
  methods: {
    setActiveIndex(i) {
      this.activeIndex = i
    },
    tagClick(qp) {
      if (JSON.stringify(qp) == JSON.stringify(this.querypath)) return
      this.querypath = qp;
      this.postKeyNum++
      this.activeIndex = 0
      this.$refs.global.hideSidebar()
    },
    pageup() {
      if (this.p != Math.ceil(this.curposts.length / this.pnum)) {
        this.p++;
        this.postKeyNum++
        this.activeIndex = 0
      }
    },
    pagedown() {
      if (this.p != 1) {
        this.p--;
        this.postKeyNum++
        this.activeIndex = 0
      }
    },
    changeQueryPath(qp) {
      this.querypath = qp
      this.postKeyNum++
      this.activeIndex = 0
    },
    qpClick(index) {
      if (index == 0 || index == this.querypath.length - 1) return
      this.querypath = this.querypath.slice(0, index+1)
      this.postKeyNum++
      this.activeIndex = 0
    }
  },
  mounted() {
    if (this.$route.query.qp) this.querypath = this.$route.query.qp.split(">>>")
    else this.querypath = ["ALL"]
  },
}
</script>

<style lang="stylus">
.tab
  margin-top 1rem
  line-height 1.1rem
  font-size 0.8rem
  border-bottom 1px solid var(--bg3)
  color var(--bg3)
.post-title
  display inline
  font-size 1.1rem
  margin-top 0.5rem
  font-weight bold
  &.pinned-post:after
    content '置顶'
    color white
    background-color #f56c6c
    font-size 0.9rem
    padding 0.15rem 0.4rem
    border-radius 0.3rem
    font-weight normal
    margin-left 0.5rem
.post-excerpt
  font-size 0.9
  margin-top 1rem
  line-height 1.6rem
  color var(--fg2)
  p
    margin-bottom 0rem
.date-tag
  display inline-block
  margin-top 1rem
  font-size 0.8rem
  padding 0.15rem 0.4rem
  background-color #eee
  color #333
.page-button
  height 2rem
  width 2rem !important
  padding 0.4rem
  background-color var(--bg1)
  border 1px solid var(--bg3)
  color var(--fg2)
  border-radius 0.3rem
.page-info
  margin 0px 2rem

.ps-enter-active {
  transition: all 0.5s;
}
.ps-enter, .ps-leave-to {
  opacity: 0;
}

</style>
