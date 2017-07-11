const Router = require('koa-router')
const guard = require('../../../server/guards')
const router = new Router()

router.get('/create', async function (ctx) {
  await ctx.render('create')
})

router.post('/create', async function (ctx) {
  let typeInfo = {}
  switch (ctx.request.body.type) {
    case 'hourglass':
      typeInfo = {'dueTime': Date.now() + ctx.request.body.min * 60000 + ctx.request.body.hour * 3600000}
  }
  const roomID = await guard.room.create({
    'name': ctx.request.body.name,
    'type': ctx.request.body.type,
    'creator': ctx.state.user.id,
    'typeInfo': typeInfo
  })
  ctx.body = {'id': roomID}
})

module.exports = router

