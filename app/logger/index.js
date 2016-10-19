var winston = require('winston')
var path = require('path')

var logger = new(winston.Logger)({
  transports: [
    new(winston.transports.Console)(),
    new(winston.transports.File)({
      filename: path.join(process.env.LOG_ROOT || '', 'chat.log'),
      timestamp: function() {
        return new Date().toLocaleString('zh-TW')
      }
    })
  ]
})

module.exports = logger
