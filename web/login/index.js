const Router = require('koa-router')
const router = new Router()
const https = require('https')

router.get('login', '/login', async function (ctx) {
  await ctx.render('login')
})

router.post('/login', async function (ctx) {
  const FBID = ctx.request.body.authResponse.userID
  const accessToken = ctx.request.body.authResponse.accessToken
  const user = await new Promise(resolve => {
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
  if (user.error) {
    ctx.throw(404, user.error.message)
  } else {
    ctx.session.logged = true
    ctx.session.user = {'FBID': user.id}
    ctx.body = {'intent': ctx.session.intent}
  }
})

module.exports = router

