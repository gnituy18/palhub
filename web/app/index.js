const Router = require('koa-router')
const router = new Router()

router.get('/', async function (ctx) {
  await ctx.render('app', {'user': ctx.session.user})
})

module.exports = router
