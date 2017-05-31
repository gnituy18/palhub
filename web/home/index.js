const Router = require('koa-router')
const router = new Router()

router.get('/home', async function (ctx) {
  await ctx.render('home')
})

module.exports = router
