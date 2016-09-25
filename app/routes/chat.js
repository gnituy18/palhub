var router = require('koa-router')()

router.get('/', function*(next) {
  console.log(this.session.pass)
  if (!this.session.pass) {
    this.redirect('/login')
    return
  }else if(this.session.status){
    this.body = 'opened'
    return
  }
  yield this.render('chat', {
    user: this.session.user
  })
})

router.get('/status', function*(next) {
  console.log('session now = ' + this.session.status)
  if (this.session.status) {
    this.body = false
    console.log('1. session: false')
  } else {
    this.session.status = true
    console.log('2. session: true')
    this.body = this.session.status
  }
})

router.get('/leave', function*(next) {
  console.log('session now = ' + this.session.status)
  this.session.status = false 
  console.log('session deleted')
})

module.exports = router
