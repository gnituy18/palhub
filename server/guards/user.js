const redis = require('../lib/redis')

module.exports.addUser = async function(socketId, user) {
  var userInfo = [
    'name',
    user.name
  ]
  await redis.hmsetAsync('user:' + socketId, userInfo)
  return redis.rpushAsync('users', socketId)
}

module.exports.getAllUsers = async function() {
  const userIds = await redis.lrangeAsync('users',0 ,-1)
  const userInfos = await Promise.all(userIds.map(userId => redis.hgetallAsync('user:' + userId)))
  const users = userInfos.map((info, index) => {
    info.id = userIds[index]
    return info
  })
  return users
}

module.exports.removeUser = async function(socketId) {
  await redis.delAsync('user:' + socketId)
  return redis.lremAsync('users',0 ,socketId)
}
