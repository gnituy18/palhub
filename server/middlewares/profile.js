module.exports = async function (ctx, next) {
  if ((ctx.state.page === 'room' || ctx.state.page === 'create') && typeof ctx.session.user.name === 'undefined') {
    ctx.redirect('/profile')
  } else {
    await next()
  }
}

