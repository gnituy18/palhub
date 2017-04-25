const Koa = require('koa')
const views = require('koa-views')
const path = require('path')
const tour = require('../tour')
const koa = new Koa()

koa.use(views(path.join(__dirname, '..'), {'extension': 'pug'}))

koa.use(tour.routes())

module.exports = koa
