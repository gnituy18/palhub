const Router = require('koa-router')
const router = new Router()
const User = require('../../../server/models/user')

router.get('/profile', async function (ctx) {
  await ctx.render('profile')
})

router.post('/profile', async function (ctx) {
  if (ctx.request.body.name === '') {
    await ctx.redirect('/profile')
  } else {
    console.log(ctx.state.user)
    const newUser = await User.update(ctx.state.user.id, {'name': ctx.request.body.name})
    ctx.state.user = newUser
    await ctx.redirect(ctx.session.intent)
  }
})

module.exports = router
