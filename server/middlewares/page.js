const path = require('path')

module.exports = async function (ctx, next) {
  const page = ctx.url.substring(1).split(path.sep, 1)[0]
  ctx.state.page = page === '' ? 'root' : page
  await next()
}
