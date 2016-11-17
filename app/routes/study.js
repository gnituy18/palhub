var router = require('koa-router')()
var guard = require('./../guards/study')
var pug = require('pug')
var path = require('path')

router.get('study', '/', function*(next) {
  yield this.render('study')
})

router.get('/create', function*(next) {
  yield this.render('study/create')
})

router.post('/create', function*(next) {
  this.checkBody('subject').len(1, 20, '你的科目必須介於1到20個字')
  if (this.errors) {
    yield this.render('study/create', {
      errors: this.errors
    })
  } else {
    yield guard.newTable(this.request.body).then(reply => {
      this.redirect('/study/' + reply)
    })
  }
})

router.get('/:id', function*(next) {

  yield guard.getTable(this.params.id)
    .then(reply => {
      var fn = pug.compileFile(path.join(__dirname, '../views/study/table.pug'))
      this.body = fn({
        app: this.state.app,
        tableInfo: {
          id: this.params.id,
          subject: reply
        }
      })
    })
    .catch(err => {
      console.log(err)
      this.throw(404)
    })
})

module.exports = router
