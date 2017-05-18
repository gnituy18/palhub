const redis = require('../lib/redis')

module.exports.add = async function (socketId, msg) {
  await redis.rpushAsync('messages', msg)
  return redis.rpushAsync('message-users', socketId)
}

module.exports.getAll = async function () {
  const messages = await redis.lrangeAsync('messages', 0, -1)
  const messageUsers = await redis.lrangeAsync('message-users', 0, -1)
  return messages.map((msg, index) => {
    return {
      'msg': msg,
      'id': messageUsers[index]
    }
  })
}

