const http = require('http')
const config = require('../config')
const server = require('./server')
const socket = require('./sockets')

const serverHttp = http.createServer(server.callback())
socket.listen(serverHttp)
serverHttp.listen(config.port)

console.log('server start')

