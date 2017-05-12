const http = require('http')
const config = require('../config')
const server = require('./server')
const socketio = require('socket.io')
const guard = require('./guards')


const serverHttp = http.createServer(server.callback())

const io = socketio.listen(serverHttp)

serverHttp.listen(config.port)

console.log('server start')

io.on('connection', function (socket) {
  console.log(socket.id)

  socket.on('send msg', function (data) {
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
    io.to(socket.id).emit('get users', {'users': users})
    socket.broadcast.emit('get new user', {'user': users[users.length - 1]})
  })

  socket.on('disconnect', async function () {
    await guard.user.removeUser(socket.id)
    io.emit('remove user', {'id': socket.id})
  })
})
