const Router = require('koa-router')
const router = new Router()
const User = require('../../server/models/user')
const https = require('https')

router.get('login', '/login', async function (ctx) {
  await ctx.render('login')
})

router.post('/login', async function (ctx) {
  const FBID = ctx.request.body.authResponse.userID
  const accessToken = ctx.request.body.authResponse.accessToken
  const userFB = await new Promise(resolve => {
    https.get('https://graph.facebook.com/' + FBID + '?access_token=' + accessToken, res => {
      let body = ''
      res.on('data', d => {
        body += d
      })
      res.on('end', () => {
        const user = JSON.parse(body)
        resolve(user)
      })
    })
  })

  if (userFB.error) {
    ctx.throw(404, userFB.error.message)
  } else {
    if (await User.get(userFB.id, 'facebook') === null) {
      await User.create({'name': userFB.name}, 'facebook', userFB)
    }
    const user = await User.get(userFB.id, 'facebook')
    ctx.session.userID = user._id
    ctx.body = {'intent': ctx.session.intent}
  }
})

router.post('/logout', function (ctx) {
  if (!ctx.session.userID) {
    ctx.body = {'status': 'fail'}
    return
  }
  ctx.session.userID = null
  ctx.body = {'status': 'success'}
})

module.exports = router
