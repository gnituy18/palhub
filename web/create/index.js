const Router = require('koa-router')
const guard = require('../../server/guards')
const router = new Router()

router.get('/create', async function (ctx) {
  await ctx.render('create')
})

router.post('/create', async function (ctx) {
  const roomID = await guard.room.create({'name': ctx.request.body.name})
  ctx.body = {'id': roomID}
})

module.exports = router

