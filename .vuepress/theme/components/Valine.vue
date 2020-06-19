<template lang="pug">
div#vcomments
</template>

<script>
// import Valine from 'valine'
export default {
  mounted() {
    import('valine').then(Module => {
      const Valine = Module.default
      new Valine({
        el:'#vcomments',
        appId: 'RgEG4uacBsy4rGsVQc6EyhzX-gzGzoHsz',// your appId
        appKey: 'dIY9zEboKSS25vfG2mzFAaHs', // your appKey
        meta: ['nick', 'mail'],
        path: this.$page.path
      })
    })
  }
}
</script>
