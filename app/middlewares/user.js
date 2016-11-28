module.exports = function*(next) {
  if (this.state.isWidget) {
    this.state.user = this.session.user
  }
  yield next
}
