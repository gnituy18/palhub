const Router = require('koa-router')
const guard = require('../../server/guards')
const router = new Router({'prefix': '/room'})

router.get('room', '/:id', async function (ctx, next) {
  if (await guard.room.exist(ctx.params.id)) {
    const room = await guard.room.get(ctx.params.id)
    await ctx.render('room', {'room': room})
  } else {
    await next()
  }
})

module.exports = router
