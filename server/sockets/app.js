const guard = require('../guards')

module.exports = function (io) {
  io.on('connection', function (socket) {
    console.log(socket.id)

    socket.on('send msg', function (data) {
      guard.msg.add(socket.id, data.msg)
      io.emit('get msg', {
        'id': socket.id,
        'msg': data.msg
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
      console.log(data)
      io.to(data.id).emit('get candidate', {
        'id': socket.id,
        'candidate': data.candidate
      })
    })

    socket.on('join room', async function (data) {
      await guard.user.addUser(socket.id, data.user)
      const users = await guard.user.getAllUsers()
      const messages = await guard.msg.getAll()
      console.log(messages)
      io.to(socket.id).emit('get messages', messages)
      io.to(socket.id).emit('get users', {'users': users})
      socket.broadcast.emit('get new user', {'user': users[users.length - 1]})
    })

    socket.on('disconnect', async function () {
      await guard.user.removeUser(socket.id)
      io.emit('remove user', {'id': socket.id})
    })
  })
}
