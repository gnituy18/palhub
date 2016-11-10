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

module.exports.userNum = function(socketId) {
  return redis.scardAsync('users')
}

module.exports.addUser = function(socketId) {
  return redis.saddAsync('users', socketId)
}

module.exports.removeUser = function(socketId) {
  return redis.sremAsync('users', socketId)
}

module.exports.joinTable = function(tableId, socketId) {
  return redis.setAsync('user:' + socketId + ':table', tableId)
}

module.exports.leaveTable = function(socketId) {
  return redis.delAsync('user:' + socketId + ':table')
}

module.exports.getUserTable = function(socketId) {
  return redis.getAsync('user:' + socketId + ':table')
}
