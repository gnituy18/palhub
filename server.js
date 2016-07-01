var app = require('./app')
var socket = require('./app/sockets')
var http = require('http');
var server = http.createServer(app.callback())

socket.listen(server)
server.listen(3000)
