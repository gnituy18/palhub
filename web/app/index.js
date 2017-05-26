const Router = require('koa-router')
const guard = require('../../server/guards')
const router = new Router({'prefix': '/room'})

router.get('room', '/:id', async function (ctx) {
  if (await guard.room.exist(ctx.params.id)) {
    await ctx.render('app', {
      'user': ctx.session.user,
      'room': {'id': ctx.params.id}
    })
  }
})

module.exports = router
