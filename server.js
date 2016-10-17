var app = require('./app')
var socket = require('./app/sockets')
var https = require('https')
var http = require('http')
var fs = require('fs')
var options = {
  key: fs.readFileSync('palhub-key.pem'),
  cert: fs.readFileSync('palhub-cert.pem')
}

var serverHttp = http.createServer(app.callback())
var serverHttps = https.createServer(options, app.callback())

socket.listen(serverHttp)
socket.listen(serverHttps)

serverHttp.listen(process.env.HTTPPORT || 80)
serverHttps.listen(process.env.HTTPSPORT || 443)
