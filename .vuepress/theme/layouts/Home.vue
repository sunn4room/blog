<template lang="pug">
GlobalLayout(ref="global")
  template(#aside)
    p.mark 全部
    Tag.is-all(@tagClick="tagClick" :tag="{name: '全部', posts:posts, path:['全部']}")
    hr.boundary
    p.mark 分类
    Tag.is-categories(@tagClick="tagClick" v-for="ca in categories" :tag="ca")
    hr.boundary
    p.mark(style="margin-bottom:0px") 标签
    Tag.is-tags(@tagClick="tagClick" v-for="(ps,tag) in tags" :tag="{name:tag,posts:ps,path:['标签',tag]}")
    .white-line
  template(#main)
    div.box
      template(v-for="(p,index) in querypath")
        span(
          style="font-size:0.9rem;cursor: pointer"
        ) {{ p }}
        span(v-if="index != querypath.length - 1" style="font-size:0.9rem") &nbsp;&nbsp;&frasl;&nbsp;&nbsp;
    div.box(style="display:flex;justify-content:center;align-items:center")
      font-awesome-icon.page-button(@click="pagedown" :icon="['fa','angle-left']" size="sm")
      span.page-info {{p}} / {{Math.ceil(curposts.length / pnum)}}
      font-awesome-icon.page-button(@click="pageup" :icon="['fa','angle-right']")
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
            font-awesome-icon(:icon="['fa',index == activeIndex?'angle-down':'angle-right']" size="lg")
        Collapse(v-if="p.excerpt")
          div(v-show="index == activeIndex")
            div.post-excerpt(v-html="p.excerpt")
    div.box(style="display:flex;justify-content:center;align-items:center")
      font-awesome-icon.page-button(@click="pagedown" :icon="['fa','angle-left']" size="sm")
      span.page-info {{p}} / {{Math.ceil(curposts.length / pnum)}}
      font-awesome-icon.page-button(@click="pageup" :icon="['fa','angle-right']")
    div.box
      Valine
</template>

<script>
import Tag from "@theme/components/Tag.vue"
import PostTags from "@theme/components/PostTags.vue"
import Collapse from "@theme/components/Collapse.vue"
import Valine from "@theme/components/Valine"

export default {
  components: {Tag, PostTags, Collapse, Valine},
  data: () => ({
    querypath: [],
    p: 1,
    pnum: 10,
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
              path: ['分类', ...cs.slice(0, cateindex)],
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
      if (this.querypath[0] == "全部") ps = this.posts
      if (this.querypath[0] == "分类") {
        let temp = this.categories
        let ret
        for (let i = 1; i < this.querypath.length; i ++) {
          ret = temp.find(n => n.name == this.querypath[i]);
          temp = ret.children
        }
        ps = ret.posts
      }
      if (this.querypath[0] == "标签") ps = this.tags[this.querypath[1]]
      return ps
    },
    postsinpage() {
      let s = (this.p - 1) * this.pnum;
      return this.curposts.slice(s, s + this.pnum);
    },
  },
  mounted() {
    if (this.$route.query.qp) this.querypath = this.$route.query.qp.split(">>>")
    else this.querypath = ["全部"]
  },
  methods: {
    setActiveIndex(i) {
      this.activeIndex = i
    },
    tagClick(qp) {
      if (JSON.stringify(qp) == JSON.stringify(this.querypath)) return
      this.querypath = qp;
      this.p = 1
      this.activeIndex = 0
      this.postKeyNum++
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
      this.p = 1
      this.activeIndex = 0
      this.postKeyNum++
    },
    qpClick(index) {
      if (index == 0 || index == this.querypath.length - 1) return
      this.querypath = this.querypath.slice(0, index+1)
      this.postKeyNum++
      this.activeIndex = 0
    }
  }
}
</script>

<style lang="stylus">
.boundary
  background-color: #eee;
  border: 0 none;
  height: 1px;
.mark
  font-weight 600
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
  color #111
  p
    margin-bottom 0rem
  h1
    display none
.date-tag
  display inline-block
  margin-top 1rem
  font-size 0.8rem
  padding 0.15rem 0.4rem
  background-color #eee
  color #333
.page-button
  height 1.4rem
  width 1.4rem !important
  padding 0.4rem
  background-color white
  border 1px solid #e1e4e8
  color #111
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
