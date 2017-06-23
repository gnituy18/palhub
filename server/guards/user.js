const redis = require('../lib/redis')

module.exports.get = function (socketID) {
  return redis.hgetallAsync('user:' + socketID)
}

module.exports.num = function () {
  return redis.keysAsync('user:*').then(result => {
    console.log(result)
  })
}
