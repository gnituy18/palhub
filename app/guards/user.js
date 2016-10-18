var redis = require('../redis')

module.exports.pair = function(socketId) {
  return redis.getAsync('hold').then((reply) => {
    console.log(reply)
    if (!reply) {
      redis.set('hold', socketId)
      return false
    } else if (socketId != reply) {
      redis.del('hold')
      return reply
    }
  })
}

module.exports.cancel = function(socketId) {
  return redis.getAsync('hold').then(reply => {
    if (reply == socketId) {
      redis.del('hold')
      return true
    } else {
      return false
    }
  })
}
