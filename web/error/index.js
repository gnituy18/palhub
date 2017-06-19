const Router = require('koa-router')
const router = new Router()

router.get('*', async function (ctx) {
  ctx.status = 404
  await ctx.render('err/404')
})

module.exports = router
