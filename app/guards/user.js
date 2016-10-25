var redis = require('../redis')
var logger = require('../logger')

module.exports.pair = function(socketId) {
  return redis.getAsync('hold').then((reply) => {
    if (!reply) {
      redis.set('hold', socketId)
      logger.info('hold: ' + socketId)
      return false
    } else if (socketId != reply) {
      redis.del('hold')
      logger.info('pair' + reply + ' ' + socketId)
      return reply
    }
  })
}

module.exports.cancel = function(socketId) {
  return redis.getAsync('hold').then(reply => {
    if (reply == socketId) {
      redis.del('hold')
      logger.info('cancel: ' + socketId)
      return true
    } else {
      return false
    }
  })
}

module.exports.add = function() {
  return redis.incrAsync('counter').then(reply => reply)
}

module.exports.sub = function() {
  return redis.decrAsync('counter').then(reply => reply)
}
