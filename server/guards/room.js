const redis = require('../lib/redis')
const shortid = require('shortid')

module.exports.create = async function (room) {
  const roomID = shortid.generate()
  const roomInfo = [
    'name',
    room.name,
    'id',
    roomID,
    'type',
    room.type
  ]
  switch (room.type) {
    case 'hourglass':
      roomInfo.push('dueTime', room.typeInfo.dueTime, 'active', false)
  }
  await redis.hmsetAsync('room:' + roomID, roomInfo)
  await redis.lpushAsync('rooms', roomID)
  return roomID
}

module.exports.get = function (roomID) {
  return redis.hgetallAsync('room:' + roomID)
}

module.exports.update = function (roomID, room) {
  const roomInfo = [
    'name',
    room.name,
    'id',
    roomID,
    'type',
    room.type
  ]
  switch (room.type) {
    case 'hourglass':
      roomInfo.push('time', room.dueTime, 'active', room.active)
  }
  return redis.hmsetAsync('room:' + roomID, roomInfo)
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
  await redis.delAsync('room:' + roomID + ':messages')
  await redis.delAsync('room:' + roomID + ':message-senders')
  await redis.delAsync('room:' + roomID + ':users')
  return redis.delAsync('room:' + roomID)
}

module.exports.exist = function (roomID) {
  return redis.existsAsync('room:' + roomID)
}

module.exports.addUser = async function (socketID, roomID, user) {
  const userInfo = [
    'name',
    user.name,
    'roomID',
    roomID,
    'fbID',
    user.id
  ]
  await redis.hmsetAsync('user:' + socketID, userInfo)
  return redis.rpushAsync('room:' + roomID + ':users', socketID)
}

module.exports.removeUser = async function (socketID) {
  const roomID = await redis.hgetAsync('user:' + socketID, 'roomID')
  await redis.delAsync('user:' + socketID)
  await redis.lremAsync('room:' + roomID + ':users', 0, socketID)
  return roomID
}

module.exports.getUsers = async function (roomID) {
  const userIDs = await redis.lrangeAsync('room:' + roomID + ':users', 0, -1)
  const userInfos = await Promise.all(userIDs.map(userID => redis.hgetallAsync('user:' + userID)))
  const users = userInfos.map((info, index) => {
    info.id = userIDs[index]
    return info
  })
  return users
}

module.exports.addMsg = async function (socketID, msgBody) {
  const user = await redis.hgetallAsync('user:' + socketID)
  console.log(user)
  await redis.rpushAsync('room:' + user.roomID + ':messages', msgBody)
  return redis.rpushAsync('room:' + user.roomID + ':message-senders', user.fbID)
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
