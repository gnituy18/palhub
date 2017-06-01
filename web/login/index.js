const Router = require('koa-router')
const router = new Router()
const https = require('https')

router.get('login', '/login', async function (ctx) {
  await ctx.render('login')
})

router.post('/login', async function (ctx) {
  const userID = ctx.request.body.authResponse.userID
  const accessToken = ctx.request.body.authResponse.accessToken
  const getUser = new Promise(resolve => {
    https.get('https://graph.facebook.com/' + userID + '?access_token=' + accessToken, res => {
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
  const user = await getUser
  if (user.error) {
    console.log(user)
    ctx.throw(404, user.error.message)
  } else {
    ctx.session.logged = true
    ctx.session.user = user
    ctx.body = {
      'user': user,
      'intent': ctx.session.intent
    }
  }
})

module.exports = router

