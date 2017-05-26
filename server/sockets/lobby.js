const guard = require('../guards')

module.exports = function (io) {
  io.on('connection', function (socket) {
    socket.join('lobby')
    socket.on('get rooms', async function () {
      const rooms = await guard.room.getAll()
      socket.emit('get rooms', {'rooms': rooms})
    })
  })
}
