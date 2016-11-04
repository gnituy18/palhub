var router = require('koa-router')()

router.get('study', '/', function*(next) {
  yield this.render('study')
})

module.exports = router
