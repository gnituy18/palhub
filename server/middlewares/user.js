module.exports = async function (ctx, next) {
  if (ctx.state.page === 'room' && typeof ctx.session.user.name === 'undefined') {
    ctx.redirect('/profile')
  } else {
    await next()
  }
}

