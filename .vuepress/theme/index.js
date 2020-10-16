module.exports = (themeConfig, ctx) => {
  return {
    plugins: [
      '@vuepress/register-components',
      ['@vuepress/search', {
        searchMaxSuggestions: 10
      }],
      ['@vuepress/medium-zoom', {
        selector: '.content__default img',
        options: {
          margin: 16,
          background: '#eee'
        }
      }]
    ]
  }
}
