const Router = require('koa-router')
const router = new Router()

router.get('/tour', async function (ctx) {
  await ctx.render('tour')
})

module.exports = router
