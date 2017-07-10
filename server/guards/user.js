const redis = require('../lib/redis')

module.exports.get = function (userID) {
  return redis.hgetallAsync('user:' + userID)
}

module.exports.getIdBySocketId = function (socketID) {
  return redis.getAsync('socketID:' + socketID)
}

module.exports.setSocketId = function (userID, socketID) {
  return redis.setAsync('socketID:' + socketID, userID)
}

module.exports.deleteSocketId = function (socketID) {
  return redis.delAsync('socketID:' + socketID)
}

module.exports.num = function () {
  return redis.keysAsync('user:*')
}
