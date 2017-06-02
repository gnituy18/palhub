const guard = require('../guards')

module.exports = function (io) {
  const lobby = io.of('/lobby')
  lobby.on('connection', function (socket) {
    socket.on('get rooms', async function () {
      const rooms = await guard.room.getAll()
      lobby.emit('get rooms', {'rooms': rooms})
    })
  })
}
