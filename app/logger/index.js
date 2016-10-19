var winston = require('winston')

var logger = new(winston.Logger)({
  transports: [
    new(winston.transports.Console)(),
    new(winston.transports.File)({
      filename: (process.env.LOG_PATH || '') + 'chat.log',
      timestamp: function() {
        return new Date().toLocaleString('zh-TW')
      }
    })
  ]
})

module.exports = logger
