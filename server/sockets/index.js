const socketio = require('socket.io')
const app = require('./app')
const lobby = require('./lobby')

module.exports.listen = function (server) {
  io = socketio.listen(server)
  app(io)
  lobby(io)
}
