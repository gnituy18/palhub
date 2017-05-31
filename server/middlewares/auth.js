const path = require('path')
const guestPages = [ 'login', 'home' ]

module.exports = async function (ctx, next) {
  const page = ctx.url.substring(1).split(path.sep, 1)[0]
  if (!ctx.session.logged && !guestPages.includes(page)) {
    ctx.redirect('/login')
  } else if (ctx.session.logged && page === 'login') {
    ctx.redirect('/')
  } else {
    await next()
  }
}
