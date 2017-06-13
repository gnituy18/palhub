const redis = require('../lib/redis')

module.exports.get = function (socketID) {
  return redis.hgetallAsync('user:' + socketID)
}

