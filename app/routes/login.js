var router = require('koa-router')()

  router.get('login', '/', function*(next) {
    yield this.render('login')
  })

  router.post('/', function*(next) {
    console.log(this.request.body.name)
    this.session.name = this.request.body.name
    this.redirect('chat')
  })

module.exports = router
