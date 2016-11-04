var router = require('koa-router')()

router.get('profile', '/', function*(next) {
  yield this.render('profile', {
    user: this.session.user || {
      name: '',
      gender: 'male',
      intro: ''
    }
  })
})

router.post('/', function*(next) {

  this.checkBody('name').len(1, 20, '你的暱稱必須介於1到20個字')
  this.checkBody('gender').in(['male', 'female', 'alien'], '你是誰？')
  this.checkBody('intro').optional().empty().len(1, 300, '你的介紹太長了')

  this.session.user = generateUser(this.request.body)
  this.session.maxAge = 31536000000

  if (this.errors) {
    this.session.pass = null
    yield this.render('profile', {
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
