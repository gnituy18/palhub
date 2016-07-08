var router = require('koa-router')()
var home = require('./home')
var login = require('./login')
var widgets = require('./widgets')
var chat = require('./chat')

router.use('/', home.routes())
router.use('/widgets', widgets.routes())
router.use('/login', login.routes())
router.use('/chat', chat.routes())

module.exports = router
