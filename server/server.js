const Koa = require('koa')
const views = require('koa-views')
const serve = require('koa-static')
const session = require('koa-session')
const path = require('path')
const koaBody = require('koa-body')
const room = require('../web/room')
const home = require('../web/home')
const lobby = require('../web/lobby')
const login = require('../web/login')
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

koa.use(views(path.join(__dirname, '../web'), {'extension': 'pug'}))

koa.use(serve(path.join(__dirname, '../public')))

koa.use(auth)

koa.use(home.routes())
koa.use(login.routes())
koa.use(lobby.routes())
koa.use(room.routes())

module.exports = koa
