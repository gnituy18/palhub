var router = require('koa-router')()
var home = require('./home')
var profile = require('./profile')
var widgets = require('./widgets')
var chat = require('./chat')

router.use('/', home.routes())
//router.use('/widgets', widgets.routes())
router.use('/profile', profile.routes())
router.use('/chat', chat.routes())

module.exports = router
