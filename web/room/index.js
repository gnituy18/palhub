const Router = require('koa-router')
const guard = require('../../server/guards')
const router = new Router({'prefix': '/room'})

router.get('room', '/:id', async function (ctx, next) {
  console.log('ooom')
  if (await guard.room.exist(ctx.params.id)) {
    await ctx.render('room', {
      'user': ctx.session.user,
      'room': {'id': ctx.params.id}
    })
  } else {
    await next()
  }
})

module.exports = router
