var socketio = require('socket.io')

module.exports.listen = function(app) {
  io = socketio.listen.listen(app)
  require('./webrtc')(io)
  return io
}
