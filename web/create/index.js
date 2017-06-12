const Router = require('koa-router')
const router = new Router()

router.get('/create', async function (ctx) {
  await ctx.render('create')
})

module.exports = router

