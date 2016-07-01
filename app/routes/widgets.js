var router = require('koa-router')()
  router.get('/', function*(next) {
    if (!this.session.name)
      this.redirect('/login')
    yield this.render('widgets')
  })
module.exports = router
