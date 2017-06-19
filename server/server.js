const Koa = require('koa')
const views = require('koa-views')
const serve = require('koa-static')
const session = require('koa-session')
const path = require('path')
const koaBody = require('koa-body')
const room = require('../web/room')
const lobby = require('../web/lobby')
const login = require('../web/login')
const create = require('../web/create')
const profile = require('../web/profile')
const err = require('../web/error')
const page = require('./middlewares/page')
const authCheck = require('./middlewares/auth')
const intent = require('./middlewares/intent')
const profileCheck = require('./middlewares/profile')
const koa = new Koa()

koa.keys = ['hahaha']

koa.use(koaBody())

const CONFIG = {
  'key': 'koa:sess',
  'maxAge': 31536000000,
  'overwrite': true,
  'httpOnly': true,
  'signed': true
}

koa.use(session(CONFIG, koa))

koa.use(views(path.join(__dirname, '../web'), {'extension': 'pug'}))

koa.use(serve(path.join(__dirname, '../public')))

koa.use(page)
koa.use(authCheck)
koa.use(intent)
koa.use(profileCheck)

//koa.use(home.routes())
koa.use(login.routes())
koa.use(lobby.routes())
koa.use(room.routes())
koa.use(create.routes())
koa.use(profile.routes())
koa.use(err.routes())

module.exports = koa
