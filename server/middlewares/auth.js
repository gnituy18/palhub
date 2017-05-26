module.exports = async function (ctx, next) {
  console.log(ctx.url)
  if (!ctx.session.logged && ctx.url !== '/login') {
    ctx.redirect('/login')
  } else if (ctx.session.logged && ctx.url === '/login') {
    ctx.redirect('/')
  } else {
    await next()
  }
}
