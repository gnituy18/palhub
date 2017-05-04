const Router = require('koa-router')
const router = new Router()

router.get('login', '/login', async function (ctx) {
  await ctx.render('login')
})

router.post('/login', async function (ctx) {
  ctx.session.name = ctx.request.body.name
  await ctx.redirect('/')
})

module.exports = router

