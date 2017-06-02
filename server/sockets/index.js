const socketio = require('socket.io')
const room = require('./room')
const lobby = require('./lobby')
const webrtc = require('./webrtc')

module.exports.listen = function (server) {
  io = socketio.listen(server)
  room(io)
  lobby(io)
  webrtc(io)
}
