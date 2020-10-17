module.exports = (themeConfig, ctx) => {
  return {
    plugins: [
      '@vuepress/register-components',
      ['@vuepress/search', {
        searchMaxSuggestions: 10
      }]
    ]
  }
}
