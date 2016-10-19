var winston = require('winston')
var path = require('path')

var logger = new(winston.Logger)({
  transports: [
    new(winston.transports.Console)(),
    new(winston.transports.File)({
      filename: path.join(process.env.LOG_ROOT || '', 'chat.log'),
      timestamp: function() {
        return (new Date() + 3600000 * 8).toString().substring(4, 24) //Use momentjs later
      }
    })
  ]
})

module.exports = logger
