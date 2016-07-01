var router = require('koa-router')()
var root = require('./root')
var login = require('./login')
var widgets = require('./widgets')
var chat = require('./chat')

router.use('/',root.routes())
router.use('/widgets', widgets.routes())
router.use('/login', login.routes())
router.use('/chat', chat.routes())

module.exports = router
