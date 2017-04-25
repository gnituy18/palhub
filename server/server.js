const Koa = require('koa')
const views = require('koa-views')
const serve = require('koa-static')
const path = require('path')
const app = require('../app')
const tour = require('../tour')
const koa = new Koa()

koa.use(views(path.join(__dirname, '..'), {'extension': 'pug'}))

koa.use(serve(path.join(__dirname, '../public')))

koa.use(app.routes())
koa.use(tour.routes())

module.exports = koa
