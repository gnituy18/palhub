const path = require('path')

module.exports = async function (ctx, next) {
  ctx.state.page = ctx.url.substring(1).split(path.sep, 1)[0]
  if (ctx.state.page !== 'login' && ctx.state.page !== 'profile') {
    ctx.session.intent = ctx.url
  }
  await next()
}
