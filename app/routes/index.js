var router = require('koa-router')()
var home = require('./home')
var profile = require('./profile')
var widgets = require('./widgets')
var chat = require('./chat')
var study = require('./study')

router.use('/', home.routes())
//router.use('/widgets', widgets.routes())
router.use('/profile', profile.routes())
router.use('/chat', chat.routes())
router.use('/study', study.routes())


module.exports = router
