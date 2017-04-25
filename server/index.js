const http = require('http')
const config = require('../config')
const server = require('./server')

http.createServer(server.callback()).listen(config.port)
