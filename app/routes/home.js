var router = require('koa-router')()

  router.get('/', function*(next) {
    yield this.render('home')
  })

module.exports = router
