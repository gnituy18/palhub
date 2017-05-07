const http = require('http')
const config = require('../config')
const server = require('./server')
const socketio = require('socket.io')
const guard = require('./guards')


const serverHttp = http.createServer(server.callback())

const io = socketio.listen(serverHttp)

serverHttp.listen(config.port)

io.on('connection', function (socket) {
  socket.on('send msg', function (data) {
    io.emit('get msg', data)
  })

  socket.on('join room', async function (data) {
    await guard.user.addUser(socket.id, data.user)
    const users = await guard.user.getAllUsers()
    io.to(socket.id).emit('get users', {'users': users})
    socket.broadcast.emit('get new user', {'user': users[users.length - 1]})
  })

  socket.on('disconnect', async function () {
    await guard.user.removeUser(socket.id)
    const users = await guard.user.getAllUsers()
    io.emit('get users', {'users': users})
  })
})
