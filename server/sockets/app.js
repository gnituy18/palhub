const guard = require('../guards')

module.exports = function (io) {
  io.on('connection', function (socket) {
    console.log(socket.id)

    socket.on('send msg', async function (data) {
      guard.room.addMsg(socket.id, data.msgBody)
      const user = await guard.user.get(socket.id)
      io.to(user.roomId).emit('get msg', {
        'fbID': user.fbID,
        'msgBody': data.msgBody
      })
    })

    socket.on('pass offer', function (data) {
      io.to(data.id).emit('get offer', {
        'id': socket.id,
        'offer': data.offer
      })
    })

    socket.on('pass answer', function (data) {
      io.to(data.id).emit('get answer', {
        'id': socket.id,
        'answer': data.answer
      })
    })

    socket.on('setup pc', function (data) {
      io.to(data.id).emit('setup pc', {'id': socket.id})
    })

    socket.on('pass candidate', function (data) {
      io.to(data.id).emit('get candidate', {
        'id': socket.id,
        'candidate': data.candidate
      })
    })

    socket.on('join room', async function (data) {
      await guard.room.addUser(socket.id, data.roomId, data.user)
      const users = await guard.room.getUsers(data.roomId)
      const messages = await guard.room.getAllMsg(data.roomId)
      const rooms = await guard.room.getAll()
      socket.join(data.roomId)
      io.to('lobby').emit('get rooms', {'rooms': rooms})
      io.to(socket.id).emit('get messages', messages)
      io.to(socket.id).emit('get users', {'users': users})
      socket.broadcast.to(data.roomId).emit('get new user', {'user': users[users.length - 1]})
    })

    socket.on('disconnect', async function () {
      const roomID = await guard.room.removeUser(socket.id)
      if (await guard.room.getUserNum(roomID) === 0) {
        await guard.room.destroy(roomID)
        const rooms = await guard.room.getAll()
        io.to('lobby').emit('get rooms', {'rooms': rooms})
      }
      io.to(roomID).emit('remove user', {'id': socket.id})
    })
  })
}
