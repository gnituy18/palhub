const Router = require('koa-router')
const guard = require('../../server/guards')
const router = new Router()

router.get('/', async function (ctx) {
  await ctx.render('lobby')
})

router.post('/create', async function (ctx) {
  const roomId = await guard.room.create({'name': ctx.request.body.name})
  ctx.redirect(Router.url('room/:id', roomId))
})

module.exports = router

