module.exports = async function (ctx, next) {
  console.log(ctx.url)
  if (ctx.url == '/login' || ctx.session.name) {
    await next()
  } else {
    ctx.redirect('login')
  }
}
