const redis = require('../lib/redis')

module.exports.join = function (data) {
  return redis.saddAsync('lobby:' + data.FBID, data.socketID)
}

module.exports.num = function () {
  return redis.keysAsync('lobby:*')
  .then(result => result.length)
}

module.exports.remove = function (data) {
  return redis.keysAsync('lobby:*')
  .then(result => {
    const p = result.map(key => redis.sremAsync(key, data.socketID))
    return Promise.all(p)
  })
}
