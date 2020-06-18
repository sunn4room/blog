<template lang="pug">
GlobalLayout(ref="global")
  template(v-slot:sidebar)
    div.tab(style="margin-top:1.5rem") ALL
    Tag.is-all(@tagClick="tagClick" :tag="{name: 'ALL', posts:posts, path:['ALL']}")
    div.tab CATEGORIES
    Tag.is-categories(@tagClick="tagClick" v-for="ca in categories" :tag="ca")
    div.tab TAGS
    Tag.is-tags(@tagClick="tagClick" v-for="(ps,tag) in tags" :tag="{name:tag,posts:ps,path:['TAGS',tag]}")
    div(style="height:1.5rem")
  div.box
    template(v-for="(p,index) in querypath")
      span(style="font-size:0.9rem;cursor: pointer" @click="qpClick(index)") {{p}}
      span(v-if="index != querypath.length - 1" style="font-size:0.9rem") &nbsp;&nbsp;&frasl;&nbsp;&nbsp;
  transition-group(name="ps" tag="div" mode="out-in")
    div.box(v-for="p in postsinpage" :key="p.key")
      PostTags(@postTagClick="changeQueryPath" :post="p")
      a.post-title(:href="p.path") {{p.title}}
      div.post-excerpt(v-if="p.excerpt" v-html="p.excerpt")
      span.date-tag(v-if="p.frontmatter.date")
        span {{$moment(p.frontmatter.date).format('YYYY.MM.DD')}}
        span(v-if="p.frontmatter.updated") &nbsp;&minus;&nbsp;{{$moment(p.frontmatter.updated).format('YYYY.MM.DD')}}
  div.box(style="display:flex;justify-content:center;align-items:center")
    button.page-button(@click="pagedown") &lt;
    span.page-info {{p}} / {{Math.ceil(curposts.length / pnum)}}
    button.page-button(@click="pageup") &gt;
  div.box
    Valine
</template>

<script>
import GlobalLayout from "@theme/components/GlobalLayout.vue";
import Tag from "@theme/components/Tag.vue"
import PostTags from "@theme/components/PostTags.vue"
import Valine from "@theme/components/Valine.vue"

export default {
  components: { GlobalLayout, Tag, PostTags, Valine },
  data: () => ({
    querypath: [],
    p: 1,
    pnum: 8
  }),
  computed: {
    posts() {
      return this.$site.pages
        .filter(page => /^\/posts\//.test(page.regularPath))
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
        if (page.frontmatter.categories) {
          let cateindex = 1;
          page.frontmatter.categories.forEach(category => {
            let f = ns.find(n => n.name == category);
            if (f) {
              f.posts.push(page);
              ns = f.children;
            } else {
              let newnode = {
                name: category,
                children: [],
                posts: [page],
                path: ['CATEGORIES', ...page.frontmatter.categories.slice(0, cateindex)],
              };
              ns.push(newnode);
              ns = newnode.children;
            }
            cateindex++;
          });
        }
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
    tagClick(qp) {
      if (JSON.stringify(qp) == JSON.stringify(this.querypath)) return
      this.querypath = qp;
      this.$refs.global.hideSidebar()
    },
    pageup() {
      if (this.p != Math.ceil(this.curposts.length / this.pnum)) {
        this.p++;
      }
    },
    pagedown() {
      if (this.p != 1) {
        this.p--;
      }
    },
    changeQueryPath(qp) {
      this.querypath = qp
    },
    qpClick(index) {
      if (index == 0 || index == this.querypath.length - 1) return
      this.querypath = this.querypath.slice(0, index+1)
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
  border-bottom 1px solid #ddd
  color #888
.post-title
  display block
  font-size 1.2rem
  margin-top 1rem
  font-weight bold
.post-excerpt
  font-size 0.9
  margin-top 1rem
  line-height 1.6rem
  color #333
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
  width 2rem
  background-color white
  border 1px solid #ddd
  border-radius 0.5rem
.page-info
  margin 0px 2rem

.ps-enter-active {
  transition: all 0.5s;
}
.ps-enter, .ps-leave-to {
  opacity: 0;
}

</style>