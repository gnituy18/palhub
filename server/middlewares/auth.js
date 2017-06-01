const guestPages = [ 'login', 'home' ]

module.exports = async function (ctx, next) {
  if (!ctx.session.logged && !guestPages.includes(ctx.state.page)) {
    ctx.redirect('/login')
  } else {
    await next()
  }
}
