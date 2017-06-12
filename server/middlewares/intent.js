const intentPages = [ 'create', 'room', 'root' ]

module.exports = async function (ctx, next) {
  if (intentPages.includes(ctx.state.page)) {
    ctx.session.intent = ctx.url
  }
  await next()
}
