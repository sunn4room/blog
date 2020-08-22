module.exports = {
  title: "sunn4room",
  permalink: "posts/:year/:month/:day/:slug",
  head: [
    ['link', { rel: 'icon', href: '/favicon.png' }]
  ],
  markdown: {
    extractHeaders: [ 'h2', 'h3', 'h4', 'h5', 'h6' ]
  }
}