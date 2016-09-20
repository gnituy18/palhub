var router = require('koa-router')()

router.get('login', '/', function*(next) {
  yield this.render('login', {
    user: this.session.user
  })
})

router.post('/', function*(next) {

  this.checkBody('name').len(1, 5)
  this.checkBody('gender').in(['male', 'female', 'alien'])
  this.checkBody('intro').optional().empty().len(1, 100)

  this.session.user = generateUser(this.request.body)

  if (this.errors) {
    this.session.pass = null
    yield this.render('login', {
      user: this.session.user,
      errors: this.errors
    })
  } else {
    this.session.pass = true
    this.redirect('/chat')
  }
})

function generateUser(requestBody) {
  return {
    name: requestBody.name,
    gender: requestBody.gender,
    intro: requestBody.intro
  }
}

module.exports = router
