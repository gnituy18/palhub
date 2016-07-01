var router = require('koa-router')()

  router.get('/', function*(next) {
    yield this.render('chat')
  })

module.exports = router
