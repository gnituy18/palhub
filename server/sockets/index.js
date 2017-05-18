const socketio = require('socket.io')
const app = require('./app')

module.exports.listen = function (server) {
  io = socketio.listen(server)
  app(io)
}
