var app = require('koa')()
var logger = require('koa-logger')
var views = require('koa-views')
var onerror = require('koa-onerror')
var serve = require('koa-static')
var path = require('path')
var session = require('koa-session')
var bodyParser = require('koa-bodyparser')
var router = require('./routes')
var enforceHttps = require('koa-sslify')

var widgets = ['chat', 'study']

app.use(function*(next) {
  this.state.app = {
    name: 'PalHub',
    page: this.request.url.substring(1).split(path.sep, 1)[0] || null
  }
  yield next
})

app.use(enforceHttps())

require('koa-validate')(app)

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

app.use(logger())
onerror(app)

app.use(serve(path.join(__dirname, '../public')))

app.keys = ['haha']
app.use(session(app))

app.use(bodyParser())

app.use(function*(next) {
  if (widgets.includes(this.state.app.page)) {
    this.session.lastWidget = this.state.app.page
    this.state.isWidget = true
  }
  yield next
})

app.use(function*(next) {
  if (this.state.isWidget && !this.session.pass) {
    this.redirect('/profile')
  } else {
    yield next
  }
})

app.use(router.routes())
app.use(router.allowedMethods())

module.exports = app
