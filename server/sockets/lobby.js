const guard = require('../guards')

module.exports = function (io) {
  const lobby = io.of('/lobby')
  lobby.on('connection', function (socket) {
    socket.on('join lobby', async function (data) {
      await guard.lobby.join({
        'FBID': data.FBID,
        'socketID': socket.id
      })
      const num = await guard.lobby.num()
      lobby.emit('get user num', {'num': num})
    })

    socket.on('get rooms', async function () {
      const rooms = await guard.room.getAll()
      lobby.emit('get rooms', {'rooms': rooms})
    })

    socket.on('disconnect', async function () {
      await guard.lobby.remove({'socketID': socket.id})
      const num = await guard.lobby.num()
      lobby.emit('get user num', {'num': num})
    })
  })
}
