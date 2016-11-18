var router = require('koa-router')()

router.get('/', function*(next) {
  yield this.render('chat', {
    user: this.session.user
  })
})

module.exports = router
