const redis = require('../lib/redis')
const shortid = require('shortid')

module.exports.create = async function (room) {
  const roomId = shortid.generate()
  const roomInfo = [
    'name',
    room.name,
    'id',
    roomId
  ]
  await redis.hmsetAsync('room:' + roomId, roomInfo)
  await redis.lpushAsync('rooms', roomId)
  return roomId
}

module.exports.get = function (roomId) {
  return redis.hgetallAsync('room:' + roomId)
}

module.exports.getAll = async function () {
  const roomIDs = await redis.lrangeAsync('rooms', 0, -1)
  return Promise.all(roomIDs.map(roomID => redis.hgetallAsync('room:' + roomID)))
}

module.exports.getUserNum = function (roomID) {
  return redis.llenAsync('room:' + roomID + ':users')
}

module.exports.destroy = async function (roomID) {
  await redis.lremAsync('rooms', 0, roomID)
  return redis.delAsync('room:' + roomID)
}

module.exports.exist = async function (roomId) {
  const exist = await redis.existsAsync('room:' + roomId)
  return exist
}

module.exports.addUser = async function (socketId, roomId, user) {
  const userInfo = [
    'name',
    user.name,
    'roomId',
    roomId,
    'fbID',
    user.id
  ]
  await redis.hmsetAsync('user:' + socketId, userInfo)
  return redis.rpushAsync('room:' + roomId + ':users', socketId)
}

module.exports.removeUser = async function (socketId) {
  const roomId = await redis.hgetAsync('user:' + socketId, 'roomId')
  await redis.delAsync('user:' + socketId)
  await redis.lremAsync('room:' + roomId + ':users', 0, socketId)
  return roomId
}

module.exports.getUsers = async function (roomId) {
  const userIds = await redis.lrangeAsync('room:' + roomId + ':users', 0, -1)
  const userInfos = await Promise.all(userIds.map(userId => redis.hgetallAsync('user:' + userId)))
  const users = userInfos.map((info, index) => {
    info.id = userIds[index]
    return info
  })
  return users
}

module.exports.addMsg = async function (socketId, msgBody) {
  const user = await redis.hgetallAsync('user:' + socketId)
  await redis.rpushAsync('room:' + user.roomId + ':messages', msgBody)
  return redis.rpushAsync('room:' + user.roomId + ':message-senders', user.fbID)
}

module.exports.getAllMsg = async function (roomID) {
  const messages = await redis.lrangeAsync('room:' + roomID + ':messages', 0, -1)
  const messageUsers = await redis.lrangeAsync('room:' + roomID + ':message-senders', 0, -1)
  return messages.map((msgBody, index) => {
    return {
      'msgBody': msgBody,
      'fbID': messageUsers[index]
    }
  })
}
