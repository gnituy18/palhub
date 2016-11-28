module.exports = function*(next) {
  if (this.state.isWidget && !this.session.pass) {
    this.redirect('/profile')
  } else {
    yield next
  }
}
