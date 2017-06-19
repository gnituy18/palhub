const server = require('./server')
const app = require('./app')

const config = Object.assign(server, app)

module.exports = config
