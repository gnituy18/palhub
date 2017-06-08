const Router = require('koa-router')
const router = new Router()

router.get('/profile', async function (ctx) {
  await ctx.render('profile')
})
router.post('/profile', async function (ctx) {
  ctx.session.user.name = ctx.request.body.name
  await ctx.redirect(ctx.session.intent)
})

module.exports = router
