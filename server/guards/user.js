const redis = require('../lib/redis')

module.exports.get = function (socketId) {
  return redis.hgetallAsync('user:' + socketId)
}

