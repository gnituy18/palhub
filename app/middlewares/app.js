var path = require('path')
var widgets = ['chat', 'study']

module.exports = function*(next) {
  this.state.app = {
    name: 'PalHub',
    page: this.request.url.substring(1).split(path.sep, 1)[0] || null,
    user: this.session.user
  }
  if (widgets.includes(this.state.app.page)) {
    this.session.lastWidget = this.state.app.page
    this.state.isWidget = true
  }
  yield next
}
