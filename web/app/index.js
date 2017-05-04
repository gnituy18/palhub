const Router = require('koa-router')
const router = new Router()

router.get('/', async function (ctx) {
  await ctx.render('app', {'name': ctx.session.name})
})

module.exports = router
