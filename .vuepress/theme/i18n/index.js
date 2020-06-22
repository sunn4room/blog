let ctx = require.context('.', false, /.js$/)
let ept = {}

ctx.keys().forEach(k => {
  if (k === './index.js') return
  ept[k.substring(2, k.length - 3)] = ctx(k).default
})

export default ept