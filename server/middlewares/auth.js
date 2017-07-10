const guestPages = [ 'login', 'root' ]
const User = require('../models/user')

module.exports = async function (ctx, next) {
  if (ctx.session.userID === undefined && !guestPages.includes(ctx.state.page)) {
    console.log(ctx.session.userID)
    ctx.redirect('/login')
  } else {
    ctx.state.user = await User.get(ctx.session.userID)
    if (ctx.state.user) {
      ctx.state.user.id = ctx.session.userID
    }
    await next()
  }
}
