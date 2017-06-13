const guard = require('../guards')

module.exports = function (io) {
  const room = io.of('/room')
  const lobby = io.of('/lobby')

  room.on('connection', function (socket) {
    socket.on('setup pc', function (data) {
      room.to(data.id).emit('setup pc', {
        'id': socket.id,
        'micAllowed': data.micAllowed
      })
    })

    socket.on('send msg', async function (data) {
      guard.room.addMsg(socket.id, data.msgBody)
      const user = await guard.user.get(socket.id)
      room.to(user.roomId).emit('get msg', {
        'fbID': user.fbID,
        'msgBody': data.msgBody
      })
    })

    socket.on('join room', async function (data) {
      await guard.room.addUser(socket.id, data.roomId, data.user)
      const users = await guard.room.getUsers(data.roomId)
      const messages = await guard.room.getAllMsg(data.roomId)
      const rooms = await guard.room.getAll()
      socket.join(data.roomId)
      lobby.emit('get rooms', {'rooms': rooms})
      room.to(socket.id).emit('get messages', messages)
      room.to(socket.id).emit('get users', {'users': users})
      socket.broadcast.to(data.roomId).emit('get new user', {'user': users[users.length - 1]})
    })

    socket.on('disconnect', async function () {
      const roomID = await guard.room.removeUser(socket.id)

      setTimeout(async function () {
        if (await guard.room.getUserNum(roomID) === 0) {
          await guard.room.destroy(roomID)
          const rooms = await guard.room.getAll()
          lobby.emit('get rooms', {'rooms': rooms})
        }
      }, 2000)
      room.to(roomID).emit('remove user', {'id': socket.id})
    })
  })
}
