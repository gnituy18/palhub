const http = require('http')
const config = require('../config')
const server = require('./server')
const socketio = require('socket.io')


const serverHttp = http.createServer(server.callback())

const io = socketio.listen(serverHttp)

serverHttp.listen(config.port)

io.on('connection', function(socket){
  socket.on('send msg', function(data){
    io.emit('msg', data)
  })
})
