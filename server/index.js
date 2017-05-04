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
    io.emit('msg', data)
  })

  socket.on('join', async function (data) {
    await guard.user.addUser(socket.id, data)
    const users = await guard.user.getAllUsers()
    io.emit('users', {'users': users})
  })

  socket.on('disconnect', async function () {
    await guard.user.removeUser(socket.id)
    const users = await guard.user.getAllUsers()
    io.emit('users', {'users': users})
  })
})
