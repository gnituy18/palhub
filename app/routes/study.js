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
  yield guard.newTable().then(reply => {
    this.redirect('/study/' + reply)
  })
})

router.get('/:id', function*(next) {

  yield guard.getTable(this.params.id).then(reply => {
    if (reply) {
      var fn = pug.compileFile(path.join(__dirname, '../views/study/table.pug'))
      this.body = fn({
        app: this.state.app,
        tableId: this.params.id
      })
    } else {
      this.throw(404)
    }
  })
})

module.exports = router
