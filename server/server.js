const Koa = require('koa')
const views = require('koa-views')
const serve = require('koa-static')
const session = require('koa-session')
const path = require('path')
const koaBody = require('koa-body')
const app = require('../app')
const tour = require('../tour')
const login = require('../login')
const auth = require('./middlewares/auth')
const koa = new Koa()

koa.keys = ['hahaha']

koa.use(koaBody())

const CONFIG = {
  'key': 'koa:sess',
  'maxAge': 86400000,
  'overwrite': true,
  'httpOnly': true,
  'signed': true
}

koa.use(session(CONFIG, koa))

koa.use(views(path.join(__dirname, '..'), {'extension': 'pug'}))

koa.use(serve(path.join(__dirname, '../public')))

koa.use(auth)

koa.use(app.routes())
koa.use(tour.routes())
koa.use(login.routes())

module.exports = koa
