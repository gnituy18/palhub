var router = require('koa-router')()

router.get('/', function*(next) {
  console.log(this.session.pass)
  if (!this.session.pass) {
    this.redirect('/login')
    return
  }
  yield this.render('chat', {
    user: this.session.user
  })
})

module.exports = router
