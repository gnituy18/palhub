const Router = require('koa-router')
const guard = require('../../server/guards')
const User = require('../../server/models/user')
const router = new Router({'prefix': '/room'})

router.get('room', '/:id', async function (ctx, next) {
  if (await guard.room.exist(ctx.params.id)) {
    const room = await guard.room.get(ctx.params.id)
    const user = User.get(ctx.session.userID)
    await ctx.render('room', {
      'user': user,
      'room': room
    })
  } else {
    await next()
  }
})

module.exports = router
