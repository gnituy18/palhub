var koa = require('koa')()
var logger = require('koa-logger')
var views = require('koa-views')
var onerror = require('koa-onerror')
var serve = require('koa-static')
var path = require('path')
var session = require('koa-session')
var bodyParser = require('koa-bodyparser')
var router = require('./routes')
var enforceHttps = require('koa-sslify')
var app = require('./middlewares/app')
var auth = require('./middlewares/auth')
var user = require('./middlewares/user')

koa.use(enforceHttps())

require('koa-validate')(koa)

koa.use(views(__dirname + '/views', {
  extension: 'pug'
}))

koa.use(logger())
onerror(koa)

koa.use(serve(path.join(__dirname, '../public')))

koa.keys = ['haha']
koa.use(session(koa))

koa.use(bodyParser())

koa.use(app)
koa.use(auth)
koa.use(user)

koa.use(router.routes())
koa.use(router.allowedMethods())

module.exports = koa
